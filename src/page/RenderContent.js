
import React, { memo } from 'react';
//import style from './RenderContent.css';

// antd 图文组件
import { Card,List,Toast } from 'antd-mobile';
import HttpService from '../util/HttpService.jsx';
import LocalStorge from '../util/LogcalStorge.jsx';
const localStorge = new LocalStorge();
const { Meta } = Card;
const Item = List.Item;
const Brief = Item.Brief;
const url=window.getServerUrl();

function domnFile(filepath){
  console.log("ssssssssssssssssssssssssssssssssssssd",filepath);
   fetch(url+'reportServer/uploadFile/downloadFile', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'credentials': JSON.stringify(localStorge.getStorage('userInfo') || '')
       },
       body:filepath
     }).then(function (response) {
       //console.log()
       if (response.ok) {
         response.blob().then((blob) => {
           if(blob.size>0){
           const a = window.document.createElement('a');
           const downUrl = window.URL.createObjectURL(blob);// 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
            a.href = downUrl;
            a.download = filepath.substr(filepath.lastIndexOf("/")+1);
            a.click();
           window.URL.revokeObjectURL(downUrl);
         }else{
           Toast.fail("文件已丢失，请重新导出下载！");
         }
         });
       }
     });
       
 }
const RenderContent = props => {
  if (props.message_type=="json"){
    let ress=null;
    if (typeof props.post_message === 'string') {
      ress=JSON.parse(props.post_message);
    }else{
      ress=props.post_message;
    }
    let data=ress.data.list;
    let out=ress.data.out;
    return (
    <Card style={{backgroundColor:'#f4f7f9'}}>
        <List>
            {data.map(val => (
                <Item
                multipleLine
                onClick={() => this.onClassClick(val.class_id)}
                >
                {out.map((item) => {
                    return <div  style={{fontSize:'14px',fontFamily:'微软雅黑',backgroundColor:'#F4F7F9'}}>
                    {item.out_name}:{val[item.out_id.toUpperCase()]}
                    </div> 
                }
                )} 
                </Item>
            ))}
        </List>
    </Card>
    );
  }else 
  if (props.message_type=="file"){
    let fileIcon='./../src/assets/icon/down.png';
    let ress=null;
    if (typeof props.post_message === 'string') {
      ress=JSON.parse(props.post_message);
    }else{
      ress=props.post_message;
    }
    let data= ress.data.fileName;
    let file= ress.data.filePath;
    var fileExtension = file.substring(file.lastIndexOf('.') + 1);
    fileExtension=fileExtension.toUpperCase();
    if(fileExtension=='DOC' || fileExtension=='DOCX'){
      fileIcon="./../src/assets/icon/word.png";
    }else  if(fileExtension=='XLS' || fileExtension=='XLSX'){
      fileIcon="./../src/assets/icon/excel.png";
    }else  if(fileExtension=='PPT' || fileExtension=='PPTX'){
      fileIcon="./../src/assets/icon/ppt.png";
    }
    return (<div  style={{backgroundColor:'#f4f7f9',maxWidth:'370px'}}>
            <List>
              <Item align="top" thumb={fileIcon} multipleLine>
                <a href={file} target="_black" style={{marginRight:'5px'}}>{data}</a>
                <Brief><a onlick={()=>this.domnFile(file)} href="javascript:void(0);" target="_black" style={{marginRight:'5px'}}>点击下载</a></Brief>
              </Item>
            </List>
          </div>
    );
  } else 
  if (props.message_type=="text"){
    return <div >{props.post_message}</div>;
  }else 
  if (props.message_type=="voice") {
    return <audio src={props.post_message ? props.post_message : ''} controls />;
  }else if(props.message_type=="question"){
    return <List renderHeader={() => '常见问题'} className="my-list">
        {props.data.map(item => (
          <Item arrow="horizontal"
            multipleLine
            onClick={() => this.onQuestionClick(item.ai_question_id,item.ai_question)}
           >
             <div  style={{fontSize:'14px',fontFamily:'微软雅黑',backgroundColor:'#F4F7F9'}}>
                {item.ai_question}
             </div>
          </Item>
        ))}
      </List>
  }
  else{
    return <div >{props.post_message}</div>;
  }
  //return null;
};

export default RenderContent;