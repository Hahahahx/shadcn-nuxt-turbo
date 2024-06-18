<script setup lang="ts">
import { useFileStore } from '~/composables/stores/files'

const files = useFileStore()
const { isFilesSiderOpen } = useDashboard()

const state = {
  uploading: 'i-line-md-uploading-loop',
  pending: 'i-solar-archive-up-minimlistic-bold-duotone',
  error: 'i-solar-cloud-cross-bold-duotone text-rose-500',
  success: 'i-solar-archive-minimalistic-bold-duotone text-green-500',
}

useIntervalFn(async () => {
  // 检查是否有文件正在上传，且有文件在上传队列中，没有则添加
  if (files.uploading.length === 0 && files.pendings.length !== 0) {
    const file = files.uploadFile()
    if (file) {
      try {
        toast.info('上传文件', {
          description: `文件${file.file.name}开始上传，查看上方上传列表。`,
        })
        const res = await bucketApi.detail.uploadUrl({ Path: file.path })
        await bucketApi.detail.upload(file.file, res.endpoint + res.url, res.token)
        toast.success('上传成功', {
          description: `文件${file.file.name}上传成功`,
        })
        files.uploadFileSuccess(file.file, file.path)
      }
      catch (e: any) {
        toast.error('上传失败', {
          description: `文件${file.file.name}上传失败，上传结果为：${e}`,
        })
        files.uploadFileError(file.file, file.path)
      }
    }
  }
}, 1000)
</script>

<template>
  <UDashboardSlideover v-model="isFilesSiderOpen" title="文件上传情况">
    <UDivider label="进行中" />

    <div
      v-if="!files.uploading.length && !files.pendings.length"
      class="flex-col flex justify-center items-center h-[300px] gap-4"
    >
      <UIcon name="i-solar-box-minimalistic-line-duotone" class="w-16 h-16 opacity-80" />
      <span class=" typography-muted">暂无文件上传</span>
    </div>

    <div
      v-for="(f, i) in files.uploading"
      :key="i"
      class="relative flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <div :class="state.uploading" />
      <div class="flex-1 text-sm">
        <p class="flex items-center justify-between">
          <span class="font-medium text-gray-900 dark:text-white">{{ f.file.name }}</span>
          <SizeBadge :size="f.file.size ?? 0" unit="B" />
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          <span class="opacity-80">
            {{ f.path }}
          </span>
          {{ f.file.type }}
        </p>
      </div>
    </div>

    <div v-if="!!files.pendings.length">
      <UTooltip text="移除待上传的文件" :ui="{ wrapper: 'block' }">
        <div
          v-for="(f, i) in files.pendings"
          :key="i"
          class="relative flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
          @click="files.removePendingFile(f.file)"
        >
          <div :class="state.pending" />
          <div class="flex-1 text-sm">
            <p class="flex items-center justify-between">
              <span class="font-medium text-gray-900 dark:text-white">{{ f.file.name }}</span>
              <SizeBadge :size="f.file.size ?? 0" unit="B" />
            </p>
            <p class="text-gray-500 dark:text-gray-400">
              <span class="opacity-80">
                {{ f.path }}
              </span>
              {{ f.file.type }}
            </p>
          </div>
        </div>
      </UTooltip>
    </div>
    <UDivider label="成功" />

    <div v-if="!files.success.length" class="flex-col flex justify-center items-center h-[300px] gap-4">
      <UIcon name="i-solar-box-minimalistic-line-duotone" class="w-16 h-16 opacity-80" />
      <span class=" typography-muted">暂无文件</span>
    </div>

    <div
      v-for="(f, i) in files.success"
      :key="i"
      class="relative flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <div :class="state.success" />
      <div class="flex-1 text-sm">
        <p class="flex items-center justify-between">
          <span class="font-medium text-gray-900 dark:text-white">{{ f.file.name }}</span>
          <SizeBadge :size="f.file.size ?? 0" unit="B" />
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          <span class="opacity-80">
            {{ f.path }}
          </span>
          {{ f.file.type }}
        </p>
      </div>
    </div>

    <UDivider label="失败" />

    <div v-if="!files.error.length" class="flex-col flex justify-center items-center h-[300px] gap-4">
      <UIcon name="i-solar-box-minimalistic-line-duotone" class="w-16 h-16 opacity-80" />
      <span class=" typography-muted">暂无文件</span>
    </div>
    <div v-if="!!files.error.length">
      <UTooltip text="重新将文件加入到上传队列中" :ui="{ wrapper: 'block' }">
        <div
          v-for="(f, i) in files.error"
          :key="i"
          class="relative flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
          @click="files.recoverErrorFile(f.file, f.path)"
        >
          <div :class="state.error" />
          <div class="flex-1 text-sm">
            <p class="flex items-center justify-between">
              <span class="font-medium text-gray-900 dark:text-white">{{ f.file.name }}</span>
              <SizeBadge :size="f.file.size ?? 0" unit="B" />
            </p>
            <p class="text-gray-500 dark:text-gray-400">
              <span class="opacity-80">
                {{ f.path }}
              </span>
              {{ f.file.type }}
            </p>
          </div>
        </div>
      </UTooltip>
    </div>
  </UDashboardSlideover>
</template>
