<template>
  <div id="myList" class="myList" v-if="props.list">
    <ul>
      <li v-for="item in props.list" :key="item.product_id">
        <el-popover placement="top">
          <p>确定删除吗？</p>
          <div style="text-align: right; margin: 10px 0 0">
            <el-button type="primary" size="small" @click="deleteCollect(item.product_id)">确定</el-button>
          </div>
          <template #reference>
            <!-- <i class="el-icon-close delete" v-show="isDelete"></i> -->
            <el-icon class="delete" v-show="isDelete"><Close /></el-icon>
          </template>
        </el-popover>
        <nuxt-link :to="{ path: '/goods/details', query: {productID:item.product_id} }">
          <img :src="$target +item.product_picture" alt />
          <h2>{{item.product_name}}</h2>
          <h3>{{item.product_title}}</h3>
          <p>
            <span>{{item.product_selling_price}}元</span>
            <span
              v-show="item.product_price != item.product_selling_price"
              class="del"
            >{{item.product_price}}元</span>
          </p>
        </nuxt-link>
      </li>
      <li v-show="isMore && props.list.length>=1" id="more">
        <nuxt-link :to="{ path: '/goods', query: {categoryID:categoryID} }">
          浏览更多
          <i class="el-icon-d-arrow-right"></i>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { Close } from '@element-plus/icons-vue';
import { userStore } from '~/store/user';
import { request } from '~/utils/request.js';
const net = request();
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  isMore: {
    type: Boolean,
    default: false
  },
  isDelete: {
    type: Boolean,
    default: false
  }
});
const userstore = userStore();
const { getUser } = storeToRefs(userstore);
const runtimeConfig = useRuntimeConfig();

const $target = computed(() => runtimeConfig.public.baseUrl+'/');
// console.log(props.list);
const categoryID = computed(() => {
    let categoryID = [];
    if (props.list != "") {
        for (let i = 0; i < props.list.length; i++) {
            const id = props.list[i].category_id;
            if (!categoryID.includes(id)) {
                categoryID.push(id);
            }
        }
    }
    return categoryID;
})

async function deleteCollect(product_id) {
    let res = await net('/api/user/collect/deleteCollect', {
        method: 'POST',
        body: {
            user_id: getUser.value.user_id,
            product_id: product_id
        }
    })
    switch (res.code) {
        case "001":
            // 删除成功
            // 删除删除列表中的该商品信息
            for (let i = 0; i < props.list.length; i++) {
                const temp = props.list[i];
                if (temp.product_id == product_id) {
                    props.list.splice(i, 1);
                }
            }
            // 提示删除成功信息
            ElNotification.success(res.msg);
            break;
        default:
            // 提示删除失败信息
            ElNotification.error(res.msg);
    }
}
</script>
<style scoped>
.myList ul li {
  z-index: 1;
  float: left;
  width: 231px;
  height: 280px;
  padding: 10px 0;
  margin: 0 0 14.5px 13.7px;
  background-color: white;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  position: relative;
}
.myList ul li:hover {
  z-index: 2;
  -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  -webkit-transform: translate3d(0, -2px, 0);
  transform: translate3d(0, -2px, 0);
}
.myList ul li img {
  display: block;
  width: 160px;
  height: 160px;
  background: url("../assets/imgs/placeholder.png") no-repeat 50%;
  margin: 0 auto;
}
.myList ul li h2 {
  margin: 25px 10px 0;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.myList ul li h3 {
  margin: 5px 10px;
  height: 18px;
  font-size: 12px;
  font-weight: 400;
  color: #b0b0b0;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.myList ul li p {
  margin: 10px 10px 10px;
  text-align: center;
  color: #ff6700;
}
.myList ul li p .del {
  margin-left: 0.5em;
  color: #b0b0b0;
  text-decoration: line-through;
}
.myList #more {
  text-align: center;
  line-height: 280px;
}
.myList #more a {
  font-size: 18px;
  color: #333;
}
.myList #more a:hover {
  color: #ff6700;
}
.myList ul li .delete {
  position: absolute;
  top: 10px;
  right: 10px;
  display: none;
}
.myList ul li:hover .delete {
  display: block
}
.myList ul li .delete:hover {
  color: #ff6700;
}
</style>