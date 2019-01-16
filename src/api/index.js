/**
 * Created by lenovo on 2019/1/15.
 */
import ajax from './ajax'
export const reqLogin = (username,password)=> ajax('/login',{username,password},'POST');
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST');