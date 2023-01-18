const __UT = require("./ai.export.interface.util");
const jsonCombine = (contentJ = [], normalized = [], mode = "REPLACE") => {

    let contentT = [];
    if ("REPLACE" === mode) {
        // 替换模式
        contentT = normalized.sort(__UT.sorterSAsc);
    } else {
        const result = [].concat(__UT.clone(contentJ));
        // 非替换模式 APPEND
        normalized.forEach(item => {
            if (!contentJ.includes(item)) {
                result.push(item);
            }
        })
        contentT = result.sort(__UT.sorterSAsc);
    }
    return contentT;
}

module.exports = {
    jsonCombine,
}