<template>
  <div class="qq-login-container">
    <!-- QQ Logo -->
    <div class="qq-logo">
      <svg viewBox="0 0 24 24" class="qq-icon">
        <path fill="currentColor" d="M12.1 2.1c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm4.8 14.8c-.7.3-1.5.5-2.4.5s-1.7-.2-2.4-.5c-.2-.1-.3-.3-.3-.5s.1-.4.3-.5c.7-.3 1.5-.5 2.4-.5s1.7.2 2.4.5c.2.1.3.3.3.5s-.1.4-.3.5zm-9.6-7.7c0-2.7 2.2-4.9 4.9-4.9s4.9 2.2 4.9 4.9c0 .8-.2 1.6-.6 2.3-.4.7-1 1.3-1.7 1.7-.7.4-1.5.6-2.3.6s-1.6-.2-2.3-.6c-.7-.4-1.3-1-1.7-1.7-.4-.7-.6-1.5-.6-2.3z"/>
      </svg>
    </div>

    <div class="login-content">
      <!-- Quick Login Mode -->
      <div v-if="loginMode === 'quick'" class="quick-login">
        <!-- Single Account Display -->
        <div v-if="!showAccountList && selectedAccount" class="account-display" @click="toggleAccountList">
          <div class="account-avatar">
            <img :src="selectedAccount.faceUrl || '/api/placeholder/80/80'" :alt="selectedAccount.nickname" />
          </div>
          <div class="account-name">{{ selectedAccount.nickname }}</div>
          <el-icon class="dropdown-icon" :class="{ rotated: showAccountList }">
            <ArrowDown />
          </el-icon>
        </div>

        <!-- Account List -->
        <div v-else class="account-list">
          <div 
            v-for="account in accounts" 
            :key="account.uin"
            class="account-item"
            @click="selectAccount(account)"
          >
            <div class="account-avatar">
              <img :src="account.faceUrl || '/api/placeholder/60/60'" :alt="account.nickname" />
            </div>
            <div class="account-name">{{ account.nickname }}</div>
          </div>
        </div>

        <!-- Login Button -->
        <el-button 
          type="primary" 
          size="large" 
          class="login-button"
          :loading="loginLoading"
          :disabled="!selectedAccount"
          @click="handleQuickLogin"
        >
          登录
        </el-button>

        <!-- Action Links -->
        <div class="action-links">
          <el-link @click="showAddAccount = true">添加账号</el-link>
          <el-link @click="showRemoveAccount = true">移除账号</el-link>
        </div>
      </div>

      <!-- QR Code Login Mode -->
      <div v-else class="qr-login">
        <div class="qr-code-container">
          <div class="qr-code">
            <!-- QR Code placeholder - replace with actual QR code -->
            <canvas ref="qrCanvas" width="200" height="200"></canvas>
            <!-- QR Code refresh overlay if expired -->
            <div v-if="qrExpired" class="qr-refresh-overlay" @click="refreshQrCode">
              <el-icon><Refresh /></el-icon>
              <div>点击刷新</div>
            </div>
          </div>
          <!-- QQ Penguin Logo in center -->
          <div class="qr-center-logo">
            <div class="penguin-icon">🐧</div>
          </div>
        </div>
        <div class="qr-tip">请使用手机QQ扫码登录</div>
        
        <!-- QR Status Messages -->
        <div v-if="qrStatus" class="qr-status" :class="qrStatusClass">
          {{ qrStatusText }}
        </div>
      </div>

      <!-- Mode Switch Links -->
      <div class="mode-switch">
        <el-link 
          v-if="loginMode === 'quick'" 
          @click="loginMode = 'qr'"
          class="switch-link"
        >
          扫码登录
        </el-link>
        <el-link 
          v-else 
          @click="loginMode = 'quick'"
          class="switch-link"
        >
          快速登录
        </el-link>
      </div>
    </div>

    <!-- Add Account Dialog -->
    <el-dialog v-model="showAddAccount" title="添加账号" width="400px">
      <el-form :model="newAccountForm" label-width="80px">
        <el-form-item label="QQ号">
          <el-input v-model="newAccountForm.qq" placeholder="请输入QQ号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="newAccountForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddAccount = false">取消</el-button>
        <el-button type="primary" @click="addAccount">添加</el-button>
      </template>
    </el-dialog>

    <!-- Remove Account Dialog -->
    <el-dialog v-model="showRemoveAccount" title="移除账号" width="400px">
      <div>选择要移除的账号:</div>
      <div class="remove-account-list">
        <div 
          v-for="account in accounts" 
          :key="account.uin"
          class="remove-account-item"
          @click="removeAccount(account.uin)"
        >
          <img :src="account.faceUrl || '/api/placeholder/32/32'" :alt="account.nickname" class="small-avatar" />
          <span>{{ account.nickname }}</span>
          <el-icon class="remove-icon"><Close /></el-icon>
        </div>
      </div>
      <template #footer>
        <el-button @click="showRemoveAccount = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, Refresh, Close } from '@element-plus/icons-vue'
import { apiGet, apiPost } from '../utils/api'

// Define emits
const emit = defineEmits<{
  login: [loginData: { mode: 'quick' | 'qr', account?: Account }]
}>()

interface Account {
  uin: string
  uid: string
  nickname: string
  faceUrl: string
  loginType: number
  isQuickLogin: boolean
  isAutoLogin: boolean
}

interface QRCodeData {
  pngBase64QrcodeData: string
  qrcodeUrl: string
  expireTime: number
  pollTimeInterval: number
}

const loginMode = ref<'quick' | 'qr'>('quick')
const showAccountList = ref(false)
const loginLoading = ref(false)
const qrExpired = ref(false)
const qrStatus = ref('')
const qrStatusClass = ref('')

// Account management
const accounts = ref<Account[]>([])
const qrCodeData = ref<QRCodeData | null>(null)

const selectedAccount = ref<Account | null>(null)
const showAddAccount = ref(false)
const showRemoveAccount = ref(false)
const newAccountForm = ref({
  qq: '',
  password: ''
})

// QR Code related
const qrCanvas = ref<HTMLCanvasElement>()
let qrRefreshInterval: NodeJS.Timeout | null = null

const qrStatusText = computed(() => {
  switch (qrStatus.value) {
    case 'scanning':
      return '扫描成功，请在手机上确认'
    case 'success':
      return '登录成功'
    case 'expired':
      return '二维码已过期，请刷新'
    case 'error':
      return '登录失败，请重试'
    default:
      return ''
  }
})

function toggleAccountList() {
  showAccountList.value = !showAccountList.value
}

function selectAccount(account: Account) {
  selectedAccount.value = account
  showAccountList.value = false
}

async function handleQuickLogin() {
  if (!selectedAccount.value) return
  
  loginLoading.value = true
  try {
    const result = await apiPost('/api/quick-login', { uin: selectedAccount.value.uin })
    
    if (result.success) {
      ElMessage.success(`${selectedAccount.value.nickname} 登录成功`)
      emitLogin('quick', selectedAccount.value)
    } else {
      throw new Error(result.message || '登录失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败')
    console.error('Quick login error:', error)
  } finally {
    loginLoading.value = false
  }
}

function addAccount() {
  ElMessage.info('此功能需要通过QQ客户端登录来添加账号')
  showAddAccount.value = false
  newAccountForm.value = { qq: '', password: '' }
}

function removeAccount(uin: string) {
  const index = accounts.value.findIndex(acc => acc.uin === uin)
  if (index > -1) {
    const removedAccount = accounts.value.splice(index, 1)[0]
    if (selectedAccount.value?.uin === uin && accounts.value.length > 0) {
      selectedAccount.value = accounts.value[0]
    } else if (selectedAccount.value?.uin === uin) {
      selectedAccount.value = null
    }
    ElMessage.success(`已移除账号 ${removedAccount.nickname}`)
  }
  showRemoveAccount.value = false
}

async function generateQrCode() {
  if (!qrCanvas.value) return
  
  try {
    const result = await apiGet('/api/login-qrcode')
    
    if (result.success && result.data) {
      qrCodeData.value = result.data
      displayQrCode(result.data.pngBase64QrcodeData)
      
      // Set expiration timer based on server response
      const expireTime = result.data.expireTime * 1000 // Convert to milliseconds
      if (qrRefreshInterval) {
        clearInterval(qrRefreshInterval)
      }
      qrRefreshInterval = setTimeout(() => {
        qrExpired.value = true
        qrStatus.value = 'expired'
      }, expireTime)
      
      qrExpired.value = false
      qrStatus.value = ''
    } else {
      throw new Error(result.message || '获取二维码失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取二维码失败')
    console.error('QR code generation error:', error)
    // Fallback to placeholder pattern
    displayPlaceholderQrCode()
  }
}

function displayQrCode(base64Data: string) {
  if (!qrCanvas.value) return
  
  const canvas = qrCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  const img = new Image()
  img.onload = () => {
    ctx.clearRect(0, 0, 200, 200)
    ctx.drawImage(img, 0, 0, 200, 200)
  }
  img.src = base64Data
}

function displayPlaceholderQrCode() {
  if (!qrCanvas.value) return
  
  const canvas = qrCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Simple QR code pattern simulation
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 200, 200)
  ctx.fillStyle = '#fff'
  
  // Create a simple dot pattern to simulate QR code
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if (Math.random() > 0.5) {
        ctx.fillRect(i * 10, j * 10, 10, 10)
      }
    }
  }
}

async function refreshQrCode() {
  await generateQrCode()
  ElMessage.info('二维码已刷新')
}

async function fetchQuickLoginList() {
  try {
    const result = await apiGet('/api/quick-login-list')
    
    if (result.success && result.data && result.data.LocalLoginInfoList) {
      accounts.value = result.data.LocalLoginInfoList
      if (accounts.value.length > 0 && !selectedAccount.value) {
        selectedAccount.value = accounts.value[0]
      }
    } else {
      console.warn('No quick login accounts available:', result.message)
      accounts.value = []
    }
  } catch (error: any) {
    console.error('Failed to fetch quick login list:', error)
    ElMessage.error('获取快速登录列表失败')
    accounts.value = []
  }
}

function emitLogin(mode: 'quick' | 'qr', account?: Account) {
  // Emit login event to parent component
  console.log('Login attempt:', { mode, account })
  emit('login', { mode, account })
}

onMounted(async () => {
  // Fetch quick login list first
  await fetchQuickLoginList()
  
  // Generate QR code if in QR mode
  if (loginMode.value === 'qr') {
    await generateQrCode()
  }
})

onUnmounted(() => {
  if (qrRefreshInterval) {
    clearInterval(qrRefreshInterval)
  }
})

// Watch login mode changes
watch(loginMode, async (newMode) => {
  if (newMode === 'qr') {
    setTimeout(() => generateQrCode(), 100) // Delay to ensure canvas is ready
  } else if (qrRefreshInterval) {
    clearInterval(qrRefreshInterval)
  }
  
  if (newMode === 'quick' && accounts.value.length === 0) {
    await fetchQuickLoginList()
  }
})

// Close account list when clicking outside
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('.account-display') && !target.closest('.account-list')) {
    showAccountList.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.qq-login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f4fd 0%, #d4edff 50%, #c8e8ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.qq-logo {
  margin-bottom: 40px;
}

.qq-icon {
  width: 80px;
  height: 80px;
  color: #1890ff;
}

.login-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 320px;
  text-align: center;
}

/* Quick Login Styles */
.quick-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.account-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 16px;
  border-radius: 12px;
  transition: background-color 0.2s;
}

.account-display:hover {
  background-color: rgba(24, 144, 255, 0.05);
}

.account-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.account-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.account-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.dropdown-icon {
  font-size: 16px;
  color: #666;
  transition: transform 0.2s;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.account-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 20px 0;
}

.account-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.account-item:hover {
  background-color: rgba(24, 144, 255, 0.05);
  border-color: #1890ff;
}

.account-item .account-avatar {
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
}

.account-item .account-name {
  font-size: 14px;
  margin-bottom: 0;
}

.login-button {
  width: 280px;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 500;
}

.action-links {
  display: flex;
  gap: 24px;
}

.action-links .el-link {
  font-size: 14px;
}

/* QR Login Styles */
.qr-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qr-code-container {
  position: relative;
  display: inline-block;
}

.qr-code {
  position: relative;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qr-code canvas {
  display: block;
  border-radius: 8px;
}

.qr-refresh-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  border-radius: 12px;
  transition: opacity 0.2s;
}

.qr-refresh-overlay:hover {
  opacity: 0.9;
}

.qr-refresh-overlay .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.qr-center-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.penguin-icon {
  font-size: 24px;
}

.qr-tip {
  font-size: 16px;
  color: #666;
}

.qr-status {
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 6px;
}

.qr-status.scanning {
  background: #e6f7ff;
  color: #1890ff;
}

.qr-status.success {
  background: #f6ffed;
  color: #52c41a;
}

.qr-status.expired,
.qr-status.error {
  background: #fff2f0;
  color: #ff4d4f;
}

.mode-switch {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.switch-link {
  font-size: 14px;
  color: #1890ff;
}

/* Dialog Styles */
.remove-account-list {
  margin: 16px 0;
}

.remove-account-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  gap: 12px;
}

.remove-account-item:hover {
  background-color: #f5f5f5;
}

.small-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.remove-icon {
  margin-left: auto;
  color: #ff4d4f;
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-content {
    padding: 24px;
    min-width: 280px;
  }
  
  .account-list {
    grid-template-columns: 1fr;
  }
  
  .login-button {
    width: 240px;
  }
}
</style>
