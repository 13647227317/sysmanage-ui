import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function selectPage(params) {
  return request({
    url: '/user/selectPage',
    method: 'get',
    params: params
  })
}

export function deleteUser(userId) {
  return request({
    url: '/user/delete/' + userId,
    method: 'delete'
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function saveUser(data) {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}

export function resetPassword(userId) {
  return request({
    url: '/user/resetPassword/' + userId,
    method: 'post'
  })
}

export function selectUserByUserAccount(userAccount) {
  return request({
    url: '/user/getUserByAccount/' + userAccount,
    method: 'get'
  })
}
