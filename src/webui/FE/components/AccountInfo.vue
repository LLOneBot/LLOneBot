<template>
  <div class="account-info" style="margin-bottom: 12px; text-align: right;">
    {{ accountNick }} <span v-if="accountUin">({{ accountUin }})</span>
  </div>
</template>
<script setup lang="ts">
defineProps<{ accountNick: string, accountUin: string }>()
</script>
<style scoped>
.account-info {
  float: right;
  margin-top: 12px;
  font-size: 16px;
  color: #666;
}
</style> 