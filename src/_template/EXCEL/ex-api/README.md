# ai ex-api Excel 模板（R2MO-INIT 默认模板）

模板固定位于 **R2MO-INIT** 项目下的 `src/_template/EXCEL/ex-api`，与执行命令所在项目无关：任意项目执行 `ai ex-api` 时，均使用本目录下的默认模板驱动生成 RBAC_RESOURCE / RBAC_ROLE 的 xlsx，保证输出风格与模板一致。

- **template-RBAC_RESOURCE.xlsx**：RBAC 资源/权限集（S_PERM_SET 等 {TABLE} 区域）。
- **template-RBAC_ROLE.xlsx**：RBAC 角色权限（R_ROLE_PERM 等 {TABLE} 区域）。

模板仅保留表头结构（含 `{TABLE}`、中文表头、英文驼峰列名），**数据行已预清空**。ai ex-api 输出时**只写入数据单元格的 value**，除此以外不修改任何 style（格式、颜色、边框、合并单元格等），不删行、不清格式，输出与模板完全一致。

- **清空并压缩模板（一次性）**：在 r2mo-init 根目录执行  
  `node script/clear-excel-template-data.js`  
  会清除上述两个 xlsx 中所有 {TABLE} 区域的数据行，并将表间空隙压缩为仅 2 行空白，写回后 ai ex-api 仅填充。
- 若从 ZERO_MODULE 复制了新 xlsx 覆盖本目录模板，需重新执行一次上述脚本再使用。
