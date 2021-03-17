/**
 * ## `Ec.E`
 *
 * ### 1. 基本介绍
 *
 * 该类为错误信息定义专用类，方法名采用`fn<Code>`的方式执行最终输出的错误信息内容。通常使用下边代码：
 *
 * ```js
 * // 第一种调用方法：第一参直接是错误代码
 * Ec.fxError(10001, arg1, arg2);
 *
 * // 第二种调用方法：第一参是Boolean值，true就输出，第二参是错误代码
 * const checked = true;
 * Ec.fxError(checked, 10001, arg1, arg2);
 *
 * // 第三种调用方法：第一参是Function，执行后结果为true就输出，第二参是错误代码
 * const fnChecked = () => true;
 * Ec.fxError(fnChecked, 10001, arg1, arg2);
 * ```
 *
 * ### 2. 错误代码表
 *
 * |代码|参数表|含义|
 * |---|---|:---|
 * |10001|`arg,type`|输入参数类型不匹配。|
 * |10002|`arg,type,expected`|「带期望」输入参数和期望参数不匹配。|
 * |10003|`fileType`|文件类型无法被解析。|
 * |10004|`command`|无法识别命令名，不在可解析的命令中。|
 * |10005|`command,expected`|「带期望」输入的命令不在期望的命令列表中。|
 * |10006|`arg`|命令执行中丢失了必须的参数。|
 * |10007|`path`|输入的目录不存在，或者输入路径并不是一个目录。|
 * |10008|`path`|目录不存在，或输入路径是一个文件。|
 * |10009|`path`|路径直接不存在，不论目录还是文件都不存在。|
 * |10010|`projects`|系统检测到两个或两个以上的项目目录，系统无法定位操作项目环境。|
 * |10011|`config`|「后端」配置数据中丢失了`api`属性值。|
 * |10012|`member,clazz`|「后端」在查找的`clazz`类名中无法找到（成员变量/成员函数）`member`。|
 * |10013|`lineType`|工具无法分析行类型，输入的文件内容不符合Zero Ai的基本规范，无法解析源代码。|
 * |10014|`pkg`|「后端」系统找到了超过两个以上的`package`语句，这个在定义过程中是非法的，不可连续执行。|
 * |10015|`method,clazz`|「后端」在查找的`clazz`类名中找到了重复的（成员函数/成员变量）`method`，所以非法。|
 * |10016|`command`|「前端」Zero UI规范错误，不可执行当前命令。|
 * |10017|`root`|「前端」Zero项目的目录并非一个合法的项目目录，请定位到合法的项目目录中。|
 * |10018|`resource`|「前端」资源文件绑定过程中出现了资源错误，请检查环境或执行命令。|
 * |10019|`root`|「前端」当前命令只能在项目根目录中执行（带有package.json文件），其他目录不可执行该方法。|
 * |10020|`menuData`|「前端」当前菜单数据必须是一个合法的Array类型，当前类型不对。|
 * |10021|`field,value`|条件`field=value`引起了重复数据记录，导致不匹配UK规范，检查重复数据专用错误。|
 * |10022|`root`|「前端/后端」无法定位项目的根目录，不可执行项目专用类命令。|
 * |10023|`folder`|「前端」初始化项目时检测到输入的文件路径是一个非空目录，不可执行Zero AI的初始化。|
 * |10024|`path`|当前操作和输入的路径冲突，不可在路径中执行操作指令。|
 * |10025|`configKey`|「前端」配置项主键丢失了核心配置，在生成前端Web组件时出现了规范冲突。|
 * |10026|`path`|「前端」输入路径非法，不在支持的Zero Ui专用路径规范中。|
 * |10027|`modulePath`|「前端」输入路径必须是`<module>/<page>`格式，当前路径并非该格式，和规范冲突。|
 * |10028|`arg`|「前端」模块参数不在枚举值中，必须是四者之一：`FORM, FILTER, HALF, EDIT`。|
 * |10029|`zt`|「带期望」环境变量缺失或者格式不对，必须是`<module>/<page>`格式。|
 * |10030|`arg, key`|「开发专用」方法要求资源文件中必须包含`key`属性，当前`key`属性值不对。|
 * |10031|`id`|「开发专用」当前HTML按钮元素要求`btn`前缀，输入前缀不合法。|
 * |10032|`platform`|操作系统不支持当前命令，或者该操作系统平台中还未实现该命令的执行逻辑。|
 *
 * @class E
 */
module.exports = {
    // 基础
    fn10001: (arg, type) => `[AI-10001] Argument must be '${type}', but now it's '${arg}'`,
    fn10002: (arg, type, expected) => `[AI-10002] Argument must be in (${expected}), but now it's '${arg}' of '${type}'`,

    // 命令
    fn10003: (fileType) => `[AI-10003] The fileType='${fileType}' is unknown and could not found parser`,
    fn10004: (command) => `[AI-10004] The executor of command '${command}' could not be found`,
    fn10005: (command = "未输入", expected) => `[AI-10005] The command '${command}' could not be found, expected '${expected}'`,
    fn10006: (arg) => `[AI-10006] The command missed required arguments: '${arg}'`,

    // 路径
    fn10007: (path) => `[AI-10007] The file '${path}' does not exist or it's a directory.`,
    fn10008: (path) => `[AI-10008] The directory '${path}' does not exist or it's a file.`,
    fn10009: (path) => `[AI-10009] The path '${path}' does not exist.`,

    // 后端
    fn10010: (projects = []) => `[AI-10010] The tool detect more than one project folders, found '${projects.length}', please switch.`,
    fn10011: (config) => `[AI-10011] 'api' attribute has been missed in current config ${JSON.stringify(config)}`,
    fn10012: (member, clazz) => `[AI-10012] Duplicated member '${member}' found in class '${clazz}', please check.`,
    fn10013: (lineType) => `[AI-10013] Zero system could not analyze the code line type, type = ${lineType} is Unknown`,
    fn10014: (pkg) => `[AI-10014] More than one 'package' sentence found.${JSON.stringify(pkg)}`,
    fn10015: (method, clazz) => `[AI-10015] Duplicated method '${method}' found in class '${clazz}', please check.`,

    // 前端
    fn10016: (command) => `[AI-10016] Zero UI specification wrong, you could not execute in '${command}'`,
    fn10017: (root) => `[AI-10017] Current folder '${root}' is not project folder, please switch to project root directory`,
    fn10018: (resource) => `[AI-10018] Zero Resource config file missing '${resource}', please check.`,
    fn10019: (root) => `[AI-10019] This command could run in project root folder only, current folder = ${root}`,
    fn10020: (menuData) => `[AI-10020] The menu data file must be json format with 'data' (Array) node, current = ${menuData}`,
    fn10021: (field, value) => `[AI-10021] The condition '${field} = ${value}' hit duplicated record in your file.`,
    fn10022: (root) => `[AI-10022] Could not find root folder of current project. ${root}`,
    fn10023: (folder) => `[AI-10023] Initialized folder must be empty, current ${folder} is invalid`,
    fn10024: (path) => `[AI-10024] This operation is not allowed for current path ${path}`,
    fn10025: (configKey) => `[AI-10025] Web control initialized require "actual.data" must be string, current:${configKey}`,
    fn10026: (path) => `[AI-10026] The path is invalid, ${path}, system support one of ".", "src/components/xxx", "xxx".`,
    fn10027: (modulePath) => `[AI-10027] The path must be format with "<module>/<page>", could not be others, current = ${modulePath}`,
    fn10028: (arg) => `[AI-10028] The "module" parameter must be one of "FORM", "FILTER", "HALF", "EDIT" values. current = ${arg}`,
    fn10029: (zt, name) => `[AI-10029] [DEV] You'll use development command, please set "${name}" environment first, format = "<module>/<page>", current = ${zt}`,
    fn10030: (arg, key) => `[AI-10030] [DEV] This method require "${key}" in your resource file, but current "${key}" = ${arg}`,
    fn10031: (id) => `[AI-10031] [DEV] Button key must start with "btn", current ${id}`,
    fn10032: (platform) => `[AI-10032] This api is not implemented in current platform os.platform() -> '${platform}'`
};