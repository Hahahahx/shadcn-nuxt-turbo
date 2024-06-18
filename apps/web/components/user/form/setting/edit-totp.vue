<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const model = defineModel({
  type: Boolean
})

const { data, refresh } = useAsyncData(userApi.qrTotpCode)

const user = useUserStore()
const toast = useToastHandle()
const { identityCheck } = useVerify()
const loading = ref(false)




const schema = z.object({
  TotpCode: z.string({
    required_error: '验证码不能为空'
  }),
})

type Schema = z.output<typeof schema>
const state = reactive({
  TotpCode: undefined,
})



const toggle = computed(() => {
  return (!!user.userInfo.IsTotp)
})


async function onClick() {
  loading.value = true
  await identityCheck(async () => {
    try {

      if (user.userInfo.IsTotp) {
        // 关闭双因素认证
        await userApi.edit({ IsSafeCheck: user.userInfo.IsSafeCheck ? 2 : 1 })
        user.getUserInfo()
      } else {
        model.value = true
      }
    } catch (e: any) {
      toast.error(e.message)
    }
  })
  loading.value = false
}


async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await userApi.edit({ ...event.data, TotpSecret: data.value?.TotpSecret })
    await user.getUserInfo()
    model.value = false
  } catch (err: any) {
    refresh()
    toast.error(err.message)
  }
}


</script>


<template>
  <div class="flex justify-end gap-2 items-center">
    <span class="typography-muted">
      {{ user.userInfo.IsTotp ? "已绑定" : "未绑定" }}
    </span>
    <UToggle
      v-model="toggle"
      :on-icon="loading ? 'i-eos-icons-three-dots-loading' : 'i-heroicons-check-20-solid'"
      :off-icon="loading ? 'i-eos-icons-three-dots-loading' : 'i-heroicons-x-mark-20-solid'"
      :disabled="loading"
      size="xl"
      @click="onClick"
    />
  </div>


  <UDashboardModal v-model="model" title="身份验证器" description="使用移动设备进行身份绑定" :ui="{ width: 'sm:max-w-md' }">
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4 md:space-y-6" @submit="onSubmit">
      <div class="flex flex-col justify-center items-center px-10">
        <UTooltip text="点击刷新" class="w-full">
          <NuxtImg
            class="rounded overflow-hidden w-full cursor-pointer"
            :src="`data:image/png;base64,${data?.Qr}`"
            @click="refresh"
          />
        </UTooltip>
        <span class=" typography-muted">用相关设备扫一扫绑定</span>
      </div>

      <UFormGroup name="Code">
        <UButtonGroup orientation="horizontal" class="w-full">
          <UInput v-model="state.TotpCode" :maxlength="4" class="flex-1" placeholder="请输入验证码" />
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
