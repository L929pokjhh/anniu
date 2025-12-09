pipeline {
    agent any
    
    stages {
        stage('初始化') {
            steps {
                echo '🚀 开始微信小程序按钮测试'
                echo "📁 工作空间: ${env.WORKSPACE}"
                echo "🔢 构建号: ${env.BUILD_NUMBER}"
            }
        }
        
        stage('执行测试') {
            steps {
                echo '🧪 执行按钮功能测试...'
                
                script {
                    def totalTests = 5
                    def passedTests = 4
                    def failedTests = 1
                    def passRate = ((passedTests / totalTests) * 100).round(2)
                    
                    echo "📋 测试摘要:"
                    echo "   总测试数: ${totalTests}"
                    echo "   通过数: ${passedTests}"
                    echo "   失败数: ${failedTests}"
                    echo "   通过率: ${passRate}%"
                    
                    echo "📋 测试详情:"
                    echo "   ✅ 首页立即注册按钮 (150ms)"
                    echo "   ✅ 主页面秘书处按钮 (120ms)"
                    echo "   ❌ 注册页面上传按钮 (200ms)"
                    echo "   ✅ 专委会入口按钮 (100ms)"
                    echo "   ✅ 转化中心按钮 (130ms)"
                    
                    if (failedTests > 0) {
                        currentBuild.result = 'UNSTABLE'
                    }
                    
                    currentBuild.description = "测试: ${passedTests}/${totalTests}"
                }
            }
        }
        
        stage('生成报告') {
            steps {
                echo '📊 生成测试报告...'
                
                // 使用writeFile直接生成报告，避免变量定义
                writeFile file: 'test-results.txt', text: """微信小程序按钮功能测试报告
=====================================
生成时间: ${new Date().format('yyyy-MM-dd HH:mm:ss')}
构建号: ${env.BUILD_NUMBER}

测试摘要:
--------
总测试数: 5
通过数: 4
失败数: 1
通过率: 80.0%

测试详情:
--------
✅ 首页立即注册按钮 (150ms)
✅ 主页面秘书处按钮 (120ms)
❌ 注册页面上传按钮 (200ms)
✅ 专委会入口按钮 (100ms)
✅ 转化中心按钮 (130ms)

说明:
-----
- 本测试模拟微信小程序按钮功能
- 1个测试用例失败，其他通过
- 建议检查文件上传相关功能"""
                
                writeFile file: 'test-results.xml', text: """<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="微信小程序按钮功能测试" tests="5" failures="1" errors="0">
    <testsuite name="按钮功能测试" tests="5" failures="1" errors="0">
        <testcase name="首页立即注册按钮" classname="button-test" time="0.15"></testcase>
        <testcase name="主页面秘书处按钮" classname="button-test" time="0.12"></testcase>
        <testcase name="注册页面上传按钮" classname="button-test" time="0.20">
            <failure message="模拟文件上传失败">文件上传功能测试失败</failure>
        </testcase>
        <testcase name="专委会入口按钮" classname="button-test" time="0.10"></testcase>
        <testcase name="转化中心按钮" classname="button-test" time="0.13"></testcase>
    </testsuite>
</testsuites>"""
                
                writeFile file: 'test-results.html', text: """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>微信小程序按钮功能测试报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .header { background: #f0f8ff; padding: 20px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
        .header h1 { margin: 0; color: #333; }
        .summary { display: flex; gap: 20px; margin-bottom: 20px; justify-content: center; }
        .stat { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; min-width: 120px; }
        .stat h3 { margin: 0 0 10px 0; color: #666; }
        .stat .number { font-size: 2em; font-weight: bold; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .total { color: #007bff; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
        th { background: #f8f9fa; font-weight: bold; }
        .status-passed { color: #28a745; font-weight: bold; }
        .status-failed { color: #dc3545; font-weight: bold; }
        .footer { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 微信小程序按钮功能测试报告</h1>
            <p>生成时间: ${new Date().format('yyyy-MM-dd HH:mm:ss')}</p>
            <p>构建号: ${env.BUILD_NUMBER}</p>
        </div>
        
        <div class="summary">
            <div class="stat total">
                <h3>总测试数</h3>
                <div class="number">5</div>
            </div>
            <div class="stat passed">
                <h3>通过</h3>
                <div class="number">4</div>
            </div>
            <div class="stat failed">
                <h3>失败</h3>
                <div class="number">1</div>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>测试用例</th>
                    <th>状态</th>
                    <th>耗时(ms)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>首页立即注册按钮</td>
                    <td class="status-passed">通过</td>
                    <td>150</td>
                </tr>
                <tr>
                    <td>主页面秘书处按钮</td>
                    <td class="status-passed">通过</td>
                    <td>120</td>
                </tr>
                <tr>
                    <td>注册页面上传按钮</td>
                    <td class="status-failed">失败</td>
                    <td>200</td>
                </tr>
                <tr>
                    <td>专委会入口按钮</td>
                    <td class="status-passed">通过</td>
                    <td>100</td>
                </tr>
                <tr>
                    <td>转化中心按钮</td>
                    <td class="status-passed">通过</td>
                    <td>130</td>
                </tr>
            </tbody>
        </table>
        
        <div class="footer">
            <h3>测试说明</h3>
            <p>本测试报告由Jenkins CI/CD自动生成</p>
            <p>测试环境: Jenkins自动化测试环境</p>
            <p>测试类型: 按钮功能模拟测试</p>
        </div>
    </div>
</body>
</html>"""
                
                echo '✅ 测试报告生成完成'
                echo '📁 生成文件: test-results.txt, test-results.xml, test-results.html'
            }
        }
    }
    
    post {
        always {
            echo '📦 发布测试报告...'
            
            script {
                try {
                    archiveArtifacts artifacts: 'test-results.*', allowEmptyArchive: true
                    
                    publishHTML target: [
                        allowMissing: true,
                        reportDir: '.',
                        reportFiles: 'test-results.html',
                        reportName: '按钮功能测试报告'
                    ]
                    
                    echo '✅ 报告发布完成'
                    
                } catch (Exception e) {
                    echo "⚠️ 报告发布失败: ${e.getMessage()}"
                }
            }
        }
        
        success {
            echo '🎉 构建成功完成！'
        }
        
        unstable {
            echo '⚠️ 构建完成，但存在失败的测试用例'
        }
        
        failure {
            echo '❌ 构建失败！'
        }
    }
}