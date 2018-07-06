const Split = require('./code.split');
const writePackage = (lines, name) => {
    if (lines) {
        const line = `package ${name};`;
        lines.push(line);
    }
};
const writeBody = (lines, name, isClazz) => {
    let line = '';
    if (isClazz) {
        line = `public class ${name} {`;
    } else {
        line = `public interface ${name} {`;
    }
    lines.push(line);
    lines.push('}');
};
const writeInterfaceVariable = (lines, meta = {}, indent = 1) => {
    if (meta.name && meta.type && meta.value) {
        let line = '';
        for (let idx = 0; idx < indent; idx++) {
            line += `    `;
        }
        meta.value = Split.parseLiteral(meta.value, meta.type);
        line += `${meta.type} ${meta.name} = ${meta.value};`;
        lines.push(line);
    }
};
module.exports = {
    writePackage,
    writeBody,
    writeInterfaceVariable
};