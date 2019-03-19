export const pcbTemplate = {
    idList: {
        b0: {component: 'Button', a: '1'},
        b1: {component: 'Button', a: '2'},
        b2: {
            component: 'Button',
            children: [
                {alias: 'ButtonA', id: 'b0'},
                {alias: 'ButtonB', id: 'b1'}
            ]
        },
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
                Connect: {id: 'Button0'},
                Lamp: {id: 'Lamp0'},
                Message: {id: 'Button1'}
            },
            config: {from: 'ch0', to: 'ch1'}
        },
        iA0: {
            component: 'InputArea',
            config: {from: 'ch1', to: 'ch0'}
        },
        iA1: {
            component: 'InputArea',
            config: {from: 'ch1', to: 'ch0'}
        },
        msgI0: {
            component: 'MessageInput',
            children:  [
                {alias: 'InputArea', id: 'iA0'},
                {alias: 'Send', id: 'b1'}
            ],
            relations: {
                MsgConstructor: {
                    id: 'chat0',
                    component: 'Chat'
                },
            },
        },
        msgI1: {
            component: 'MessageInput',
            children:  [
                {alias: 'InputArea', id: 'iA1'},
                {alias: 'Send', id: 'b0'}
            ],
            relations: {
                MsgConstructor: {
                    id: 'chat1',
                    component: 'Chat'
                },
            },
        },
        msgL0: {
            component: 'MessageList',
            relations: {
                List: {
                    id: 'chat0',
                    component: 'Chat'
                },
            },
        },
        msgL1: {
            component: 'MessageList',
            relations: {
                List: {
                    id: 'chat1',
                    component: 'Chat'
                },
            },
        },
        chat0: {
            component: 'Chat',
            children:  [
                {alias: 'Messages', id: 'msgL0'},
                {alias: 'Input', id: 'msgI0'},
            ],
            config: {
                from: 'A',
                to: 'B'
            }
        },
        chat1: {
            component: 'Chat',
            children:  [
                {alias: 'Messages', id: 'msgL1'},
                {alias: 'Input', id: 'msgI1'},
            ],
            config: {
                from: 'A',
                to: 'B'
            }
        },
        contacts0: {
            component: 'Contacts'
        }
    },
    templateList: {
        Button0: {
            component: 'Button'
        },
        Message0: {
            component: 'Message'
        }
    }
};

/**
 * 'idList' - Список уникальных компонентов
 *
 * 'templateList' - Список компонентов заданых в форме шаблонов без явных привязок к уникальным компонентам, но не исключая их в описании шаблона
 *
 * 'component' - Название компонента (используется для поиска по дереву в сторе)
 *
 * 'relations' - Связи комонента с другими компонентами
 *
 * 'children' - Список "детей" компонента
 * */