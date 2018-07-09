const firstUpper = (value = "") =>
    value.substr(0, 1).toUpperCase() + value.substr(1, value.length);
module.exports = {
    firstUpper
};