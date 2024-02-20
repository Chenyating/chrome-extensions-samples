// 监听扩展安装事件，当扩展被安装时，设置动作按钮的徽章文字为 'OFF'  
chrome.runtime.onInstalled.addListener(() => {  
  chrome.action.setBadgeText({  
    text: 'OFF'  
  });  
});  
  

// 当用户点击扩展的动作按钮时触发以下函数  
// 当用户点击扩展的动作按钮  
chrome.action.onClicked.addListener(async (tab) => {  
    // 获取动作徽章的状态，判断扩展是否处于 'ON' 或 'OFF' 状态  
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });  
    // 下一个状态总是与当前状态相反  
    // 判断下一个状态，如果当前状态是 'ON' 则下一个状态为 'OFF'，反之亦然  
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';  
  
    // 设置动作徽章的下一个状态  
    // 根据下一个状态设置动作徽章文字  
    await chrome.action.setBadgeText({  
      tabId: tab.id,  
      text: nextState  
    });  
  
    // 如果下一个状态是 'ON'，则在用户打开扩展时插入CSS文件  
    if (nextState === 'ON') {  
      // 当用户打开扩展时插入CSS文件 'spriting.css' 到当前标签页中  
      await chrome.scripting.insertCSS({  
        files: ['spriting.css'],  
        target: { tabId: tab.id }  
      });  
    } else if (nextState === 'OFF') {  
      // 如果下一个状态是 'OFF'，则在用户关闭扩展时移除CSS文件  
      // 当用户关闭扩展时从当前标签页中移除CSS文件 'spriting.css'   
      await chrome.scripting.removeCSS({  
        files: ['spriting.css'],  
        target: { tabId: tab.id }  
      });  
    }  
});