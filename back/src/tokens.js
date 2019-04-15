module.exports = function ({uniqid}) {
    const tokenList = [];

    const addToken = (num) => {
        let _num = num ? num : 0;
        const token = uniqid('token');
        if (!tokenList.find(t => t.val === token)) {
            tokenList.push({
                val: token, expired: setTimeout(function () {
                    const fTokenIndex = tokenList.findIndex(t => t.val === token);
                    if (fTokenIndex >= 0) {
                        tokenList.splice(fTokenIndex, 1);
                    }
                }, 1000 * 60 * 10)
            });
            return token;
        } else if (num < 10) {
            return addToken(++_num);
        } else {
            return undefined;
        }
    };
    const findTokenIndex = (token) => {
        if (token.hasOwnProperty('val')) {
            return tokenList.findIndex(t => t.val === token.val);
        } else if (typeof token === 'string') {
            return tokenList.findIndex(t => t.val === token);
        }
    };
    const removeToken = (token) => {
        const fTokenIndex = findTokenIndex(token);
        console.log(fTokenIndex);

        if (fTokenIndex >= 0) {
            clearTimeout(tokenList[fTokenIndex].expired);
            tokenList.splice(fTokenIndex, 1);
            return true;
        } else {
            return false;
        }
    };

    return {
        addToken,
        findTokenIndex,
        removeToken
    }
};