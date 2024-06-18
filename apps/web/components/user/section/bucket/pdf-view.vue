<script setup lang="ts">
import VueOfficePdf from '@vue-office/pdf'


const model = defineModel({
  type: Boolean
})

const props = defineProps<{
  row: FileInfo
}>()

const src = computed(()=> bucketApi.detail.downloadUrl(props.row))

function rendered() {
  console.log('rendered')
}

</script>

<template>
  <UModal v-model="model" fullscreen>
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: 'grow !p-0 '
        }
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ row.Name }}
              <UTooltip text="文件为PDF文件，该页面仅提供预览，编辑请下载文件...">
                <UButton size="sm" @click="bucketApi.detail.download(row)">
                  下载编辑
                </UButton>
              </UTooltip>
            </h3>
          </div>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="model = false"
          />
        </div>
      </template>
      <vue-office-pdf :src="src" class="w-full h-screen" @rendered="rendered" />
    </UCard>
  </UModal>
</template>
