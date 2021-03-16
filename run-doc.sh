#!/usr/bin/env bash
# 两个环境变量，生成API文档的目录和API文档服务器的端口
export DOC_OUT=document
export PORT=211

echo -e "\033[32m[Zero UI]\033[0m Input command is \"\033[33m$1\033[0m\"!"
echo -e "Command List: "
echo -e "    \033[33mdoc\033[0m = \"\033[34mGenerate document of Zero Ai Research\033[0m\""
echo -e "    \033[33mai\033[0m = \"\033[34mRun Zero Ai on server ${PORT}\033[0m\""
if [ "doc" == "$1" ]; then
  ./script/zrun-doc-generate.sh
elif [ "ai" == "$1" ]; then
  ./script/zrun-doc-server.sh ${PORT} doc-web
else
  echo "Invalid input command of $1"
fi
