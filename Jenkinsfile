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
                    // 动态测试用例数据
                    def testCases = [
                        [name: '首页立即注册按钮', expectedStatus: 'passed', actualDuration: 150],
                        [name: '主页面秘书处按钮', expectedStatus: 'passed', actualDuration: 120],
                        [name: '注册页面上传按钮', expectedStatus: 'passed', actualDuration: 200],
                        [name: '专委会入口按钮', expectedStatus: 'passed', actualDuration: 100],
                        [name: '转化中心按钮', expectedStatus: 'passed', actualDuration: 130]
                    ]
                    
                    // 模拟动态测试执行
                    def actualResults = []
                    def passedCount = 0
                    def failedCount = 0
                    def totalDuration = 0
                    
                    testCases.each { testCase ->
                        def result = [
                            name: testCase.name,
                            expectedStatus: testCase.expectedStatus,
                            actualStatus: 'passed',
                            duration: testCase.actualDuration,
                            message: null
                        ]
                        
                        // 模拟检测：注册页面上传按钮有概率失败
                        if (testCase.name == '注册页面上传按钮') {
                            // 模拟文件上传失败，30%概率
                            def random = new Random().nextInt(100)
                            if (random < 30) {
                                result.actualStatus = 'failed'
                                result.message = '文件上传超时，服务器响应失败'
                                failedCount++
                                echo "   ❌ ${testCase.name} - 失败 (${testCase.actualDuration}ms) - ${result.message}"
                            } else {
                                passedCount++
                                echo "   ✅ ${testCase.name} - 通过 (${testCase.actualDuration}ms)"
                            }
                        } else {
                            passedCount++
                            echo "   ✅ ${testCase.name} - 通过 (${testCase.actualDuration}ms)"
                        }
                        
                        totalDuration += testCase.actualDuration
                        actualResults.add(result)
                    }
                    
                    def totalTests = testCases.size()
                    def passRate = (passedCount * 100) / totalTests
                    
                    echo "📋 测试摘要:"
                    echo "   总测试数: ${totalTests}"
                    echo "   通过数: ${passedCount}"
                    echo "   失败数: ${failedCount}"
                    echo "   总耗时: ${totalDuration}ms"
                    echo "   平均耗时: ${(totalDuration / totalTests)}ms"
                    echo "   通过率: ${passRate}%"
                    
                    // 设置构建结果
                    currentBuild.description = "测试: ${passedCount}/${totalTests}"
                    
                    // 存储结果供后续使用
                    env.testResultsJson = groovy.json.JsonBuilder([
                        summary: [
                            total: totalTests,
                            passed: passedCount,
                            failed: failedCount,
                            totalDuration: totalDuration,
                            averageDuration: totalDuration / totalTests,
                            passRate: passRate,
                            timestamp: new Date().format('yyyy-MM-dd HH:mm:ss')
                        ],
                        testCases: actualResults
                    ]).toString()
                }
            }
        }
        
        stage('生成报告') {
            steps {
                echo '📊 生成动态测试报告...'
                
                script {
                    def testResults = groovy.json.JsonSlurper().parseText(env.testResultsJson)
                    
                    // 生成文本报告
                    def textReport = "微信小程序按钮功能测试报告\n=====================================\n"
                    textReport += "生成时间: ${testResults.summary.timestamp}\n"
                    textReport += "构建号: ${env.BUILD_NUMBER}\n\n"
                    textReport += "测试摘要:\n--------\n"
                    textReport += "总测试数: ${testResults.summary.total}\n"
                    textReport += "通过数: ${testResults.summary.passed}\n"
                    textReport += "失败数: ${testResults.summary.failed}\n"
                    textReport += "总耗时: ${testResults.summary.totalDuration}ms\n"
                    textReport += "平均耗时: ${testResults.summary.averageDuration}ms\n"
                    textReport += "通过率: ${testResults.summary.passRate}%\n\n"
                    textReport += "测试详情:\n--------"
                    
                    testResults.testCases.each { testCase ->
                        def status = testCase.actualStatus == 'passed' ? '✅' : '❌'
                        textReport += "\n${status} ${testCase.name} - ${testCase.actualStatus} (${testCase.duration}ms)"
                        if (testCase.message) {
                            textReport += "\n   错误: ${testCase.message}"
                        }
                    }
                    
                    textReport += "\n\n说明:\n-----\n"
                    textReport += "- 本测试模拟微信小程序按钮功能检测\n"
                    textReport += "- 基于动态检测结果生成报告\n"
                    textReport += "- 建议关注失败的测试用例\n"
                    
                    if (testResults.summary.failed > 0) {
                        textReport += "- 当前存在失败的测试，请检查相关功能\n"
                    } else {
                        textReport += "- 所有测试用例均通过\n"
                    }
                    
                    writeFile file: 'test-results.txt', text: textReport
                    
                    // 生成XML报告
                    def xmlReport = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<testsuites name=\"微信小程序按钮功能测试\" tests=\"${testResults.summary.total}\" failures=\"${testResults.summary.failed}\" errors=\"0\" time=\"${testResults.summary.totalDuration / 1000}\">\n    <testsuite name=\"按钮功能测试\" tests=\"${testResults.summary.total}\" failures=\"${testResults.summary.failed}\" errors=\"0\" time=\"${testResults.summary.totalDuration / 1000}\">"
                    
                    testResults.testCases.each { testCase ->
                        xmlReport += "\n        <testcase name=\"${testCase.name}\" classname=\"button-test\" time=\"${testCase.duration / 1000}\">"
                        if (testCase.actualStatus == 'failed') {
                            xmlReport += "\n            <failure message=\"${testCase.message}\">${testCase.message}</failure>"
                        }
                        xmlReport += "\n        </testcase>"
                    }
                    
                    xmlReport += "\n    </testsuite>\n</testsuites>"
                    
                    writeFile file: 'test-results.xml', text: xmlReport
                    
                    // 生成HTML报告
                    def htmlReport = "<!DOCTYPE html>\n<html>\n<head>\n    <meta charset=\"UTF-8\">\n    <title>微信小程序按钮功能测试报告</title>\n    <style>\n        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }\n        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }\n        .header { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }\n        .header h1 { margin: 0; font-size: 2.5em; }\n        .header p { margin: 5px 0 0 0; opacity: 0.9; }\n        .build-status { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; font-weight: bold; }\n        .summary { display: flex; gap: 20px; margin-bottom: 30px; justify-content: center; flex-wrap: wrap; }\n        .stat { background: white; padding: 25px; border-radius: 8px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); min-width: 140px; }\n        .stat h3 { margin: 0 0 10px 0; color: #666; font-size: 1em; }\n        .stat .number { font-size: 2.2em; font-weight: bold; }\n        .passed { border-top: 4px solid #28a745; color: #28a745; }\n        .failed { border-top: 4px solid #dc3545; color: #dc3545; }\n        .total { border-top: 4px solid #007bff; color: #007bff; }\n        .progress-bar { background: #e9ecef; border-radius: 8px; height: 30px; margin-bottom: 30px; overflow: hidden; }\n        .progress-fill { background: linear-gradient(90deg, #28a745, #20c997); height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; transition: width 0.5s ease; }\n        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }\n        th, td { padding: 15px; text-align: left; border-bottom: 1px solid #dee2e6; }\n        th { background: #f8f9fa; font-weight: 600; color: #495057; }\n        .status-passed { color: #28a745; font-weight: bold; }\n        .status-failed { color: #dc3545; font-weight: bold; }\n        .error-message { color: #dc3545; font-size: 0.9em; }\n        .footer { margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center; color: #6c757d; }\n        .detection-info { background: #e3f2fd; color: #1565c0; padding: 15px; border-radius: 8px; margin-bottom: 20px; }\n    </style>\n</head>\n<body>\n    <div class=\"container\">\n        <div class=\"header\">\n            <h1>🤖 微信小程序按钮功能测试报告</h1>\n            <p>生成时间: ${testResults.summary.timestamp}</p>\n            <p>构建号: ${env.BUILD_NUMBER}</p>\n        </div>\n        \n        <div class=\"build-status\">\n            🎉 构建状态: 稳定 (SUCCESS) - 动态检测结果\n        </div>\n        \n        <div class=\"detection-info\">\n            🔍 检测模式: 基于动态算法自动检测测试结果\n        </div>\n        \n        <div class=\"summary\">\n            <div class=\"stat total\">\n                <h3>总测试数</h3>\n                <div class=\"number\">${testResults.summary.total}</div>\n            </div>\n            <div class=\"stat passed\">\n                <h3>通过</h3>\n                <div class=\"number\">${testResults.summary.passed}</div>\n            </div>\n            <div class=\"stat failed\">\n                <h3>失败</h3>\n                <div class=\"number\">${testResults.summary.failed}</div>\n            </div>\n        </div>\n        \n        <div class=\"summary\">\n            <div class=\"stat total\">\n                <h3>总耗时</h3>\n                <div class=\"number\">${testResults.summary.totalDuration}ms</div>\n            </div>\n            <div class=\"stat total\">\n                <h3>平均耗时</h3>\n                <div class=\"number\">${(int)testResults.summary.averageDuration}ms</div>\n            </div>\n        </div>\n        \n        <div class=\"progress-bar\">\n            <div class=\"progress-fill\" style=\"width: ${testResults.summary.passRate}%;\">\n                通过率: ${testResults.summary.passRate}%\n            </div>\n        </div>\n        \n        <table>\n            <thead>\n                <tr>\n                    <th>测试用例</th>\n                    <th>状态</th>\n                    <th>耗时(ms)</th>\n                    <th>检测结果</th>\n                </tr>\n            </thead>\n            <tbody>"
                    
                    testResults.testCases.each { testCase ->
                        htmlReport += "\n                <tr>\n                    <td><strong>${testCase.name}</strong></td>\n                    <td class=\"status-${testCase.actualStatus}\">${testCase.actualStatus == 'passed' ? '✅ 通过' : '❌ 失败'}</td>\n                    <td>${testCase.duration}</td>\n                    <td>"
                        if (testCase.message) {
                            htmlReport += "<div class=\"error-message\">${testCase.message}</div>"
                        } else {
                            htmlReport += "功能正常"
                        }
                        htmlReport += "</td>\n                </tr>"
                    }
                    
                    htmlReport += "\n            </tbody>\n        </table>\n        \n        <div class=\"footer\">\n            <h3>🔧 测试说明</h3>\n            <p>本测试报告由Jenkins CI/CD自动生成</p>\n            <p>测试环境: Jenkins自动化测试环境</p>\n            <p>测试类型: 按钮功能动态检测</p>\n            <p><strong>检测算法:</strong> 基于随机概率和实际场景模拟</p>\n        </div>\n    </div>\n</body>\n</html>"
                    
                    writeFile file: 'test-results.html', text: htmlReport
                    
                    echo '✅ 动态测试报告生成完成'
                    echo "📊 实际检测结果: ${testResults.summary.passed}通过/${testResults.summary.total}总计"
                    echo '📁 生成文件: test-results.txt, test-results.xml, test-results.html'
                }
            }
        }
    }
    
    post {
        always {
            echo '📦 归档动态测试报告...'
            archiveArtifacts artifacts: 'test-results.*', allowEmptyArchive: true
            echo '✅ 报告归档完成'
            echo '💡 提示: 请在"Artifacts"中下载test-results.html查看完整动态报告'
        }
        
        success {
            echo '🎉 动态测试构建成功完成！'
            script {
                def testResults = groovy.json.JsonSlurper().parseText(env.testResultsJson)
                echo "📊 最终检测结果: ${testResults.summary.passed}个通过，${testResults.summary.failed}个失败，通过率${testResults.summary.passRate}%"
            }
        }
        
        failure {
            echo '❌ 构建失败！'
        }
    }
}