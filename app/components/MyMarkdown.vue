<template>
  <div id="my-markdown" class="markdown-body">
    <MDC :value="md" tag="article" />
  </div>
</template>
<script setup>
import { request } from '~/utils/request';
const net = request();

const md = ref('');
let { data } = await useFetch('/api/public/docs/README.md', {
    method: 'GET',
    $fetch: net
})
console.log(data);
md.value = data.value
</script>
<style>
@import "../assets/css/github-markdown.css";
.markdown-body {
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 40px;
}
</style>