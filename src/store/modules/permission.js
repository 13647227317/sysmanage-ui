import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(authMenus, route) {
  if (route.meta && route.meta.menuCode) {
    return authMenus.some(authMenuCode => authMenuCode === route.meta.menuCode)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param authMenus
 */
export function filterAsyncRoutes(routes, authMenus) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(authMenus, tmp) || tmp.children) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, authMenus)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, authMenus) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, authMenus)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
