const Ux = require('../epic');
const U = require('underscore');
const Immutable = require('immutable');
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
    const args = Ux.readArgs([['-d', '--data']]);
    const actual = Ux.formatArgs(args, [
        ['-d', '--data'],
        ['-f', '--field', 'key'],
        ['-p', '--path', 'data']
    ]);
    Ux.cxExist(actual.data);
    Ux.itFileSync(actual.data, (item) => {
        const config = Ux.ioJObject(item);
        const body = Ux.visitJObject(config, actual.path);
        _applyEach(body, actual.field);
        const content = Ux.writeJObject(config, actual.path, body);
        Ux.writeJson(actual.data, content);
    });
};
module.exports = {
    executeKey
};