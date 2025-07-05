<template>
  <div>
    <el-divider content-position="left">
      <el-icon>
        <i-ep-cpu />
      </el-icon>
      Satori 协议
    </el-divider>
    <el-row :gutter="20" class="satori-row">
      <el-col :span="8">
        <el-form-item>
          <template #label>启用 Satori</template>
          <el-switch v-model="form.enable" style="width: 100%;" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <template #label>Satori 端口</template>
          <el-input-number v-model="form.port" :min="1" :max="65535" style="width: 100%;" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="satori-row">
      <el-col :span="20">
        <el-form-item>
          <template #label>Satori Token</template>
          <el-input v-model="form.token" placeholder="Satori Token" clearable style="width: 100%;" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ modelValue: any }>()
const emit = defineEmits(['update:modelValue'])
const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
<style scoped>
.satori-row {
  margin-bottom: 18px;
}
</style> 