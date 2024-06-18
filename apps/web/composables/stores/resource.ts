import type { UserInfo } from '~/api/user'

export const useResourceStore = defineStore('user', {
  state: (): {
    search:string
    searchThrottled:Ref<string>
  } => ({
    search:'',
    searchThrottled:refThrottled(ref(''),300)
  }),
  actions: {
  },
  persist: {
    storage: persistedState.sessionStorage
  }
})




// @ts-ignore
if (import.meta.hot)
  // @ts-ignore
  import.meta.hot.accept(acceptHMRUpdate(useResourceStore, import.meta.hot))
