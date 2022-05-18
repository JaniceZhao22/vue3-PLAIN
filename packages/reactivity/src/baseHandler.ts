import { track, trigger } from './effect'

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers = {
    get(target, key, receiver) {
        if(key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }
        // 收集依赖
        track(target, 'get', key);
        // 这里可以监控到用户取值了
        return Reflect.get(target, key, receiver); // 改变this指向， receiver是指proxy
    },
    set(target, key, value, receiver) {
        let oldValue = target[key];
        let result = Reflect.set(target, key, value, receiver);
        if(oldValue !== value) { // 值变化了，要更新
            trigger(target, 'set', key, value, oldValue);
        }
        // 这里可以监控到用户设值了
        return result
    }
}