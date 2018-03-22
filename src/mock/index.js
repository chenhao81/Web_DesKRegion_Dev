import Mock from 'mockjs'
import loginAPI from './login'

// 登录相关
Mock.mock(/\/sys\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/sys\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

export default Mock
