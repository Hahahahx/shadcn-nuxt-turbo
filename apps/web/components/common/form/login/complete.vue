<script setup lang="ts">

const emit = defineEmits<{
  (e: 'submit'): void
}>()
const verifyName = verify.test(
  // @ts-ignore
  new RegExp(/^[a-z]{1}(?=.*[a-z])[a-z\d\-]{4,18}[a-z\d]{1}$/)
)

const schema = z.object({
  UserName: z.string({
    required_error: '账号不能为空'
  })
    .refine(verifyName, '名称应该以6-20位的小写字母组成，允许其中包含数字、连接符（-）')
    .refine(str => str !== 'root' && str !== 'jwanfs', '不允许起名关键字root、jwanfs'),
  Email: z.string({
    required_error: '请填写邮箱'
  }).email('邮箱格式有误'),
  Code: z.string({
    required_error: '验证码不能为空'
  }),
})


const { data, refresh } = useAsyncData(authApi.captcha)


const onSubmit: any = async (values: ZodInfer<typeof schema>) => {
  try {
    await authApi.register({ ...event, RandomPass: true, Uuid: data.value?.uuid ?? '' })
    emit('submit')
  } catch (err: any) {
    toast.error("操作失败", {
      description: err.message
    })
  }
  refresh()
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

    <Button type="submit" class="font-bold w-full">
      登录
    </Button>
  </AutoForm>
</template>
