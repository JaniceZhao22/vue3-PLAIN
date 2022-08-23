import  { isFunction } from '@vue/shared';
import { ReactiveEffect } from './effect';


class ComputedRefImpl {
    public effect;
    public _dirty = true; // 默认取值时进行计算
    public __v_isReadonly = true;
    public _v_isRef = true;
    public _value;
    constructor( getter, public setter) {
        // 我们将用户的getter 放入effect
        this.effect = new ReactiveEffect(getter, () => {
            // 稍后依赖的属性变化就会执行此调度函数
        })
    }
    // 类中的属性访问器 底层就是Object.defineProperty
    get value() {
        if(this._dirty) {
            this._value = this.effect.run();
        }
        return this._value;
    }

    set value(newValue) {
        this.setter(newValue);
    }

}
export const computed = (getterOrOptions) => {
    let onlyGetter = isFunction(getterOrOptions);

    let getter;
    let setter;

    if (onlyGetter) {
        getter = getterOrOptions;
        setter = () => { console.warn('no set')}
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }

    return new ComputedRefImpl(getter, setter);
}

