<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  date: z.date({
    required_error: '请选择一个期限',
  }).min(new Date(), '请选择一个还未到的日期，当前时间为：' + format.dateTime(new Date().getTime(), 1)),
})

const model = defineModel({
  type: Boolean
})


const state = reactive({
  date: new Date(),
})
// 定义加载状态
const loading = ref(false)

// 定义外部传入的操作
const { onCreate } = defineProps<{
  onCreate: (item: AccessKeyCreate) => Promise<void>
}>()


async function onSubmit() {
  loading.value = true
  await onCreate({
    Expiration: Math.round(state.date.getTime() / 1000),
  })
  loading.value = false
  model.value = false
}

</script>

<template>
  <UButton label="创建密钥" trailing-icon="i-heroicons-plus" color="gray" :loading="loading" @click="model = true" />
  <UDashboardModal v-model="model" title="创建密钥" description="为密钥选择一个期限" :ui="{ width: 'sm:max-w-md' }">
    <!-- ~/components/users/UsersForm.vue -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="过期时间" name="date">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton
            color="gray"
            block
            icon="i-heroicons-calendar-days-20-solid"
            class=" justify-start"
            :label="format.dateTime(state.date.getTime(), 1)"
          />
          <template #panel="{ close }">
            <DatePicker v-model="state.date" @close="close" />
          </template>
        </UPopover>
      </UFormGroup>

      <div class="flex justify-end gap-3 pt-8">
        <UButton :label="$t('modal.cancel')" color="gray" variant="ghost" @click="model = false" />
        <UButton type="submit" :label="$t('modal.ok')" color="black" />
      </div>
    </UForm>
  </UDashboardModal>
</template>
