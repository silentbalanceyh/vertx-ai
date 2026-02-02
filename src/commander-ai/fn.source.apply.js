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
            Ec.info(`仓库中不存在 .cursor/rules 目录，正在创建...`);
            fs.mkdirSync(cursorRulesSource, { recursive: true });
            Ec.info(`已创建 ${cursorRulesSource} 目录`);
            Ec.info(`目录为空，请手动添加 .mdc 规则文件到远程仓库后重新运行`);
            process.exit(0);
        }

        // 过滤出所有 .mdc 文件
        const ruleFiles = fs.readdirSync(cursorRulesSource).filter(file => {
            const filePath = path.join(cursorRulesSource, file);
            return fs.statSync(filePath).isFile() && file.endsWith('.mdc');
        });

        if (ruleFiles.length === 0) {
            Ec.info(`.cursor/rules 目录中没有找到任何 .mdc 规则文件`);
            Ec.info(`目录路径：${cursorRulesSource}`);
            Ec.info(`请手动添加 .mdc 规则文件到远程仓库后重新运行`);
            process.exit(0);
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

        // 添加 AI 工具目录到 .git/info/exclude
        const excludeEntries = [".cursor/", ".claude/", ".gemini/"];
        const gitPath = path.resolve(outputPath, ".git");

        Ec.execute(`正在配置 Git 排除规则...`);

        // 检查 .git 是否存在以及其类型
        let isSubmodule = false;
        let parentRepoPath = outputPath;

        if (fs.existsSync(gitPath)) {
            const stats = fs.statSync(gitPath);
            if (stats.isFile()) {
                // 当前是 submodule，需要找到父仓库
                isSubmodule = true;
                Ec.info(`检测到当前仓库是 Git submodule`);
                Ec.info(`当前目录：${outputPath}`);

                // 向上查找父仓库（包含 .git 目录的仓库）
                let currentPath = path.resolve(outputPath, "..");
                let foundParent = false;

                Ec.info(`开始向上查找父仓库，起始路径：${currentPath}`);

                // 最多向上查找10层
                for (let i = 0; i < 10; i++) {
                    const parentGitPath = path.join(currentPath, ".git");
                    Ec.info(`[${i}] 检查路径：${currentPath}`);
                    Ec.info(`[${i}] .git 路径：${parentGitPath}`);

                    if (fs.existsSync(parentGitPath)) {
                        const parentStats = fs.statSync(parentGitPath);
                        Ec.info(`[${i}] .git 存在，是目录：${parentStats.isDirectory()}，是文件：${parentStats.isFile()}`);

                        if (parentStats.isDirectory()) {
                            parentRepoPath = currentPath;
                            foundParent = true;
                            Ec.info(`✓ 找到父仓库：${parentRepoPath}`);
                            break;
                        }
                    } else {
                        Ec.info(`[${i}] .git 不存在`);
                    }

                    // 到达根目录，停止查找
                    const nextPath = path.resolve(currentPath, "..");
                    if (nextPath === currentPath) {
                        Ec.info(`已到达根目录，停止查找`);
                        break;
                    }
                    currentPath = nextPath;
                }

                if (!foundParent) {
                    Ec.info(`✗ 未找到父仓库，将跳过 Git 排除规则配置`);
                    Ec.info(`parentRepoPath = ${parentRepoPath}`);
                    parentRepoPath = null;
                }
            }
        }

        if (isSubmodule) {
            // 当前是 submodule，需要在父仓库中操作
            if (!parentRepoPath || parentRepoPath === outputPath) {
                Ec.info(`未找到父仓库，跳过 Git 排除规则配置`);
            } else {
                Ec.execute(`正在为父仓库和所有 submodules 配置忽略规则...`);

                // 先从 Git 跟踪中移除这些目录（在父仓库中执行）
                excludeEntries.forEach(entry => {
                    const dirPath = entry.replace(/\/$/, "");
                    try {
                        const checkResult = execSync(`git ls-files ${dirPath}`, {
                            cwd: parentRepoPath,
                            encoding: 'utf-8',
                            stdio: ['pipe', 'pipe', 'ignore']
                        }).trim();

                        if (checkResult) {
                            execSync(`git rm -r --cached ${dirPath}`, {
                                cwd: parentRepoPath,
                                stdio: 'ignore'
                            });
                            Ec.info(`  ✓ 已从父仓库 Git 跟踪中移除 ${entry}`);
                        }
                    } catch (error) {
                        // 忽略错误
                    }
                });

                // 1. 给父仓库添加忽略规则
                Ec.execute(`正在为父仓库添加忽略规则...`);
                const parentGitInfoDir = path.join(parentRepoPath, ".git/info");

                try {
                    if (!fs.existsSync(parentGitInfoDir)) {
                        fs.mkdirSync(parentGitInfoDir, { recursive: true });
                    }

                    excludeEntries.forEach(entry => {
                        const excludeFilePath = path.join(parentGitInfoDir, "exclude");
                        let excludeContent = "";

                        if (fs.existsSync(excludeFilePath)) {
                            excludeContent = fs.readFileSync(excludeFilePath, "utf-8");
                        }

                        const lines = excludeContent.split('\n').map(line => line.trim());
                        const hasEntry = lines.some(line => line === entry || line === entry.replace(/\/$/, ""));

                        if (!hasEntry) {
                            const newContent = excludeContent.endsWith("\n") || excludeContent === ""
                                ? `${excludeContent}${entry}\n`
                                : `${excludeContent}\n${entry}\n`;
                            fs.writeFileSync(excludeFilePath, newContent, "utf-8");
                            Ec.info(`  ✓ 已添加 ${entry} 到父仓库 .git/info/exclude`);
                        }
                    });
                } catch (error) {
                    Ec.error(`配置父仓库忽略规则失败：${error.message}`);
                }

                // 2. 批量给所有 submodules 添加忽略规则
                Ec.execute(`正在为所有 submodules 添加忽略规则...`);

                excludeEntries.forEach(entry => {
                    try {
                        const command = `git submodule foreach --recursive 'mkdir -p $(git rev-parse --git-path info) && echo "${entry}" >> $(git rev-parse --git-path info/exclude)'`;
                        execSync(command, {
                            cwd: parentRepoPath,
                            stdio: 'ignore'
                        });
                        Ec.info(`  ✓ 已添加 ${entry} 到所有 submodules`);
                    } catch (error) {
                        Ec.error(`配置 submodules 忽略规则失败：${error.message}`);
                    }
                });

                Ec.info(`所有仓库的 Git 排除规则配置完成！`);
            }
        } else if (fs.existsSync(gitPath) && fs.statSync(gitPath).isDirectory()) {
            // 当前是普通仓库，只需要处理当前仓库
            const actualGitDir = gitPath;

            // 先从 Git 跟踪中移除这些目录（如果已被跟踪）
            if (fs.existsSync(actualGitDir) && fs.statSync(actualGitDir).isDirectory()) {
                excludeEntries.forEach(entry => {
                    const dirPath = entry.replace(/\/$/, "");
                    try {
                        const checkResult = execSync(`git ls-files ${dirPath}`, {
                            cwd: outputPath,
                            encoding: 'utf-8',
                            stdio: ['pipe', 'pipe', 'ignore']
                        }).trim();

                        if (checkResult) {
                            execSync(`git rm -r --cached ${dirPath}`, {
                                cwd: outputPath,
                                stdio: 'ignore'
                            });
                            Ec.info(`  ✓ 已从 Git 跟踪中移除 ${entry}`);
                        }
                    } catch (error) {
                        // 如果命令失败（比如目录不在 Git 跟踪中），则忽略
                    }
                });
            }

            const gitInfoExcludePath = path.join(actualGitDir, "info/exclude");
            const gitInfoDir = path.dirname(gitInfoExcludePath);

            // 确保 .git/info 目录存在
            if (fs.existsSync(gitInfoDir)) {
                const stats = fs.statSync(gitInfoDir);
                if (!stats.isDirectory()) {
                    fs.unlinkSync(gitInfoDir);
                    fs.mkdirSync(gitInfoDir, { recursive: true });
                    Ec.info(`已删除同名文件并创建目录：${gitInfoDir}`);
                }
            } else {
                fs.mkdirSync(gitInfoDir, { recursive: true });
                Ec.info(`创建目录：${gitInfoDir}`);
            }

            // 读取或创建 exclude 文件
            let excludeContent = "";
            if (fs.existsSync(gitInfoExcludePath)) {
                excludeContent = fs.readFileSync(gitInfoExcludePath, "utf-8");
            }

            // 检查并添加每个条目
            const existingLines = excludeContent.split('\n').map(line => line.trim());
            let newEntries = [];

            excludeEntries.forEach(entry => {
                const hasEntry = existingLines.some(line =>
                    line === entry || line === entry.replace(/\/$/, "")
                );

                if (!hasEntry) {
                    newEntries.push(entry);
                }
            });

            if (newEntries.length > 0) {
                const finalContent = excludeContent.endsWith("\n") || excludeContent === ""
                    ? excludeContent
                    : excludeContent + "\n";

                const updatedContent = finalContent + newEntries.join("\n") + "\n";
                fs.writeFileSync(gitInfoExcludePath, updatedContent, "utf-8");

                newEntries.forEach(entry => {
                    Ec.info(`  ✓ 已添加 ${entry} 到 .git/info/exclude`);
                });
            } else {
                Ec.info(`所有 AI 工具目录已在 .git/info/exclude 中`);
            }
        }

    } catch (error) {
        Ec.error(`操作失败：${error.message}`);
        process.exit(1);
    }
}
