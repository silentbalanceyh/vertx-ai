# T0005 - Json转Csv

Json格式的数据转换成Csv是在Jhipster开发过程中需要导入数据时的专用工具，主命令：

```shell
ai csv
```

## 0.配置文件

配置文件中可设置当前字段需要执行转换的情况：

```properties
P;
last_modified_by=lastModifiedBy
```

> 有一个限制就是输入的数据文件必须包含`data`节点，系统会从data节点开始执行转换，并且是一个JsonArray的数组类型。

## 1.运行命令

### 1.1.不设置配置

```shell
> ai csv -p department.json -s ";" 

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.11  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] Zero AI 系统启动......
[Zero AI] 命令参数：
{
    "path": "department.json",
    "config": null,
    "separator": ";"
}
[Zero AI] 使用分隔符：;
[Zero AI] 成功将数据写入到文件：./b97b15e8-2dd9-454a-8a14-ba4f1e20f525.csv！
```

### 1.2.设置配置文件

```shell
ai csv -p department.json -s ";" -c config.zero

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.11  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] Zero AI 系统启动......
[Zero AI] 命令参数：
{
    "path": "department.json",
    "config": "config.zero",
    "separator": ";"
}
[Zero AI] 使用分隔符：;
[Zero AI] 字段执行转换：last_modified_by -> lastModifiedBy
[Zero AI] 成功将数据写入到文件：./f744f24a-48f0-452d-8479-59f4dcdc3963.csv！
```

## 2.参数说明

| 参数格式 | 必填 | 说明 |
| :--- | :--- | :--- |
| -p, --path | 是 | 输入的json数据文件路径 |
| -c, --config | 否 | 是否使用配置文件执行字段转换 |
| -s, --separator | 否 | 【,】生成的csv文件的分割符，默认使用逗号 |



