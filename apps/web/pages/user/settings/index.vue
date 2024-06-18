<script setup lang="tsx">
const { userInfo } = useUserStore()

const toast = useToastHandle()

const { identityCheck } = useVerify()
const bind = async (fn: () => Promise<any>) => {
  try {
    await identityCheck(async () => {
      await fn()
    })
  } catch (e: any) {
    toast.error(e.message)
  }
}
</script>

<template>
  <UDashboardPanelContent class="pb-24">
    <UDashboardSection :title="$t('setting.theme.title')" :description="$t('setting.theme.desc')">
      <template #links>
        <!-- <UColorModeSelect color="gray" /> -->
        <ColorPickerPanel />
      </template>
    </UDashboardSection>

    <UDivider class="mb-4" />

    <UserFormSetting />

    <UDivider class="mb-4" />

    <UDashboardSection :title="$t('setting.account.title')" description="将我们的账号与一些第三方账号绑定，可以更方便的进行账号管理">
      <template #links>
        <UserFormSettingEditPassword />
      </template>

      <UPricingGrid :compact="false">
        <UPricingCard
          description="账户将绑定到高能物理研究所统一认证账号"
          :badge="{ label: userInfo.IsBindIHEPEmail ? '已绑定' : '未绑定', }"
          :button="{
            label: userInfo.IsBindIHEPEmail ? '解绑' : '绑定', color: userInfo.IsBindIHEPEmail ? 'red' : 'primary', click: () => bind(() => userApi.bindSSO('ihep', !!userInfo.IsBindIHEPEmail))
          }"
        >
          <template #title>
            <img src="/ihep.jpg" class=" object-cover h-12 w-14">
          </template>
        </UPricingCard>
        <!-- <UPricingCard
          description="账户将绑定到北京航天航空大学统一认证账号"
          :badge="{ label: userInfo.IsBindBeiHang ? '已绑定' : '未绑定', }"
          :button="{ label: userInfo.IsBindBeiHang ? '解绑' : '绑定', color: userInfo.IsBindBeiHang ? 'red' : 'primary' }"
        >
          <template #title>
            <img src="/beihang.jpg" class=" object-cover h-12 w-14">
          </template>
        </UPricingCard> -->
        <UPricingCard
          description="账户将绑定到Carsi教育网联邦认证"
          :badge="{ label: userInfo.IsBindBeiHang ? '已绑定' : '未绑定', }"
          :button="{
            label: userInfo.IsBindCarsiUID ? '解绑' : '绑定', color: userInfo.IsBindCarsiUID ? 'red' : 'primary', click: () => bind(() => userApi.bindSSO('carsipre', !!userInfo.IsBindCarsiUID))
          }"
        >
          <template #title>
            <img src="/carsi_blue.png" class=" object-cover h-12 w-14">
          </template>
        </UPricingCard>
      </UPricingGrid>
    </UDashboardSection>
  </UDashboardPanelContent>
</template>
