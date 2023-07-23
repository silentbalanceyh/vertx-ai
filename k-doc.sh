#!/usr/bin/env bash
# 两个环境变量，生成API文档的目录和API文档服务器的端口
export DOC_OUT=document
export PORT=30211

echo -e "\033[32m[Zero UI]\033[0m Shell Script:  ./k-doc.sh (doc|server)"
echo -e "\033[32m[Zero UI]\033[0m Input command is \"\033[33m$1\033[0m\"!"
echo -e "Command List: "
echo -e "    \033[33mdoc\033[0m = \"\033[34mGenerate document of Zero Ai Research\033[0m\""
echo -e "    \033[33mserver\033[0m = \"\033[34mRun Zero Ai on server ${PORT}\033[0m\""
if [ "doc" == "$1" ]; then
  ./script/zrun-doc-generate.sh
elif [ "server" == "$1" ]; then
  ./script/zrun-doc-server.sh ${PORT} doc-web
else
  echo "Invalid input command of $1"
fi
