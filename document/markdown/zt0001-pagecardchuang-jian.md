# ZT0001 - Card创建

主命令：

```
# 执行命令之前
export ZT=generated/tool

ai ui.card
```

## 1.运行命令

```shell
> ai ui.card -v 测试标题                                                                                                                                                                                  

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.12  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] 开启ZT模块开发环境，当前模块：generated/tool，特殊命令只能在【ZT】环境使用。
[Zero AI] Zero AI 系统启动......
[Zero AI] 命令参数：
{
    "value": "测试标题",
    "yes": false
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
[Zero AI] （Async）成功将数据写入到文件：/Users/lang/Develop/Source/vertx-ui/src/components/generated/tool/UI.js！
[Zero AI] （Async）成功将数据写入到文件：/Users/lang/Develop/Source/vertx-ui/src/cab/cn/components/generated/tool/UI.json！
[Zero AI] （Async）成功将数据写入到文件：/Users/lang/Develop/Source/vertx-ui/src/components/generated/tool/Cab.json！
```

## 2.命令说明

```shell
> ai ui.card -h    

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.12  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] 开启ZT模块开发环境，当前模块：generated/tool，特殊命令只能在【ZT】环境使用。
[Zero AI] Zero AI 系统启动......

  Usage: ui.card [options] [-y, --yes | -v, --value]

  【ZT命令】生成PageCard页面专用命令

  Options:

    -y, --yes    【false】是否覆盖当前存在组件
    -v, --value  当前PageCard所需基本配置，只能配title和type，type默认是PageCard
    -h, --help   output usage information
```

## 3.参数说明

| 参数格式 | 必填 | 说明 |
| :--- | :--- | :--- |
| -v, --value | 必须 | 设置标题信息 |
| -y, --yes | 否 | 【false】是否重写该组件 |



