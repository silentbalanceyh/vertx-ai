const func_interface_io = require('./ai.export.interface.io');
const func_interface_util = require("./ai.export.interface.util");
const func_interface_string = require('./ai.export.interface.fn.string');

// const func_impl_parse = require('./ai.export.impl.fn.parse');
const func_impl_seek = require("./ai.export.impl.fn.seek");

const func_impl_excel = require('./ai.economy.impl.fn.excel');
const func_impl_plugin = require('./ai.economy.impl.fn.plugin');
const func_impl_react = require('./ai.economy.impl.fn.react');
const func_impl_java = require('./ai.economy.impl.fn.java');
const func_impl_execute = require('./ai.economy.impl.fn.execute');
const func_impl_json = require('./ai.economy.impl.fn.json');

const exported = {
    ...func_interface_io,
    ...func_interface_util,
    ...func_interface_string,

    // ...func_impl_parse,
    ...func_impl_seek,

    ...func_impl_execute,
    ...func_impl_excel,
    ...func_impl_react,
    ...func_impl_plugin,
    ...func_impl_java,
    ...func_impl_json,
};
/**
 * @overview
 *
 * # Zero Ai研发文档
 *
 * 该文档提供给研发人员直接研发下列工具专用，最新版本`0.3.30`。
 *
 * ## 1. 命令清单
 *
 * * `ai xxx`：通用自动化工具集。
 * * `aj xxx`：后端自动化工具集（ai for java）。
 * * `art xxx`：前端自动化工具集（ai for react）。
 *
 * ## 2. Epic使用方法
 *
 * > Epic是内部研发专用工具，位于API文档中有相关说明，记录了当前环境下用于内部研发的所有工具集，命令教程中的顺序按开发配置中的顺序进行，开发配置目录位于：`src/commander` 中。
 *
 * ```js
 * const Ec = require('./epic');
 * // Ec.xxx 调用全程Api
 * ```
 *
 * ## 3. 文档结构
 *
 * 1. 所有API文档结构分为四个部分：
 *      - `__epic`：研发专用工具集，属于内部工具集（改造命令时专用）
 *      - `ai`：通用工具命令
 *      - `aj`：后端自动化工具集
 *      - `art`：前端自动化工具集
 * 2. 和执行命令相关的错误信息全部位类 `E` 中有所定义。
 *
 * ## 4. 工具研发
 *
 * ### 4.1. 源码
 *
 * 工具研发源代码位于 `src` 目录中，子目录详细信息如下：
 *
 * |目录|含义|
 * |---|:---|
 * |`cab`|代码模板、文档模板、资源文件模板。|
 * |`commander`|命令定义文件，包括`ai/aj/art`三个命令的定义。|
 * |`commander-ai`|开发 `ai xxx` 命令专用目录。|
 * |`commander-aj`|开发 `aj xxx` 命令专用目录。|
 * |`commander-ar`|开发 `art xxx` 命令专用目录。|
 * |`epic`|内部研发专用工具集。|
 *
 * ### 4.2. 参数表
 *
 * 参数表定义位于 `src/commander/option.zero` 文件中，只有此文件中的参数是可用参数，形成统一的 __参数规范__。命令执行时并非支持所有命令，参数表中会有命令中所使用的参数列表，只是所有命令中这些参数的 __缩写和全称__ 维持一致，在不同命令中表示相同或相近的含义。
 *
 * |简写|全称|含义|
 * |:---|:---|:---|
 * |`-f`|`--field`|一般表示字段名称，用于描述模型字段、文件列等各种字段信息。|
 * |`-d`|`--data`|用于表示数据文件位置，或数据内容指向。|
 * |`-p`|`--path`|指定文件路径专用参数，用来描述输入文件路径。|
 * |`-c`|`--config`|用于表示配置文件位置，或配置内容指向。|
 * |`-j`|`--json`|用于表示JSON的格式或基于 Json Schema 的数据格式描述。|
 * |`-n`|`--number`|用于指定数量信息，通常在生成数据时表示生成数据条数。|
 * |`-o`|`--out`|用于指定输出文件位置，通常是生成代码输出目录、输出文件描述。|
 * |`-k`|`--key`|表示键名，用于描述模型键、文件列唯一键、数据表主键等信息。|
 * |`-u`|`--ui`|前端界面专用生成参数，可以是目录也可以是内容等各种用来描述前端配置路径的专用参数。|
 * |`-t`|`--target`|用于描述目标对象，此参数不局限于输出模式，通常可以表示目标信息描述。|
 * |`-s`|`--separator`|用于表示分隔符信息，如果是处理文件，此属性默认会提取操作系统分隔符。|
 * |`-m`|`--module`|用于描述模块，通常表示模块名称、模块元数据定义。|
 * |`-a`|`--all`|开启全格式、全逻辑、全流程的专用选项。|
 * |`-y`|`--yes`|确认选项专用参数，通常用于指定布尔开关时会使用此参数。|
 * |`-v`|`--value`|用于描述值相关信息，如字符串值、数值、布尔值等相关值信息，某些场合用来描述值字段。|
 * |`-r`|`--role`|在权限管理模型中，用于描述角色信息，通常在权限执行时专用。|
 * |`-i`|`--input`|用于指定输入文件位置，或输入目录、输入内容描述。|
 * |`-l`|`--length`|用于指定长度信息，通常在密码处理时用于描述生成字符串的长度。|
 * |`-e`|`--extension`|用于指定扩展名、扩展等相关信息。|
 * |`-w`|`--write`|用于写入操作的专用描述，通常生成文件时会使用此参数。|
 *
 */
/**
 * ## 「内部」改造命令专用
 *
 * @module __epic
 */
module.exports = exported;