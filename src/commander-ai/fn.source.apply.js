const Ec = require("../epic");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const inquirer = require("inquirer");

module.exports = async (options) => {
    try {
        const outputPath = options.output || ".";
        const repoUrl = "git@gitee.com:silentbalanceyh/r2mo-ai.git";
        const repoName = "r2mo-ai"; // 从仓库 URL 提取仓库名称
        const repoCache = path.resolve(outputPath, ".r2mo/repo", repoName);
        const cursorRulesSource = path.join(repoCache, ".cursor/rules");
        const cursorRulesTarget = path.resolve(outputPath, ".cursor/rules");

        Ec.execute(`准备从远程仓库下载 Cursor 规则配置...`);

        if (!fs.existsSync(path.dirname(repoCache))) {
            fs.mkdirSync(path.dirname(repoCache), { recursive: true });
        }

        if (fs.existsSync(repoCache)) {
            Ec.execute(`仓库缓存已存在，正在更新...`);
            try {
                execSync("git pull", { cwd: repoCache, stdio: "inherit" });
            } catch (error) {
                execSync(`rm -rf ${repoCache}`, { stdio: "inherit" });
                execSync(`git clone ${repoUrl} ${repoCache}`, { stdio: "inherit" });
            }
        } else {
            Ec.execute(`正在克隆仓库...`);
            execSync(`git clone ${repoUrl} ${repoCache}`, { stdio: "inherit" });
        }

        // 确保 .r2mo/repo 在 .gitignore 中
        const gitignorePath = path.resolve(outputPath, ".gitignore");
        const ignoreEntry = ".r2mo/repo/";

        if (fs.existsSync(gitignorePath)) {
            const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
            // 检查是否已存在 .r2mo/repo 相关的条目
            const hasIgnoreEntry = gitignoreContent.split('\n').some(line => {
                const trimmed = line.trim();
                return trimmed === ".r2mo/repo" || trimmed === ".r2mo/repo/";
            });

            if (!hasIgnoreEntry) {
                // 追加到 .gitignore 文件
                const newContent = gitignoreContent.endsWith("\n")
                    ? `${gitignoreContent}${ignoreEntry}\n`
                    : `${gitignoreContent}\n${ignoreEntry}\n`;
                fs.writeFileSync(gitignorePath, newContent, "utf-8");
                Ec.info(`已将 ${ignoreEntry} 添加到 .gitignore 文件中`);
            }
        } else {
            // 创建新的 .gitignore 文件
            fs.writeFileSync(gitignorePath, `${ignoreEntry}\n`, "utf-8");
            Ec.info(`已创建 .gitignore 文件并添加 ${ignoreEntry}`);
        }

        if (!fs.existsSync(cursorRulesSource)) {
            Ec.error(`仓库中不存在 .cursor/rules 目录！`);
            process.exit(1);
        }

        // 过滤出所有 .mdc 文件
        const ruleFiles = fs.readdirSync(cursorRulesSource).filter(file => {
            const filePath = path.join(cursorRulesSource, file);
            return fs.statSync(filePath).isFile() && file.endsWith('.mdc');
        });

        if (ruleFiles.length === 0) {
            Ec.error(`.cursor/rules 目录中没有找到任何 .mdc 规则文件！`);
            process.exit(1);
        }

        Ec.execute(`找到 ${ruleFiles.length} 个 Cursor 规则文件 (.mdc)`);

        // 显示文件列表
        ruleFiles.forEach((file, index) => {
            Ec.info(`  ${index + 1}. ${file}`);
        });

        const { selectedFiles } = await inquirer.prompt([
            {
                type: "checkbox",
                name: "selectedFiles",
                message: "请选择要安装的 Cursor 规则文件：",
                choices: ruleFiles.map(file => ({
                    name: file,
                    value: file,
                    checked: false
                }))
            }
        ]);

        if (selectedFiles.length === 0) {
            Ec.info(`未选择任何文件，操作取消。`);
            process.exit(0);
        }

        if (!fs.existsSync(cursorRulesTarget)) {
            fs.mkdirSync(cursorRulesTarget, { recursive: true });
            Ec.info(`创建目标目录：${cursorRulesTarget}`);
        }

        Ec.execute(`正在安装选中的 ${selectedFiles.length} 个规则文件...`);
        selectedFiles.forEach(file => {
            const sourcePath = path.join(cursorRulesSource, file);
            const targetPath = path.join(cursorRulesTarget, file);
            fs.copyFileSync(sourcePath, targetPath);
            Ec.info(`  ✓ ${file} 已安装`);
        });

        Ec.info(`所有规则文件安装完成！`);
        Ec.info(`安装位置：${cursorRulesTarget}`);
        Ec.info(`已安装 ${selectedFiles.length} 个规则文件`);

    } catch (error) {
        Ec.error(`操作失败：${error.message}`);
        process.exit(1);
    }
}
