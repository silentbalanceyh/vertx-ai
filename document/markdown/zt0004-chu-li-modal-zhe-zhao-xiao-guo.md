# ZT0004 - 处理Modal遮罩效果

遮罩效果的命令主要用于一些常用的改动，主命令：

```shell
# 执行命令之前
export ZT=generated/tool

ai rs.success
ai rs.error
ai rs.confirm
```

## 0.执行效果

执行之前：

```json
{
    "_page": {
        "title": "测试标题",
        "left": [
            "btnSubmit,提交,$opSubmit,primary"
        ]
    }
}
```

执行之后：

```json
{
    "_page": {
        "title": "测试标题",
        "left": [
            "btnSubmit,提交,$opSubmit,primary"
        ]
    },
    "_modal": {
        "success": {
            "added": "您的部门已经添加成功"
        }
    }
}
```

## 1.执行命令

```shell
> ai rs.success -v added=您的部门已经添加成功

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.12  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] 开启ZT模块开发环境，当前模块：generated/tool，特殊命令只能在【ZT】环境使用。
[Zero AI] Zero AI 系统启动......
[Zero AI] 命令参数：
{
    "value": "added=您的部门已经添加成功",
    "path": "UI"
}
[Zero AI] Branch, 指定目录：src/components/generated/tool
[Zero AI] Component, 生成组件目录：/Users/lang/Develop/Source/vertx-ui/src/components/generated/tool
[Zero AI] Page, 生成页面文件目录：/generated/tool
[Zero AI] Resource, 生成资源文件目录：/Users/lang/Develop/Source/vertx-ui/src/cab/cn/components/generated/tool
[Zero AI] 使用的语言代码：cn
[Zero AI] 文件颜色说明：JavaScript / TypeScript / Less / Json
[Zero AI] ==> UI文件：UI.js / UI.json
[Zero AI] ==> Epic文件：Act.Types.js / Act.Epic.js
[Zero AI] ==> Op文件：Op.js
[Zero AI] ==> Less文件：Cab.less
[Zero AI] ==> Cab名空间：Cab.json
[Zero AI] 设置 _modal -> success -> added = "您的部门已经添加成功"
[Zero AI] （Async）成功将数据写入到文件：/Users/lang/Develop/Source/vertx-ui/src/cab/cn/components/generated/tool/UI.json！
```

## 2.命令说明

```shell
> ai rs.success -h                                        

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.12  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] 开启ZT模块开发环境，当前模块：generated/tool，特殊命令只能在【ZT】环境使用。
[Zero AI] Zero AI 系统启动......

  Usage: rs.success [options] [-p, --path | -v, --value]

  【ZT命令】写success消息到资源文件

  Options:

    -p, --path   【UI】被写的资源文件名
    -v, --value  被追加的值
    -h, --help   output usage information
```

## 3.参数说明

| 参数格式 | 必填 | 说明 |
| :--- | :--- | :--- |
| -v, --value | 是 | key=value的格式，设置modal的遮罩消息 |
| -p, --path | 否 | 【UI】默认的资源文件名称 |



