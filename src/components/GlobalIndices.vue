<template>

  <el-card class="text-card" style="max-width: 480px">
    <p v-for="o in 4" :key="o" class="text-item">{{ '주식 가격 무료 api 쓸만한거 찾는중 ' + o }}</p>
  </el-card>
  
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

import axios from 'axios';



</script>

<style scoped>
.text-card
{
  padding: 15px;
  background-color: #141414;
  color: #ffffff;
  border: 1px solid #333;
}
.text-item{
    margin-bottom: 20px;
    font-size: 24px;
}


</style>
