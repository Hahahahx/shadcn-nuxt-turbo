export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useUserStore()

  if (process.client) {
    if (!storage.GetItem('UToken')) {
      return navigateTo({
        path: '/login',
        query: {
          state: 'none-token',
        },
      })
    }
  }
})
