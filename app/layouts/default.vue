<template>
    <div id="app" name="app">
        <el-container class="el_container_box">
            <div class="topbar">
                <div class="nav">
                    <ul>
                        <li v-if="!getUser">
                            <el-button text @click="login">登录</el-button>
                            <span class="sep">|</span>
                            <el-button text @click="isRegister(true)">注册</el-button>
                        </li>
                        <li v-else>
                            欢迎
                            <el-popover placement="top" width="180" v-model="visible">
                                <p>确定退出登录吗？</p>
                                <div style="text-align: right; margin: 10px 0 0">
                                    <el-button size="small" text @click="visible = false">取消</el-button>
                                    <el-button type="primary" size="small" @click="logout">确定</el-button>
                                </div>
                                <template #reference>
                                    <el-button text slot="reference">{{getUser.userName}}</el-button>
                                </template>
                            </el-popover>
                        </li>
                        <li>
                            <nuxt-link to="/order">我的订单</nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/collect">我的收藏</nuxt-link>
                        </li>
                        <li :class="getNum > 0 ? 'shopCart-full' : 'shopCart'">
                            <nuxt-link to="/shoppingCart">
                                <el-icon><ShoppingCart /></el-icon>购物车
                                <span class="num">({{getNum}})</span>
                            </nuxt-link>
                        </li>
                    </ul>
                </div>
            </div>
            <el-header>
                <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    active-text-color="#409eff"
                    router
                >
                    <div class="logo">
                        <nuxt-link to="/">
                        <img src="~/assets/imgs/logo.png" alt />
                        </nuxt-link>
                    </div>
                    <div class="menu_item">
                        <el-menu-item style="padding: 0 20px;" index="/" route="/">首页</el-menu-item>
                        <el-menu-item style="padding: 0 20px;" index="/goods" route="/goods">全部商品</el-menu-item>
                        <el-menu-item style="padding: 0 20px;" index="/about" route="/about">关于我们</el-menu-item>
                    </div>
                    <div class="so">
                        <el-input placeholder="请输入搜索内容" v-model="search">
                            <template #append>
                                <el-button :icon="Search" @click="searchClick"></el-button>
                            </template>
                        </el-input>
                    </div>
                </el-menu>
            </el-header>
            <el-main class="el_main_box">
                <slot></slot>
            </el-main>
            <el-footer height="fit-content">
                <div class="footer">
                    <div class="ng-promise-box">
                        <div class="ng-promise">
                        <p class="text">
                            <a class="icon1" href="javascript:;">7天无理由退换货</a>
                            <a class="icon2" href="javascript:;">满99元全场免邮</a>
                            <a class="icon3" style="margin-right: 0" href="javascript:;">100%品质保证</a>
                        </p>
                        </div>
                    </div>
                    <div class="github">
                        <a href="https://github.com/hai-27/vue-store" target="_blank">
                        <div class="github-but"></div>
                        </a>
                    </div>
                    <div class="mod_help">
                        <p>
                            <nuxt-link to="/">首页</nuxt-link>
                        <span>|</span>
                            <nuxt-link to="/goods">全部商品</nuxt-link>
                        <span>|</span>
                            <nuxt-link to="/about">关于我们</nuxt-link>
                        </p>
                        <p class="coty">商城版权所有 &copy; 2012-2021</p>
                    </div>
                </div>
            </el-footer>
        </el-container>
    </div>
</template>
<script setup>
import { Search, ShoppingCart } from '@element-plus/icons-vue';
import { userStore } from '~/store/user.js';
import { shoppingCartStore } from '~/store/shoppingCart.js';
import { request } from '~/utils/request.js';
const instance = getCurrentInstance();
const router = useRouter();
const net = request();
const route = useRoute();
const userstore = userStore();
const shoppingCart = shoppingCartStore();
const { getUser } = storeToRefs(userstore);
const { setUser, setShowLogin } = userstore;
const { getNum } = storeToRefs(shoppingCart);
const { setShoppingCart } = shoppingCart;
const asyncLoginComponent = ref(null);
const asyncRegisterComponent = ref(null);

const activeIndex = ref('');
watch(route, (newVal) => {
    activeIndex.value = newVal.path;
})
const search = ref('');
const register = ref(false);
const visible = ref(false);

console.log('----default------');

watch(getUser, async (newVal, oldVal) => {
    if (newVal === "") {
        // 用户没有登录
        setShoppingCart([]);
        return;
    }
    try {
        let res = await net('/api/user/shoppingCart/getShoppingCart', {
            method: 'POST',
            body: {
                user_id: newVal.user_id
            }
        })
        if(res.code === '001') {
            setShoppingCart(res.shoppingCartData);
        }else {
            ElNotification.error(res.msg);
        }   
    } catch (error) {
        console.log('error', error);
    }
})
function login() {
    setShowLogin(true);
    asyncLoginComponent.value = useCreateAsyncComponent(
        () => import('~/components/MyLogin.vue'),
        instance
    );
}
function logout() {
    visible.value = false;
    // 清空本地登录信息
    localStorage.setItem("user", "");
    // 清空vuex登录信息
    setUser("");
    ElNotification.success("成功退出登录");
}
function isRegister(val) {
    // console.log(val);
    register.value = val;
    if(!val) return;
    asyncRegisterComponent.value = useCreateAsyncComponent(
        () => import('~/components/MyRegister.vue'),
        instance,
        {
            register: register.value,
            onFromChild: isRegister
        }
    )
}
function searchClick() {
    if (search.value != "") {
        // 跳转到全部商品页面,并传递搜索条件
        router.push({ path: "/goods", query: { search: search.value } });
        search.value = "";
    }
}

onMounted(() => {
    // 获取浏览器localStorage，判断用户是否已经登录
    if (localStorage.getItem("user")) {
      // 如果已经登录，设置vuex登录状态
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    activeIndex.value = route.path;
})
onBeforeUnmount(() => {
    asyncLoginComponent.value && asyncLoginComponent.value.destroy();
    asyncRegisterComponent.value && asyncRegisterComponent.value.destroy();
})
// onBeforeUpdate(() => {
//     activeIndex.value = route.path;
//     // console.log(activeIndex.value);
// })
</script>
<style scoped>
/* 全局CSS */
* {
  padding: 0;
  margin: 0;
  border: 0;
  list-style: none;
}
#app .el-header {
  padding: 0;
}
#app .el-main {
  min-height: 300px;
  padding: 20px 0;
}
#app .el-footer {
  padding: 0;
}
a,
a:hover {
  text-decoration: none;
}
/* 全局CSS END */

/* 顶部导航栏CSS */
.topbar {
  height: 40px;
  background-color: #3d3d3d;
  margin-bottom: 20px;
}
.topbar .nav {
  width: 1225px;
  margin: 0 auto;
}
.topbar .nav ul {
  float: right;
}
.topbar .nav li {
  float: left;
  height: 40px;
  color: #b0b0b0;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  margin-left: 20px;
}
.topbar .nav .sep {
  color: #b0b0b0;
  font-size: 12px;
  margin: 0 5px;
}
.topbar .nav li .el-button {
  color: #b0b0b0;
}
.topbar .nav .el-button:hover {
  background-color: transparent;
  color: #fff;
}
.topbar .nav li a {
  color: #b0b0b0;
}
.topbar .nav a:hover {
  color: #fff;
}
.topbar .nav .shopCart {
  width: 120px;
  background: #424242;
}
.topbar .nav .shopCart:hover {
  background: #fff;
}
.topbar .nav .shopCart:hover a {
  color: #ff6700;
}
.topbar .nav .shopCart-full {
  width: 120px;
  background: #ff6700;
}
.topbar .nav .shopCart-full a {
  color: white;
}
/* 顶部导航栏CSS END */

/* 顶栏容器CSS */
.el-header .el-menu {
  max-width: 1225px;
  margin: 0 auto;
}
.el-header .logo {
  height: 60px;
  width: 189px;
  float: left;
  margin-right: 100px;
}
.el-header .so {
  margin-top: 10px;
  width: 300px;
  float: right;
}
/* 顶栏容器CSS END */

/* 底栏容器CSS */
.footer {
  width: 100%;
  text-align: center;
  background: #2f2f2f;
  padding-bottom: 20px;
}
.footer .ng-promise-box {
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}
.footer .ng-promise-box {
  margin: 0 auto;
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}
.footer .ng-promise-box .ng-promise p a {
  color: #fff;
  font-size: 20px;
  margin-right: 210px;
  padding-left: 44px;
  height: 40px;
  display: inline-block;
  line-height: 40px;
  text-decoration: none;
  background: url("~/assets/imgs/us-icon.png") no-repeat left 0;
}
.footer .github {
  height: 50px;
  line-height: 50px;
  margin-top: 20px;
}
.footer .github .github-but {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  background: url("~/assets/imgs/github.png") no-repeat;
}
.footer .mod_help {
  text-align: center;
  color: #888888;
}
.footer .mod_help p {
  margin: 20px 0 16px 0;
}

.footer .mod_help p a {
  color: #888888;
  text-decoration: none;
}
.footer .mod_help p a:hover {
  color: #fff;
}
.footer .mod_help p span {
  padding: 0 22px;
}
/* 底栏容器CSS END */

.menu_item {
    display: flex;
    align-items: center;
}
.el-menu-demo {
    justify-content: space-between;
}
.el_main_box {
    flex: 1;
}
/* .el_container_box {
    min-height: 100vh;
} */
/* .el-menu-demo:deep(.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover, .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus) {
    border-bottom-color: rgb(64, 158, 255);
    color: rgb(64, 158, 255);
    background-color: #fff;
} */
.el-menu-item.is-active {
    border-bottom-color: rgb(64, 158, 255);
    color: rgb(64, 158, 255);
    background-color: #fff;
    outline: initial;
    border-bottom: 2px solid #409EFF;
}
.el-menu-item {
    height: 60px;
    line-height: 60px;
    margin: 0;
    /* border-bottom: 2px solid transparent; */
    color: #909399;
    margin-bottom: 2px;
}
:deep(.el-menu--horizontal .el-menu-item:not(.is-disabled):hover, .el-menu--horizontal .el-menu-item:not(.is-disabled):focus) {
    /* border-bottom-color: rgb(64, 158, 255); */
    /* color: rgb(64, 158, 255); */
    color: #000;
    background-color: #fff;
    outline: initial;
    /* border-bottom: 2px solid #409EFF; */
}
</style>