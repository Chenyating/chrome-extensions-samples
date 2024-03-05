// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

// 获取页面中相关DOM元素
const display = document.querySelector('.alarm-display');
const log = document.querySelector('.alarm-log');
const form = document.querySelector('.create-alarm');
const clearButton = document.getElementById('clear-display');
const refreshButton = document.getElementById('refresh-display');

// 绑定DOM事件

// 清除和刷新闹钟显示按钮事件
clearButton.addEventListener('click', () => manager.cancelAllAlarms());
refreshButton.addEventListener('click', () => manager.refreshDisplay());

// 新建闹钟表单提交事件
form.addEventListener('submit', (event) => {
  // 阻止表单默认提交行为
  event.preventDefault();

  // 创建FormData对象以获取表单数据
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // 提取表单中的闹钟名称、延迟时间、延迟格式以及周期值
  const name = data['alarm-name'];
  const delay = Number.parseFloat(data['time-value']);
  const delayFormat = data['time-format'];
  const period = Number.parseFloat(data['period']);

  // 准备创建闹钟所需的信息对象
  const alarmInfo = {};

  // 根据延迟格式设置闹钟触发时间或延迟时间
  if (delayFormat === 'ms') {
    // 如果是毫秒，则设置'when'属性（从当前时间开始计算）
    alarmInfo.when = Date.now() + delay;
  } else if (delayFormat === 'min') {
    // 如果是分钟，则设置'delayInMinutes'属性
    alarmInfo.delayInMinutes = delay;
  }

  // 如果指定了周期，则添加到闹钟信息中
  if (period) {
    alarmInfo.periodInMinutes = period;
  }

  // 调用manager来创建新的闹钟
  manager.createAlarm(name, alarmInfo);
});

// 定义AlarmManager类，用于管理闹钟
class AlarmManager {
  constructor(display, log) {
    this.displayElement = display;
    this.logElement = log;

    // 初始化日志信息
    this.logMessage('Manager: initializing demo');

    // 为取消闹钟按钮绑定点击事件
    this.displayElement.addEventListener('click', this.handleCancelAlarm);
    // 监听chrome.alarms的onAlarm事件
    chrome.alarms.onAlarm.addListener(this.handleAlarm);
  }

  // 日志记录方法
  logMessage(message) {
    const date = new Date();
    // 对日期时间进行格式化处理
    const pad = (val, len = 2) => val.toString().padStart(len, '0');
    const h = pad(date.getHours());
    const m = pad(date.getMinutes());
    const s = pad(date.getSeconds());
    const ms = pad(date.getMilliseconds(), 3);
    const time = `${h}:${m}:${s}.${ms}`;

    // 创建一个新的日志行元素，并插入到日志区域
    const logLine = document.createElement('div');
    logLine.textContent = `[${time}] ${message}`;
    this.logElement.insertBefore(logLine, this.logElement.firstChild);
  }

  // 处理闹钟触发事件
  handleAlarm = async (alarm) => {
    // 将触发的闹钟信息转换为JSON字符串并记录日志
    const json = JSON.stringify(alarm);
    this.logMessage(`Alarm "${alarm.name}" fired\n${json}`);
    // 刷新闹钟显示
    await this.refreshDisplay();
  };

  // 处理取消闹钟按钮点击事件
  handleCancelAlarm = async (event) => {
    // 检查点击目标是否为取消按钮
    if (!event.target.classList.contains('alarm-row__cancel-button')) {
      return;
    }

    // 获取闹钟名称并取消该闹钟
    const name = event.target.parentElement.dataset.name;
    await this.cancelAlarm(name);
    // 刷新闹钟显示
    await this.refreshDisplay();
  };

  // 取消指定名称的闹钟
  async cancelAlarm(name) {
    // 使用chrome.alarms API取消闹钟并记录结果
    return chrome.alarms.clear(name, (wasCleared) => {
      if (wasCleared) {
        this.logMessage(`Manager: canceled alarm "${name}"`);
      } else {
        this.logMessage(`Manager: could not canceled alarm "${name}"`);
      }
    });
  }

  // 创建新闹钟的方法，同时记录创建日志
  createAlarm(name, alarmInfo) {
    // 使用chrome.alarms API创建闹钟
    chrome.alarms.create(name, alarmInfo);
    
    // 记录创建的日志信息
    const json = JSON.stringify(alarmInfo, null, 2).replace(/\s+/g, ' ');
    this.logMessage(`Created "${name}"\n${json}`);
    // 刷新闹钟显示
    this.refreshDisplay();
  }

  // 渲染一个闹钟到页面上
  renderAlarm(alarm, isLast) {
    // 创建并填充闹钟行元素
    const alarmEl = document.createElement('div');
    alarmEl.classList.add('alarm-row');
    alarmEl.dataset.name = alarm.name;
    alarmEl.textContent = JSON.stringify(alarm, 0, 2) + (isLast ? '' : ',');
    
    // 添加取消按钮到闹钟行
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('alarm-row__cancel-button');
    cancelButton.textContent = 'cancel';
    alarmEl.appendChild(cancelButton);

    // 将闹钟行添加到显示区域
    this.displayElement.appendChild(alarmEl);
  }

  // 取消所有闹钟
  async cancelAllAlarms() {
    // 使用chrome.alarms API取消所有闹钟并记录结果
    return chrome.alarms.clearAll((wasCleared) => {
      if (wasCleared) {
        this.logMessage(`Manager: canceled all alarms"`);
      } else {
        this.logMessage(`Manager: could not canceled all alarms`);
      }
    });
  }

  // 获取所有闹钟并渲染到显示区域
  async populateDisplay() {
    return chrome.alarms.getAll((alarms) => {
      for (const [index, alarm] of alarms.entries()) {
        const isLast = index === alarms.length - 1;
        this.renderAlarm(alarm, isLast);
      }
    });
  }

  // 使用私有变量实现简单的刷新锁机制，防止并发刷新导致重复渲染
  #refreshing = false;

  async refreshDisplay() {
    if (this.#refreshing) {
      return; // 如果正在刷新则直接返回
    }
    
    this.#refreshing = true; // 设置正在刷新标志
    try {
      await this.clearDisplay();
      await this.populateDisplay();
    } finally {
      this.#refreshing = false; // 清除正在刷新标志
    }
  }

  // 清空闹钟显示区域
  async clearDisplay() {
    this.displayElement.textContent = '';
  }
}

// 实例化AlarmManager并调用刷新显示方法
const manager = new AlarmManager(display, log);
manager.refreshDisplay();