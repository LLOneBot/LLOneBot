<template>
  <div>
    <el-divider content-position='left'>
      OneBot 11 协议
    </el-divider>
    <el-row :gutter='16'>
      <el-col :span='12'>
        <el-form-item label='启用 OneBot 11'>
          <el-switch v-model='form.enable'/>
        </el-form-item>
      </el-col>
      <el-col :span='12'>
        <el-form-item label='OneBot 11 Token'>
          <el-input v-model='form.token' show-password placeholder='请输入 Token' clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <div v-if="form.enable">
    <el-row :gutter='16'>
      <el-col :span='12'>
        <el-form-item label='启用正向 WS 服务'>
          <el-switch v-model='form.enableWs' />
        </el-form-item>
      </el-col>
      <el-col :span='12'>
        <el-form-item label='正向 WS 端口'>
          <el-input-number v-model='form.wsPort' :min='1' :max='65535' />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter='16'>
      <el-col :span='12'>
        <el-form-item label='启用反向 WS 服务'>
          <el-switch v-model='form.enableWsReverse' />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label='反向 WS 地址'>
      <el-input
        v-model=wsReverseUrlInputting
        placeholder='输入后回车添加'
        @keyup.enter='saveWsReverseUrlInputting'
        clearable
      />
      <div class='tag-list'>
        <el-tag
          v-for='(url, idx) in form.wsReverseUrls'
          :key='url'
          closable
          @close="()=>removeWsReverseUrl(idx)"
          style='margin-right: 4px; margin-top: 4px;'
        >{{ url }}
        </el-tag>
      </div>
    </el-form-item>
    <el-row :gutter='16'>
      <el-col :span='12'>
        <el-form-item label='启用 HTTP 服务'>
          <el-switch v-model='form.enableHttp' />
        </el-form-item>
      </el-col>
      <el-col :span='12'>
        <el-form-item label='HTTP 端口'>
          <el-input-number v-model='form.httpPort' :min='1' :max='65535' />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter='16'>
      <el-col :span='12'>
        <el-form-item label='启用 HTTP 上报'>
          <el-switch v-model='form.enableHttpPost' />
        </el-form-item>
      </el-col>
      <el-col :span='12'>
        <el-form-item label='启用 HTTP 心跳'>
          <el-switch v-model='form.enableHttpHeart' />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label='HTTP 上报地址'>
      <el-input
        v-model='httpPostUrlInputting'
        placeholder='输入后回车添加'
        @keyup.enter='saveHttpPostUrlInputting'
        clearable
      />
      <div class='tag-list'>
        <el-tag
          v-for='(url, idx) in form.httpPostUrls'
          :key='url'
          closable
          @close="()=>removeHttpPostUrl(idx)"
          style='margin-right: 4px; margin-top: 4px;'
        >{{ url }}
        </el-tag>
      </div>
    </el-form-item>
    <el-form-item label='HTTP 上报密钥'>
      <el-input v-model='form.httpSecret' show-password placeholder='请输入密钥' clearable />
    </el-form-item>
    <el-divider content-position='left'>
      上报消息设置
    </el-divider>
    <el-row :gutter='16'>
      <el-col :span='12'>
        <el-form-item label='消息上报格式'>
          <el-radio-group v-model='form.messagePostFormat'>
            <el-radio label='array'>消息段</el-radio>
            <el-radio label='string'>CQ码</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span='12'>
        <el-form-item label='上报自己发出的消息'>
          <el-switch v-model='form.reportSelfMessage' />
        </el-form-item>
      </el-col>
    </el-row>
    </div>
  </div>
</template>
<script setup lang='ts'>
import { computed, ref, watch } from 'vue'
import { OB11Config } from '@common/types'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: Object, required: true },
})
const wsReverseUrlInputting = ref()
const httpPostUrlInputting = ref()
const form = computed({
  get: () => props.modelValue,
  set: v => form.value = v,
})

function saveWsReverseUrlInputting() {
  const wsVal = wsReverseUrlInputting.value?.trim()
  if (wsVal) {
    if (!/^wss?:\/\//.test(wsVal)) {
      ElMessage.error('反向WS地址必须以 ws:// 或 wss:// 开头')
      return false
    }
    if (!form.value.wsReverseUrls.includes(wsVal)) {
      form.value.wsReverseUrls.push(wsVal)
    }
    wsReverseUrlInputting.value = ''
  }
  return true
}

function removeWsReverseUrl(idx: number) {
  form.value.wsReverseUrls.splice(idx, 1)
}

function saveHttpPostUrlInputting() {
  const httpVal = httpPostUrlInputting.value?.trim()
  if (httpVal) {
    if (!/^https?:\/\//.test(httpVal)) {
      ElMessage.error('HTTP上报地址必须以 http:// 或 https:// 开头')
      return false
    }
    if (!form.value.httpPostUrls.includes(httpVal)) {
      form.value.httpPostUrls.push(httpVal)
    }
    httpPostUrlInputting.value = ''
  }
  return true
}

function removeHttpPostUrl(idx: number) {
  form.value.httpPostUrls.splice(idx, 1)
}

defineExpose({
  saveInputting: ()=>{
    return saveWsReverseUrlInputting() && saveHttpPostUrlInputting()
  }
})

</script>
<style scoped>
.tag-list {
  margin-top: 4px;
}
</style>
