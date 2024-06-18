<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { output } from 'zod'

const model = defineModel({
  type: Boolean
})


const { userInfo, getUserInfo } = useUserStore()
const form = ref()

const schema = z.object({
  Email: z.string({
    required_error: '请填写邮箱'
  }).email('请填写正确的邮箱'),
  Code: z.string({
    required_error: '请填写验证码'
  }).length(4, '请填写4个字符的验证码'),
})

type Schema = output<typeof schema>

const state = reactive<{
  Email?: string
  Code?: string
}>({
  Email: undefined,
  Code: undefined,
})

effect(() => {
  state.Email = userInfo.Email
})

const toast = useToastHandle()
// 验证码发送加载
const loading = ref(false)

async function handleSuccessAndSendMSG() {
  loading.value = true
  // 验证码验证成功，发送邮件
  try {
    await userApi.sendCode({
      Email: state.Email,
      Type: 'email'
    })
    toast.success('验证码发送成功')
  } catch (err: any) {
    toast.error(err.message)
  }
  loading.value = false
}

async function verifyEmail(res: (open: boolean) => void) {
  try {
    // 验证邮箱
    await form.value.validate('Email')
    res(true)
  } catch (err: any) {
    if (!err.message.includes('Email')) {
      res(true)
    }
  }
}


async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await userApi.edit(event.data)
    await getUserInfo()
    model.value = false
  } catch (err: any) {
    toast.error(err.message)
  }
}


const { identityCheck } = useVerify()
async function onClick() {
  identityCheck(async () => {
    model.value = true
  })
}

</script>

<template>
  <UButton
    block
    class=" justify-start"
    :class="!userInfo.Email ? 'text-rose-500' : ''"
    color="gray"
    icon="i-heroicons-envelope-open"
    @click="onClick"
  >
    {{ userInfo.Email || "尚未绑定邮箱" }}
  </UButton>
  <UDashboardModal v-model="model" title="修改邮箱" description="修改用户当前邮箱" :ui="{ width: 'sm:max-w-md' }">
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4 md:space-y-6" @submit="onSubmit">
      <UFormGroup name="Email">
        <UInput v-model="state.Email" placeholder="请输入邮箱" />
      </UFormGroup>

      <UFormGroup name="Code">
        <UButtonGroup orientation="horizontal" class="w-full">
          <UInput v-model="state.Code" :maxlength="4" class="flex-1" placeholder="请输入验证码" />
          <CaptchaVerifyButton :loading="loading" @verify="verifyEmail" @success="handleSuccessAndSendMSG" />
        </UButtonGroup>
      </UFormGroup>

      <div class="flex justify-end">
        <UButton type="submit" class="px-4">
          确认
        </UButton>
      </div>
    </UForm>
  </UDashboardModal>
</template>
