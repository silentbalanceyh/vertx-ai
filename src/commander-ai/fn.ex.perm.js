const Ec = require("../epic");
const fs = require("fs");
const path = require("path");
const Ut = require("../commander-shared");

const REF_ROLE_ID = "e501b47a-c08b-4c83-b12b-95ad82873e96";
const REQUIRED_ENV_KEYS = [
    "Z_DB_TYPE",        // 数据库类型: MYSQL / SQLSERVER / ORACLE / POSTGRESQL
    "Z_DB_HOST",       // 数据库主机
    "Z_DB_PORT",       // 数据库端口
    "Z_DBS_INSTANCE",  // 业务数据库实例名
    "Z_DB_APP_USER",   // 数据库用户
    "Z_DB_APP_PASS"    // 数据库密码
];

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
        const parsed = Ut.parseArgument(options);
        const roleInput = parsed.role;
        if (!roleInput || !String(roleInput).trim()) {
            Ec.error("缺少必需参数：角色（NAME 或 CODE）");
            Ec.info("参数格式：");
            Ec.info("  -r <角色>    或  --role <角色>");
            Ec.info("示例：");
            Ec.info("  ai ex-perm -r 管理员");
            Ec.info("  ai ex-perm --role ADMIN");
            process.exit(1);
        }

        Ec.execute(`ai ex-perm：目标角色（-r / --role）= ${roleInput}`);

        const cwd = process.cwd();
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
        Ec.info(`已加载环境变量：${appEnvPath}`);

        // 直接检查环境变量（不依赖文件内容；可来自 .r2mo/app.env 或当前 shell 已 export）
        const missing = REQUIRED_ENV_KEYS.filter((k) => !process.env[k] || !String(process.env[k]).trim());
        if (missing.length > 0) {
            Ec.error("环境变量不齐，以下前置条件必须全部已设置，否则不执行。");
            Ec.info("当前缺失的环境变量：" + missing.join(", "));
            Ec.info("请确保以下环境变量已设置（可在 .r2mo/app.env 中 export，或在当前 shell 中 export）：");
            Ec.info("  Z_DB_TYPE         # 数据库类型: MYSQL / SQLSERVER / ORACLE / POSTGRESQL");
            Ec.info("  Z_DB_HOST         # 数据库主机，如 127.0.0.1");
            Ec.info("  Z_DB_PORT         # 数据库端口，如 3306");
            Ec.info("  Z_DBS_INSTANCE    # 业务数据库实例名");
            Ec.info("  Z_DB_APP_USER     # 数据库用户");
            Ec.info("  Z_DB_APP_PASS     # 数据库密码");
            process.exit(1);
        }

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
            Ec.execute("查询 S_ROLE 表：按 NAME 或 CODE 匹配角色…");
            const [rowsRole] = await conn.execute(
                "SELECT ID, NAME, CODE FROM S_ROLE WHERE NAME = ? OR CODE = ? LIMIT 1",
                [roleInput.trim(), roleInput.trim()]
            );
            if (!rowsRole || rowsRole.length === 0) {
                Ec.error(`查询不到角色：${roleInput}`);
                Ec.info("请确认 S_ROLE 表中存在该 NAME 或 CODE；可在库中执行：SELECT ID, NAME, CODE FROM S_ROLE; 查看已有角色。");
                process.exit(1);
            }
            const targetRoleId = rowsRole[0].ID;
            Ec.info(`已找到角色：ID=${targetRoleId}，NAME=${rowsRole[0].NAME || "-"}，CODE=${rowsRole[0].CODE || "-"}`);

            Ec.execute(`查询参考角色权限：R_ROLE_PERM，ROLE_ID = ${REF_ROLE_ID}`);
            const [refPerms] = await conn.execute(
                "SELECT * FROM R_ROLE_PERM WHERE ROLE_ID = ?",
                [REF_ROLE_ID]
            );
            if (!refPerms || refPerms.length === 0) {
                Ec.info(`参考角色 ${REF_ROLE_ID} 在 R_ROLE_PERM 中无记录，无需复制。`);
                return;
            }
            Ec.info(`参考角色共 ${refPerms.length} 条权限，开始复制到角色 ${targetRoleId}…`);

            const columns = Object.keys(refPerms[0]);
            const placeholders = columns.map(() => "?").join(", ");
            const colList = columns.map((c) => "`" + c + "`").join(", ");
            let inserted = 0;
            let skipped = 0;

            for (const row of refPerms) {
                const values = columns.map((col) => (col === "ROLE_ID" ? targetRoleId : row[col]));
                try {
                    const [result] = await conn.execute(
                        `INSERT IGNORE INTO R_ROLE_PERM (${colList}) VALUES (${placeholders})`,
                        values
                    );
                    if (result && result.affectedRows > 0) inserted++;
                    else skipped++;
                } catch (err) {
                    if (err.code === "ER_DUP_ENTRY" || err.errno === 1062) skipped++;
                    else throw err;
                }
            }

            // Report：详细汇总
            const sep = "----------------------------------------";
            Ec.info(sep);
            Ec.info("  ai perm 执行报告");
            Ec.info(sep);
            Ec.info("  ⚙️  环境");
            Ec.info(`    app.env     : ${appEnvPath}`);
            Ec.info(`    数据库类型  : ${process.env.Z_DB_TYPE || "-"}`);
            Ec.info(`    数据库实例  : ${dbConfig.database}`);
            Ec.info(`    连接地址    : ${dbConfig.host}:${dbConfig.port}`);
            Ec.info(`    数据库用户  : ${dbConfig.user}`);
            Ec.info("  👤  目标角色（-r 指定）");
            Ec.info(`    输入        : ${roleInput}`);
            Ec.info(`    ID         : ${targetRoleId}`);
            Ec.info(`    NAME       : ${rowsRole[0].NAME ?? "-"}`);
            Ec.info(`    CODE       : ${rowsRole[0].CODE ?? "-"}`);
            Ec.info("  📋  参考角色（复制来源）");
            Ec.info(`    ROLE_ID    : ${REF_ROLE_ID}`);
            Ec.info(`    R_ROLE_PERM 条数 : ${refPerms.length}`);
            Ec.info("  ✅  权限复制结果");
            Ec.info(`    本次插入   : ${inserted} 条`);
            Ec.info(`    重复跳过   : ${skipped} 条`);
            Ec.info(`    合计处理   : ${inserted + skipped} 条`);
            Ec.info(sep);
        } finally {
            await conn.end();
        }
    } catch (err) {
        Ec.error(`执行失败：${err.message}`);
        if (err.code) Ec.info(`错误码：${err.code}`);
        process.exit(1);
    }
};
