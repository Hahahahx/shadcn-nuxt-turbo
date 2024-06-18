<script setup lang="ts">
const emit = defineEmits<{
  (e: 'submit', value: {
    Token: string
    Remember: boolean
  }): void
}>()

const { data, refresh } = useAsyncData(authApi.captcha)

const schema = z.object({
  UserName: z.string({
    required_error: '账号不能为空',
  }),
  Password: z.string({
    required_error: '密码不能为空',
  }),
  Code: z.string({
    required_error: '验证码不能为空',
  }),
  Remember: z.boolean().optional(),
})

const onSubmit: any = async (values: ZodInfer<typeof schema>) => {
  try {
    const res = await authApi.login({ ...values, UUID: data.value?.uuid ?? '' })
    // 登录成功
    if (res.Token) {
      emit('submit', { ...res, Remember: !!values.Remember })
    }
    else {
      // 需要安全验证
      // modal.open(Security, {
      //   initial: res,
      //   onSubmit(result) {
      //     emit('submit', { ...result, Remember: event.data.Remember })
      //   }
      // })
    }
  }
  catch (err: any) {
    toast.error('登录失败', {
      description: err.message,
    })
  }
  refresh()
}
</script>

<template>
  <AutoForm
    class="space-y-4" :schema="schema" :field-config="{
      UserName: {
        hideLabel: true,
        inputProps: {
          placeholder: '请填写账号',
        },
      },
      Password: {
        hideLabel: true,
        inputProps: {
          type: 'password',
          placeholder: '请填写密码',
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
        <Button
          class="w-[150px] bg-no-repeat" type="button"
          :style="{ backgroundSize: '100% 100%', backgroundImage: `url(data:image/png;base64,${data?.imgByte})` }"
          @click="refresh"
        />
      </div>
    </template>

    <Button type="submit" class="w-full font-bold">
      登录
    </Button>
  </AutoForm>
</template>
