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
                    id: 'conversationV0',
                    component: 'ConversationView',
                    props: {
                        list: ['data', 'messageList']
                    }
                },
            },
        },
        msgL1: {
            component: 'MessageList',
            relations: {
                List: {
                    id: 'conversationV1',
                    component: 'ConversationView',
                    props: {
                        list: ['data', 'messageList']
                    }
                },
            },
        },
        chat0: {
            component: 'Chat',
            children:  [
                {alias: 'Messages', id: 'msgL0'},
                {alias: 'Input', id: 'msgI0'},
            ],
            relations: {
                Parent: {
                    id: 'conversationV0',
                    component: 'ConversationView',
                }
            }
        },
        chat1: {
            component: 'Chat',
            children:  [
                {alias: 'Messages', id: 'msgL1'},
                {alias: 'Input', id: 'msgI1'},
            ],
            relations: {
                Parent: {
                    id: 'conversationV1',
                    component: 'ConversationApp',
                }
            }
        },
        convApp0: {
            component: 'ConversationApp',
            children:  [
                {alias: 'Profile', id: 'profile0'},
                {alias: 'Contacts', id: 'contactL0'},
                {alias: 'Conversations', id: 'conversationL0'},
                {alias: 'Conversation', id: 'conversationV0'}
            ],
            relations: {
                Conversation: {
                    id: 'chat0',
                    component: 'Chat',
                }
            }
        },
        convApp1: {
            component: 'ConversationApp',
            children:  [
                {alias: 'Profile', id: 'profile1'},
                {alias: 'Contacts', id: 'contactL1'},
                {alias: 'Conversations', id: 'conversationL1'},
                {alias: 'Conversation', id: 'conversationV1'}
            ],
            relations: {
                Conversation: {
                    id: 'chat1',
                    component: 'Chat',
                }
            }
        },
        clientInfo0: {
            component: 'ClientInfo',
            relations: {
                Parent: {
                    id: 'convApp0',
                    component: 'ConversationApp',
                }
            }
        },
        clientInfo1: {
            component: 'ClientInfo',
            relations: {
                Parent: {
                    id: 'convApp1',
                    component: 'ConversationApp',
                }
            }
        },
        contactL0: {
            component: 'ContactList',
            relations: {
                Parent: {
                    id: 'convApp0',
                    component: 'ConversationApp',
                },
                Contact: {
                    template: 'ClientInfo0',
                    component: 'ClientInfo',
                }
            }
        },
        contactL1: {
            component: 'ContactList',
            relations: {
                Parent: {
                    id: 'convApp1',
                    component: 'ConversationApp',
                },
                Contact: {
                    template: 'ClientInfo1',
                    component: 'ClientInfo',
                }
            }
        },
        conversationL0: {
            component: 'ConversationList',
            relations: {
                Parent: {
                    id: 'convApp0',
                    component: 'ConversationApp',
                },
            }
        },
        conversationL1: {
            component: 'ConversationList',
            relations: {
                Parent: {
                    id: 'convApp1',
                    component: 'ConversationApp',
                },
            }
        },
        profile0: {
            component: 'Profile',
            children:  [
                {alias: 'User', id: 'clientInfo0'}
            ],
            relations: {
                Parent: {
                    id: 'convApp0',
                    component: 'ConversationApp',
                }
            }
        },
        profile1: {
            component: 'Profile',
            children:  [
                {alias: 'User', id: 'clientInfo1'}
            ],
            relations: {
                Parent: {
                    id: 'convApp1',
                    component: 'ConversationApp',
                }
            }
        },
        conversationV0: {
            component: 'ConversationView',
            children:  [
                {alias: 'Chat', id: 'chat0'}
            ],
            relations: {
                Parent: {
                    id: 'convApp0',
                    component: 'ConversationApp',
                }
            }
        },
        conversationV1: {
            component: 'ConversationView',
            children:  [
                {alias: 'Chat', id: 'chat1'}
            ],
            relations: {
                Parent: {
                    id: 'convApp1',
                    component: 'ConversationApp',
                }
            }
        }
    },
    templateList: {
        Button0: {
            component: 'Button'
        },
        ClientInfo0: {
            component: 'ClientInfo'
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