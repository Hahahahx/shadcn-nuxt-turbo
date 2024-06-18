export function useConfig() {
  // const { t } = useI18n()

  return {
    userSider: [
      {
        group: '资源概览',
        list: [{
          label: '资源广场',
          icon: 'i-solar-asteroid-bold-duotone',
          to: '/user/resource/home',
        }, {
          label: '我的店铺',
          icon: 'i-solar-card-search-bold-duotone',
          to: '/user/resource/store',
        }],
      },
      {
        group: '数据存储',
        list: [{
          id: 'dashboard',
          key: 'dashboard',
          label: '数据概览', // t('user.sider.data.dashboard'),
          icon: 'i-solar-chart-2-bold-duotone',
          to: '/user/data/dashboard',
          shortcuts: ['G', 'D'],
        }, {
          id: 'bucket',
          key: 'bucket',
          label: '桶列表',
          icon: 'i-solar-archive-bold-duotone',
          to: '/user/data/bucket',
          shortcuts: ['G', 'B'],
        }, {
          id: 'share',
          key: 'share',
          label: '分享列表', // t('user.sider.data.share'),
          icon: 'i-solar-clouds-bold-duotone',
          to: '/user/data/share',
          shortcuts: ['G', 'S'],
        }, {
          id: 'filer',
          key: 'filer',
          label: '文件网关', // t('user.sider.resource.filer'),
          icon: 'i-solar-diploma-verified-bold-duotone',
          to: '/user/data/filer',
        }],
      },
      {
        group: '文档数据', /// t('user.sider.docs'),
        list: [{
          id: 'api',
          key: 'api',
          label: '接口', // t('user.sider.docs.api'),
          icon: 'i-solar-colour-tuneing-bold-duotone',
          to: 'https://docs.ocloud.ihep.ac.cn/docs/osca-oss/api-manual/basic-concepts',
          target: '_blank',
        }, {
          id: 'sdk',
          key: 'sdk',
          label: 'SDK', // t('user.sider.docs.sdk'),
          icon: 'i-solar-code-circle-bold-duotone',
          to: 'https://docs.ocloud.ihep.ac.cn/docs/osca-oss/go/quick-start',
          target: '_blank',
        }],
      },
      {
        group: '系统管理', // t('user.sider.system'),
        list: [{
          id: 'log',
          key: 'log',
          label: '日志管理', // t('user.sider.system.log'),
          icon: 'i-solar-clipboard-bold-duotone',
          to: '/user/system/log',
        }, {
          id: 'secret',
          key: 'secret',
          label: '密钥管理', // t('user.sider.system.access-key'),
          icon: 'i-solar-folder-security-bold-duotone',
          to: '/user/system/access-key',
        }],
      },
    ],
  }
}

export type Config = ReturnType<typeof useConfig>
