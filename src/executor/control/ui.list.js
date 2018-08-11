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
    const config = Ux.zeroParse(actual.path);
    const meta = Helper.onMetadata(actual["out"], "UI.Form");
    console.info(actual, config, meta);
};
module.exports = {
    jsUiList
};