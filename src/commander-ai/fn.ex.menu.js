"use strict";

const Ec = require("../epic");
const fs = require("fs");
const path = require("path");
const Ut = require("../commander-shared");
const inquirer = require("inquirer");

const REQUIRED_ENV_DB = ["Z_DB_HOST", "Z_DB_PORT", "Z_DBS_INSTANCE", "Z_DB_APP_USER", "Z_DB_APP_PASS"];

/**
 * 从 pom.xml 读取当前项目的 artifactId（排除 <parent> 内的）
 */
function getArtifactIdFromPom(cwd) {
    const pomPath = path.resolve(cwd, "pom.xml");
    if (!fs.existsSync(pomPath)) return null;
    let content = fs.readFileSync(pomPath, "utf-8");
    content = content.replace(/<parent>[\s\S]*?<\/parent>/i, "");
    const m = content.match(/<artifactId>([^<]+)<\/artifactId>/);
    return m ? m[1].trim() : null;
}

/**
 * 解析 app.env：export KEY="value" 或 export KEY='value'，写入 process.env
 */
function loadAppEnv(filePath) {
    if (!fs.existsSync(filePath)) return false;
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || !trimmed.startsWith("export ")) continue;
        const match = trimmed.match(/^export\s+([A-Za-z0-9_]+)=["']?([^"'\n]*)["']?/);
        if (match) process.env[match[1]] = match[2].trim();
    }
    return true;
}

/**
 * 解析 .r2mo/app.env 路径：
 * ONE：当前目录 .r2mo/app.env
 * DPA：{id}-api/.r2mo/app.env，id 来自 pom.xml 或当前目录名
 * 支持两种布局：api 在项目内 (cwd/{id}-api) 或 与项目并列 (cwd/../{id}-api)
 */
function resolveAppEnvPath(cwd) {
    const primary = path.resolve(cwd, ".r2mo", "app.env");
    if (fs.existsSync(primary)) return primary;

    let artifactId = getArtifactIdFromPom(cwd);
    if (!artifactId) {
        const base = path.basename(cwd);
        if (base && base !== ".") artifactId = base;
    }
    if (artifactId) {
        const apiDir = `${artifactId}-api`;
        const nested = path.resolve(cwd, apiDir, ".r2mo", "app.env");
        if (fs.existsSync(nested)) return nested;
        const sibling = path.resolve(cwd, "..", apiDir, ".r2mo", "app.env");
        if (fs.existsSync(sibling)) return sibling;
    }
    return null;
}

module.exports = async (options) => {
    try {
        Ec.execute("ai ex-menu：从数据库 X_MENU 表生成角色菜单权限 JSON 文件");

        const cwd = process.cwd();

        // 1. 加载 .r2mo/app.env 环境变量
        const appEnvPath = resolveAppEnvPath(cwd);
        if (!appEnvPath) {
            const tried = [path.resolve(cwd, ".r2mo", "app.env")];
            const id = getArtifactIdFromPom(cwd) || path.basename(cwd);
            if (id) {
                tried.push(path.resolve(cwd, `${id}-api`, ".r2mo", "app.env"));
                tried.push(path.resolve(cwd, "..", `${id}-api`, ".r2mo", "app.env"));
            }
            Ec.error(".r2mo/app.env 不存在；DPA 下也未找到 {id}-api/.r2mo/app.env");
            Ec.info("已尝试路径（id=" + (id || "未解析") + "）：");
            tried.forEach((p) => Ec.info(`  - ${p}`));
            Ec.info("请确认：1) 在项目根执行  2) 存在 .r2mo/app.env 或 {id}-api/.r2mo/app.env（嵌套或与项目并列）");
            process.exit(1);
        }

        loadAppEnv(appEnvPath);
        Ec.info(`✓ 已加载环境变量：${appEnvPath}`);

        // 2. 检查数据库核心环境变量
        const missing = REQUIRED_ENV_DB.filter((k) => !process.env[k] || !String(process.env[k]).trim());
        if (missing.length > 0) {
            Ec.error("环境变量不齐，以下前置条件必须全部已设置，否则不执行。");
            Ec.info("当前缺失的环境变量：" + missing.join(", "));
            Ec.info("请确保以下环境变量已设置（可在 .r2mo/app.env 中 export）：");
            Ec.info("  Z_DB_HOST         # 数据库主机，如 127.0.0.1");
            Ec.info("  Z_DB_PORT         # 数据库端口，如 3306");
            Ec.info("  Z_DBS_INSTANCE    # 业务数据库实例名");
            Ec.info("  Z_DB_APP_USER     # 数据库用户");
            Ec.info("  Z_DB_APP_PASS     # 数据库密码");
            process.exit(1);
        }
        Ec.info(`✓ 环境变量检查通过：${REQUIRED_ENV_DB.join(", ")}`);

        // 3. 连接数据库
        const mysql = require("mysql2/promise");
        const dbConfig = {
            host: process.env.Z_DB_HOST || "localhost",
            port: parseInt(process.env.Z_DB_PORT || "3306", 10),
            user: process.env.Z_DB_APP_USER,
            password: process.env.Z_DB_APP_PASS,
            database: process.env.Z_DBS_INSTANCE
        };

        Ec.execute(`连接数据库：${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}（用户 ${dbConfig.user}）`);

        const conn = await mysql.createConnection(dbConfig);

        try {
            // 4. 查询 S_ROLE 表，列出所有角色
            Ec.execute("查询 S_ROLE 表，列出所有角色…");
            const [roleRows] = await conn.execute("SELECT ID, NAME, CODE FROM S_ROLE ORDER BY NAME");

            if (!roleRows || roleRows.length === 0) {
                Ec.error("S_ROLE 表中无角色，无法继续");
                process.exit(1);
            }

            Ec.info(`✓ 查询到 ${roleRows.length} 个角色`);

            // 5. 用户单选角色（提示：菜单全开放模式，建议选择开发人员角色）
            const roleChoices = roleRows.map((r) => ({
                name: `${r.NAME || r.CODE || r.ID} (CODE: ${r.CODE || "-"})`,
                value: r
            }));

            const { selectedRole } = await inquirer.prompt([
                {
                    type: "list",
                    name: "selectedRole",
                    message: "⚠️  菜单全开放模式：请选择一个角色（建议选择开发人员角色 ADMIN.DEVELOPER）",
                    choices: roleChoices
                }
            ]);

            const roleCode = selectedRole.CODE;
            if (!roleCode || !roleCode.trim()) {
                Ec.error("所选角色的 CODE 为空，无法继续");
                process.exit(1);
            }

            Ec.info(`✓ 已选择角色：${selectedRole.NAME || "-"} (CODE: ${roleCode})`);

            // 6. 查询 X_MENU 表，生成 NAME 数组
            Ec.execute("查询 X_MENU 表，生成 NAME 数组…");
            const [menuRows] = await conn.execute(
                "SELECT NAME FROM X_MENU ORDER BY `ORDER`, LEVEL, NAME"
            );

            const nameArray = menuRows.map((row) => row.NAME).filter((name) => name && name.trim());
            Ec.info(`✓ 查询到 ${nameArray.length} 个菜单项`);

            // 7. 查询 X_MENU 表，生成层级文本数组
            Ec.execute("查询 X_MENU 表，生成层级文本数组…");
            const [hierarchyRows] = await conn.execute(
                "SELECT ID, IFNULL(PARENT_ID,'') AS PARENT_ID, NAME, IFNULL(TEXT,NAME) AS TEXT, IFNULL(`ORDER`,0) AS `ORDER` FROM X_MENU"
            );

            // 构建菜单字典（按 ID 索引）
            const byId = {};
            hierarchyRows.forEach((row) => {
                byId[row.ID] = {
                    id: row.ID,
                    pid: row.PARENT_ID || null,
                    name: row.NAME,
                    text: row.TEXT,
                    order: parseInt(row.ORDER, 10) || 0
                };
            });

            // 构建父子关系映射
            const children = {};
            Object.values(byId).forEach((node) => {
                if (!children[node.pid]) children[node.pid] = [];
                children[node.pid].push(node);
            });

            // 对每个父节点的子节点按 ORDER 和 NAME 排序
            Object.keys(children).forEach((pid) => {
                children[pid].sort((a, b) => {
                    if (a.order !== b.order) return a.order - b.order;
                    return a.name.localeCompare(b.name);
                });
            });

            // 递归遍历生成带缩进的文本数组
            const hierarchyArray = [];
            function walk(pid, depth) {
                const nodes = children[pid] || [];
                nodes.forEach((node) => {
                    const indent = " ".repeat(4 * (depth - 1));
                    hierarchyArray.push(indent + node.text);
                    walk(node.id, depth + 1);
                });
            }
            walk(null, 1);

            Ec.info(`✓ 生成层级文本数组，共 ${hierarchyArray.length} 项`);

            // 8. 写入文件
            const targetDir = path.resolve(cwd, "src", "main", "resources", "init", "permission", "ui.menu");
            const roleDir = path.join(targetDir, "role");

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            if (!fs.existsSync(roleDir)) {
                fs.mkdirSync(roleDir, { recursive: true });
            }

            const nameJsonPath = path.join(targetDir, `${roleCode}.json`);
            const hierarchyJsonPath = path.join(roleDir, `${roleCode}.json`);

            const nameJson = { name: nameArray };
            fs.writeFileSync(nameJsonPath, JSON.stringify(nameJson, null, 2), "utf-8");
            Ec.info(`✓ 已写入 NAME 数组：${nameJsonPath}`);

            fs.writeFileSync(hierarchyJsonPath, JSON.stringify(hierarchyArray, null, 2), "utf-8");
            Ec.info(`✓ 已写入层级文本数组：${hierarchyJsonPath}`);

            // 9. 汇总报告
            const sep = "----------------------------------------";
            Ec.info(sep);
            Ec.info("  ai ex-menu 执行报告");
            Ec.info(sep);
            Ec.info("  ⚙️  环境");
            Ec.info(`    app.env     : ${appEnvPath}`);
            Ec.info(`    数据库实例  : ${dbConfig.database}`);
            Ec.info(`    连接地址    : ${dbConfig.host}:${dbConfig.port}`);
            Ec.info(`    数据库用户  : ${dbConfig.user}`);
            Ec.info("  👤  目标角色");
            Ec.info(`    NAME       : ${selectedRole.NAME || "-"}`);
            Ec.info(`    CODE       : ${roleCode}`);
            Ec.info(`    ID         : ${selectedRole.ID}`);
            Ec.info("  📋  菜单数据");
            Ec.info(`    X_MENU 总数 : ${nameArray.length} 项`);
            Ec.info("  ✅  生成文件");
            Ec.info(`    NAME 数组   : ${nameJsonPath}`);
            Ec.info(`    层级文本数组 : ${hierarchyJsonPath}`);
            Ec.info(sep);
        } finally {
            await conn.end();
        }
    } catch (err) {
        Ec.error(`执行失败：${err.message}`);
        if (err.code) Ec.info(`错误码：${err.code}`);
        if (err.stack) Ec.info(err.stack);
        process.exit(1);
    }
};
