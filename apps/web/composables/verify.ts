import Security from '~/components/common/form/security.vue'



export const useVerify = () => {

  const modal = useModal()
  const toast = useToastHandle()

  return {
    async identity(fn: () => Promise<void>) {
      try {
        await fn()
      } catch (e: any) {
        if (e === 60) {
          modal.open(Security, {
            async onSubmit() {
              // console.log(value)
              await fn()
            }
          })
        } else {
          toast.error(e.message)
        }
      }
    },
    async identityCheck(fn: () => Promise<void>) {
      try {
        await authApi.postIsSafe()
        await fn()
      } catch (e: any) {
        if (e === 60) {
          modal.open(Security, {
            async onSubmit() {
              await fn()
            }
          })
        } else {
          toast.error(e.message)
        }
      }
    }
  }

}
