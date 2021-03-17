import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './Op';

// 添加表单
@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Add")
    .to()
)
class FormAdd extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const form = Ex.yoForm(this, null);
        return (
            <ExForm {...form} $height={"300px"}
                    $op={Op.Action}/>
        );
    }
}

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Edit")
    .to()
)
class FormEdit extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"300px"}
                    $op={Op.Action}/>
        );
    }
}

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Filter")
    .raft(1)
    .form().to()
)
class FormFilter extends React.PureComponent {
    render() {

        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"200px"}
                    $op={Op.Action}/>
        )
    }
}

export default {
    FormAdd,        // 添加表单
    FormEdit,       // 更新表单
    FormFilter      // 搜索表单
}
