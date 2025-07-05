<template>
  <el-dialog
    v-model="visibleLocal"
    title="请输入 WebUI 密码"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="350px"
    @close="$emit('close')"
  >
    <el-input
      v-model="tokenInputLocal"
      placeholder="请输入密码"
      show-password
      @keyup.enter="$emit('confirm')"
      :disabled="loading"
    />
    <div v-if="error" style="color: red; margin-top: 8px;">{{ error }}</div>
    <template #footer>
      <el-button @click="$emit('confirm')" type="primary" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps({
  visible: Boolean,
  tokenInput: String,
  loading: Boolean,
  error: String
})
const emit = defineEmits(['update:visible', 'update:tokenInput', 'confirm', 'close'])
const tokenInputLocal = ref(props.tokenInput)
watch(() => props.tokenInput, v => tokenInputLocal.value = v)
watch(tokenInputLocal, v => emit('update:tokenInput', v))
const visibleLocal = ref(props.visible)
watch(() => props.visible, v => visibleLocal.value = v)
watch(visibleLocal, v => emit('update:visible', v))
</script> 