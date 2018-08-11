const Card = require('./ui.card');
const Form = require("./ui.form");
const Resource = require("./ui.resource");
const List = require("./ui.list");
const exported = {
    ...Card,
    ...Form,
    ...Resource,
    ...List
};
module.exports = exported;