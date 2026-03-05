# ai ex- 命令详细文档

本文档描述 `ai ex-` 系列命令的详细用法，包括输入数据格式和执行流程。

## 目录

- [ai ex-api](#ai-ex-api) - 从 YAML 元数据生成 RBAC Excel（资源/权限授权）
- [ai ex-crud](#ai-ex-crud) - 从 YAML 元数据生成 CRUD Excel（增删改查权限）
- [ai ex-perm](#ai-ex-perm) - 按参考角色复制权限到指定角色
- [ai ex-app](#ai-ex-app) - 清理缓存目录中不存在于数据库的应用实例

---

## ai ex-api

### 功能说明

从 `.r2mo/task/command/ex-api` 目录加载多份 YAML 配置文件（metadata.r），多选后执行 RBAC 授权（写入数据库 + 生成 Excel），处理成功后将配置文件移至 `backup` 目录并加 `.bak` 后缀。

### 命令格式

```bash
ai ex-api [选项]
```

### 选项

| 选项 | 别名 | 类型 | 默认值 | 说明 |
|------|------|------|--------|------|
| `--skip` | `-s` | boolean | false | 仅生成 Excel，跳过去重等检查 |

### 前置条件

#### 环境变量（数据库）

必须设置以下环境变量（可在 `.r2mo/app.env` 中 export）：

```bash
export Z_DB_TYPE="MYSQL"              # 数据库类型
export Z_DB_HOST="127.0.0.1"          # 数据库主机
export Z_DB_PORT="3306"               # 数据库端口
export Z_DBS_INSTANCE="your_db"       # 业务数据库实例名
export Z_DB_APP_USER="username"       # 数据库用户
export Z_DB_APP_PASS="password"       # 数据库密码
```

#### 环境变量（应用）

```bash
export Z_APP_ID="app-uuid"            # 应用 ID
export Z_TENANT="tenant-id"           # 租户标识
export Z_SIGMA="sigma-key"            # Sigma 维度键
```

### 配置文件位置

命令会在以下位置查找配置目录（按优先级）：

1. `当前目录/.r2mo/task/command/ex-api`
2. `上级目录/.r2mo/task/command/ex-api`
3. `上上级目录/.r2mo/task/command/ex-api`

### YAML 配置格式

在 `.r2mo/task/command/ex-api` 目录下创建 YAML 文件（可多个），格式如下：

```yaml
# 示例：user-management.yaml
metadata:
  # 资源定义
  resources:
    - identifier: "user.list"           # 资源标识符（唯一）
      name: "用户列表"                   # 资源名称
      type: "resource.ambient"          # 资源类型
      uri: "/api/users"                 # API 路径
      method: "GET"                     # HTTP 方法

    - identifier: "user.create"
      name: "创建用户"
      type: "resource.ambient"
      uri: "/api/users"
      method: "POST"

  # 权限集定义（可选）
  permissionSets:
    - code: "USER_ADMIN"                # 权限集代码
      name: "用户管理员"                 # 权限集名称
      permissions:                      # 包含的权限
        - "user.list"
        - "user.create"
        - "user.update"
        - "user.delete"

# target 配置（可选，用于模块化项目）
target:
  root: "ZERO_MODULE"                   # 环境变量名
  module: "ambient"                     # 模块名（会查找 zero-exmodule-{module}）
```

### 执行流程

1. **扫描配置文件**：从配置目录加载所有 `.yaml` / `.yml` 文件
2. **用户选择**：通过交互式界面多选要执行的配置
3. **环境检查**：验证数据库和应用环境变量是否齐全
4. **连接数据库**：建立数据库连接
5. **写入 RBAC 表**：
   - `S_RESOURCE`：资源表
   - `S_ACTION`：操作表
   - `S_PERMISSION`：权限表
   - `S_PERM_SET`：权限集表（如果定义）
6. **生成 Excel**：
   - 输出到 `plugins/{pluginId}/security/RBAC_RESOURCE/`
   - 使用模板 `src/_template/EXCEL/ex-api/template-RBAC_RESOURCE.xlsx`
7. **备份配置**：将处理成功的 YAML 文件移至 `backup/` 并加 `.bak` 后缀

### 输出位置

#### 标准项目（ONE 架构）

```
项目根目录/
└── src/main/resources/plugins/
    └── zero-launcher-configuration/
        └── security/
            └── RBAC_RESOURCE/
                └── {identifier}.xlsx
```

#### DPA 架构

```
项目根目录/
└── {artifactId}-api/
    └── src/main/resources/plugins/
        └── zero-launcher-configuration/
            └── security/
                └── RBAC_RESOURCE/
                    └── {identifier}.xlsx
```

#### 模块化项目（target 配置）

```
$ZERO_MODULE/
└── zero-exmodule-{module}/
    └── zero-exmodule-{module}-domain/
        └── src/main/resources/plugins/
            └── zero-exmodule-{module}/
                └── security/
                    └── RBAC_RESOURCE/
                        └── {identifier}.xlsx
```

### 使用示例

```bash
# 标准执行（连接数据库 + 生成 Excel）
ai ex-api

# 仅生成 Excel，跳过数据库操作
ai ex-api -s
ai ex-api --skip
```

### 注意事项

1. **去重检查**：默认会检查数据库中是否已存在相同的资源/权限，避免重复插入
2. **UUID 生成**：所有主键（KEY/ID）会自动生成 UUID
3. **全局列**：自动填充 `SIGMA`、`APP_ID`、`TENANT_ID`、`CREATED_BY`、`UPDATED_BY`、`CREATED_AT`、`UPDATED_AT`
4. **模板保持**：生成的 Excel 保留模板的所有格式（颜色、边框、合并单元格等），仅填充数据

---

## ai ex-crud

### 功能说明

从 `.r2mo/task/command/ex-crud` 目录加载多份 YAML 配置文件，多选后按 metadata 从模板生成 CRUD Excel 及 RBAC 授权，处理成功后移至 `backup` 并加 `.bak` 后缀。

### 命令格式

```bash
ai ex-crud [选项]
```

### 选项

| 选项 | 别名 | 类型 | 默认值 | 说明 |
|------|------|------|--------|------|
| `--skip` | `-s` | boolean | false | 仅生成 CRUD 文件，跳过数据库与角色选择 |

### 前置条件

#### 环境变量（数据库）

```bash
export Z_DB_TYPE="MYSQL"
export Z_DB_HOST="127.0.0.1"
export Z_DB_PORT="3306"
export Z_DBS_INSTANCE="your_db"
export Z_DB_APP_USER="username"
export Z_DB_APP_PASS="password"
```

#### 环境变量（应用）

```bash
export Z_APP_ID="app-uuid"
export Z_TENANT="tenant-id"
export Z_SIGMA="sigma-key"
```

### 配置文件位置

命令会在以下位置查找配置目录（按优先级）：

1. `当前目录/.r2mo/task/command/ex-crud`
2. `上级目录/.r2mo/task/command/ex-crud`
3. `上上级目录/.r2mo/task/command/ex-crud`

### YAML 配置格式

在 `.r2mo/task/command/ex-crud` 目录下创建 YAML 文件（可多个），格式如下：

```yaml
# 示例：log-crud.yaml
metadata:
  keyword: "log"                        # 关键字（必填）
  identifier: "x.log"                   # 标识符（必填，仅允许字母数字、点、下划线、横线）
  actor: "x-log"                        # 操作者标识
  name: "日志"                          # 中文名称
  type: "resource.ambient"              # 资源类型

# target 配置（可选，用于模块化项目）
target:
  root: "ZERO_MODULE"                   # 环境变量名
  module: "ambient"                     # 模块名
```

### 占位符替换规则

模板中的占位符会按以下顺序替换（避免冲突）：

| 占位符/字面值 | 对应字段 | 说明 | 示例 |
|--------------|---------|------|------|
| `x.log` | `identifier` | 标识符（点分隔） | `x.crud` |
| `x-log` | `actor` | 操作者（横线分隔） | `x-crud` |
| `log` | `keyword` | 关键字 | `crud` |
| `日志` | `name` | 中文名称 | `增删改查` |
| `resource.ambient` | `type` | 资源类型 | `resource.system` |

也支持 `{{identifier}}`、`{{actor}}`、`{{keyword}}`、`{{name}}`、`{{type}}` 形式的占位符。

### 执行流程

1. **扫描配置文件**：从配置目录加载所有 `.yaml` / `.yml` 文件
2. **验证 metadata**：检查 `keyword` 和 `identifier` 是否非空且合法
3. **用户选择**：通过交互式界面多选要执行的配置
4. **环境检查**：验证环境变量（除非使用 `-s` 跳过）
5. **生成 CRUD 文件**：
   - 从模板 `src/_template/EXCEL/ex-crud` 复制
   - 替换所有占位符（路径、文件名、文件内容）
   - 重新生成所有 UUID
   - 输出到 `RBAC_CRUD/` 目录
6. **收集权限 ID**：从生成的 Excel 中提取 `S_PERMISSION` 表的所有 UUID
7. **角色授权**（非 skip 模式）：
   - 连接数据库查询 `S_ROLE` 表
   - 用户多选要授权的角色
   - 生成 `falcon-crud-{identifier}.xlsx` 到 `RBAC_ROLE/ADMIN.SUPER/`
8. **备份配置**：将处理成功的 YAML 文件移至 `backup/` 并加 `.bak` 后缀

### 输出位置

#### 标准项目（ONE 架构）

```
项目根目录/
└── src/main/resources/plugins/
    └── zero-launcher-configuration/
        └── security/
            ├── RBAC_CRUD/
            │   └── {identifier}/          # CRUD 文件（替换后）
            │       ├── {identifier}.xlsx
            │       └── seekSyntax.json
            └── RBAC_ROLE/
                └── ADMIN.SUPER/
                    └── falcon-crud-{identifier}.xlsx
```

#### DPA 架构

```
项目根目录/
└── {artifactId}-api/
    └── src/main/resources/plugins/
        └── zero-launcher-configuration/
            └── security/
                ├── RBAC_CRUD/
                └── RBAC_ROLE/
```

#### 模块化项目（target 配置）

```
$ZERO_MODULE/
└── zero-exmodule-{module}/
    └── zero-exmodule-{module}-domain/
        └── src/main/resources/plugins/
            └── zero-exmodule-{module}/
                └── security/
                    ├── RBAC_CRUD/
                    └── RBAC_ROLE/
```

### 使用示例

```bash
# 标准执行（生成 CRUD + 角色授权）
ai ex-crud

# 仅生成 CRUD 文件，跳过数据库和角色选择
ai ex-crud -s
ai ex-crud --skip
```

### 注意事项

1. **metadata 必填**：`keyword` 和 `identifier` 必须非空
2. **identifier 格式**：仅允许字母数字、点（`.`）、下划线（`_`）、横线（`-`）
3. **UUID 重新生成**：模板中所有 UUID 会被替换为新生成的 UUID
4. **Excel 单元格替换**：`.xlsx` 文件使用 ExcelJS 按单元格替换，保留格式
5. **角色默认值**：如果未选择角色，会自动选择 `超级管理员`（NAME 或 CODE 为 `ADMIN.SUPER` / `ADMIN_SUPER`）

---

## ai ex-perm

### 功能说明

按参考角色复制权限到指定角色。从固定的参考角色（`e501b47a-c08b-4c83-b12b-95ad82873e96`）的 `R_ROLE_PERM` 表中读取所有权限，复制到用户指定的目标角色。

### 命令格式

```bash
ai ex-perm -r <角色名或角色CODE>
ai ex-perm --role <角色名或角色CODE>
```

### 选项

| 选项 | 别名 | 类型 | 说明 |
|------|------|------|------|
| `--role` | `-r` | string | 角色名或角色 CODE，对应 `S_ROLE.NAME` 或 `S_ROLE.CODE`（必填） |

### 前置条件

#### 环境变量（数据库）

必须设置以下环境变量（可在 `.r2mo/app.env` 中 export）：

```bash
export Z_DB_TYPE="MYSQL"              # 数据库类型
export Z_DB_HOST="127.0.0.1"          # 数据库主机
export Z_DB_PORT="3306"               # 数据库端口
export Z_DBS_INSTANCE="your_db"       # 业务数据库实例名
export Z_DB_APP_USER="username"       # 数据库用户
export Z_DB_APP_PASS="password"       # 数据库密码
```

### app.env 文件位置

命令会在以下位置查找 `app.env` 文件（按优先级）：

#### ONE 架构

```
当前目录/.r2mo/app.env
```

#### DPA 架构

```
当前目录/.r2mo/app.env
或
当前目录/{artifactId}-api/.r2mo/app.env
或
上级目录/{artifactId}-api/.r2mo/app.env
```

其中 `{artifactId}` 从 `pom.xml` 中解析，或使用当前目录名。

### 执行流程

1. **解析参数**：获取 `-r` / `--role` 参数（角色名或 CODE）
2. **加载环境变量**：从 `.r2mo/app.env` 加载数据库配置
3. **环境检查**：验证数据库环境变量是否齐全
4. **连接数据库**：建立数据库连接
5. **查询目标角色**：在 `S_ROLE` 表中按 `NAME` 或 `CODE` 匹配角色
6. **查询参考角色权限**：从 `R_ROLE_PERM` 表读取参考角色的所有权限
7. **复制权限**：将参考角色的权限复制到目标角色（使用 `INSERT IGNORE` 避免重复）
8. **输出报告**：显示详细的执行报告

### 使用示例

```bash
# 按角色名称复制权限
ai ex-perm -r 管理员
ai ex-perm --role 管理员

# 按角色 CODE 复制权限
ai ex-perm -r ADMIN
ai ex-perm --role ADMIN.SUPER
```

### 执行报告示例

```
----------------------------------------
  ai perm 执行报告
----------------------------------------
  ⚙️  环境
    app.env     : /path/to/.r2mo/app.env
    数据库类型  : MYSQL
    数据库实例  : your_db
    连接地址    : 127.0.0.1:3306
    数据库用户  : username
  👤  目标角色（-r 指定）
    输入        : 管理员
    ID         : abc-123-def-456
    NAME       : 管理员
    CODE       : ADMIN
  📋  参考角色（复制来源）
    ROLE_ID    : e501b47a-c08b-4c83-b12b-95ad82873e96
    R_ROLE_PERM 条数 : 150
  ✅  权限复制结果
    本次插入   : 120 条
    重复跳过   : 30 条
    合计处理   : 150 条
----------------------------------------
```

### 注意事项

1. **参考角色固定**：参考角色 ID 硬编码为 `e501b47a-c08b-4c83-b12b-95ad82873e96`
2. **去重机制**：使用 `INSERT IGNORE` 避免重复插入，已存在的权限会被跳过
3. **角色匹配**：支持按 `NAME` 或 `CODE` 匹配，优先匹配第一条记录
4. **环境变量来源**：可以从 `.r2mo/app.env` 文件加载，也可以在当前 shell 中已 export

---

## ai ex-app

### 功能说明

清理缓存目录中不存在于数据库的应用实例。从数据库 `X_APP` 表查询所有应用 ID，对比缓存目录（`apps/` 或 `$R2MO_HOME/apps/`），删除数据库中不存在的孤立缓存目录。

### 命令格式

```bash
ai ex-app
```

### 选项

无选项。

### 前置条件

#### 环境变量（数据库）

必须设置以下环境变量（可在 `.r2mo/app.env` 中 export）：

```bash
export Z_DBS_INSTANCE="your_db"       # 数据库实例名（必填）
export Z_DB_APP_USER="username"       # 数据库用户（必填）
export Z_DB_APP_PASS="password"       # 数据库密码（必填）
export Z_DB_HOST="127.0.0.1"          # 数据库主机（可选，默认 localhost）
export Z_DB_PORT="3306"               # 数据库端口（可选，默认 3306）
```

#### 环境变量（缓存目录）

```bash
export R2MO_HOME="/path/to/r2mo"      # R2MO 主目录（可选）
```

### 缓存目录位置

命令会在以下位置查找缓存目录（按优先级）：

1. `$R2MO_HOME/apps/`（如果设置了 `R2MO_HOME` 环境变量）
2. `当前目录/apps/`（默认）

### 执行流程

1. **加载环境变量**：从 `.r2mo/app.env` 加载数据库配置
2. **环境检查**：验证数据库核心环境变量（`Z_DBS_INSTANCE`、`Z_DB_APP_USER`、`Z_DB_APP_PASS`）
3. **连接数据库**：建立数据库连接
4. **查询应用 ID**：从 `X_APP` 表提取所有应用 ID
5. **扫描缓存目录**：列出缓存目录中的所有子目录
6. **识别孤立目录**：对比数据库 ID，找出不存在于数据库的缓存目录
7. **用户确认**：显示孤立目录列表，询问是否删除
8. **删除目录**：递归删除用户确认的孤立目录
9. **输出报告**：显示删除结果（成功/失败数量）

### 使用示例

```bash
# 执行清理
ai ex-app
```

### 执行流程示例

```
✓ 已加载环境变量：/path/to/.r2mo/app.env
✓ 环境变量检查通过：Z_DBS_INSTANCE, Z_DB_APP_USER, Z_DB_APP_PASS
连接数据库：your_db @ 127.0.0.1:3306（用户 username）
查询 X_APP 表，提取所有应用 ID…
✓ 数据库中共有 5 个应用：app-001, app-002, app-003, app-004, app-005
使用当前目录缓存：/path/to/project/apps
✓ 缓存目录中共有 7 个子目录
发现 2 个孤立的缓存目录（数据库中不存在）：
  - app-old-001 (/path/to/project/apps/app-old-001)
  - app-old-002 (/path/to/project/apps/app-old-002)
? 确认删除以上 2 个孤立的缓存目录？ (y/N)
```

### 注意事项

1. **安全确认**：删除前会显示孤立目录列表并要求用户确认
2. **递归删除**：会递归删除整个目录及其所有内容
3. **缓存目录优先级**：优先使用 `R2MO_HOME`，其次使用当前目录
4. **数据库表**：依赖 `X_APP` 表的 `id` 列
5. **目录名匹配**：缓存目录名必须与数据库中的应用 ID 完全一致

---

## 通用说明

### app.env 文件格式

`.r2mo/app.env` 文件使用 shell export 语法：

```bash
# 数据库配置
export Z_DB_TYPE="MYSQL"
export Z_DB_HOST="127.0.0.1"
export Z_DB_PORT="3306"
export Z_DBS_INSTANCE="your_database"
export Z_DB_APP_USER="your_username"
export Z_DB_APP_PASS="your_password"

# 应用配置
export Z_APP_ID="your-app-uuid"
export Z_TENANT="your-tenant-id"
export Z_SIGMA="your-sigma-key"

# 模块化项目（可选）
export ZERO_MODULE="/path/to/zero-modules"

# 缓存目录（可选）
export R2MO_HOME="/path/to/r2mo"
```

### 项目架构类型

#### ONE 架构（单体项目）

```
project-root/
├── pom.xml
├── .r2mo/
│   └── app.env
└── src/main/resources/plugins/
    └── zero-launcher-configuration/
        └── security/
```

#### DPA 架构（Domain-Driven Architecture）

```
project-root/
├── pom.xml
├── {artifactId}-api/
│   ├── .r2mo/
│   │   └── app.env
│   └── src/main/resources/plugins/
├── {artifactId}-domain/
└── {artifactId}-infra/
```

#### 模块化项目（ZERO_MODULE）

```
$ZERO_MODULE/
└── zero-exmodule-{module}/
    ├── pom.xml
    ├── zero-exmodule-{module}-api/
    │   └── .r2mo/
    │       └── app.env
    └── zero-exmodule-{module}-domain/
        └── src/main/resources/plugins/
            └── zero-exmodule-{module}/
                └── security/
```

### 数据库表结构

#### RBAC 核心表

- `S_RESOURCE`：资源表（API 端点）
- `S_ACTION`：操作表（HTTP 方法）
- `S_PERMISSION`：权限表（资源 + 操作）
- `S_PERM_SET`：权限集表（权限分组）
- `S_ROLE`：角色表
- `R_ROLE_PERM`：角色权限关系表

#### 应用表

- `X_APP`：应用实例表

### Excel 模板说明

#### {TABLE} 标记格式

Excel 模板使用 `{TABLE}` 标记定义数据区域：

```
行1: {TABLE}  | 表名（如 S_RESOURCE）
行2: 中文表头 | 资源标识 | 资源名称 | ...
行3: 英文列名 | identifier | name | ...
行4+: 数据行
```

#### 模板位置

- `src/_template/EXCEL/ex-api/template-RBAC_RESOURCE.xlsx`
- `src/_template/EXCEL/ex-api/template-RBAC_ROLE.xlsx`
- `src/_template/EXCEL/ex-crud/` 目录下的所有文件

### 常见问题

#### Q: 找不到 .r2mo/app.env 文件

**A:** 确保在项目根目录执行命令，或在 DPA 架构下确保 `{artifactId}-api/.r2mo/app.env` 存在。

#### Q: 环境变量不齐

**A:** 检查 `.r2mo/app.env` 文件中是否包含所有必需的环境变量，确保使用 `export` 语法。

#### Q: 数据库连接失败

**A:** 检查数据库配置（主机、端口、用户名、密码）是否正确，确保数据库服务正在运行。

#### Q: 角色查询不到

**A:** 确保 `S_ROLE` 表中存在该角色，可以执行 `SELECT ID, NAME, CODE FROM S_ROLE;` 查看已有角色。

#### Q: 生成的 Excel 找不到

**A:** 检查项目架构类型（ONE / DPA / 模块化），确认输出路径是否正确。

#### Q: YAML 配置被跳过

**A:** 检查 YAML 格式是否正确，`metadata` 字段是否完整，`keyword` 和 `identifier` 是否非空。

---

## 版本信息

- 文档版本：1.0.0
- 适用于：r2mo-init v1.0.80+
- 最后更新：2026-03-05
