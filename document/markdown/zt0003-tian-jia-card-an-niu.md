# ZT0003 - 处理Card按钮

该命令主要为PageCard/HelpCard组件添加左右的按钮，而且只改资源文件，主命令：

```shell
# 执行命令之前
export ZT=generated/tool

ai rs.left
ai rs.right
```

## 0.执行效果

执行之前：

```json
{
    "_page": {
        "title": "测试标题"
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
    }
}
```

## 1.执行命令

```shell
> ai rs.left -v btnSubmit,提交,primary

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.12  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] 开启ZT模块开发环境，当前模块：generated/tool，特殊命令只能在【ZT】环境使用。
[Zero AI] Zero AI 系统启动......
[Zero AI] 命令参数：
{
    "value": "btnSubmit,提交,primary",
    "path": "UI"
}
btnSubmit,提交,primary
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
[Zero AI] ( Add ) 添加key = btnSubmit的按钮条目为：btnSubmit,提交,primary
[Zero AI] （Async）成功将数据写入到文件：/Users/lang/Develop/Source/vertx-ui/src/cab/cn/components/generated/tool/UI.json！
```

## 2.命令说明

```shell
> ai rs.left -h

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.12  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] 开启ZT模块开发环境，当前模块：generated/tool，特殊命令只能在【ZT】环境使用。
[Zero AI] Zero AI 系统启动......

  Usage: rs.left [options] [-p, --path | -v, --value]

  【ZT命令】生成Card左按钮专用处理

  Options:

    -p, --path   【UI】被写的资源文件
    -v, --value  被追加的值
    -h, --help   output usage information
```

## 3.参数说明

| 参数格式 | 必填 | 说明 |
| :--- | :--- | :--- |
| -p, --path | 否 | 【UI】修改的资源文件名 |
| -v, --value | 是 | 被追加的值 |

特殊说明：

* 需要追加的语法参考VertxUI中的`aiExprButton`处理，设置的值如：`btnSave,提交,primary`——这里的`btnSave`是当前按钮的id和key，“提交”是按钮上的文字，primary则是按钮类型。
* 按钮的connectId的生成规则如：`btnSave -> $opSave`。
* 如果改变的不是`UI.json`文件，而是其他文件，则设置`--path`参数。
* `rs.right`的写法和`rs.left`写法一致，只是生成的是`_page -> right`节点中的信息。

这里的`$opSave`最终会让你在`Op.js`目录中保证有`$op`打头的函数，函数格式如：

```typescript
const $opApprove = (reference: any) => (event: any) => {
    // 按钮逻辑
}
export default {
    $opApprove
}
```



