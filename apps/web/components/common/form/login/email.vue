<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

const emit = defineEmits<{
  (e: 'submit', value: {
    Token: string
    Remember: boolean
  }): void
}>()

const schema = z.object({
  Email: z.string({
    required_error: '请填写邮箱',
  }).email('请填写正确的邮箱'),
  Code: z.string({
    required_error: '请填写验证码',
  }).length(4, '请填写4个字符的验证码'),
  Remember: z.boolean().optional(),
})

const form = useForm({
  validationSchema: toTypedSchema(schema),
})

const state = reactive({
  Email: undefined,
  Code: undefined,
  Remember: false,
})

// 验证码发送加载
const loading = ref(false)

async function handleSuccessAndSendMSG() {
  loading.value = true
  // 验证码验证成功，发送邮件
  try {
    await authApi.sendCode({
      Email: state.Email,
    })
    toast.success('验证码发送成功')
  }
  catch (err: any) {
    toast.error(err.message)
  }
  loading.value = false
}

async function verifyEmail(res: (open: boolean) => void) {
  try {
    // 验证邮箱
    await form.validateField('Email')
    res(true)
  }
  catch (err: any) {
    if (!err.message.includes('Email'))
      res(true)
  }
}

const onSubmit: any = async (event: ZodInfer<typeof schema>) => {
  try {
    const res = await authApi.loginByDevice(event)
    emit('submit', { ...res, Remember: !!event.Remember })
  }
  catch (err: any) {
    toast.error('登录失败', {
      description: err.message,
    })
  }
}
</script>

<template>
  <AutoForm
    class="space-y-4" :form="form" :schema="schema" :field-config="{
      Email: {
        hideLabel: true,
        inputProps: {
          placeholder: '请填写邮箱',
        },
      },
      Code: {
        hideLabel: true,
        inputProps: {
          placeholder: '请填写验证码',
        },
      },
      Remember: {
        label: '记住登录',
        inputProps: {
          required: true,
        },
      },
    }" @submit="onSubmit"
  >
    <template #Code="slotProps">
      <div class="flex items-start gap-3">
        <AutoFormField v-bind="slotProps" />
        <CaptchaVerifyButton :loading="loading" @verify="verifyEmail" @success="handleSuccessAndSendMSG" />
      </div>
    </template>

    <Button type="submit" class="w-full font-bold">
      登录
    </Button>
  </AutoForm>
</template>
