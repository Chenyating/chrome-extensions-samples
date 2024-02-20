// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

// 监听chrome的alarm事件，当闹钟触发时执行回调函数  
chrome.alarms.onAlarm.addListener(() => {  
  // 清除浏览器操作按钮的徽章文本  
  chrome.action.setBadgeText({ text: '' });  
    
  // 创建一个基本类型的通知  
  chrome.notifications.create({  
    type: 'basic',                 // 通知的类型，这里是基本类型  
    iconUrl: 'stay_hydrated.png',  // 通知的图标URL  
    title: 'Time to Hydrate',      // 通知的标题  
    message: "Everyday I'm Guzzlin'!",  // 通知的消息内容  
    buttons: [{ title: 'Keep it Flowing.' }],  // 通知的按钮，这里只有一个按钮，标题为'Keep it Flowing.'  
    priority: 0                    // 通知的优先级，0表示正常优先级  
  });  
});  
  
// 监听chrome的通知按钮点击事件，当用户点击通知的按钮时执行回调函数  
chrome.notifications.onButtonClicked.addListener(async () => {  
  // 从chrome的同步存储中获取名为'minutes'的项  
  const item = await chrome.storage.sync.get(['minutes']);  
    
  // 设置浏览器操作按钮的徽章文本为'ON'  
  chrome.action.setBadgeText({ text: 'ON' });  
    
  // 创建一个新的闹钟，延迟时间由从存储中获取到的'minutes'决定  
  chrome.alarms.create({ delayInMinutes: item.minutes });  
});