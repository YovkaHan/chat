import React from 'react';

import {Panel, Channel, Button, Lamp} from '../../index';

class MyPanel extends React.Component{
    render(){
        const {pcb} = this.props;

        return (
            <React.Fragment>
                <Panel rootClass={`my-panel`} pcb={pcb.make('Panel0')}>
                    <Channel pcb={pcb.make('Channel0')}>
                        <Button
                            className={`my-panel__btn`}
                            rootClass={`my-panel-btn`}
                            relation={`Connect`}
                            value={'Connect'}
                        />
                        <Lamp
                            className={`my-panel__lamp`}
                            rootClass={`my-panel-lamp`}
                            relation={`Lamp`}
                        />
                        <Button
                            className={`my-panel__btn`}
                            rootClass={`my-panel-btn`}
                            relation={`Message`}
                            value={'Message'}
                        />
                    </Channel>
                    <Channel pcb={pcb.make('Channel1')}>
                        <Button
                            className={`my-panel__btn`}
                            rootClass={`my-panel-btn`}
                            relation={`Connect`}
                            value={'Connect'}
                        />
                        <Lamp
                            className={`my-panel__lamp`}
                            rootClass={`my-panel-lamp`}
                            relation={`Lamp`}
                        />
                        <Button
                            className={`my-panel__btn`}
                            rootClass={`my-panel-btn`}
                            relation={`Message`}
                            value={'Message'}
                        />
                    </Channel>
                </Panel>
            </React.Fragment>
        )
    }
}

export default MyPanel;