import React from 'react'
import {render} from 'react-dom'
import App from './App'
import storageUtils from './utils/storageUtils'
import memory from './utils/MemoryUtils'
const user=storageUtils.getUser();
if(user && user.id){
    memory.user=user;
}
render(<App/>, document.getElementById('root'))