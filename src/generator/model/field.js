module.exports = class Field {
    constructor(expression = "") {
        this.name = expression.split(',')[0].replace(/ /g, '');
        this.display = expression.split(',')[1].replace(/ /g, '');
        const mean = expression.split(',')[2];
        if (0 < mean.indexOf("S")) {
            this.isFilter = true;
        }
        if (0 < mean.indexOf("F")) {
            this.isField = true;
        }
        if (0 < mean.indexOf("C")) {
            this.isColumn = true;
        }
    }
};