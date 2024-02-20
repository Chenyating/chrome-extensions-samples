
// 查询所有满足指定URL模式的浏览器标签页  
const tabs = await chrome.tabs.query({  
  url: [  
    'https://developer.chrome.com/docs/webstore/*', // 匹配webstore文档的所有URL  
    'https://developer.chrome.com/docs/extensions/*' // 匹配extensions文档的所有URL  
  ]  
});  
  
// 创建一个新的Intl.Collator对象，用于字符串比较  
const collator = new Intl.Collator();  
  
// 使用collator对象对查询到的标签页按标题进行排序  
tabs.sort((a, b) =>{
  collator.compare(a.title, b.title)});  
  
// 从DOM中获取ID为'li_template'的元素，作为后续生成列表项的模板  
const template = document.getElementById('li_template');  
  
// 创建一个新的Set对象，用于存储生成的列表项元素  
const elements = new Set();  
  
// 遍历排序后的标签页  
for (const tab of tabs) {  
  // 克隆模板元素的第一个子元素（应该是<li>），作为新的列表项  
  const element = template.content.firstElementChild.cloneNode(true);  
  
  // 从标签页标题中提取第一部分（以'-'为分隔符），并去除前后的空格  
  const title = tab.title.split('-')[0].trim();  
  
  // 解析标签页的URL，获取其pathname，并去掉'/docs'部分  
  const pathname = new URL(tab.url).pathname.slice('/docs'.length);  
  
  // 设置列表项中的标题和pathname元素的文本内容  
  element.querySelector('.title').textContent = tab.id;  
  element.querySelector('.pathname').textContent = pathname;  
  
  // 为列表项中的<a>元素添加点击事件监听器  
  element.querySelector('a').addEventListener('click', async () => {  
    // 当点击时，将对应的标签页设置为活动标签页，并将其所在的窗口设置为焦点窗口  
    await chrome.tabs.update(tab.id, { active: true });  
    await chrome.windows.update(tab.windowId, { width: 100 });  //窗口置于最前面
  });  
  
  // 将生成的列表项元素添加到Set中  
  elements.add(element);  
}  
  
// 将Set中的所有列表项元素添加到页面的<ul>元素中  
document.querySelector('ul').append(...elements);  
  
// 从DOM中获取<button>元素，并为其添加点击事件监听器  
const button = document.querySelector('button');  
button.addEventListener('click', async () => {  
  // 提取所有标签页的ID  
  const tabIds = tabs.map(({ id }) => id);  
  
  // 如果存在标签页，则将它们组合到一个新的标签页组中  
  if (tabIds.length) {  
    const group = await chrome.tabs.group({tabIds }); 
    // 更新新创建的标签页组的标题为'DOCS'  
    await chrome.tabGroups.update(group, { title: '这是我设置的标题' });  
  }  
});
