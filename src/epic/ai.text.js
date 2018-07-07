const joinLines = (lines = []) => {
    let content = '';
    lines.forEach(line => content += `${line}\n`);
    return content.replace(`\n\n`, `\n`);
};
const parseMethod = (input) => {
    const line = input.replace(/\[/g, '').replace(/]/g, '').trim();
    const splitted = line.split('-');
    const name = splitted[0];
    const paramArr = splitted[1].split('|');
    const returnValue = splitted[2];
    const ws = splitted[3];
    const params = [];
    paramArr.forEach(param => {
        const kv = param.split(':');
        const item = {};
        item.name = kv[0];
        item.type = kv[1];
        item.annotation = kv[2];
        params.push(item);
    });
    return {
        name, params, returnValue, ws
    }
};
module.exports = {
    joinLines,
    parseMethod
};