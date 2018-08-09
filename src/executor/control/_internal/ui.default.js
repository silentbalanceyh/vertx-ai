const defaultForm = (hidden = true) => {
    const data = {};
    data["_form"] = {};
    data["_form"]["ui"] = [];
    data["_form"]["ui"].push([{
        field: "$button", hidden
    }]);
    return data;
};
module.exports = {
    defaultForm
};