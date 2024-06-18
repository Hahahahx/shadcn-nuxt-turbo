<script setup lang="ts">

const emit = defineEmits<{
  (e: 'submit'): void
}>()
const verifyName = verify.test(
  new RegExp(/^[a-z]{1}(?=.*[a-z])[a-z\d\-]{4,18}[a-z\d]{1}$/)
)


const { data: auditors, pending } = useAsyncData(authApi.auditors, {
  default: () => [],
})
const enumAuditors = computed(() => auditors.value.map(i => String(i.Id)) ?? [''])

const schema = computed(() => z.object({
  UserName: z.string({
    required_error: '账号不能为空'
  })
    .refine(verifyName, '名称应该以6-20位的小写字母组成，允许其中包含数字、连接符（-）')
    .refine(str => str !== 'root' && str !== 'jwanfs', '不允许起名关键字root、jwanfs'),
  Email: z.string({
    required_error: '请填写邮箱'
  }).email('邮箱格式有误'),
  Password: z.string({
    required_error: '密码不能为空'
  }),
  Confirm: z.string({
    required_error: '确认密码不能为空'
  }),
  SysUserId: z.enum(enumAuditors.value as [string],{
    required_error: '请选择审核人'
  }),
  Code: z.string({
    required_error: '验证码不能为空'
  })
}).refine(({ Confirm, Password }) => Confirm === Password, {
  message: '两次密码输入不一致',
  path: ['Confirm']
}))

const { data, refresh } = useAsyncData(authApi.captcha)


const toast = useToastHandle()

async function onSubmit(event: ZodInfer<typeof schema.value>) {
  try {
    await authApi.register({ ...event, Uuid: data.value?.uuid ?? '' })
    emit('submit')
  } catch (err: any) {
    toast.error(err.message)
  }
}

</script>

<template>
  <AutoForm class="space-y-4" :schema="schema" :field-config="{
    UserName: {
      hideLabel: true,
      inputProps: {
        placeholder: '请填写账号',
      },
    },
    Email: {
      hideLabel: true,
      inputProps: {
        type: 'email',
        placeholder: '请填写邮箱',
      },
    },
    Password: {
      hideLabel: true,
      inputProps: {
        type: 'password',
        placeholder: '请填写密码',
      },
    },
    SysUserId: {
      loading: pending,
      options: auditors.map(item => ({ label: item.UserName, value: item.Id })),
      hideLabel: true,
      inputProps: {
        placeholder: '请选择审核人',
      },
    },
    Confirm: {
      hideLabel: true,
      inputProps: {
        type: 'password',
        placeholder: '请二次确认密码',
      },
    },
    Code: {
      hideLabel: true,
      inputProps: {
        placeholder: '请填写验证码',
      },
    },
  }" @submit="onSubmit">
    <template #Code="slotProps">
      <div class="flex items-start gap-3">
        <AutoFormField v-bind="slotProps" />
        <Button class="w-[150px] bg-no-repeat" type="button"
          :style="{ backgroundSize: '100% 100%', backgroundImage: `url(data:image/png;base64,${data?.imgByte})` }"
          @click="refresh" />
      </div>
    </template>
    <template #SysUserId="slotProps">
      <AutoFormField v-bind="slotProps" />
    </template>

    <Button type="submit" class="font-bold w-full">
      登录
    </Button>
  </AutoForm>
</template>
