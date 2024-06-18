export interface Notice {
  state: "loading" | "pending" | "error" | "success"
  title: string
  desc: string
  time: Date
}


export const useNoticeStore = defineStore('notice', {
  state: (): {
    notices: Notice[]
  } => ({
    notices: [],
  }),
  actions: {
    update(title: string, desc: string, state: "loading" | "pending" | "error" | "success") {
      const index = this.notices.findIndex((i) => i.title === title)
      if (index !== -1) {
        this.notices.splice(index, 1, { state: "loading", title, desc, time: new Date() })
      }
    },
    noticePending(title: string, desc: string) {
      this.notices.push({ state: "pending", title, desc, time: new Date() })
    },
    async filesPending(path: string, files: File[]) {
      files.map((file) => {
        this.noticePending(file.name, `${merticKB(file.size)}，${file.type}`)
      })
    },
    // async filesUpload() {
    //   const res = await bucketApi.detail.uploadUrl({ Path: path })
    //   for (const file of Array.from(files)) {
    //     try {
    //       this.update(file.name, `${merticKB(file.size)}，${file.type}，文件上传中...`, 'loading')
    //       await bucketApi.detail.upload(file, res.url, res.token)
    //     } catch (e: any) {
    //       // 单个文件上传失败报错信息
    //       this.update(file.name, `${merticKB(file.size)}，${file.type}，文件上传失败！`, 'error')
    //     }
    //   }
    // }
  },
  persist: {
    storage: persistedState.sessionStorage
  }
})




// @ts-ignore
if (import.meta.hot)
  // @ts-ignore
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
