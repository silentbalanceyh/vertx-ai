const Ec = require('../epic');
module.exports = () => {
    const actual = Ec.executeInput(
        [
            ['-n', '--name']
        ],
        [
            ['-c', '--config', 'ui.json']
        ]
    );

}