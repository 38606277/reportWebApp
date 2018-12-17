import React        from 'react';
import { List, Checkbox, Flex,Tabs,WhiteSpace } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css'; 

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

class Water extends React.Component {
  
  render() {
    const tabs = [
        { title: '交费' },
        { title: '结算' },
        { title: '历史' },
      ];
    return (
        <div>
        <WhiteSpace />
        <div style={{ height: 200 }}>
          <Tabs tabs={tabs}
            initalPage={'t2'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
              Content of first tab
            </div>
            
          </Tabs>
        </div>
      </div>
    );
  }
}
export default Water;
