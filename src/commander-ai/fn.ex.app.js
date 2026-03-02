"use strict";

const Ec = require("../epic");
const fs = require("fs");
const path = require("path");
const Ut = require("../commander-shared");
const inquirer = require("inquirer");

const REQUIRED_ENV_DB = ["Z_DBS_INSTANCE", "Z_DB_APP_USER", "Z_DB_APP_PASS"];

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

/**
 * 检查环境变量是否齐全
 */
function checkEnv(keys) {
    const missing = keys.filter((k) => !process.env[k] || !String(process.env[k]).trim());
    if (missing.length > 0) {
        Ec.error("环境变量不齐，以下前置条件必须全部已设置，否则不执行。");
        Ec.info("当前缺失的环境变量：" + missing.join(", "));
        Ec.info("请确保以下环境变量已设置（可在 .r2mo/app.env 中 export）：");
        Ec.info("  Z_DBS_INSTANCE    # 数据库实例名");
        Ec.info("  Z_DB_APP_USER     # 数据库账号");
        Ec.info("  Z_DB_APP_PASS     # 数据库密码");
        process.exit(1);
    }
}

/**
 * 获取缓存目录路径
 */
function getCacheDir(cwd) {
    const r2moHome = process.env.R2MO_HOME;
    if (r2moHome && r2moHome.trim()) {
        const dir = path.resolve(r2moHome.trim(), "apps");
        Ec.info(`使用 R2MO_HOME 缓存目录：${dir}`);
        return dir;
    }
    const dir = path.resolve(cwd, "apps");
    Ec.info(`使用当前目录缓存：${dir}`);
    return dir;
}

/**
 * 递归删除目录
 */
function removeDir(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            removeDir(filePath);
        } else {
            fs.unlinkSync(filePath);
        }
    }
    fs.rmdirSync(dirPath);
}

module.exports = async (options) => {
    try {
        Ec.execute("ai ex-app：清理缓存目录中不存在于数据库的应用实例");

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
        checkEnv(REQUIRED_ENV_DB);
        Ec.info(`✓ 环境变量检查通过：${REQUIRED_ENV_DB.join(", ")}`);

        // 3. 连接数据库并查询 X_APP 表
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
        let dbAppIds = [];

        try {
            Ec.execute("查询 X_APP 表，提取所有应用 ID…");
            const [rows] = await conn.execute("SELECT `id` FROM X_APP");
            dbAppIds = rows.map((row) => String(row.id).trim()).filter((id) => id);
            Ec.info(`✓ 数据库中共有 ${dbAppIds.length} 个应用：${dbAppIds.join(", ")}`);
        } finally {
            await conn.end();
        }

        // 4. 检查缓存目录
        const cacheDir = getCacheDir(cwd);

        if (!fs.existsSync(cacheDir)) {
            Ec.info(`缓存目录不存在：${cacheDir}`);
            Ec.info("无需清理，任务完成。");
            return;
        }

        // 5. 汇总缓存中不存在于数据库的应用实例
        const cacheDirs = fs.readdirSync(cacheDir).filter((name) => {
            const fullPath = path.join(cacheDir, name);
            return fs.statSync(fullPath).isDirectory();
        });

        Ec.info(`✓ 缓存目录中共有 ${cacheDirs.length} 个子目录`);

        const orphanDirs = cacheDirs.filter((dirName) => !dbAppIds.includes(dirName));

        if (orphanDirs.length === 0) {
            Ec.info("✓ 缓存目录中所有应用实例均存在于数据库中，无需清理。");
            return;
        }

        Ec.info(`发现 ${orphanDirs.length} 个孤立的缓存目录（数据库中不存在）：`);
        orphanDirs.forEach((dir) => {
            const fullPath = path.join(cacheDir, dir);
            Ec.info(`  - ${dir} (${fullPath})`);
        });

        // 6. 询问用户是否删除
        const { confirm } = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirm",
                message: `确认删除以上 ${orphanDirs.length} 个孤立的缓存目录？`,
                default: false
            }
        ]);

        if (!confirm) {
            Ec.info("用户取消操作，未删除任何目录。");
            return;
        }

        // 7. 删除孤立的缓存目录
        Ec.execute(`开始删除 ${orphanDirs.length} 个孤立的缓存目录…`);
        let deletedCount = 0;
        let failedCount = 0;

        for (const dirName of orphanDirs) {
            const fullPath = path.join(cacheDir, dirName);
            try {
                removeDir(fullPath);
                Ec.info(`✓ 已删除：${dirName}`);
                deletedCount++;
            } catch (err) {
                Ec.error(`✗ 删除失败：${dirName}，错误：${err.message}`);
                failedCount++;
            }
        }

        Ec.execute(`清理完成：成功删除 ${deletedCount} 个目录，失败 ${failedCount} 个。`);
    } catch (err) {
        Ec.error("执行失败：" + err.message);
        if (err.stack) Ec.info(err.stack);
        process.exit(1);
    }
};
