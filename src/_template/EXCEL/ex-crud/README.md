# ai ex-crud 模板（R2MO-INIT 默认模板）

模板固定位于 **R2MO-INIT** 项目下的 `src/_template/EXCEL/ex-crud`。执行 `ai ex-crud` 时读取**目标项目**的 `.r2mo/task/command/ex-crud.yaml`，用其 `metadata` 替换模板中的占位符后，生成到目标项目的 `plugins/{pluginId}/security/RBAC_CRUD` 下。

## 占位符（五种，替换顺序避免冲突）

| 占位符/参考字面 | 说明 | 示例 |
|----------------|------|------|
| `x.log`         | identifier | 如 `x.crud` |
| `x-log`         | actor      | 如 `x-crud` |
| `log`           | keyword    | 如 `log` / `crud` |
| `日志`          | name       | 中文名称 |
| `resource.ambient` | type   | 资源类型 |

替换顺序为：先 `x.log`、再 `x-log`、再 `log`，避免先替换 `log` 导致 `x-log`/`x.log` 被破坏。

- 路径（目录/文件名）：按上述顺序替换字面；也支持 `{{identifier}}`、`{{actor}}`、`{{keyword}}`、`{{name}}`、`{{type}}`。
- 文件内容：同上；所有 UUID 会重新生成。

## 目录与 seekSyntax

- 模板中可用参考目录名如 `x.log`、`res.log.read`，生成时会被替换为 yaml 中的 identifier / keyword。
- `seekSyntax.json` 所在路径及 JSON 内容中的 identifier 等也会被替换；路径与 ex-crud.yaml 的 metadata 一致即可。

## 执行流程

1. 仅根据 ex-crud.yaml 与模板生成 CRUD 文件（不访问数据库）。
2. 若不使用 `-s`/`--skip`：连接数据库，查/建 S_PERMISSION，列出 S_ROLE 供用户多选，写 `falcon-crud-{identifier}.xlsx` 到 `RBAC_ROLE/ADMIN.SUPER`。
