import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';

const $opAdd = (reference) => params => {

};
const $opSave = (reference) => params => {

};
const $opDelete = (reference) => params => {

};
const $opFilter = (reference) => params => {

}

const Action = {
    $opAdd,
    $opSave,
    $opDelete,
    $opFilter
}

const componentInit = (reference) => {
    // Ex.yiStandard(reference).then(Ux.pipe(reference));
}
const componentUp = (reference, prevProps) => {

}

// 添加表单
@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("#NAME#")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const form = Ex.yoForm(this, null);
        return (
            <ExForm {...form} $height={"300px"}
                    $op={Action}/>
        );
    }
}
export default Component;