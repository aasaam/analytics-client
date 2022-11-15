module.exports = [
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 2,
        name: '__NAME2__',
        item: '__URL2__',
      },
      {
        '@type': 'ListItem',
        position: 1,
        name: '__NAME1__',
        item: '__URL1__',
      },
    ],
  },
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 2,
        name: 'invalid__NAME2__',
        item: '__URL2__',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'invalid__NAME1__',
        item: '__URL1__',
      },
    ],
  },
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'invalid__NAME2__',
        item: '__URL2__',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'invalid__NAME1__',
        item: '__URL1__',
      },
    ],
  },
  [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '__NAME1__',
          item: '__URL1__',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '__NAME2__',
          item: '__URL2__',
        },
      ],
    },
  ],
  {
    mainEntityOfPage: {
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': '__URL1__',
              name: '__NAME1__',
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@id': '__URL2__',
              name: '__NAME2__',
            },
          },
        ],
      },
    },
  },
];
