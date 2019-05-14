function pcbGenerate(template) {
    const generated = {...template};
    generated.make = (id, tName, relations) => {
        let result = undefined;
        if(template){
            if (tName && template.templateList.hasOwnProperty(tName)) {
                result = {
                    relations,
                    ...template.templateList[tName],
                    id,
                    make: generated.make,
                    children: (() => {
                        const result = {};
                        if(template.templateList[tName].children){
                            template.templateList[tName].children.map(child => {
                                Object.keys(template.idList).find(key => {
                                    if (key === child.id) {
                                        result[child.alias] = {...template.idList[key], id: child.id};
                                        return true;
                                    }
                                    return false
                                });
                            })
                        }
                        return result;
                    })()
                }
            } else if (template.idList.hasOwnProperty(id)) {
                result = {
                    relations,
                    ...template.idList[id],
                    id,
                    make: generated.make,
                    children: (() => {
                        const result = {};
                        if(template.idList[id].children){
                            template.idList[id].children.map(child => {
                                Object.keys(template.idList).find(key => {
                                    if (key === child.id) {
                                        result[child.alias] = {...template.idList[key], id: child.id};
                                        return true;
                                    }
                                    return false
                                })
                            })
                        }
                        return result;
                    })()
                }
            }
        }
        return result;
    };
    return generated;
}

export {
    pcbGenerate
}