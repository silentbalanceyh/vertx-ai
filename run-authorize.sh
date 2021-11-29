#!/usr/bin/env bash
export ROOT=/Users/lang/Develop/Source/ox-workshop/vertx-zero/vertx-pin
echo "拷贝 zero-ambient 权限"
cp -rf ${ROOT}/zero-ambient/src/main/resources/plugin/ambient/oob/role/ADMIN.SUPER/* ./src/cab/perm/
echo "拷贝 zero-atom 权限"
cp -rf ${ROOT}/zero-atom/src/main/resources/plugin/atom/oob/role/ADMIN.SUPER/* ./src/cab/perm/
echo "拷贝 zero-erp 权限"
cp -rf ${ROOT}/zero-erp/src/main/resources/plugin/erp/oob/role/ADMIN.SUPER/* ./src/cab/perm/
echo "拷贝 zero-fm 权限"
cp -rf ${ROOT}/zero-fm/src/main/resources/plugin/fm/oob/role/ADMIN.SUPER/* ./src/cab/perm/
echo "拷贝 zero-graphic 权限"
cp -rf ${ROOT}/zero-graphic/src/main/resources/plugin/graphic/oob/role/ADMIN.SUPER/* ./src/cab/perm/
echo "拷贝 zero-jet 权限"
cp -rf ${ROOT}/zero-jet/src/main/resources/plugin/jet/oob/role/ADMIN.SUPER/* ./src/cab/perm/
echo "拷贝 zero-lbs 权限"
cp -rf ${ROOT}/zero-lbs/src/main/resources/plugin/lbs/oob/role/ADMIN.SUPER/* ./src/cab/perm/
echo "拷贝 zero-rbac 权限"
cp -rf ${ROOT}/zero-rbac/src/main/resources/plugin/rbac/oob/role/ADMIN.SUPER/* ./src/cab/perm/
echo "拷贝 zero-ui 权限"
cp -rf ${ROOT}/zero-ui/src/main/resources/plugin/ui/oob/role/ADMIN.SUPER/* ./src/cab/perm/
echo "拷贝 zero-wf 权限"
cp -rf ${ROOT}/zero-wf/src/main/resources/plugin/wf/oob/role/ADMIN.SUPER/* ./src/cab/perm/
echo "拷贝 zero-psi 权限"
cp -rf ${ROOT}/zero-psi/src/main/resources/plugin/psi/oob/role/ADMIN.SUPER/* ./src/cab/perm/
echo "Success, 权限拷贝完成！！"

