// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

// Show the demo page once the extension is installed
chrome.runtime.onInstalled.addListener((_reason) => {
  // 下载监听，打开tab页访问demo/index.html也能
  chrome.tabs.create({
    url: 'demo/index.html'
  });
});
