<template>
    <div id="details">
        <!-- 头部 -->
        <div class="page-header">
            <div class="title">
                <p>{{productDetails.product_name}}</p>
                <div class="list">
                    <ul>
                        <li>
                            <nuxt-link to>概述</nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to>参数</nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to>用户评价</nuxt-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 头部END -->

        <!-- 主要内容 -->
        <div class="main">
            <!-- 左侧商品轮播图 -->
            <div class="block">
                <el-carousel height="560px" v-if="productPicture.length>1">
                    <el-carousel-item v-for="item in productPicture" :key="item.id">
                        <img style="height:560px;" :src="$target + item.product_picture" :alt="item.intro" />
                    </el-carousel-item>
                </el-carousel>
                <div v-if="productPicture.length==1">
                    <img
                        style="height:560px;"
                        :src="$target + productPicture[0].product_picture"
                        :alt="productPicture[0].intro"
                    />
                </div>
            </div>
            <!-- 左侧商品轮播图END -->

            <!-- 右侧内容区 -->
            <div class="content">
                <h1 class="name">{{productDetails.product_name}}</h1>
                <p class="intro">{{productDetails.product_intro}}</p>
                <p class="store">小米自营</p>
                <div class="price">
                    <span>{{productDetails.product_selling_price}}元</span>
                    <span
                        v-show="productDetails.product_price != productDetails.product_selling_price"
                        class="del"
                    >{{productDetails.product_price}}元</span>
                </div>
                <div class="pro-list">
                    <span class="pro-name">{{productDetails.product_name}}</span>
                    <span class="pro-price">
                        <span>{{productDetails.product_selling_price}}元</span>
                        <span
                        v-show="productDetails.product_price != productDetails.product_selling_price"
                        class="pro-del"
                        >{{productDetails.product_price}}元</span>
                    </span>
                    <p class="price-sum">总计 : {{productDetails.product_selling_price}}元</p>
                </div>
                <!-- 内容区底部按钮 -->
                <div class="button">
                    <el-button class="shop-cart" :disabled="dis" @click="addShoppingCart">加入购物车</el-button>
                    <el-button class="like" @click="addCollect">喜欢</el-button>
                </div>
                <!-- 内容区底部按钮END -->
                <div class="pro-policy">
                    <ul>
                        <li>
                            <i class="el-icon-circle-check"></i> 小米自营
                        </li>
                        <li>
                            <i class="el-icon-circle-check"></i> 小米发货
                        </li>
                        <li>
                            <i class="el-icon-circle-check"></i> 7天无理由退货
                        </li>
                        <li>
                            <i class="el-icon-circle-check"></i> 7天价格保护
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 右侧内容区END -->
        </div>
        <!-- 主要内容END -->
    </div>
</template>
<script setup>
import { useCreateAsyncComponent } from '~/composables/createAsyncComponent';
import { shoppingCartStore } from '~/store/shoppingCart';
import { userStore } from '~/store/user';
import { request } from '~/utils/request';
const route = useRoute();
const shopCartInfo = shoppingCartStore();
const userInfo = userStore();
// console.log(userInfo.getUser.user_id);
const net  = request();
const runtimeConfig = useRuntimeConfig();
const $target = computed(() => runtimeConfig.public.baseUrl+'/');
const instance = getCurrentInstance();
const asyncLoginComponent = ref(null);

const dis = ref(false) // 控制“加入购物车按钮是否可用”
const productID = ref("") // 商品id
watch(productID, (val) => {
    getDetails(val);
    getDetailsPicture(val);
})
const productDetails = ref("") // 商品详细信息
const productPicture = ref("") // 商品图片

async function getDetails(val) {
    let res = await net.post('/api/product/getDetails', {
        body: {
            productID: val
        }
    })
    productDetails.value = res.Product[0];
}
async function getDetailsPicture(val) {
    let res = await net.post('/api/product/getDetailsPicture', {
        body: {
            productID: val
        }
    })
    productPicture.value = res.ProductPicture;
}
async function addShoppingCart() {
    if (!userInfo.getUser) {
        userInfo.setShowLogin(true);
        createComponent();
        return;
    }
    let res = await net.post('/api/user/shoppingCart/addShoppingCart', {
        body: {
            user_id: userInfo.getUser.user_id,
            product_id: productID.value
        }
    })
    switch(res.code) {
        case "001":
            // 新加入购物车成功
            shopCartInfo.unshiftShoppingCart(res.shoppingCartData[0]);
            // ElNotification.success(res.msg);
            await useElNotification.success(res.msg);
            break;
        case "002":
            // 该商品已经在购物车，数量+1
            shopCartInfo.addShoppingCartNum(productID.value);
            // ElNotification.success(res.msg);
            await useElNotification.success(res.msg);
            break;
        case "003":
            // 商品数量达到限购数量
            dis.value = true;
            // ElNotification.error(res.msg);
            await useElNotification.error(res.msg);
            break;
        default:
            // ElNotification.error(res.msg);
            await useElNotification.error(res.msg);
    }
}
async function addCollect() {
    if (!userInfo.getUser) {
        userInfo.setShowLogin(true);
        createComponent();
        return;
    }
    let res = await net.post('/api/user/collect/addCollect', {
        body: {
            user_id: userInfo.getUser.user_id,
            product_id: productID.value
        }
    })
    if (res.code == "001") {
        // 添加收藏成功
        ElNotification.success(res.msg);
    } else {
        // 添加收藏失败
        ElNotification.error(res.msg);
    }
}
function createComponent() {
    if(!asyncLoginComponent.value) {
        asyncLoginComponent.value = useCreateAsyncComponent(
            () => import("~/components/MyLogin.vue"),
            instance
        );
    }
}

onActivated(() => {
    if (route.query.productID != undefined) {
        productID.value = route.query.productID;
    }
})
onBeforeUnmount(() => {
    asyncLoginComponent.value && asyncLoginComponent.value.destroy();
})
</script>
<style scoped>
/* 头部CSS */
#details .page-header {
  height: 64px;
  margin-top: -20px;
  z-index: 4;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  -webkit-box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
}
#details .page-header .title {
  width: 1225px;
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  font-weight: 400;
  color: #212121;
  margin: 0 auto;
}
#details .page-header .title p {
  float: left;
}
#details .page-header .title .list {
  height: 64px;
  float: right;
}
#details .page-header .title .list li {
  float: left;
  margin-left: 20px;
}
#details .page-header .title .list li a {
  font-size: 14px;
  color: #616161;
}
#details .page-header .title .list li a:hover {
  font-size: 14px;
  color: #ff6700;
}
/* 头部CSS END */

/* 主要内容CSS */
#details .main {
display: flex;
align-items: center;
justify-content: center;
width: 100%;
  /* width: 1225px; */
  /* height: 560px; */
  padding-top: 30px;
  /* margin: 0 auto; */
}
#details .main .block {
  /* float: left; */
  width: 560px;
  height: 560px;
}
#details .el-carousel .el-carousel__indicator .el-carousel__button {
  background-color: rgba(163, 163, 163, 0.8);
}
#details .main .content {
  /* float: left; */
  margin-left: 25px;
  width: 640px;
}
#details .main .content .name {
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  font-weight: normal;
  color: #212121;
}
#details .main .content .intro {
  color: #b0b0b0;
  padding-top: 10px;
}
#details .main .content .store {
  color: #ff6700;
  padding-top: 10px;
}
#details .main .content .price {
  display: block;
  font-size: 18px;
  color: #ff6700;
  border-bottom: 1px solid #e0e0e0;
  padding: 25px 0 25px;
}
#details .main .content .price .del {
  font-size: 14px;
  margin-left: 10px;
  color: #b0b0b0;
  text-decoration: line-through;
}
#details .main .content .pro-list {
  background: #f9f9fa;
  padding: 30px 60px;
  margin: 50px 0 50px;
}
#details .main .content .pro-list span {
  line-height: 30px;
  color: #616161;
}
#details .main .content .pro-list .pro-price {
  float: right;
}
#details .main .content .pro-list .pro-price .pro-del {
  margin-left: 10px;
  text-decoration: line-through;
}
#details .main .content .pro-list .price-sum {
  color: #ff6700;
  font-size: 24px;
  padding-top: 20px;
}
#details .main .content .button {
  height: 55px;
  margin: 10px 0 20px 0;
}
#details .main .content .button .el-button {
  float: left;
  height: 55px;
  font-size: 16px;
  color: #fff;
  border: none;
  text-align: center;
}
#details .main .content .button .shop-cart {
  width: 340px;
  background-color: #ff6700;
}
#details .main .content .button .shop-cart:hover {
  background-color: #f25807;
}

#details .main .content .button .like {
  width: 260px;
  margin-left: 40px;
  background-color: #b0b0b0;
}
#details .main .content .button .like:hover {
  background-color: #757575;
}
#details .main .content .pro-policy li {
  float: left;
  margin-right: 20px;
  color: #b0b0b0;
}
/* 主要内容CSS END */
</style>