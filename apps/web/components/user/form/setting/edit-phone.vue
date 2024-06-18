<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { output } from 'zod'

const model = defineModel({
  type: Boolean
})

const user = useUserStore()

const form = ref()

const schema = z.object({
  Phone: z.string({
    required_error: '请填写手机'
  }).refine((str) => verify.phone(str), '请填写正确的手机号'),
  Code: z.string({
    required_error: '请填写验证码'
  }).length(4, '请填写4个字符的验证码'),
})

type Schema = output<typeof schema>

const state = reactive<{
  Phone?: string
  Code?: string
}>({
  Phone: undefined,
  Code: undefined,
})

effect(() => {
  state.Phone = user.userInfo.Phone
})

const toast = useToastHandle()
// 验证码发送加载
const loading = ref(false)

async function handleSuccessAndSendMSG() {
  loading.value = true
  // 验证码验证成功，发送邮件
  try {
    await userApi.sendCode({
      Phone: state.Phone,
      Type: 'phone'
    })
    toast.success('验证码发送成功')
  } catch (err: any) {
    toast.error(err.message)
  }
  loading.value = false
}

async function verifyPhone(res: (open: boolean) => void) {
  try {
    // 验证手机
    await form.value.validate('Phone')
    res(true)
  } catch (err: any) {
    if (!err.message.includes('Phone')) {
      res(true)
    }
  }
}


async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await userApi.edit(event.data)
    await user.getUserInfo()
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
    :class="!user.userInfo.Phone ? 'text-rose-500' : ''"
    color="gray"
    icon="i-heroicons-device-phone-mobile"
    @click="onClick"
  >
    {{ user.userInfo.Phone || "尚未绑定手机号" }}
  </UButton>
  <UDashboardModal v-model="model" title="修改手机号" description="修改用户当前手机号" :ui="{ width: 'sm:max-w-md' }">
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4 md:space-y-6" @submit="onSubmit">
      <UFormGroup name="Phone">
        <UInput v-model="state.Phone" placeholder="请输入手机" />
      </UFormGroup>

      <UFormGroup name="Code">
        <UButtonGroup orientation="horizontal" class="w-full">
          <UInput v-model="state.Code" :maxlength="4" class="flex-1" placeholder="请输入验证码" />
          <CaptchaVerifyButton :loading="loading" @verify="verifyPhone" @success="handleSuccessAndSendMSG" />
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
