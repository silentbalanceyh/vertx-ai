const javaPermission = require('./fn.j.permission');
const javaResource = require('./fn.i.resource');
const javaPlugin = require('./fn.j.plugin');
const javaMod = require('./fn.i.mod');
const javaInit = require('./fn.j.init');
const javaBundle = require('./fn.j.bundle');
const exported = {
    javaPermission,
    javaResource,
    javaPlugin,
    javaMod,
    javaInit,           // aj jinit
    javaBundle,
};
module.exports = exported;

/**
 * ## aj命令
 *
 * ### 1. 基本使用
 *
 * aj命令的专用语法如下：
 *
 * ```shell
 * aj <command> [options1|options2|options3...]
 * ```
 *
 * ### 2. 命令列表
 *
 * |命令执行|含义|
 * |---|:---|
 * |aj perm|生成某个角色的权限专用Excel数据文件|
 * |aj rs|为某个接口直接生成系统所需的权限文件，只针对超级管理员（key = `e501b47a-c08b-4c83-b12b-95ad82873e96`），<br/>若存在其他额外角色可以继续使用命令 `aj perm` 从超级管理员中拷贝。|
 * |aj plugin|「工程命令」生成第三方插件专用初始化命令，可为某个 Maven 插件实现初始化流程，包括代码生成。|
 * |aj mod|模块化专用命令，根据当前环境中的 __路由规划器__ 和 __模块规划器__ 自动化重写模块化专用配置文件。|
 * |aj init|「工程命令」根据后端脚手架初始化Zero后端工程命令。|
 * |aj bundle|OSGI目录初始化专用命令，可以为某个 OSGI 的 Bundle 按相关规范生成目录结构。|
 *
 * @module aj
 */