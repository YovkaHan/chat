import * as R from "ramda";

export  default function Store() {
    const map = JSON.parse(localStorage.getItem('map'));
    if (!map) {
        localStorage.setItem('map', JSON.stringify({}));
    }

    /**(string, object)*/
    const set = (authToken, props, componentId) => {
        if (authToken === undefined) {
            console.error('1й Аргумент должен быть строкой');
            return {};
        }
        if (typeof props !== 'object') {
            console.error('2й Аргумент должен быть объектом');
            return {};
        }
        let obj = localStorage.getItem(authToken);
        if (obj) {
            obj = JSON.parse(obj);
            Object.keys(props).map(k => {
                obj[k] = props[k];
            });
            localStorage.setItem(authToken, JSON.stringify(obj));
            return obj;
        } else if (componentId) {
            localStorage.setItem(authToken, JSON.stringify(props));
            const map = JSON.parse(localStorage.getItem('map'));
            map[componentId] = authToken;
            localStorage.setItem('map', JSON.stringify(map));
            return R.clone(props);
        }
    };

    /**(string, array)*/
    const get = (authToken, props) => {
        if (authToken === undefined) {
            console.error('1й Аргумент должен быть строкой');
            return [];
        }
        let obj = localStorage.getItem(authToken);
        if (obj) {
            if (Array.isArray(props)) {
                obj = JSON.parse(obj);
                return props.map(p => obj[p]).filter(p => p)
            } else {
                console.error('2й Аргумент должен быть массивом');
                return [];
            }
        }
        return [];
    };

    /**(string)*/
    const del = (authToken) => {
        if (authToken === undefined) {
            console.error('1й Аргумент должен быть строкой');
            return false;
        }
        localStorage.removeItem(authToken);
        const map = JSON.parse(localStorage.getItem('map'));
        const propName = Object.keys(map).find(k => map[k] === authToken);
        delete map[propName];
        localStorage.setItem('map', JSON.stringify(map));
        return true;
    };

    const getTokenById = (componentId) => {
        const map = JSON.parse(localStorage.getItem('map'));
        return map[componentId];
    };

    return {set, get, del, getTokenById}
}