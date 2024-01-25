const navigation = () => {
  const navs = [
    /* {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      title: 'Access Control',
      icon: 'tabler:shield',
    }, */
    {
      path: '/dashboard',
      action: 'read',
      subject: 'dashboard',
      title: 'Dashboard',
      icon: 'tabler:smart-home',
    },

    /* {
      title: 'Home',
      path: '/home',
      icon: 'tabler:smart-home',
    }, */
    {
      title: 'Industries',
      subject: 'industries',
      path: '/industries',
      icon: 'tabler:table',
    },
    {
      title: 'Categories',
      action: 'read',
      subject: 'categories',
      path: '/categories',
      icon: 'tabler:category',
    },
    {
      title: 'Questions',
      subject: 'questions',
      path: '/questions',
      icon: 'tabler:question-mark',
    },
    // {
    //   title: 'History',
    //   subject: 'userHistory',
    //   path: '/history',
    //   icon: 'tabler:history',
    // },
    {
      title: 'Users',
      icon: 'tabler:user',
      children: [
        {
          // title: 'List',
          title: 'List',
          path: '/apps/user/list'
        },
        {
          // title: 'View',
          title: 'Settings',
          children: [
            {
              title: 'Invoice',
              path: '/apps/user/view/account'
            },
            {
              title: 'Submissions',
              path: '/apps/user/view/submissions'
            },
            {
              title: 'Billing & Plans',
              path: '/apps/user/view/billing-plan'
            }
          ]
        }
      ]
    },

    // {
    //   title: 'Pricing',
    //   action: 'read',
    //   subject: 'pricing',
    //   icon: 'tabler:lock',
    //   path: '/pages/pricing'
    // },
    // {
    //   title: 'Dialog Example',
    //   action: 'read',
    //   subject: 'dialog',
    //   icon: 'tabler:lock',
    //   path: '/pages/dialog-examples'
    // },
    // {
    //   title: 'Account Settings',
    //   subject: 'account-settings',
    //   children: [
    //     {
    //       title: 'Account',
    //       subject: "tab-account",
    //       path: '/pages/account-settings/account'
    //     },
    //     {
    //       title: 'Security',
    //       subject: "tab-security",
    //       path: '/pages/account-settings/security'
    //     },
    //   ]
    // },
    // {
    //   title: 'Auth Pages',
    //   icon: 'tabler:lock',
    //   children: [
    //     {
    //       title: 'Login',
    //       children: [
    //         {
    //           openInNewTab: true,
    //           title: 'Login',
    //           path: '/login-v1'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   title: 'Forget Password',
    //   icon: 'tabler:lock',
    //   children: [
    //     {
    //       openInNewTab: true,
    //       title: 'Login',
    //       path: '/forgot-password'
    //     }
    //   ]
    // },
    // {
    //   title: 'Tables',
    //   icon: 'tabler:table',
    //   path: '/tables/mui'
    // },
    // {
    //   title: 'Mui DataGrid',
    //   icon: 'tabler:layout-grid',
    //   path: '/tables/data-grid'
    // },
    // {
    //   sectionTitle: 'Forms & Tables'
    // },
    // {
    //   title: 'Form Elements',
    //   icon: 'tabler:toggle-left',
    //   children: [
    //     {
    //       title: 'Text Field',
    //       path: '/forms/form-elements/text-field'
    //     },
    //     {
    //       title: 'Select',
    //       path: '/forms/form-elements/select'
    //     },
    //     {
    //       title: 'Checkbox',
    //       path: '/forms/form-elements/checkbox'
    //     },
    //     {
    //       title: 'Radio',
    //       path: '/forms/form-elements/radio'
    //     },
    //     {
    //       title: 'Custom Inputs',
    //       path: '/forms/form-elements/custom-inputs'
    //     },
    //     {
    //       title: 'Textarea',
    //       path: '/forms/form-elements/textarea'
    //     },
    //     {
    //       title: 'Autocomplete',
    //       path: '/forms/form-elements/autocomplete'
    //     },
    //     {
    //       title: 'Date Pickers',
    //       path: '/forms/form-elements/pickers'
    //     },
    //     {
    //       title: 'Switch',
    //       path: '/forms/form-elements/switch'
    //     },
    //     {
    //       title: 'File Uploader',
    //       path: '/forms/form-elements/file-uploader'
    //     },
    //     {
    //       title: 'Editor',
    //       path: '/forms/form-elements/editor'
    //     },
    //     {
    //       title: 'Slider',
    //       path: '/forms/form-elements/slider'
    //     },
    //     {
    //       title: 'Input Mask',
    //       path: '/forms/form-elements/input-mask'
    //     },
    //   ]
    // },
    // {
    //   icon: 'tabler:layout-navbar',
    //   title: 'Form Layouts',
    //   path: '/forms/form-layouts'
    // },
    // {
    //   title: 'Form Validation',
    //   path: '/forms/form-validation',
    //   icon: 'tabler:checkbox'
    // },
    // {
    //   title: 'Form Wizard',
    //   path: '/forms/form-wizard',
    //   icon: 'tabler:text-wrap-disabled'
    // },
  ]

  const checkAdminObj = localStorage.getItem('__user_bzc_admin') ? JSON.parse(localStorage.getItem('__user_bzc_admin')): {};
  if (checkAdminObj && !checkAdminObj?.admin) {
    navs.push({
      title: 'Account Settings',
      subject: 'account-settings',
      children: [
        {
          title: 'Account',
          subject: "tab-account",
          path: '/pages/account-settings/account'
        },
        {
          title: 'Security',
          subject: "tab-security",
          path: '/pages/account-settings/security'
        },
      ]
    },)
  }
  return navs;
}

export default navigation;
