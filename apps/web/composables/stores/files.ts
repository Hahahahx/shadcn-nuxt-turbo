


export const useFileStore = defineStore('files', {
  state: (): {
    pendings: {
      path: string
      file: File
    }[],
    success: {
      path: string
      file: File
    }[],
    error: {
      path: string
      file: File
    }[],
    uploading: {
      path: string
      file: File
    }[]
    isFilesSiderOpen: Ref<boolean>
  } => ({
    pendings: [],
    success: [],
    error: [],
    uploading: [],
    isFilesSiderOpen: ref(false)
  }),
  actions: {
    pendingFiles(files: File[], path: string) {
      files.forEach(f => {
        this.pendings.push({ file: f, path })
      })
    },
    removePendingFile(file: File) {
      const index = this.pendings.findIndex(f => f.file.name === file.name)
      if (index !== -1) {
        this.pendings.splice(index, 1)
      }
    },
    removeUploadingFile(file: File) {
      const index = this.uploading.findIndex(f => f.file.name === file.name)
      if (index !== -1) {
        this.uploading.splice(index, 1)
      }
    },
    uploadFileSuccess(file: File, path: string) {
      this.removeUploadingFile(file)
      this.success.push({ file, path })
    },
    uploadFileError(file: File, path: string) {
      this.removeUploadingFile(file)
      this.error.push({ file, path })
    },
    uploadFile(): { file: File, path: string } | undefined {
      const f = this.pendings.shift()
      f && this.uploading.push(f)
      return f
    },
    recoverErrorFile(file: File, path: string) {
      const index = this.error.findIndex(f => f.file.name === file.name)
      if (index !== -1) {
        this.error.splice(index, 1)
      }
      this.pendings.push({ file, path })
    }
  },
  // persist: {
  //   storage: persistedState.sessionStorage
  // }
})




// @ts-ignore
if (import.meta.hot)
  // @ts-ignore
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
