module.exports = {
  base: '/You-May-Not-Know-Vuejs/',
  title: '你也许不知道的 Vuejs',
  ga: 'UA-85991013-5',
  description: 'Vue 从入门到精通系列',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  markdown: {
    toc: {
      includeLevel: [2, 3, 4, 5, 6]
    }
  },
  themeConfig: {
    repo: 'yugasun/You-May-Not-Know-Vuejs',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '错别字纠正',
    sidebarDepth: 3,
    nav: [
      {
        text: '正文',
        link: '/art/',
      },
      {
        text: '人之初',
        link: '/donate/'
      },
      {
        text: '关于',
        link: '/about/'
      }
    ],
    sidebar: {
      '/art/': [
        '',
        'you-may-not-know-vuejs-1',
        'you-may-not-know-vuejs-2',
        'you-may-not-know-vuejs-3',
        'you-may-not-know-vuejs-4',
        'you-may-not-know-vuejs-5',
        'you-may-not-know-vuejs-6',
        'you-may-not-know-vuejs-7',
        'you-may-not-know-vuejs-8',
        'you-may-not-know-vuejs-9',
        'you-may-not-know-vuejs-10',
        'you-may-not-know-vuejs-11',
        'you-may-not-know-vuejs-12',
        'you-may-not-know-vuejs-13',
        'you-may-not-know-vuejs-14',
        'you-may-not-know-vuejs-15',
      ],
    }
  }
}
