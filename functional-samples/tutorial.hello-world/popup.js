
// 创建一个新的 h1 元素
 var wordCount=0;
// 获取 main 元素
const mainElement = document.querySelector('main');

// 判断是否找到 main 元素
if (mainElement) {
  // 获取 main 元素下的所有纯文本内容
  const textContent = mainElement.textContent;

  // 使用正则表达式查找所有 "单词"，这里假设一个 "单词" 由一个或多个非空格字符组成
  const wordMatchRegExp = /[^\s]+/g;
  const words = textContent.matchAll(wordMatchRegExp);

  // 将匹配到的单词转换为数组，计算数组长度即为纯文本字数
   wordCount = [...words].length;

  console.log(`main 元素下的纯文本字数为: ${wordCount} 个单词`);
} else {
  console.error('未找到 main 元素');
}

const newH1 = document.createElement('h1');
newH1.textContent = `一共有：${wordCount} 个字`;

mainElement.insertAdjacentElement('afterbegin', newH1)

