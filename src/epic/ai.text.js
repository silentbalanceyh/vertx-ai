const joinLines = (lines = []) => {
    let content = '';
    lines.forEach(line => content += `${line}\n`);
    return content.replace(`\n\n`, `\n`);
};

module.exports = {
    joinLines
};