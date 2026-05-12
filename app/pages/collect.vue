<template>
    <div class="collect">
        <div class="collect-header">
            <div class="collect-title">
                <i class="el-icon-collection-tag" style="color: #ff6700;"></i>
                我的收藏
            </div>
        </div>
        <div class="content">
            <div class="goods-list" v-if="collectList.length>0">
                <MyList :list="collectList" :isDelete="true"></MyList>
            </div>
            <!-- 收藏列表为空的时候显示的内容 -->
            <div v-else class="collect-empty">
                <div class="empty">
                    <h2>您的收藏还是空的！</h2>
                    <p>快去购物吧！</p>
                </div>
            </div>
            <!--  收藏列表为空的时候显示的内容END -->
        </div>
    </div>
</template>
<script setup>
import { userStore } from '~/store/user';
import { request } from '~/utils/request';
const net = request();

const userInfo = userStore();

const collectList = ref([]);
const { data } = await useAsyncData('collectInfo', async () => {
    let list = [];
    let res = await net.post('/api/user/collect/getCollect', {
        body: {
            user_id: userInfo.getUser.user_id
        }
    })
    if(res.code === '001') {
        list = res.collectList;
    }
    console.log('res.code', list);
    return {
        list
    }
})
watch(data, (newVal) => {
    console.log('-----newVal-----', newVal);
    collectList.value = newVal.list;
}, {
    deep: true,
    immediate: true
})
// const { data } = await useFetch('/api/user/collect/getCollect', {
//     method: 'POST',
//     body: {
//         user_id: userInfo.getUser.user_id
//     }
// });
</script>
<style>
 .collect {
  background-color: #f5f5f5;
}
.collect .collect-header {
  height: 64px;
  background-color: #fff;
  border-bottom: 2px solid #ff6700;
}
.collect .collect-header .collect-title {
  width: 1225px;
  margin: 0 auto;
  height: 64px;
  line-height: 58px;
  font-size: 28px;
}
.collect .content {
  padding: 20px 0;
  width: 1225px;
  margin: 0 auto;
}
.collect .content .goods-list {
  margin-left: -13.7px;
  overflow: hidden;
}
/* 收藏列表为空的时候显示的内容CSS */
.collect .collect-empty {
  width: 1225px;
  margin: 0 auto;
}
.collect .collect-empty .empty {
  height: 300px;
  padding: 0 0 130px 558px;
  margin: 65px 0 0;
  background: url(../assets/imgs/cart-empty.png) no-repeat 124px 0;
  color: #b0b0b0;
  overflow: hidden;
}
.collect .collect-empty .empty h2 {
  margin: 70px 0 15px;
  font-size: 36px;
}
.collect .collect-empty .empty p {
  margin: 0 0 20px;
  font-size: 20px;
}
/* 收藏列表为空的时候显示的内容CSS END */   
</style>