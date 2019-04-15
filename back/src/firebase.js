module.exports = function () {
    /**FIREBASE**/
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

    const participantsGet = () => {
        return db.collection('participants').get().then((snapshot) => snapshot.docs.map(doc => doc.data()));
    };
    const participantAdd = (data) => {
        if (data.hasOwnProperty('id') && data.hasOwnProperty('name'))
            return db.collection('participants').add(data);
        else
            return undefined;
    };
    const conversationAdd = (data) => {
        if (data.hasOwnProperty('id') && data.hasOwnProperty('name'))
            return db.collection('participants').add(data);
        else
            return undefined;
    };
    /**FIREBASE**/

    return {
        participantsGet,
        participantAdd,
    }
};