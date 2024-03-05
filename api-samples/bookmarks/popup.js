/* eslint-disable no-unused-vars */
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

// Search the bookmarks when entering the search keyword.
// Get the bookmarks and display them in the popup
// 获取书签树结构，并将它们递归地展示在网页上
chrome.bookmarks.getTree((tree) => {
  const bookmarkList = document.getElementById('bookmarkList');
  displayBookmarks(tree[0].children, bookmarkList); // 从根节点的子节点开始展示书签
});

// 递归函数，用于展示书签结构
function displayBookmarks(nodes, parentNode) {
  for (const node of nodes) {
    // 如果节点是一个书签（具有url属性）
    if (node.url) {
      const listItem = document.createElement('li');
      listItem.textContent = node.title; // 设置书签名
      parentNode.appendChild(listItem); // 将书签添加到父节点下
    }

    // 如果节点还有子节点
    if (node.children && node.children.length > 0) {
      const sublist = document.createElement('ul'); // 创建子列表
      parentNode.appendChild(sublist); // 将子列表添加到父节点下
      displayBookmarks(node.children, sublist); // 递归地展示子节点书签
    }
  }
}

// 添加书签功能：添加www.google.com网址书签
function addBookmark() {
  chrome.bookmarks.create({
    parentId: '1', // 父书签ID，这里假设为根目录
    title: 'Google',
    url: 'https://www.google.com'
  }, () => {
    console.log('Bookmark added');
    location.reload(); // 添加完成后刷新页面以更新书签列表
  });
}

// 删除书签功能：删除www.google.com网址书签
function removeBookmark() {
  chrome.bookmarks.search({ url: 'https://www.google.com/' }, (results) => {
    for (const result of results) {
      if (result.url === 'https://www.google.com/') {
        chrome.bookmarks.remove(result.id, () => {}); // 删除匹配到的书签
      }
    }
    location.reload(); // 删除完成后刷新页面以更新书签列表
  });
}

// 为添加和删除书签按钮添加点击事件监听器
document.getElementById('addButton').addEventListener('click', addBookmark);
document.getElementById('removeButton').addEventListener('click', removeBookmark);
