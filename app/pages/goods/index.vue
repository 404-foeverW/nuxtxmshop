<template>
    <div>
        
    </div>
</template>
<script setup>
import { request } from '~/utils/request.js';
const net = request();

const categoryList = ref('');
const categoryID = ref('');
const product = ref('');
const productList = ref('');
const total = ref(0);
const pageSize = ref(15);
const currentPage = ref(1);
const activeName = ref('-1');
const search = ref('');

const { data, error } = await useAsyncData('categoryList', async ({signal}) => {
    let res = await net.post('/api/product/getCategory', { signal });
    const val = {
        category_id: 0,
        category_name: "全部"
    };
    const cate = res.category;
    cate.unshift(val);
    return {
        cate
    }
})
watch(data, (newVal) => {
    categoryList.value = newVal.cate;
}, {
    deep: true,
    immediate: true
})
</script>
<style>
    
</style>