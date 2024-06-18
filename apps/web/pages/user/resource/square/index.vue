<script setup lang="ts">

import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
const query = ref('')
const resource = useResourceStore()

const { data } = useAsyncData(() => resourceApi.dashboard(), {
  default: (): Page.Response<ResourceDashboard> => ({
    Rows: [],
    Total: 0
  })
})


const { data: official } = useAsyncData(() => storeApi.official(), {
  default: (): Page.Response<StoreInfo> => ({
    Rows: [],
    Total: 0
  })
})
const list = computed(() => {
  if (official.value.Rows.length < 3) {
    return [...official.value.Rows, ...official.value.Rows]
  }else{
    return official.value.Rows
  }
})

const { data: categorys } = useAsyncData('commonApi.categorys', commonApi.categorys, {
  default: (): CategoryInfo[] => ([])
})

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

watchDebounced(
  query,
  () => {
    if (query.value) {
      resource.search = query.value
      navigateTo(`/user/resource/square/search?query=${query.value}`)
    }
  },
  { debounce: 500, maxWait: 1000 },
)
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
          icon="i-heroicons-magnifying-glass-20-solid"
          size="lg"
          color="white"
          class="w-[350px]"
          :trailing="false"
          :placeholder="`搜索全部资源...`"
        />
      </UButtonGroup>
    </div>
    <div class="flex gap-2">
      <UButton
        v-for="(item, i) in categorys"
        :key="i"
        variant="link"
        :to="`/user/resource/square/search?category=${item.Name}`"
      >
        {{ item.Name }}
      </UButton>
    </div>
  </div>
  <div class="">
    <div class="flex items-center justify-between my-4 px-4  mx-auto">
      <h2 class=" typography-h4">
        官方库
      </h2>
      <UButton variant="link" to="/user/resource/square/store">
        查看更多>>
      </UButton>
    </div>
    <div class="singleLine py-5">
      <Vue3SeamlessScroll :list="list" direction="left" :single-line="true">
        <UserSectionCardResource
          v-for="shop, i in list"
          :key="i"
          compact
          :shadow="false"
          :to="`/store/${shop.Name}`"
          :tags="shop.Tags ?? []"
          :hot="0"
          :title="shop.Name"
          :description="shop.Mark"
          :category="shop.ClassName"
          :img="shop.Ico"
          class="w-[300px] mx-5"
        />
      </Vue3SeamlessScroll>
    </div>

    <UDivider class="my-5" />

    <div v-for="(cat, i) in data.Rows" :key="i" class=" px-4 container mx-auto">
      <div class="flex items-center justify-between my-4">
        <h2 class=" typography-h4">
          {{ cat.Name }}
        </h2>
        <UButton variant="link" :to="`/user/resource/square/search?category=${cat.Name}`">
          查看更多>>
        </UButton>
      </div>
      <div class="grid grid-cols-3 gap-10 mb-10">
        <!-- <UCard :ui="{ body: { padding: '!p-0' } }">
          <img :src="cat.Name" alt="Image" class="rounded-md object-cover h-full">
          <template #footer>
            <div class="flex gap-2 items-center justify-between">
              <div class="text-sm font-semibold">
                {{ cat.Name }}
              </div>
              <UButton variant="link" :to="`/user/resource/square/search?category=${cat.Name}`">
                查看更多
              </UButton>
            </div>
          </template>
</UCard> -->

        <UserSectionCardResource
          v-for="resource, i in cat.ResourceFile"
          :key="i"
          :time="format.dateTime(resource.Createtime)"
          :shadow="false"
          :to="`/user/resource/square/tool/${resource.ID}`"
          :hot="resource.Download"
          :tags="resource.Tags ?? []"
          :title="resource.Name"
          :description="resource.Description"
          :category="resource.ClassName"
          :img="resource.Ico"
        />
      </div>
    </div>
  </div>
</template>



<style scoped>

/*
.singleLine span {
  display: block;
  height: 20px;
  margin-top: 12px;
  white-space: nowrap;
} */
</style>
