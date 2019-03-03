function pcbGenerate(template) {
    const generated = {...template};
    generated.make = (name) => {
        let result = undefined;
        if (template.hasOwnProperty(name)) {
            result = {
                ...template[name],
                make: generated.make,
                children: (() => {
                    const result = {};
                    template[name].children ? template[name].children.map(child => {
                        template[Object.keys(template).find(key => {
                            if (key === child.name) {
                                result[child.alias] = {...template[key], name: child.name};
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