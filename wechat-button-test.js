/**
 * 微信小程序按钮功能测试脚本
 * 适用于微信开发者工具环境
 * 
 * 使用方法：
 * 1. 在微信开发者工具中打开项目
 * 2. 在调试器Console中粘贴并运行此脚本
 * 3. 查看测试结果
 */

console.log('🚀 微信小程序按钮功能测试开始...');

// 测试配置
const TEST_CONFIG = {
  pages: [
    'pages/index/index',
    'pages/main/main', 
    'pages/register/register',
    'pages/alliance/alliance',
    'pages/committee/committee',
    'pages/transform/transform'
  ]
};

// 按钮测试数据 - 基于实际页面结构
const BUTTON_TESTS = {
  'pages/index/index': [
    { id: 'register-btn', text: '立即注册', action: 'navigateTo' },
    { id: 'info-btn', text: '了解更多', action: 'viewInfo' },
    { id: 'cancel-btn', text: '取消', action: 'cancelAgreement' },
    { id: 'confirm-btn', text: '确认注册', action: 'confirmAgreement' }
  ],
  'pages/main/main': [
    { id: 'secretary-card', text: '秘书处', action: 'navigateToPage' },
    { id: 'committee-card', text: '专委会', action: 'navigateToPage' },
    { id: 'transform-card', text: '转化中心', action: 'navigateToPage' },
    { id: 'academy-card', text: '求是书院', action: 'navigateToPage' },
    { id: 'activity-modal-close', text: '关闭', action: 'hideActivityModal' },
    { id: 'activity-signup', text: '我要报名', action: 'showSignupModal' },
    { id: 'signup-cancel', text: '取消', action: 'hideSignupModal' },
    { id: 'signup-submit', text: '提交报名', action: 'submitSignup' }
  ],
  'pages/register/register': [
    { id: 'upload-btn', text: '点击上传学历证明', action: 'chooseImage' },
    { id: 'cancel-btn', text: '取消', action: 'onCancel' },
    { id: 'register-btn', text: '注册', action: 'showPrivacyModal' },
    { id: 'disagree-privacy', text: '不同意', action: 'disagreePrivacyPolicy' },
    { id: 'agree-privacy', text: '同意并注册', action: 'agreePrivacyPolicy' }
  ],
  'pages/alliance/alliance': [
    { id: 'business-card-1', text: '业务卡片1', action: 'onBusinessCardTap' },
    { id: 'business-card-2', text: '业务卡片2', action: 'onBusinessCardTap' },
    { id: 'nav-home', text: '首页', action: 'navigateToHome' },
    { id: 'nav-activities', text: '活动详情', action: 'navigateToActivities' }
  ],
  'pages/committee/committee': [
    { id: 'automobile-card', text: '汽车产业与技术专委会', action: 'navigateToPage' },
    { id: 'ai-card', text: '人工智能专委会', action: 'navigateToPage' },
    { id: 'material-card', text: '新材料专委会', action: 'navigateToPage' },
    { id: 'agriculture-card', text: '智慧农业专委会', action: 'navigateToPage' },
    { id: 'investment-card', text: '投融资专委会', action: 'navigateToPage' },
    { id: 'lowaltitude-card', text: '低空经济专委会', action: 'navigateToPage' },
    { id: 'cleanenergy-card', text: '清洁能源专委会', action: 'navigateToPage' },
    { id: 'economic-card', text: '经济法制专委会', action: 'navigateToPage' },
    { id: 'art-card', text: '艺术专委会', action: 'navigateToPage' },
    { id: 'contact-btn', text: '联系我们', action: 'showContactModal' }
  ],
  'pages/transform/transform': [
    { id: 'more-info', text: '更多信息', action: 'viewMoreInfo' },
    { id: 'achievement-card-1', text: '成果卡片1', action: 'showAchievementModal' },
    { id: 'achievement-card-2', text: '成果卡片2', action: 'showAchievementModal' },
    { id: 'modal-close', text: '关闭', action: 'hideAchievementModal' },
    { id: 'contact-project', text: '联系项目', action: 'contactAchievement' }
  ]
};

// 测试结果
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

// 当前页面实例
let currentPage = null;

// 获取当前页面实例
function getCurrentPage() {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
}

// 模拟按钮点击
function simulateButtonClick(buttonInfo) {
  const page = getCurrentPage();
  if (!page) {
    console.error('无法获取当前页面实例');
    return false;
  }
  
  console.log(`🔍 测试按钮: ${buttonInfo.text}`);
  
  try {
    // 检查按钮对应的函数是否存在
    if (typeof page[buttonInfo.action] === 'function') {
      console.log(`✅ 找到函数: ${buttonInfo.action}`);
      
      // 如果是页面跳转，检查参数
      if (buttonInfo.action === 'navigateToPage' && buttonInfo.data) {
        page[buttonInfo.action]({ currentTarget: { dataset: buttonInfo.data } });
      } else {
        page[buttonInfo.action]();
      }
      
      return true;
    } else {
      console.log(`❌ 函数不存在: ${buttonInfo.action}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ 执行函数时出错: ${error.message}`);
    return false;
  }
}

// 测试单个页面的按钮
function testPageButtons(pagePath) {
  console.log(`\n📄 测试页面: ${pagePath}`);
  
  const buttonTests = BUTTON_TESTS[pagePath];
  if (!buttonTests || buttonTests.length === 0) {
    console.log(`⚠️  页面 ${pagePath} 没有找到测试用例`);
    return;
  }
  
  buttonTests.forEach(buttonTest => {
    testResults.total++;
    
    const success = simulateButtonClick(buttonTest);
    
    if (success) {
      testResults.passed++;
      testResults.details.push({
        page: pagePath,
        button: buttonTest.text,
        action: buttonTest.action,
        status: 'passed',
        message: '函数执行成功'
      });
      console.log(`✅ 通过: ${buttonTest.text}`);
    } else {
      testResults.failed++;
      testResults.details.push({
        page: pagePath,
        button: buttonTest.text,
        action: buttonTest.action,
        status: 'failed',
        message: '函数不存在或执行失败'
      });
      console.log(`❌ 失败: ${buttonTest.text}`);
    }
  });
}

// 自动导航到指定页面
function navigateToPage(pagePath) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 导航到页面: ${pagePath}`);
    
    wx.navigateTo({
      url: `/${pagePath}`,
      success: () => {
        setTimeout(() => {
          console.log(`✅ 页面加载完成: ${pagePath}`);
          resolve();
        }, 1000);
      },
      fail: (error) => {
        console.error(`❌ 页面导航失败: ${error.errMsg}`);
        reject(error);
      }
    });
  });
}

// 执行所有页面测试
async function runAllTests() {
  console.log('🎯 开始执行完整的按钮功能测试...\n');
  
  // 重置测试结果
  testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
  };
  
  try {
    // 逐个测试每个页面
    for (const pagePath of TEST_CONFIG.pages) {
      try {
        // 导航到目标页面
        await navigateToPage(pagePath);
        
        // 等待页面完全加载
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 测试页面按钮
        testPageButtons(pagePath);
        
        // 等待一下再测试下一个页面
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`测试页面 ${pagePath} 时发生错误:`, error);
        testResults.failed++;
        testResults.details.push({
          page: pagePath,
          button: '页面导航',
          action: 'navigateTo',
          status: 'failed',
          message: error.message
        });
      }
    }
    
    // 生成测试报告
    generateTestReport();
    
  } catch (error) {
    console.error('❌ 测试执行过程中发生严重错误:', error);
  }
}

// 生成测试报告
function generateTestReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 微信小程序按钮功能测试报告');
  console.log('='.repeat(60));
  console.log(`📅 测试时间: ${new Date().toLocaleString()}`);
  console.log(`📋 总测试数: ${testResults.total}`);
  console.log(`✅ 通过数: ${testResults.passed}`);
  console.log(`❌ 失败数: ${testResults.failed}`);
  console.log(`📈 通过率: ${testResults.total > 0 ? ((testResults.passed / testResults.total) * 100).toFixed(2) : 0}%`);
  
  console.log('\n📝 详细结果:');
  testResults.details.forEach((detail, index) => {
    const icon = detail.status === 'passed' ? '✅' : '❌';
    console.log(`${icon} ${index + 1}. [${detail.page}] ${detail.button} (${detail.action}) - ${detail.message}`);
  });
  
  // 按页面分组显示结果
  console.log('\n📄 按页面分组结果:');
  const pageResults = {};
  testResults.details.forEach(detail => {
    if (!pageResults[detail.page]) {
      pageResults[detail.page] = { passed: 0, failed: 0, buttons: [] };
    }
    if (detail.status === 'passed') {
      pageResults[detail.page].passed++;
    } else {
      pageResults[detail.page].failed++;
    }
    pageResults[detail.page].buttons.push(detail);
  });
  
  Object.keys(pageResults).forEach(page => {
    const result = pageResults[page];
    const total = result.passed + result.failed;
    const passRate = ((result.passed / total) * 100).toFixed(1);
    console.log(`\n📄 ${page}:`);
    console.log(`   通过: ${result.passed}/${total} (${passRate}%)`);
    if (result.failed > 0) {
      result.buttons.filter(b => b.status === 'failed').forEach(button => {
        console.log(`   ❌ ${button.button}: ${button.message}`);
      });
    }
  });
  
  console.log('\n🎉 测试完成！');
  
  return testResults;
}

// 快速测试当前页面
function quickTestCurrentPage() {
  console.log('⚡ 快速测试当前页面按钮...');
  
  const page = getCurrentPage();
  if (!page) {
    console.error('无法获取当前页面实例');
    return;
  }
  
  const currentRoute = page.route;
  console.log(`当前页面: ${currentRoute}`);
  
  if (BUTTON_TESTS[currentRoute]) {
    testPageButtons(currentRoute);
    generateTestReport();
  } else {
    console.log(`⚠️  页面 ${currentRoute} 没有找到测试用例`);
  }
}

// 导出测试函数
const WeChatButtonTest = {
  runAllTests,
  quickTestCurrentPage,
  testPageButtons,
  generateTestReport,
  testResults: () => testResults
};

// 暴露到全局作用域
if (typeof window !== 'undefined') {
  window.WeChatButtonTest = WeChatButtonTest;
}

// 在微信小程序环境中
if (typeof wx !== 'undefined') {
  console.log('📱 检测到微信小程序环境');
  console.log('💡 使用方法:');
  console.log('   WeChatButtonTest.runAllTests() - 测试所有页面');
  console.log('   WeChatButtonTest.quickTestCurrentPage() - 快速测试当前页面');
  
  // 可选：自动运行快速测试
  // setTimeout(() => WeChatButtonTest.quickTestCurrentPage(), 2000);
}

// Node.js环境导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WeChatButtonTest;
}

console.log('🎯 按钮测试脚本加载完成！');