module.exports = function ({uniqid}) {
    const objectList = [];

    const addObject = (num, userId) => {
        let _num = num ? num : 0;
        const token = uniqid('token');
        if (!objectList.find(t => t.token === token)) {
            objectList.push({
                token,
                userId,
                expired: setTimeout(function () {
                    const fTokenIndex = objectList.findIndex(t => t.token === token);
                    if (fTokenIndex >= 0) {
                        objectList.splice(fTokenIndex, 1);
                    }
                }, 1000 * 60 * 60)
            });
            return token;
        } else if (num < 10) {
            return addObject(++_num);
        } else {
            return undefined;
        }
    };
    const findObjectIndex = (token, userId) => {
        if(userId !== undefined){
            return objectList.findIndex(t => t.token === token && t.userId === userId);
        }
        return objectList.findIndex(t => t.token === token);
    };
    const getObject = (token) => {
        const index = objectList[findObjectIndex(token)];

        return index === -1 ? undefined : index;
    };
    const removeObject = (token, userId) => {
        const fTokenIndex = findObjectIndex(token, userId);

        if (fTokenIndex >= 0) {
            clearTimeout(objectList[fTokenIndex].expired);
            objectList.splice(fTokenIndex, 1);
            return true;
        } else {
            return false;
        }
    };
    const setRSAKeyOnObject = (token, userId, key) => {
        objectList[findObjectIndex(token, userId)].rsaKey = key;
        return objectList[findObjectIndex(token, userId)];
    };
    const setAESKeyOnObject = (token, key) => {
        objectList[findObjectIndex(token)].aesKey = key;
        return objectList[findObjectIndex(token)];
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