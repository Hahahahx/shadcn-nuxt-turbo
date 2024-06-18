<script setup lang="ts">
// import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

// const route = useRoute()
// const appConfig = useAppConfig()
const { userSider: sider } = useConfig()
// const { isHelpSlideoverOpen } = useDashboard()

// const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation(), { default: () => [] })
// const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', { default: () => [], server: false })
// provide('navigation', navigation)

// const groups = [
//   ...sider.map(group => ({
//     key: group.group,
//     label: group.group,
//     commands: group.list,
//   })),
// ]

// const { isFilesSiderOpen } = useDashboard()
// const defaultColors = ref(['green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet'].map(color => ({ label: color, chip: color, click: () => appConfig.ui.primary = color })))
// const colors = computed(() => defaultColors.value.map(color => ({ ...color, active: appConfig.ui.primary === color.label })))

// const { uploading } = useFileStore()
</script>

<template>
  <div class="relative w-full min-h-screen md:flex">
    <div class="sticky h-screen md:w-[220px] lg:w-[280px] top-0 left-0 hidden border-r bg-muted/40 md:block">
      <LayoutSider :sider="sider" />
    </div>
    <div class="flex flex-col flex-1">
      <header class="flex h-18 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger as-child>
            <Button
              variant="outline"
              size="icon"
              class="shrink-0 md:hidden"
            >
              <Menu class="w-5 h-5" />
              <span class="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="flex flex-col">
            <nav class="grid gap-2 text-lg font-medium">
              <a
                href="#"
                class="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 class="w-6 h-6" />
                <span class="sr-only">Acme Inc</span>
              </a>
              <a
                href="#"
                class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                <Home class="w-5 h-5" />
                Dashboard
              </a>
              <a
                href="#"
                class="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
              >
                <ShoppingCart class="w-5 h-5" />
                Orders
                <Badge class="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
                  6
                </Badge>
              </a>
              <a
                href="#"
                class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                <Package class="w-5 h-5" />
                Products
              </a>
              <a
                href="#"
                class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                <Users class="w-5 h-5" />
                Customers
              </a>
              <a
                href="#"
                class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                <LineChart class="w-5 h-5" />
                Analytics
              </a>
            </nav>
            <div class="mt-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Upgrade to Pro</CardTitle>
                  <CardDescription>
                    Unlock all features and get unlimited access to our
                    support team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm" class="w-full">
                    Upgrade
                  </Button>
                </CardContent>
              </Card>
            </div>
          </SheetContent>
        </Sheet>
        <div class="flex-1 w-full">
          <form>
            <div class="relative">
              <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                class="w-full pl-8 shadow-none appearance-none bg-background md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="w-5 h-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main class="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6 h-[2000px]">
        <slot />
        <!-- <div class="flex items-center">
          <h1 class="text-lg font-semibold md:text-2xl">
            Inventory
          </h1>
        </div>
        <div class="flex items-center justify-center flex-1 border border-dashed rounded-lg shadow-sm">
          <div class="flex flex-col items-center gap-1 text-center">
            <h3 class="text-2xl font-bold tracking-tight">
              You have no products
            </h3>
            <p class="text-sm text-muted-foreground">
              You can start selling as soon as you add a product.
            </p>
            <Button class="mt-4">
              Add Product
            </Button>
          </div>
        </div> -->
      </main>
    </div>
  </div>
  <UDashboardLayout>
    <!-- 侧边栏 -->
    <!-- <LayoutSider :sider="sider" /> -->

    <!-- 内容 -->
    <UDashboardPage>
      <UDashboardPanel grow>
        <!-- 头部 -->
        <UDashboardNavbar>
          <template #title>
            <!-- <UContentSearchButton class="hidden md:flex w-52" :label="$t('search')" /> -->
            <!-- <UDashboardSearchButton class="w-[300px]" /> -->
          </template>
          <template #right>
            <!-- <UDocsSearchButton class="rounded-md" size="sm" /> -->
            <!-- <UContentSearchButton class="flex md:hidden" variant="link" :label="$t('search')" /> -->

            <UTooltip text="上传文件列表" :shortcuts="['F']">
              <UButton color="gray" variant="ghost" square @click="isFilesSiderOpen = true">
                <UChip v-if="uploading.length" color="red" inset>
                  <UIcon name="i-line-md-uploading-loop" class="w-5 h-5" />
                </UChip>
                <UIcon v-else name="i-solar-archive-up-minimlistic-bold-duotone" class="w-5 h-5" />
              </UButton>
            </UTooltip>
            <UColorModeButton />
            <!-- <LayoutUserNav /> -->
          </template>
        </UDashboardNavbar>

        <!-- 内容 -->
        <UPage class="pb-10 overflow-y-auto">
          <div class="sticky top-0 ">
            <div id="header" class="z-10 w-full backdrop-blur" />
          </div>
          <!-- <slot /> -->
        </UPage>
      </UDashboardPanel>
    </UDashboardPage>

    <!-- <UploadSider /> -->
  </UDashboardLayout>
</template>
