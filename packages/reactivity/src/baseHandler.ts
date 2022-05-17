export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers = {
    get(target, key, receiver) {
        if(key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }
        // 这里可以监控到用户取值了
        return Reflect.get(target, key, receiver); // 改变this指向， receiver是指proxy
    },
    set(target, key, value, receiver) {
        // 这里可以监控到用户设值了
        return Reflect.set(target, key, value, receiver);
    }
}