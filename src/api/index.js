/**
 * Created by lenovo on 2019/1/15.
 */
import ajax from './ajax'
import jsonp from 'jsonp'
export const reqLogin = (username,password)=> ajax('/login',{username,password},'POST');
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST');
export const reqCategorys = (parentId)=>ajax('/manage/category/list',{parentId});
export const reqAddCategory = (parentId, categoryName)=>ajax('/manage/category/add',{parentId, categoryName},'POST');
export const reqUpdateCategory =({categoryId,categoryName})=>ajax('/manage/category/update',{categoryId,categoryName},"POST");

export function reqWeather(city){
    return new Promise((resolve,reject)=>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(
            url,
            {
                param:'callback'
            },
            (error,data)=>{
                if(!error){
                    const {dayPictureUrl, weather}=data.results[0].weather_data[0];
                    resolve({dayPictureUrl, weather})
                }else{
                    alert('请求天气出错')
                }
            }
        )
    })


}