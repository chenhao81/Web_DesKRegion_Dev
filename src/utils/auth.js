import Cookies from 'js-cookie'

const UserNameKey = 'Admin-UserName'

export function getUserName() {
  return Cookies.get(UserNameKey)
}

export function setUserName(token) {
  return Cookies.set(UserNameKey, token)
}

export function removeUserName() {
  return Cookies.remove(UserNameKey)
}
