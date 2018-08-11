const Ux = require('../epic');
const Code = require('./react/ai.code.react');
const Mock = require('mockjs');
const U = require('underscore');
const Immutable = require('immutable');
const {v4} = require("uuid");
const Random = Mock.Random;
const path = require('path');
const SEPRATOR = path.sep;
const dataGenerator = {
    "Code": () => Random.string('ABCDEFGHIJKLMNOPQRSTUVWXYZ.', 6),

    "CnCompany": () => Random.ctitle() + "企业",
    "CnDept": () => Random.ctitle(2, 4) + "部",
    "CnUser": () => Random.cname(),
    "CnAddress": () => Random.region() + Random.county(true) + Random.ctitle(),
    "CnText": () => Random.cparagraph(),
    "CnTitle": () => Random.ctitle(3, 9),
    "CnName": () => Random.ctitle(4, 6),

    "EnCompany": () => Random.title(1, 3) + " Company",
    "EnAddress": () => Random.first() + ', State ' + Random.title(1) + ", Street " + Random.last(),
    "EnText": () => Random.paragraph(),

    "HeadCount": () => Random.natural(10, 1000),
    "Web": () => Random.url('http'),
    "Scope": () => "范围" + Random.ctitle(4),
    "Email": () => Random.email(),
    "Mobile": () => "1" + Random.string("123456789", 10),
    "Phone": () => "(0" + Random.string("0123456789", 2) + ") " + Random.string("0123456789", 4) + " " + Random.string("0123456789", 4),
    "Bool": () => Random.bool(),
    "StringGender": () => Random.string("男女", 1),
    "IPV4": () => Random.natural(0, 255) + "." + Random.natural(0, 255) + "." + Random.natural(0, 255) + "." + Random.natural(0, 255),
    "Date": () => Random.date(),
    "DateTime": () => Random.datetime(),
    "Version": () => Random.natural(1, 20) + "." + Random.natural(1, 999),
    "PercentFloat": () => Random.float(0, 0, 1, 99).toFixed(2),
    "Guid": () => v4(),
    "Now": () => new Date()
};
for (let idx = 0; idx < 20; idx++) {
    dataGenerator[`Number${idx + 1}`] = () => Random.string("0123456789", idx + 1);
    dataGenerator[`String${idx + 1}`] = () => Random.string(idx + 1);
    dataGenerator[`CnString${idx + 1}`] = () => Random.ctitle(idx + 1);
}
const _generateRecord = (mapping) => {
    const record = {};
    Ux.itObject(mapping, (field, generator) => {
        if (U.isArray(generator)) {
            let idx = Random.natural(0, generator.length - 1);
            record[field] = generator[idx];
        } else if (generator.startsWith("FUN")) {
            const file = process.cwd() + SEPRATOR + generator.split('-')[1];
            Ux.cxExist(file);
            const content = Ux.ioString(file);
            try {
                eval(content);
                const value = eval("execute();");
                if (value) {
                    record[field] = value;
                }
            } catch (error) {
                console.error(error);
            }
        } else if (generator.startsWith("$FIX:")) {
            record[field] = generator.substring(generator.indexOf(":") + 1).trim();
        } else if ("Bool" === generator) {
            // 解决判断条件有问题的情况
            record[field] = dataGenerator["Bool"]();
        } else {
            Ux.fxContinue(dataGenerator.hasOwnProperty(generator), () => {
                record[field] = dataGenerator[generator]();
            });
        }
    });
    return record;
};
const _generateData = (mapping, {
    number, json
}) => {
    let result = [];
    if (json) {
        for (let idx = 0; idx < number; idx++) {
            result.push(_generateRecord(mapping));
        }
    } else {
        result = _generateRecord(mapping);
    }
    return result;
};
const executeData = () => {
    const actual = Ux.executeInput(
        ['-c', '--config'],
        [
            ['-c', '--config'],
            ['-o', '--out', '.'],
            ['-j', '--json', false],
            ['-n', '--number', 23],
        ]
    );
    Ux.cxExist(actual.config);
    const fields = Ux.zeroParse(actual.config);
    const mapping = Ux.zeroParse(Ux.ioRoot() + SEPRATOR + "datum" + SEPRATOR + "data.zero");
    Ux.info(`数据规则信息：\n${JSON.stringify(fields, null, 4)}`);
    Ux.itObject(mapping, (key, value) =>
        Ux.fxContinue(fields.hasOwnProperty(key) && fields[key] === key,
            () => {
                fields[key] = value;
            }
        )
    );
    const data = _generateData(fields, actual);
    // 路径处理
    let path = actual['out'];
    if (!path.endsWith('json')) {
        if (!path.endsWith(SEPRATOR)) {
            path = path + SEPRATOR;
        }
        path = path + v4() + ".json";
    }
    Ux.outJson(path, {data});
};
const _executeMenuMeta = (menus = [], root) => {
    const meta = [];
    const reg = new RegExp(SEPRATOR, "g");
    menus.forEach(item => {
        const metaItem = {};
        let name = item.uri.trim();
        while (name.startsWith(SEPRATOR)) {
            name = name.substring(1, name.length);
        }
        name = name.replace(reg, '.');
        metaItem.uri = item.uri;
        metaItem.name = name;
        metaItem.folder = `${root}${SEPRATOR}src${SEPRATOR}components${item.uri}`;
        metaItem.namespace = `components${item.uri}`;
        metaItem.resource = `${root}${SEPRATOR}src${SEPRATOR}cab${SEPRATOR}${Ux.reactLanguage()}${SEPRATOR}${metaItem.namespace}`;
        meta.push(metaItem);
    });
    return meta;
};
const executeMenu = () => {
    const actual = Ux.executeInput(
        ['-d', '--data'],
        [
            ['-d', '--data'],
            ['-o', '--out', '.'],
        ]
    );
    const root = Ux.reactRoot();
    Ux.fxTerminal(!root, Ux.E.fn10019(root));
    Ux.cxExist(actual.data);
    // 读取Json数据文件
    const menus = Ux.ioJObject(actual.data);
    Ux.fxTerminal(!U.isArray(menus.data), Ux.E.fn10020(menus.data));
    // 过滤掉没有uri的菜单路径
    const generated = menus.data.filter(menu => menu && menu.hasOwnProperty('uri'));
    const meta = _executeMenuMeta(generated, root);
    // 目录创建完成后，写入文件信息
    const json = {};
    meta.forEach(each => {
        Ux.makeDirs(each.folder);
        Ux.makeDirs(each.resource);
        // 写入资源文件
        const jsonPath = `${each.resource}${SEPRATOR}UI.json`;
        Ux.fxContinue(!Ux.isExist(jsonPath), () => Ux.outJson(jsonPath, json));
        // 写入React文件
        const uiPath = `${each.folder}${SEPRATOR}UI.js`;
        Ux.fxContinue(!Ux.isExist(uiPath), () => {
            const config = Ux.reactComponentRoot({ui: each.name}, "UI");
            const reference = Code.createClass(config);
            const content = reference.to("Path:" + each.uri);
            Ux.outString(uiPath, content);
        })
    });
};
const executeCsv = () => {
    const actual = Ux.executeInput(
        ['-p', '--path'],
        [
            ['-p', '--path'],
            ['-c', '--config', null],
            ['-s', '--separator', ',']
        ]
    );
    Ux.cxExist(actual.path);
    // 读取配置信息
    const data = Ux.ioJObject(actual.path);
    let $data = Immutable.fromJS(data).get('data');
    $data = $data && $data.toJS ? $data.toJS() : [];
    let mapping = Ux.fxContinue(Ux.isExist(actual.config), () => Ux.zeroParse(actual.config));
    // Csv
    Ux.info(`使用分隔符：${actual.separator.green}`);
    const csvArr = Ux.toCsv($data, mapping, actual.separator);
    const csvData = Ux.joinWith(csvArr, '\n');
    Ux.outString('.' + SEPRATOR + v4() + ".csv", csvData);
};

const _extractData = (path = "", json = false) => {
    let dataArr = [];
    if (json) {
        const dataJson = Ux.ioJObject(path);
        if (dataJson && U.isArray(dataJson.data)) {
            dataArr = dataArr.concat(dataJson.data);
        }
    } else {
        dataArr = Ux.ioCsv(path, ';');
    }
    return dataArr;
};

const executeRel = () => {
    const actual = Ux.executeInput(
        [
            ['-c', '--config']
        ],
        [
            ['-c', '--config'],
            ['-o', '--out', '.'],
            ['-j', '--json', false]
        ]
    );
    Ux.cxExist(actual.config);
    const config = Ux.zeroParse(actual.config);
    Ux.info("读取到的配置信息：\n" + JSON.stringify(config, null, 4).yellow);
    Ux.cxExist(config.source);
    Ux.cxExist(config['fromFile']);
    Ux.cxExist(config['toFile']);
    // 读取原始数组
    const sourceArr = _extractData(config['fromFile'], actual['json']);
    const targetArr = _extractData(config['toFile'], actual['json']);
    const data = Ux.zeroParse(config.source);
    if (data && 0 < data.length) {
        const dataArray = [];
        const fromField = config['fromField'];
        const toField = config['toField'];
        const fromCond = config['fromCond'];
        const toCond = config['toCond'];
        Ux.itArray(data, (item = []) => {
            const key = item[0];
            const value = item[1];
            if (key && value) {
                // 查找Source
                const source = Ux.elementFind(sourceArr, fromCond, key);
                const target = Ux.elementFind(targetArr, toCond, value);
                if (source && target) {
                    const item = {};
                    item[fromField] = source.id;
                    item[toField] = target.id;
                    dataArray.push(item);
                }
            }
        });
        const csvArr = Ux.toCsv(dataArray, null, ';');
        const csvData = Ux.joinWith(csvArr, '\n');
        Ux.outString(actual['out'] + SEPRATOR + v4() + ".csv", csvData);
    }
};
module.exports = {
    executeData,
    executeMenu,
    executeCsv,
    executeRel
};