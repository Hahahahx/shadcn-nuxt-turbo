

export const useToastHandle = () => {

  // const toast = useToast()
  // const { t } = useI18n()

  return {
    info: (title: string, desc?: string) => {
      // toast.add({
      //   title: title,
      //   icon: 'i-solar-danger-broken',
      //   description: desc,
      // })

    },
    success: (desc?: string, title?: string) => {

      // toast.add({
      //   title:title ??  t('toast.success'),
      //   icon: 'i-heroicons-check-circle-20-solid',
      //   color: 'green',
      //   description: desc,
      // })

    },
    error: (desc?: string, title?: string) => {
      // toast.add({
      //   title: title ?? t('toast.error'),
      //   icon: 'i-heroicons-exclamation-triangle-16-solid',
      //   color: 'red',
      //   description: desc,
      // })

    },
  }
}
