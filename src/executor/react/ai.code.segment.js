const writeImportLine = (lines, clazz, lib) => {
    if (clazz && lib) {
        const result = lines.filter(item => 0 <= item.indexOf(clazz) && 0 <= lib.indexOf(clazz));
        if (0 === result.length) {
            lines.push(`import ${clazz} from '${lib}';`);
        }
    }
};
const writeBodyLine = (lines) => {
    if (lines) {
        lines[0] = 'class Component extends React.PureComponent {';
        lines[1] = '}'
    }
};
const writeExportLine = (lines) => {
    if (lines) {
        lines.push(`export default Component;`)
    }
};
const writeRenderLine = (lines) => {
    if (lines) {
        lines.push(`    render(){`);
        lines.push(`        return (`);
        lines.push(`            <div></div>`);
        lines.push(`        )`);
        lines.push(`    }`)
    }
};
module.exports = {
    writeImportLine,
    writeBodyLine,
    writeExportLine,
    writeRenderLine
};