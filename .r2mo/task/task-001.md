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
	export Z_TENANT_ID=???
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
4. 先检查 `S_ACTION` 中是否已经存在当前参数，分析数据表提取列来开发（`METHOD, URI, Z_APP_ID, Z_TENANT_ID, Z_SIGMA`），只有当 `METHOD, URI` 无法提取唯一记录时追加后续三个查询条件
	- 若存在不创建数据记录，提取 `S_ACTION` 中的 ID
	- 若不存在则创建数据记录 / `S_RESOURCE` 需要同步创建（因为 `S_RESOURCE` 资源是新的）
5. 询问用户：追加新权限 / 执行已有权限，若执行已有权限，按 `S_PERMISSION` 中的 identifier 进行查询让用户选择追加到那个权限（追加到已有权限则直接跳过额外的数据库操作）
6. 提取数据库中已有的 `S_ROLE` 角色信息，可多选，让用户选择当前 API 授权给哪些角色

## 输出说明

### 数据库输出

- 同步五张表的信息，注意要幂等性，不引起异常

### Excel输出

1. 如果存在 `target` 的配置，则输出项目根目录应该是 `${ZERO_MODULE}/zero-exmodule-{module}`，它必须是 DPA 架构，生成的 `excel` 的信息应该位于 `${ZERO_MODULE}/zero-exmodule-{module}/zero-exmodule-{module}-domain` 的资源目录下，开发时查看一下，有一个 `plugins/***/security/RBAC_RESOURCE` 目录。
2. 如果目标目录中已经存在了 `*.xlsx` 的文件，则让用户选择写入哪个文件，预留一个菜单创建新的 `*.xlsx` 文件。
3. `plugins/***/security/RBAC_ROLE/ADMIN.SUPER/`（固定）写入和第二步文件名相同的内容的文件中，若没有 `target` 则写入当前项目下的 `plugins/zero-launcher-configuration/security/` 目录下。
4. `plugins` 都是从 maven 项目的 src/main/resources 开始计算
5. 在目标路径下生成对应的 `*.xlsx` 或更改现有的内容

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

### 核心输出

- 数据库中建立关系
- Excel中建立管理
- Excel中的UUID值固化