#!/bin/bash

# 1. 检查是否提供了提交注释 ($1)
if [ -z "$1" ]; then
  echo -e "\033[31m❌ 错误: 请提供 Git 提交注释。\033[0m"
  echo "用法: ./publish.sh \"你的提交注释\""
  exit 1
fi

# 设置发生错误时停止脚本
set -e

echo -e "\033[36m1️⃣  正在升级版本号 (npm version patch)...\033[0m"
# --no-git-tag-version: 只修改 package.json 版本，不自动生成 git commit 和 tag
npm version patch --no-git-tag-version

echo -e "\033[36m2️⃣  正在发布到 NPM (npm publish)...\033[0m"
# 【关键修改】显式指定 registry 为 npm 官方源，防止发布到淘宝镜像
npm publish --registry=https://registry.npmjs.org/

echo -e "\033[36m3️⃣  正在提交代码并推送 (Git)...\033[0m"
git add .
git commit -m "$1"
git push

echo -e "\033[32m✅ 发布流程全部完成！\033[0m"