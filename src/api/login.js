import request from '@/utils/request'

const contextPath = '/api'
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: `${contextPath}/account/login`,
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: `${contextPath}/account/logout`,
    method: 'get'
  })
}

export function getRawMenuTree(userId) {
  return request({
    url: `${contextPath}/resource/menu`,
    method: 'get',
    params: { userId }
  })
}

export function getUserInfo() {
  return request({
    url: `${contextPath}/user/detail`,
    method: 'get'
  })
}

