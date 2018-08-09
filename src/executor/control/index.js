const Card = require('./ui.card');
const Form = require("./ui.form");
const Resource = require("./ui.resource");
const exported = {
    ...Card,
    ...Form,
    ...Resource
};
module.exports = exported;