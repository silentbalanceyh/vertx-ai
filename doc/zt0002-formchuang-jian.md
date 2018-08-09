# ZT0002 - Form创建

主命令：

```shell
# 执行命令之前
export ZT=generated/tool

ai ui.form
```

## 1.运行命令

```shell
>  ai ui.form -m FORM -p UI.Form.Add                                                                                                                                                                       
[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.12  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] 开启ZT模块开发环境，当前模块：generated/tool，特殊命令只能在【ZT】环境使用。
[Zero AI] Zero AI 系统启动......
[Zero AI] 命令参数：
{
    "module": "FORM",
    "path": "UI.Form.Add",
    "yes": false
}
[Zero AI] Branch, 指定目录：src/components/generated/tool
[Zero AI] Component, 生成组件目录：/Users/lang/Develop/Source/vertx-ui/src/components/generated/tool
[Zero AI] Page, 生成页面文件目录：/generated/tool
[Zero AI] Resource, 生成资源文件目录：/Users/lang/Develop/Source/vertx-ui/src/cab/cn/components/generated/tool
[Zero AI] 使用的语言代码：cn
[Zero AI] 文件颜色说明：JavaScript / TypeScript / Less / Json
[Zero AI] ==> UI文件：UI.Form.Add.js / UI.Form.Add.json
[Zero AI] ==> Epic文件：Act.Types.js / Act.Epic.js
[Zero AI] ==> Op文件：Op.ts
[Zero AI] ==> Less文件：Cab.less
[Zero AI] ==> Cab名空间：Cab.json
[Zero AI] ( Skip ) 名空间文件已存在：/Users/lang/Develop/Source/vertx-ui/src/components/generated/tool/Cab.json
[Zero AI] （Async）成功将数据写入到文件：/Users/lang/Develop/Source/vertx-ui/src/components/generated/tool/Op.ts！
[Zero AI] （Async）成功将数据写入到文件：/Users/lang/Develop/Source/vertx-ui/src/cab/cn/components/generated/tool/UI.Form.Add.json！
[Zero AI] （Async）成功将数据写入到文件：/Users/lang/Develop/Source/vertx-ui/src/components/generated/tool/UI.Form.Add.js！
```

## 2.命令说明

```shell
> ai ui.form -h                                                                   
[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.12  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] 开启ZT模块开发环境，当前模块：generated/tool，特殊命令只能在【ZT】环境使用。
[Zero AI] Zero AI 系统启动......

  Usage: ui.form [options] [-y, --yes | -m, --module | -p, --path]

  【ZT命令】生成Form页面专用命令

  Options:

    -y, --yes     【false】是否覆盖当前存在组件
    -m, --module  【FORM】当前Form组件的配置，支持4个值
    -p, --path    【UI.Form】当前Form文件的名称
    -h, --help    output usage information
```

## 3.参数说明

| 参数格式 | 必填 | 说明 |
| :--- | :--- | :--- |
| -m, --module | 否 | 【FORM】默认模块种类 |
| -p, --path | 否 | 【UI.Form】生成文件名称 |
| -y, --yes | 否 | 【false】是否重写该组件 |

特殊说明：

* 参数m的值主要有：
  * `FORM`：添加表单专用Form；
  * `EDIT`：编辑表单专用Form；
  * `FILTER`：搜索表单专用Form；
  * `HALF`：（保留）



