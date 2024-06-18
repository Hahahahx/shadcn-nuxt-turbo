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
  Phone: z.string({
    required_error: '请填写手机',
  }).refine(str => verify.phone(str), '请填写正确的手机号'),
  Code: z.string({
    required_error: '请填写验证码',
  }).length(4, '请填写4个字符的验证码'),
  Remember: z.boolean().optional(),
})

const form = useForm({
  validationSchema: toTypedSchema(schema),
})

const state = reactive({
  Phone: undefined,
  Code: undefined,
  Remember: false,
})

// 验证码发送加载
const loading = ref(false)

async function handleSuccessAndSendMSG() {
  loading.value = true
  // 验证码验证成功，发送手机
  try {
    await authApi.sendCode({
      Phone: state.Phone,
    })
    toast.success('验证码发送成功')
  }
  catch (err: any) {
    toast.error('验证码发送失败', {
      description: err.message,
    })
  }
  loading.value = false
}

async function verifyPhone(res: (open: boolean) => void) {
  try {
    // 验证手机
    await form.validateField('Phone')
    res(true)
  }
  catch (err: any) {
    if (!err.message.includes('Phone'))
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
      Phone: {
        hideLabel: true,
        inputProps: {
          placeholder: '请填写手机',
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
        <CaptchaVerifyButton :loading="loading" @verify="verifyPhone" @success="handleSuccessAndSendMSG" />
      </div>
    </template>

    <Button type="submit" class="w-full font-bold">
      登录
    </Button>
  </AutoForm>
</template>
