<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { output } from 'zod'

const model = defineModel({
  type: Boolean
})


const user = useUserStore()
const form = ref()

const schema = z.object({
  NickName: z.string({
    required_error: '请填写用户名'
  }),
})

type Schema = output<typeof schema>

const state = reactive<{
  NickName?: string
}>({
  NickName: undefined,
})

effect(() => {
  state.NickName = user.userInfo.NickName
})

const toast = useToastHandle()


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
    :class="!user.userInfo.NickName ? 'text-rose-500' : ''"
    color="gray"
    icon="i-heroicons-user"
    @click="onClick"
  >
    {{ user.userInfo.NickName || "尚未设置用户名" }}
  </UButton>
  <UDashboardModal v-model="model" title="修改用户名" description="修改用户当前用户名" :ui="{ width: 'sm:max-w-md' }">
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4 md:space-y-6" @submit="onSubmit">
      <UFormGroup name="NickName">
        <UInput v-model="state.NickName" placeholder="请输入用户名" />
      </UFormGroup>

      <div class="flex justify-end">
        <UButton type="submit" class="px-4">
          确认
        </UButton>
      </div>
    </UForm>
  </UDashboardModal>
</template>
