import { createVNode, render } from "vue";

export function useCreateAsyncComponent(
    loader,
    instance,
    props = {},
    parent = null
) {
    if (process.server) return { vnode: null, destroy: () => {} }
    // const instance = getCurrentInstance();
    // if (!instance) {
    //     console.error('必须在 setup 内部调用！')
    //     return { destroy: () => {} }
    // }
    const asyncComponent = defineAsyncComponent(loader);

    const vnode = createVNode(asyncComponent, props);
    const container = document.createElement('div');
    console.log(container);
    if(parent) {
        parent.appendChild(container);
    }else {
        document.body.appendChild(container);
    }
    vnode.appContext = instance.appContext;
    render(vnode, container);
    const destroy = () => {
        instance = null;
        render(null, container);
        container.remove();
    }
    return {
        vnode,
        destroy
    }
}