# T0003 - 数据模拟器

数据模拟器主要用于帮助开发人员生成模拟数据，用Mock的方式帮助开发人员开发。主命令：

```
ai data
```

## 0.配置文件

配置文件为`.zero`的后缀，其格式如下：

```properties
P;
username=CnUser
email=Email
uri=Web
mobile=Mobile
ip=IPV4
```

配置文件的格式为：`field = 生成规则`，由于是`P;`类型的文件，所以每一行只能有一个键值对。

## 1.示例

```shell
> ai data -c Data.zero

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.10  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] Zero AI 系统启动......
[Zero AI] 命令参数：
{
    "config": "Data.zero",
    "out": ".",
    "json": false,
    "number": 23
}
[Zero AI] 数据规则信息：
{
    "username": "CnUser",
    "email": "Email",
    "uri": "Web",
    "mobile": "Mobile",
    "ip": "IPV4"
}
[Zero AI] 成功将数据写入到文件：./9f5bf655-654b-46fc-bb1e-5524f054833e.json！
```

打开当前目录生成的文件可以看到内容

```json
{
    "data": {
        "username": "乔强",
        "email": "f.etxsdlv@wooxbs.mg",
        "uri": "http://fjelmqdtv.re/ppjgzgfg",
        "mobile": "16317415645",
        "ip": "127.169.134.225"
    }
}
```

> 生成的数据节点路径是固定的，只能写入到一个Json文件中的`data`节点里，这个格式是Zero/Zero UI的标准数据文件基本格式，比纯Json要多一层。

## 2.命令说明

```shell
> ai data -h  

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.10  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] Zero AI 系统启动......

  Usage: data [options] [-c, --config | -o, --out | -j, --json | -n, --name]

  根据字段名称生成数据信息

  Options:

    -c, --config  您的配置文件路径
    -o, --out     【.】输出的数据文件路径（包括文件名）
    -j, --json    【false】是否为JsonArray，默认生成JsonObject
    -n, --number  【23】如果是Array则表示生成数据条数
    -h, --help    output usage information
```

## 3.参数说明

| 参数格式 | 必填 | 说明 |
| :--- | :--- | :--- |
| -c, --config | 是 | 配置文件路径，文件必须是Zero配置文件格式，参考示例中的文件格式即可。 |
| -o, --out | 否 | 输出数据文件的路径，默认为当前路径。 |
| -j, --json | 否 | 默认为false，如果该值为true，则生成数据条数-n参数才生效。 |
| -n, --number | 否 | 默认为23条，生成JsonArray类型数据时专用。 |

## 4.规则说明

目前支持的生成规则如下：

| 规则值 | 说明 |
| :--- | :--- |
| Code | 6位随机字符串（大写英文加点操作符） |
| CnCompany | 中文企业名称：XXX企业 |
| CnDept | 中文部门名称：XXX部 |
| CnUser | 中文姓名 |
| CnAddress | 中文地址 |
| CnText | 一段文本描述（适合大文本） |
| CnTitle | 3 ~ 9个中文字的标题 |
| CnName | 4 ~ 6个中文字的名称 |
| EnCompany | 英文企业名称：XXX Company |
| EnAddress | 英文地址：XXX |
| EnText | 一段文本描述（适合大文本） |
| HeadCount | 人数：10 ~ 1000 |
| Web | 随机生成一个网址 |
| Email | 随机生成邮箱 |
| Mobile | 随机生成手机号 |
| Phone | 随机生成电话 |
| Bool | 随机布尔值：true/false |
| StringGender | 随机性别：男/女 |
| IPV4 | 随机IP地址 |
| Date | 随机日期 |
| DateTime | 随机时间精确值：日期 + 时间 |
| Version | 随机生成版本号 |
| PercentFloat | 随机生成百分数（不带百分号的浮点数） |
| Guid | 随机生成UUID数据格式 |
| NumberX | 长度在20位左右的数值，比如Number1，Number5，X的范围是1 ~ 20 |
| StringX | 长度在20左右的英文字符串 |
| CnStringX | 长度在20个中文字符的随机中文字 |
| \[\] | 随机从数组中获取一个元素进行赋值, 如果属性对应值为数组时 |
| Now | 使用当前时间作为时间格式 |
| $FIX:X | 在生成过程引入前缀$FIX:（带冒号），那么冒号之后的值为成成最终的固定值信息 |



