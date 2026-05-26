export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('lazy', {
        mounted(el, binding) {
            el.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
            function loadImg() {
                el.src = binding.value;
            }
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting) {
                        loadImg();
                        observer.unobserve(entry.target);
                    }
                })
            }, options);
            observer.observe(el);
            el._observer = observer;
        },
        unmounted(el) {
            if(!el._observer) return;
                el._observer.disconnect();
                delete el._observer;
            },
        })
})