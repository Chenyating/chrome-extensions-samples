// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

// 当Chrome扩展程序首次安装时触发此监听器
chrome.runtime.onInstalled.addListener((details) => {
  // 检查触发原因是否为安装事件，如果不是则直接返回
  if (details.reason !== chrome.runtime.OnInstalledReason.INSTALL) {
    return;
  }

  // 打开演示标签页
  openDemoTab();

  // 创建一个默认的闹钟，以便在演示中查看其效果
  // 这个闹钟将在1分钟后首次触发，并每1分钟重复触发一次
  chrome.alarms.create('demo-default-alarm', {
    delayInMinutes: 1,
    periodInMinutes: 1
  });
});

// 监听浏览器操作栏按钮被点击事件
chrome.action.onClicked.addListener(openDemoTab);

// 定义打开演示标签页的功能函数
function openDemoTab() {
  // 使用chrome.tabs API创建一个新的标签页，并将其URL指向'index.html'
  chrome.tabs.create({ url: 'index.html' });
}