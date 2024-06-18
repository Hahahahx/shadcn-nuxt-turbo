import type { UserInfo } from '~/api/user'

export const useUserStore = defineStore('user', {
  state: (): {
    userInfo: UserInfo
  } => ({
    userInfo: {
      CreateTime: 0,
      Email: '',
      Id: 0,
      IsAdmin: 0,
      NickName: '',
      Status: 0,
      UpdateTime: 0,
      DepId: 0,
      IsSafeCheck: 0,
      IsTotp: 0,
      Phone: '',
      IsBindIHEPEmail: 0,
      status: 0,
      IsBindCarsiUID: 0,
      IsBindBeiHang: 0,
    },
  }),
  actions: {
    async getUserInfo() {
      this.userInfo = await userApi.info()
    },
  },
  persist: {
    storage: persistedState.sessionStorage,
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
