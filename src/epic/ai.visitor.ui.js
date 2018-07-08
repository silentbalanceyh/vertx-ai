const parseLine = (line = "") => {
    console.info(line);
    return {};
};
const parseUi = (lines = []) => {
    const result = {};
    lines.forEach(line => {
        const kv = parseLine(line);
        Object.assign(result, kv);
    });
    return result;
};
module.exports = {
    parseUi
};