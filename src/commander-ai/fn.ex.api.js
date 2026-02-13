"use strict";

const Ec = require("../epic");
const fs = require("fs");
const path = require("path");
const Ut = require("../commander-shared");
const yaml = require("js-yaml");
const inquirer = require("inquirer");
const { v4: uuidv4 } = require("uuid");

const CONFIG_PATH = ".r2mo/task/command/ex-api.yaml";
const REQUIRED_ENV_DB = ["Z_DB_TYPE", "Z_DB_HOST", "Z_DB_PORT", "Z_DBS_INSTANCE", "Z_DB_APP_USER", "Z_DB_APP_PASS"];
const REQUIRED_ENV_APP = ["Z_APP_ID", "Z_TENANT", "Z_SIGMA"];
const R2_BY_UUID = "9a0d5018-33ad-4c64-80bf-8ae7947c482f";

/** 全局列（开发时按 RBAC Flyway 建表固定，执行时仅 DML，不查元数据）：S_RESOURCE/S_ACTION/S_PERMISSION 写入，Excel 不写入 */
const GLOBAL_COLUMNS = [
    { name: "SIGMA", value: () => process.env.Z_SIGMA || "" },
    { name: "APP_ID", value: () => process.env.Z_APP_ID || "" },
    { name: "TENANT_ID", value: () => process.env.Z_TENANT || "" },
    { name: "CREATED_BY", value: () => R2_BY_UUID },
    { name: "UPDATED_BY", value: () => R2_BY_UUID },
    { name: "CREATED_AT", value: () => new Date().toISOString().slice(0, 19).replace("T", " ") },
    { name: "UPDATED_AT", value: () => new Date().toISOString().slice(0, 19).replace("T", " ") }
];

function getGlobalColsAndVals() {
    const cols = GLOBAL_COLUMNS.map((c) => c.name);
    const vals = GLOBAL_COLUMNS.map((c) => c.value());
    return { cols, vals };
}

/**
 * 扫描 sheet 中所有 {TABLE} 区域：某行首格为 "{TABLE}" 则开启一个表，下一格为表名；紧跟 2 行为表头（中文、英文），之后为数据区；下一处 {TABLE} 或 sheet 末为数据区结束。
 * 返回 [{ tableName, tableStartRow, dataStartRow, dataEndRow, columnNames: [name], columnIndex: { name: colNum } }, ...]
 */
function scanTableRegions(ws, maxScanRows) {
    if (!ws) return [];
    const regions = [];
    const limit = maxScanRows || 5000;
    let i = 1;
    while (i <= limit) {
        const row = ws.getRow(i);
        const first = row.getCell(1).value;
        const v = first != null ? String(first).trim() : "";
        if (v === "{TABLE}") {
            const tableNameCell = row.getCell(2).value;
            const tableName = tableNameCell != null ? String(tableNameCell).trim() : "";
            const headerRowCount = 2;
            const dataStartRow = i + 1 + headerRowCount;
            let dataEndRow = dataStartRow - 1;
            let j = i + 1;
            while (j <= limit) {
                const nextRow = ws.getRow(j);
                const nextFirst = nextRow.getCell(1).value;
                const nv = nextFirst != null ? String(nextFirst).trim() : "";
                if (nv === "{TABLE}") {
                    dataEndRow = j - 1;
                    break;
                }
                dataEndRow = j;
                j++;
            }
            const enHeaderRow = ws.getRow(i + 2);
            const columnNames = [];
            const columnIndex = {};
            enHeaderRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const val = cell && cell.value != null ? String(cell.value).trim() : "";
                if (val) {
                    columnNames.push(val);
                    columnIndex[val] = colNumber;
                }
            });
            regions.push({
                tableName,
                tableStartRow: i,
                dataStartRow,
                dataEndRow,
                columnNames,
                columnIndex
            });
            i = dataEndRow + 1;
            continue;
        }
        i++;
    }
    return regions;
}

/** 在指定 TABLE 区域内找最后一行有数据的行号（按首列非空判断），返回下一行用于追加；若无则返回 dataStartRow */
function findAppendRowInRegion(ws, dataStartRow, dataEndRow) {
    let last = dataStartRow - 1;
    for (let r = dataStartRow; r <= dataEndRow; r++) {
        const cell = ws.getRow(r).getCell(1).value;
        if (cell != null && String(cell).trim() !== "") last = r;
    }
    return last + 1;
}

/** 将 uri 转为文件名安全片段：/ -> -，去首尾 -，长度限制 */
function uriToFileNameSlug(uri) {
    if (!uri || !String(uri).trim()) return "default";
    return String(uri)
        .trim()
        .replace(/\//g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 120);
}

/** 无 target 时解析到 -api 项目目录（当前为父目录时取 xxx-api，已在 -api 内则用 cwd） */
function resolveExcelRoot(cwd, target) {
    if (target && target.root && target.module) {
        const zeroModule = process.env.ZERO_MODULE;
        return path.resolve(zeroModule, `zero-exmodule-${target.module}`);
    }
    const artifactId = getArtifactIdFromPom(cwd);
    const apiDir = artifactId ? path.resolve(cwd, artifactId + "-api") : null;
    if (apiDir && fs.existsSync(apiDir)) return apiDir;
    return cwd;
}

function getArtifactIdFromPom(cwd) {
    const pomPath = path.resolve(cwd, "pom.xml");
    if (!fs.existsSync(pomPath)) return null;
    let content = fs.readFileSync(pomPath, "utf-8");
    content = content.replace(/<parent>[\s\S]*?<\/parent>/i, "");
    const m = content.match(/<artifactId>([^<]+)<\/artifactId>/);
    return m ? m[1].trim() : null;
}

function loadAppEnv(filePath) {
    if (!fs.existsSync(filePath)) return false;
    const content = fs.readFileSync(filePath, "utf-8");
    content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || !trimmed.startsWith("export ")) return;
        const match = trimmed.match(/^export\s+([A-Za-z0-9_]+)=["']?([^"'\n]*)["']?/);
        if (match) process.env[match[1]] = match[2].trim();
    });
    return true;
}

function resolveAppEnvPath(cwd) {
    const primary = path.resolve(cwd, ".r2mo", "app.env");
    if (fs.existsSync(primary)) return primary;
    let artifactId = getArtifactIdFromPom(cwd);
    if (!artifactId) artifactId = path.basename(cwd);
    if (artifactId && artifactId !== ".") {
        const apiDir = `${artifactId}-api`;
        const nested = path.resolve(cwd, apiDir, ".r2mo", "app.env");
        if (fs.existsSync(nested)) return nested;
        const sibling = path.resolve(cwd, "..", apiDir, ".r2mo", "app.env");
        if (fs.existsSync(sibling)) return sibling;
    }
    return null;
}

function checkEnv(keys, label) {
    const missing = keys.filter((k) => !process.env[k] || !String(process.env[k]).trim());
    if (missing.length > 0) {
        Ec.error(`${label}：以下环境变量必须全部已设置。`);
        Ec.info("当前缺失：" + missing.join(", "));
        process.exit(1);
    }
}

function isDpaRoot(dir) {
    const pom = path.join(dir, "pom.xml");
    if (!fs.existsSync(pom)) return false;
    const id = getArtifactIdFromPom(dir);
    if (!id) return false;
    const apiDir = path.join(dir, `${id}-api`);
    const domainDir = path.join(dir, `${id}-domain`);
    return fs.existsSync(apiDir) && fs.existsSync(domainDir);
}

module.exports = async (options) => {
    const cwd = process.cwd();

    // 1. 前置：配置文件必须存在；缺失时在配置路径中写入模板
    const configFullPath = path.resolve(cwd, CONFIG_PATH);
    if (!fs.existsSync(configFullPath)) {
        const configDir = path.dirname(configFullPath);
        if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
        const template = `# ai ex-api 使用此配置，请按项目修改
# 参数格式：-r "<METHOD> <uri>"  uri 必须以 /api 为前缀
metadata:
  identifier: "核心标识符"
  brief: "接口描述"
  resource: "resource.ambient"
  level: 1
  ptype: "权限集 S_PERM_SET 类型"
  pname: "权限集 S_PERM_SET 名称"
  # keyword 可选；若存在则编码为 res.\${keyword} / act.\${keyword} / perm.\${keyword}，否则按规则计算
  # keyword: "app.test.data"
# target 可选；存在时需配置 ZERO_MODULE 且 DPA 目录 zero-exmodule-{module} 存在
# target:
#   root: "ZERO_MODULE"
#   module: "ambient"
`;
        fs.writeFileSync(configFullPath, template, "utf-8");
        Ec.info("配置文件缺失，已在下列路径写入模板：" + configFullPath);
        Ec.info("请编辑后重新执行。参数格式：  -r \"<METHOD> <uri>\"  （uri 必须以 /api 为前缀）");
        Ec.info("示例：  ai ex-api -r \"GET /api/ambient\"");
        process.exit(1);
    }

    // 2. 环境变量：先加载 app.env 再检查
    const appEnvPath = resolveAppEnvPath(cwd);
    if (!appEnvPath) {
        Ec.error(".r2mo/app.env 不存在；DPA 下也未找到 {id}-api/.r2mo/app.env");
        process.exit(1);
    }
    loadAppEnv(appEnvPath);
    Ec.info("已加载环境变量：" + appEnvPath);
    checkEnv(REQUIRED_ENV_DB, "数据库环境变量");
    checkEnv(REQUIRED_ENV_APP, "应用环境变量（Z_APP_ID / Z_TENANT / Z_SIGMA）");

    // 3. 解析 ex-api.yaml（不校验格式）
    let config;
    try {
        config = yaml.load(fs.readFileSync(configFullPath, "utf-8"));
    } catch (e) {
        Ec.error("ex-api.yaml 解析失败：" + e.message);
        process.exit(1);
    }
    if (!config || !config.metadata) {
        Ec.error("ex-api.yaml 需包含 metadata 节点");
        process.exit(1);
    }

    const metadata = config.metadata;
    const target = config.target;
    if (target && target.root && target.module) {
        const zeroModule = process.env.ZERO_MODULE;
        if (!zeroModule || !zeroModule.trim()) {
            Ec.error("存在 target 配置时，环境变量 ZERO_MODULE 必须已设置");
            process.exit(1);
        }
        const dpaRoot = path.resolve(zeroModule, `zero-exmodule-${target.module}`);
        if (!fs.existsSync(dpaRoot) || !isDpaRoot(dpaRoot)) {
            Ec.error(`ZERO_MODULE 下 DPA 目录不是标准架构：${dpaRoot}`);
            Ec.info("需存在 pom.xml 且包含 xxx-api、xxx-domain 子目录");
            process.exit(1);
        }
    }

    // 4. 参数：-r "<METHOD> <uri>" ，-s 可选
    const parsed = Ut.parseArgument(options);
    const skip = parsed.skip === true || process.argv.includes("-s") || process.argv.includes("--skip");
    let method = "";
    let uri = "";
    const requestRaw = parsed.request;
    if (requestRaw && String(requestRaw).trim()) {
        const parts = String(requestRaw).trim().split(/\s+/);
        if (parts.length >= 2) {
            method = parts[0].toUpperCase();
            uri = parts.slice(1).join(" ").trim();
        } else if (parts.length === 1) {
            Ec.error("参数 -r 格式应为 \"<METHOD> <uri>\"，例如 \"GET /api/ambient\"");
            process.exit(1);
        }
    }
    if (!skip && (!method || !uri)) {
        Ec.error("缺少必需参数：请求方法与 URI");
        Ec.info("参数格式：  -r \"<METHOD> <uri>\"  或  --request \"<METHOD> <uri>\"");
        Ec.info("示例：  ai ex-api -r \"GET /api/ambient\"（uri 必须以 /api 为前缀）");
        process.exit(1);
    }
    if (!skip && uri && !uri.trim().startsWith("/api")) {
        Ec.error("参数 uri 必须以 /api 为前缀。");
        Ec.info("当前 uri：" + (uri || ""));
        Ec.info("示例：  ai ex-api -r \"GET /api/ambient\"");
        process.exit(1);
    }

    Ec.execute("ai ex-api：配置已加载，环境与参数检查通过。");

    const dbConfig = {
        host: process.env.Z_DB_HOST || "localhost",
        port: parseInt(process.env.Z_DB_PORT || "3306", 10),
        user: process.env.Z_DB_APP_USER,
        password: process.env.Z_DB_APP_PASS,
        database: process.env.Z_DBS_INSTANCE
    };

    const mysql = require("mysql2/promise");
    Ec.info("[ex-api] 配置：" + CONFIG_PATH + " | request=" + (requestRaw || "") + " | skip=" + skip);
    let conn = await mysql.createConnection(dbConfig);
    Ec.info("[ex-api] 数据库已连接：" + (dbConfig.database || "") + " @" + (dbConfig.host || "") + ":" + (dbConfig.port || ""));

    // 约定：执行时数据表已存在且结构固定，仅执行 DML（SELECT/INSERT/INSERT IGNORE），禁止表扫描、DDL、元数据查询（如 SHOW COLUMNS）。
    try {
        const appId = process.env.Z_APP_ID;
        const tenantId = process.env.Z_TENANT;
        const sigma = process.env.Z_SIGMA;

        let actionId = null;
        let resourceId = null;
        let insertedResource = null;
        let insertedAction = null;
        let insertedPermission = null;
        const insertedRolePerms = [];

        if (!skip && method && uri) {
            const level = metadata.level != null ? metadata.level : 1;
            const brief = metadata.brief || "";
            const identifier = metadata.identifier || "default";
            const keyword = metadata.keyword && String(metadata.keyword).trim();
            const resourceCode = keyword
                ? "res." + keyword
                : ("res_" + (metadata.resource || "api").replace(/\./g, "_") + "_" + method + "_" + uri.replace(/\//g, "_").replace(/^\s+|\s+$/g, "").slice(0, 48) || "res_api");
            const actionCode = keyword ? "act." + keyword : "act_" + (metadata.resource || "api").replace(/\./g, "_");

            // 实体表按 CODE 去重：先按 METHOD+URI 查，再按 CODE+SIGMA 查，存在则不插入
            let [rows] = await conn.execute(
                "SELECT ID, RESOURCE_ID FROM S_ACTION WHERE METHOD = ? AND URI = ? LIMIT 2",
                [method, uri]
            );
            if (rows && rows.length > 1) {
                [rows] = await conn.execute(
                    "SELECT ID, RESOURCE_ID FROM S_ACTION WHERE METHOD = ? AND URI = ? AND SIGMA = ? AND APP_ID = ? AND TENANT_ID = ? LIMIT 1",
                    [method, uri, sigma, appId, tenantId]
                );
            }
            if (rows && rows.length > 0) {
                actionId = rows[0].ID;
                resourceId = rows[0].RESOURCE_ID;
                Ec.info("[ex-api] 已存在 S_ACTION（METHOD+URI），ID=" + actionId);
            } else {
                const [actByCode] = await conn.execute("SELECT ID, RESOURCE_ID FROM S_ACTION WHERE CODE = ? AND SIGMA = ? LIMIT 1", [actionCode, sigma]);
                if (actByCode && actByCode.length > 0) {
                    actionId = actByCode[0].ID;
                    resourceId = actByCode[0].RESOURCE_ID;
                    Ec.info("[ex-api] 已存在 S_ACTION（CODE 去重），ID=" + actionId);
                } else {
                    const [resRows] = await conn.execute("SELECT ID FROM S_RESOURCE WHERE CODE = ? AND SIGMA = ? LIMIT 1", [resourceCode, sigma]);
                    if (resRows && resRows[0]) {
                        resourceId = resRows[0].ID;
                        Ec.info("[ex-api] 已存在 S_RESOURCE（CODE 去重），ID=" + resourceId);
                    } else {
                        resourceId = uuidv4();
                        const resBaseCols = ["ID", "NAME", "CODE", "IDENTIFIER", "TYPE", "LEVEL", "MODE_ROLE"];
                        const resBaseVals = [resourceId, brief, resourceCode, identifier, metadata.resource || "resource.ambient", level, "UNION"];
                        const resGlobal = getGlobalColsAndVals();
                        const resCols = resBaseCols.concat(resGlobal.cols);
                        const resVals = resBaseVals.concat(resGlobal.vals);
                        const resPlaceholders = resCols.map(() => "?").join(", ");
                        await conn.execute(
                            "INSERT INTO S_RESOURCE (" + resCols.join(", ") + ") VALUES (" + resPlaceholders + ")",
                            resVals
                        );
                        insertedResource = { CODE: resourceCode, NAME: brief, IDENTIFIER: identifier, TYPE: metadata.resource || "resource.ambient", LEVEL: level, MODE_ROLE: "UNION" };
                        Ec.info("[ex-api] 已插入 S_RESOURCE，ID=" + resourceId);
                    }

                    actionId = uuidv4();
                    const actBaseCols = ["ID", "CODE", "NAME", "RESOURCE_ID", "METHOD", "URI", "LEVEL"];
                    const actBaseVals = [actionId, actionCode, brief, resourceId, method, uri, level];
                    const actGlobal = getGlobalColsAndVals();
                    const actCols = actBaseCols.concat(actGlobal.cols);
                    const actVals = actBaseVals.concat(actGlobal.vals);
                    const actPlaceholders = actCols.map(() => "?").join(", ");
                    await conn.execute(
                        "INSERT INTO S_ACTION (" + actCols.join(", ") + ") VALUES (" + actPlaceholders + ")",
                        actVals
                    );
                    insertedAction = { CODE: actionCode, NAME: brief, RESOURCE_ID: resourceId, METHOD: method, URI: uri, LEVEL: level };
                    Ec.info("[ex-api] 已插入 S_ACTION，ID=" + actionId);
                }
            }
        }

        let permissionId = null;
        const permIdentifier = metadata.identifier || "default";
        let permissionMode = "new";

        if (!skip) {
            const ans = await inquirer.prompt([
                {
                    type: "list",
                    name: "permissionMode",
                    message: "追加新权限 / 使用已有权限？",
                    choices: [
                        { name: "追加新权限", value: "new" },
                        { name: "使用已有权限（按 identifier 选择）", value: "existing" }
                    ]
                }
            ]);
            permissionMode = ans.permissionMode;

            if (permissionMode === "existing") {
                const [permRows] = await conn.execute("SELECT ID, CODE, NAME FROM S_PERMISSION WHERE IDENTIFIER = ?", [permIdentifier]);
                if (!permRows || permRows.length === 0) {
                    Ec.info("当前 identifier 下无已有权限，将按新权限创建");
                    permissionMode = "new";
                } else {
                    const { selectedPerm } = await inquirer.prompt([
                        {
                            type: "list",
                            name: "selectedPerm",
                            message: "选择要追加到的权限",
                            choices: permRows.map((r) => ({ name: `${r.NAME} (${r.CODE})`, value: r.ID }))
                        }
                    ]);
                    permissionId = selectedPerm;
                }
            }
            if (permissionMode === "new" || !permissionId) {
                const brief = metadata.brief || "";
                const keyword = metadata.keyword && String(metadata.keyword).trim();
                const permCode = keyword ? "perm." + keyword : ("perm_" + (metadata.resource || "api").replace(/\./g, "_").slice(0, 64));
                const [ex] = await conn.execute("SELECT ID FROM S_PERMISSION WHERE CODE = ? AND SIGMA = ? LIMIT 1", [permCode, sigma]);
                if (ex && ex[0]) {
                    permissionId = ex[0].ID;
                    Ec.info("[ex-api] 已存在 S_PERMISSION（CODE 去重），ID=" + permissionId);
                } else {
                    permissionId = uuidv4();
                    const permBaseCols = ["ID", "CODE", "NAME", "IDENTIFIER", "COMMENT"];
                    const permBaseVals = [permissionId, permCode, brief, permIdentifier, brief];
                    const permGlobal = getGlobalColsAndVals();
                    const permCols = permBaseCols.concat(permGlobal.cols);
                    const permVals = permBaseVals.concat(permGlobal.vals);
                    const permPlaceholders = permCols.map(() => "?").join(", ");
                    await conn.execute(
                        "INSERT INTO S_PERMISSION (" + permCols.join(", ") + ") VALUES (" + permPlaceholders + ")",
                        permVals
                    );
                    insertedPermission = { CODE: permCode, NAME: brief, IDENTIFIER: permIdentifier, COMMENT: brief };
                    Ec.info("[ex-api] 已插入 S_PERMISSION，ID=" + permissionId);
                }
            }
        }

        let roleIds = [];
        if (!skip) {
            const [roleRows] = await conn.execute("SELECT ID, NAME, CODE FROM S_ROLE ORDER BY NAME");
            if (!roleRows || roleRows.length === 0) {
                Ec.info("[ex-api] S_ROLE 中无角色，跳过授权");
            } else {
                const answer = await inquirer.prompt([
                    {
                        type: "checkbox",
                        name: "selectedRoles",
                        message: "选择要授权当前 API 的角色（可多选）",
                        choices: roleRows.map((r) => ({ name: `${r.NAME || r.CODE} (${r.ID})`, value: String(r.ID != null ? r.ID : r.id) }))
                    }
                ]);
                const raw = answer.selectedRoles;
                if (Array.isArray(raw)) {
                    roleIds = raw.map((id) => (id != null ? String(id) : id));
                } else if (raw != null && raw !== "") {
                    roleIds = [String(raw)];
                } else {
                    roleIds = [];
                }
                Ec.info("[ex-api] 已选角色数：" + roleIds.length + (roleIds.length > 0 ? "，ID=" + roleIds.slice(0, 5).join(",") + (roleIds.length > 5 ? "..." : "") : ""));
            }
        }

        if (!skip && permissionId && roleIds.length > 0) {
            for (const roleId of roleIds) {
                await conn.execute(
                    "INSERT IGNORE INTO R_ROLE_PERM (ROLE_ID, PERM_ID) VALUES (?, ?)",
                    [roleId, permissionId]
                );
                insertedRolePerms.push({ ROLE_ID: roleId, PERM_ID: permissionId });
            }
            Ec.info("[ex-api] 已同步 R_ROLE_PERM，角色数：" + roleIds.length);
        }

        // 汇总与 Excel 写入前：查询已有记录，供 Excel 填充（本次未插入时也写出当前 resource/role-perm）
        let existingResource = null;
        let existingAction = null;
        let existingPermission = null;
        if (resourceId && !insertedResource) {
            const [rows] = await conn.execute("SELECT ID, CODE, NAME, IDENTIFIER, TYPE, LEVEL, MODE_ROLE FROM S_RESOURCE WHERE ID = ? LIMIT 1", [resourceId]);
            if (rows && rows[0]) existingResource = rows[0];
        }
        if (actionId && !insertedAction) {
            const [rows] = await conn.execute("SELECT ID, CODE, NAME, RESOURCE_ID, METHOD, URI, LEVEL FROM S_ACTION WHERE ID = ? LIMIT 1", [actionId]);
            if (rows && rows[0]) existingAction = rows[0];
        }
        if (permissionId && !insertedPermission) {
            const [rows] = await conn.execute("SELECT ID, CODE, NAME, IDENTIFIER, COMMENT FROM S_PERMISSION WHERE ID = ? LIMIT 1", [permissionId]);
            if (rows && rows[0]) existingPermission = rows[0];
        }
        let existingRolePerms = [];
        if (permissionId && insertedRolePerms.length === 0 && (!roleIds || roleIds.length === 0)) {
            try {
                const [rpRows] = await conn.execute("SELECT ROLE_ID, PERM_ID FROM R_ROLE_PERM WHERE PERM_ID = ?", [permissionId]);
                if (rpRows && rpRows.length > 0) {
                    Ec.info("[ex-api] R_ROLE_PERM 从库中提取 " + rpRows.length + " 条（PERM_ID=" + permissionId + "）");
                    existingRolePerms = rpRows.map((r) => ({
                        ROLE_ID: r.ROLE_ID != null ? r.ROLE_ID : r.role_id,
                        PERM_ID: r.PERM_ID != null ? r.PERM_ID : r.perm_id
                    }));
                }
            } catch (e) {
                Ec.info("[ex-api] R_ROLE_PERM 查询失败: " + e.message);
            }
        }
        // 四张表行数据（Excel 列名与模板英文表头一致）；S_PERM_SET 的 name/type 来自配置 pname/ptype
        const resRow = resourceId && (insertedResource || existingResource) ? (insertedResource || existingResource) : null;
        const actRow = actionId && (insertedAction || existingAction) ? (insertedAction || existingAction) : null;
        const permRow = permissionId && (insertedPermission || existingPermission) ? (insertedPermission || existingPermission) : null;
        const rowS_RESOURCE = resRow
            ? {
                key: resourceId,
                name: resRow.NAME,
                modeRole: resRow.MODE_ROLE || "UNION",
                code: resRow.CODE,
                identifier: resRow.IDENTIFIER,
                type: resRow.TYPE,
                level: resRow.LEVEL,
                modeGroup: "",
                modeTree: ""
            }
            : null;
        const rowS_ACTION = actRow && resourceId && permissionId
            ? {
                key: actionId,
                resourceId,
                permissionId,
                code: actRow.CODE,
                method: actRow.METHOD,
                uri: actRow.URI,
                name: actRow.NAME,
                level: actRow.LEVEL,
                renewalCredit: ""
            }
            : null;
        const rowS_PERMISSION = permRow
            ? {
                key: permissionId,
                name: permRow.NAME,
                comment: permRow.COMMENT,
                code: permRow.CODE,
                identifier: permRow.IDENTIFIER
            }
            : null;
        // S_PERM_SET：name/type 必须从配置 pname/ptype 提取，key/code 与资源一致
        const rowS_PERM_SET = resourceId && resRow
            ? {
                key: resourceId,
                code: resRow.CODE,
                name: (metadata.pname != null && metadata.pname !== "") ? metadata.pname : resRow.NAME,
                type: (metadata.ptype != null && metadata.ptype !== "") ? metadata.ptype : resRow.TYPE
            }
            : null;
        // 写入 Excel 的数据（仅用于写 Excel，不写库）：有 permissionId + 本次选中的 roleIds 则用其组合；否则用本次插入的；否则用库中已有的
        let rolePermsToWrite =
            permissionId && roleIds && roleIds.length > 0
                ? roleIds.map((rid) => ({ ROLE_ID: rid, PERM_ID: permissionId }))
                : insertedRolePerms.length > 0
                ? insertedRolePerms
                : existingRolePerms.length > 0
                ? existingRolePerms
                : [];
        rolePermsToWrite = rolePermsToWrite.map((p) => ({
            ROLE_ID: p.ROLE_ID != null ? p.ROLE_ID : p.role_id,
            PERM_ID: p.PERM_ID != null ? p.PERM_ID : p.perm_id
        }));
        // 有 permissionId 但仍无一条可写时，从 S_ROLE 取一个角色，保证 Excel 至少有一行（仅写 Excel，不写库）；优先超级管理员
        if (permissionId && rolePermsToWrite.length === 0) {
            try {
                let [oneRole] = await conn.execute(
                    "SELECT ID FROM S_ROLE WHERE NAME = ? OR CODE = ? OR CODE = ? LIMIT 1",
                    ["超级管理员", "ADMIN.SUPER", "ADMIN_SUPER"]
                );
                if (!oneRole || !oneRole[0]) {
                    [oneRole] = await conn.execute("SELECT ID FROM S_ROLE ORDER BY NAME LIMIT 1", []);
                }
                if (oneRole && oneRole[0]) {
                    const rid = oneRole[0].ID != null ? String(oneRole[0].ID) : String(oneRole[0].id);
                    rolePermsToWrite = [{ ROLE_ID: rid, PERM_ID: permissionId }];
                    Ec.info("[ex-api] R_ROLE_PERM 无选中/库中记录，已用 S_ROLE 补一条写 Excel（ROLE_ID=" + rid + "）");
                }
            } catch (e) {
                Ec.info("[ex-api] S_ROLE 取角色失败: " + e.message);
            }
        }

        Ec.info("[ex-api] 📋 R_ROLE_PERM 写入前数据：");
        Ec.info("[ex-api]   insertedRolePerms.length = " + insertedRolePerms.length);
        Ec.info("[ex-api]   existingRolePerms.length = " + existingRolePerms.length);
        Ec.info("[ex-api]   permissionId = " + (permissionId || "—"));
        Ec.info("[ex-api]   roleIds.length = " + (roleIds ? roleIds.length : 0));
        Ec.info("[ex-api]   rolePermsToWrite.length = " + rolePermsToWrite.length);
        if (rolePermsToWrite.length > 0) {
            rolePermsToWrite.slice(0, 10).forEach((p, i) => {
                Ec.info("[ex-api]   rolePermsToWrite[" + i + "] = { ROLE_ID: " + (p.ROLE_ID != null ? p.ROLE_ID : "undefined") + ", PERM_ID: " + (p.PERM_ID != null ? p.PERM_ID : "undefined") + " }");
            });
            if (rolePermsToWrite.length > 10) Ec.info("[ex-api]   ... 共 " + rolePermsToWrite.length + " 条");
        }

        // Excel 输出：有 target 时为 DPA zero-exmodule-{module}；无 target 时输出到 -api 项目；文件名固化 identifier-method-uri
        const excelRoot = resolveExcelRoot(cwd, target);
        const domainName = target && target.module ? `zero-exmodule-${target.module}-domain` : null;
        const pluginsBase = domainName
            ? path.join(excelRoot, domainName, "src", "main", "resources", "plugins")
            : path.join(excelRoot, "src", "main", "resources", "plugins");
        const pluginId = domainName ? `zero-exmodule-${target.module}` : "zero-launcher-configuration";
        const rbacResourceDir = path.join(pluginsBase, pluginId, "security", "RBAC_RESOURCE");
        const rbacRoleDir = path.join(pluginsBase, pluginId, "security", "RBAC_ROLE", "ADMIN.SUPER");

        if (!fs.existsSync(rbacResourceDir)) fs.mkdirSync(rbacResourceDir, { recursive: true });
        if (!fs.existsSync(rbacRoleDir)) fs.mkdirSync(rbacRoleDir, { recursive: true });

        const identifierSlug = (metadata.identifier || "api").replace(/[^a-zA-Z0-9._-]/g, "_");
        const methodSlug = (method || "GET").toUpperCase();
        const uriSlug = uriToFileNameSlug(uri);
        const defaultFileName = `${identifierSlug}-${methodSlug}-${uriSlug}.xlsx`;

        const fileName = defaultFileName;
        const ExcelJS = require("exceljs");
        // 模板目录取自 r2mo-init 包内（__dirname），非当前项目 cwd，保证任意项目执行 ai ex-api 都能找到模板
        const templateDir = path.resolve(__dirname, "..", "_template", "EXCEL", "ex-api");
        const templateDefPath = path.join(templateDir, "template-def.json");
        let templateDef = {
            RBAC_RESOURCE: { templateFile: "template-RBAC_RESOURCE.xlsx", sheetName: "DATA-PERM", tableName: "S_PERM_SET", columns: ["key", "code", "name", "type"] },
            RBAC_ROLE: { templateFile: "template-RBAC_ROLE.xlsx", sheetName: "DATA-PERM", tableName: "R_ROLE_PERM", columns: ["roleId", "permId"] }
        };
        if (fs.existsSync(templateDefPath)) {
            try {
                const defJson = JSON.parse(fs.readFileSync(templateDefPath, "utf-8"));
                if (defJson.RBAC_RESOURCE) templateDef.RBAC_RESOURCE = { ...templateDef.RBAC_RESOURCE, ...defJson.RBAC_RESOURCE };
                if (defJson.RBAC_ROLE) templateDef.RBAC_ROLE = { ...templateDef.RBAC_ROLE, ...defJson.RBAC_ROLE };
            } catch (_) {
                Ec.info("[ex-api] 模版定义解析失败，使用内置格式");
            }
        }

        const defRes = templateDef.RBAC_RESOURCE;
        const defRole = templateDef.RBAC_ROLE;
        const tableNameRole = defRole.tableName || "R_ROLE_PERM";

        const templateResPath = path.join(templateDir, defRes.templateFile || "template-RBAC_RESOURCE.xlsx");
        const templateRolePath = path.join(templateDir, defRole.templateFile || "template-RBAC_ROLE.xlsx");

        // 四张表行数据 keyed by 模板中的 tableName（与 scanTableRegions 返回一致）
        const tableRowData = {
            S_RESOURCE: rowS_RESOURCE,
            S_ACTION: rowS_ACTION,
            S_PERMISSION: rowS_PERMISSION,
            S_PERM_SET: rowS_PERM_SET
        };

        let workbook;
        if (fs.existsSync(templateResPath)) {
            workbook = await new ExcelJS.Workbook().xlsx.readFile(templateResPath);
            const wsRes = workbook.getWorksheet(defRes.sheetName || "DATA-PERM") || workbook.worksheets[0];
            if (wsRes) {
                const regions = scanTableRegions(wsRes);
                regions.forEach((region) => {
                    const dataRow = tableRowData[region.tableName];
                    if (!dataRow || !region.columnIndex) return;
                    const row = wsRes.getRow(region.dataStartRow);
                    Object.keys(dataRow).forEach((col) => {
                        const colNum = region.columnIndex[col];
                        if (colNum != null && dataRow[col] != null && dataRow[col] !== "") {
                            row.getCell(colNum).value = dataRow[col];
                        }
                    });
                });
            }
        } else {
            Ec.info("[ex-api] 未找到模板 " + templateResPath + "，使用固定表头格式（可被解析）");
            workbook = new ExcelJS.Workbook();
            const wsRes = workbook.addWorksheet(defRes.sheetName || "DATA-PERM");
            wsRes.addRow([]);
            wsRes.addRow([]);
            ["S_PERM_SET", "S_PERMISSION", "S_ACTION", "S_RESOURCE"].forEach((tname) => {
                const data = tableRowData[tname];
                if (tname === "S_PERM_SET" && data) {
                    wsRes.addRow(["{TABLE}", tname, "", "", ""]);
                    wsRes.addRow(["权限集主键", "权限代码", "权限集名称", "权限集类型"]);
                    wsRes.addRow(["key", "code", "name", "type"]);
                    wsRes.addRow([data.key, data.code, data.name, data.type]);
                } else if (tname === "S_RESOURCE" && data) {
                    wsRes.addRow(["{TABLE}", tname, "", "", ""]);
                    wsRes.addRow(["主键", "名称", "MODE_ROLE", "CODE", "IDENTIFIER", "TYPE", "LEVEL"]);
                    wsRes.addRow(["key", "name", "modeRole", "code", "identifier", "type", "level"]);
                    wsRes.addRow([data.key, data.name, data.modeRole, data.code, data.identifier, data.type, data.level]);
                } else if (tname === "S_ACTION" && data) {
                    wsRes.addRow(["{TABLE}", tname, "", "", ""]);
                    wsRes.addRow(["主键", "RESOURCE_ID", "PERMISSION_ID", "CODE", "METHOD", "URI", "NAME", "LEVEL"]);
                    wsRes.addRow(["key", "resourceId", "permissionId", "code", "method", "uri", "name", "level"]);
                    wsRes.addRow([data.key, data.resourceId, data.permissionId, data.code, data.method, data.uri, data.name, data.level]);
                } else if (tname === "S_PERMISSION" && data) {
                    wsRes.addRow(["{TABLE}", tname, "", "", ""]);
                    wsRes.addRow(["主键", "名称", "备注", "CODE", "IDENTIFIER"]);
                    wsRes.addRow(["key", "name", "comment", "code", "identifier"]);
                    wsRes.addRow([data.key, data.name, data.comment, data.code, data.identifier]);
                }
            });
        }
        const outResPath = path.join(rbacResourceDir, fileName);
        await workbook.xlsx.writeFile(outResPath);
        Ec.info("[ex-api] 已写入 RBAC_RESOURCE：" + outResPath);

        let roleWorkbook;
        if (fs.existsSync(templateRolePath)) {
            roleWorkbook = await new ExcelJS.Workbook().xlsx.readFile(templateRolePath);
            const wsRole = roleWorkbook.getWorksheet(defRole.sheetName || "DATA-PERM") || roleWorkbook.worksheets[0];
            if (wsRole) {
                const regionsRole = scanTableRegions(wsRole);
                Ec.info("[ex-api] 📋 R_ROLE_PERM 模板区域：");
                Ec.info("[ex-api]   templateRolePath = " + templateRolePath);
                Ec.info("[ex-api]   sheetName = " + (defRole.sheetName || "DATA-PERM"));
                Ec.info("[ex-api]   tableNameRole(查找用) = " + tableNameRole);
                Ec.info("[ex-api]   regionsRole.length = " + regionsRole.length);
                regionsRole.forEach((r, i) => {
                    Ec.info("[ex-api]   regionsRole[" + i + "].tableName = " + JSON.stringify(r.tableName) + ", dataStartRow = " + r.dataStartRow + ", columnIndex keys = " + (r.columnIndex ? Object.keys(r.columnIndex).join(", ") : "—"));
                });
                const region = regionsRole.find((r) => String(r.tableName).trim() === String(tableNameRole).trim());
                if (region) {
                    const colRole = region.columnIndex["roleId"] || region.columnIndex["ROLE_ID"] || 1;
                    const colPerm = region.columnIndex["permId"] || region.columnIndex["PERM_ID"] || 2;
                    Ec.info("[ex-api]   找到 R_ROLE_PERM 区域：dataStartRow = " + region.dataStartRow + ", colRole = " + colRole + ", colPerm = " + colPerm);
                    if (rolePermsToWrite.length > 0) {
                        Ec.info("[ex-api]   即将写入 " + rolePermsToWrite.length + " 行到 wsRole 行 " + region.dataStartRow + " 起，列 " + colRole + "(ROLE_ID)、" + colPerm + "(PERM_ID)");
                        rolePermsToWrite.forEach((pair, idx) => {
                            const row = wsRole.getRow(region.dataStartRow + idx);
                            const roleId = pair.ROLE_ID != null ? pair.ROLE_ID : pair.role_id;
                            const permId = pair.PERM_ID != null ? pair.PERM_ID : pair.perm_id;
                            row.getCell(colRole).value = roleId;
                            row.getCell(colPerm).value = permId;
                            if (idx < 3) Ec.info("[ex-api]      row[" + (region.dataStartRow + idx) + "] 已设 列" + colRole + "=" + roleId + " 列" + colPerm + "=" + permId);
                        });
                        const checkRow = wsRole.getRow(region.dataStartRow);
                        Ec.info("[ex-api] 已写入 R_ROLE_PERM " + rolePermsToWrite.length + " 行（dataStartRow=" + region.dataStartRow + "）；写回读首行 列" + colRole + "=" + (checkRow.getCell(colRole).value) + " 列" + colPerm + "=" + (checkRow.getCell(colPerm).value));
                    } else {
                        Ec.info("[ex-api] R_ROLE_PERM 无数据可写（rolePermsToWrite.length=0，permissionId=" + (permissionId || "—") + "）");
                    }
                } else {
                    Ec.info("[ex-api] 未找到 R_ROLE_PERM 区域（tableName=" + tableNameRole + "），跳过写入");
                }
            }
        } else {
            Ec.info("[ex-api] 未找到模板 " + templateRolePath + "，使用固定表头格式（可被解析）");
            roleWorkbook = new ExcelJS.Workbook();
            const wsRole = roleWorkbook.addWorksheet(defRole.sheetName || "DATA-PERM");
            wsRole.addRow([]);
            wsRole.addRow([]);
            wsRole.addRow(["{TABLE}", tableNameRole, "角色和权限关系", "", ""]);
            wsRole.addRow(["角色ID", "权限ID"]);
            wsRole.addRow(["roleId", "permId"]);
            rolePermsToWrite.forEach((p) => wsRole.addRow([p.ROLE_ID, p.PERM_ID]));
        }
        const roleFileName = "falcon-" + fileName;
        const outRolePath = path.join(rbacRoleDir, roleFileName);
        await roleWorkbook.xlsx.writeFile(outRolePath);
        Ec.info("[ex-api] 已写入 RBAC_ROLE/ADMIN.SUPER：" + outRolePath);

        Ec.info("[ex-api] ✅ 执行完成（幂等）");
        Ec.info("[ex-api] 📋 汇总：");
        Ec.info("[ex-api]   🔑 ACTION_ID     = " + (actionId || "—"));
        Ec.info("[ex-api]   🔑 RESOURCE_ID  = " + (resourceId || "—"));
        Ec.info("[ex-api]   🔑 PERMISSION_ID = " + (permissionId || "—"));
        Ec.info("[ex-api]   👥 授权角色数   = " + (roleIds ? roleIds.length : 0));
        Ec.info("[ex-api]   📁 RBAC_RESOURCE = " + outResPath);
        Ec.info("[ex-api]   📁 RBAC_ROLE     = " + outRolePath);
        if (insertedResource) {
            Ec.info("[ex-api]   📦 S_RESOURCE 本次插入字段：");
            Object.keys(insertedResource).forEach((k) => Ec.info("[ex-api]      " + k + " = " + (insertedResource[k] != null ? insertedResource[k] : "—")));
        }
        if (existingResource) {
            Ec.info("[ex-api]   📄 S_RESOURCE 已有记录（有值属性）：");
            Object.keys(existingResource).forEach((k) => {
                const v = existingResource[k];
                if (v != null && v !== "") Ec.info("[ex-api]      " + k + " = " + v);
            });
        }
        if (insertedAction) {
            Ec.info("[ex-api]   📦 S_ACTION 本次插入字段：");
            Object.keys(insertedAction).forEach((k) => Ec.info("[ex-api]      " + k + " = " + (insertedAction[k] != null ? insertedAction[k] : "—")));
        }
        if (existingAction) {
            Ec.info("[ex-api]   📄 S_ACTION 已有记录（有值属性）：");
            Object.keys(existingAction).forEach((k) => {
                const v = existingAction[k];
                if (v != null && v !== "") Ec.info("[ex-api]      " + k + " = " + v);
            });
        }
        if (insertedPermission) {
            Ec.info("[ex-api]   📦 S_PERMISSION 本次插入字段：");
            Object.keys(insertedPermission).forEach((k) => Ec.info("[ex-api]      " + k + " = " + (insertedPermission[k] != null ? insertedPermission[k] : "—")));
        }
        if (existingPermission) {
            Ec.info("[ex-api]   📄 S_PERMISSION 已有记录（有值属性）：");
            Object.keys(existingPermission).forEach((k) => {
                const v = existingPermission[k];
                if (v != null && v !== "") Ec.info("[ex-api]      " + k + " = " + v);
            });
        }
        if (insertedRolePerms.length > 0) {
            Ec.info("[ex-api]   📦 R_ROLE_PERM 本次写入（ROLE_ID, PERM_ID）：");
            insertedRolePerms.forEach((r, i) => Ec.info("[ex-api]      [" + (i + 1) + "] " + r.ROLE_ID + ", " + r.PERM_ID));
        }
    } catch (err) {
        Ec.error("[ex-api] 执行失败：" + (err && err.message));
        if (err && err.code) Ec.error("[ex-api] 错误码：" + err.code);
        if (err && err.sqlMessage) Ec.error("[ex-api] SQL：" + err.sqlMessage);
        if (err && err.sql) Ec.error("[ex-api] 语句：" + (typeof err.sql === "string" ? err.sql : err.sql.join(" ")));
        if (err && err.stack) Ec.error("[ex-api] 堆栈：" + err.stack);
        process.exit(1);
    } finally {
        if (conn) await conn.end();
    }
};
