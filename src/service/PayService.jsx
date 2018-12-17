import HttpService from '../common/HttpService';


export default class PayService {

   
    // 获取用户历史缴费记录
    getPayList = () => {

        let url = "reportServer/PayServer/ListAll";
        let param = {
            name: 'Hubot',
            login: 'hubot'
        };
  
        return HttpService.post(url,param);


    }



}
