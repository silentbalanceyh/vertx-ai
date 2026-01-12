# Zero工具箱

Zero工具箱为一个工具类型的项目，主要为后端项目和前端项目打造的辅助开发人员进行快速开发的命令行工具，该工具可以帮助开发人员执行
`Zero/Zero Ui`
的智能化开发，版本会持续发布到npm社区。

* 详细文档：[Zero Ai命令](http://www.vertxai.cn/document/doc-web/index.html)

![npm version](https://img.shields.io/npm/v/zero-ai.svg)

## 0. 引导

- （后端）Zero Ecotope：<https://www.zerows.io>
- （前端）Zero UI：<https://www.vertxui.cn>
- （工具）Zero AI：<https://www.vertxai.cn>
- （标准）Zero Schema：<https://www.vertx-cloud.cn>

## 1. 安装流程

> Windows必须启用 WSL 才可用

使用以下命令安装该工具

```
npm install -g zero-ai
```

等你看到下边的输出信息后，证明安装过程已完成：

```
/usr/local/bin/ai -> /usr/local/lib/node_modules/vertx-ai/src/ai.js
+ zero-ai@0.3.25
added 77 packages from 119 contributors in 8.417s
```

## 2. 常用命令说明

```bash
# 常用命令可直接查看帮助信息
ai help

# 初始化 R2MO Spring 工程脚手架
ai spring -name app-fly
ai spring -n app-fly

# 初始化 ZERO Vertx 工程脚手架
ai zero -name app-wait
ai zero -n app-wait
```









