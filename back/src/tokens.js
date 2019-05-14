module.exports = function ({uniqid}) {
    const objectList = [];

    const addObject = (num, userId) => {
        let _num = num ? num : 0;
        const authToken = uniqid('token');
        if (!objectList.find(t => t.authToken === authToken)) {
            objectList.push({
                authToken,
                userId,
                expired: setTimeout(function () {
                    const fTokenIndex = objectList.findIndex(t => t.authToken === authToken);
                    if (fTokenIndex >= 0) {
                        objectList.splice(fTokenIndex, 1);
                    }
                }, 1000 * 60 * 60)
            });
            return authToken;
        } else if (num < 10) {
            return addObject(++_num);
        } else {
            return undefined;
        }
    };
    const findObjectIndex = (authToken, userId) => {
        if(userId !== undefined){
            return objectList.findIndex(t => t.authToken === authToken && t.userId === userId);
        }
        return objectList.findIndex(t => t.authToken === authToken);
    };
    const getObject = (authToken) => {
        const index = objectList[findObjectIndex(authToken)];

        return index === -1 ? undefined : index;
    };
    const removeObject = (authToken, userId) => {
        const fTokenIndex = findObjectIndex(authToken, userId);

        if (fTokenIndex >= 0) {
            clearTimeout(objectList[fTokenIndex].expired);
            objectList.splice(fTokenIndex, 1);
            return true;
        } else {
            return false;
        }
    };
    const setRSAKeyOnObject = (authToken, userId, key) => {
        objectList[findObjectIndex(authToken, userId)].rsaKey = key;
        return objectList[findObjectIndex(authToken, userId)];
    };
    const setAESKeyOnObject = (authToken, key) => {
        objectList[findObjectIndex(authToken)].aesKey = key;
        return objectList[findObjectIndex(authToken)];
    };

    return {
        addObject,
        findObjectIndex,
        removeObject,
        getObject,
        setRSAKeyOnObject,
        setAESKeyOnObject
    }
};