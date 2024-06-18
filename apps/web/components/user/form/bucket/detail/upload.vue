<script setup lang="ts">


const model = defineModel({
  type: Boolean
})


// 定义外部数据，以及操作方法
const { files: filesList, path } = defineProps<{
  path: string
  files: FileList | File[] | null
}>()

const files = ref<File[]>([])

effect(() => {
  files.value = Array.from(filesList ?? [])
})

function removeFile(file: File) {
  // 删除文件
  files.value = files.value.filter(f => f !== file)
}


const dropZoneRef = ref<HTMLDivElement>()

const { open, onChange } = useFileDialog()
onChange((fs) => {
  files.value = [...files.value, ...Array.from(fs ?? [])]
})

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: (fs) => {
    files.value = [...files.value, ...Array.from(fs ?? [])]
  },
})


const fileStore = useFileStore()


const onUpload = () => {
  fileStore.pendingFiles(files.value, path)
  model.value = false
}
</script>


<template>
  <UDashboardModal v-model="model" title="上传文件" description="选择需要上传的文件" :ui="{ width: 'sm:max-w-md' }">
    <!-- ~/components/users/UsersForm.vue -->

    <div ref="dropZoneRef" class="relative">
      <UTooltip v-if="!!files.length" text="点击删除该文件" :ui="{ wrapper: 'block' }">
        <div class="spacy-y-5 h-[300px] overflow-auto">
          <UButton
            v-for="(item, i) in files"
            size="sm"
            variant="ghost"
            :key="i"
            color="rose"
            class="p-1"
            block
            @click="removeFile(item)"
          >
            <span class="truncate w-full text-left typography-muted text-foreground">
              {{ item.name }}
            </span>
            <SizeBadge :size="item.size ?? 0" unit="B" />
          </UButton>
        </div>
      </UTooltip>
      <div v-else class=" bg-gray-500/10 rounded w-full h-[300px] flex items-center justify-center" @click="open">
        <UIcon name="i-heroicons-plus" class="w-16 h-16 opacity-80" />
      </div>
      <div
        v-if="isOverDropZone"
        class="p-20 bg-gray-500/5 border-1 rounded h-full w-full z-[1000] absolute top-0 left-0 "
      >
        <div class="bg-gray-500/10 gap-4 h-full rounded flex-col flex border-1 justify-center items-center">
          <UIcon name="i-solar-inbox-out-outline" class=" w-14 h-14" />
          <span class="typography-h4">
            添加文件到当前队列
          </span>
        </div>
      </div>
    </div>
    <div class="text-right">
      <UButton class="mx-2" variant="soft" @click="open">
        添加文件
      </UButton>
      <UButton @click="onUpload">
        确认上传
      </UButton>
    </div>
  </UDashboardModal>
</template>
