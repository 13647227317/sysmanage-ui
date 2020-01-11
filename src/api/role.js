import request from '@/utils/request'

export function selectPage(params) {
  return request({
    url: '/role/selectPage',
    method: 'get',
    params: params
  })
}

export function deleteRole(roleId) {
  return request({
    url: '/role/delete/' + roleId,
    method: 'delete'
  })
}

export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

export function saveRole(data) {
  return request({
    url: '/role/save',
    method: 'post',
    data
  })
}

export function selectRoleByRoleCode(roleCode) {
  return request({
    url: '/role/getRoleByCode/' + roleCode,
    method: 'get'
  })
}

export function selectRoleList() {
  return request({
    url: '/role/selectList',
    method: 'get'
  })
}

export function selectUserRoleList(userId) {
  return request({
    url: '/role/selectUserRoleList/' + userId,
    method: 'get'
  })
}
