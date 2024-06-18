<script setup lang="ts">
const resource = useResourceStore()

const all: CategoryInfo = {
  ID: '',
  Name: '全部',
  Tags: []
}

// 搜索
const query = ref(resource.search ?? '')
const queryDebounced = refDebounced(query, 1000)

effect(() => {
  resource.search = query.value
})

const pageIndex = ref(1)
const pageSize = ref(10)

const selected = ref<CategoryInfo>(all)
const selectedTags = ref<string[]>([])

const sorts = [{
  name: '下载量',
  value: 'Download'
}, {
  name: '发布时间',
  value: 'Createtime',
}]

const sort = ref('Download')
const isDesc = ref(false)

const sortIcon = computed(() => {
  return isDesc.value ? 'i-solar-list-arrow-down-minimalistic-line-duotone' : 'i-solar-list-arrow-up-minimalistic-line-duotone'
})

const { data, refresh, pending, error } = useAsyncData(
  () => resourceApi.list({
    Name: queryDebounced.value,
    Page: pageIndex.value,
    PageSize: pageSize.value,
    ClassName: selected.value?.ID ? selected.value?.Name : undefined,
    Tags: selectedTags.value ?? [],
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
  default: (): CategoryInfo[] => ([]),
  transform(data: CategoryInfo[]) {
    return [all, ...data]
  }
})

const tags = computed(() => {
  if (categorys.value.length) {
    if (!selected.value?.ID) {
      const t: string[] = []
      return categorys.value.reduce((p, c) => {
        p.push(...c.Tags.map(i => i.Name))
        return p
      }, t)
    } else {
      return categorys.value.find(item => item.ID === selected.value?.ID)?.Tags.map(i => i.Name) ?? []
    }
  }
  return []
})

const toggleSort = () => {
  isDesc.value = !isDesc.value
}



const items = [
  [{
    label: '资源',
    click: () => {
      navigateTo('/user/resource/square')
    }
  }, {
    label: '店铺',
    click: () => {
      navigateTo('/user/resource/square/store')
    }
  }]
]

const toggleSelectedTags = (item: string) => {
  if (selectedTags.value.includes(item)) {
    selectedTags.value = selectedTags.value.filter(i => i !== item)
  } else {
    selectedTags.value.push(item)
  }
}

const toggleSelectedCategory = (item?: CategoryInfo) => {
  if (!item || selected.value?.ID === item.ID) {
    selected.value = all
  } else {
    selected.value = item
  }
  selectedTags.value = []
}


</script>

<template>
  <div class=" p-10 flex flex-col items-center justify-center gap-2">
    <div>
      <UButtonGroup size="lg" orientation="horizontal">
        <!-- <USelectMenu v-model="" :options="['资源', '店铺']" @change="e => console.log(e)" /> -->

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
      <UButton v-for="(item, i) in categorys" :key="i" variant="link" @click="toggleSelectedCategory(item)">
        {{ item.Name }}
      </UButton>
    </div>
    <div class="flex items-center justify-start gap-2">
      <div class="typography-muted">
        标签
      </div>
      <UButton v-for="(item, i) in tags" :key="i" variant="link" @click="toggleSelectedTags(item)">
        {{ item }}
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
          {{ tag }}
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



  <div class="gap-5 px-4 grid grid-cols-2 md:grid-cols-4">
    <UserSectionCardResource
      v-for="item, i in data.Rows"
      :key="i"
      :to="`/user/resource/square/tool/${item.ID}`"
      :hot="item.Download"
      :tags="item.Tags ?? []"
      :title="item.Name"
      :description="item.Description"
      :category="item.ClassName"
      :img="item.Ico"
    />
  </div>

  <div class="flex justify-center my-5">
    <UPagination
      :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: '上一页', color: 'gray' }"
      :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: '下一页', color: 'gray' }"
      :model-value="pageIndex"
      :total="data.Total"
    />
  </div>

  <!--
  <TableBase
    $query="query"
    $page-index="pageIndex"
    $page-size="pageSize"
    :error="error"
    :loading="pending"
    :list="data.Rows ?? []"
    :page-total="data.Total"
    :columns="columns"
    :menus="menus"
    :refresh="refresh"
  >
    <template #ExploreTime-data="{ row }">
      {{ format.dateTime((row.ExploreTime)) }}
    </template>
<template #Status-data="{ row }">
      {{ row.Status === 1 ? '有效' : '已失效' }}
    </template>
<template #UserName-data="{ row }">
      <UButton variant="link" size="xs">
        用户A
      </UButton>
    </template>
</TableBase> -->
</template>
