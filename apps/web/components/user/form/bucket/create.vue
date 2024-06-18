<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'

// 定义单位数组
const units = [
  'GB', 'TB',
]

// 定义双向绑定模态框的显示
const model = defineModel({
  type: Boolean
})
// 定义加载状态
const loading = ref(false)

// 定义当前单位
const unit = ref(units[0])

// 根据单位转换大小，并监听单位变化
watch(unit, (val, old) => {
  if (old === 'GB') {
    state.BucketLimitSize = byteTrans.g2t(state.BucketLimitSize, 'ceil')
  } else {
    state.BucketLimitSize = byteTrans.t2g(state.BucketLimitSize, 'ceil')
  }
})

// 定义外部传入的操作
const { onCreate } = defineProps<{
  onCreate: (item: BucketCreateAndEditParams) => Promise<void>
}>()


// 定义表单数据
const schema = z.object({
  BucketName: z.string({
    required_error: '桶名称不能为空'
  }),
  BucketLimitSize: z.number({
    required_error: '配额大小不能为空'
  }).min(1, '配额大小不能小于1')
})

// 定义双向绑定表单数据
const state = reactive({
  BucketName: '',
  BucketLimitSize: 0
})


// 提交事件
async function onSubmit(event: FormSubmitEvent<BucketCreateAndEditParams>) {
  loading.value = true
  model.value = false

  let size = 0
  // 根据当前单位进行转换为KB之后再提交
  if (unit.value === 'GB') {
    size = byteTrans.g2k(event.data.BucketLimitSize)
  } else {
    size = byteTrans.t2k(event.data.BucketLimitSize)
  }
  await onCreate({ ...event.data, BucketLimitSize: size })

  loading.value = false
}

</script>

<template>
  <UButton
    :label="$t('user.bucket.modal.create.title')"
    trailing-icon="i-heroicons-plus"
    :loading="loading"
    color="gray"
    @click="model = true"
  />
  <UDashboardModal
    v-model="model"
    :title="$t('user.bucket.modal.create.title')"
    :description="$t('user.bucket.modal.create.desc')"
    :ui="{ width: 'sm:max-w-md' }"
  >
    <!-- ~/components/users/UsersForm.vue -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup :label="$t('user.bucket.field.name')" name="BucketName">
        <UInput v-model="state.BucketName" autofocus :placeholder="$t('user.bucket.field.name.placeholder')" />
      </UFormGroup>

      <UFormGroup :label="$t('user.bucket.field.quota')" name="BucketLimitSize">
        <UButtonGroup class="w-full" orientation="horizontal">
          <UInput
            v-model="state.BucketLimitSize"
            class="w-full"
            type="number"
            :placeholder="$t('user.bucket.field.quota.placeholder')"
          />
          <UTooltip text="自动向上取整策略，100GB⇒0.10TB⇒1TB" :popper="{ placement: 'top' }">
            <USelectMenu v-model="unit" :options="units" />
          </UTooltip>
        </UButtonGroup>
      </UFormGroup>

      <div class="flex justify-end gap-3 pt-8">
        <UButton :label="$t('modal.cancel')" color="gray" variant="ghost" @click="model = false" />
        <UButton type="submit" :label="$t('modal.ok')" color="black" />
      </div>
    </UForm>
  </UDashboardModal>
</template>
