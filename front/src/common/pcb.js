function pcbGenerate(template) {
    const generated = {...template};
    generated.make = (id) => {
        let result = undefined;
        if (template.hasOwnProperty(id)) {
            result = {
                ...template[id],
                id,
                make: generated.make,
                children: (() => {
                    const result = {};
                    template[id].children ? template[id].children.map(child => {
                        template[Object.keys(template).find(key => {
                            if (key === child.id) {
                                result[child.alias] = {...template[key], id: child.id};
                                return true;
                            }
                            return false
                        })];
                    }) : {};
                    return result;
                })()
            }
        }
        return result;
    };
    return generated;
}

export {
    pcbGenerate
}