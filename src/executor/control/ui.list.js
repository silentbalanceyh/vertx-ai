const Ux = require('../../epic');
const Helper = require('./_internal');

const jsUiList = () => {
    const actual = Ux.executeInput(
        ['-p', '--path'],
        [
            ["-p", "--path"]
        ]
    );
    Helper.onOut(actual);
    Ux.cxExist(actual.path);
    
    console.info(actual);
};
module.exports = {
    jsUiList
};