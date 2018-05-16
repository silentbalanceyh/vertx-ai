module.exports = class Grid {
    constructor(y, array = []) {
        const matrix = [];
        let rdx = 0;
        for (let idx = 0; idx < array.length; idx++) {
            if (!matrix[rdx]) matrix[rdx] = [];
            matrix[rdx].push(array[idx]);
            if (0 === (idx + 1) % y) {
                rdx++;
            }
        }
        this.rdx = rdx;
        this.matrix = matrix;
    }

    appendLine(object) {
        this.matrix[this.rdx] = [object];
        this.rdx++;
    }
};