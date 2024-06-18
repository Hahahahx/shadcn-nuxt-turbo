<script setup lang="tsx">


const { userInfo } = useUserStore()



</script>



<template>
  <UDashboardSection :title="$t('setting.profile.title')" :description="$t('setting.profile.desc')">
    <UFormGroup
      name="NickName"
      :label="$t('setting.profile.username.title')"
      :description="$t('setting.profile.username.desc')"
      required
      class="grid grid-cols-2 gap-2"
      :ui="{ container: '' }"
    >
      <UserFormSettingEditName />
    </UFormGroup>

    <UFormGroup
      :label="$t('setting.profile.email.title')"
      :description="$t('setting.profile.email.desc')"
      required
      class="grid grid-cols-2 gap-2"
      :ui="{ container: '' }"
    >
      <UserFormSettingEditEmail />
    </UFormGroup>
    <UFormGroup
      :label="$t('setting.profile.phone.title')"
      :description="$t('setting.profile.phone.desc')"
      class="grid grid-cols-2 gap-2 items-center"
      :ui="{ container: '' }"
    >
      <UserFormSettingEditPhone />
    </UFormGroup>

    <UFormGroup
      label="身份验证器"
      description="绑定后，您可以使用身份验证器进行二次验证"
      class="grid grid-cols-2 gap-2"
      :ui="{ container: 'text-right' }"
    >
      <UserFormSettingEditTotp />
    </UFormGroup>

    <UFormGroup
      label="双重身份认证"
      description="开启双重身份认证后，您需要使用手机号和邮箱进行登录和身份验证。"
      class="grid grid-cols-2 gap-2"
      :ui="{ container: 'text-right' }"
    >
      <UserFormSettingEditSafe />
    </UFormGroup>
  </UDashboardSection>
</template>
