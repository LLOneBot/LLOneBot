<template>
  <div>
    <el-divider content-position="left">
      OneBot 11 协议
    </el-divider>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item label="启用 OneBot 11">
          <el-switch v-model="form.enable" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="OneBot 11 Token">
          <el-input v-model="form.token" placeholder="请输入 Token" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item label="启用正向 WS 服务">
          <el-switch v-model="form.enableWs" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="正向 WS 端口">
          <el-input-number v-model="form.wsPort" :min="1" :max="65535" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item label="启用反向 WS 服务">
          <el-switch v-model="form.enableWsReverse" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="反向 WS 地址">
      <el-input
        v-model="wsReverseUrlInputLocal"
        placeholder="输入后回车添加"
        @keyup.enter="$emit('addWsReverseUrl', wsReverseUrlInputLocal)"
        clearable
      />
      <div class="tag-list">
        <el-tag
          v-for="(url, idx) in form.wsReverseUrls"
          :key="url"
          closable
          @close="$emit('removeWsReverseUrl', idx)"
          style="margin-right: 4px; margin-top: 4px;"
        >{{ url }}
        </el-tag>
      </div>
    </el-form-item>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item label="启用 HTTP 服务">
          <el-switch v-model="form.enableHttp" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="HTTP 端口">
          <el-input-number v-model="form.httpPort" :min="1" :max="65535" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item label="启用 HTTP 上报">
          <el-switch v-model="form.enableHttpPost" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="启用 HTTP 心跳">
          <el-switch v-model="form.enableHttpHeart" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="HTTP 上报地址">
      <el-input
        v-model="httpPostUrlInputLocal"
        placeholder="输入后回车添加"
        @keyup.enter="$emit('addHttpPostUrl', httpPostUrlInputLocal)"
        clearable
      />
      <div class="tag-list">
        <el-tag
          v-for="(url, idx) in form.httpPostUrls"
          :key="url"
          closable
          @close="$emit('removeHttpPostUrl', idx)"
          style="margin-right: 4px; margin-top: 4px;"
        >{{ url }}
        </el-tag>
      </div>
    </el-form-item>
    <el-form-item label="HTTP 上报密钥">
      <el-input v-model="form.httpSecret" placeholder="请输入密钥" clearable />
    </el-form-item>
    <el-divider content-position="left">
      上报消息设置
    </el-divider>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item label="消息上报格式">
          <el-radio-group v-model="form.messagePostFormat">
            <el-radio label="array">消息段</el-radio>
            <el-radio label="string">CQ码</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="上报自己发出的消息">
          <el-switch v-model="form.reportSelfMessage" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
const props = defineProps({
  modelValue: { type: Object, required: true },
  httpPostUrlInput: { type: String, required: true },
  wsReverseUrlInput: { type: String, required: true }
})
const emit = defineEmits(['update:modelValue', 'update:httpPostUrlInput', 'update:wsReverseUrlInput', 'addHttpPostUrl', 'removeHttpPostUrl', 'addWsReverseUrl', 'removeWsReverseUrl'])
const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
const wsReverseUrlInputLocal = ref(props.wsReverseUrlInput)
watch(() => props.wsReverseUrlInput, v => wsReverseUrlInputLocal.value = v)
watch(wsReverseUrlInputLocal, v => emit('update:wsReverseUrlInput', v))
const httpPostUrlInputLocal = ref(props.httpPostUrlInput)
watch(() => props.httpPostUrlInput, v => httpPostUrlInputLocal.value = v)
watch(httpPostUrlInputLocal, v => emit('update:httpPostUrlInput', v))
defineExpose({
  syncInputs() {
    emit('update:httpPostUrlInput', httpPostUrlInputLocal.value)
    emit('update:wsReverseUrlInput', wsReverseUrlInputLocal.value)
  }
})
</script>
<style scoped>
.tag-list {
  margin-top: 4px;
}
</style> 