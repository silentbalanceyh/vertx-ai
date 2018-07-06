const Ux = require('../epic');
const U = require('underscore');
const uuid = require('uuid');
const _applyUUID = (data = {}, field) => {
    if (!data.hasOwnProperty('$REF$') &&
        !U.isArray(data) &&
        !data[field]) {
        data[field] = uuid();
    }
};
const _applyEach = (data = {}, field = 'key') => {
    if (U.isArray(data)) {
        data.forEach(element => {
            if ("object" === typeof element) {
                _applyEach(element, field);
            }
        })
    } else {
        _applyUUID(data, field);
        Ux.itObject(data, (key, value) => {
            if ("object" === typeof value) {
                _applyEach(value, field);
            }
        })
    }
};
const executeKey = () => {
    const actual = Ux.executeInput(
        ['-d', '--data'],
        [
            ['-d', '--data'],
            ['-f', '--field', 'key'],
            ['-p', '--path', 'data']
        ]
    );
    Ux.cxExist(actual.data);
    Ux.itFileSync(actual.data, (item) => {
        const config = Ux.ioJObject(item);
        const body = Ux.visitJObject(config, actual.path);
        _applyEach(body, actual.field);
        const content = Ux.writeJObject(config, actual.path, body);
        Ux.outJson(actual.data, content);
    });
};
module.exports = {
    executeKey
};