const Ec = require("../epic");
const path = require("path");

module.exports = () => {
    const actual = Ec.executeInput(
        [
            ["-c", "--config"],
            ["-o", "--out"]
        ],
        [
            ["-c", "--config"],
            ["-o", "--out"]
        ]
    );
    if (Ec.isExist(actual.config)) {
        const config = Ec.ioJObject(actual.config);
        const file = {};
        file.resource = path.join(__dirname, `../cab/resource/resource.xlsx`);
        file.json = path.join(__dirname, `../cab/resource/resource.json`);
        file.auth = path.join(__dirname, `../cab/resource/falcon.resource.xlsx`);
        file.identifier = config.identifier
        const parameters = {};
        parameters.NAME = config.name;
        parameters.MODULE = config.module;
        parameters.ID = config.identifier;
        parameters.API = config.api;
        parameters.SET = config.set;
        parameters.TYPE = config.type;
        Ec.excelRes(file, parameters);
    } else {
        throw new Error(`对不起，配置文件"${actual.config}"不存在！！`)
    }
}