<template>
    <div class="goods" id="goods" name="goods">
        <!-- 面包屑 -->
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
                <el-breadcrumb-item>全部商品</el-breadcrumb-item>
                <el-breadcrumb-item v-if="search">搜索</el-breadcrumb-item>
                <el-breadcrumb-item v-else>分类</el-breadcrumb-item>
                <el-breadcrumb-item v-if="search">{{search}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 面包屑END -->

        <!-- 分类标签 -->
        <div class="nav">
            <div class="product-nav">
                <div class="title">分类</div>
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane
                        v-for="item in categoryList"
                        :key="item.category_id"
                        :label="item.category_name"
                        :name="''+item.category_id"
                    />
                </el-tabs>
            </div>
        </div>
        <!-- 分类标签END -->

        <!-- 主要内容区 -->
        <div class="main">
            <div class="list">
                <MyList :list="product" v-if="product.length>0"></MyList>
                <div v-else class="none-product">抱歉没有找到相关的商品，请看看其他的商品</div>
            </div>
            <!-- 分页 -->
            <div class="pagination">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="pageSize"
                    :total="total"
                    @current-change="currentChange"
                ></el-pagination>
            </div>
            <!-- 分页END -->
        </div>
        <!-- 主要内容区END -->
    </div>
</template>
<script setup>
defineOptions({
    name: 'Goods',
})
import { request } from '~/utils/request.js';
const net = request();
const route = useRoute();
watch(route, (newVal) => {
    if (newVal.path == "/goods") {
        if (newVal.query.search != undefined) {
            activeName.value = "-1";
            currentPage.value = 1;
            total.value = 0;
            search.value = newVal.query.search;
        }
    }
})
const router = useRouter();

const categoryList = ref('');
const categoryID = ref('');
watch(categoryID, (newVal) => {
    getData();
    search.value = "";
})
const product = ref('');
const productList = ref('');
const total = ref(0);
const pageSize = ref(15);
const currentPage = ref(1);
const activeName = ref('-1');
watch(activeName, (newVal) => {
    if(newVal == 0) {
        categoryID.value = [];
    }
    if(newVal > 0) {
        categoryID.value = [Number(newVal)];
    }
    // 初始化商品总量和当前页码
    total.value = 0;
    currentPage.value = 1;
    // 更新地址栏链接，方便刷新页面可以回到原来的页面
    router.push({
        path: "/goods",
        query: { categoryID: categoryID.value }
    });
})
const search = ref('');
watch(search, (newVal) => {
    if(newVal != "") {
        getProductBySearch(newVal);
    }
})

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
    // getData();
}, {
    deep: true,
    immediate: true
})


function backtop() {
    const timer = setInterval(function() {
        const top = document.documentElement.scrollTop || document.body.scrollTop;
        const speed = Math.floor(-top / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
            top + speed;

        if (top === 0) {
            clearInterval(timer);
        }
    }, 20);
}
function currentChange(currentPage) {
    currentPage.value = currentPage;
    if (search.value != "") {
        getProductBySearch();
    } else {
        getData();
    }
    backtop();
}

async function getData() {
    const allUrl = "/api/product/getAllProduct"
    const cateUrl = "/api/product/getProductByCategory"
    const api = categoryID.value.length == 0 ? allUrl : cateUrl;
    let res = await net.post(api, {
        body: {
            categoryID: categoryID.value,
            currentPage: currentPage.value,
            pageSize: pageSize.value
        }
    })
    product.value = res.Product;
    total.value = res.total;
}
async function getProductBySearch() {
    let res = await net.post("/api/product/getProductBySearch", {
        body: {
            search: search.value,
            currentPage: currentPage.value,
            pageSize: pageSize.value
        }
    })
    product.value = res.Product;
    total.value = res.total;
}
function handleClick(tab, evnet) {
    activeName.value = tab.name;
}

onActivated(() => {
    console.log('-----onActivated------');
    activeName.value = '-1'; // 初始化分类列表当前选中的id为-1
    total.value = 0; // 初始化商品总量为0
    currentPage.value = 1; //初始化当前页码为1
    // 如果路由没有传递参数，默认为显示全部商品
    console.log(route.query);
    if (Object.keys(route.query).length == 0) {
        categoryID.value = [];
        activeName.value = "0";
        return;
    }
    // 如果路由传递了categoryID，则显示对应的分类商品
    if (route.query.categoryID != undefined) {
        categoryID.value = route.query.categoryID;
        if (categoryID.value.length == 1) {
            activeName.value = "" + categoryID.value[0];
        }
        return;
    }
    // 如果路由传递了search，则为搜索，显示对应的分类商品
    if (route.query.search != undefined) {
        search.value = route.query.search;
    }
})
</script>
<style scoped>
.goods {
  background-color: #f5f5f5;
}
/* 面包屑CSS */
.el-tabs--card .el-tabs__header {
  border-bottom: none;
}
.goods .breadcrumb {
  height: 50px;
  background-color: white;
}
.goods .breadcrumb .el-breadcrumb {
  width: 1225px;
  line-height: 30px;
  font-size: 16px;
  margin: 0 auto;
}
/* 面包屑CSS END */

/* 分类标签CSS */
.goods .nav {
  background-color: white;
}
.goods .nav .product-nav {
  width: 1225px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
}
.nav .product-nav .title {
  width: 50px;
  font-size: 16px;
  font-weight: 700;
  float: left;
}
/* 分类标签CSS END */

/* 主要内容区CSS */
.goods .main {
  margin: 0 auto;
  max-width: 1225px;
}
.goods .main .list {
  min-height: 650px;
  padding-top: 14.5px;
  margin-left: -13.7px;
  overflow: auto;
}
.goods .main .pagination {
  height: 50px;
  text-align: center;
}
.goods .main .none-product {
  color: #333;
  margin-left: 13.7px;
}
/* 主要内容区CSS END */   
</style>