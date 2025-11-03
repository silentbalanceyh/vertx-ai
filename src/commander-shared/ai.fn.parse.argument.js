const Ec = require("../epic");
const parseArgument = (options = []) => {
    const args = process.argv.splice(3);
    const result = {};
    const argsLength = args.length;

    // 将 options 转换为 map 以便快速查找
    const optionsMap = new Map();
    const aliasesMap = new Map();

    options.forEach(option => {
        optionsMap.set(option.name, option);
        if (option.alias) {
            aliasesMap.set(option.alias, option);
        }
    });

    // 解析参数
    for (let i = 0; i < argsLength; i += 2) {
        const key = args[i];
        const value = args[i + 1];

        if (!key || !value) {
            // 如果参数不成对，报错
            if (key && !value) {
                throw new Error(`[ ZERO ] 缺少参数 ${key} 的值`);
            }
            break;
        }

        // 移除前缀（- 或 --）
        let cleanKey = key;
        if (key.startsWith('--')) {
            cleanKey = key.substring(2);
        } else if (key.startsWith('-')) {
            cleanKey = key.substring(1);
        }

        // 查找对应的选项
        const option = optionsMap.get(cleanKey) || aliasesMap.get(cleanKey);

        if (!option) {
            throw new Error(`[ ZERO ] 未知的参数: ${key}`);
        }

        // 转换值的类型
        let parsedValue = value;
        if (option.type === 'number') {
            parsedValue = Number(value);
            if (isNaN(parsedValue)) {
                throw new Error(`[ ZERO ] 参数 ${key} 的值 ${value} 不是有效的数字`);
            }
        } else if (option.type === 'boolean') {
            parsedValue = value.toLowerCase() === 'true';
        }

        result[option.name] = parsedValue;
    }

    // 处理默认值和必需参数
    options.forEach(option => {
        const key = option.name;
        if (!(key in result)) {
            if ('default' in option) {
                result[key] = option.default;
            } else if (option.required) {
                throw new Error(`[ ZERO ] 必需的参数缺失: ${key}`);
            }
        }
    });

    return result;
}
const parseMetadata = () => {
    const commandMeta = Ec.ioRoot() + "/commander";
    const commandFiles = Ec.ioFiles(commandMeta);
    const commandList = [];
    commandFiles.forEach(fileObj => {
        const filename = fileObj.file.toString();
        if (filename.endsWith(".json")) {
            const command = filename.substring(0, filename.indexOf("."));
            const commandPath = Ec.ioRoot() + "/commander/" + command + ".json";
            const commandJ = Ec.ioJObject(commandPath);
            commandList.push(commandJ);
        }
    });
    return commandList;
}
module.exports = {
    parseArgument,
    parseMetadata
}