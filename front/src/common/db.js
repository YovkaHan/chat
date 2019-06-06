import * as R from 'ramda';
import uniqid from 'uniqid';

export default function DB() {
    let indexedDB, IDBTransaction, IDBKeyRange, db = undefined;
    const
        entities = {
            Conversation: {},
            MessageArray: {},
            MessageList: {},
            Message: {},
            User: {}
        },
        stores = {
            Conversations: undefined,
            MessageArrays: undefined,
            MessageLists: undefined,
            Messages: undefined,
            Users: undefined
        },
        dbName = 'Chat',
        listeners = []
    ;

    /**Messages*/
    entities.Message.Schema = {
        id: {
            type: 'string',
            unique: true
        },
        data: {
            type: 'string',
        },
        date: {
            type: 'number',
        },
        from: {
            type: 'string'
        },
        to: {
            type: 'string'
        },
        status: {
            type: 'string'
        }
    };
    entities.Message.create = function (data) {
        const {id} = data;

        return new Promise(async resolve => {
            if (id !== undefined) {
                const message = await entities.Message.read({id});

                if(message.hasOwnProperty('error') && !message.error.exist){
                    let transaction = db.transaction(Object.keys(stores).map(store => store), "readwrite");

                    // Do something when all the data is added to the database.
                    transaction.oncomplete = function (event) {

                    };

                    transaction.onerror = function (event) {
                        console.error("Transaction error: " + event.target.error);
                    };

                    let objectStore = transaction.objectStore("Messages");
                    let request = objectStore.add(data);

                    request.onsuccess = function (event) {
                        resolve(event.target.result === id ? R.clone(data) : event.target.result);
                    };
                } else {
                    resolve({
                        error: {
                            text: 'Object exists',
                            store: 'Message',
                            method: 'create',
                            exist: true
                        }
                    });
                }
            } else {
                resolve({
                    error: {
                        text: 'Missing required prop',
                        store: 'Message',
                        method: 'create',
                        required: true
                    }
                });
            }
        });
    };
    entities.Message.read = function (data) {
        const {id} = data;

        return new Promise(resolve => {
            if(id !== undefined){
                const getResult = db.transaction("Messages").objectStore("Messages").get(id);

                getResult.onsuccess = function (event) {
                    if (event.target.result) {
                        resolve(event.target.result);
                    }else
                        resolve({
                            error: {
                                text: 'No matches in DB',
                                exist: false
                            }
                        });
                };
                getResult.onerror = function (event) {
                    const text = "Message error: " + event.target.error;
                    resolve({
                        error: {
                            text: text
                        }
                    });
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'Message',
                        method: 'read',
                        required: true
                    }
                })
            }

        });
    };
    entities.Message.update = function (data) {
        const {id} = data;
        return new Promise(async resolve => {
            if(id !== undefined){
                let message = await entities.Message.read(data);
                let messageData = !message.hasOwnProperty('error') && message.id ? message : {};
                const dataToPut = Object.assign(messageData, R.clone(data));

                let request = db.transaction(["Messages"], "readwrite")
                    .objectStore("Messages")
                    .put(dataToPut);
                request.onsuccess = function(event) {
                    resolve(event.target.result === id ? dataToPut : event.target.result);
                };
                request.onerror = function(event) {
                    resolve({
                        error: {
                            text: 'Updating message error :' + event.target.error
                        }
                    })
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        required: true
                    }
                })
            }
        });
    };
    entities.Message.delete = function (data) {
        const {id} = data;
        return new Promise(resolve => {
            if(id !== undefined){
                let request = db.transaction(["Messages"], "readwrite")
                    .objectStore("Messages")
                    .delete(id);
                request.onsuccess = function(event) {
                    resolve({})
                };
                request.onerror = function(event) {
                    resolve({
                        error: {
                            text: 'Deleting message error :' + event.target.error
                        }
                    })
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        required: true
                    }
                })
            }
        });
    };

    /**MessageArray*/
    entities.MessageArray.Schema = {
        id: {
            type: 'string',
            unique: true
        },
        messages: {
            type: 'array'
        },
    };
    entities.MessageArray.create = function (data) {
        const {id} = data;

        return new Promise(async resolve => {
            if (id !== undefined) {
                const mL = await entities.MessageArray.read({id});

                if(mL.hasOwnProperty('error') && !mL.error.exist){
                    let transaction = db.transaction(Object.keys(stores).map(store => store), "readwrite");

                    // Do something when all the data is added to the database.
                    transaction.oncomplete = function (event) {

                    };

                    transaction.onerror = function (event) {
                        console.error("Transaction error: " + event.target.error);
                    };

                    let objectStore = transaction.objectStore("MessageArrays");
                    const dataToAdd = {id, messages: []};
                    let request = objectStore.add(dataToAdd);

                    request.onsuccess = function (event) {
                        resolve(event.target.result === id ? dataToAdd : event.target.result);
                    };
                } else {
                    resolve({
                        error: {
                            text: 'Object exists',
                            store: 'MessageArray',
                            method: 'create',
                            exist: true
                        }
                    });
                }
            } else {
                resolve({
                    error: {
                        text: 'Missing required prop',
                        store: 'MessageArray',
                        method: 'create',
                        required: true
                    }
                });
            }
        });
    };
    entities.MessageArray.read = function (data) {
        const {id} = data;

        return new Promise(resolve => {
            if(id !== undefined){
                const getResult = db.transaction("MessageArrays").objectStore("MessageArrays").get(id);

                getResult.onsuccess = function (event) {
                    if (event.target.result) {
                        resolve(event.target.result);
                    }else
                        resolve({
                            error: {
                                text: 'No matches in DB',
                                exist: false
                            }
                        });
                };
                getResult.onerror = function (event) {
                    const text = "MessageArray error: " + event.target.error;
                    resolve({
                        error: {
                            text: text
                        }
                    });
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'MessageArray',
                        method: 'read',
                        required: true
                    }
                })
            }

        });
    };
    entities.MessageArray.update = function (data) {
        const {id, messages} = data;
        return new Promise(async resolve => {
            if(id !== undefined && messages !== undefined){
                let msgA = await entities.MessageArray.read(data);
                let msgAData = !msgA.hasOwnProperty('error') && msgA.id ? msgA : {};
                const dataToPut = Object.assign(msgAData, R.clone(data));

                let request = db.transaction(["MessageArrays"], "readwrite")
                    .objectStore("MessageArrays")
                    .put(dataToPut);
                request.onsuccess = function(event) {
                    resolve(event.target.result === id ? dataToPut : event.target.result);
                };
                request.onerror = function(event) {
                    resolve({
                        error: {
                            text: 'Updating messageArray error :' + event.target.error
                        }
                    })
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'MessageArray',
                        method: 'update',
                        required: true
                    }
                })
            }
        });
    };
    entities.MessageArray.delete = function (data) {
        const {id} = data;
        return new Promise(resolve => {
            if(id !== undefined){
                let request = db.transaction(["MessageArrays"], "readwrite")
                    .objectStore("MessageArrays")
                    .delete(id);
                request.onsuccess = function(event) {
                    resolve({})
                };
                request.onerror = function(event) {
                    resolve({
                        error: {
                            text: 'Deleting messageArray error :' + event.target.error
                        }
                    })
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'MessageArray',
                        method: 'create',
                        required: true
                    }
                })
            }
        });
    };

    /**MessageLists*/
    entities.MessageList.Schema = {
        id: {
            type: 'string',
            unique: true
        },
        messageArrays: {
            type: 'array'
        },
    };
    entities.MessageList.create = async function () {
        const id = await getId(0);

        return new Promise(async resolve => {
            if (id !== undefined) {
                const mL = await entities.MessageList.read({id});

                if(mL.hasOwnProperty('error') && !mL.error.exist){
                    let transaction = db.transaction(Object.keys(stores).map(store => store), "readwrite");

                    // Do something when all the data is added to the database.
                    transaction.oncomplete = function (event) {

                    };

                    transaction.onerror = function (event) {
                        console.error("Transaction error: " + event.target.error);
                    };

                    let objectStore = transaction.objectStore("MessageLists");
                    const dataToAdd = {id, messageArrays: []};
                    let request = objectStore.add(dataToAdd);

                    request.onsuccess = function (event) {
                        resolve(event.target.result === id ? dataToAdd : event.target.result);
                    };
                } else {
                    resolve({
                        error: {
                            text: 'Object exists',
                            store: 'MessageList',
                            method: 'create',
                            exist: true
                        }
                    });
                }
            } else {
                resolve({
                    error: {
                        text: 'Missing required prop',
                        store: 'MessageList',
                        method: 'create',
                        required: true
                    }
                });
            }
        });

        async function getId(n) {
            if(n>=10){
                return undefined;
            }
            const id = uniqid.process();
            const mL = await entities.MessageList.read({id});
            if(mL.id)
                return await getId(n+1);
            else
                return id;
        }
    };
    entities.MessageList.read = function (data) {
        const {id} = data;

        return new Promise(resolve => {
            if(id !== undefined){
                const getResult = db.transaction("MessageLists").objectStore("MessageLists").get(id);

                getResult.onsuccess = function (event) {
                    if (event.target.result) {
                        resolve(event.target.result);
                    }else
                        resolve({
                            error: {
                                text: 'No matches in DB',
                                exist: false
                            }
                        });
                };
                getResult.onerror = function (event) {
                    const text = "MessageList error: " + event.target.error;
                    resolve({
                        error: {
                            text: text
                        }
                    });
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'MessageList',
                        method: 'read',
                        required: true
                    }
                })
            }
        });
    };
    entities.MessageList.addMessage = function (data) {
        const {id, messageId} = data;
        return new Promise(async resolve => {
            if(id !== undefined && messageId !== undefined){

                let readRes = await entities.MessageList.read({id});

                if(!readRes.hasOwnProperty('error')){
                    const {messageArrays} = readRes;

                    if(messageArrays.length > 0){
                        const lastArrayId = messageArrays[messageArrays.length - 1];
                        const lastArray = await entities.MessageArray.read({id: lastArrayId});

                        if(lastArray.messages.length < 50){
                            lastArray.messages.push(messageId);
                            const resultOfAdding = await entities.MessageArray.update(lastArray);

                            resolve(resultOfAdding);
                        } else {
                            await entities.MessageArray.create({id: `${id}_arr_${messageArrays.length}`});
                            await entities.MessageArray.update({id: `${id}_arr_${messageArrays.length}`, messages:[messageId]});

                            messageArrays.push(`${id}_arr_${messageArrays.length}`);
                            put(resolve, {id, messageArrays});
                        }
                    } else {
                        await entities.MessageArray.create({id: `${id}_arr_0`});
                        await entities.MessageArray.update({id: `${id}_arr_0`, messages:[messageId]});

                        messageArrays.push(`${id}_arr_${messageArrays.length}`);
                        put(resolve, {id, messageArrays});
                    }

                } else {
                    resolve(readRes);
                }
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'MessageList',
                        method: 'addMessage',
                        required: true
                    }
                })
            }
        });

        function put(resolve, data) {
            let request = db.transaction(["MessageLists"], "readwrite")
                .objectStore("MessageLists")
                .put(data);
            request.onsuccess = function(event) {
                resolve(data)
            };
            request.onerror = function(event) {
                resolve({
                    error: {
                        text: 'Updating messageList error :' + event.target.error
                    }
                })
            };
        }
    };
    entities.MessageList.getMessages = function (data) {
        const {id} = data;
        return new Promise(async resolve => {
            if(id !== undefined){

                let readRes = await entities.MessageList.read({id});

                if(!readRes.hasOwnProperty('error')){
                    const {messageArrays} = readRes;

                    if(messageArrays.length > 0){
                        const lastArrayId = messageArrays[messageArrays.length - 1];
                        const lastArray = await entities.MessageArray.read({id: lastArrayId});

                        resolve(lastArray.messages);
                    } else {
                        resolve([]);
                    }

                } else {
                    resolve(readRes);
                }
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'MessageList',
                        method: 'getMessages',
                        required: true
                    }
                })
            }
        });

        function put(resolve, data) {
            let request = db.transaction(["MessageLists"], "readwrite")
                .objectStore("MessageLists")
                .put(data);
            request.onsuccess = function(event) {
                resolve(data)
            };
            request.onerror = function(event) {
                resolve({
                    error: {
                        text: 'Updating messageList error :' + event.target.error
                    }
                })
            };
        }
    };
    entities.MessageList.delete = function (data) {
        const {id} = data;
        return new Promise(async resolve => {
            if(id !== undefined){
                let msgA = await entities.MessageList.read(data);
                await Promise.all(msgA.messageArrays.map(async arr=> entities.MessageArray.delete({id: arr})));

                let request = db.transaction(["MessageLists"], "readwrite")
                    .objectStore("MessageLists")
                    .delete(id);
                request.onsuccess = function(event) {
                    resolve({})
                };
                request.onerror = function(event) {
                    resolve({
                        error: {
                            text: 'Deleting messageList error :' + event.target.error
                        }
                    })
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'MessageList',
                        method: 'delete',
                        required: true
                    }
                })
            }
        });
    };

    /**Conversations*/
    entities.Conversation.Schema = {
        id: {
            type: 'string',
            unique: true
        },
        messageList: {
            type: 'string',
            unique: true,
        },
        lastEvent: {
            type: 'string',
            unique: false,
            indexed: true
        },
        name: {
            type: 'string',
        },
        participants: {
            type: 'array',
            unique: false,
            item: {
                type: 'string'
            }
        },
        set: {
            type: 'string'
        }
    };
    entities.Conversation.create = function (data) {
        const {id} = data;

        return new Promise(async resolve => {
            if (id !== undefined) {
                const conversation = await entities.Conversation.read(data);
                if(conversation.hasOwnProperty('error') && !conversation.error.exist){
                    const mL = await entities.MessageList.create();
                    let transaction = db.transaction(Object.keys(stores).map(store => store), "readwrite");

                    // Do something when all the data is added to the database.
                    transaction.oncomplete = function (event) {

                    };

                    transaction.onerror = function (event) {
                        console.error("Transaction error: " + event.target.error);
                    };

                    let objectStore = transaction.objectStore("Conversations");
                    const dataToAdd = Object.assign({},data,{messageList: mL.id});
                    let request = objectStore.add(dataToAdd);

                    request.onsuccess = function (event) {
                        resolve(event.target.result === id ? R.clone(dataToAdd) : event.target.result);
                    };
                }else {
                    resolve({
                        error: {
                            text: 'Object exists',
                            store: 'Conversation',
                            method: 'create',
                            exist: true
                        }
                    });
                }
            } else {
                resolve({
                    error: {
                        text: 'Missing required prop',
                        store: 'Conversation',
                        method: 'create',
                        required: true
                    }
                });
            }
        });
    };
    entities.Conversation.read = function (data) {
        const {id} = data;

        return new Promise(resolve => {
            if(id !== undefined) {
                const getResult = db.transaction("Conversations").objectStore("Conversations").get(id);

                getResult.onsuccess = function (event) {
                    if (event.target.result) {
                        resolve(event.target.result);
                    } else
                        resolve({
                            error: {
                                text: 'No matches in DB',
                                exist: false
                            }
                        });
                };
                getResult.onerror = function (event) {
                    const text = "Conversation error: " + event.target.error;
                    resolve({
                        error: {
                            text: text
                        }
                    });
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'Conversation',
                        method: 'read',
                        required: true
                    }
                })
            }
        });
    };
    entities.Conversation.update = function (data) {
        const {id} = data;
        return new Promise(async resolve => {
            if(id !== undefined){
                let conversation = await entities.Conversation.read(data);
                let conversationData = !conversation.hasOwnProperty('error') && conversation.id ? conversation : {};
                const dataToPut = Object.assign(conversationData, R.clone(data));

                let request = db.transaction(["Conversations"], "readwrite")
                    .objectStore("Conversations")
                    .put(dataToPut);
                request.onsuccess = function(event) {
                    resolve(event.target.result === id ? dataToPut : event.target.result);
                };
                request.onerror = function(event) {
                    resolve({
                        error: {
                            text: 'Updating conversation error :' + event.target.error
                        }
                    })
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'Conversation',
                        method: 'update',
                        required: true
                    }
                })
            }
        });
    };
    entities.Conversation.delete = function (data) {
        const {id} = data;
        return new Promise(async resolve => {
            if(id !== undefined){
                const conversation = await entities.Conversation.read(data);
                await entities.MessageList.delete({id: conversation.messageList});

                let request = db.transaction(["Conversations"], "readwrite")
                    .objectStore("Conversations")
                    .delete(id);
                request.onsuccess = function(event) {
                    resolve({})
                };
                request.onerror = function(event) {
                    resolve({
                        error: {
                            text: 'Deleting conversation error :' + event.target.error
                        }
                    })
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'Conversation',
                        method: 'delete',
                        required: true
                    }
                })
            }
        });
    };
    entities.Conversation.getMessages = function (data) {
        const {id} = data;
        return new Promise(async resolve => {
            if(id !== undefined){
                const conversation = await entities.Conversation.read(data);
                const messagesIds = await entities.MessageList.getMessages({id: conversation.messageList});

                const messageList = await Promise.all(messagesIds.map(async messageId => {
                    return await entities.Message.read({id: messageId});
                }));

                resolve(messageList);
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'Conversation',
                        method: 'getMessages',
                        required: true
                    }
                })
            }
        });
    };
    entities.Conversation.addMessage = function (data) {
        const {id, messageId} = data;
        return new Promise(async resolve => {
            if(id !== undefined && messageId !== undefined){
                const conversation = await entities.Conversation.read(data);
                const addResult = await entities.MessageList.addMessage({id: conversation.messageList, messageId});

                resolve(addResult);
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'Conversation',
                        method: 'addMessages',
                        required: true
                    }
                })
            }
        });
    };

    /**Users*/
    entities.User.Schema = {
        id: {
            type: 'string',
            unique: true
        },
        conversations: {
            type: 'array',
            item: {
                type: 'string'
            }
        }
    };
    entities.User.create = function (data) {
        const {id} = data;

        return new Promise(async resolve => {
            if (id !== undefined) {
                const user = await entities.User.read({id});

                if (user.hasOwnProperty('error') && !user.error.exist) {
                    let transaction = db.transaction(Object.keys(stores).map(store => store), "readwrite");

                    // Do something when all the data is added to the database.
                    transaction.oncomplete = function (event) {
                    };

                    transaction.onerror = function (event) {
                        console.error("Transaction error: " + event.target.error);
                    };

                    let objectStore = transaction.objectStore("Users");
                    let request = objectStore.add(data);

                    request.onsuccess = function (event) {
                        resolve(event.target.result === id ? R.clone(data) : event.target.result);
                    };
                } else {
                    resolve({
                        error: {
                            text: 'Object exists',
                            store: 'User',
                            method: 'create',
                            exist: true
                        }
                    });
                }
            } else {
                resolve({
                    error: {
                        text: 'Missing required prop',
                        store: 'User',
                        method: 'create',
                        required: true
                    }
                });
            }
        });
    };
    entities.User.read = function (data) {
        const {id} = data;

        return new Promise(resolve => {
            if(id !== undefined){
                const getResult = db.transaction("Users").objectStore("Users").get(id);

                getResult.onsuccess = function (event) {
                    if (event.target.result) {
                        resolve(event.target.result);
                    }else
                        resolve({
                            error: {
                                text: 'No matches in DB',
                                exist: false
                            }
                        });
                };
                getResult.onerror = function (event) {
                    const text = "User error: " + event.target.error;
                    resolve({
                        error: {
                            text: text
                        }
                    });
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'User',
                        method: 'read',
                        required: true
                    }
                })
            }
        });
    };
    entities.User.update = function (data) {
        const {id} = data;
        return new Promise(async resolve => {
            if(id !== undefined){
                let user = await entities.User.read(data);
                let userData = !user.hasOwnProperty('error') && user.id ? user : {};
                const dataToPut = Object.assign(userData, R.clone(data));

                let request = db.transaction(["Users"], "readwrite")
                    .objectStore("Users")
                    .put(dataToPut);
                request.onsuccess = function(event) {
                    resolve(event.target.result === id ? dataToPut : event.target.result);
                };
                request.onerror = function(event) {
                    resolve({
                        error: {
                            text: 'Updating user error :' + event.target.error
                        }
                    })
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'User',
                        method: 'update',
                        required: true
                    }
                })
            }
        });
    };
    entities.User.delete = function (data) {
        const {id} = data;
        return new Promise(resolve => {
            if(id !== undefined){
                let request = db.transaction(["Users"], "readwrite")
                    .objectStore("Users")
                    .delete(id);
                request.onsuccess = function(event) {
                    resolve({})
                };
                request.onerror = function(event) {
                    resolve({
                        error: {
                            text: 'Deleting user error :' + event.target.error
                        }
                    })
                };
            } else {
                resolve({
                    error: {
                        text: 'Missing required props',
                        store: 'User',
                        method: 'delete',
                        required: true
                    }
                })
            }
        });
    };

    function storeInit(storeName) {
        // const entityName = storeName.slice(0, storeName.length-1);
        //
        // Object.keys(entities[entityName].Schema).map(key => {
        //     const item = entities[entityName].Schema[key];
        //
        //     if(item.indexed){
        //         stores[storeName].createIndex(key, key, { unique: item.unique });
        //     }
        // });
    }

    function init() {
        return new Promise(resolve => {
            // проверяем существования префикса.
            indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// НЕ ИСПОЛЬЗУЙТЕ "var indexedDB = ..." вне функции.
// также могут отличаться и window.IDB* objects: Transaction, KeyRange и тд
            IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
            IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla никогда не создавала префиксов для объектов, поэтому window.mozIDB* не требуется проверять)
            if (!indexedDB) {
                console.warn("Ваш браузер не поддерживат стабильную версию IndexedDB");
                resolve({
                    error: {}
                });
            } else {

                let request = indexedDB.open(dbName);
                request.onerror = function (event) {
                    console.error("Почему Вы не позволяете моему веб-приложению использовать IndexedDB?!");
                };
                request.onsuccess = function (event) {
                    db = event.target.result;

                    db.onerror = function (event) {
                        // все ошибки выводим в alert
                        const text = "Database error: " + event.target.error;
                        console.error(text);
                        resolve({
                            error: {
                                text: text
                            }
                        });
                    };
                    resolve(entities);
                };
                request.onupgradeneeded = function (event) {
                    db = event.target.result;

                    // Создаем хранилище объектов для этой базы данных
                    Object.keys(stores).map(key => {
                        stores[key] = db.createObjectStore(key, {keyPath: "id"});
                        storeInit(key);

                        console.log(`"${key}" store in "${dbName}" DB has been created.`);
                    });
                };
            }
        });

    }

    const result = {
        ready: false,
        error: undefined,
        db: () => {
            if (result.ready) {
                return new Promise(resolve => {
                    resolve(entities);
                })
            } else {
                return new Promise(resolve => {
                    listeners.push(() => {
                        resolve(entities)
                    })
                })
            }
        },
        start: () => {
            return init().then(initiated => {
                if (!initiated.hasOwnProperty('error')) {
                    result.ready = true;
                    result.entities = initiated;
                    listeners.map(f => f());
                    return true;
                } else {
                    result.error = initiated.error;
                    return false;
                }
            })
        },
    };

    return result;
}