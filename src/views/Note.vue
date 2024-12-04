<template>
  <div>
    <NotionRenderer :blockMap="blockMaps" />
  </div>

  
</template>

<script setup>

// 현재 사용 안함 
import { ref, onMounted } from 'vue';
import { getPageBlocks,NotionRenderer } from 'vue-notion';
import { useRoute } from 'vue-router';

const route = useRoute();
const blockMaps = ref(null);

onMounted(async () => {
  const pageId = route.params.id;
  console.log(pageId);

  getPageBlocks(pageId).then(
  (value) => (blockMaps.value = value));

});
</script>

<style>



</style>
