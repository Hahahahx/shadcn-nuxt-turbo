<script setup lang="ts">
import edit from '~/components/user/form/bucket/detail/edit.vue'
import deleteVue from '~/components/user/form/bucket/detail/delete.vue'
import type { CreateDirParams, FileInfo } from '~/api/bucket'
import upload from '~/components/user/form/bucket/detail/upload.vue'
import Detail from '~/components/user/section/bucket/detail.vue'
import Share from '~/components/user/form/bucket/detail/share.vue'
import ImageView from '~/components/user/section/bucket/image-view.vue'
import PdfView from '~/components/user/section/bucket/pdf-view.vue'
import WordView from '~/components/user/section/bucket/word-view.vue'
import ExcelView from '~/components/user/section/bucket/excel-view.vue'
import TxtView from '~/components/user/section/bucket/txt-view.vue'
import Create from '~/components/user/form/resource/create.vue'

const route = useRoute()
const modal = useModal()
const selected = ref<FileInfo[]>([])
const query = ref('')
const { t } = useI18n()
const toast = useToastHandle()

const { history } = useThrottledRefHistory(query, {
  throttle: 2000,
  deep: true,
  trailing: true
})

const pageIndex = ref(1)
const pageSize = ref(10)

const names = computed(() => {
  if (Array.isArray(route.params.id)) {
    return route.params.id
  }
  return [route.params.id]
})

const { data, refresh, pending, error } = useAsyncData(
  () => bucketApi.detail.list({
    Page: pageIndex.value,
    PageSize: pageSize.value,
    Name: history.value?.at(0)?.snapshot
  }, names.value.join('/')), {
  watch: [pageIndex, pageSize, history],
  default: (): Page.Response<FileInfo> => ({
    Rows: [],
    Total: 0
  }),
})


const columns: {
  key: keyof FileInfo
  label?: string
  sortable?: boolean
}[] = [{
  key: 'Name',
  label: t('user.bucket.detail.field.name'),
  sortable: true
}, {
  key: 'FileSize',
  label: t('user.bucket.detail.field.size'),
  sortable: true
}, {
  key: 'Type',
  label: t('user.bucket.detail.field.type'),
  sortable: true
}, {
  key: 'Mtime'
}]


const sort = ref({ column: 'id', direction: 'asc' as const })


const links = [{
  label: t('user.bucket.title'),
  icon: 'i-heroicons-home',
  to: '/user/data/bucket'
}, ...names.value.map((name, index) => ({
  label: name,
  to: '/user/data/bucket/' + names.value.slice(0, index + 1).join('/')
}))]


// 删除
const onDelete = async (ids: string[]) => {
  try {

    for (const i of ids) {
      await bucketApi.detail.delete([...names.value, i].join('/'))
    }
    await refresh()
  } catch (e: any) {
    toast.error(e.message)
  }
}

// 编辑
const onEdit = async (item: FileEditParams) => {
  try {
    await bucketApi.detail.edit(item, names.value.join('/'))
    await refresh()
  } catch (e: any) {
    toast.error(e.message)
  }

}

// 分享
const onShare = async (item: ShareCreate) => {
  try {
    await shareApi.create({
      ...item,
      Path: '/' + [...names.value, item.Path].join('/')
    })
    toast.success('分享文件成功！')
  } catch (e: any) {
    toast.error(e.message)
  }
}


// 上传资源
const onPublic = async (item: ResourceCreate, row: FileInfo) => {
  try {
    await resourceApi.create({
      ...item,
      Type:row.Type,
      Path: row.Path,
      BucketName: row.Path.split('/').at(1) ?? '',
    })
    toast.success('资源发布成功！')
  } catch (e: any) {
    toast.error(e.message)
  }
}


// 创建
const onCreate = async (item: CreateDirParams) => {
  try {
    await bucketApi.detail.createDir(item, names.value.join('/'))
    await refresh()
  } catch (e: any) {
    toast.error(e.message)
  }
}

//上传
const onUpload = async (files: File[] | FileList | null) => {
  modal.open(upload, {
    files,
    path: names.value.join('/')
  })
}

const detail = {
  toDir: (row: FileInfo) => {
    navigateTo(`/user/data/bucket/${names.value.join('/')}/${row.Name}`)
  },
  toImageView: (row: FileInfo) => {
    modal.open(ImageView, {
      path: names.value.join('/'),
      file: row.Name
    })
  },
  toPDFView: (row: FileInfo) => {
    modal.open(PdfView, {
      row
    })
  },
  toWordView: (row: FileInfo) => {
    modal.open(WordView, {
      row
    })
  },
  toExcelView: (row: FileInfo) => {
    modal.open(ExcelView, {
      row
    })
  },
  toTextView: (row: FileInfo) => {
    modal.open(TxtView, {
      row
    })
  },
  toFileDetail: (row: FileInfo) => {
    modal.open(Detail, {
      path: [...names.value, row.Name].join('/'),
    })
  }
}


// 详情
const onDetail = (row: FileInfo) => {
  if (row.Type === 'dir') {
    detail.toDir(row)
  } else {
    if (media.images.includes(row.Type)) {
      detail.toImageView(row)
    } else if (row.Type === '.pdf') {
      detail.toPDFView(row)
    } else if (row.Type === '.docx') {
      detail.toWordView(row)
    } else if (['.txt', '.log', '.conf', '.json', '.yaml'].includes(row.Type)) {
      detail.toTextView(row)
    } else if (row.Type === '.xlsx') {
      detail.toExcelView(row)
    } else {
      detail.toFileDetail(row)
    }
  }

}

function menus(row: FileInfo) {

  const list: any[] = [{
    label: '编辑',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => {
      modal.open(edit, {
        row,
        onEdit
      })
    }
  }]

  if ((row.Type) !== 'dir') {
    list.push({
      label: '预览',
      icon: 'i-heroicons-eye-20-solid',
      click: () => {
        if (media.images.includes(row.Type)) {
          detail.toImageView(row)
        } else if (row.Type === '.pdf') {
          detail.toPDFView(row)
        } else if (row.Type === '.docx') {
          detail.toWordView(row)
        } else if (row.Type === '.xlsx') {
          detail.toExcelView(row)
        } else {
          toast.error('不支持的文件类型')
        }
      }
    })
  }

  if (row.Type !== 'dir') {
    list.push(...[{
      label: '下载',
      icon: 'i-heroicons-arrow-down-circle-20-solid',
      click: () => {
        bucketApi.detail.download(row)
      }
    },
    {
      label: '创建分享',
      icon: 'i-heroicons-arrow-top-right-on-square-16-solid',
      click: () => {
        modal.open(Share, {
          row,
          onShare
        })
      }
    },
    ])
  }

  list.push({
    label: '发布资源',
    icon: 'i-solar-arrow-to-top-right-line-duotone',
    click: () => {
      modal.open(Create, {
        onPublic: (item: ResourceCreate) => onPublic(item, row)
      })
    }
  })

  return [
    [{
      label: '详情',
      icon: row.Type === 'dir' ? 'i-heroicons-arrow-right-circle-20-solid' : 'i-heroicons-clipboard-document-list-16-solid',
      click: () => {
        if (row.Type === 'dir') {
          detail.toDir(row)
        } else {
          detail.toFileDetail(row)
        }
      }
    }],
    list,
    [{
      label: '删除',
      icon: 'i-heroicons-trash-20-solid',
      click: () => {
        modal.open(deleteVue, {
          row,
          onDelete
        })
      }
    }],
  ]
}

const fileIcon: { [k: string]: string } = {
  '.html': 'i-solar-code-2-bold-duotone',
  '.tsx': 'i-solar-code-2-bold-duotone',
}

const dropZoneRef = ref<HTMLDivElement>()

const { open, onChange } = useFileDialog()
onChange(onUpload)

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: onUpload,
})

</script>

<template>
  <!-- <UserSectionBucketImageView :path="names.join('/')" :v-model="true" /> -->
  <PageTitle :title="names.at(-1)" :badge="data.Total">
    <template #right>
      <UserFormBucketDetailCreate @create="onCreate" />
      <UTooltip text="直接将文件拖放到列表中也可完成上传操作" :popper="{ arrow: true }">
        <UButton label="上传文件" trailing-icon="i-solar-archive-up-line-duotone" color="gray" @click="open()" />
      </UTooltip>
    </template>
  </PageTitle>
  <div class="px-4 pb-6">
    <UBreadcrumb :links="links" />
  </div>
  <div ref="dropZoneRef" class="w-full relative">
    <div
      v-if="isOverDropZone"
      class="p-20 bg-gray-500/5 border-1 rounded h-full w-full z-[1000] absolute top-0 left-0 "
    >
      <div class="bg-gray-500/10 gap-4 h-full rounded flex-col flex border-1 justify-center items-center">
        <UIcon name="i-solar-inbox-out-outline" class=" w-14 h-14" />
        <span class="typography-h4">
          上传文件到当前文件夹
        </span>
      </div>
    </div>
    <TableBase
      $selected="selected"
      $query="query"
      $page-index="pageIndex"
      $page-size="pageSize"
      :loading="pending"
      :error="error"
      :list="pending?[]:(data.Rows??[])"
      :page-total="data.Total"
      :columns="columns"
      :menus="menus"
      :refresh="refresh"
    >
      <template #selected>
        <div v-if="!!selected.length">
          <UButton variant="link" @click="() => onDelete(selected.map(i => i.Name))">
            删除
          </UButton>
        </div>
      </template>

      <template #Name-data="{ row }">
        <UButton
          variant="link"
          :color="row.Type === 'dir' ? 'amber' : 'gray'"
          :icon="row.Type === 'dir' ? 'i-solar-folder-bold-duotone' : fileIcon[row.Type ?? ''] ?? 'i-solar-document-bold-duotone'"
          @click="onDetail(row)"
        >
          {{ row.Name }}
        </UButton>
      </template>

      <template #FileSize-data="{ row }">
        <SizeBadge v-if="row.Type !== 'dir'" :size="row.FileSize ?? 0" />
        <div v-else />
      </template>

      <template #Mtime-data="{ row }">
        {{ format.dateTime((row.Mtime)) }}
      </template>
    </TableBase>
  </div>
</template>
