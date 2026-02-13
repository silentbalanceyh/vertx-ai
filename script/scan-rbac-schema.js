#!/usr/bin/env node
/**
 * 扫描 RBAC 相关表结构，输出列信息，用于对齐 ai ex-api 等命令的 SQL 列名。
 * 使用前请 source .r2mo/app.env 或设置环境变量：
 *   Z_DB_HOST, Z_DB_PORT, Z_DB_APP_USER, Z_DB_APP_PASS, Z_DBS_INSTANCE
 * 运行：node script/scan-rbac-schema.js
 * 可选：--write 将结果写入 .r2mo/task/rbac-schema.txt
 */
const path = require("path");
const fs = require("fs");

const cwd = process.cwd();

function getArtifactIdFromPom(dir) {
    const pomPath = path.resolve(dir, "pom.xml");
    if (!fs.existsSync(pomPath)) return null;
    let content = fs.readFileSync(pomPath, "utf-8");
    content = content.replace(/<parent>[\s\S]*?<\/parent>/i, "");
    const m = content.match(/<artifactId>([^<]+)<\/artifactId>/);
    return m ? m[1].trim() : null;
}

function resolveAppEnvPath(dir) {
    const primary = path.resolve(dir, ".r2mo", "app.env");
    if (fs.existsSync(primary)) return primary;
    const artifactId = getArtifactIdFromPom(dir) || path.basename(dir);
    if (artifactId && artifactId !== ".") {
        const apiEnv = path.resolve(dir, artifactId + "-api", ".r2mo", "app.env");
        if (fs.existsSync(apiEnv)) return apiEnv;
    }
    return primary;
}

const appEnvPath = resolveAppEnvPath(cwd);
if (fs.existsSync(appEnvPath)) {
    const content = fs.readFileSync(appEnvPath, "utf-8");
    content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || !trimmed.startsWith("export ")) return;
        const match = trimmed.match(/^export\s+([A-Za-z0-9_]+)=["']?([^"'\n]*)["']?/);
        if (match) process.env[match[1]] = match[2].trim();
    });
}

const required = ["Z_DB_APP_USER", "Z_DB_APP_PASS", "Z_DBS_INSTANCE"];
const missing = required.filter((k) => !process.env[k] || !String(process.env[k]).trim());
if (missing.length > 0) {
    console.error("缺少环境变量：" + missing.join(", "));
    console.error("请 source .r2mo/app.env 或设置 Z_DB_APP_USER, Z_DB_APP_PASS, Z_DBS_INSTANCE");
    process.exit(1);
}

const mysql = require("mysql2/promise");
const dbConfig = {
    host: process.env.Z_DB_HOST || "127.0.0.1",
    port: parseInt(process.env.Z_DB_PORT || "3306", 10),
    user: process.env.Z_DB_APP_USER,
    password: process.env.Z_DB_APP_PASS,
    database: process.env.Z_DBS_INSTANCE
};

const TABLES = ["S_RESOURCE", "S_ACTION", "S_PERMISSION", "S_PERM_SET", "R_ROLE_PERM"];

async function main() {
    const conn = await mysql.createConnection(dbConfig);
    const lines = [];
    try {
        const header = "数据库：" + dbConfig.database + " @ " + dbConfig.host + ":" + dbConfig.port;
        console.log(header);
        lines.push(header);
        lines.push("（以下列名用于对齐 ai ex-api / ex-perm 等命令的 SQL，请勿手写列名，以扫描为准）");
        lines.push("---");
        for (const table of TABLES) {
            try {
                const [rows] = await conn.execute("SHOW COLUMNS FROM `" + table.replace(/`/g, "") + "`");
                const columns = rows.map((r) => r.Field);
                const line = table + " 列：" + columns.join(", ");
                console.log(line);
                lines.push(line);
            } catch (e) {
                const msg = table + "：表不存在或无权限 - " + e.message;
                console.log(msg);
                lines.push(msg);
            }
        }
    } finally {
        await conn.end();
    }
    const writeOut = process.argv.includes("--write");
    if (writeOut && lines.length > 0) {
        const outPath = path.resolve(cwd, ".r2mo", "task", "rbac-schema.txt");
        const dir = path.dirname(outPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf-8");
        console.log("已写入：" + outPath);
    }
}

main().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
