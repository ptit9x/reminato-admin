import { ACCESS_ROLE, ACCESS_STAFF, ACCESS_USER } from '@/utils'

const Menu = [
  { header: 'Apps' },
  {
    title: 'Bảng điều khiển',
    group: 'apps',
    icon: 'mdi-view-dashboard',
    name: 'dashboard',
    href: '/'
  },
  {
    title: 'Quản lý nhân viên',
    group: 'apps',
    name: 'staff',
    icon: 'mdi-account-multiple',
    href: '/staff',
    permissions: [ACCESS_STAFF]
  },
  {
    title: 'Vai trò & Quyền',
    group: 'apps',
    name: 'role',
    icon: 'mdi-lock',
    href: '/role',
    permissions: [ACCESS_ROLE]
  },
  { divider: true },
  { header: 'Quản lý' },
  {
    icon: 'mdi-account-multiple',
    title: 'Users',
    group: 'manage',
    items: [
      {
        name: 'user',
        href: '/user',
        title: 'Khách hàng',
        permissions: [ACCESS_USER]
      },
      {
        name: 'kyc',
        href: '/kyc',
        title: 'KYC',
        permissions: [ACCESS_USER]
      }
    ]
  },
  {
    title: 'Giao dịch',
    group: 'manage',
    icon: 'mdi-format-list-bulleted',
    items: [
      {
        name: 'history',
        href: '/history',
        title: 'Giao dịch đang chờ'
      },
      {
        name: 'pattern',
        href: '/pattern',
        title: 'Lịch sử giao dịch'
      }
    ]
  },
  {
    title: 'Cài đặt',
    group: 'manage',
    name: 'setting',
    icon: 'mdi-checkerboard',
    href: '/setting'
  }
]

export default Menu
