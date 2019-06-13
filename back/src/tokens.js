const uniqid = require('uniqid');
const R = require('rambda');
const objectList = [];

function addObject (num, userId) {
    let _num = num ? num : 0;
    const authToken = uniqid('token');
    if (!objectList.find(t => t.authToken === authToken)) {
        objectList.push({
            authToken,
            userId,
            // expired: setTimeout(function () {
            //     const fTokenIndex = objectList.findIndex(t => t.authToken === authToken);
            //     if (fTokenIndex >= 0) {
            //         objectList.splice(fTokenIndex, 1);
            //     }
            // }, 1000 * 60 * 60)
        });
        return authToken;
    } else if (num < 10) {
        return addObject(++_num);
    } else {
        return undefined;
    }
}
function findObjectIndex (authToken, userId) {
    if(userId !== undefined){
        return objectList.findIndex(t => t.authToken === authToken && t.userId === userId);
    }
    return objectList.findIndex(t => t.authToken === authToken);
}
function getObject (authToken) {
    const index = findObjectIndex(authToken);
    const object = R.clone(objectList[index]);

   // delete object.expired;

    return index === -1 ? undefined : object;
}
function removeObject (authToken, userId) {
    const fTokenIndex = findObjectIndex(authToken, userId);

    if (fTokenIndex >= 0) {
        //clearTimeout(objectList[fTokenIndex].expired);
        objectList.splice(fTokenIndex, 1);
        return true;
    } else {
        return false;
    }
}
function setRSAKeyOnObject (authToken, userId, key) {
    const index = findObjectIndex(authToken, userId);
    if(index === -1) {
        return undefined;
    }else {
        objectList[findObjectIndex(authToken, userId)].rsaKey = key;
        return getObject(authToken);
    }
}
function setAESKeyOnObject (authToken, key) {
    const index = findObjectIndex(authToken);
    if(index === -1) {
        return undefined;
    }else {
        objectList[findObjectIndex(authToken)].aesKey = key;
        return getObject(authToken);
    }
}

const methodProps = {
    addObject : ['num', 'userId'],
    findObjectIndex: ['uthToken', 'userId'],
    getObject: ['authToken'],
    removeObject: ['authToken', 'userId'],
    setRSAKeyOnObject: ['authToken', 'userId', 'key'],
    setAESKeyOnObject: ['authToken', 'userId']
};

const methods = {
    addObject: Object.assign(addObject, {props: methodProps.addObject}),
    findObjectIndex: Object.assign(findObjectIndex, {props: methodProps.findObjectIndex}),
    getObject: Object.assign(getObject, {props: methodProps.getObject}),
    removeObject: Object.assign(removeObject, {props: methodProps.removeObject}),
    setRSAKeyOnObject: Object.assign(setRSAKeyOnObject, {props: methodProps.setRSAKeyOnObject}),
    setAESKeyOnObject: Object.assign(setAESKeyOnObject, {props: methodProps.setAESKeyOnObject})
};
methods.findObjectIndex.props = ['uthToken', 'userId'];

const ipc = require('node-ipc');

ipc.config.id = 'tokens';
ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.serve(() => {
    ipc.server.on(
        'connection',
        function(clientId,socket) {
            ipc.log('Process "' + clientId + '" has connected!');
            console.log('Process "' + clientId + '" has connected!');
        }
    );
    ipc.server.on(
        'socket.disconnected',
        function(socket, destroyedSocketID) {
            ipc.log('Process "' + destroyedSocketID + '" has disconnected!');
        }
    );
    ipc.server.on(
        'method.props',
        (data,socket) => {
            ipc.server.emit(
                socket,
                'method.props.result',
                methodProps
            );
        }
    );
    Object.keys(methods).map(item => {

        ipc.server.on(
            item,
            (data,socket) => {
                if(data){
                    const props = methods[item].props.map(p => data[p]);
                    const result = methods[item].apply(this, props);

                    ipc.server.emit(
                        socket,
                        `${item}${data._id}.result`,
                        JSON.stringify(result)
                    );
                }else {
                    ipc.server.emit(
                        socket,
                        `${item}.error`,
                        JSON.stringify('Missing props')
                    );
                }
            }
        );
    });
});
ipc.server.start();