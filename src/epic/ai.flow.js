const U = require('underscore');
const log = require('./ai.log');

class Case {
    constructor(condition, executor) {
        this.condition = condition;
        this.executor = executor;
    }
}

const match = (defaultCase, ...cases) => {

};

const fxSingle = (condition, executor) => {
    if (!U.isFunction(executor)) {

    }
    if (U.isFunction(condition)) {
        condition = condition();
    }
    if (condition) {
        executor();
    }
};

module.exports = {
    match
};