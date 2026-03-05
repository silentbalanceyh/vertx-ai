---
runAt: 2026-03-02.09-48-15
title: ai ex-api 命令整改
---
针对 ai ex-api 命令的整改方案如下
1. S_PERM_SET 中的 code 属性应该和 S_PERMISSION 中的 code 一致，不应该是 res 前缀。
2. 选择角色的菜单不使用滚动，从上到下即可，而且在菜单中显示出 code 值（不仅仅是 name 值）。
3. 输出过程中，资源输出规则不变，但角色权限要分离输出，根据用户选择判断是否包含了：`e501b47a-c08b-4c83-b12b-95ad82873e96` 的角色，如果是此角色输出规则不变，其他角色输出改成：当前目录下和 code 值对应目录下，如角色叫 CODE.DEVELOPER 则直接查找，找不到打印警告（当前目录为主）

## Changes

### 2026-03-05 (Commit: b424fcc)

**修改文件：** `src/commander-ai/fn.ex.api.js`

**变更内容：**

1. **S_PERM_SET.code 对齐 S_PERMISSION.code** (第 492-500 行)
   - 修改前：`code: resRow.CODE`（使用资源的 CODE，格式为 `res.xxx`）
   - 修改后：`code: permRow.CODE`（使用权限的 CODE，格式为 `perm.xxx`）
   - 增加 `permRow` 条件判断确保权限存在

2. **角色选择菜单优化** (第 391-399 行)
   - 显示格式：从 `${r.NAME || r.CODE} (${r.ID})` 改为 `${r.NAME || r.CODE} (${r.CODE || '-'})`
   - 添加 `pageSize: 999` 配置禁用滚动分页
   - 建立 `roleIdToCode` 映射表（第 407-413 行）供后续路径分流使用

3. **RBAC_ROLE 输出路径分离** (第 660-760 行)
   - 新增常量 `REFERENCE_ROLE_ID = "e501b47a-c08b-4c83-b12b-95ad82873e96"`（第 15 行）
   - 参考角色输出：维持原路径 `RBAC_ROLE/ADMIN.SUPER/falcon-xxx.xlsx`
   - 其他角色输出：
     - 路径格式：`{cwd}/{ROLE_CODE}/security/RBAC_ROLE/ADMIN.SUPER/falcon-xxx.xlsx`
     - 目录不存在时打印警告并跳过：`⚠️ 警告：未找到角色目录 {path}，跳过输出`
   - 汇总输出改为循环显示所有生成的 RBAC_ROLE 文件路径（第 769 行）

**代码审查：** ✅ APPROVE（所有关键需求已满足）

**变更统计：** +108 行，-52 行