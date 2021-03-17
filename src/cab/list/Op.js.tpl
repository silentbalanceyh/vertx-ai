import Ex from 'ex';

const $opAdd = (reference) =>
    params => Ex.form(reference).add(params, {
        uri: "/api/#API#",
        dialog: "added",
    });
const $opSave = (reference) =>
    params => Ex.form(reference).save(params, {
        uri: "/api/#API#/:key",
        dialog: "saved"
    });
const $opDelete = (reference) =>
    params => Ex.form(reference).remove(params, {
        uri: "/api/#API#/:key",
        dialog: "removed"
    });
const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);
// 回调函数
const rxPostDelete = (reference) => (data) => {
    // 删除数据之后的回调
}
const rxPostView = (reference) => (data) => {
    // 编辑数据打开之后的回调
}
const rxPostSelected = (reference) => (data) => {
    // 选中记录后的回调
}
export default {
    Callback: {
        rxPostDelete,
        rxPostView,
        rxPostSelected
    },
    Action: {
        $opAdd,
        $opSave,
        $opDelete,
        $opFilter
    }
}