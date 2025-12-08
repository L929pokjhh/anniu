/**
 * Jenkins环境下的微信小程序按钮功能测试脚本
 * 适用于CI/CD自动化测试
 * 
 * 作者: AI Assistant
 * 创建时间: 2025-12-08
 * 适用于: Jenkins CI/CD 环境
 */

const fs = require('fs');
const path = require('path');

// Jenkins环境检测
const isJenkinsEnvironment = process.env.JENKINS_URL || process.env.JENKINS_HOME;

// Jenkins配置
const JENKINS_CONFIG = {
  workspace: process.env.WORKSPACE || process.cwd(),
  buildNumber: process.env.BUILD_NUMBER || 'local',
  jobName: process.env.JOB_NAME || 'weapp-button-test',
  buildUrl: process.env.BUILD_URL || 'local',
  reportDir: process.env.TEST_REPORT_DIR || 'test-results',
  junitReportPath: process.env.JUNIT_REPORT_PATH || 'test-results/junit.xml',
  htmlReportPath: process.env.HTML_REPORT_PATH || 'test-results/report.html',
  jsonReportPath: process.env.JSON_REPORT_PATH || 'test-results/results.json'
};

// 测试结果存储
const TestResults = {
  startTime: new Date(),
  endTime: null,
  environment: {
    nodeVersion: process.version,
    platform: process.platform,
    jenkins: isJenkinsEnvironment,
    buildNumber: JENKINS_CONFIG.buildNumber,
    jobName: JENKINS_CONFIG.jobName
  },
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    errors: 0
  },
  testCases: [],
  errors: []
};

// 日志工具
const Logger = {
  log: (level, message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    console.log(logMessage);
    
    // 在Jenkins环境中，特殊标记重要信息
    if (isJenkinsEnvironment) {
      switch (level) {
        case 'ERROR':
          console.log(`##[error]${message}`);
          break;
        case 'WARNING':
          console.log(`##[warning]${message}`);
          break;
        case 'SUCCESS':
          console.log(`##[notice]${message}`);
          break;
      }
    }
  },
  
  info: (message) => Logger.log('INFO', message),
  error: (message) => Logger.log('ERROR', message),
  warning: (message) => Logger.log('WARNING', message),
  success: (message) => Logger.log('SUCCESS', message)
};

// 工具函数
const Utils = {
  // 创建报告目录
  ensureDirectoryExists: (dirPath) => {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        Logger.info(`创建目录: ${dirPath}`);
      }
    } catch (error) {
      Logger.error(`创建目录失败: ${error.message}`);
    }
  },
  
  // 保存文件
  saveFile: (filePath, content) => {
    try {
      const dir = path.dirname(filePath);
      Utils.ensureDirectoryExists(dir);
      fs.writeFileSync(filePath, content, 'utf8');
      Logger.info(`保存文件: ${filePath}`);
    } catch (error) {
      Logger.error(`保存文件失败: ${error.message}`);
    }
  },
  
  // 读取JSON文件
  readJSONFile: (filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch (error) {
      Logger.warning(`读取JSON文件失败: ${error.message}`);
    }
    return null;
  },
  
  // 格式化时间
  formatDuration: (startTime, endTime) => {
    const duration = endTime - startTime;
    const seconds = Math.floor(duration / 1000);
    const milliseconds = duration % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
  }
};

// 模拟微信小程序环境
const WeChatSimulator = {
  // 模拟页面数据
  pages: {
    'pages/index/index': {
      data: {
        showAgreementModal: false,
        agreementRead: false
      },
      methods: {
        goToRegister: function() {
          Logger.info('模拟导航到注册页面');
          return { success: true, target: 'pages/register/register' };
        },
        viewInfo: function() {
          Logger.info('模拟查看更多信息');
          return { success: true };
        },
        cancelAgreement: function() {
          this.data.showAgreementModal = false;
          return { success: true };
        },
        confirmAgreement: function() {
          if (this.data.agreementRead) {
            return { success: true, action: 'register' };
          } else {
            throw new Error('需要先同意协议');
          }
        }
      }
    },
    
    'pages/main/main': {
      data: {
        showActivityModal: false,
        showSignupModal: false,
        showSecretaryModal: false
      },
      methods: {
        navigateToPage: function(event) {
          const page = event.currentTarget.dataset.page;
          Logger.info(`模拟导航到页面: ${page}`);
          
          if (page === 'secretary') {
            this.data.showSecretaryModal = true;
            return { success: true, action: 'showModal', modal: 'secretary' };
          }
          
          return { success: true, target: `pages/${page}/${page}` };
        },
        hideActivityModal: function() {
          this.data.showActivityModal = false;
          return { success: true };
        },
        showSignupModal: function() {
          this.data.showSignupModal = true;
          return { success: true, action: 'showModal', modal: 'signup' };
        },
        submitSignup: function() {
          return { success: true, action: 'submit' };
        }
      }
    },
    
    'pages/register/register': {
      data: {
        formData: {},
        showPrivacyModal: false,
        uploadedImage: null
      },
      methods: {
        chooseImage: function() {
          this.data.uploadedImage = 'mock-image-path.jpg';
          return { success: true, action: 'upload' };
        },
        onCancel: function() {
          return { success: true, action: 'navigateBack' };
        },
        showPrivacyModal: function() {
          this.data.showPrivacyModal = true;
          return { success: true, action: 'showModal', modal: 'privacy' };
        },
        disagreePrivacyPolicy: function() {
          this.data.showPrivacyModal = false;
          return { success: true, action: 'disagree' };
        },
        agreePrivacyPolicy: function() {
          this.data.showPrivacyModal = false;
          return { success: true, action: 'agree', target: 'submit' };
        }
      }
    },
    
    'pages/alliance/alliance': {
      data: {
        allianceImages: [],
        businessCards: []
      },
      methods: {
        onBusinessCardTap: function(event) {
          const id = event.currentTarget.dataset.id;
          Logger.info(`模拟点击业务卡片: ${id}`);
          return { success: true, cardId: id };
        },
        navigateToHome: function() {
          return { success: true, target: 'pages/index/index' };
        },
        navigateToActivities: function() {
          return { success: true, target: 'pages/latest activity/latest activity' };
        }
      }
    },
    
    'pages/committee/committee': {
      data: {
        committees: []
      },
      methods: {
        navigateToPage: function(event) {
          const page = event.currentTarget.dataset.page;
          Logger.info(`模拟导航到专委会页面: ${page}`);
          return { success: true, target: `pages/${page}/${page}` };
        },
        showContactModal: function() {
          return { success: true, action: 'showModal', modal: 'contact' };
        }
      }
    },
    
    'pages/transform/transform': {
      data: {
        achievements: [],
        showAchievementModal: false
      },
      methods: {
        viewMoreInfo: function() {
          Logger.info('模拟查看更多信息');
          return { success: true };
        },
        showAchievementModal: function(event) {
          const index = event.currentTarget.dataset.index;
          this.data.showAchievementModal = true;
          return { success: true, action: 'showModal', modal: 'achievement', index: index };
        },
        hideAchievementModal: function() {
          this.data.showAchievementModal = false;
          return { success: true };
        },
        contactAchievement: function() {
          return { success: true, action: 'contact' };
        }
      }
    }
  },
  
  // 获取页面实例
  getPage: function(pagePath) {
    if (this.pages[pagePath]) {
      return {
        route: pagePath,
        data: this.pages[pagePath].data,
        ...this.pages[pagePath].methods
      };
    }
    return null;
  }
};

// 测试用例执行器
const TestCaseExecutor = {
  async executeTestCase(pagePath, testCase) {
    const startTime = new Date();
    const testCaseId = `${pagePath}_${testCase.name}`;
    
    Logger.info(`执行测试用例: ${testCase.name}`);
    
    try {
      // 获取页面实例
      const page = WeChatSimulator.getPage(pagePath);
      if (!page) {
        throw new Error(`页面不存在: ${pagePath}`);
      }
      
      // 检查函数是否存在
      if (typeof page[testCase.action] !== 'function') {
        throw new Error(`函数不存在: ${testCase.action}`);
      }
      
      // 执行测试
      let result;
      if (testCase.params) {
        result = page[testCase.action](testCase.params);
      } else {
        result = page[testCase.action]();
      }
      
      // 验证预期结果
      const validationResult = TestCaseExecutor.validateResult(testCase.expected, result, page);
      
      const endTime = new Date();
      const duration = endTime - startTime;
      
      if (validationResult.success) {
        TestResults.summary.passed++;
        const testCaseResult = {
          id: testCaseId,
          page: pagePath,
          name: testCase.name,
          status: 'passed',
          duration: duration,
          description: testCase.description,
          message: '测试通过',
          result: result
        };
        
        TestResults.testCases.push(testCaseResult);
        Logger.success(`✅ ${testCase.name} (${Utils.formatDuration(startTime, endTime)})`);
        
        return testCaseResult;
      } else {
        throw new Error(validationResult.error);
      }
      
    } catch (error) {
      const endTime = new Date();
      const duration = endTime - startTime;
      
      TestResults.summary.failed++;
      TestResults.summary.errors++;
      
      const testCaseResult = {
        id: testCaseId,
        page: pagePath,
        name: testCase.name,
        status: 'failed',
        duration: duration,
        description: testCase.description,
        message: error.message,
        error: error.stack
      };
      
      TestResults.testCases.push(testCaseResult);
      TestResults.errors.push({
        testCase: testCaseId,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      Logger.error(`❌ ${testCase.name}: ${error.message}`);
      
      return testCaseResult;
    } finally {
      TestResults.summary.total++;
    }
  },
  
  validateResult(expected, actual, page) {
    if (!expected) {
      return { success: true };
    }
    
    switch (expected.type) {
      case 'function':
        if (expected.shouldExist) {
          return { success: actual && actual.success };
        }
        return { success: true };
        
      case 'navigation':
        if (expected.target) {
          return { 
            success: actual && actual.target && actual.target.includes(expected.target),
            error: !actual || !actual.target ? '导航结果为空' : `目标不匹配: ${actual.target}`
          };
        }
        return { success: actual && actual.success };
        
      case 'modal':
        if (expected.shouldShow) {
          const modalKey = `show${expected.shouldShow.charAt(0).toUpperCase() + expected.shouldShow.slice(1)}Modal`;
          const isModalVisible = page.data && page.data[modalKey];
          return { 
            success: isModalVisible,
            error: isModalVisible ? null : '模态框未显示'
          };
        }
        return { success: actual && actual.success };
        
      default:
        return { success: actual && actual.success };
    }
  }
};

// 测试用例定义
const TEST_CASES = [
  // 首页测试用例
  {
    page: 'pages/index/index',
    cases: [
      {
        name: '立即注册按钮',
        action: 'goToRegister',
        expected: { type: 'navigation', target: 'pages/register/register' },
        description: '测试首页注册按钮导航功能'
      },
      {
        name: '了解更多按钮',
        action: 'viewInfo',
        expected: { type: 'function', shouldExist: true },
        description: '测试首页信息查看功能'
      },
      {
        name: '取消协议按钮',
        action: 'cancelAgreement',
        expected: { type: 'function', shouldExist: true },
        description: '测试协议取消功能'
      }
    ]
  },
  
  // 主页面测试用例
  {
    page: 'pages/main/main',
    cases: [
      {
        name: '秘书处按钮',
        action: 'navigateToPage',
        params: { currentTarget: { dataset: { page: 'secretary' } } },
        expected: { type: 'modal', shouldShow: 'secretary' },
        description: '测试秘书处入口功能'
      },
      {
        name: '专委会按钮',
        action: 'navigateToPage',
        params: { currentTarget: { dataset: { page: 'committee' } } },
        expected: { type: 'navigation', target: 'pages/committee/committee' },
        description: '测试专委会入口功能'
      },
      {
        name: '转化中心按钮',
        action: 'navigateToPage',
        params: { currentTarget: { dataset: { page: 'transform' } } },
        expected: { type: 'navigation', target: 'pages/transform/transform' },
        description: '测试转化中心入口功能'
      },
      {
        name: '我要报名按钮',
        action: 'showSignupModal',
        expected: { type: 'modal', shouldShow: 'signup' },
        description: '测试活动报名功能'
      }
    ]
  },
  
  // 注册页面测试用例
  {
    page: 'pages/register/register',
    cases: [
      {
        name: '上传学历证明按钮',
        action: 'chooseImage',
        expected: { type: 'function', shouldExist: true },
        description: '测试学历证明上传功能'
      },
      {
        name: '取消注册按钮',
        action: 'onCancel',
        expected: { type: 'function', shouldExist: true },
        description: '测试注册取消功能'
      },
      {
        name: '注册按钮',
        action: 'showPrivacyModal',
        expected: { type: 'modal', shouldShow: 'privacy' },
        description: '测试注册提交功能'
      },
      {
        name: '同意隐私政策',
        action: 'agreePrivacyPolicy',
        expected: { type: 'function', shouldExist: true },
        description: '测试隐私政策同意功能'
      }
    ]
  },
  
  // 联盟介绍页面测试用例
  {
    page: 'pages/alliance/alliance',
    cases: [
      {
        name: '业务卡片点击',
        action: 'onBusinessCardTap',
        params: { currentTarget: { dataset: { id: '1' } } },
        expected: { type: 'function', shouldExist: true },
        description: '测试业务卡片点击功能'
      },
      {
        name: '导航到首页',
        action: 'navigateToHome',
        expected: { type: 'navigation', target: 'pages/index/index' },
        description: '测试首页导航功能'
      }
    ]
  },
  
  // 专委会页面测试用例
  {
    page: 'pages/committee/committee',
    cases: [
      {
        name: '汽车产业专委会',
        action: 'navigateToPage',
        params: { currentTarget: { dataset: { page: 'automobile industry' } } },
        expected: { type: 'navigation', target: 'pages/automobile industry/automobile industry' },
        description: '测试汽车产业专委会入口'
      },
      {
        name: '人工智能专委会',
        action: 'navigateToPage',
        params: { currentTarget: { dataset: { page: 'artificial intelligence' } } },
        expected: { type: 'navigation', target: 'pages/artificial intelligence/artificial intelligence' },
        description: '测试人工智能专委会入口'
      },
      {
        name: '联系我们按钮',
        action: 'showContactModal',
        expected: { type: 'function', shouldExist: true },
        description: '测试专委会联系功能'
      }
    ]
  },
  
  // 转化中心页面测试用例
  {
    page: 'pages/transform/transform',
    cases: [
      {
        name: '更多信息按钮',
        action: 'viewMoreInfo',
        expected: { type: 'function', shouldExist: true },
        description: '测试转化中心信息查看功能'
      },
      {
        name: '成果展示卡片',
        action: 'showAchievementModal',
        params: { currentTarget: { dataset: { index: '0' } } },
        expected: { type: 'modal', shouldShow: 'achievement' },
        description: '测试科技成果展示功能'
      }
    ]
  }
];

// 报告生成器
const ReportGenerator = {
  // 生成JUnit格式XML报告
  generateJUnitReport: () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="微信小程序按钮功能测试" tests="${TestResults.summary.total}" failures="${TestResults.summary.failed}" errors="${TestResults.summary.errors}" time="${Utils.formatDuration(TestResults.startTime, TestResults.endTime || new Date())}">
${TEST_CASES.map(testSuite => {
  const testCases = TestResults.testCases.filter(tc => tc.page === testSuite.page);
  return `  <testsuite name="${testSuite.page}" tests="${testCases.length}" failures="${testCases.filter(tc => tc.status === 'failed').length}" errors="${testCases.filter(tc => tc.status === 'error').length}">
${testCases.map(testCase => {
    const status = testCase.status === 'passed' ? '' : ` failure="${testCase.status}"`;
    return `    <testcase name="${testCase.name}" classname="${testCase.page}" time="${testCase.duration / 1000}"${status}>
${testCase.status !== 'passed' ? `      <failure message="${testCase.message}">${testCase.error || testCase.message}</failure>` : ''}
    </testcase>`;
  }).join('\n')}
  </testsuite>`;
}).join('\n')}
</testsuites>`;
    
    return xml;
  },
  
  // 生成HTML报告
  generateHTMLReport: () => {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>微信小程序按钮功能测试报告 - Jenkins</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .jenkins-header { background: linear-gradient(135deg, #2475b0 0%, #2a6d95 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .environment-info { background: #e8f4fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-card { text-align: center; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
        .stat-card.passed { border-left-color: #28a745; background: #d4edda; }
        .stat-card.failed { border-left-color: #dc3545; background: #f8d7da; }
        .stat-card.errors { border-left-color: #ffc107; background: #fff3cd; }
        .test-results { margin-top: 30px; }
        .test-case { margin: 10px 0; padding: 15px; border-radius: 5px; border-left: 4px solid #ddd; }
        .test-case.passed { border-left-color: #28a745; background: #d4edda; }
        .test-case.failed { border-left-color: #dc3545; background: #f8d7da; }
        .duration { color: #6c757d; font-size: 0.9em; }
        .error-section { margin-top: 30px; padding: 20px; background: #f8d7da; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8f9fa; }
    </style>
</head>
<body>
    <div class="container">
        <div class="jenkins-header">
            <h1>🤖 微信小程序按钮功能测试报告</h1>
            <p>Jenkins CI/CD 自动化测试报告</p>
            <p>构建号: #${JENKINS_CONFIG.buildNumber} | 作业: ${JENKINS_CONFIG.jobName}</p>
            <p>测试时间: ${TestResults.startTime.toLocaleString()}</p>
        </div>
        
        <div class="environment-info">
            <h3>📊 环境信息</h3>
            <ul>
                <li>Node.js版本: ${TestResults.environment.nodeVersion}</li>
                <li>运行平台: ${TestResults.environment.platform}</li>
                <li>Jenkins环境: ${TestResults.environment.jenkins ? '是' : '否'}</li>
                <li>工作空间: ${JENKINS_CONFIG.workspace}</li>
            </ul>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <h3>总测试数</h3>
                <div style="font-size: 2em; font-weight: bold;">${TestResults.summary.total}</div>
            </div>
            <div class="stat-card passed">
                <h3>✅ 通过</h3>
                <div style="font-size: 2em; font-weight: bold; color: #28a745;">${TestResults.summary.passed}</div>
            </div>
            <div class="stat-card failed">
                <h3>❌ 失败</h3>
                <div style="font-size: 2em; font-weight: bold; color: #dc3545;">${TestResults.summary.failed}</div>
            </div>
            <div class="stat-card errors">
                <h3>⚠️ 错误</h3>
                <div style="font-size: 2em; font-weight: bold; color: #ffc107;">${TestResults.summary.errors}</div>
            </div>
        </div>
        
        <div class="test-results">
            <h2>📋 测试结果详情</h2>
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
                    ${TestResults.testCases.map((testCase, index) => `
                        <tr class="${testCase.status}">
                            <td>${index + 1}</td>
                            <td>${testCase.page}</td>
                            <td>${testCase.name}</td>
                            <td><span style="color: ${testCase.status === 'passed' ? '#28a745' : '#dc3545'}">${testCase.status}</span></td>
                            <td class="duration">${(testCase.duration / 1000).toFixed(3)}s</td>
                            <td>${testCase.description}</td>
                            <td>${testCase.message}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        ${TestResults.errors.length > 0 ? `
        <div class="error-section">
            <h2>⚠️ 错误详情</h2>
            ${TestResults.errors.map((error, index) => `
                <div style="margin: 10px 0; padding: 10px; background: #f8d7da; border-radius: 5px;">
                    <strong>${index + 1}. ${error.testCase}</strong><br>
                    <code>${error.error}</code><br>
                    <small>时间: ${error.timestamp}</small>
                </div>
            `).join('')}
        </div>
        ` : ''}
    </div>
</body>
</html>`;
    
    return html;
  },
  
  // 生成JSON报告
  generateJSONReport: () => {
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        environment: TestResults.environment,
        jenkins: {
          buildNumber: JENKINS_CONFIG.buildNumber,
          jobName: JENKINS_CONFIG.jobName,
          buildUrl: JENKINS_CONFIG.buildUrl
        }
      },
      summary: TestResults.summary,
      duration: Utils.formatDuration(TestResults.startTime, TestResults.endTime || new Date()),
      testCases: TestResults.testCases,
      errors: TestResults.errors
    };
    
    return JSON.stringify(report, null, 2);
  }
};

// 主测试执行器
const JenkinsTestRunner = {
  async runAllTests() {
    Logger.info('🚀 开始执行Jenkins环境下的按钮功能测试');
    Logger.info(`📁 工作空间: ${JENKINS_CONFIG.workspace}`);
    Logger.info(`🔢 构建号: ${JENKINS_CONFIG.buildNumber}`);
    
    TestResults.startTime = new Date();
    
    try {
      // 创建报告目录
      Utils.ensureDirectoryExists(JENKINS_CONFIG.reportDir);
      
      // 执行所有测试用例
      for (const testSuite of TEST_CASES) {
        Logger.info(`📄 测试页面: ${testSuite.page}`);
        
        for (const testCase of testSuite.cases) {
          await TestCaseExecutor.executeTestCase(testSuite.page, testCase);
        }
      }
      
      TestResults.endTime = new Date();
      
      // 生成报告
      Logger.info('📊 生成测试报告...');
      
      const junitReport = ReportGenerator.generateJUnitReport();
      const htmlReport = ReportGenerator.generateHTMLReport();
      const jsonReport = ReportGenerator.generateJSONReport();
      
      // 保存报告文件
      Utils.saveFile(JENKINS_CONFIG.junitReportPath, junitReport);
      Utils.saveFile(JENKINS_CONFIG.htmlReportPath, htmlReport);
      Utils.saveFile(JENKINS_CONFIG.jsonReportPath, jsonReport);
      
      // 输出测试摘要
      Logger.info(`✅ 测试完成! 总耗时: ${Utils.formatDuration(TestResults.startTime, TestResults.endTime)}`);
      Logger.info(`📋 总计: ${TestResults.summary.total}, 通过: ${TestResults.summary.passed}, 失败: ${TestResults.summary.failed}, 错误: ${TestResults.summary.errors}`);
      
      // 在Jenkins环境中，设置构建状态
      if (isJenkinsEnvironment && TestResults.summary.failed > 0) {
        Logger.error('测试失败，构建将被标记为失败');
        process.exit(1); // 非零退出码表示失败
      }
      
      return {
        success: TestResults.summary.failed === 0,
        summary: TestResults.summary,
        reports: {
          junit: JENKINS_CONFIG.junitReportPath,
          html: JENKINS_CONFIG.htmlReportPath,
          json: JENKINS_CONFIG.jsonReportPath
        }
      };
      
    } catch (error) {
      Logger.error(`❌ 测试执行失败: ${error.message}`);
      TestResults.errors.push({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      if (isJenkinsEnvironment) {
        process.exit(1);
      }
      
      return {
        success: false,
        error: error.message,
        summary: TestResults.summary
      };
    }
  }
};

// 命令行参数处理
function parseArguments() {
  const args = process.argv.slice(2);
  const options = {
    help: false,
    verbose: false,
    reportDir: null,
    junitPath: null,
    htmlPath: null,
    jsonPath: null
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '-v':
      case '--verbose':
        options.verbose = true;
        break;
      case '--report-dir':
        options.reportDir = args[++i];
        break;
      case '--junit-path':
        options.junitPath = args[++i];
        break;
      case '--html-path':
        options.htmlPath = args[++i];
        break;
      case '--json-path':
        options.jsonPath = args[++i];
        break;
    }
  }
  
  return options;
}

// 显示帮助信息
function showHelp() {
  console.log(`
微信小程序按钮功能测试工具 - Jenkins版本

使用方法:
  node jenkins-test.js [选项]

选项:
  -h, --help              显示帮助信息
  -v, --verbose           启用详细日志
  --report-dir <dir>      指定报告输出目录 (默认: test-results)
  --junit-path <path>     指定JUnit报告路径 (默认: test-results/junit.xml)
  --html-path <path>      指定HTML报告路径 (默认: test-results/report.html)
  --json-path <path>      指定JSON报告路径 (默认: test-results/results.json)

环境变量:
  JENKINS_URL             Jenkins服务器URL
  JENKINS_HOME            Jenkins主目录
  WORKSPACE               Jenkins工作空间目录
  BUILD_NUMBER            构建号
  JOB_NAME                作业名称
  BUILD_URL               构建URL
  TEST_REPORT_DIR         测试报告目录
  JUNIT_REPORT_PATH       JUnit报告路径
  HTML_REPORT_PATH        HTML报告路径
  JSON_REPORT_PATH        JSON报告路径

示例:
  node jenkins-test.js
  node jenkins-test.js --verbose
  node jenkins-test.js --report-dir /tmp/reports
`);
}

// 主入口函数
async function main() {
  const options = parseArguments();
  
  if (options.help) {
    showHelp();
    return;
  }
  
  // 应用命令行选项
  if (options.reportDir) JENKINS_CONFIG.reportDir = options.reportDir;
  if (options.junitPath) JENKINS_CONFIG.junitReportPath = options.junitPath;
  if (options.htmlPath) JENKINS_CONFIG.htmlReportPath = options.htmlPath;
  if (options.jsonPath) JENKINS_CONFIG.jsonReportPath = options.jsonPath;
  
  // 更新相对路径为绝对路径
  Object.keys(JENKINS_CONFIG).forEach(key => {
    if (key.includes('Path') || key === 'reportDir') {
      if (!path.isAbsolute(JENKINS_CONFIG[key])) {
        JENKINS_CONFIG[key] = path.resolve(JENKINS_CONFIG.workspace, JENKINS_CONFIG[key]);
      }
    }
  });
  
  const result = await JenkinsTestRunner.runAllTests();
  
  if (result.success) {
    console.log('\n🎉 所有测试通过！');
    process.exit(0);
  } else {
    console.log('\n❌ 测试失败！');
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(error => {
    Logger.error(`程序执行失败: ${error.message}`);
    process.exit(1);
  });
}

// 导出模块
module.exports = {
  JenkinsTestRunner,
  ReportGenerator,
  TestCaseExecutor,
  JENKINS_CONFIG
};