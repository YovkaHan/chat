export const pcbTemplate = {
    b0: {component: 'Button'},
    b1: {component: 'Button'},
    b2: {component: 'Button'},
    b3: {component: 'Button'},
    l0: {component: 'Lamp'},
    l1: {component: 'Lamp'},
    pl0: {
        component: 'Panel',
        config: {
            channels: [
                {id: 'ch0', component: 'Channel'},
                {id: 'ch1', component: 'Channel'}
            ]
        }
    },
    ch0: {
        component: 'Channel',
        relations: {
            Connect: {name: 'Button0'},
            Lamp: {name: 'Lamp0'},
            Message: {name: 'Button1'}
        },
        config: {from: 'ch0', to: 'ch1'}
    },
    iA0: {
        component: 'InputArea',
        config: {from: 'ch1', to: 'ch0'}
    },
    msgI0: {
        component: 'MessageInput',
        children:  [
            {alias: 'InputArea', name: 'InputArea0'},
            {alias: 'Send', name: 'Button0'}
        ],
    },
    msgL0: {
        component: 'MessageList'
    }
};