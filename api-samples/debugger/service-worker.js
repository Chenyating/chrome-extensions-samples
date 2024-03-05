// 注册一个监听器，当用户点击浏览器扩展程序图标时触发
chrome.action.onClicked.addListener(function (tab) {
  // 检查当前激活的标签页 URL 是否以 'http://' 或 'https://' 开头
  if (tab.url.startsWith('http')) {
    // 尝试将调试器附加到指定的 Tab ID 上，并指定调试协议版本为 '1.2'
    chrome.debugger.attach({ tabId: tab.id }, '1.2', function () {
      // 启用网络请求跟踪，允许接收到 Network 相关的事件
      chrome.debugger.sendCommand(
        { tabId: tab.id },
        'Network.enable',
        {}, // 参数为空对象 {}
        function () {
          // 如果在启用网络请求跟踪时出现错误，则打印错误信息
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          }
        }
      );
    });
  } else {
    // 如果不是 HTTP 或 HTTPS 页面，则输出一条消息说明无法附加调试器
    console.log('Debugger can only be attached to HTTP/HTTPS pages.');
  }
});

// 注册一个监听器，当调试器接收到任何事件时触发
chrome.debugger.onEvent.addListener(function (source, method, params) {
  // 检查接收到的事件类型是否为 'Network.responseReceived'
  if (method === 'Network.responseReceived') {
    // 输出接收到的响应信息
    console.log('Response received:', params.response);
    // 在这里您可以根据接收到的响应数据执行所需的进一步操作
    // 示例代码省略了对响应数据的具体处理逻辑
  }
});