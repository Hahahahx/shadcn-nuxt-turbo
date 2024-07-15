export const usePageStore = defineStore('page', {
  state: (): {
    title: string
  } => ({
    title: '',
  }),
  actions: {
    setTitle(title: string) {
      this.title = title
    },
  },
  persist: {
    storage: persistedState.sessionStorage,
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
