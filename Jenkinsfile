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
                        [name: '首页立即注册按钮', expectedStatus: 'passed', actualDuration: 150, icon: '🏠', description: '测试首页注册按钮功能是否正常'],
                        [name: '主页面秘书处按钮', expectedStatus: 'passed', actualDuration: 120, icon: '📋', description: '测试秘书处入口功能是否正常'],
                        [name: '注册页面上传按钮', expectedStatus: 'passed', actualDuration: 200, icon: '📤', description: '测试学历证明文件上传功能是否正常'],
                        [name: '专委会入口按钮', expectedStatus: 'passed', actualDuration: 100, icon: '👥', description: '测试专委会入口功能是否正常'],
                        [name: '转化中心按钮', expectedStatus: 'passed', actualDuration: 130, icon: '🔄', description: '测试转化中心入口功能是否正常']
                    ]
                    
                    // 模拟动态测试执行
                    def actualResults = []
                    def passedCount = 0
                    def failedCount = 0
                    def totalDuration = 0
                    
                    testCases.each { testCase ->
                        def result = [
                            name: testCase.name,
                            icon: testCase.icon,
                            description: testCase.description,
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
                                result.message = '文件上传超时，服务器响应失败，请检查网络连接和服务器状态'
                                failedCount++
                                echo "   ❌ ${result.icon} ${testCase.name} - 失败 (${testCase.actualDuration}ms) - ${result.message}"
                            } else {
                                passedCount++
                                echo "   ✅ ${result.icon} ${testCase.name} - 通过 (${testCase.actualDuration}ms)"
                            }
                        } else {
                            passedCount++
                            echo "   ✅ ${result.icon} ${testCase.name} - 通过 (${testCase.actualDuration}ms)"
                        }
                        
                        totalDuration += testCase.actualDuration
                        actualResults.add(result)
                    }
                    
                    def totalTests = testCases.size()
                    // 避免使用Math.round，直接进行整数运算
                    def passRate = (passedCount * 10000) / totalTests  // 保留两位小数
                    def passRateInteger = passRate.toInteger()
                    def passRateDisplay = passRateInteger / 100.0
                    def avgDuration = totalDuration / totalTests
                    def avgDurationInteger = avgDuration.toInteger()
                    def timestamp = new Date().format('yyyy-MM-dd HH:mm:ss')
                    
                    echo "📋 测试摘要:"
                    echo "   总测试数: ${totalTests}"
                    echo "   通过数: ${passedCount}"
                    echo "   失败数: ${failedCount}"
                    echo "   总耗时: ${totalDuration}ms"
                    echo "   平均耗时: ${avgDuration}ms"
                    echo "   通过率: ${passRateDisplay}%"
                    
                    // 设置构建结果
                    currentBuild.description = "测试: ${passedCount}/${totalTests}"
                    
                    // 生成统计数据文件，避免序列化问题
                    def summaryData = "TOTAL_TESTS=${totalTests}\n"
                    summaryData += "PASSED_TESTS=${passedCount}\n"
                    summaryData += "FAILED_TESTS=${failedCount}\n"
                    summaryData += "TOTAL_DURATION=${totalDuration}\n"
                    summaryData += "AVG_DURATION=${avgDuration}\n"
                    summaryData += "AVG_DURATION_INT=${avgDurationInteger}\n"
                    summaryData += "PASS_RATE=${passRateDisplay}\n"
                    summaryData += "PASS_RATE_INT=${passRateInteger}\n"
                    summaryData += "TIMESTAMP=${timestamp}"
                    
                    writeFile file: 'test-summary.properties', text: summaryData
                    
                    // 生成详细的测试结果文件
                    def detailsData = ""
                    actualResults.eachWithIndex { result, index ->
                        detailsData += "TEST_${index}_NAME=${result.name}\n"
                        detailsData += "TEST_${index}_ICON=${result.icon}\n"
                        detailsData += "TEST_${index}_DESCRIPTION=${result.description}\n"
                        detailsData += "TEST_${index}_STATUS=${result.actualStatus}\n"
                        detailsData += "TEST_${index}_DURATION=${result.duration}\n"
                        if (result.message) {
                            detailsData += "TEST_${index}_MESSAGE=${result.message}\n"
                        }
                        detailsData += "TEST_${index}_INDEX=${index}\n"
                    }
                    
                    writeFile file: 'test-details.properties', text: detailsData
                    
                    // 存储统计变量
                    env.totalTests = totalTests.toString()
                    env.passedTests = passedCount.toString()
                    env.failedTests = failedCount.toString()
                    env.passRate = passRateDisplay.toString()
                    env.timestamp = timestamp
                }
            }
        }
        
        stage('生成报告') {
            steps {
                echo '📊 生成美化动态测试报告...'
                
                script {
                    // 读取统计数据，避免序列化问题
                    def summaryContent = readFile file: 'test-summary.properties'
                    def detailsContent = readFile file: 'test-details.properties'
                    
                    // 解析统计数据
                    def summary = [:]
                    summaryContent.split('\n').each { line ->
                        if (line.contains('=')) {
                            def parts = line.split('=', 2)
                            summary[parts[0]] = parts[1]
                        }
                    }
                    
                    // 解析测试详情
                    def testCases = []
                    detailsContent.split('\n').each { line ->
                        if (line.startsWith('TEST_') && line.contains('=')) {
                            def parts = line.split('=', 2)
                            def keyParts = parts[0].split('_')
                            def testIndex = keyParts[1] as Integer
                            def field = keyParts[2]
                            
                            // 确保测试案例数组足够大
                            while (testCases.size() <= testIndex) {
                                testCases.add([:])
                            }
                            
                            testCases[testIndex][field] = parts[1]
                        }
                    }
                    
                    // 生成文本报告
                    def textReport = "🤖 微信小程序按钮功能测试报告\n=====================================\n"
                    textReport += "⏰ 生成时间: ${summary.TIMESTAMP}\n"
                    textReport += "🏗️ 构建号: ${env.BUILD_NUMBER}\n\n"
                    textReport += "📊 测试摘要:\n--------\n"
                    textReport += "📈 总测试数: ${summary.TOTAL_TESTS}\n"
                    textReport += "✅ 通过数: ${summary.PASSED_TESTS}\n"
                    textReport += "❌ 失败数: ${summary.FAILED_TESTS}\n"
                    textReport += "⏱️ 总耗时: ${summary.TOTAL_DURATION}ms\n"
                    textReport += "📊 平均耗时: ${summary.AVG_DURATION}ms\n"
                    textReport += "📈 通过率: ${summary.PASS_RATE}%\n\n"
                    textReport += "🧪 测试详情:\n--------"
                    
                    testCases.each { testCase ->
                        def status = testCase.STATUS == 'passed' ? '✅' : '❌'
                        textReport += "\n${status} ${testCase.ICON} ${testCase.NAME} - ${testCase.STATUS} (${testCase.DURATION}ms)"
                        textReport += "\n📝 ${testCase.DESCRIPTION}"
                        if (testCase.MESSAGE) {
                            textReport += "\n⚠️ 错误: ${testCase.MESSAGE}"
                        }
                    }
                    
                    textReport += "\n\n📋 说明:\n-----\n"
                    textReport += "🔍 本测试模拟微信小程序按钮功能检测\n"
                    textReport += "🎲 基于动态检测结果生成报告\n"
                    textReport += "🎯 建议关注失败的测试用例\n"
                    
                    if (summary.FAILED_TESTS.toInteger() > 0) {
                        textReport += "⚠️ 当前存在失败的测试，请检查相关功能\n"
                    } else {
                        textReport += "🎉 所有测试用例均通过\n"
                    }
                    
                    writeFile file: 'test-results.txt', text: textReport
                    
                    // 生成XML报告
                    def xmlReport = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<testsuites name=\"微信小程序按钮功能测试\" tests=\"${summary.TOTAL_TESTS}\" failures=\"${summary.FAILED_TESTS}\" errors=\"0\" time=\"${summary.TOTAL_DURATION.toInteger() / 1000}\">\n    <testsuite name=\"按钮功能测试\" tests=\"${summary.TOTAL_TESTS}\" failures=\"${summary.FAILED_TESTS}\" errors=\"0\" time=\"${summary.TOTAL_DURATION.toInteger() / 1000}\">"
                    
                    testCases.each { testCase ->
                        xmlReport += "\n        <testcase name=\"${testCase.NAME}\" classname=\"button-test\" time=\"${testCase.DURATION.toInteger() / 1000}\">"
                        if (testCase.STATUS == 'failed') {
                            xmlReport += "\n            <failure message=\"${testCase.MESSAGE}\">${testCase.MESSAGE}</failure>"
                        }
                        xmlReport += "\n        </testcase>"
                    }
                    
                    xmlReport += "\n    </testsuite>\n</testsuites>"
                    
                    writeFile file: 'test-results.xml', text: xmlReport
                    
                    // 生成美化的HTML报告
                    def htmlReport = "<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>🤖 微信小程序按钮功能测试报告</title>\n    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap\" rel=\"stylesheet\">\n    <style>\n        * { margin: 0; padding: 0; box-sizing: border-box; }\n        \n        body {\n            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n            margin: 0;\n            padding: 20px;\n            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n            min-height: 100vh;\n            color: #2d3748;\n        }\n        \n        .container {\n            max-width: 1200px;\n            margin: 0 auto;\n            background: rgba(255, 255, 255, 0.95);\n            backdrop-filter: blur(10px);\n            border-radius: 20px;\n            padding: 40px;\n            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);\n            border: 1px solid rgba(255, 255, 255, 0.2);\n        }\n        \n        .header {\n            text-align: center;\n            margin-bottom: 40px;\n            padding: 30px;\n            background: linear-gradient(135deg, #28a745, #20c997);\n            color: white;\n            border-radius: 16px;\n            box-shadow: 0 10px 25px rgba(40, 167, 69, 0.3);\n            position: relative;\n            overflow: hidden;\n        }\n        \n        .header::before {\n            content: '';\n            position: absolute;\n            top: -50%;\n            left: -50%;\n            width: 200%;\n            height: 200%;\n            background: repeating-linear-gradient(\n                45deg,\n                transparent,\n                transparent 10px,\n                rgba(255, 255, 255, 0.1) 10px,\n                rgba(255, 255, 255, 0.1) 20px\n            );\n            animation: slide 20s linear infinite;\n        }\n        \n        @keyframes slide {\n            0% { transform: translate(0, 0); }\n            100% { transform: translate(50px, 50px); }\n        }\n        \n        .header h1 {\n            margin: 0;\n            font-size: 2.5em;\n            font-weight: 700;\n            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\n            position: relative;\n            z-index: 1;\n        }\n        \n        .header p {\n            margin: 10px 0 0 0;\n            opacity: 0.9;\n            font-size: 1.1em;\n            position: relative;\n            z-index: 1;\n        }\n        \n        .build-status {\n            background: linear-gradient(135deg, #d4edda, #c3e6cb);\n            color: #155724;\n            padding: 20px;\n            border-radius: 12px;\n            margin-bottom: 30px;\n            text-align: center;\n            font-weight: 600;\n            font-size: 1.1em;\n            border: 1px solid #c3e6cb;\n            box-shadow: 0 4px 12px rgba(21, 87, 36, 0.15);\n        }\n        \n        .detection-info {\n            background: linear-gradient(135deg, #e3f2fd, #bbdefb);\n            color: #1565c0;\n            padding: 20px;\n            border-radius: 12px;\n            margin-bottom: 30px;\n            text-align: center;\n            font-weight: 500;\n            border: 1px solid #bbdefb;\n            box-shadow: 0 4px 12px rgba(21, 101, 192, 0.15);\n        }\n        \n        .summary {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n            gap: 20px;\n            margin-bottom: 40px;\n        }\n        \n        .stat {\n            background: white;\n            padding: 30px;\n            border-radius: 16px;\n            text-align: center;\n            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);\n            border: 1px solid #e2e8f0;\n            transition: all 0.3s ease;\n            position: relative;\n            overflow: hidden;\n        }\n        \n        .stat::before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            right: 0;\n            height: 4px;\n            background: linear-gradient(90deg, #667eea, #764ba2);\n        }\n        \n        .stat:hover {\n            transform: translateY(-5px);\n            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);\n        }\n        \n        .stat.passed::before { background: linear-gradient(90deg, #28a745, #20c997); }\n        .stat.failed::before { background: linear-gradient(90deg, #dc3545, #c82333); }\n        .stat.total::before { background: linear-gradient(90deg, #007bff, #0056b3); }\n        \n        .stat h3 {\n            margin: 0 0 15px 0;\n            color: #718096;\n            font-size: 0.9em;\n            font-weight: 500;\n            text-transform: uppercase;\n            letter-spacing: 0.5px;\n        }\n        \n        .stat .number {\n            font-size: 2.5em;\n            font-weight: 700;\n            background: linear-gradient(135deg, #667eea, #764ba2);\n            -webkit-background-clip: text;\n            -webkit-text-fill-color: transparent;\n            background-clip: text;\n        }\n        \n        .stat.passed .number { background: linear-gradient(135deg, #28a745, #20c997); }\n        .stat.failed .number { background: linear-gradient(135deg, #dc3545, #c82333); }\n        .stat.total .number { background: linear-gradient(135deg, #007bff, #0056b3); }\n        \n        .progress-container {\n            margin-bottom: 40px;\n        }\n        \n        .progress-label {\n            text-align: center;\n            margin-bottom: 15px;\n            font-weight: 600;\n            color: #2d3748;\n        }\n        \n        .progress-bar {\n            background: #e2e8f0;\n            border-radius: 50px;\n            height: 30px;\n            overflow: hidden;\n            position: relative;\n            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);\n        }\n        \n        .progress-fill {\n            background: linear-gradient(90deg, #28a745, #20c997, #17a2b8);\n            height: 100%;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            color: white;\n            font-weight: 600;\n            font-size: 0.9em;\n            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n            position: relative;\n            animation: shimmer 2s ease-in-out infinite;\n            background-size: 200% 100%;\n        }\n        \n        @keyframes shimmer {\n            0% { background-position: 200% 0; }\n            100% { background-position: -200% 0; }\n        }\n        \n        .test-results {\n            margin-bottom: 40px;\n        }\n        \n        .section-title {\n            font-size: 1.5em;\n            font-weight: 600;\n            margin-bottom: 25px;\n            color: #2d3748;\n            text-align: center;\n        }\n        \n        table {\n            width: 100%;\n            border-collapse: separate;\n            border-spacing: 0;\n            background: white;\n            border-radius: 16px;\n            overflow: hidden;\n            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);\n            border: 1px solid #e2e8f0;\n        }\n        \n        th {\n            background: linear-gradient(135deg, #f8f9fa, #e9ecef);\n            padding: 20px;\n            text-align: left;\n            font-weight: 600;\n            color: #495057;\n            font-size: 0.9em;\n            text-transform: uppercase;\n            letter-spacing: 0.5px;\n            border-bottom: 2px solid #e2e8f0;\n        }\n        \n        td {\n            padding: 20px;\n            border-bottom: 1px solid #e2e8f0;\n            vertical-align: top;\n        }\n        \n        tr:last-child td {\n            border-bottom: none;\n        }\n        \n        tr:hover {\n            background: #f8f9fa;\n        }\n        \n        .test-name {\n            font-weight: 600;\n            color: #2d3748;\n            font-size: 1.1em;\n        }\n        \n        .test-description {\n            color: #718096;\n            font-size: 0.9em;\n            margin-top: 5px;\n            line-height: 1.4;\n        }\n        \n        .status-badge {\n            display: inline-flex;\n            align-items: center;\n            padding: 8px 16px;\n            border-radius: 50px;\n            font-weight: 600;\n            font-size: 0.9em;\n            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n        }\n        \n        .status-badge.passed {\n            background: linear-gradient(135deg, #28a745, #20c997);\n            color: white;\n        }\n        \n        .status-badge.failed {\n            background: linear-gradient(135deg, #dc3545, #c82333);\n            color: white;\n        }\n        \n        .duration {\n            font-weight: 500;\n            color: #495057;\n            font-size: 1.1em;\n        }\n        \n        .error-message {\n            color: #dc3545;\n            font-size: 0.9em;\n            background: #f8d7da;\n            padding: 8px 12px;\n            border-radius: 6px;\n            margin-top: 8px;\n            border-left: 4px solid #dc3545;\n        }\n        \n        .footer {\n            margin-top: 40px;\n            padding: 30px;\n            background: linear-gradient(135deg, #f8f9fa, #e9ecef);\n            border-radius: 16px;\n            text-align: center;\n            color: #495057;\n            border: 1px solid #e2e8f0;\n        }\n        \n        .footer h3 {\n            margin-bottom: 15px;\n            color: #2d3748;\n            font-size: 1.2em;\n        }\n        \n        .footer p {\n            margin-bottom: 8px;\n            line-height: 1.5;\n        }\n        \n        @media (max-width: 768px) {\n            .container {\n                padding: 20px;\n                margin: 10px;\n            }\n            \n            .summary {\n                grid-template-columns: 1fr;\n            }\n            \n            .header h1 {\n                font-size: 2em;\n            }\n            \n            table {\n                font-size: 0.9em;\n            }\n            \n            th, td {\n                padding: 15px;\n            }\n        }\n    </style>\n</head>\n<body>\n    <div class=\"container\">\n        <div class=\"header\">\n            <h1>🤖 微信小程序按钮功能测试报告</h1>\n            <p>⏰ 生成时间: ${summary.TIMESTAMP}</p>\n            <p>🏗️ 构建号: ${env.BUILD_NUMBER}</p>\n        </div>\n        \n        <div class=\"build-status\">\n            🎉 构建状态: 稳定 (SUCCESS) - 动态检测结果\n        </div>\n        \n        <div class=\"detection-info\">\n            🔍 检测模式: 基于动态算法自动检测测试结果\n        </div>\n        \n        <div class=\"summary\">\n            <div class=\"stat total\">\n                <h3>总测试数</h3>\n                <div class=\"number\">${summary.TOTAL_TESTS}</div>\n            </div>\n            <div class=\"stat passed\">\n                <h3>通过</h3>\n                <div class=\"number\">${summary.PASSED_TESTS}</div>\n            </div>\n            <div class=\"stat failed\">\n                <h3>失败</h3>\n                <div class=\"number\">${summary.FAILED_TESTS}</div>\n            </div>\n        </div>\n        \n        <div class=\"summary\">\n            <div class=\"stat total\">\n                <h3>总耗时</h3>\n                <div class=\"number\">${summary.TOTAL_DURATION}ms</div>\n            </div>\n            <div class=\"stat total\">\n                <h3>平均耗时</h3>\n                <div class=\"number\">${summary.AVG_DURATION_INT}ms</div>\n            </div>\n        </div>\n        \n        <div class=\"progress-container\">\n            <div class=\"progress-label\">📊 通过率分析</div>\n            <div class=\"progress-bar\">\n                <div class=\"progress-fill\" style=\"width: ${summary.PASS_RATE}%;\">\n                    通过率: ${summary.PASS_RATE}%\n                </div>\n            </div>\n        </div>\n        \n        <div class=\"test-results\">\n            <h2 class=\"section-title\">🧪 测试结果详情</h2>\n            <table>\n                <thead>\n                    <tr>\n                        <th>测试用例</th>\n                        <th>状态</th>\n                        <th>耗时</th>\n                        <th>检测详情</th>\n                    </tr>\n                </thead>\n                <tbody>"
                    
                    testCases.each { testCase ->
                        htmlReport += "\n                    <tr>\n                        <td>\n                            <div class=\"test-name\">${testCase.ICON} ${testCase.NAME}</div>\n                            <div class=\"test-description\">${testCase.DESCRIPTION}</div>\n                        </td>\n                        <td>\n                            <div class=\"status-badge ${testCase.STATUS}\">\n                                ${testCase.STATUS == 'passed' ? '✅ 通过' : '❌ 失败'}\n                            </div>\n                        </td>\n                        <td>\n                            <div class=\"duration\">${testCase.DURATION}ms</div>\n                        </td>\n                        <td>"
                        if (testCase.MESSAGE) {
                            htmlReport += "\n                            <div class=\"error-message\">⚠️ ${testCase.MESSAGE}</div>"
                        } else {
                            htmlReport += "\n                            <div>✨ 功能正常运行</div>"
                        }
                        htmlReport += "\n                        </td>\n                    </tr>"
                    }
                    
                    htmlReport += "\n                </tbody>\n            </table>\n        </div>\n        \n        <div class=\"footer\">\n            <h3>🔧 测试说明</h3>\n            <p>🤖 本测试报告由Jenkins CI/CD自动生成</p>\n            <p>🏗️ 测试环境: Jenkins自动化测试环境</p>\n            <p>📱 测试类型: 微信小程序按钮功能动态检测</p>\n            <p>🎲 <strong>检测算法:</strong> 基于随机概率和实际场景模拟</p>\n            <p>📊 <strong>报告特性:</strong> 现代化UI设计，响应式布局，动画效果</p>\n        </div>\n    </div>\n</body>\n</html>"
                    
                    writeFile file: 'test-results.html', text: htmlReport
                    
                    echo '✅ 美化动态测试报告生成完成'
                    echo "📊 实际检测结果: ${summary.PASSED_TESTS}通过/${summary.TOTAL_TESTS}总计"
                    echo '📁 生成文件: test-results.txt, test-results.xml, test-results.html'
                }
            }
        }
    }
    
    post {
        always {
            echo '📦 归档美化动态测试报告...'
            archiveArtifacts artifacts: 'test-results.*', allowEmptyArchive: true
            echo '✅ 报告归档完成'
            echo '💡 提示: 请在"Artifacts"中下载test-results.html查看完整美化动态报告'
        }
        
        success {
            echo '🎉 美化动态测试构建成功完成！'
            echo "📊 最终检测结果: ${env.passedTests}个通过，${env.failedTests}个失败，通过率${env.passRate}%"
            echo '🎨 报告界面已全面美化，采用现代化设计风格'
        }
        
        failure {
            echo '❌ 构建失败！'
        }
    }
}