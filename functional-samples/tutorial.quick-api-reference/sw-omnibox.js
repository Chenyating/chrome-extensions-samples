console.log("sw-omnibox.js")
// Save default API suggestions
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.local.set({
      apiSuggestions: ['tabs', 'storage', 'scripting']
    });
  }
});
// 定义常量URL_CHROME_EXTENSIONS_DOC，它是指向Chrome扩展开发文档的URL  
const URL_CHROME_EXTENSIONS_DOC = 'https://developer.chrome.com/docs/extensions/reference/api/';  
  
// 定义常量NUMBER_OF_PREVIOUS_SEARCHES，用于指定要显示多少个之前的搜索建议  
const NUMBER_OF_PREVIOUS_SEARCHES = 4;  
  
// 当用户在地址栏开始输入时，监听onInputChanged事件，并显示建议  
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => { 
  // input：输入内容，suggest：func 返回数组
  await chrome.omnibox.setDefaultSuggestion({  
    // 放置在网址栏中的文本，当用户选择此条目时，系统会将该文本发送到扩展程序
    description: '选择这个扩展程序的建议'  
  });  
    
  // 从本地存储中获取名为'apiSuggestions'的搜索建议数组  
  const { apiSuggestions } = await chrome.storage.local.get('apiSuggestions');  
    
  // 遍历搜索建议数组，为每个建议生成一个新的格式，包括内容和描述  
  const suggestions = apiSuggestions.map((api) => {  
    return { content: api, description: `建议结果数组的内容：${api}` };  
  });  
    
  // 调用suggest函数，将格式化后的建议数组传递给Chrome，以便在地址栏下拉列表中显示  
  suggest(suggestions);  
});

// 当用户在地址栏中选择了建议并按下回车键时，监听onInputEntered事件  
chrome.omnibox.onInputEntered.addListener((input) => {  
  console.log(input,"+++")
  chrome.tabs.create({
    url: "www.baidu.com"
  });
  // 创建一个新的浏览器标签页，并打开用户选择的API的参考页面  
  // 这里使用了之前定义的URL_CHROME_EXTENSIONS_DOC常量和用户输入的input来构造完整的URL  
  // chrome.tabs.create({ url: URL_CHROME_EXTENSIONS_DOC + input });  
    
  // // 调用updateHistory函数，将用户输入的关键词保存到历史记录中  
  // updateHistory(input);  
});  
  
// 注意：updateHistory函数没有在上面的代码片段中定义  
// 我假设它在其他地方被定义，并且负责将输入的关键词保存到某种历史记录中  
// 这个函数可能会使用chrome.storage.local API来存储数据 

// 例如：  
async function updateHistory(input) {  
  let history = await chrome.storage.local.get('searchHistory') || [];  
  history.unshift(input);  
  if (history.length > NUMBER_OF_PREVIOUS_SEARCHES) {  
    history.pop(); // 保持历史记录的数量不超过NUMBER_OF_PREVIOUS_SEARCHES  
  }  
  await chrome.storage.local.set({ searchHistory: history });  
}  