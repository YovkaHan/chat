const firebase = require('firebase');
const uniqid = require('uniqid');
firebase.initializeApp({
    apiKey: "AIzaSyCf9GH0ejD0AsTc-fpeEdiuqyXkvzXoYaQ",
    authDomain: "chat-6855d.firebaseapp.com",
    databaseURL: "https://chat-6855d.firebaseio.com",
    projectId: "chat-6855d",
    storageBucket: "chat-6855d.appspot.com",
    messagingSenderId: "387186080497"
});
const db = firebase.firestore();

module.exports = function () {
    const entities = {
        Participant: {
            Schema: {
                id: {
                    type: 'string',
                    isRequired: 'true',
                    isUnique: 'true'
                },
                login: {
                    type: 'string',
                    isRequired: 'true',
                    isUnique: 'true'
                },
                name: {
                    type: 'string',
                    isRequired: 'true',
                },
                ava: {
                    type: 'string'
                },
                contacts: {
                    type: 'array',
                    isRequired: 'true'
                },
                conversations: {
                    type: 'string'
                }
            },
            /**return Promise(Object)*/
            safeGet: (props) => {
                return new Promise((resolve, reject) => {
                    const {id, get} = props;
                    if (id) {
                        return db.collection('participants').doc(id).get().then((doc) => {
                            if (doc.exists) {
                                const user = doc.data();
                                if(typeof get === 'string' && user.hasOwnProperty(get)){
                                    if (get === 'contacts' && user.contacts) {
                                        Promise.all(user.contacts.map(cID => db.collection('participants').doc(cID).get().then((doc) => doc.exists ? doc.data() : undefined))).then(contacts => {
                                            const result = {};
                                            contacts.map(c => {
                                                result[c.login] = {
                                                    login: c.login,
                                                    name: c.name,
                                                    ava: c.ava
                                                }
                                            });
                                            resolve(result);
                                        });
                                    } else if(get === 'conversations' && user.conversations){
                                        db.collection('conversationLists').doc(user.conversations).get().then((doc) => doc.exists ? doc.data().conversations : undefined).then(conversations => {
                                            Promise.all(conversations.map(cID => db.collection('conversations').doc(cID).get().then((doc) => doc.exists ? doc.data() : undefined))).then(conversations => {
                                                const result = {};
                                                conversations.map(c => {
                                                    result[c.name] = c;
                                                });
                                                resolve(result);
                                            });
                                        });
                                    }else {
                                        resolve({});
                                    }
                                } else {
                                    resolve({
                                        error: {
                                            text: 'Wrong prop to get',
                                            exist: false
                                        }
                                    });
                                }
                            } else {
                                resolve({
                                    error: {
                                        text: 'Participant not exist',
                                        exist: false
                                    }
                                });
                            }
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
            getAll: () => {
                return db.collection('participants').get().then((snapshot) => snapshot.docs.map(doc => doc.data()));
            },
            get: (data) => {
                return new Promise((resolve, reject) => {
                    const {login, id} = data;
                    if (id !== undefined) {
                        return db.collection('participants').doc(id).get().then((doc) => {
                            if (doc.exists) {
                                const user = doc.data();

                                const C1 = new Promise(res=>{
                                    if(user.contacts){
                                        Promise.all(user.contacts.map(cID => db.collection('participants').doc(cID).get().then((doc) => doc.exists ? doc.data().login : undefined))).then(contacts =>{
                                            user.contacts = contacts.filter(c => c);
                                            res();
                                        });
                                    }else{
                                        res();
                                    }
                                });
                                const C2 = new Promise(res=>{
                                    if(user.conversations){
                                        db.collection('conversationLists').doc(user.conversations).get().then((doc) => doc.exists ? doc.data().conversations : undefined).then(conversations => {
                                            Promise.all(conversations.map(cID => db.collection('conversations').doc(cID).get().then((doc) => doc.exists ? doc.data() : undefined))).then(conversations => {
                                                user.conversations = conversations.filter(c => c);
                                                res();
                                            });
                                        });
                                    }else {
                                        res();
                                    }
                                });
                                Promise.all([C1, C2]).then(() =>{
                                    resolve(user);
                                });
                            } else {
                                resolve({
                                    error: {
                                        text: 'Participant not exist',
                                        exist: false
                                    }
                                });
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else if (login) {
                        db.collection('participants').get().then((snapshot) => {
                            const participants = snapshot.docs.map(doc => doc.data());
                            const participant = participants.find(p => p.login === login);

                            resolve(participant);
                            /*try{
                                delete participant.id;
                                delete participant.conversations;
                                delete participant.contacts;

                                if(!participant.hasOwnProperty('id') && !participant.hasOwnProperty('conversations') && !participant.hasOwnProperty('contacts')){
                                    resolve(participant);
                                }else {
                                    throw true;
                                }
                            }catch (e) {
                                resolve({});
                            }*/
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
            getUnsafe: (id) => {
                return new Promise((resolve, reject) => {
                    if (id) {
                        return db.collection('participants').doc(id).get().then((doc) => {
                            if (doc.exists) {
                                const user = doc.data();

                                resolve(user);
                            } else {
                                resolve({
                                    error: {
                                        text: 'Participant not exist',
                                        exist: false
                                    }
                                });
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
            edit: (data) => {
                return new Promise((resolve, reject) => {
                    const props = Object.keys(entities.Participant.Schema);
                    const participant = {};

                    Object.keys(data).map(key => {
                       if(props.indexOf(key) !== -1){
                           participant[key] = data[key];
                       }
                    });

                    if (participant.id) {
                        db.collection('participants').doc(participant.id).get().then(function (doc) {
                            if (doc.exists) {
                                const editedParticipant = doc.data();
                                const notUniqueProps = Object.keys(entities.Participant.Schema).filter(key => !entities.Participant.Schema[key].isUnique);
                                notUniqueProps.map(p => {
                                    if(participant[p] !== undefined){
                                        editedParticipant[p] = participant[p];
                                    }
                                });

                                db.collection('participants').doc(participant.id).set(editedParticipant).then(()=>{
                                    resolve({...participant, ...editedParticipant});
                                }).catch(error =>  resolve({
                                    error: {
                                        text: error
                                    }
                                }));
                            } else {
                                resolve({
                                    error: {
                                        text: 'Participant not exist',
                                        exist: false
                                    }
                                });
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
            add: (data) => {
                return new Promise((resolve, reject) => {
                    const requiredProps = [];
                    Object.keys(entities.Participant.Schema).map(key => {
                        if (entities.Participant.Schema[key].isRequired)
                            requiredProps.push(key);
                    });

                    if (requiredProps.every(key => data[key])) {
                        db.collection('participants').doc(data.id).get().then(function (doc) {
                            if (doc.exists) {
                                resolve({
                                    error: {
                                        text: 'Participant exist',
                                        exist: true
                                    }
                                });
                            } else {
                                db.collection('participants').doc(data.id).set(data).then(()=> {
                                    resolve(data);
                                }).catch(error =>  resolve({
                                    error: {
                                        text: error
                                    }
                                }));
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            }
        },
        Conversation: {
            Schema: {
                id: {
                    type: 'string',
                    isRequired: 'true',
                    isUnique: 'true'
                },
                participants: {
                    type: 'array',
                    isRequired: 'true'
                },
                name: {
                    type: 'string',
                    isRequired: 'true',
                },
                set: {
                    type: 'string',
                    isRequired: 'true'
                },
                messageListId: {
                    type: 'string',
                    isUnique: 'true'
                }
            },
            add: (data) => {
                return new Promise((resolve, reject) => {
                    const requiredProps = [];
                    const _schema = entities.Conversation.Schema;
                    Object.keys(_schema).map(key => {
                        if (_schema[key].isRequired)
                            requiredProps.push(key);
                    });

                    if (requiredProps.every(key => data[key])) {
                        db.collection('conversations').doc(data.id).get().then(function (doc) {
                            if (doc.exists) {
                                resolve({
                                    error: {
                                        text: 'Conversation exist',
                                        exist: true
                                    }
                                });
                            } else {
                                db.collection('conversations').doc(data.id).set(data).then(()=> {
                                    if(!data.hasOwnProperty('messageListId')){
                                        entities.MessageList.add().then(mL => {
                                            data.messageListId = mL.id;
                                            resolve(data);
                                        });
                                    }else {
                                        resolve(data);
                                    }
                                }).catch(error =>  resolve({
                                    error: {
                                        text: error
                                    }
                                }));
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
            get: (data) => {
                return new Promise((resolve, reject) => {
                    const {id} = data;
                    if (id) {
                         db.collection('conversations').doc(id).get().then((doc) => {
                            if (doc.exists) {
                                const conv = doc.data();

                                entities.MessageList.get(conv.messageListId).then(mL => {
                                    conv.messageList = mL;
                                    resolve(conv);
                                });

                            } else {
                                resolve({
                                    error: {
                                        text: 'Conversation not exist',
                                        exist: false
                                    }
                                });
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
        },
        ConversationList: {
            Schema:{
                id: {
                    type: 'string',
                    isRequired: 'true',
                    isUnique: 'true'
                },
                conversations: {
                    type: 'array'
                },
            },
            get(id){
                return new Promise(resolve => {
                    if(id !== undefined){
                        db.collection('conversationLists').doc(id).get().then(doc => {
                            if(doc.exists){
                                resolve(doc.data());
                            }else {
                                resolve({
                                    error: {
                                        text: 'List not exist',
                                        exist: false
                                    }
                                });
                            }
                        })
                    }else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
            onChange(id){
               return new Promise(resolve => {
                   if(id){
                       resolve(db.collection("conversationLists").where('id', '==', id))
                   }else {
                       resolve({
                           error: {
                               text: 'Missing required prop',
                               required: true
                           }
                       });
                   }
               })
            },
            doc(id){
                return new Promise(resolve => {
                    if(id){
                        resolve(db.collection('conversationLists').doc(id))
                    }else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                })
            }
        },
        MessageList: {
            Schema: {
                id: {
                    type: 'string',
                    isRequired: 'true',
                    isUnique: 'true'
                },
                messages: {
                    type: 'array',
                    isRequired: 'true'
                }
            },
            add: (data) =>{
                return new Promise((resolve, reject) => {
                    const requiredProps = [];
                    const _schema = entities.MessageList.Schema;
                    const _data = data ? data : {};

                    if(!_data.hasOwnProperty('messages')){
                        _data.messages = [];
                    }
                    if(!_data.hasOwnProperty('id')){
                        _data.id = getId('messageLists');
                    }
                    /***/

                    Object.keys(_schema).map(key => {
                        if (_schema[key].isRequired)
                            requiredProps.push(key);
                    });

                    if (requiredProps.every(key => _data[key])) {
                        db.collection('messageLists').doc(_data.id).get().then(function (doc) {
                            if (doc.exists) {
                                resolve({
                                    error: {
                                        text: 'Message List exist',
                                        exist: true
                                    }
                                });
                            } else {
                                db.collection('messageLists').doc(_data.id).set(_data).then(()=> {
                                    resolve(_data);
                                }).catch(error =>  resolve({
                                    error: {
                                        text: error
                                    }
                                }));
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
            get: (id) => {
                return new Promise(resolve => {
                    if(id !== undefined && typeof id === 'string'){
                        db.collection('messageLists').doc(id).get().then(function (doc) {
                            if (doc.exists) {
                                const result = doc.data();
                                const messageLength = result.messages.length;
                                let msgs = [];

                                if(messageLength >= 50){
                                    for(let n = messageLength - 50; n < messageLength; n++){
                                        msgs.push(entities.Message.get(result.messages[n]).then(msg => msg));
                                    }
                                }else {
                                    msgs = result.messages.map(mId=>entities.Message.get(mId).then(msg => msg))
                                }

                                Promise.all(msgs).then(msgsResult => {
                                    const messagesResult = [];
                                    msgsResult.map(msg => messagesResult.push(msg));
                                    resolve(messagesResult);
                                })

                            } else {
                                resolve({
                                    error: {
                                        text: 'Message doesn\'t exist',
                                        exist: false
                                    }
                                });
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    }else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                })
            },
            edit: (data) => {
                return new Promise(resolve => {
                    const _data = data ? data : {};


                    if (_data.id !== undefined && typeof _data.id === 'string') {
                        db.collection('messageLists').doc(_data.id).get().then(function (doc) {
                            if (doc.exists) {
                                const docResult = doc.data();
                                const result = {
                                    id: docResult.id,
                                    ..._data
                                };
                                db.collection('messageLists').doc(_data.id).set(result).then(()=> {
                                    resolve(result);
                                }).catch(error =>  resolve({
                                    error: {
                                        text: error
                                    }
                                }));
                            } else {
                                resolve({
                                    error: {
                                        text: 'Message List doesn\'t exist',
                                        exist: false
                                    }
                                });
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
            addMessage: (data) => {
                return new Promise(resolve => {
                    const {id, msgId} = data;

                    if((id !== undefined && typeof id === 'string') && (msgId !== undefined && typeof msgId === 'string')){
                        db.collection('messages').doc(msgId).get().then(doc => {
                            if(doc.exists){
                                db.collection('messageLists').doc(id).get().then(mLDoc => {
                                    if(mLDoc.exists){
                                        const mLData = mLDoc.data();
                                        mLData.messages.push(msgId);
                                        db.collection('messageLists').doc(id).set(mLData).then((result)=>{
                                            resolve(result);
                                        })
                                    }else {
                                        resolve({
                                            error: {
                                                text: 'Message List doesn\'t exist',
                                                exist: false
                                            }
                                        });
                                    }
                                }).catch(function (error) {
                                    console.log("Error getting document:", error);
                                });
                            }else {
                                resolve({
                                    error: {
                                        text: 'Message doesn\'t exist',
                                        exist: false
                                    }
                                });
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    }
                });
            },
            editMessage: (data) => {
                return new Promise(resolve => {
                    const {id, message} = data;
                    const msgId = message.id;

                    if((id !== undefined && typeof id === 'string') && (msgId !== undefined && typeof msgId === 'string')){
                        db.collection('messageLists').doc(id).get().then(mLDoc => {
                            if(mLDoc.exists){
                                const mLData = mLDoc.data();
                                if(mLData.messages.indexOf(msgId) !== -1){
                                    db.collection('messages').doc(msgId).get().then(msgDoc => {
                                        if(msgDoc.exists){
                                            const msgData = msgDoc.data();
                                            msgData.date = message.date ? message.date : msgData.date;
                                            msgData.data = message.data ? message.data : msgData.data;

                                            resolve(msgData);
                                        }else {
                                            resolve({
                                                error: {
                                                    text: 'Message doesn\'t exist',
                                                    exist: false
                                                }
                                            });
                                        }
                                    }).catch(function (error) {
                                        console.log("Error getting document:", error);
                                    });
                                }else {
                                    resolve({
                                        error: {
                                            text: 'Message List doesn\'t have this msg',
                                            exist: false
                                        }
                                    });
                                }
                            }else {
                                resolve({
                                    error: {
                                        text: 'Message List doesn\'t exist',
                                        exist: false
                                    }
                                });
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    }
                });
            },
            deleteMessage: (id) => {}
        },
        Message: {
            Schema: {
                id: {
                    type: 'string',
                    isRequired: 'true',
                    isUnique: 'true'
                },
                date: {
                    type: 'timestamp',
                    isRequired: 'true'
                },
                from: {
                    type: 'string',
                    isRequired: 'true',
                },
                to: {
                    type: 'string',
                },
                data: {
                    type: 'string',
                    isRequired: 'true'
                }
            },
            get: (id) => {
                return new Promise((resolve, reject) => {
                    if (id !== undefined && typeof id === 'string') {
                        db.collection('messages').doc(id).get().then(function (doc) {
                            if (doc.exists) {
                                resolve(doc.data());
                            } else {
                                resolve({
                                    error: {
                                        text: 'Message doesn\'t exist',
                                        exist: false
                                    }
                                });
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
            add: (data) => {
                return new Promise((resolve, reject) => {
                    const requiredProps = [];
                    const _schema = entities.Message.Schema;
                    const _data = data ? data : {};
                    Object.keys(_data).map(key => {
                        if(_data[key] == undefined){
                            delete _data[key];
                        }
                    });

                    if(!_data.hasOwnProperty('id')){
                        _data.id = getId('messages');
                    }
                    /***/

                    Object.keys(_schema).map(key => {
                        if (_schema[key].isRequired)
                            requiredProps.push(key);
                    });

                    if (requiredProps.every(key => _data[key])) {
                        db.collection('messages').doc(_data.id).get().then(function (doc) {
                            if (doc.exists) {
                                resolve({
                                    error: {
                                        text: 'Message List exist',
                                        exist: true
                                    }
                                });
                            } else {
                                db.collection('messages').doc(_data.id).set(_data).then(()=> {
                                    resolve(_data);
                                }).catch(error =>  resolve({
                                    error: {
                                        text: error
                                    }
                                }));
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
            edit: (data) => {
                return new Promise((resolve, reject) => {
                    const {id} = data;

                    if (id !== undefined && typeof id === 'string') {
                        const docRef = db.collection('messages').doc(data.id);
                        docRef.get().then(function (doc) {
                            if (doc.exists) {
                                const docData = doc.data();
                                const result = {
                                    ...data,
                                    id: docData.id,
                                    from: docData.to,
                                };

                                docRef.set(result).then(()=> {
                                    resolve(result);
                                }).catch(error =>  resolve({
                                    error: {
                                        text: error
                                    }
                                }));
                            } else {
                                resolve({
                                    error: {
                                        text: 'Message doesn\'t exist',
                                        exist: false
                                    }
                                });
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            }
        },
        Event: {
            Schema: {
                id: {
                    type: 'string',
                    isRequired: 'true',
                    isUnique: 'true'
                },
                date: {
                    type: 'string',
                    isRequired: 'true'
                },
                data: {
                    type: 'map',
                    isRequired: 'true'
                },
                name: {
                    type: 'string',
                    isRequired: 'true'
                }
            },
            add: (props) => {
                return new Promise((resolve, reject) => {
                    const requiredProps = [];
                    const _schema = entities.Event.Schema;
                    const _props = props ? props : {};

                    _props.id = `${Date.now()}_${getId('events')}`;

                    Object.keys(_schema).map(key => {
                        if (_schema[key].isRequired)
                            requiredProps.push(key);
                    });

                    if (requiredProps.every(key => _props[key])) {
                        db.collection('messages').doc(_props.id).get().then(function (doc) {
                            if (doc.exists) {
                                resolve({
                                    error: {
                                        text: 'Event exist',
                                        exist: true
                                    }
                                });
                            } else {
                                db.collection('events').doc(_props.id).set(_props).then(()=> {
                                    resolve(_props);
                                }).catch(error =>  resolve({
                                    error: {
                                        text: error
                                    }
                                }));
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
            delete: (id) => {
                return new Promise((resolve, reject) => {
                    if (id) {
                        db.collection("cities").doc(id).delete().then(function() {
                            resolve();
                        }).catch(function(error) {
                            resolve({
                                error: {
                                    text: error
                                }
                            });
                        });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            }
        },
        EventList: {
            Schema: {
                id: {
                    type: 'string',
                    isRequired: 'true',
                    isUnique: 'true'
                },
                conversationId: {
                    type: 'string',
                    isRequired: 'true'
                },
                events: {
                    type: 'collection'
                },
                userId: {
                    type: 'string',
                    isRequired: 'true'
                },
            },
            get: (props) => {
                return new Promise((resolve, reject) => {
                    const {conversationId, userId, id} = props;
                    if(id){
                        db.collection('eventLists').doc(id).get().then((doc) => {
                            if (doc.exists) {
                                resolve(doc.data());
                            } else {
                                resolve({
                                    error: {
                                        text: 'Event List is not exist',
                                        exist: false
                                    }
                                });
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                    } else if (conversationId !== undefined && userId !== undefined) {
                        db.collection('eventLists').where('conversationId', '==', conversationId).where('userId', '==', userId).get().then(snapshot => {
                            if (snapshot.empty) {
                                resolve({
                                    error: {
                                        text: 'No matching documents.',
                                        exist: false
                                    }
                                });
                            }
                            snapshot.forEach(doc => {
                                resolve(doc.data());
                            });
                        })
                            .catch(err => {
                                console.log('Error getting documents', err);
                            });
                    } else {
                        resolve({
                            error: {
                                text: 'Missing required prop',
                                required: true
                            }
                        });
                    }
                });
            },
            getEventArray: (props) => {
                return new Promise((resolve, reject) => {
                    const {eventId, eventListId, conversationId, userId} = props;
                    entities.EventList.get({id: eventListId, conversationId, userId}).then(eventList => {
                        if (eventList.error) {
                            resolve(eventList);
                        }else {
                            const date = eventId.slice('_')[0];
                            eventList.events.get(date).then(doc => {
                                if(doc.exists){
                                    const data = doc.data().data;
                                }else {
                                    resolve({
                                        error: {
                                            text: 'No such event in this list or wrong list sequence',
                                            exist: false
                                        }
                                    })
                                }
                            })
                        }
                    });
                })
            }
        }
    };
    function getId(collection) {
        const ref = db.collection(collection).doc();
        return ref.id;
    }

    return entities;
};
