import request from '@/utils/request'

export function getMenuTree() {
  return request({
    url: '/menu/getMenuTree',
    method: 'get'
  })
}

export function getRoleMenu(roleId) {
  return request({
    url: '/menu/getMenuListByRoleId/' + roleId,
    method: 'get'
  })
}
