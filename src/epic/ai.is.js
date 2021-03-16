const isIn = (value, ...array) => {
    if (!value) return false;
    const filtered = [].concat(array).filter(item => value === item);
    return 0 < filtered.length;
};
module.exports = {
    isIn,
};