export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useUserStore()

  if (process.client) {
    console.log(to, from)

    if (!storage.GetItem('UToken')) {
      return navigateTo({
        path: '/login',
        query: {
          state: 'none-token',
        },
      })
    }

    if (!user.userInfo?.Email)
      user.getUserInfo()
      // toast.error('无权访问')
      // return navigateTo('/login')
  }
})
