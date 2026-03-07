---
runAt: 2026-03-07.12-26-02
title: 开发新命令 ai auth
---
## 执行步骤

1. 检查是否配置了 `ZERO_MODULE` 环境变量，若没有配置则直接退出。
2. 配置了环境变量之后，检查这个目录下所有 `zero-exmoudle-???` 中的 `src/main/resources/` 下是否包含了 `security/RBAC_ROLE/ADMIN.SUPER` 目录，若包含则将里面的 `*.yml` 文件记录。
3. 检查当前项目（Maven中）是否包含 `src/main/resources/init/oob/RBAC_ROLE`，若无也退出。
4. 枚举 `src/main/resources/init/oob/RBAC_ROLE` 下的角色目录让用户选择（默认全选），询问用户是否覆盖，若选择覆盖则直接将源头的 `*.yml` 拷贝到目标目录覆盖掉，目标目录为 `src/main/resources/init/oob/RBAC_ROLE/{用户选择的目录}`

## Changes

### 2026-03-07

**实现完成**

创建文件：
- `src/commander/auth.json` - 命令配置
- `src/commander-ai/fn.ex.auth.js` - 命令执行器

更新文件：
- `src/commander-ai/index.js` - 注册 executeAuth

**实现细节**

路径规律：`{ZERO_MODULE}/{mod}/{mod}-domain/src/main/resources/plugins/{mod}/security/RBAC_ROLE/ADMIN.SUPER/*.yml`

例如：`zero-exmodule-rbac/zero-exmodule-rbac-domain/src/main/resources/plugins/zero-exmodule-rbac/security/RBAC_ROLE/ADMIN.SUPER/*.yml`

扫描逻辑：
1. 读取 ZERO_MODULE 下所有 `zero-exmodule-*` 目录
2. 按固定规律拼接路径：`{mod}/{mod}-domain/src/main/resources/plugins/{mod}/security/RBAC_ROLE/ADMIN.SUPER/`
3. 扫描该目录下所有 `*.yml` 文件

交互优化：
- 显示扫描统计（模块数、命中数、文件数）
- checkbox 多选禁用循环滚动（`loop: false`）
- 默认全选所有角色目录
- 二次确认覆盖操作

**BUG 修复**

初始实现使用递归扫描 + 深度限制（5层），但实际路径深度超过限制且有固定规律。改为直接按规律拼接路径，无需递归，性能更优。