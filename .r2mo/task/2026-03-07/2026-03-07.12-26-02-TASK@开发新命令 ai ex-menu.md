---
runAt: 2026-03-05.11-05-38
completedAt: 2026-03-05.11-30-00
title: 开发新命令 ai ex-menu
status: completed
---

## 任务目标

将以下参考的执行记录转换成自动化命令 ai ex-menu

## 实施结果

### 已完成功能

#### 1. 新增 `ai ex-menu` 命令

**命令文件**：
- `src/commander/ex-menu.json` - 命令配置
- `src/commander-ai/fn.ex.menu.js` - 命令实现
- `src/commander-ai/index.js` - 已注册 executor

**执行流程**：
1. 加载 `.r2mo/app.env` 环境变量
2. 连接数据库查询 `S_ROLE` 表
3. 用户单选角色（提示：菜单全开放模式，建议选择开发人员角色）
4. 查询 `X_MENU` 生成两个 JSON 文件：
   - `src/main/resources/init/permission/ui.menu/{CODE}.json` - NAME 数组
   - `src/main/resources/init/permission/ui.menu/role/{CODE}.json` - 层级文本数组（带缩进）

**特性**：
- 自动过滤超级管理员角色（该角色在 `ai ex-api` 中固定输出）
- 支持任意角色 CODE 的文件生成
- 层级文本按 ORDER、NAME 排序，缩进规则：每层级 4 个空格

#### 2. 增强 `ai ex-api` 命令

**修改内容**：
- 超级管理员角色（ID: `e501b47a-c08b-4c83-b12b-95ad82873e96`）始终自动输出到 `ZERO_MODULE` 固定路径，不需要用户选择
- 用户选择角色时自动过滤掉超级管理员，避免重复
- 汇总输出增强：
  - 🔒 固定输出角色：超级管理员（自动包含）
  - 👤 用户选择角色：显示每个角色的 NAME、CODE、ID
  - 📁 输出文件路径分流：
    - 超级管理员 → `ZERO_MODULE/.../RBAC_ROLE/ADMIN.SUPER/`
    - 其他角色 → `src/main/resources/init/oob/role/{CODE}/`

**输出示例**：
```
[ex-api] ✅ 执行完成（幂等）
[ex-api] 📋 汇总：
[ex-api]   🔑 ACTION_ID     = xxx
[ex-api]   🔑 RESOURCE_ID  = xxx
[ex-api]   🔑 PERMISSION_ID = xxx
[ex-api]   👥 授权角色总数 = 2
[ex-api]   🔒 固定输出角色：
[ex-api]      [1] 超级管理员 (CODE: ADMIN.SUPER, ID: e501b47a-...)
[ex-api]   👤 用户选择角色：
[ex-api]      [1] 开发人员 (CODE: ADMIN.DEVELOPER, ID: xxx)
[ex-api]   📁 RBAC_RESOURCE = /path/to/...
[ex-api]   📁 RBAC_ROLE     = ...ZERO_MODULE.../ADMIN.SUPER/...
[ex-api]   📁 RBAC_ROLE     = .../init/oob/role/ADMIN.DEVELOPER/...
```

## 前置条件

### 环境变量配置
数据库连接信息存储在 `.r2mo/app.env` 文件中：
```bash
export Z_DB_HOST="127.0.0.1"
export Z_DB_PORT="3306"
export Z_DB_USERNAME="root"
export Z_DB_PASSWORD="pl,okmijn123"
export Z_DBS_INSTANCE="DB_HMS_001_APP"  # 业务数据库实例名
```

### 数据库表结构
表名：`X_MENU`（位于 `DB_HMS_001_APP` 数据库）

关键字段：
- `ID` (varchar(36)) - 主键
- `NAME` (varchar(255)) - 菜单唯一标识符，如 `zero.desktop`, `hms.order.main`
- `TEXT` (varchar(255)) - 菜单中文显示文本，如 "工作台", "新增预定"
- `LEVEL` (bigint) - 菜单层级（1=一级菜单, 2=二级菜单, 3=三级菜单, 4=四级菜单）
- `PARENT_ID` (varchar(36)) - 父菜单 ID（NULL 表示顶级菜单）
- `ORDER` (bigint) - 同级菜单排序序号
- `SIGMA` (varchar(128)) - 租户/应用标识符
- `APP_ID` (varchar(36)) - 应用 ID
- `ACTIVE` (bit(1)) - 是否启用

## 执行步骤

### 步骤 1: 加载环境变量
```bash
source .r2mo/app.env
```

### 步骤 2: 查询数据库获取菜单 NAME 列表
查询所有菜单的 NAME 字段，按 ORDER 和 NAME 排序：
```bash
mysql -h"$Z_DB_HOST" -P"$Z_DB_PORT" -u"$Z_DB_USERNAME" -p"$Z_DB_PASSWORD" \
  DB_HMS_001_APP \
  -e "SELECT NAME FROM X_MENU ORDER BY \`ORDER\`, LEVEL, NAME;" \
  2>/dev/null | tail -n +2
```

**输出示例**：
```
zero.desktop
zero.desktop.my
zero.desktop.my.todo-pending
hms.order
hms.order.main
...
```

### 步骤 3: 生成 ADMIN.DEVELOPER.json（NAME 数组）
将查询结果转换为 JSON 数组格式：
```bash
mysql -h"$Z_DB_HOST" -P"$Z_DB_PORT" -u"$Z_DB_USERNAME" -p"$Z_DB_PASSWORD" \
  DB_HMS_001_APP \
  -e "SELECT NAME FROM X_MENU ORDER BY \`ORDER\`, LEVEL, NAME;" \
  2>/dev/null | tail -n +2 | \
  jq -R -s -c 'split("\n") | map(select(length > 0))'
```

**生成文件格式**：
```json
{
  "name" : [ "zero.desktop", "zero.desktop.my", "zero.desktop.my.todo-pending", ... ]
}
```

**写入文件**：
```
src/main/resources/init/permission/ui.menu/ADMIN.DEVELOPER.json
```

### 步骤 4: 查询数据库获取层级菜单结构
查询菜单的完整层级信息（ID, PARENT_ID, NAME, TEXT, ORDER）：
```bash
mysql -h"$Z_DB_HOST" -P"$Z_DB_PORT" -u"$Z_DB_USERNAME" -p"$Z_DB_PASSWORD" \
  DB_HMS_001_APP -B \
  -e "SELECT ID, IFNULL(PARENT_ID,''), NAME, IFNULL(TEXT,NAME), IFNULL(\`ORDER\`,0) FROM X_MENU;" \
  2>/dev/null
```

**输出示例**：
```
ID	PARENT_ID	NAME	TEXT	ORDER
8aca2f19-9845-495a-bf39-b77514a20da5		zero.desktop	工作台	10000
613a2ae1-e066-4454-b5fb-efdcd6578f51	8aca2f19-9845-495a-bf39-b77514a20da5	zero.desktop.my	工作台	2000
...
```

### 步骤 5: 生成 role/ADMIN.DEVELOPER.json（层级文本数组）
使用 Python 脚本构建父子关系树，按层级生成带缩进的中文菜单文本：

```bash
mysql -h"$Z_DB_HOST" -P"$Z_DB_PORT" -u"$Z_DB_USERNAME" -p"$Z_DB_PASSWORD" \
  DB_HMS_001_APP -B \
  -e "SELECT ID, IFNULL(PARENT_ID,''), NAME, IFNULL(TEXT,NAME), IFNULL(\`ORDER\`,0) FROM X_MENU;" \
  2>/dev/null | python3 -c '
import sys, json

# 读取数据库输出
rows = []
lines = sys.stdin.read().splitlines()
for ln in lines[1:]:  # 跳过表头
    parts = ln.split("\t")
    if len(parts) >= 5:
        rows.append(parts[:5])

# 构建菜单字典（按 ID 索引）
by_id = {
    r[0]: {
        "id": r[0],
        "pid": r[1] or None,  # 父 ID（空字符串转为 None）
        "name": r[2],
        "text": r[3],
        "order": int(r[4])
    }
    for r in rows
}

# 构建父子关系映射
children = {}
for n in by_id.values():
    children.setdefault(n["pid"], []).append(n)

# 对每个父节点的子节点按 ORDER 和 NAME 排序
for k in children:
    children[k].sort(key=lambda x: (x["order"], x["name"]))

# 递归遍历生成带缩进的文本数组
out = []
def walk(pid, depth):
    for n in children.get(pid, []):
        # 缩进规则：每层级增加 4 个空格（depth-1 是因为顶级菜单不缩进）
        out.append((" " * (4 * (depth - 1))) + n["text"])
        walk(n["id"], depth + 1)

# 从顶级菜单（pid=None）开始遍历
walk(None, 1)

# 输出 JSON 数组
print(json.dumps(out, ensure_ascii=False, indent=2))
'
```

**生成文件格式**：
```json
[
  "工作台",
  "    工作台",
  "        我的待办",
  "        个人报表",
  "    帮助",
  "酒店管理",
  "    预定",
  "        新增预定",
  ...
]
```

**缩进规则**：
- 一级菜单（LEVEL=1）：无缩进
- 二级菜单（LEVEL=2）：4 个空格
- 三级菜单（LEVEL=3）：8 个空格
- 四级菜单（LEVEL=4）：12 个空格

**写入文件**：
```
src/main/resources/init/permission/ui.menu/role/ADMIN.DEVELOPER.json
```

## 数据验证

### 验证点 1: NAME 数组完整性
检查 `ADMIN.DEVELOPER.json` 中的 name 数组是否包含数据库中所有菜单：
```bash
# 统计数据库中的菜单数量
mysql -h"$Z_DB_HOST" -P"$Z_DB_PORT" -u"$Z_DB_USERNAME" -p"$Z_DB_PASSWORD" \
  DB_HMS_001_APP \
  -e "SELECT COUNT(*) FROM X_MENU;" 2>/dev/null

# 统计 JSON 文件中的菜单数量
jq '.name | length' src/main/resources/init/permission/ui.menu/ADMIN.DEVELOPER.json
```

### 验证点 2: 层级结构正确性
检查 `role/ADMIN.DEVELOPER.json` 中的缩进是否符合父子关系：
- 子菜单的缩进必须比父菜单多 4 个空格
- 同级菜单的缩进必须相同

### 验证点 3: 排序正确性
菜单顺序应按照数据库中的 `ORDER` 字段排序，同 ORDER 值按 NAME 字母序排序。

## 关键注意事项

1. **字段处理**：
   - `PARENT_ID` 为 NULL 时表示顶级菜单，需转换为空字符串或 None
   - `TEXT` 为 NULL 时使用 `NAME` 作为显示文本
   - `ORDER` 为 NULL 时默认为 0

2. **排序逻辑**：
   - 主排序：`ORDER` 字段（升序）
   - 次排序：`LEVEL` 字段（升序）
   - 第三排序：`NAME` 字段（字母序）

3. **层级构建**：
   - 使用递归算法从顶级菜单（PARENT_ID=NULL）开始遍历
   - 每递归一层，缩进增加 4 个空格
   - 深度从 1 开始（顶级菜单 depth=1，无缩进）

4. **字符编码**：
   - 确保 JSON 输出使用 UTF-8 编码
   - Python 脚本中使用 `ensure_ascii=False` 保留中文字符

5. **数据库连接**：
   - 使用 `2>/dev/null` 抑制 MySQL 密码警告
   - 使用 `-B` 参数输出 TSV 格式（制表符分隔）
   - 使用 `tail -n +2` 跳过表头行

## 执行结果

本次更新（2026-03-05）：
- **ADMIN.DEVELOPER.json**：更新了 196 个菜单项的 NAME 数组
- **role/ADMIN.DEVELOPER.json**：更新了 196 个菜单项的中文显示文本（带层级缩进）

主要变化：
- 移除已废弃的菜单前缀（`hm.*` → `hms.*`）
- 新增流程管理模块（`zero.wm.*`）
- 新增权限细分配置（`zero.ssm.rbac.authority.*`）
- 新增仪表盘快捷入口（`zero.bsm.dash.*`, `zero.cm.dash.*`）
- 财务模块结构调整（`zero.fms.admin.*` → `zero.fms.process.*`）

## 相关文件

- 环境配置：`.r2mo/app.env`
- 目标文件 1：`src/main/resources/init/permission/ui.menu/ADMIN.DEVELOPER.json`
- 目标文件 2：`src/main/resources/init/permission/ui.menu/role/ADMIN.DEVELOPER.json`
- 数据库表：`DB_HMS_001_APP.X_MENU`

## 依赖工具

- MySQL Client 8.0+
- jq 1.6+
- Python 3.7+
- Bash 4.0+
