module.exports = class Field {
    constructor(expression = "") {
        const meta = expression.split(',');
        this.name = meta[0].replace(/ /g, '');
        this.display = meta[1].replace(/ /g, '');
        const mean = meta[2];
        if (0 < mean.indexOf("S")) {
            this.isFilter = true;
        }
        if (0 < mean.indexOf("F")) {
            this.isField = true;
        }
        if (0 < mean.indexOf("C")) {
            this.isColumn = true;
        }
        // 读取后续参数对
        if (meta[3]) {
            const attrs = {};
            for (let idx = 3; idx < meta.length; idx++) {
                const kv = meta[idx].replace(/ /g, '');
                const key = kv.split("=")[0];
                const value = kv.split("=")[1];
                if (key && value) {
                    attrs[key] = value;
                }
            }
            this.config = attrs;
        }
    }
};