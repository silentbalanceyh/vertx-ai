import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import {ExListComplex} from "ei";
import {PageCard} from "web";
import form from './UI.Form';
import Op from './Op';

const componentInit = (reference) => {
    // Ex.yiStandard(reference).then(Ux.pipe(reference));
}
const componentUp = (reference, prevProps) => {

}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    state = {
        $ready: true
    };

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this);
    }

    render() {
        return Ex.yoRender(this, () => {

            const config = Ux.fromHoc(this, "grid");
            /* 专用组件信息 */
            return (
                <PageCard reference={this}>
                    <ExListComplex {...Ex.yoAmbient(this)}
                                   {...Op.Callback}
                                   config={config} $form={form}/>
                </PageCard>
            )
        }, Ex.parserOfColor("Page").page());
    }
}

export default Component