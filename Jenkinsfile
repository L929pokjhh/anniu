pipeline {
    agent any
    
    stages {
        stage('初始化') {
            steps {
                echo '🚀 开始微信小程序按钮测试'
                echo "📁 工作空间: ${env.WORKSPACE}"
                echo "🔢 构建号: ${env.BUILD_NUMBER}"
                
                // 使用Java创建目录，避免shell命令问题
                script {
                    def testDir = 'test-results'
                    def dirFile = new File(testDir)
                    if (!dirFile.exists()) {
                        dirFile.mkdirs()
                        echo "✅ 创建测试目录: ${testDir}"
                    }
                }
            }
        }
        
        stage('生成测试报告') {
            steps {
                echo '📊 生成测试报告...'
                
                script {
                    // 模拟测试结果数据
                    def testResults = [
                        summary: [
                            total: 5,
                            passed: 4,
                            failed: 1,
                            errors: 0
                        ],
                        testCases: [
                            [name: '首页立即注册按钮', status: 'passed', duration: 150, description: '测试首页注册按钮功能'],
                            [name: '主页面秘书处按钮', status: 'passed', duration: 120, description: '测试秘书处入口功能'],
                            [name: '注册页面上传按钮', status: 'failed', duration: 200, message: '模拟文件上传失败', description: '测试学历证明上传功能'],
                            [name: '专委会入口按钮', status: 'passed', duration: 100, description: '测试专委会入口功能'],
                            [name: '转化中心按钮', status: 'passed', duration: 130, description: '测试转化中心入口功能']
                        ]
                    ]
                    
                    // 使用Java API创建文件，避免shell命令
                    try {
                        // 生成JSON报告
                        def jsonFile = new File('test-results/results.json')
                        jsonFile.text = groovy.json.JsonBuilder(testResults).toPrettyString()
                        echo '✅ JSON报告生成完成'
                        
                        // 生成JUnit XML报告
                        def junitXml = '<?xml version="1.0" encoding="UTF-8"?>'
                        junitXml += '<testsuites name="微信小程序按钮功能测试" '
                        junitXml += "tests=\"${testResults.summary.total}\" "
                        junitXml += "failures=\"${testResults.summary.failed}\" "
                        junitXml += "errors=\"${testResults.summary.errors}\">"
                        
                        junitXml += '<testsuite name="按钮功能测试" '
                        junitXml += "tests=\"${testResults.summary.total}\" "
                        junitXml += "failures=\"${testResults.summary.failed}\" "
                        junitXml += "errors=\"${testResults.summary.errors}\">"
                        
                        testResults.testCases.each { testCase ->
                            junitXml += '<testcase name="' + testCase.name + '" '
                            junitXml += 'classname="button-test" '
                            junitXml += 'time="' + (testCase.duration / 1000) + '">'
                            
                            if (testCase.status == 'failed') {
                                junitXml += '<failure message="' + (testCase.message ?: 'Test failed') + '">'
                                junitXml += (testCase.message ?: 'Test failed')
                                junitXml += '</failure>'
                            }
                            
                            junitXml += '</testcase>'
                        }
                        
                        junitXml += '</testsuite>'
                        junitXml += '</testsuites>'
                        
                        def junitFile = new File('test-results/junit.xml')
                        junitFile.text = junitXml
                        echo '✅ JUnit报告生成完成'
                        
                        // 生成HTML报告
                        def htmlReport = '''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>微信小程序按钮功能测试报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .summary { display: flex; gap: 20px; margin-bottom: 30px; justify-content: center; flex-wrap: wrap; }
        .stat { background: white; padding: 25px; border-radius: 8px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); min-width: 150px; }
        .stat h3 { margin: 0 0 10px 0; color: #333; font-size: 1.1em; }
        .stat .number { font-size: 2.5em; font-weight: bold; }
        .passed { border-top: 4px solid #28a745; }
        .failed { border-top: 4px solid #dc3545; }
        .total { border-top: 4px solid #007bff; }
        .progress-bar { background: #e9ecef; border-radius: 8px; height: 30px; margin-bottom: 30px; overflow: hidden; }
        .progress-fill { background: linear-gradient(90deg, #28a745, #20c997); height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; transition: width 0.5s ease; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid #dee2e6; }
        th { background: #f8f9fa; font-weight: 600; color: #495057; }
        .status-passed { color: #28a745; font-weight: bold; }
        .status-failed { color: #dc3545; font-weight: bold; }
        .footer { margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center; color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 微信小程序按钮功能测试报告</h1>
            <p>生成时间: ''' + new Date().format('yyyy-MM-dd HH:mm:ss') + '''</p>
            <p>构建号: ''' + env.BUILD_NUMBER + '''</p>
        </div>
        
        <div class="summary">
            <div class="stat total">
                <h3>总测试数</h3>
                <div class="number">''' + testResults.summary.total + '''</div>
            </div>
            <div class="stat passed">
                <h3>通过</h3>
                <div class="number">''' + testResults.summary.passed + '''</div>
            </div>
            <div class="stat failed">
                <h3>失败</h3>
                <div class="number">''' + testResults.summary.failed + '''</div>
            </div>
        </div>
        
        <div class="progress-bar">
            <div class="progress-fill" style="width: ''' + ((testResults.summary.passed / testResults.summary.total) * 100) + '''%;">
                通过率: ''' + String.format("%.1f", (testResults.summary.passed / testResults.summary.total) * 100) + '''%
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>测试用例</th>
                    <th>状态</th>
                    <th>耗时(ms)</th>
                    <th>描述</th>
                    <th>错误信息</th>
                </tr>
            </thead>
            <tbody>'''
                        
                        testResults.testCases.each { testCase ->
                            htmlReport += '''
                <tr>
                    <td><strong>''' + testCase.name + '''</strong></td>
                    <td class="status-''' + testCase.status + '''">''' + testCase.status.toUpperCase() + '''</td>
                    <td>''' + testCase.duration + '''</td>
                    <td>''' + testCase.description + '''</td>
                    <td>''' + (testCase.message ?: '-') + '''</td>
                </tr>'''
                        }
                        
                        htmlReport += '''
            </tbody>
        </table>
        
        <div class="footer">
            <h3>🔧 测试说明</h3>
            <p>本测试报告由Jenkins CI/CD自动生成</p>
            <p>测试环境: Jenkins自动化测试环境 | 测试类型: 按钮功能模拟测试</p>
            <p><em>使用纯Groovy实现，无需外部依赖</em></p>
        </div>
    </div>
</body>
</html>'''
                        
                        def htmlFile = new File('test-results/report.html')
                        htmlFile.text = htmlReport
                        echo '✅ HTML报告生成完成'
                        
                        // 输出测试摘要
                        echo "📋 测试摘要:"
                        echo "   总测试数: ${testResults.summary.total}"
                        echo "   通过数: ${testResults.summary.passed}"
                        echo "   失败数: ${testResults.summary.failed}"
                        echo "   通过率: ${String.format('%.1f', (testResults.summary.passed / testResults.summary.total) * 100)}%"
                        
                        // 设置构建状态
                        if (testResults.summary.failed > 0) {
                            currentBuild.result = 'UNSTABLE'
                            echo '⚠️ 存在失败的测试用例'
                        }
                        
                        currentBuild.description = "测试: ${testResults.summary.passed}/${testResults.summary.total}"
                        
                    } catch (Exception e) {
                        echo "❌ 报告生成失败: ${e.getMessage()}"
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '📦 发布测试报告...'
            
            script {
                try {
                    // 检查文件是否存在，然后归档
                    def testDir = new File('test-results')
                    if (testDir.exists()) {
                        def files = testDir.listFiles()
                        echo "📁 发现测试文件: ${files?.size() ?: 0} 个"
                        
                        files?.each { file ->
                            echo "   - ${file.name} (${file.length()} bytes)"
                        }
                        
                        archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                        
                        if (testDir.listFiles().find { it.name == 'junit.xml' }) {
                            junit 'test-results/junit.xml'
                        }
                        
                        if (testDir.listFiles().find { it.name == 'report.html' }) {
                            publishHTML target: [
                                allowMissing: true,
                                reportDir: 'test-results',
                                reportFiles: 'report.html',
                                reportName: '按钮功能测试报告'
                            ]
                        }
                    } else {
                        echo "⚠️ 测试目录不存在"
                    }
                    
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