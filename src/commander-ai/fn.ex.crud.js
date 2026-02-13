"use strict";

const Ec = require("../epic");
const fs = require("fs");
const path = require("path");
const Ut = require("../commander-shared");
const yaml = require("js-yaml");
const inquirer = require("inquirer");
const { v4: uuidv4 } = require("uuid");

const CONFIG_PATH = ".r2mo/task/command/ex-crud.yaml";
const REQUIRED_ENV_DB = ["Z_DB_TYPE", "Z_DB_HOST", "Z_DB_PORT", "Z_DBS_INSTANCE", "Z_DB_APP_USER", "Z_DB_APP_PASS"];
const REQUIRED_ENV_APP = ["Z_APP_ID", "Z_TENANT", "Z_SIGMA"];

/** 占位符替换顺序：先长后短，避免 "log" 把 "x-log" / "x.log" 破坏。literal 为模板参考值，替换为 meta 中对应字段。 */
const REPLACE_ORDER = [
    ["x.log", "identifier"],
    ["x-log", "actor"],
    ["log", "keyword"],
    ["日志", "name"],
    ["resource.ambient", "type"]
];

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi;

/** 扫描 sheet 中 {TABLE} 区域，返回 [{ tableName, dataStartRow, dataEndRow, columnIndex }, ...] */
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
            const columnIndex = {};
            enHeaderRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const val = cell && cell.value != null ? String(cell.value).trim() : "";
                if (val) columnIndex[val] = colNumber;
            });
            regions.push({ tableName, tableStartRow: i, dataStartRow, dataEndRow, columnIndex });
            i = dataEndRow + 1;
            continue;
        }
        i++;
    }
    return regions;
}

/** 从已生成的 RBAC_CRUD 目录下所有 xlsx 中收集 S_PERMISSION 表的 UUID（key/ID 列） */
async function collectPermissionIdsFromCrudDir(rbacCrudDir) {
    const ExcelJS = require("exceljs");
    const ids = [];
    const readXlsx = async (filePath) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        workbook.eachSheet((ws) => {
            const regions = scanTableRegions(ws);
            regions.forEach((reg) => {
                if (reg.tableName !== "S_PERMISSION") return;
                const colKey = reg.columnIndex.key || reg.columnIndex.ID || reg.columnIndex.id;
                if (colKey == null) return;
                for (let r = reg.dataStartRow; r <= reg.dataEndRow; r++) {
                    const val = ws.getRow(r).getCell(colKey).value;
                    if (val != null && String(val).trim() !== "") ids.push(String(val).trim());
                }
            });
        });
    };
    const walk = (dir) => {
        if (!fs.existsSync(dir)) return;
        fs.readdirSync(dir, { withFileTypes: true }).forEach((ent) => {
            const full = path.join(dir, ent.name);
            if (ent.isDirectory()) walk(full);
            else if (ent.name.toLowerCase().endsWith(".xlsx")) queue.push(full);
        });
    };
    const queue = [];
    walk(rbacCrudDir);
    for (const filePath of queue) {
        try {
            await readXlsx(filePath);
        } catch (e) {
            Ec.info("[ex-crud] 读取 xlsx 跳过：" + path.relative(rbacCrudDir, filePath) + "，" + (e && e.message));
        }
    }
    return ids;
}

function getArtifactIdFromPom(cwd) {
    const pomPath = path.resolve(cwd, "pom.xml");
    if (!fs.existsSync(pomPath)) return null;
    let content = fs.readFileSync(pomPath, "utf-8");
    content = content.replace(/<parent>[\s\S]*?<\/parent>/i, "");
    const m = content.match(/<artifactId>([^<]+)<\/artifactId>/);
    return m ? m[1].trim() : null;
}

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

/** 对路径片段做替换（先长后短），用于目录/文件名 */
function replacePathSegment(seg, meta) {
    let s = seg;
    for (const [literal, key] of REPLACE_ORDER) {
        const val = meta[key];
        if (val != null && String(val).trim() !== "") s = s.split(literal).join(String(meta[key]));
    }
    // 支持占位符 {{key}}
    s = s.replace(/\{\{identifier\}\}/g, meta.identifier != null ? meta.identifier : "");
    s = s.replace(/\{\{actor\}\}/g, meta.actor != null ? meta.actor : "");
    s = s.replace(/\{\{keyword\}\}/g, meta.keyword != null ? meta.keyword : "");
    s = s.replace(/\{\{name\}\}/g, meta.name != null ? meta.name : "");
    s = s.replace(/\{\{type\}\}/g, meta.type != null ? meta.type : "");
    return s;
}

/** 对文件内容做替换（先长后短），再替换所有 UUID */
function replaceContent(content, meta, isBinary) {
    if (isBinary) return content;
    if (typeof content !== "string") content = String(content);
    let s = content;
    for (const [literal, key] of REPLACE_ORDER) {
        const val = meta[key];
        if (val != null && String(val).trim() !== "") s = s.split(literal).join(String(meta[key]));
    }
    s = s.replace(/\{\{identifier\}\}/g, meta.identifier != null ? meta.identifier : "");
    s = s.replace(/\{\{actor\}\}/g, meta.actor != null ? meta.actor : "");
    s = s.replace(/\{\{keyword\}\}/g, meta.keyword != null ? meta.keyword : "");
    s = s.replace(/\{\{name\}\}/g, meta.name != null ? meta.name : "");
    s = s.replace(/\{\{type\}\}/g, meta.type != null ? meta.type : "");
    return replaceAllUuids(s);
}

function replaceAllUuids(str) {
    return str.replace(UUID_REGEX, () => uuidv4());
}

/** 对单个单元格 value 做占位符与 UUID 替换 */
function replaceCellValue(val, meta) {
    if (val == null) return val;
    if (typeof val === "string") return replaceContent(val, meta, false);
    return val;
}

/** 递归复制模板目录到目标，跳过 ex-crud.yaml、README.md；路径片段与文本内容按 meta 替换，内容中 UUID 重新生成；.xlsx 用 ExcelJS 按单元格替换后写回 */
async function copyTemplateWithReplace(templateDir, destDir, meta, skipNames) {
    if (!fs.existsSync(templateDir)) return;
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const skipSet = new Set(Array.isArray(skipNames) ? skipNames : (skipNames ? [skipNames] : []));
    const entries = fs.readdirSync(templateDir, { withFileTypes: true });
    const ExcelJS = require("exceljs");
    for (const ent of entries) {
        const srcPath = path.join(templateDir, ent.name);
        const segReplaced = replacePathSegment(ent.name, meta);
        const destPath = path.join(destDir, segReplaced);
        if (skipSet.has(ent.name)) continue;
        if (ent.isDirectory()) {
            await copyTemplateWithReplace(srcPath, destPath, meta, []);
        } else {
            const ext = path.extname(ent.name).toLowerCase();
            if (ext === ".xlsx" || ext === ".xls") {
                try {
                    const workbook = await new ExcelJS.Workbook().xlsx.readFile(srcPath);
                    workbook.eachSheet((ws) => {
                        ws.eachRow((row) => {
                            if (!row) return;
                            row.eachCell((cell) => {
                                if (cell && cell.value != null) cell.value = replaceCellValue(cell.value, meta);
                            });
                        });
                    });
                    await workbook.xlsx.writeFile(destPath);
                } catch (e) {
                    Ec.info("[ex-crud] 跳过 xlsx 占位符替换，直接复制：" + segReplaced + "，" + (e && e.message));
                    fs.copyFileSync(srcPath, destPath);
                }
                Ec.info("[ex-crud] 生成：" + path.relative(destDir, destPath));
            } else {
                const isBinary = [".png", ".jpg", ".jpeg", ".gif", ".ico", ".pdf"].includes(ext);
                let content = fs.readFileSync(srcPath, isBinary ? null : "utf-8");
                if (!isBinary) content = replaceContent(content, meta, false);
                fs.writeFileSync(destPath, content, isBinary ? null : "utf-8");
                Ec.info("[ex-crud] 生成：" + path.relative(destDir, destPath));
            }
        }
    }
}

module.exports = async (options) => {
    const cwd = process.cwd();
    const configFullPath = path.resolve(cwd, CONFIG_PATH);
    if (!fs.existsSync(configFullPath)) {
        const configDir = path.dirname(configFullPath);
        if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
        const template = `# ai ex-crud 使用此配置，请按项目修改
metadata:
  keyword: "log"
  identifier: "x.log"
  actor: "x-log"
  name: "日志"
  type: "resource.ambient"
# target 可选；与 ex-api 一致，存在时需 ZERO_MODULE 与 zero-exmodule-{module}
# target:
#   root: "ZERO_MODULE"
#   module: "ambient"
`;
        fs.writeFileSync(configFullPath, template, "utf-8");
        Ec.info("配置文件缺失，已在下列路径写入模板：" + configFullPath);
        Ec.info("请编辑后重新执行：  ai ex-crud");
        process.exit(1);
    }

    let config;
    try {
        config = yaml.load(fs.readFileSync(configFullPath, "utf-8"));
    } catch (e) {
        Ec.error("ex-crud.yaml 解析失败：" + e.message);
        process.exit(1);
    }
    if (!config || !config.metadata) {
        Ec.error("ex-crud.yaml 需包含 metadata 节点");
        process.exit(1);
    }

    const metadata = config.metadata;
    const target = config.target;
    const meta = {
        keyword: metadata.keyword != null ? String(metadata.keyword).trim() : "",
        identifier: metadata.identifier != null ? String(metadata.identifier).trim() : "",
        actor: metadata.actor != null ? String(metadata.actor).trim() : "",
        name: metadata.name != null ? String(metadata.name).trim() : "",
        type: metadata.type != null ? String(metadata.type).trim() : ""
    };

    if (target && target.root && target.module) {
        const zeroModule = process.env.ZERO_MODULE;
        if (!zeroModule || !zeroModule.trim()) {
            Ec.error("存在 target 配置时，环境变量 ZERO_MODULE 必须已设置");
            process.exit(1);
        }
    }

    const parsed = Ut.parseArgument(options);
    const skip = parsed.skip === true || process.argv.includes("-s") || process.argv.includes("--skip");

    if (!skip) {
        const appEnvPath = resolveAppEnvPath(cwd);
        if (!appEnvPath) {
            Ec.error(".r2mo/app.env 不存在；DPA 下也未找到 {id}-api/.r2mo/app.env");
            process.exit(1);
        }
        loadAppEnv(appEnvPath);
        checkEnv(REQUIRED_ENV_DB, "数据库环境变量");
        checkEnv(REQUIRED_ENV_APP, "应用环境变量");
    }

    Ec.execute("ai ex-crud：配置已加载。");

    // 1. 模板目录（R2MO-INIT 包内）与输出目录（目标项目 RBAC_CRUD）
    const templateDir = path.resolve(__dirname, "..", "_template", "EXCEL", "ex-crud");
    const excelRoot = resolveExcelRoot(cwd, target);
    const domainName = target && target.module ? `zero-exmodule-${target.module}-domain` : null;
    const pluginsBase = domainName
        ? path.join(excelRoot, domainName, "src", "main", "resources", "plugins")
        : path.join(excelRoot, "src", "main", "resources", "plugins");
    const pluginId = domainName ? `zero-exmodule-${target.module}` : "zero-launcher-configuration";
    const rbacCrudDir = path.join(pluginsBase, pluginId, "security", "RBAC_CRUD");
    const rbacRoleDir = path.join(pluginsBase, pluginId, "security", "RBAC_ROLE", "ADMIN.SUPER");

    if (!fs.existsSync(rbacCrudDir)) fs.mkdirSync(rbacCrudDir, { recursive: true });

    Ec.info("[ex-crud] 模板目录：" + templateDir);
    Ec.info("[ex-crud] 输出目录：" + rbacCrudDir);

    await copyTemplateWithReplace(templateDir, rbacCrudDir, meta, ["ex-crud.yaml", "README.md"]);

    Ec.info("[ex-crud] 已生成 CRUD 文件到 RBAC_CRUD");

    // 2. 从生成的 CRUD 中收集 S_PERMISSION 表的所有 UUID（即 falcon 要关联的权限，不可能在库中已存在）
    const permissionIds = await collectPermissionIdsFromCrudDir(rbacCrudDir);
    Ec.info("[ex-crud] 从 CRUD 中收集到 S_PERMISSION UUID 数：" + permissionIds.length);

    // 3. 若不 skip：连接数据库仅查角色，用户选择（角色不可为空，未选则取默认一条），写 falcon 角色权限表到 RBAC_ROLE
    let roleIds = [];
    if (!skip) {
        const mysql = require("mysql2/promise");
        const dbConfig = {
            host: process.env.Z_DB_HOST || "localhost",
            port: parseInt(process.env.Z_DB_PORT || "3306", 10),
            user: process.env.Z_DB_APP_USER,
            password: process.env.Z_DB_APP_PASS,
            database: process.env.Z_DBS_INSTANCE
        };
        let conn;
        try {
            conn = await mysql.createConnection(dbConfig);
            Ec.info("[ex-crud] 数据库已连接，查询角色");

            const [roleRows] = await conn.execute("SELECT ID, NAME, CODE FROM S_ROLE ORDER BY NAME");
            if (!roleRows || roleRows.length === 0) {
                Ec.info("[ex-crud] S_ROLE 中无角色，跳过 falcon");
            } else {
                const answer = await inquirer.prompt([
                    {
                        type: "checkbox",
                        name: "selectedRoles",
                        message: "选择要授权当前 CRUD 的角色（可多选）",
                        choices: roleRows.map((r) => ({ name: `${r.NAME || r.CODE} (${r.ID})`, value: String(r.ID) }))
                    }
                ]);
                const raw = answer.selectedRoles;
                if (Array.isArray(raw)) roleIds = raw.map((id) => String(id));
                else if (raw != null && raw !== "") roleIds = [String(raw)];

                if (roleIds.length === 0) {
                    let [oneRole] = await conn.execute(
                        "SELECT ID FROM S_ROLE WHERE NAME = ? OR CODE = ? OR CODE = ? LIMIT 1",
                        ["超级管理员", "ADMIN.SUPER", "ADMIN_SUPER"]
                    );
                    if (!oneRole || !oneRole[0]) {
                        [oneRole] = await conn.execute("SELECT ID FROM S_ROLE ORDER BY NAME LIMIT 1", []);
                    }
                    if (oneRole && oneRole[0]) {
                        const rid = oneRole[0].ID != null ? String(oneRole[0].ID) : String(oneRole[0].id);
                        roleIds = [rid];
                        Ec.info("[ex-crud] 未选角色，已用 S_ROLE 补一条（ROLE_ID=" + rid + "）");
                    }
                }
            }

            if (permissionIds.length > 0 && roleIds.length > 0) {
                const rolePermsToWrite = roleIds.flatMap((rid) => permissionIds.map((pid) => ({ ROLE_ID: rid, PERM_ID: pid })));
                if (!fs.existsSync(rbacRoleDir)) fs.mkdirSync(rbacRoleDir, { recursive: true });
                const ExcelJS = require("exceljs");
                const roleFileName = "falcon-crud-" + (meta.identifier || "default").replace(/[^a-zA-Z0-9._-]/g, "_") + ".xlsx";
                const outRolePath = path.join(rbacRoleDir, roleFileName);
                const templatePath = path.resolve(__dirname, "..", "_template", "EXCEL", "ex-crud", "template-RBAC_ROLE.xlsx");
                let roleWorkbook;
                if (fs.existsSync(templatePath)) {
                    roleWorkbook = await new ExcelJS.Workbook().xlsx.readFile(templatePath);
                    const wsRole = roleWorkbook.getWorksheet("DATA-PERM") || roleWorkbook.worksheets[0];
                    if (wsRole) {
                        const tableNameRole = "R_ROLE_PERM";
                        let dataStartRow = 1;
                        let colRole = 1;
                        let colPerm = 2;
                        for (let r = 1; r <= 100; r++) {
                            const first = wsRole.getRow(r).getCell(1).value;
                            const v = first != null ? String(first).trim() : "";
                            if (v === "{TABLE}") {
                                const t2 = wsRole.getRow(r).getCell(2).value;
                                const tname = t2 != null ? String(t2).trim() : "";
                                if (tname === tableNameRole) {
                                    dataStartRow = r + 3;
                                    const enRow = wsRole.getRow(r + 2);
                                    enRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                                        const val = cell && cell.value != null ? String(cell.value).trim() : "";
                                        if (val === "roleId" || val === "ROLE_ID") colRole = colNumber;
                                        if (val === "permId" || val === "PERM_ID") colPerm = colNumber;
                                    });
                                    break;
                                }
                            }
                        }
                        rolePermsToWrite.forEach((pair, idx) => {
                            const row = wsRole.getRow(dataStartRow + idx);
                            row.getCell(colRole).value = pair.ROLE_ID;
                            row.getCell(colPerm).value = pair.PERM_ID;
                        });
                    }
                } else {
                    roleWorkbook = new ExcelJS.Workbook();
                    const wsRole = roleWorkbook.addWorksheet("DATA-PERM");
                    wsRole.addRow([]);
                    wsRole.addRow([]);
                    wsRole.addRow(["{TABLE}", "R_ROLE_PERM", "角色和权限关系", "", ""]);
                    wsRole.addRow(["角色ID", "权限ID"]);
                    wsRole.addRow(["roleId", "permId"]);
                    rolePermsToWrite.forEach((p) => wsRole.addRow([p.ROLE_ID, p.PERM_ID]));
                }
                await roleWorkbook.xlsx.writeFile(outRolePath);
                Ec.info("[ex-crud] 已写入 RBAC_ROLE/ADMIN.SUPER：" + outRolePath);
            }
        } catch (err) {
            Ec.error("[ex-crud] 数据库或 falcon 写入失败：" + (err && err.message));
            if (err && err.stack) Ec.info(err.stack);
        } finally {
            if (conn) await conn.end();
        }
    }

    Ec.info("[ex-crud] ✅ 执行完成");
    Ec.info("[ex-crud] 📋 汇总：");
    Ec.info("[ex-crud]   📁 RBAC_CRUD = " + rbacCrudDir);
    if (permissionIds.length > 0) Ec.info("[ex-crud]   🔑 S_PERMISSION UUID 数 = " + permissionIds.length);
    if (roleIds.length > 0) Ec.info("[ex-crud]   👥 授权角色数 = " + roleIds.length);
};
