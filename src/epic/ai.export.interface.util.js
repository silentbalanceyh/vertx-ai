const func_uncork_element_feature = require('./ai.uncork.fn.element.feature');
const func_unbind_it_feature = require('./ai.uncork.fn.it.feature');
const func_under_cx_evaluate = require('./ai.under.fn.cx.evaluate');
const func_under_fx_terminal = require('./ai.under.fn.fx.terminal');
const func_under___logging = require('./ai.unified.fn._.logging');
const func_unified_sorter_element = require("./ai.unified.fn.sorter.element");
const Immutable = require("immutable");
module.exports = {
    ...func_uncork_element_feature,
    ...func_unbind_it_feature,
    ...func_under_cx_evaluate,
    ...func_under_fx_terminal,
    ...func_under___logging,
    ...func_unified_sorter_element,
    // clone method
    clone: input => Immutable.fromJS(input).toJS(),
}