#!/bin/bash

# 1. 检查是否有参数
CACHE_NAME="$1"

if [ -z "$CACHE_NAME" ]; then
    echo "❌ 错误：请提供一个名称参数"
    echo "👉 用法: ./zrun-ram.sh my-project-v1"
    exit 1
fi

# 2. 定义 RAMDisk 目标位置
TARGET_DIR="/Volumes/RAMJava/WebStorm/tmp/$CACHE_NAME"

# 3. 在 RAMDisk 创建目录
mkdir -p "$TARGET_DIR"

# 4. 准备 node_modules 并清理旧缓存
mkdir -p node_modules
rm -rf node_modules/.cache

# 5. 建立软链接
ln -s "$TARGET_DIR" node_modules/.cache

echo "✅ 成功映射: node_modules/.cache -> $TARGET_DIR"