<template>
    <div class="home" id="home" name="home">
        <!-- 轮播图 -->
        <ClientOnly>
            <div class="block">
                <el-carousel height="460px">
                    <el-carousel-item v-for="item in carousel" :key="item.carousel_id">
                        <img style="height:460px;" :src="$target + item.imgPath" :alt="item.describes" />
                    </el-carousel-item>
                </el-carousel>
            </div>
        </ClientOnly>
        <!-- 轮播图END -->
        <div class="main-box">
            <div class="main">
                <!-- 手机商品展示区域 -->
                <div class="phone">
                    <div class="box-hd">
                        <div class="title">手机</div>
                    </div>
                    <div class="box-bd">
                        <div class="promo-list">
                            <nuxt-link to>
                                <img :src="$target +'public/imgs/phone/phone.png'" />
                            </nuxt-link>
                        </div>
                        <div class="list">
                            <MyList :list="phoneList" :isMore="true"></MyList>
                        </div>
                    </div>
                </div>
                <!-- 手机商品展示区域END -->

                <!-- 家电商品展示区域 -->
                <div class="appliance" id="promo-menu">
                    <div class="box-hd">
                        <div class="title">家电</div>
                        <div class="more" id="more">
                            <MyMenu :val="2" @fromChild="getChildMsg">
                                <template #1>
                                    <span>热门</span>
                                </template>
                                <template #2>
                                    <span>电视影音</span>
                                </template>
                            </MyMenu>
                        </div>
                    </div>
                <div class="box-bd">
                    <div class="promo-list">
                        <ul>
                            <li>
                                <img :src="$target +'public/imgs/appliance/appliance-promo1.png'" />
                            </li>
                            <li>
                                <img :src="$target +'public/imgs/appliance/appliance-promo2.png'" />
                            </li>
                        </ul>
                    </div>
                    <div class="list">
                        <MyList :list="applianceList" :isMore="true"></MyList>
                    </div>
                </div>
            </div>
            <!-- 家电商品展示区域END -->
            <!-- 配件商品展示区域 -->
            <div class="accessory" id="promo-menu">
                <div class="box-hd">
                    <div class="title">配件</div>
                    <div class="more" id="more">
                        <MyMenu :val="3" @fromChild="getChildMsg2">
                            <template #1>
                                <span>热门</span>
                            </template>
                            <template #2>
                                <span>保护套</span>
                            </template>
                            <template #3>
                                <span>充电器</span>
                            </template>
                        </MyMenu>
                    </div>
                </div>
                <div class="box-bd">
                    <div class="promo-list">
                        <ul>
                            <li>
                            <img :src="$target +'public/imgs/accessory/accessory-promo1.png'" alt />
                            </li>
                            <li>
                            <img :src="$target +'public/imgs/accessory/accessory-promo2.png'" alt />
                            </li>
                        </ul>
                    </div>
                    <div class="list">
                        <MyList :list="accessoryList" :isMore="true"></MyList>
                    </div>
                </div>
            </div>
        </div>
        <!-- 配件商品展示区域END -->
    </div>
  </div>
</template>
<script setup>
defineOptions({
    name: 'IndexPage'
})
import { request } from '~/utils/request.js';
const net = request();
// const instance = getCurrentInstance();
const runtimeConfig = useRuntimeConfig();
// console.log('import.meta.client', '');

const $target = computed(() => runtimeConfig.public.baseUrl+'/');
// const $target = 'http://localhost:3000';

// const $target = ;
// console.log('target', process.env);
const state = reactive({
    phoneList: '',
    miTvList: '',
    protectingShellList: '',
    chargerList: '',
    applianceList: '',
    accessoryList: ''
})
const applianceList = ref('');
const applianceHotList = ref('');
const accessoryList = ref('');
const accessoryHotList = ref('');
const applianceActive = ref('');
watch(applianceActive, (val) => {
    if (applianceHotList.value == "") {
        applianceHotList.value = applianceListcpt.value;
    }
    if (val == 1) {
    // 1为热门商品
        applianceList.value = applianceHotList.value;
        return;
    }
    if (val == 2) {
    // 2为电视商品
        applianceList.value = miTvList.value;
        return;
    }
})
const accessoryActive = ref('');
watch(accessoryActive, (val) => {
    if (accessoryHotList.value == "") {
        accessoryHotList.value = accessoryListcpt.value;
    }
    if (val == 1) {
        // 1为热门商品
        accessoryList.value = accessoryHotList.value;
        return;
    }
    if (val == 2) {
        // 2为保护套商品
        accessoryList.value = protectingShellList.value;
        return;
    }
    if (val == 3) {
        //3 为充电器商品
        accessoryList.value = chargerList.value;
        return;
    }
})
async function getPromo(categoryName, api = '/api/product/getPromoProduct') {
    try {
        let res = await net(api, {
            method: 'POST',
            body: {
                categoryName
            }
        })
        return res.Product;
    } catch (error) {
        console.log(error);
        return [];
    }
}
let { data, error, penging } = await useAsyncData('home-page-data', async ({signal}) => {
    const [
        carouselRes,
        phoneList,
        miTvList,
        protectingShellList,
        chargerList,
        applianceList,
        accessoryList
    ] = await Promise.all([
        net.post('/api/resources/carousel', { signal }),
        getPromo("手机"),
        getPromo("电视机"),
        getPromo("保护套"),
        getPromo("充电器"),
        getPromo(["电视机", "空调", "洗衣机"], "/api/product/getHotProduct"),
        getPromo(["保护套", "保护膜", "充电器", "充电宝"], "/api/product/getHotProduct")
    ])
    return {
        carousel: carouselRes.carousel,
        phoneList,
        miTvList,
        protectingShellList,
        chargerList,
        applianceList,
        accessoryList
    }
});
const phoneList = computed(() => data.value?.phoneList || []);
const miTvList = computed(() => data.value?.miTvList || []);
const protectingShellList = computed(() => data.value?.protectingShellList || []);
const chargerList = computed(() => data.value?.chargerList || []);
const applianceListcpt = computed(() => data.value?.applianceList || []);
const accessoryListcpt = computed(() => data.value?.accessoryList || []);
const carousel = computed(() => data.value?.carousel || []);
watch(data, (newVal) => {
    // console.log("newVal", newVal);
    accessoryList.value = newVal?.accessoryList || [];
    applianceList.value = newVal?.applianceList || [];
}, {
    deep: true,
    immediate: true
})
// 获取家电模块子组件传过来的数据
function getChildMsg(val) {
    applianceActive.value = val;
}
// 获取配件模块子组件传过来的数据
function getChildMsg2(val) {
    accessoryActive.value = val;
}
</script>
<style scoped>
@import "../assets/css/index.css";
</style>