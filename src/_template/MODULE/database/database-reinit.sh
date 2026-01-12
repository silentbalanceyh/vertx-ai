#!/usr/bin/env bash
mysql -u zero -P 3306 -h localhost < database-reinit.sql
echo "[OX] 重建 ZDB 数据库成功!";