# Zero工具箱

Zero工具箱为一个工具类型的项目，主要为后端项目和前端项目打造的辅助开发人员进行快速开发的命令行工具，该框架的前端项目和后端项目的地址如下：

前端：[http://www.vertxui.cn](http://www.vertxui.cn)

后端：[http://www.vertxup.cn](http://www.vertxup.cn)

## 1.安装办法

使用以下命令安装该工具

```
npm install -g vertx-ai
```

等你看到下边的输出信息后，证明安装过程已完成，目前最新版本：**0.2.10**。

```
/usr/local/bin/ai -> /usr/local/lib/node_modules/vertx-ai/src/ai.js
/usr/local/bin/aj -> /usr/local/lib/node_modules/vertx-ai/src/index.js
+ vertx-ai@0.2.10
added 77 packages from 119 contributors in 8.417s
```

## 2.工具教程

目前发布的工具教程如下：

### 2.1. 独立工具

* [T0001 - 工程初始化](/doc/gong-cheng-chu-shi-hua.md)
* [T0002 - UUID生成器](/doc/t0002-uuidsheng-cheng-qi.md)
* [T0003 - 数据模拟器](/doc/t0003-shu-ju-mo-ni-qi.md)
* [T0004 - Zero的服务通讯分析器](/doc/t0004-zerode-fu-wu-tong-xun-fen-xi-qi.md) -- **Zero Up框架专用命令**
* [T0005 - Json转Csv](/doc/t0005-liquibaseshu-ju-zhuan-huan-qi.md)

### 2.2. 【ZT】工具

ZT工具必须设置ZT环境变量，`export ZT=generated/tool`，这里必须存在目录`src/components/generated/tool`的目录，一旦设置过后，所有的命令都是作用于该模块：generated/tool，对应的基础信息如：

* **src/components/generated/tool - **Zero中的组件开发目录
* **src/cab/cn/components/generated/tool **- Zero中的资源文件目录

上边目录的详细结构参考前端文档：[http://www.vertxui.cn](http://www.vertxui.cn)，另外需要注意的是ZT命令必须在vertx-ui的根目录执行。

* [ZT0001 - Card创建](/doc/zt0001-pagecardchuang-jian.md)
* [ZT0002 - Form创建](/doc/zt0002-formchuang-jian.md)
* [ZT0003 - 处理Card按钮](/doc/zt0003-tian-jia-card-an-niu.md)
* [ZT0004 - 处理Modal遮罩效果](/doc/zt0004-chu-li-modal-zhe-zhao-xiao-guo.md)

## 3.索引

* [ai zero](/doc/gong-cheng-chu-shi-hua.md)
* [ai key](/doc/t0002-uuidsheng-cheng-qi.md)
* [ai data](/doc/t0003-shu-ju-mo-ni-qi.md)
* [ai ipc](/doc/t0004-zerode-fu-wu-tong-xun-fen-xi-qi.md)
* [ai csv](/doc/t0005-liquibaseshu-ju-zhuan-huan-qi.md)
* [ai ui.card](/doc/zt0001-pagecardchuang-jian.md)
* [ai ui.form](/doc/zt0002-formchuang-jian.md)
* [ai rs.left / ai rs.right](/doc/zt0003-tian-jia-card-an-niu.md)
* [ai rs.success / ai.rs.error / ai rs.confirm](/doc/zt0004-chu-li-modal-zhe-zhao-xiao-guo.md)



