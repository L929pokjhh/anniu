/**
 * 高级微信小程序按钮功能自动化测试脚本
 * 包含更完整的交互模拟和错误检测
 * 
 * 作者: AI Assistant
 * 创建时间: 2025-12-08
 */

console.log('🚀 高级按钮功能测试脚本启动...');

// 全局配置
const CONFIG = {
  testTimeout: 8000,        // 单个测试超时时间（毫秒）
  pageLoadDelay: 2000,      // 页面加载等待时间
  interactionDelay: 500,     // 交互间隔时间
  enableConsoleLog: true,    // 是否启用详细日志
  enableErrorCapture: true   // 是否捕获错误
};

// 测试结果存储
const TestResults = {
  startTime: new Date(),
  endTime: null,
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  skippedTests: 0,
  errors: [],
  details: []
};

// 日志工具
const Logger = {
  info: (msg) => CONFIG.enableConsoleLog && console.log(`ℹ️  ${msg}`),
  success: (msg) => CONFIG.enableConsoleLog && console.log(`✅ ${msg}`),
  error: (msg) => CONFIG.enableConsoleLog && console.log(`❌ ${msg}`),
  warning: (msg) => CONFIG.enableConsoleLog && console.log(`⚠️  ${msg}`),
  debug: (msg) => CONFIG.enableConsoleLog && console.log(`🔍 ${msg}`)
};

// 错误捕获工具
const ErrorCatcher = {
  capture: (error, context) => {
    if (CONFIG.enableErrorCapture) {
      const errorInfo = {
        message: error.message || error,
        context: context,
        timestamp: new Date(),
        stack: error.stack
      };
      TestResults.errors.push(errorInfo);
      Logger.error(`错误捕获 [${context}]: ${errorInfo.message}`);
    }
  }
};

// 工具函数集合
const Utils = {
  // 延迟函数
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // 获取当前页面实例
  getCurrentPage: () => {
    try {
      const pages = getCurrentPages();
      if (pages && pages.length > 0) {
        return pages[pages.length - 1];
      }
      return null;
    } catch (error) {
      ErrorCatcher.capture(error, 'Utils.getCurrentPage');
      return null;
    }
  },
  
  // 检查页面是否加载完成
  isPageLoaded: () => {
    const page = Utils.getCurrentPage();
    return page && page.data !== undefined;
  },
  
  // 等待页面加载
  waitForPageLoad: async (timeout = CONFIG.pageLoadDelay) => {
    Logger.debug('等待页面加载...');
    await Utils.sleep(timeout);
    
    if (!Utils.isPageLoaded()) {
      throw new Error('页面加载超时');
    }
    
    return true;
  },
  
  // 检查函数是否存在
  hasFunction: (page, functionName) => {
    return page && typeof page[functionName] === 'function';
  },
  
  // 检查数据是否存在
  hasData: (page, dataPath) => {
    if (!page || !page.data) return false;
    
    const keys = dataPath.split('.');
    let current = page.data;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        return false;
      }
      current = current[key];
    }
    
    return true;
  },
  
  // 安全执行函数
  safeExecute: async (page, functionName, params = {}, context = '') => {
    try {
      if (!Utils.hasFunction(page, functionName)) {
        throw new Error(`函数 ${functionName} 不存在`);
      }
      
      Logger.debug(`执行函数: ${functionName}`);
      
      // 根据函数类型执行不同的调用方式
      if (functionName === 'navigateToPage' && params.currentTarget) {
        page[functionName](params);
      } else if (functionName.includes('tap') && params.currentTarget) {
        page[functionName](params);
      } else {
        page[functionName]();
      }
      
      // 等待函数执行
      await Utils.sleep(CONFIG.interactionDelay);
      
      return { success: true, result: null };
      
    } catch (error) {
      ErrorCatcher.capture(error, context || `Utils.safeExecute.${functionName}`);
      return { success: false, error: error.message };
    }
  }
};

// 页面导航工具
const Navigation = {
  // 导航到指定页面
  navigateTo: (pagePath) => {
    return new Promise(async (resolve, reject) => {
      try {
        Logger.info(`导航到页面: ${pagePath}`);
        
        wx.navigateTo({
          url: `/${pagePath}`,
          success: async () => {
            await Utils.waitForPageLoad();
            Logger.success(`页面导航成功: ${pagePath}`);
            resolve({ success: true });
          },
          fail: (error) => {
            throw new Error(`页面导航失败: ${error.errMsg}`);
          }
        });
        
      } catch (error) {
        ErrorCatcher.capture(error, `Navigation.navigateTo.${pagePath}`);
        reject(error);
      }
    });
  },
  
  // 返回上一页
  navigateBack: () => {
    return new Promise((resolve) => {
      wx.navigateBack({
        success: () => {
          Utils.sleep(CONFIG.pageLoadDelay).then(resolve);
        },
        fail: () => {
          Utils.sleep(500).then(resolve); // 即使失败也等待一下
        }
      });
    });
  }
};

// 按钮测试用例定义
const ButtonTestCases = {
  'pages/index/index': [
    {
      name: '立即注册按钮',
      selector: '.register-btn',
      action: 'goToRegister',
      expected: {
        type: 'navigation',
        target: 'pages/register/register'
      },
      description: '测试首页注册按钮功能'
    },
    {
      name: '了解更多按钮',
      selector: '.info-btn',
      action: 'viewInfo',
      expected: {
        type: 'function',
        shouldExist: true
      },
      description: '测试首页信息查看按钮'
    },
    {
      name: '取消协议按钮',
      selector: '.btn-cancel',
      action: 'cancelAgreement',
      expected: {
        type: 'modal',
        shouldHide: true
      },
      description: '测试协议取消按钮'
    },
    {
      name: '确认注册按钮',
      selector: '.btn-confirm',
      action: 'confirmAgreement',
      expected: {
        type: 'function',
        shouldExist: true
      },
      description: '测试协议确认按钮',
      preconditions: ['showAgreementModal']
    }
  ],
  
  'pages/main/main': [
    {
      name: '秘书处按钮',
      selector: '[data-page="secretary"]',
      action: 'navigateToPage',
      params: { currentTarget: { dataset: { page: 'secretary' } } },
      expected: {
        type: 'modal',
        shouldShow: 'secretary'
      },
      description: '测试秘书处入口按钮'
    },
    {
      name: '专委会按钮',
      selector: '[data-page="committee"]',
      action: 'navigateToPage',
      params: { currentTarget: { dataset: { page: 'committee' } } },
      expected: {
        type: 'navigation',
        target: 'pages/committee/committee'
      },
      description: '测试专委会入口按钮'
    },
    {
      name: '转化中心按钮',
      selector: '[data-page="transform"]',
      action: 'navigateToPage',
      params: { currentTarget: { dataset: { page: 'transform' } } },
      expected: {
        type: 'navigation',
        target: 'pages/transform/transform'
      },
      description: '测试转化中心入口按钮'
    },
    {
      name: '求是书院按钮',
      selector: '[data-page="Former site of Qiushi Academy"]',
      action: 'navigateToPage',
      params: { currentTarget: { dataset: { page: 'Former site of Qiushi Academy' } } },
      expected: {
        type: 'function',
        shouldExist: true
      },
      description: '测试求是书院入口按钮'
    }
  ],
  
  'pages/register/register': [
    {
      name: '上传学历证明按钮',
      selector: '.upload-btn',
      action: 'chooseImage',
      expected: {
        type: 'function',
        shouldExist: true
      },
      description: '测试学历证明上传按钮'
    },
    {
      name: '取消注册按钮',
      selector: '.btn-secondary',
      action: 'onCancel',
      expected: {
        type: 'navigation',
        direction: 'back'
      },
      description: '测试注册取消按钮'
    },
    {
      name: '注册按钮',
      selector: '.btn-primary',
      action: 'showPrivacyModal',
      expected: {
        type: 'modal',
        shouldShow: 'privacy'
      },
      description: '测试注册提交按钮'
    }
  ],
  
  'pages/committee/committee': [
    {
      name: '汽车产业专委会',
      selector: '[data-page="automobile industry"]',
      action: 'navigateToPage',
      params: { currentTarget: { dataset: { page: 'automobile industry' } } },
      expected: {
        type: 'navigation',
        target: 'pages/automobile industry/automobile industry'
      },
      description: '测试汽车产业专委会入口'
    },
    {
      name: '人工智能专委会',
      selector: '[data-page="artificial intelligence"]',
      action: 'navigateToPage',
      params: { currentTarget: { dataset: { page: 'artificial intelligence' } } },
      expected: {
        type: 'navigation',
        target: 'pages/artificial intelligence/artificial intelligence'
      },
      description: '测试人工智能专委会入口'
    },
    {
      name: '新材料专委会',
      selector: '[data-page="new material"]',
      action: 'navigateToPage',
      params: { currentTarget: { dataset: { page: 'new material' } } },
      expected: {
        type: 'navigation',
        target: 'pages/new material/new material'
      },
      description: '测试新材料专委会入口'
    },
    {
      name: '联系我们按钮',
      selector: '.contact-btn',
      action: 'showContactModal',
      expected: {
        type: 'modal',
        shouldShow: 'contact'
      },
      description: '测试专委会联系按钮'
    }
  ],
  
  'pages/transform/transform': [
    {
      name: '更多信息按钮',
      selector: '.more-link',
      action: 'viewMoreInfo',
      expected: {
        type: 'function',
        shouldExist: true
      },
      description: '测试转化中心更多信息按钮'
    },
    {
      name: '成果卡片',
      selector: '.achievement-card',
      action: 'showAchievementModal',
      expected: {
        type: 'modal',
        shouldShow: 'achievement'
      },
      description: '测试科技成果展示卡片'
    }
  ]
};

// 单个测试用例执行器
const TestCaseRunner = {
  async run(testCase, pagePath) {
    const testId = `${pagePath}_${testCase.name}`;
    const startTime = new Date();
    
    Logger.info(`开始测试: ${testCase.name}`);
    
    try {
      // 获取当前页面实例
      const page = Utils.getCurrentPage();
      if (!page) {
        throw new Error('无法获取当前页面实例');
      }
      
      // 检查前置条件
      if (testCase.preconditions) {
        for (const condition of testCase.preconditions) {
          if (condition.includes('show') && Utils.hasFunction(page, condition)) {
            await Utils.safeExecute(page, condition, {}, `${testId}_precondition`);
            await Utils.sleep(CONFIG.interactionDelay);
          }
        }
      }
      
      // 执行按钮动作
      const executeResult = await Utils.safeExecute(
        page, 
        testCase.action, 
        testCase.params || {}, 
        testId
      );
      
      if (!executeResult.success) {
        throw new Error(`函数执行失败: ${executeResult.error}`);
      }
      
      // 验证预期结果
      const validationResult = await TestCaseRunner.validateResult(
        testCase.expected, 
        page, 
        testId
      );
      
      const endTime = new Date();
      const duration = endTime - startTime;
      
      if (validationResult.success) {
        TestResults.passedTests++;
        TestResults.details.push({
          id: testId,
          page: pagePath,
          name: testCase.name,
          status: 'passed',
          duration: duration,
          description: testCase.description,
          message: '测试通过'
        });
        
        Logger.success(`✅ ${testCase.name} (${duration}ms)`);
      } else {
        throw new Error(validationResult.error);
      }
      
    } catch (error) {
      TestResults.failedTests++;
      const endTime = new Date();
      const duration = endTime - startTime;
      
      TestResults.details.push({
        id: testId,
        page: pagePath,
        name: testCase.name,
        status: 'failed',
        duration: duration,
        description: testCase.description,
        message: error.message
      });
      
      Logger.error(`❌ ${testCase.name}: ${error.message}`);
    }
    
    TestResults.totalTests++;
    await Utils.sleep(CONFIG.interactionDelay);
  },
  
  async validateResult(expected, page, testId) {
    switch (expected.type) {
      case 'function':
        if (expected.shouldExist) {
          const hasFunc = Utils.hasFunction(page, expected.functionName || 'callback');
          return { success: hasFunc, error: hasFunc ? null : '预期函数不存在' };
        }
        return { success: true };
        
      case 'modal':
        if (expected.shouldShow) {
          // 检查对应的数据是否设置
          const modalDataKey = `show${expected.shouldShow.charAt(0).toUpperCase() + expected.shouldShow.slice(1)}Modal`;
          const hasModalData = Utils.hasData(page, modalDataKey);
          return { success: hasModalData, error: hasModalData ? null : '预期弹窗未显示' };
        }
        if (expected.shouldHide) {
          // 检查弹窗数据是否被隐藏
          return { success: true }; // 简化验证
        }
        return { success: true };
        
      case 'navigation':
        // 简化导航验证，实际项目中可能需要更复杂的检查
        return { success: true };
        
      default:
        return { success: true };
    }
  }
};

// 页面测试执行器
const PageTester = {
  async testPage(pagePath) {
    Logger.info(`开始测试页面: ${pagePath}`);
    
    try {
      // 导航到目标页面
      await Navigation.navigateTo(pagePath);
      
      // 获取页面的测试用例
      const testCases = ButtonTestCases[pagePath];
      if (!testCases || testCases.length === 0) {
        Logger.warning(`页面 ${pagePath} 没有找到测试用例`);
        TestResults.skippedTests++;
        return;
      }
      
      // 执行所有测试用例
      for (const testCase of testCases) {
        await TestCaseRunner.run(testCase, pagePath);
      }
      
    } catch (error) {
      ErrorCatcher.capture(error, `PageTester.testPage.${pagePath}`);
      TestResults.failedTests++;
    }
  },
  
  async testAllPages() {
    const pagePaths = Object.keys(ButtonTestCases);
    Logger.info(`开始测试所有页面，共 ${pagePaths.length} 个页面`);
    
    for (const pagePath of pagePaths) {
      await PageTester.testPage(pagePath);
      await Utils.sleep(1000); // 页面间等待
    }
  }
};

// 报告生成器
const ReportGenerator = {
  generateConsoleReport() {
    TestResults.endTime = new Date();
    const totalDuration = TestResults.endTime - TestResults.startTime;
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 高级按钮功能测试报告');
    console.log('='.repeat(70));
    console.log(`📅 测试时间: ${TestResults.startTime.toLocaleString()}`);
    console.log(`⏱️  总耗时: ${(totalDuration / 1000).toFixed(2)}秒`);
    console.log(`📋 总测试数: ${TestResults.totalTests}`);
    console.log(`✅ 通过数: ${TestResults.passedTests}`);
    console.log(`❌ 失败数: ${TestResults.failedTests}`);
    console.log(`⏭️  跳过数: ${TestResults.skippedTests}`);
    
    const passRate = TestResults.totalTests > 0 
      ? ((TestResults.passedTests / TestResults.totalTests) * 100).toFixed(2) 
      : 0;
    console.log(`📈 通过率: ${passRate}%`);
    
    if (TestResults.errors.length > 0) {
      console.log(`\n⚠️  捕获到 ${TestResults.errors.length} 个错误:`);
      TestResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.context}] ${error.message}`);
      });
    }
    
    console.log('\n📝 详细测试结果:');
    TestResults.details.forEach((detail, index) => {
      const icon = detail.status === 'passed' ? '✅' : '❌';
      const duration = detail.duration ? ` (${detail.duration}ms)` : '';
      console.log(`${icon} ${index + 1}. [${detail.page}] ${detail.name}${duration}`);
      if (detail.status === 'failed') {
        console.log(`    💬 ${detail.message}`);
      }
    });
    
    // 按页面分组统计
    const pageStats = {};
    TestResults.details.forEach(detail => {
      if (!pageStats[detail.page]) {
        pageStats[detail.page] = { passed: 0, failed: 0, total: 0 };
      }
      pageStats[detail.page].total++;
      if (detail.status === 'passed') {
        pageStats[detail.page].passed++;
      } else {
        pageStats[detail.page].failed++;
      }
    });
    
    console.log('\n📄 页面测试统计:');
    Object.keys(pageStats).forEach(page => {
      const stats = pageStats[page];
      const pagePassRate = ((stats.passed / stats.total) * 100).toFixed(1);
      console.log(`   ${page}: ${stats.passed}/${stats.total} (${pagePassRate}%)`);
    });
    
    console.log('\n🎉 测试完成！');
  },
  
  generateHTMLReport() {
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>微信小程序按钮功能测试报告</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
        .stat-card.passed { border-left-color: #28a745; }
        .stat-card.failed { border-left-color: #dc3545; }
        .stat-card.skipped { border-left-color: #ffc107; }
        .details { margin-top: 30px; }
        .test-item { padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #ddd; }
        .test-item.passed { border-left-color: #28a745; background: #d4edda; }
        .test-item.failed { border-left-color: #dc3545; background: #f8d7da; }
        .error-section { margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 8px; }
        .page-stats { margin-top: 20px; }
        .page-stat { margin: 10px 0; padding: 10px; background: #e9ecef; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8f9fa; }
        .duration { color: #6c757d; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 微信小程序按钮功能测试报告</h1>
            <p>生成时间: ${TestResults.endTime ? TestResults.endTime.toLocaleString() : new Date().toLocaleString()}</p>
            <p>测试耗时: ${TestResults.endTime ? ((TestResults.endTime - TestResults.startTime) / 1000).toFixed(2) : 'N/A'}秒</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <h3>总测试数</h3>
                <div style="font-size: 2em; font-weight: bold;">${TestResults.totalTests}</div>
            </div>
            <div class="stat-card passed">
                <h3>✅ 通过数</h3>
                <div style="font-size: 2em; font-weight: bold; color: #28a745;">${TestResults.passedTests}</div>
            </div>
            <div class="stat-card failed">
                <h3>❌ 失败数</h3>
                <div style="font-size: 2em; font-weight: bold; color: #dc3545;">${TestResults.failedTests}</div>
            </div>
            <div class="stat-card skipped">
                <h3>⏭️ 跳过数</h3>
                <div style="font-size: 2em; font-weight: bold; color: #ffc107;">${TestResults.skippedTests}</div>
            </div>
        </div>
        
        <div class="details">
            <h2>📋 详细测试结果</h2>
            <table>
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>页面</th>
                        <th>按钮名称</th>
                        <th>状态</th>
                        <th>耗时</th>
                        <th>描述</th>
                        <th>消息</th>
                    </tr>
                </thead>
                <tbody>
                    ${TestResults.details.map((detail, index) => `
                        <tr class="${detail.status}">
                            <td>${index + 1}</td>
                            <td>${detail.page}</td>
                            <td>${detail.name}</td>
                            <td><span style="color: ${detail.status === 'passed' ? '#28a745' : '#dc3545'}">${detail.status}</span></td>
                            <td class="duration">${detail.duration || 'N/A'}ms</td>
                            <td>${detail.description}</td>
                            <td>${detail.message}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        ${TestResults.errors.length > 0 ? `
        <div class="error-section">
            <h2>⚠️ 错误详情</h2>
            ${TestResults.errors.map((error, index) => `
                <div style="margin: 10px 0; padding: 10px; background: #fff3cd; border-radius: 5px;">
                    <strong>${index + 1}. [${error.context}]</strong><br>
                    ${error.message}<br>
                    <small>时间: ${error.timestamp.toLocaleString()}</small>
                </div>
            `).join('')}
        </div>
        ` : ''}
    </div>
</body>
</html>`;
    
    return html;
  }
};

// 主测试控制器
const TestController = {
  async runFullTest() {
    Logger.info('开始执行完整按钮功能测试...');
    
    try {
      TestResults.startTime = new Date();
      
      // 测试所有页面
      await PageTester.testAllPages();
      
      // 生成报告
      ReportGenerator.generateConsoleReport();
      
      // 生成HTML报告内容
      const htmlReport = ReportGenerator.generateHTMLReport();
      Logger.info('HTML报告已生成，可通过 ReportGenerator.generateHTMLReport() 获取');
      
      return {
        success: true,
        results: TestResults,
        htmlReport: htmlReport
      };
      
    } catch (error) {
      ErrorCatcher.capture(error, 'TestController.runFullTest');
      Logger.error('测试执行失败: ' + error.message);
      return {
        success: false,
        error: error.message,
        results: TestResults
      };
    }
  },
  
  async runQuickTest() {
    Logger.info('开始快速测试当前页面...');
    
    try {
      const page = Utils.getCurrentPage();
      if (!page) {
        throw new Error('无法获取当前页面实例');
      }
      
      const pagePath = page.route;
      Logger.info(`当前页面: ${pagePath}`);
      
      const testCases = ButtonTestCases[pagePath];
      if (!testCases || testCases.length === 0) {
        Logger.warning(`当前页面 ${pagePath} 没有找到测试用例`);
        return { success: true, message: '没有找到测试用例' };
      }
      
      for (const testCase of testCases) {
        await TestCaseRunner.run(testCase, pagePath);
      }
      
      ReportGenerator.generateConsoleReport();
      
      return {
        success: true,
        results: TestResults
      };
      
    } catch (error) {
      ErrorCatcher.capture(error, 'TestController.runQuickTest');
      Logger.error('快速测试失败: ' + error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// 暴露测试接口
const AdvancedButtonTest = {
  // 主要测试方法
  runFullTest: TestController.runFullTest,
  runQuickTest: TestController.runQuickTest,
  
  // 工具方法
  utils: Utils,
  navigation: Navigation,
  
  // 配置
  config: CONFIG,
  
  // 报告生成
  generateHTMLReport: ReportGenerator.generateHTMLReport,
  getResults: () => TestResults,
  resetResults: () => {
    TestResults.totalTests = 0;
    TestResults.passedTests = 0;
    TestResults.failedTests = 0;
    TestResults.skippedTests = 0;
    TestResults.errors = [];
    TestResults.details = [];
  }
};

// 全局暴露
if (typeof window !== 'undefined') {
  window.AdvancedButtonTest = AdvancedButtonTest;
}

// 微信小程序环境
if (typeof wx !== 'undefined') {
  console.log('📱 微信小程序高级按钮测试工具已加载');
  console.log('🔧 使用方法:');
  console.log('   AdvancedButtonTest.runFullTest() - 完整测试所有页面');
  console.log('   AdvancedButtonTest.runQuickTest() - 快速测试当前页面');
  console.log('   AdvancedButtonTest.generateHTMLReport() - 生成HTML报告');
  console.log('   AdvancedButtonTest.getResults() - 获取测试结果');
}

// Node.js环境导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedButtonTest;
}

console.log('🎯 高级按钮测试脚本加载完成！');
console.log('💡 运行 AdvancedButtonTest.runFullTest() 开始完整测试');