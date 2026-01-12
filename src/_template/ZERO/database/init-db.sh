#!/usr/bin/env bash

# 加载环境变量
source "$PWD/.r2mo/app.env"

# 初始化标志变量
RUN_WORKFLOW=false
RUN_HISTORY=false

# 解析命令行参数 (-w 和 -h)
while getopts "wh" opt; do
  case $opt in
    w)
      RUN_WORKFLOW=true
      ;;
    h)
      RUN_HISTORY=true
      ;;
    \?)
      echo "无效选项: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

# 定义基础路径和命令前缀，使代码更整洁
DB_DIR="$PWD/.r2mo/database/${Z_DB_TYPE}"
MYSQL_CMD="mysql -ur2mo -h$Z_DB_HOST"

# --- 执行核心脚本 (始终执行) ---
echo "正在执行基础数据库初始化..."
$MYSQL_CMD < "$DB_DIR/database-account.sql"
$MYSQL_CMD < "$DB_DIR/database-reinit.sql"

# --- 根据参数执行可选脚本 ---

# 如果包含 -w 参数
if [ "$RUN_WORKFLOW" = true ]; then
    echo "检测到 -w 参数，正在执行 Workflow 初始化..."
    $MYSQL_CMD < "$DB_DIR/database-reinit-workflow.sql"
fi

# 如果包含 -h 参数
if [ "$RUN_HISTORY" = true ]; then
    echo "检测到 -h 参数，正在执行 History 初始化..."
    $MYSQL_CMD < "$DB_DIR/database-reinit-history.sql"
fi

echo "执行完毕."