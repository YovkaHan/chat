const firebase = require('firebase');
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
                    type: 'array'
                },
                conversations: {
                    type: 'array'
                }
            },
            multiGet: () => {
                return db.collection('participants').get().then((snapshot) => snapshot.docs.map(doc => doc.data()));
            },
            get: (data) => {
                return new Promise((resolve, reject) => {
                    const {login, id} = data;
                    if (id) {
                        return db.collection('participants').doc(id).get().then((doc) => {
                            if (doc.exists) {
                                const user = doc.data();

                                const C1 = new Promise(res=>{
                                    if(user.contacts){
                                        Promise.all(user.contacts.map(cID => db.collection('participants').doc(cID).get().then((doc) => doc.exists ? doc.data().login : undefined))).then(contacts =>{
                                            user.contacts = contacts.filter(c => c);
                                            res();
                                        });
                                    }
                                });
                                const C2 = new Promise(res=>{
                                    if(user.conversations){
                                        Promise.all(user.conversations.map(cID => db.collection('conversations').doc(cID).get().then((doc) => doc.exists ? doc.data() : undefined))).then(conversations => {
                                            user.conversations = conversations.filter(c => c);
                                            res();
                                        });
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

                            delete participant.id;

                            resolve(participant);
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
                        console.log(data.id);
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
                }
            },
        }
    };
    const conversationAdd = (data) => {
        if (data.hasOwnProperty('id') && data.hasOwnProperty('name'))
            return db.collection('participants').add(data);
        else
            return undefined;
    };

    return entities;
};