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
                    try {
                        // 模拟测试结果
                        def testResults = [
                            summary: [total: 5, passed: 4, failed: 1, errors: 0],
                            testCases: [
                                [name: '首页立即注册按钮', status: 'passed', duration: 150],
                                [name: '主页面秘书处按钮', status: 'passed', duration: 120],
                                [name: '注册页面上传按钮', status: 'failed', duration: 200],
                                [name: '专委会入口按钮', status: 'passed', duration: 100],
                                [name: '转化中心按钮', status: 'passed', duration: 130]
                            ]
                        ]
                        
                        // 输出测试结果
                        echo "📋 测试摘要:"
                        echo "   总测试数: ${testResults.summary.total}"
                        echo "   通过数: ${testResults.summary.passed}"
                        echo "   失败数: ${testResults.summary.failed}"
                        echo "   通过率: ${((testResults.summary.passed / testResults.summary.total) * 100).round(2)}%"
                        
                        testResults.testCases.each { testCase ->
                            def status = testCase.status == 'passed' ? '✅' : '❌'
                            echo "   ${status} ${testCase.name} (${testCase.duration}ms)"
                        }
                        
                        // 设置构建状态
                        if (testResults.summary.failed > 0) {
                            currentBuild.result = 'UNSTABLE'
                        }
                        
                        currentBuild.description = "测试: ${testResults.summary.passed}/${testResults.summary.total}"
                        
                    } catch (Exception e) {
                        echo "❌ 测试执行失败: ${e.getMessage()}"
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }
        
        stage('生成简单报告') {
            steps {
                echo '📊 生成测试报告...'
                
                // 使用writeFile，这是Jenkins允许的安全方法
                writeFile file: 'test-results.txt', text: """
微信小程序按钮功能测试报告
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
- 建议检查文件上传相关功能
"""
                
                // 生成XML格式报告
                def xmlReport = """<?xml version="1.0" encoding="UTF-8"?>
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
                
                writeFile file: 'test-results.xml', text: xmlReport
                
                // 生成HTML报告
                def htmlReport = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>微信小程序按钮功能测试报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f8ff; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .passed { color: green; font-weight: bold; }
        .failed { color: red; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        th { background: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 微信小程序按钮功能测试报告</h1>
        <p>生成时间: ${new Date().format('yyyy-MM-dd HH:mm:ss')}</p>
        <p>构建号: ${env.BUILD_NUMBER}</p>
    </div>
    
    <div class="summary">
        <h3>测试摘要</h3>
        <p><strong>总测试数:</strong> 5</p>
        <p class="passed"><strong>通过:</strong> 4</p>
        <p class="failed"><strong>失败:</strong> 1</p>
        <p><strong>通过率:</strong> 80.0%</p>
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
                <td class="passed">通过</td>
                <td>150</td>
            </tr>
            <tr>
                <td>主页面秘书处按钮</td>
                <td class="passed">通过</td>
                <td>120</td>
            </tr>
            <tr>
                <td>注册页面上传按钮</td>
                <td class="failed">失败</td>
                <td>200</td>
            </tr>
            <tr>
                <td>专委会入口按钮</td>
                <td class="passed">通过</td>
                <td>100</td>
            </tr>
            <tr>
                <td>转化中心按钮</td>
                <td class="passed">通过</td>
                <td>130</td>
            </tr>
        </tbody>
    </table>
    
    <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px;">
        <h3>测试说明</h3>
        <p>本测试报告由Jenkins CI/CD自动生成</p>
        <p>测试环境: Jenkins自动化测试环境</p>
        <p>测试类型: 按钮功能模拟测试</p>
    </div>
</body>
</html>"""
                
                writeFile file: 'test-results.html', text: htmlReport
                
                echo '✅ 测试报告生成完成'
                echo '📁 生成文件:'
                echo '   - test-results.txt'
                echo '   - test-results.xml' 
                echo '   - test-results.html'
            }
        }
    }
    
    post {
        always {
            echo '📦 发布测试报告...'
            
            script {
                try {
                    // 归档报告文件
                    archiveArtifacts artifacts: 'test-results.*', allowEmptyArchive: true
                    
                    // 发布HTML报告
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