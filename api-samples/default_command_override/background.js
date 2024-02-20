// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// 监听 Chrome 命令事件。当扩展注册了一个命令，并且用户触发了这个命令时，会调用此监听器。  
chrome.commands.onCommand.addListener(async (command) => {  
  // 查询当前窗口中的所有标签页。  
  const tabs = await chrome.tabs.query({ currentWindow: true });  
    
  // 根据标签页在窗口中的索引进行排序。这确保了标签页是按照它们在浏览器中显示的顺序排列的。  
  tabs.sort((a, b) => {  
    return a.index < b.index ? -1 : (a.index > b.index ? 1 : 0);  
  });  
    
  // 查找当前活动的标签页的索引。  
  const activeIndex = tabs.findIndex((tab) => {  
    return tab.active;  
  });  
    
  // 获取最后一个标签页的索引。  
  const lastTab = tabs.length - 1;  
    
  let newIndex = -1; // 用于存储将要激活的标签页的新索引。  
    
  // 如果命令是 'flip-tabs-forward'（向前切换标签页）  
  if (command === 'flip-tabs-forward') {  
    // 如果当前是第一个标签页，则切换到最后一个标签页。  
    // 否则，切换到前一个标签页。  
    newIndex = activeIndex === 0 ? lastTab : activeIndex - 1;  
  }  
  // 否则，默认命令是 'flip-tabs-backward'（向后切换标签页）  
  else {  
    // 如果当前是最后一个标签页，则切换到第一个标签页。  
    // 否则，切换到后一个标签页。  
    newIndex = activeIndex === lastTab ? 0 : activeIndex + 1;  
  }  
    
  // 使用新的索引来更新标签页的状态，使其变为活动状态并高亮显示。  
  chrome.tabs.update(tabs[newIndex].id, { active: true, highlighted: true });  
});