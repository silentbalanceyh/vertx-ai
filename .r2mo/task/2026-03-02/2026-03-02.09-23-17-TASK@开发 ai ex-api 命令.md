---
runAt: 2026-02-12.22-47-18
title: 开发 ai ex-api 命令
---

# 任务

开发 `ai ex-api` 命令对已经开发好的 API 进行授权，此命令为固定命令，要完成全套执行操作，系统重启后要保证权限生效，且命令必须拥有幂等性。

### 前置条件

1. 当前项目中 `.r2mo/task/command/ex-api.yaml` 配置文件必须存在，不存在则直接退出，并且提示用户配置文件缺失。
2. 环境变量必须，检查这些环境变量必须存在，不存在则跳出
	```bash
	export Z_DB_TYPE="MYSQL"   # 数据库类型: MYSQL /   SQLSERVER / ORACLE / POSTGRESQL  
	export Z_DB_HOST="127.0.0.1"  
	export Z_DB_PORT="3306"
	export Z_DBS_INSTANCE=""
	export Z_DB_APP_USER="r2admin"  
	export Z_DB_APP_PASS="r2admin"
	```
3. 环境变量检查（这个步骤必须）
	```bash
	export Z_APP_ID=???
	export Z_TENANT=???
	export Z_SIGMA=???
	```
4. `ex-api.yaml` 的基本格式
	```yaml
	metadata:
	  identifier: "核心标识符"
	  brief: "接口描述"
	  resource: "resource.ambient"
	  level: ???
	  ptype: "权限集 S_PERM_SET 类型"
	  pname: "权限集 S_PERM_SET 名称"
      keyword: "app.test.data"
	target:
	  root: "ZERO_MODULE"
	  module: "ambient"
	```
5. 存在 target 配置多检查一个环境变量 ZERO_MODULE，并且检查`{ZERO_MODULE}/zero-exmodule-{module}` 是否一个标准的DPA架构，若不是则命令退出

### 执行逻辑

1. 检查前置条件是否满足，不检查 `ex-api.yaml` 的格式问题
2. 参数检查：
	- `-r "<METHOD> <uri>"` ，其中 `r` 的全称是 `request`
	- `-s`，其中 `s` 的全称是 `skip`，若如此则只生成 Excel，可能最终不完美（没做去重检查），但交给开发人员处理
3. 定义表信息
	- `S_RESOURCE`：资源定义
	- `S_ACTION`：操作定义
	- `S_PERMISSION`：权限定义
	- `S_PERM_SET`：权限集定义
	- `R_ROLE_PERM`：角色权限定义
4. 先检查 `S_ACTION` 中是否已经存在当前参数，按列名开发（`METHOD, URI`；不唯一时追加 `SIGMA, APP_ID, TENANT_ID`），只有当 `METHOD, URI` 无法提取唯一记录时追加后续三个查询条件
	- 若存在不创建数据记录，提取 `S_ACTION` 中的 ID
	- 若不存在则创建数据记录 / `S_RESOURCE` 需要同步创建（因为 `S_RESOURCE` 资源是新的）
5. 询问用户：追加新权限 / 执行已有权限，若执行已有权限，按 `S_PERMISSION` 中的 identifier 进行查询让用户选择追加到那个权限（追加到已有权限则直接跳过额外的数据库操作）
6. 提取数据库中已有的 `S_ROLE` 角色信息，可多选，让用户选择当前 API 授权给哪些角色

## 输出说明

### 数据库输出

- 同步五张表的信息，注意要幂等性，不引起异常

### Excel输出

1. 如果存在 `target` 的配置，则输出项目根目录应该是 `${ZERO_MODULE}/zero-exmodule-{module}`，它必须是 DPA 架构，生成的 `excel` 的信息应该位于 `${ZERO_MODULE}/zero-exmodule-{module}/zero-exmodule-{module}-domain` 的资源目录下，开发时查看一下，有一个 `plugins/***/security/RBAC_RESOURCE` 目录。
2. Excel 直接覆盖，不提示选择文件；文件名固化为 `identifier-method-uri.xlsx`（uri 中 `/` 转 `-`）；无 target 时输出到 **-api** 项目下 `plugins/.../security/`。
3. `plugins/***/security/RBAC_ROLE/ADMIN.SUPER/`（固定）写入带 **falcon** 前缀的同名文件（`falcon-identifier-method-uri.xlsx`）；若没有 `target` 则写入当前/ -api 项目下的 `plugins/zero-launcher-configuration/security/` 目录下。
4. `plugins` 都是从 maven 项目的 src/main/resources 开始计算
5. 在目标路径下生成对应的 `*.xlsx` 或更改现有的内容

### Excel 样式约定

- **默认模板**：模板位于 R2MO-INIT 项目固定路径 `src/_template/EXCEL/ex-api`，与执行命令所在项目无关；任意项目执行 ai ex-api 均使用该默认模板驱动。
- **仅填数据，样式与模板完全一致**：除写入的数据单元格 value 外，不修改任何 style（格式、颜色、边框、合并单元格、行数等）。不删行、不清格式、不填色、不设边框，输出与模板在视觉和结构上一致。

### 属性规则

-  `S_RESOURCE`
	- 资源名称，从 `ex-api.yaml` 中提取
	- `modelRole` -> UNION 固定值
	- 资源编码 `res` 前缀加 `S_ACTION` 的 code
	- `identifier / type / level` 这些配置文件中有
- `S_ACTION`
	- 操作编码，读取当前 `identifier` 下的核心操作编码追加 `act` 前缀
	- 操作名称同 `brief`（和资源一样）
	- 操作级别同 `S_RESOURCE`
- `S_PERMISSION`
	- 权限名称同 `brief`（备注也想通）
	- 权限码 `perm` 前缀
	- 所属模型 `identifier`
- `S_PERM_SET`：参考前边规则提取，配置文件中有
- 如果出现 `keyword`，则所有编码名称直接追加，不计算，比如
	- `res.${keyword}`
	- `act.${keyword}`
	- `perm.${keyword}`

### 核心输出

- 数据库中建立关系
- Excel中建立管理
- Excel中的UUID值固化

### 全局列补充（仅数据库，不写入 Excel）

仅**实体表**写入全局列：S_RESOURCE、S_ACTION、S_PERMISSION。若表中包含以下列则一并写入；Excel 中不输出这些列。关系表 R_ROLE_PERM 只有 ROLE_ID、**PERM_ID** 两列，无全局列。

| 列名 | 取值来源 |
|------|----------|
| `sigma` | 环境变量 `Z_SIGMA` |
| `appId` | 环境变量 `Z_APP_ID` |
| `tenantId` | 环境变量 `Z_TENANT` |
| `scope` | 环境变量 `Z_APP` |
| `createdBy` | 固定值 `9a0d5018-33ad-4c64-80bf-8ae7947c482f`（R2_BY） |
| `updatedBy` | 固定值 `9a0d5018-33ad-4c64-80bf-8ae7947c482f`（R2_BY） |
| `createdAt` | 当前时间（R2_NOW） |
| `updatedAt` | 当前时间（R2_NOW） |

- 全局列在开发时按建表固定写好，执行时不查元数据；Excel 输出中不包含上述全局列，仅做数据库同步。

### 表列信息（开发时对齐，执行时不查元数据）

**所有 SQL 与 Excel 表头列名在开发时按 RBAC 建表（如 zero-exmodule-rbac Flyway）固定写好；ai ex-api 执行时只执行 DML，不访问数据库元数据（不执行 SHOW COLUMNS 等）。**

- **R_ROLE_PERM**：关系表，仅两列 **ROLE_ID**、**PERM_ID**（无 `PERMISSION_ID`）。
- S_RESOURCE、S_ACTION、S_PERMISSION 实体表列名与 Flyway 一致：S_ACTION 用 **SIGMA/APP_ID/TENANT_ID**（非 Z_*），S_PERMISSION 用 **COMMENT**（非 REMARK）；唯一性查询带 SIGMA 以保证幂等。全局列（SIGMA/APP_ID/TENANT_ID/CREATED_BY/UPDATED_BY/CREATED_AT/UPDATED_AT）在代码中写死，不运行时查表。
- 开发阶段可用 `node script/scan-rbac-schema.js`（可选 `--write`）核对库表列名与脚本一致；不修改 RBAC 的 Flyway 配置。

### 执行约定（仅 DML，不查元数据）

- ai ex-api 执行时**只执行 DML**（SELECT/INSERT/INSERT IGNORE），**不访问数据库元数据**（如 SHOW COLUMNS）。
- 表列名在**开发时**按 RBAC 建表（如 Flyway）固定写好，运行时不再查询表结构。
- **假设**：执行时数据表已存在且结构固定；**禁止**表扫描、DDL、元数据提取（已知表结构，无需运行时获取）。

### 完整打印（成功与失败）

- **启动**：配置路径、request 参数、skip、数据库连接信息。
- **步骤**：已存在/已创建 S_RESOURCE、S_ACTION、S_PERMISSION，R_ROLE_PERM 同步角色数，Excel 写出路径。
- **成功**：`[ex-api] 执行完成（幂等）` 及汇总（ACTION_ID、RESOURCE_ID、PERMISSION_ID、授权角色数、Excel 路径）。
- **失败**：`[ex-api] 执行失败` + 错误信息、错误码、sqlMessage、sql 语句、堆栈。