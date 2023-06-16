const Ec = require('../epic');
const fs = require("fs");
const path = require("path");
module.exports = () => {
    const actual = Ec.executeInput(
        [],
        [
            ['-p', '--path', "."]
        ]
    );
    const inputPath = actual.path;
    Ec.info(`Bundle规范目录创建：${inputPath}`);
    [
        "lib/extension",
        "modeler/emf",
        "modeler/atom",
        "modeler/atom/meta",
        "modeler/atom/reference",
        "modeler/atom/rule",
        "init/modeler",
        "init/store/ddl",
        "init/cloud",
        "init/development",
        "init/oob/resource",
        "backend/scripts/groovy",
        "backend/scripts/js",
        "backend/scripts/jruby",
        "backend/scripts/jpython",
        "backend/endpoint/api",
        "backend/endpoint/web-socket",
        "backend/endpoint/service-bus",
        "backend/webapp/WEB-INF",
        "backend/components",
        "backend/components/task",
        "backend/components/handler",
        "backend/components/event",
        "backend/components/validator",
        "frontend/assembly",
        "frontend/cab/cn",
        "frontend/cab/en",
        "frontend/cab/jp",
        "frontend/scripts/js",
        "frontend/scripts/ts",
        "frontend/skin/",
        "frontend/images/",
        "frontend/images/icon",
        "frontend/components",
    ].forEach(filename => fs.mkdirSync(inputPath + "/" + filename, {recursive: true}));
    Ec.info(`即将拷贝说明文件：`);
    Ec.ioCopy(path.join(__dirname, "./bundle/specification.txt"), inputPath + "/specification.txt");
}
