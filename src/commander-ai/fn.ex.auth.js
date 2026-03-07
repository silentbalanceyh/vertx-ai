"use strict";

const Ec = require("../epic");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

module.exports = async (options) => {
    try {
        Ec.execute("ai auth：从 ZERO_MODULE 扩展模块同步 RBAC 角色权限 YAML 文件");

        // 1. 检查 ZERO_MODULE 环境变量
        const zeroModule = process.env.ZERO_MODULE;
        if (!zeroModule || !zeroModule.trim()) {
            Ec.error("环境变量 ZERO_MODULE 未配置，无法执行同步操作");
            Ec.info("请设置 ZERO_MODULE 环境变量指向扩展模块根目录");
            process.exit(1);
        }

        if (!fs.existsSync(zeroModule)) {
            Ec.error(`ZERO_MODULE 路径不存在：${zeroModule}`);
            process.exit(1);
        }

        Ec.info(`✓ ZERO_MODULE: ${zeroModule}`);

        // 2. 按固定规律扫描：zero-exmodule-{name}/zero-exmodule-{name}-domain/src/main/resources/plugins/zero-exmodule-{name}/security/RBAC_ROLE/ADMIN.SUPER/*.yml
        const moduleDirEntries = fs.readdirSync(zeroModule);
        const exModules = moduleDirEntries.filter(name => name.startsWith("zero-exmodule-") && fs.statSync(path.join(zeroModule, name)).isDirectory());

        if (exModules.length === 0) {
            Ec.error("未找到任何 zero-exmodule-* 目录");
            process.exit(1);
        }

        const sourceYmlFiles = [];
        for (const mod of exModules) {
            const securityPath = path.join(zeroModule, mod, `${mod}-domain`, "src/main/resources/plugins", mod, "security/RBAC_ROLE/ADMIN.SUPER");
            if (fs.existsSync(securityPath)) {
                try {
                    const files = fs.readdirSync(securityPath).filter(f => f.endsWith(".yml"));
                    files.forEach(f => {
                        sourceYmlFiles.push({
                            module: mod,
                            file: f,
                            fullPath: path.join(securityPath, f)
                        });
                    });
                } catch (err) {
                    // 忽略读取错误
                }
            }
        }

        if (sourceYmlFiles.length === 0) {
            Ec.error("未找到任何 security/RBAC_ROLE/ADMIN.SUPER/*.yml 文件");
            Ec.info(`已扫描 ${exModules.length} 个模块，路径规律：{mod}/{mod}-domain/src/main/resources/plugins/{mod}/security/RBAC_ROLE/ADMIN.SUPER/`);
            process.exit(1);
        }

        const hitModules = new Set(sourceYmlFiles.map(item => item.module)).size;
        Ec.info(`✓ 扫描完成：${exModules.length} 个模块，${hitModules} 个命中，${sourceYmlFiles.length} 个 YAML 文件`);
        Ec.info(`✓ 找到 ${sourceYmlFiles.length} 个源 YAML 文件：`);
        sourceYmlFiles.forEach(({ module: mod, file }) => {
            Ec.info(`  [${mod}] ${file}`);
        });

        // 3. 检查当前项目的目标目录
        const cwd = process.cwd();
        const targetBase = path.resolve(cwd, "src/main/resources/init/oob/RBAC_ROLE");
        if (!fs.existsSync(targetBase)) {
            Ec.error(`目标目录不存在：${targetBase}`);
            Ec.info("请在包含 src/main/resources/init/oob/RBAC_ROLE 的 Maven 项目根目录下执行");
            process.exit(1);
        }

        // 4. 枚举目标角色目录让用户选择
        const roleDirs = fs.readdirSync(targetBase).filter(entry => {
            return fs.statSync(path.join(targetBase, entry)).isDirectory();
        });

        if (roleDirs.length === 0) {
            Ec.error(`目标目录下没有角色子目录：${targetBase}`);
            process.exit(1);
        }

        Ec.info(`\n目标目录：${targetBase}`);

        const { selectedRoles } = await inquirer.prompt([
            {
                type: "checkbox",
                name: "selectedRoles",
                message: "请选择要同步的角色目录（默认全选）：",
                choices: roleDirs,
                default: roleDirs,
                loop: false
            }
        ]);

        if (!selectedRoles || selectedRoles.length === 0) {
            Ec.info("未选择任何角色目录，退出");
            process.exit(0);
        }

        const { confirmOverwrite } = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirmOverwrite",
                message: `是否覆盖以上 ${selectedRoles.length} 个角色目录中的 YAML 文件？`,
                default: false
            }
        ]);

        if (!confirmOverwrite) {
            Ec.info("取消操作，退出");
            process.exit(0);
        }

        // 5. 执行拷贝
        let copiedCount = 0;
        for (const role of selectedRoles) {
            const roleTargetDir = path.join(targetBase, role);
            for (const { file, fullPath: srcPath } of sourceYmlFiles) {
                const destPath = path.join(roleTargetDir, file);
                fs.copyFileSync(srcPath, destPath);
                Ec.info(`  [${role}] ${file} -> 已覆盖`);
                copiedCount++;
            }
        }

        Ec.info(`\n✓ 同步完成，共拷贝 ${copiedCount} 个文件到 ${selectedRoles.length} 个角色目录`);
    } catch (err) {
        Ec.error(`ai auth 执行失败：${err.message}`);
        process.exit(1);
    }
};
