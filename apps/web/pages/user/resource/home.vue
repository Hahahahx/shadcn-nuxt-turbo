<script setup lang="ts">
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import loadingImg from '../assets/loading.png'
import errorImg from '../assets/error.png'


definePageMeta({
  keepalive:true,
})

const props = defineProps({
  pageSize: {
    type: Number,
    default: 100,
  },
})
const resource = useResourceStore()


const emits = defineEmits({
  cardClick: null,
})

// 搜索
const query = ref('')
const queryDebounced = refDebounced(query, 1000)

// const { data, refresh, pending, error } = useAsyncData(
//   () => resourceApi.list({
//     // Name: queryDebounced.value,
//     Page: 1,
//     PageSize: 100,
//     ClassName: selected.value?.ID ? selected.value?.Name : undefined,
//     // Tags: selectedTags.value ?? [],
//     // SortName:sort.value,
//     // SortOrder:isDesc.value ? 'desc' : 'asc',
//   }), {
//   watch: [selected],
//   default: (): Page.Response<ResourceInfo> => ({
//     Rows: [],
//     Total: 0
//   }),
// })

const { data, pending } = useAsyncData(() => resourceApi.dashboard(), {
  default: (): Page.Response<ResourceDashboard> => ({
    Rows: [],
    Total: 0
  })
})


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

const { data: official } = useAsyncData(() => storeApi.official(), {
  default: (): Page.Response<StoreInfo> => ({
    Rows: [],
    Total: 0
  })
})
const officialList = computed(() => {
  if (!official.value?.Rows?.length) {
    return []
  }
  if (official.value.Rows.length == 1){
    return new Array(6).fill(official.value.Rows[0])
  }
  if (official.value.Rows.length == 2) {
    return [...official.value.Rows, ...official.value.Rows, ...official.value.Rows]
  }

  if(official.value.Rows.length < 5){
    return [ ...official.value.Rows, ...official.value.Rows]
  }  else {
    return official.value.Rows
  }
})

// 列表
const list = ref<ViewCard[]>([])
const page = ref(1)
const loading = ref(true)

onMounted(() => {
  handleLoadMore()
})

// 加载更多
function handleLoadMore() {
}

// 删除
function handleDelete(item: ViewCard, index: number) {
  list.value.splice(index, 1)
}

const modal = useModal()
const handleClick = (row: ResourceInfo) => {
  navigateTo(`/user/resource/${row.ID}`)
  // modal.open(Info, {
  //   row,
  // })
}

// function handleClick(item: ViewCard) {
//   emits('cardClick', item)

//   console.log('----------------------')

// }

function imageLoad(url: string) {
  console.log(`${url}: 加载完成`)
}

function imageError(url: string) {
  console.error(`${url}: 加载失败`)
}

function imageSuccess(url: string) {
  console.log(`${url}: 加载成功`)
}

function afterRender() {
  loading.value = false
  console.log('计算完成')
}



const options = reactive({
  // 唯一key值
  rowKey: 'id',
  // 卡片之间的间隙
  gutter: 14,
  // 是否有周围的gutter
  hasAroundGutter: true,
  // 卡片在PC上的宽度
  width: 350,
  // 自定义行显示个数，主要用于对移动端的适配
  breakpoints: {
    1200: {
      // 当屏幕宽度小于等于1200
      rowPerView: 4,
    },
    800: {
      // 当屏幕宽度小于等于800
      rowPerView: 3,
    },
    500: {
      // 当屏幕宽度小于等于500
      rowPerView: 2,
    },
  },
  // 动画效果
  animationEffect: 'animate__fadeInUp',
  // 动画时间
  animationDuration: 1000,
  // 动画延迟
  animationDelay: 300,
  // 背景色
  backgroundColor: 'rgba(0,0,0,0)',
  // imgSelector
  imgSelector: 'src.original',
  // 加载配置
  loadProps: {
    loading: loadingImg,
    error: errorImg,
    ratioCalculator: (width: number, height: number) => {
      // 我设置了最小宽高比
      const minRatio = 3 / 4
      const maxRatio = 4 / 3
      return Math.random() > 0.5 ? minRatio : maxRatio
    },
  },
  // 是否懒加载
  lazyload: true,
  align: 'center',
  crossOrigin: true,
})




// const { data: categorys } = useAsyncData('commonApi.categorys', commonApi.categorys, {
//   default: (): CategoryInfo[] => ([]),
//   transform(data: CategoryInfo[]) {
//     return [all, ...data]
//   }
// })

const tabsCategory = computed(() => {
  return data.value.Rows.map((item) => ({
    label: item.Name,
    value: item.ID,
    list:item.ResourceFile,
  }))
})

const selected = ref<string>()
const selectedList = computed(() => {
  if (selected.value) {
    return selected.value
  }
  return data.value.Rows.find((item) => item.Name === tabsCategory.value[0].label)?.ResourceFile ?? []
})

function onChange(index: number) {
  selected.value = data.value.Rows.find((item) => item.Name === tabsCategory.value[index].label)?.Name
}


const items = [
  [{
    label: '资源',
    click: () => {
      navigateTo('/user/resource')
    }
  }, {
    label: '店铺',
    click: () => {
      navigateTo('/user/resource/square/store')
    }
  }]
]
</script>



<template>
  <div style="min-height: 100%; width:100%">
    <div class="flex flex-col items-center justify-center py-10 container mx-auto">
      <img src="/team-presentation-7-77.svg" class="w-[200px] h-[200px]">
      <div>
        <UButtonGroup size="lg" rientation="horizontal">
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
    </div>
    <div v-if="officialList.length" class=" py-5">
      <div class="flex items-center justify-between mb-4 px-4 mx-auto">
        <h2 class=" typography-h4 ">
          官方店铺
        </h2>
        <UButton variant="link" to="/user/resource/square/store">
          查看更多>>
        </UButton>
      </div>
      <div class="singleLine py-5">
        <Vue3SeamlessScroll :list="officialList" direction="left" :single-line="true">
          <UserSectionCardResource
            v-for="shop, i in officialList"
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
          >
            <template #header-bottom="{ tags}">
              <div class="flex gap-2 justify-start items-end">
                <div class="typography-muted flex justify-start items-center gap-2">
                  <div class="i-solar-bookmark-circle-bold-duotone h-4 w-4 text-green-500 " />
                  {{
                    tags?.join(', ')
                  }}
                </div>
              </div>
            </template>
          </UserSectionCardResource>
        </Vue3SeamlessScroll>
      </div>
    </div>

    <div class="flex items-center justify-between mb-4 px-4  mx-auto">
      <h2 class=" typography-h4">
        资源推荐
      </h2>
      <UButton variant="link" :to="`/user/resource/square/search?category=${selected}`">
        查看更多>>
      </UButton>
    </div>
    <div class=" mx-auto">
      <div class="py-5 flex justify-center items-center">
        <UTabs
          :items="tabsCategory"
          class="w-full flex flex-col justify-center items-center"
          :ui="{
            list: {
              width:'max-w-[700px] ',
              tab: {
                font: 'text-indigo-500'
              }
            }
          }"
          @change="onChange"
        >
          <template #item="{item}">
            <Waterfall
              :list="item.list"
              :row-key="options.rowKey"
              :gutter="options.gutter"
              :has-around-gutter="options.hasAroundGutter"
              :width="options.width"
              :breakpoints="options.breakpoints"
              :img-selector="options.imgSelector"
              :background-color="options.backgroundColor"
              :animation-effect="options.animationEffect"
              :animation-duration="options.animationDuration"
              :animation-delay="options.animationDelay"
              :lazyload="options.lazyload"
              :load-props="options.loadProps"
              :cross-origin="options.crossOrigin"
              :align="options.align"
              @after-render="afterRender"
            >
              <template #item="{ item }">
                <div class="group">
                  <div class="overflow-hidden rounded-md bg-gray-800  dark:bg-gray-900 relative" @click="handleClick(item)">
                    <LazyImg
                      :url="resourceApi.resolution(item.Background, 'st3',true)"
                      :title="item.Name"
                      :alt="item.Name"
                      class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
                      @load="imageLoad"
                      @error="imageError"
                      @success="imageSuccess"
                    />
                    <UBadge color="gray" class="absolute bottom-2 right-2">
                      {{ item.ClassName }}
                    </UBadge>
                  </div>
                  <div class="p-4 space-y-1">
                    <h2 class="typography-small">
                      {{ item.Name }}
                    </h2>
                    <div class="typography-muted">
                      {{ item.Description }}
                    </div>
                    <NuxtLink :to="`/store/${item.ShopName}`" target="_blank" class="pt-2 gap-2 flex justify-start items-center">
                      <UAvatar size="3xs" :src="item.ShopIco" alt="Avatar" />
                      <div class="text-xs">
                        {{ item.ShopName }}
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </template>
            </Waterfall>
          </template>
        </UTabs>
      </div>
    </div>
  </div>
</template>
