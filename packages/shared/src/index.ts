export const isObject = (obj) => {
    return typeof obj === 'object' && obj !== null;
}

export const isFunction = (value) => {
    return typeof value === 'function'
}


export const isArray = Array.isArray;

export const assign = Object.assign;

export const isString = (value) => {
    return typeof value === 'string';
}