<script setup lang="ts">
import Info from '~/components/user/section/resource/info.vue'

const resource = useResourceStore()

const route = useRoute()

// 搜索
const query = ref(resource.search ?? '')
const queryDebounced = refDebounced(query, 1000)

effect(() => {
  resource.search = query.value
})

const pageIndex = ref(1)
const pageSize = ref(10)

const selected = ref<ClassInfo>()
const selectedTags = ref<TagInfo[]>([])

const sorts = [{
  name: '下载量',
  value: 'Download'
}, {
  name: '发布时间',
  value: 'Createtime',
}]

const sort = ref('Download')
const isDesc = ref(true)

const sortIcon = computed(() => {
  return isDesc.value ? 'i-solar-list-arrow-down-minimalistic-line-duotone' : 'i-solar-list-arrow-up-minimalistic-line-duotone'
})

const { data, refresh, pending, error } = useAsyncData(
  () => resourceApi.list({
    Name: queryDebounced.value,
    Page: pageIndex.value,
    PageSize: pageSize.value,
    ClassName: selected.value?.ID ? selected.value?.Name : undefined,
    Tags: selectedTags.value.map(i=>i.Name) ?? [],
    SortName:sort.value,
    SortOrder:isDesc.value ? 'desc' : 'asc',
  }), {
  watch: [pageIndex, pageSize, selected, selectedTags, queryDebounced,sort,isDesc],
  default: (): Page.Response<ResourceInfo> => ({
    Rows: [],
    Total: 0
  }),
})




const { data: categorys } = useAsyncData('commonApi.categorys', commonApi.categorys, {
  default: (): CategoryInfo => ({
    Class:[],
    Tags:[]
  }),
})


const toggleSort = () => {
  isDesc.value = !isDesc.value
}



const items = [
  [{
    label: '资源',
    click: () => {
      navigateTo('/user/resource/square/home')
    }
  }, {
    label: '店铺',
    click: () => {
      navigateTo('/user/resource/square/store')
    }
  }]
]

const toggleSelectedTags = (item: TagInfo) => {
  if (selectedTags.value.includes(item)) {
    selectedTags.value = selectedTags.value.filter(i => i !== item)
  } else {
    selectedTags.value = [...selectedTags.value,item]
  }
}

const toggleSelectedCategory = (item?: ClassInfo) => {
  if (!item || selected.value?.ID === item.ID) {
    selected.value = undefined
  } else {
    selected.value = item
  }
  selectedTags.value = []
}

const modal = useModal()
const onDetail = (row: ResourceInfo)=>{
  modal.open(Info,{
    row,
  })
}

</script>

<template>
  <div class=" p-10 flex flex-col items-center justify-center gap-2">
    <div>
      <UButtonGroup size="lg" orientation="horizontal">
        <UDropdown :items="items" mode="hover" :popper="{ placement: 'bottom-start' }">
          <UButton color="white" label="资源" trailing-icon="i-heroicons-chevron-down-20-solid" />
        </UDropdown>

        <UInput
          v-model="query"
          autofocus
          icon="i-heroicons-magnifying-glass-20-solid"
          size="lg"
          color="white"
          class="w-[350px]"
          :trailing="false"
          :placeholder="`搜索全部资源...`"
        />
      </UButtonGroup>
    </div>
    <div class="flex gap-2" />
  </div>

  <div class="px-4 pb-8">
    <div class="flex items-center justify-start gap-2">
      <div class="typography-muted">
        分类
      </div>
      <UButton v-for="(item, i) in categorys.Class" :key="i" variant="link" @click="toggleSelectedCategory(item)">
        {{ item.Name }}
      </UButton>
    </div>
    <div class="flex items-center justify-start gap-2">
      <div class="typography-muted">
        标签
      </div>
      <UButton v-for="(item, i) in categorys.Tags" :key="i" variant="link" @click="toggleSelectedTags(item)">
        {{ item.Name }}
      </UButton>
    </div>
    <UDivider class="pb-4" />

    <div class="flex items-center justify-between gap-2 pb-4">
      <div class="flex-1 flex items-center justify-start gap-2">
        <div class="typography-muted">
          检索
        </div>
        <UBadge v-if="selected" variant="soft" class="cursor-pointer" @click="toggleSelectedCategory(selected)">
          {{ selected?.Name }}
          <UIcon name="i-heroicons-x-mark-20-solid" class="ml-1" />
        </UBadge>

        <UBadge
          v-for="tag in selectedTags"
          :key="tag"
          color="green"
          variant="soft"
          class="cursor-pointer"
          @click="toggleSelectedTags(tag)"
        >
          {{ tag.Name }}
          <UIcon name="i-heroicons-x-mark-20-solid" class="ml-1" />
        </UBadge>
      </div>
      <div class="flex items-center justify-end gap-2">
        <div class="typography-muted">
          排序
        </div>
        <USelectMenu v-model="sort" :options="sorts" value-attribute="value" option-attribute="name" />
        <UTooltip :text="isDesc ? '降序' : '升序'">
          <UButton :padded="false" color="gray" variant="link" :icon="sortIcon" @click="toggleSort" />
        </UTooltip>
      </div>
    </div>
  </div>



  <div class="gap-7 px-4 grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-5">
    <UserSectionCardResource
      v-for="item, i in data.Rows"
      :key="i"
      :compact="true"
      :hot="item.Download"
      :tags="item.Tags ?? []"
      :title="item.Name"
      :description="item.Description"
      :category="item.ClassName"
      :img="item.Ico"
      :time="format.dateTime(item.Createtime)"
      footer
      :to="`/user/resource/${item.ID}`"
    />
  </div>

  <div class="flex justify-center my-5">
    <UPagination
      v-model="pageIndex"
      :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: '上一页', color: 'gray' }"
      :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: '下一页', color: 'gray' }"
      :total="data.Total"
    />
  </div>
</template>
