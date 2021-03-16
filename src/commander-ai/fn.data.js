const Ec = require('../epic');
const U = require('underscore');
const Mock = require('mockjs');
const Random = Mock.Random;
/**
 * ## `ai data`
 *
 * ### 1. 命令
 *
 * 根据规则随机生成数据Object/Array的专用命令。
 *
 * ### 2. 执行
 *
 * ```shell
 * # 2.1. 命令语法
 * ai data -c <config>
 *
 * # 2.2. 执行测试
 * ai data -c data.zero -j true
 * # ...省略部分...
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *      "config": "data.zero",
 *      "out": ".",
 *      "json": "true",
 *      "number": 23
 * }
 * [Zero AI] 处理过后的完整配置信息：
 * {
 *      "number": 23,
 *      "json": "true",
 *      "config": {
 *          "key": "Guid",
 *          "code": "Code",
 *          "array1": [
 *              "A",
 *              "B",
 *              "C"
 *          ],
 *          "fixed": "$FIXED:测试值",
 *          "date1": "ISO"
 *      }
 * }
 * [Zero AI] （Async）成功将数据写入到文件：./4f945df8-9d27-4169-9b18-d6d6385a310c.json！
 * ```
 *
 * ### 3. 选项
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-c|--config|String|（无）|配置文件路径。|
 * |-o|--out|String|`.`|输出目录文件路径，文件名随机UUID。|
 * |-j|--json|Boolean|false|是否生成Object数据格式，true则生成，否则生成Array格式。|
 * |-n|--number|Number|23|只有`json = false`时生效，生成Array的数据条数。|
 *
 * ### 4. 生成器设置
 *
 * #### 4.1. 生成器说明
 *
 * |生成规则|说明|
 * |---|:---|
 * |[]|从数组中随机读取一个元素执行赋值。|
 * |$FIX:X|生成固定值`X`赋值给记录中的属性。|
 * |Guid|随机生成UUID字符串。|
 * |Code|系统编码字符串（只支持大写和点操作符27个字符），生成长度为6。|
 * |HeadCount|企业内部员工数量。|
 * |Mobile|手机号码。|
 * |Phone|座机号码。|
 * |Http|生成`http://`链接。|
 * |Https|生成`https://`链接。|
 * |Ftp|生成`ftp://`链接。|
 * |Domain|生成随机域名。|
 * |Protocol|随机生成协议。|
 * |IP|随机生成IP地址。|
 * |Bool|随机布尔值。|
 * |Color|随机Web色彩：`#xxxxxx`格式。|
 * |Version|生成版本号（通常是软件版本号）。|
 * |Percent|随机百分数。|
 * |Zip|随机邮编。|
 * |Email|随机电子信箱。|
 * |Region|随机区域信息。|
 * |Province|随机省会信息。|
 * |City|随机城市信息。|
 * |CityFull|随机城市全称，带区域。|
 * |County|随机二级县。|
 * |CountyFull|随机二级县全称。|
 * |Tld|随机顶级域名。|
 * |CnName|随机姓名。|
 * |CnFirst|随机姓。|
 * |CnCompany|随机公司。|
 * |CnDept|随机部门。|
 * |CnSection|随机科室。|
 * |CnScope|随机范围。|
 * |CnAddress|随机地址。|
 * |CnText|随机段落文字。|
 * |CnSentence|随机句子。|
 * |CnTitle|随机标题。|
 * |CnGender|随机性别。|
 * |EnName|随机姓名。|
 * |EnFirst|随机 First Name。|
 * |EnLast|随机 Last Name。|
 * |EnCompany|随机公司。|
 * |EnDept|随机部门。|
 * |EnSection|随机科室。|
 * |EnScope|随机范围。|
 * |EnAddress|随机地址。|
 * |EnText|随机段落文字。|
 * |EnSentence|随机句子。|
 * |EnTitle|随机标题。|
 * |EnGender|随机性别。|
 * |Iso|ISO时间格式。|
 * |Now|当前时间格式。|
 * |Date|日期。|
 * |DateTime|日期/时间。|
 * |Time|时间。|
 * |NumberX|随机数字。|
 * |EnStringX|随机字符串。|
 * |CnStringX|随机字符串。|
 *
 * * `En/Cn`前缀分别代表中文和英文。
 * * `NumberX, EnStringX, CnStringX`可使用数字当后缀，数值表示长度，从`1 - 10`。
 *
 * #### 4.2. data.zero例子
 *
 * **配置文件**
 *
 * ```shell
 * P;
 * key=Guid
 * noArray=["A","B","C"]
 * noFixed=$FIXED:测试值
 * code=Code
 * headCount=HeadCount
 * mobile=Mobile
 * phone=Phone
 * http=Http
 * https=Https
 * ftp=Ftp
 * domain=Domain
 * protocol=Protocol
 * ip=IP
 * bool=Bool
 * color=Color
 * version=Version
 * percent=Percent
 * zip=Zip
 * email=Email
 * region=Region
 * province=Province
 * city=City
 * city2=CityFull
 * county=County
 * countyFull=CountyFull
 * tld=Tld
 * cnName=CnName
 * cnFirst=CnFirst
 * cnCompany=CnCompany
 * cnDept=CnDept
 * cnSection=CnSection
 * cnScope=CnScope
 * cnAddress=CnAddress
 * cnText=CnText
 * cnSentence=CnSentence
 * cnTitle=CnTitle
 * cnGender=CnGender
 * enName=EnName
 * enFirst=EnFirst
 * enLast=EnLast
 * enCompany=EnCompany
 * enDept=EnDept
 * enSection=EnSection
 * enScope=EnScope
 * enAddress=EnAddress
 * enText=EnText
 * enSentence=EnSentence
 * enTitle=EnTitle
 * enGender=EnGender
 * iso=Iso
 * now=Now
 * date=Date
 * datetime=DateTime
 * time=Time
 * ```
 *
 * **数据内容**
 *
 * ```json
 * {
    "data": {
        "key": "23121742-2dab-4ac6-b578-2f6720410cfb",
        "noArray": "C",
        "noFixed": "测试值",
        "code": "KPEX.T",
        "headCount": 929,
        "mobile": "18488562585",
        "phone": "(012) 4610 1140",
        "http": "http://atrtyq.lu/oqkpau",
        "https": "https://qpvpuuvfk.do/hrfmjfp",
        "ftp": "ftp://osonkoesp.bf/tzghunec",
        "domain": "vqjxomib.hk",
        "protocol": "mid",
        "ip": "64.198.160.131",
        "bool": false,
        "color": "#f2d779",
        "version": "3.569",
        "percent": "0.09",
        "zip": "664855",
        "email": "w.omwjnhtfyg@ydjyl.ml",
        "region": "华南",
        "province": "山东省",
        "city": "来宾市",
        "city2": "台湾 基隆市",
        "county": "普兰店市",
        "countyFull": "吉林省 辽源市 东辽县",
        "tld": "gi",
        "cnName": "梁桂英",
        "cnFirst": "何",
        "cnCompany": "除成地界记头布公司",
        "cnDept": "形东严克部",
        "cnSection": "及着系科室",
        "cnScope": "范围效教对",
        "cnAddress": "华南湖南省 郴州市 临武县克加头被",
        "cnText": "地量好和儿县国主然格作提阶行。见快油个革想除当术取且可强地及至接院......",
        "cnSentence": "每光越主识比习接问织眼导社连且到教。",
        "cnTitle": "来却后市定越下较",
        "cnGender": "男",
        "enName": "Matthew Clark",
        "enFirst": "Frank",
        "enLast": "Allen",
        "enCompany": "Rvo Ynfg Ickxlfloy Vuux Company",
        "enDept": "Wnqxdzhse Ysericfry Vfewslfgdf Wqlxd Department",
        "enSection": "Vxdialugp Rdwicyvh Section",
        "enScope": "Scope: 持太",
        "enAddress": "Sandra, State Hinp, Street Martinez",
        "enText": "Nlebzn thwuouuth holdtxltqm npqb fzlsr smhjohs .......",
        "enSentence": "Ufhnqddg eikesnc xawwb vsmuvop qhorlgvel .......",
        "enTitle": "Feyv Apareaaif Ygnddotmr Jryvw",
        "enGender": "Female",
        "iso": "2021-03-16T09:54:43.442Z",
        "now": "2021-03-16 17:54:43",
        "date": "1988-11-05",
        "datetime": "1989-04-05 17:40:52",
        "time": "23:16:00"
    }
}
 * ```
 *
 * @memberOf module:ai
 * @method data
 */
const GENERATOR = {
    "Guid": () => Ec.strUuid(),                                         // GUID格式
    "Code": () => Random.string('ABCDEFGHIJKLMNOPQRSTUVWXYZ.', 6),      // 大写专用格式，可带点的编码
    "HeadCount": () => Random.natural(10, 1000),                        // 职员数量
    "Mobile": () => "1" + Random.string("123456789", 10),               // 手机号
    // 座机
    "Phone": () => "(0" + Random.string("0123456789", 2) + ") " + Random.string("0123456789", 4) + " " + Random.string("0123456789", 4),

    "Http": () => Random.url('http'),                                   // Http地址
    "Https": () => Random.url('https'),                                 // Https地址
    "Ftp": () => Random.url('ftp'),                                     // FTP地址
    "Domain": () => Random.domain(),                                    // 域名
    "Protocol": () => Random.protocol(),                                // 协议名
    "IP": () => Random.ip(),                                            // IP地址
    "Bool": () => Random.bool(),                                        // 布尔值
    "Color": () => Random.color(),                                      // Web色彩
    "Version": () => Random.natural(1, 20) + "." + Random.natural(1, 999),  // 版本号
    "Percent": () => Random.float(0, 0, 1, 99).toFixed(2),  // 百分数

    // 地理专用
    "Zip": () => Random.zip(),                                          // 邮编
    "Email": () => Random.email(),                                      // 邮箱
    "Region": () => Random.region(),                                    // 区域
    "Province": () => Random.province(),                                // 省会
    "City": () => Random.city(),                                        // 城市
    "CityFull": () => Random.city(true),                                // 城规全称（带前缀）
    "County": () => Random.county(),                                    // 二级县
    "CountyFull": () => Random.county(true),                            // 二级县全称
    "Tld": () => Random.tld(),                                          // 专用

    // 中文
    "CnName": () => Random.cname(),                                     // 姓名
    "CnFirst": () => Random.cfirst(),                                   // 姓
    "CnCompany": () => Random.ctitle() + "公司",                         // 公司
    "CnDept": () => Random.ctitle(2, 4) + "部",                         // 部门
    "CnSection": () => Random.ctitle(2, 4) + "科室",                    // 科室
    "CnScope": () => "范围" + Random.ctitle(3),                         // 范围
    "CnAddress": () => Random.region() + Random.county(true) + Random.ctitle(), // 地址
    "CnText": () => Random.cparagraph(),                                // 段落
    "CnSentence": () => Random.csentence(),                             // 句子
    "CnTitle": () => Random.ctitle(3, 9),                               // 标题
    "CnGender": () => Random.pick(["男", "女"]),                         // 性别

    // 英文
    "EnName": () => Random.name(),                                      // 英文姓名
    "EnFirst": () => Random.first(),                                    // 英文 First Name
    "EnLast": () => Random.last(),                                      // 英文 Last Name
    "EnCompany": () => Random.title() + " Company",                     // 公司
    "EnDept": () => Random.title(2, 4) + " Department",                  // 部门
    "EnSection": () => Random.title(2, 4) + " Section",                  // 科室
    "EnScope": () => "Scope: " + Random.ctitle(2),                      // 范围
    "EnAddress": () => Random.first() + ', State ' + Random.title(1) + ", Street " + Random.last(), // 地址
    "EnText": () => Random.paragraph(),                                 // 段楼
    "EnSentence": () => Random.sentence(),                              // 句子
    "EnTitle": () => Random.title(3, 9),                                // 标题
    "EnGender": () => Random.pick(["Female", "Male"]),                  // 性别

    // 时间部分
    "Iso": () => new Date(),                                            // 当前时间：Iso格式
    "Now": () => Random.now(),                                          // 当前时间
    "Date": () => Random.date(),                                        // 日期
    "DateTime": () => Random.datetime(),                                // 全日期/时间
    "Time": () => Random.time(),                                        // 时间
}
/*
 * 1 - 10
 */
for (let idx = 0; idx < 11; idx++) {
    GENERATOR[`Number${idx + 1}`] = () => Random.string("0123456789", idx + 1);
    GENERATOR[`EnString${idx + 1}`] = () => Random.string(idx + 1);
    GENERATOR[`CnString${idx + 1}`] = () => Random.ctitle(idx + 1);
}

const generateRecord = (config = {}) => {
    const record = {};
    Ec.itObject(config, (field, generator) => {
        if (U.isArray(generator)) {
            // 随机提取数组中的某个元素，格式为数组格式
            record[field] = Random.pick(generator);
        } else if (generator.startsWith("$FIXED")) {
            // $FIXED执行器专用
            record[field] = generator.substring(generator.indexOf(":") + 1).trim();
        } else {
            // 标准执行器
            if (GENERATOR.hasOwnProperty(generator)) {
                record[field] = GENERATOR[generator]();
            }
        }
    })
    return record;
}

const generateData = (input = {}) => {
    const {json = false, number = 23, config = {}} = input;
    if (json) {
        // Object类型
        return generateRecord(config);
    } else {
        // Array类型
        let records = [];
        for (let idx = 0; idx < number; idx++) {
            records.push(generateRecord(config));
        }
        return records;
    }
}
module.exports = () => {
    const actual = Ec.executeInput(
        ['-c', '--config'],
        [
            ['-c', '--config'],
            ['-o', '--out', '.'],
            ['-j', '--json', false],
            ['-n', '--number', 23],
        ]
    );
    const fields = Ec.parseZero(actual.config);
    if (fields) {
        // 构造配置
        const prepared = {};
        prepared.number = actual.number;
        prepared.json = actual.json;
        prepared.config = fields;

        // 根据配置生成数据
        Ec.info(`处理过后的完整配置信息：\n${JSON.stringify(prepared, null, 4).yellow}`);
        const data = generateData(prepared);

        // 输出处理
        if (data) {
            let out = actual.out;
            // 是否带有扩展名
            if (!out.endsWith('json')) {
                // 追加尾符
                if (!out.endsWith(Ec.SEPARATOR)) {
                    out = out + Ec.SEPARATOR;
                }
                //
                out = out + Ec.strUuid() + ".json";
            }
            // 基础数据规范
            let content = {};
            content.data = data;
            if (U.isArray(data)) {
                content.count = actual.number;
            }
            Ec.outJson(out, content);
        } else {
            Ec.warn(`生成数据失败！！！`)
        }
    }
}