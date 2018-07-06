const Ux = require('../epic');
const Mock = require('mockjs');
const {v4} = require("uuid");
const Random = Mock.Random;
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
    "Guid": () => v4()

};
for (let idx = 0; idx < 20; idx++) {
    dataGenerator[`Number${idx + 1}`] = () => Random.string("0123456789", idx + 1);
    dataGenerator[`String${idx + 1}`] = () => Random.string(idx + 1);
    dataGenerator[`CnString${idx + 1}`] = () => Random.ctitle(idx + 1);
}
const _generateRecord = (mapping) => {
    const record = {};
    Ux.itObject(mapping, (field, generator) =>
        Ux.fxContinue(dataGenerator[generator], () => {
            record[field] = dataGenerator[generator]();
        })
    );
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
    const mapping = Ux.zeroParse(Ux.ioRoot() + "/src/datum/data.zero");
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
        if (!path.endsWith('/')) {
            path = path + '/';
        }
        path = path + v4() + ".json";
    }
    Ux.outJson(path, {data});
};
module.exports = {
    executeData
};