<script setup lang="ts">
import { ref } from 'vue'
import { watchOnce } from '@vueuse/core'
import { Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel'


const model = defineModel({
  type: Boolean
})

const props = defineProps<{
  path: string
  file: string
}>()

const { data, refresh, pending, error } = useAsyncData(
  'image-view',
  () => bucketApi.detail.list({
    Page: 0,
    PageSize: 999,
    Search: media.images.join(',')
  }, props.path), {
  // watch: [props],
  default: (): Page.Response<FileInfo> => ({
    Rows: [],
    Total: 0
  }),
  // immediate: false
})

const img = ref<FileInfo>()

effect(()=>{
  img.value = data.value.Rows.find(i => i.Name === props.file)
})

watch(()=>props.path, () => {
  refresh()
})


const onNext =()=>{
  const index = data.value.Rows.findIndex(i => i.Name === img.value?.Name)
  if (index !== -1 && data.value.Rows[index + 1]) {
    img.value = data.value.Rows[index + 1]
  }
}

const onPrevious =()=>{
  const index = data.value.Rows.findIndex(i => i.Name === img.value?.Name)
  if (index !== -1 && data.value.Rows[index - 1]) {
    img.value = data.value.Rows[index - 1]
  }
}



</script>

<template>
  <UModal
    v-model="model"
    fullscreen
    :overlay="false"
    :ui="{
      background: '!bg-gray-900/10 backdrop-blur',
    }"
  >
    <div class="w-screen h-screen overflow-y-auto">
      <div class="container mx-auto min-h-screen flex items-center ">
        <UButton
          color="gray"
          size="lg"
          variant="outline"
          icon="i-heroicons-x-mark-20-solid"
          class="absolute top-5 right-5 z-50"
          @click="model = false"
        />
        <div v-if="pending">
          <UIcon name="i-mdi-loading " class="text-4xl animate-spin" />
        </div>
        <div v-else class="w-full px-20 h-fit">
          <Carousel class="relative w-full  ">
            <CarouselContent>
              <CarouselItem>
                <div class="p-1 w-full flex flex-col justify-center items-center h-full">
                  <AspectRatio :ratio="16 / 9">
                    <img
                      :src="img?.DownloadUrl"
                      alt="Image"
                      class="rounded-md object-cover h-full w-full"
                    >
                  </AspectRatio>
                  <span class=" typography-muted text-center">
                    {{ img?.Name }}
                  </span>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious @click="onPrevious" />
            <CarouselNext @click="onNext" />
          </Carousel>

          <!-- <Carousel class="relative w-full " @init-api="(val) => emblaThumbnailApi = val">
            <CarouselContent class="flex gap-1 ml-0">
              <CarouselItem
                v-for="(img, index) in data.Rows"
                :key="index"
                class="pl-0 basis-1/4 cursor-pointer my-auto"
                @click="onThumbClick(index)"
              >
                <div class="p-1" :class="index === selectedIndex ? '' : 'opacity-50'">
                  <AspectRatio :ratio="16 / 9">
                    <img :src="bucketApi.detail.downloadUrl(img)" alt="Image" class="rounded-md object-cover">
                  </AspectRatio>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel> -->
        </div>
      </div>
    </div>
  </UModal>
</template>
