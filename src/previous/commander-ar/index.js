const reactComplex = require('./fn.i.complex');
const reactForm = require('./fn.i.form');
const exported = {
    reactComplex,
    reactForm,
}
module.exports = exported;

/**
 * ## art命令
 *
 * ### 1. 基本使用
 *
 * art命令的专用语法如下：
 *
 * ```shell
 * art <command> [options1|options2|options3...]
 * ```
 *
 * ### 2. 命令列表
 *
 * |命令执行|含义|
 * |---|:---|
 * |art complex|「模块」生成`ExListComplex`专用模块。|
 * |art form|「组件」生成`ExForm`专用组件。|
 *
 * ### 3. 标准化配置
 *
 * ```js
 * {
 *      module: 'ZT环境变量设置的模块',
 *      language: 'Z_LANGUAGE语言环境变量设置，默认「cn」',
 *      pathRoot: '系统根据执行目录计算的当前项目根目录',
 *      pathResource: '资源目录',
 *      pathUi: '生成代码目录',
 *      namespace: 'Cab.json中所需的名空间值',
 *      input: {
 *          params: {
 *              MODULE: '当前模块的文字描述名称',
 *              API: '构造标准接口`/api/xxx`的RESTful接口专用路径替换部分。',
 *              IDENTIFIER: '模型的统一标识符，最终会绑定到identifier中。'
 *          },
 *          tpl: {
 *              type: '使用的模板tpl文件目录，cab/下的目录名',
 *              source: '「单文件」单文件的拷贝源',
 *              target: '「单文件」单文件的目标拷贝文件'
 *          }
 *      },
 *      runtime: {
 *          namespaceFile: 'Cab.json文件生成路径',
 *          resource: '资源文件的根目录',
 *          resourceFiles: {
 *              'fileName1': '资源文件地址，json后缀，模板则是fileName1.tpl文件',
 *              'fileName2': '......'
 *          },
 *          ui: '代码文件根目录',
 *          uiFiles: {
 *              'fileName1': '代码文件地址，js后缀，模板则是fileName1.tpl文件',
 *              'fileName2': '......'
 *          }
 *      }
 * }
 * ```
 *
 *
 * ### 4. 标准化模板参数
 *
 * > `tpl`文件中替换的部分会使用配置文件中的参数来替换。
 *
 * |参数|替换部分|含义|
 * |:---|---|:---|
 * |MODULE|`#MODULE#`|当前模块的文字描述名称。|
 * |API|`#API#`|构造标准接口`/api/xxx`的RESTful接口专用路径替换部分。|
 * |IDENTIFIER|`#IDENTIFIER#`|模型的统一标识符，最终会绑定到identifier中。|
 * |NAME|`#NAME#`|绑定文件设定，直接赋值`input.params.NAME = tpl.target`生成单文件专用。|
 * |SIGMA|`#SIGMA`|SIGMA统一标识符，用于标识租户、应用。|
 * |ROLE_ID|`#ROLE_ID#`|操作的角色ID。|
 * |PREFIX|无|生成文件专用参数，不在模板中。|
 * |SHEET|无|工作专用的Sheet名，不在模板中。|
 *
 *
 * @module art
 */