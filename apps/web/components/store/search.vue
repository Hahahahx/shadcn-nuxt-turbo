<script setup lang="ts">

import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const emit = defineEmits<{
  (e: 'search', data: any): void
}>()

const props = defineProps<{
  onSearch: (data: any) => Promise<void>
}>()

const state = reactive<any>({
  element: '',
  edge: 'Any',
  beamline: 'Any',
  measurement_mode: 'Any',
  rating: 'Any',
})

const schema = z.object({
  edge: z.string({
    required_error: 'Select Edge',
  }),
  beamline: z.string({
    required_error: 'Select Beamline',
  }),
  measurement_mode: z.string({
    required_error: 'Select Measurement',
  }),
  rating: z.string({
    required_error: 'Select Rating'
  })
})


const form = ref()

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with event.data
  console.log(event.data)
  emit('search', event.data)
  props.onSearch(event.data)
}


</script>

<template>
  <UForm ref="form" :schema="schema" :state="state" @submit="onSubmit">
    <UCard class="w-[300px] h-fit absolute top-0 ">
      <template #header>
        搜索工具
      </template>
      <div class="space-y-4">
        <UFormGroup name="element" label="搜索名称">
          <UInput
            v-model="state.element"
            placeholder="搜索..."
            size="md"
          />
        </UFormGroup>

        <UFormGroup name="edge" label="分类">
          <USelectMenu
            v-model="state.edge"
            size="md"
            placeholder="选择分类..."
            :options="['Any', 'K', 'L1', 'L2', 'L3']"
          />
        </UFormGroup>


        <UFormGroup name="beamline" label="标签">
          <USelectMenu
            v-model="state.beamline"
            size="md"
            multiple
            placeholder="选择标签..."
            :options="['Any', 'K', 'L1', 'L2', 'L3']"
          />
        </UFormGroup>


        <UFormGroup name="rating" label="发布年份">
          <URadioGroup
            v-model="state.rating"
            :options="['2020', '2021', '2022', '2023', '2024']"
          />
        </UFormGroup>
      </div>


      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray">
            清除条件
          </UButton>
          <UButton type="submit">
            搜索
          </UButton>
        </div>
      </template>
    </UCard>
  </UForm>
</template>
