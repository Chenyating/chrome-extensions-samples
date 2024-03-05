// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// 此函数用于根据给定的时间单位计算出相应的时间段长度（以毫秒为单位）
function parseMilliseconds(timeframe) {
  // 获取当前时间的毫秒值
  let now = new Date().getTime();
  
  // 定义常见时间单位对应的毫秒数值
  let milliseconds = {
    hour: 60 * 60 * 1000, // 1小时
    day: 24 * 60 * 60 * 1000, // 1天
    week: 7 * 24 * 60 * 60 * 1000, // 1周
    '4weeks': 4 * 7 * 24 * 60 * 60 * 1000 // 4周
  };

  // 如果时间单位存在于预定义的对象中，返回当前时间减去对应时间段长度
  if (milliseconds[timeframe]) {
    return now - milliseconds[timeframe];
  }

  // 如果时间单位为 "forever"，则返回 0，表示清除所有历史记录直到当前时刻
  if (timeframe === 'forever') {
    return 0;
  }

  // 如果时间单位不在预定义范围内，则返回 null
  return null;
}

// 当按钮被点击时执行的操作
function buttonClicked() {
  // 获取页面中"timeframe"元素的值（用户选择的时间范围）
  const option = document.getElementById('timeframe');
  let selectedTimeframe = option.value;

  // 根据用户选择的时间范围计算出应该清除的起始时间点（以毫秒为单位）
  let removal_start = parseMilliseconds(selectedTimeframe);

  // 如果计算出的时间点无效（undefined），则不执行后续操作
  if (removal_start == undefined) {
    return null;
  }

  // 使用 Chrome 浏览器API清除指定时间段内的浏览数据
  chrome.browsingData.remove(
    { since: removal_start }, // 清除从 removal_start 时间点以来的数据
    {
      appcache: true,
      cache: true,
      cacheStorage: true,
      cookies: true,
      downloads: true,
      fileSystems: true,
      formData: true,
      history: true,
      indexedDB: true,
      localStorage: true,
      serverBoundCertificates: true,
      serviceWorkers: true,
      pluginData: true,
      passwords: true,
      webSQL: true
    }
  );

  // 创建一个提示框元素，表示数据清除成功
  const success = document.createElement('div');
  success.classList.add('overlay');
  success.setAttribute('role', 'alert');
  success.textContent = 'Data has been cleared.';

  // 将提示框添加到页面的 body 中
  document.body.appendChild(success);

  // 在10毫秒后显示提示框
  setTimeout(function () {
    success.classList.add('visible');
  }, 10);

  // 在4秒钟后隐藏提示框，若 close 变量为 false，则仅移除可见性，否则关闭窗口
  setTimeout(function () {
    // 注意：在此处，变量 close 未定义，实际应用中需要定义该变量以决定是否关闭窗口
    if (close === false) {
      success.classList.remove('visible');
    } else {
      window.close();
    }
  }, 4000);
}

// 当页面加载完成时，为指定的按钮添加点击事件监听器
window.addEventListener('DOMContentLoaded', function () {
  const selection = document.getElementById('button');
  selection.addEventListener('click', buttonClicked);
});