<template>
  <div class="myMenu" id="myMenu">
    <ul>
      <li
        v-for="item in val"
        :key="item"
        :class="activeClass == item ? 'active':''"
        @mouseover="mouseover($event,item)"
      >
        <nuxt-link to>
          <slot :name="item"></slot>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script setup>
const props = defineProps(["val"]);
const emits = defineEmits(["fromChild"]);

const activeClass = ref(1);
watch(activeClass, (newVal, oldVal) => {
    emits("fromChild", newVal);
})

// 通过mouseover事件控制当前显示的商品分类，1为该类别的热门商品
function mouseover(e, val) {
    activeClass.value = val;
}
</script>
<style scoped>
#myMenu li {
  float: left;
  margin-left: 30px;
}

#myMenu a:hover {
  color: #ff6700;
  border-bottom: 2px solid #ff6700;
}

#myMenu .active a {
  color: #ff6700;
  border-bottom: 2px solid #ff6700;
}
</style>