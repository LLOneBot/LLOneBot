<template>
  <QQLogin v-if='showLogin' />
  <el-container v-else class='main-container'>
    <el-header class='header'>
      <h2 style='display: inline-block'>LLTwoBot {{ version }}</h2>
    </el-header>
    <el-main v-loading='loading'>
      <el-row :gutter='24' justify='center'>
        <el-col :xs='24' :sm='22' :md='20' :lg='16' :xl='12'>
          <el-card shadow='hover' class='config-card'>
            <AccountInfo :accountNick='accountNick' :accountUin='accountUin' />
            <el-menu mode='horizontal' :default-active='activeIndex' @select='handleSelect'>
              <el-menu-item index='1'>OneBot 11 配置</el-menu-item>
              <el-menu-item index='2'>Satori 配置</el-menu-item>
              <el-menu-item index='3'>其他配置</el-menu-item>
              <el-menu-item index='4'>关于</el-menu-item>
            </el-menu>
            <el-form :model='form' label-width='160px' size='large' class='config-form'>
              <Ob11ConfigForm ref='ob11ConfigFormRef' v-if="activeIndex === '1'" v-model='form.ob11' />
              <SatoriConfigForm v-if="activeIndex === '2'" v-model='form.satori' />
              <OtherConfigForm v-if="activeIndex === '3'" v-model='form' v-model:webui-token='tokenRef' />
              <About v-if="activeIndex === '4'" />
              <el-form-item class='form-actions' v-if="activeIndex != '4'">
                <el-button type='primary' @click='onSave' size='large' style='float: right' :loading='loading'>
                  保存配置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>

  <!-- Token Dialog - always rendered -->
  <TokenDialog
    v-model:visible='showTokenDialog'
    v-model:tokenInput='tokenInput'
    :loading='tokenDialogLoading'
    :error='tokenDialogError'
    @confirm='handleTokenDialogConfirm'
    @close='handleTokenDialogClose'
  />
</template>

<script setup lang='ts'>
import { ref, onMounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import AccountInfo from './components/AccountInfo.vue'
import Ob11ConfigForm from './components/Ob11ConfigForm.vue'
import SatoriConfigForm from './components/SatoriConfigForm.vue'
import OtherConfigForm from './components/OtherConfigForm.vue'
import TokenDialog from './components/TokenDialog.vue'
import { version } from '../../version'
import About from '@/components/About.vue'
import QQLogin from './components/QQLogin.vue'
import { apiFetch, getToken, setPasswordPromptHandler, setTokenStorage } from './utils/api'
import './App.css'
import { ReqConfig, ResConfig } from '../BE/types'
import { defaultConfig } from '../../common/defaultConfig'

// QQ login status
const currentUser = ref(null)
const isQQOnline = ref(false)
const showLogin = ref(false)

// Token logic
const tokenKey = 'webui_token'
const showTokenDialog = ref(false)
const tokenInput = ref('')
const tokenDialogLoading = ref(false)
const tokenDialogError = ref('')
const tokenRef = ref()
tokenRef.value = getToken()

const form = ref(JSON.parse(JSON.stringify(defaultConfig)))

const activeIndex = ref('1')
const loading = ref(false)
const accountNick = ref('')
const accountUin = ref('')

const ob11ConfigFormRef = ref()

// 弹出密码输入框，直到用户输入非空密码并点击确定/回车才resolve
async function promptPassword(tip: string): Promise<string> {
  return new Promise<string>((resolve) => {
    tokenDialogError.value = ''
    tokenInput.value = ''
    showTokenDialog.value = true
    tokenDialogError.value = tip

    async function onConfirm() {
      const pwd = tokenInput.value.trim()
      if (!pwd) {
        tokenDialogError.value = '密码不能为空'
        return
      }
      showTokenDialog.value = false
      resolve(pwd)
    }

    // 监听弹窗关闭（防止用户点ESC或X关闭）
    const stopShow = watch(showTokenDialog, (val) => {
      if (!val) {
        stopShow()
      }
    })
    // 监听确定按钮
    handleTokenDialogConfirm = onConfirm
  })
}

// 设置密码提示处理器
console.log('设置密码提示处理器')
setPasswordPromptHandler(promptPassword)

// 获取配置
async function fetchConfig() {
  try {
    loading.value = true
    const data = await apiFetch<ResConfig>('/api/config')
    if (data.success) {
      const { config, selfInfo, token } = data.data
      tokenRef.value = token
      form.value = config
      accountNick.value = selfInfo.nick || ''
      accountUin.value = selfInfo.uin || ''
      ElMessage.success('配置加载成功')
      return data.data.selfInfo.online
    }
    else {
      throw new Error(data.message || '获取配置失败')
    }
  } catch (error: any) {
    ElMessage.error(`获取配置失败: ${error.message || String(error)}`)
    console.error('获取配置失败:', error)
  } finally {
    loading.value = false
  }
  return false
}

// 保存配置
async function onSave() {
  if (ob11ConfigFormRef.value && !ob11ConfigFormRef.value.saveInputting()) {
    return
  }
  if (!tokenRef.value) {
    return ElMessage.error('WebUI 密码不能为空')
  }
  try {
    loading.value = true
    const postData: ReqConfig = {
      token: tokenRef.value,
      config: form.value,
    }
    const data = await apiFetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })
    if (data.success) {
      localStorage.setItem(tokenKey, form.value.webui.token)
      ElMessage.success('配置保存成功')
      setTokenStorage(tokenRef.value)
    }
    else {
      throw new Error(data.message || '保存配置失败')
    }
  } catch (error: any) {
    ElMessage.error(`保存配置失败: ${error.message || String(error)}`)
    console.error('保存配置失败:', error)
  } finally {
    loading.value = false
  }
}

// Login handlers
function handleLogin(loginData: any) {
  console.log('Login data received:', loginData)
  // QQ登录成功，设置状态
  if (loginData.account) {
    currentUser.value = loginData.account
    // 兼容两种昵称字段：nickname和nick
    accountNick.value = loginData.account.nickname || loginData.account.nick || ''
    accountUin.value = loginData.account.uin || ''
  }
  isQQOnline.value = true
  ElMessage.success(`${loginData.account?.nickname || loginData.account?.nick || 'QQ'} 登录成功`)

  // Load config after successful QQ login
  fetchConfig()
}

// 页面加载时检查QQ登录状态
onMounted(async () => {
  // 判断url中是否有token参数，有则设置
  const urlParams = new URLSearchParams(window.location.search)
  const urlToken = urlParams.get('token')
  console.log('URL token:', urlToken)
  if (urlToken) {
    setTokenStorage(urlToken)
    // 刷新页面去掉url中的token参数
    const newUrl = window.location.origin + window.location.pathname
    window.history.replaceState({}, document.title, newUrl)
  }
  // 等待下一个tick，确保组件完全渲染，密码处理器已设置
  await nextTick()

  // 现在检查QQ登录状态，如果没有token会自动弹出密码输入框
  const qqOnline = await fetchConfig()
  if (qqOnline) {
    showLogin.value = false
  }
  else {
    // QQ未登录，显示登录组件
    showLogin.value = true
  }
  // 如果QQ未登录，会显示QQLogin组件
})

function handleSelect(key: string) {
  activeIndex.value = key
}

// 修改handleTokenDialogConfirm为let变量，便于promptPassword里动态赋值
let handleTokenDialogConfirm = async () => {
}

function handleTokenDialogClose() {
  tokenDialogError.value = ''
  document.body.style.overflow = 'scroll'
  return true
}
</script>
