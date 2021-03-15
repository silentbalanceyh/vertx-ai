# T0002 - UUID生成器

UUID生成器为已经存在的数据文件追加UUID格式的字段，主命令：

```
ai key
```

## 0.准备

在执行该命令之前准备一个数据文件，文件格式如下：

```json
{
    "data": {
        "field": "object"
    },
    "list": [
        {
            "field": "array"
        }
    ],
    "datum": {
        "person": {
            "username": "Lang"
        }
    }
}
```

保存该文件到当前目录，文件名为`fnData.json`，然后执行该命令。

## 1.示例

```shell
> ai key -d fnData.json

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.10  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] Zero AI 系统启动......
[Zero AI] 命令参数：
{
    "data": "fnData.json",
    "field": "key",
    "path": "data"
}
[Zero AI] 成功将数据写入到文件：fnData.json！
```

执行完过后打开该文件，则可以看到相关改变：

```json
{
    "data": {
        "field": "object",
        "key": "d67a0150-0ae8-4199-a9be-566b975482f1"
    },
    "list": [
        {
            "field": "array"
        }
    ],
    "datum": {
        "person": {
            "username": "Lang"
        }
    }
}
```

## 2.命令说明

```shell
> ai key -h

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.10  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] Zero AI 系统启动......

  Usage: key [options] [-d, --data | -f, --field | -p, --path]

  为数据模板添加key属性，key为UUID格式

  Options:

    -d, --data   您的数据文件路径
    -f, --field  【key】标识key的字段名，默认为key
    -p, --path   【data】需要设置的数据节点路径
    -h, --help   output usage information
```

## 3.参数说明

| 参数格式 | 必填 | 说明 |
| :--- | :--- | :--- |
| -d, --data | 是 | 需要修改的数据文件路径，该路径必须存在，并且是可直接执行JSON序列化格式的数据内容。 |
| -f, --field | 否 | 【默认值key】追加的UUID的字段名，不设置则追加key，已经存在的字段值不追加。 |
| -p, --path | 否 | 【默认值data】在数据文件中筛选从哪个节点开始执行UUID的相关字段的追加，默认从data节点（Zero规范）开始，且path支持带点（.）的操作符进行分开。只有Object/Array类型的数据会被追加，而且Array是在每一个Object元素中追加。 |

## 4.使用path和field

执行下边的命令

```shell
> ai key -d fnData.json -f uniqueKey -p datum.person

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.10  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] Zero AI 系统启动......
[Zero AI] 命令参数：
{
    "data": "fnData.json",
    "field": "uniqueKey",
    "path": "datum.person"
}
[Zero AI] 成功将数据写入到文件：fnData.json！
```

执行过后的文件为，注意`datum.person`节点中多出了一个uniqueKey的UUID节点：

```json
{
    "data": {
        "field": "object",
        "key": "d67a0150-0ae8-4199-a9be-566b975482f1"
    },
    "list": [
        {
            "field": "array"
        }
    ],
    "datum": {
        "person": {
            "username": "Lang",
            "uniqueKey": "68039629-90bc-4143-9f49-d22dce731ba5"
        }
    }
}
```



