pipeline {
    agent any
    
    environment {
        TEST_REPORT_DIR = "${WORKSPACE}/test-results"
        JUNIT_REPORT_PATH = "${WORKSPACE}/test-results/junit.xml"
        HTML_REPORT_PATH = "${WORKSPACE}/test-results/report.html"
        JSON_REPORT_PATH = "${WORKSPACE}/test-results/results.json"
    }
    
    stages {
        stage('检查环境') {
            steps {
                echo '🔍 检查构建环境...'
                
                script {
                    // 检查Node.js是否安装
                    try {
                        def nodeVersion = sh(script: 'node --version', returnStdout: true).trim()
                        echo "✅ Node.js已安装: ${nodeVersion}"
                        
                        def npmVersion = sh(script: 'npm --version', returnStdout: true).trim()
                        echo "✅ npm已安装: ${npmVersion}"
                        
                        // 设置环境变量标记Node.js可用
                        env.NODE_AVAILABLE = 'true'
                        
                    } catch (Exception e) {
                        echo '❌ Node.js未安装或不在PATH中'
                        echo '📝 请在Jenkins中安装Node.js插件并配置全局工具'
                        echo '🔧 Jenkins管理 > 全局工具配置 > Node.js > 安装Node.js'
                        
                        // 设置环境变量标记Node.js不可用
                        env.NODE_AVAILABLE = 'false'
                        currentBuild.result = 'UNSTABLE'
                    }
                }
                
                sh 'mkdir -p test-results'
            }
        }
        
        stage('执行按钮功能测试') {
            when {
                expression { env.NODE_AVAILABLE == 'true' }
            }
            steps {
                script {
                    echo '🧪 执行按钮功能测试...'
                    
                    try {
                        def testResult = sh(
                            script: 'node jenkins-test.js --verbose',
                            returnStatus: true
                        )
                        
                        if (testResult != 0) {
                            echo '⚠️ 测试执行完成，但存在失败的测试用例'
                            currentBuild.result = 'UNSTABLE'
                        } else {
                            echo '✅ 所有测试通过'
                        }
                        
                    } catch (Exception e) {
                        echo "❌ 测试执行失败: ${e.getMessage()}"
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }
        
        stage('跳过测试说明') {
            when {
                expression { env.NODE_AVAILABLE == 'false' }
            }
            steps {
                echo '⏭️ 跳过按钮功能测试'
                echo '📋 跳过原因: Node.js环境未配置'
                echo ''
                echo '🔧 解决方案:'
                echo '1. 进入Jenkins管理界面'
                echo '2. 选择"全局工具配置"'
                echo '3. 找到Node.js部分'
                echo '4. 点击"新增Node.js"'
                echo '5. 选择版本并勾选"自动安装"'
                echo '6. 保存配置后重新构建'
                echo ''
                echo '📚 详细配置教程请参考: jenkins-tutorial.md'
                
                // 创建一个占位符报告
                sh '''
                    echo '{"summary":{"total":0,"passed":0,"failed":0,"errors":1},"testCases":[],"errors":[{"error":"Node.js环境未配置","timestamp":"'$(date -Iseconds)'"}]}' > test-results/results.json
                    echo '<?xml version="1.0" encoding="UTF-8"?><testsuites name="微信小程序按钮功能测试" tests="0" failures="0" errors="1"><testsuite name="环境检查" tests="1" failures="0" errors="1"><testcase name="Node.js环境检查" classname="environment"><error message="Node.js未安装">Node.js环境未配置，请参考jenkins-tutorial.md进行配置</error></testcase></testsuite></testsuites>' > test-results/junit.xml
                    echo '<html><head><title>按钮功能测试报告</title></head><body><h1>❌ 测试跳过</h1><p>Node.js环境未配置，请参考 <a href="jenkins-tutorial.md">配置教程</a> 进行设置</p></body></html>' > test-results/report.html
                '''
            }
        }
        
        stage('分析测试结果') {
            steps {
                script {
                    echo '📈 分析测试结果...'
                    
                    try {
                        def testResults = readJSON file: 'test-results/results.json'
                        
                        def totalTests = testResults.summary.total ?: 0
                        def passedTests = testResults.summary.passed ?: 0
                        def failedTests = testResults.summary.failed ?: 0
                        def errorTests = testResults.summary.errors ?: 0
                        
                        echo "📋 测试摘要:"
                        echo "   总测试数: ${totalTests}"
                        echo "   通过数: ${passedTests}"
                        echo "   失败数: ${failedTests}"
                        echo "   错误数: ${errorTests}"
                        
                        def passRate = 0
                        if (totalTests > 0) {
                            passRate = (passedTests / totalTests) * 100
                        }
                        
                        echo "   通过率: ${passRate.round(2)}%"
                        
                        if (failedTests > 0 || errorTests > 0) {
                            currentBuild.result = 'UNSTABLE'
                            echo '⚠️ 存在失败的测试用例'
                        }
                        
                        currentBuild.description = "测试: ${passedTests}/${totalTests} (${passRate.round(2)}%)"
                        
                    } catch (Exception e) {
                        echo "⚠️ 无法解析测试结果JSON文件: ${e.getMessage()}"
                        echo "继续执行后续步骤..."
                        currentBuild.description = "测试结果分析失败"
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                try {
                    echo '🗂️ 归档测试报告...'
                    archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true, allowEmptyArchive: true
                    
                    echo '📋 发布JUnit报告...'
                    junit 'test-results/junit.xml'
                    
                    echo '📄 发布HTML报告...'
                    publishHTML target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'test-results',
                        reportFiles: 'report.html',
                        reportName: '按钮功能测试报告'
                    ]
                    
                } catch (Exception e) {
                    echo "⚠️ 报告发布时出现错误: ${e.getMessage()}"
                }
                
                echo '🧹 清理工作空间...'
            }
        }
        
        success {
            echo '🎉 构建成功完成！'
        }
        
        unstable {
            echo '⚠️ 构建完成，但需要注意配置问题'
        }
        
        failure {
            echo '❌ 构建失败！'
        }
    }
}