import React        from 'react';
import { Link, Redirect } from 'react-router-dom';
import { ImagePicker,WingBlank } from 'antd-mobile';
import HttpService from '../util/HttpService.jsx';
import LocalStorge from '../util/LogcalStorge.jsx';
const localStorge = new LocalStorge();
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const url=window.getServerUrl();

function beforeUpload(file) {
  let isJPG=false;
 // const isJPG = file.type === 'image/jpeg';
  if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif'){
    isJPG=true;
  }
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}
class UploadInfo extends React.Component{
    state = {
      loading: false,
      files: []
    };
    onChange = (files, type, index) => {
      let userInfo = localStorge.getStorage('userInfo');
      console.log(files, type, index);
      
      for(let key in files){
        let formData = new FormData();
        formData.append("file", files[key].file);
         HttpService.post("/reportServer/formUser/uploadFile/"+userInfo.id,formData).then(response => {
            userInfo.icon=response.data;
            localStorge.setStorage('userInfo',userInfo);
            window.location.href="#/My";
         }).catch((err)=> {
            window.location.href="#/My";
         });
      }
    
      this.setState({
        files,
      });
    };
   
  
 //初始化加载调用方法
    componentDidMount(){
      
    }
   render() {
    const { files } = this.state;
    return (
      <div id="page-wrapper">
        <Link to="/My">返回</Link>
        <WingBlank>
        <ImagePicker
          files={files}
          onChange={this.onChange}
          onImageClick={(index, fs) => console.log(index, fs)}
          selectable={files.length < 1}
          multiple={false}
        />
        </WingBlank>
      </div>
    );
  }
}
export default UploadInfo;