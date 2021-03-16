# Zero工具箱

Zero工具箱为一个工具类型的项目，主要为后端项目和前端项目打造的辅助开发人员进行快速开发的命令行工具，该框架的前端项目和后端项目的地址如下：

* 前端：[http://www.vertxui.cn](http://www.vertxui.cn)
* 后端：[http://www.vertxup.cn](http://www.vertxup.cn)
* 详细文档：[Zero Ai文档](http://www.vertxai.cn/document/doc-web/index.html)

该工具可以帮助开发人员执行`Zero/Zero Ui`的智能化开发，工具最新版本为`0.3.0`，目前已发布到npm社区。

## 1. 安装流程

使用以下命令安装该工具

```
npm install -g vertx-ai
```

等你看到下边的输出信息后，证明安装过程已完成，目前最新版本：**0.3.0**。

```
/usr/local/bin/ai -> /usr/local/lib/node_modules/vertx-ai/src/ai.js
/usr/local/bin/aj -> /usr/local/lib/node_modules/vertx-ai/src/aj.js
+ vertx-ai@0.3.0
added 77 packages from 119 contributors in 8.417s
```

## 2. 基本说明

> 下边是工具列表，主要分为两种：独立工具/Zero专用工具

* 独立工具：可直接调用`ai xxx`方式执行的工具。
* 专用工具：调用`aj xxx`，并且需要设置对应环境变量。

### 2.1. 环境变量表

|环境变量名|例子|含义|
|---|:---|:---|
|ZL|`export LG=cn`|「前端」默认为`cn`环境变量。|
|ZT|`export ZT=generated/tool`|「前端」接下来的所有ZT命令都是在generated/tool模块中执行。|
|ZF|`export ZF=ox-engine/ox-business`|「后端」接下来所有的ZF命令都在对应目录中执行。|

### 2.2. 注意点

* ZT环境变量设置后，必须存在目录`src/xxx`，如`ZT=generated/tool`，那么必须存在`src/generate/tool`目录，基础信息对应到
    * `src/components/generated/tool` - Zero中的组件开发目录
    * `src/cab/cn/components/generated/tool` - Zero中的资源文件目录
* ZF环境变量设置后，设置目录下必须包含`pom.xml`文件（后端项目基础结构，Maven检测）





