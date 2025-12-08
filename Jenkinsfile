pipeline {
    agent any
    
    environment {
        NODE_HOME = tool 'Node.js 16.x'
        PATH = "${NODE_HOME}/bin:${PATH}"
        TEST_REPORT_DIR = "${WORKSPACE}/test-results"
        JUNIT_REPORT_PATH = "${WORKSPACE}/test-results/junit.xml"
        HTML_REPORT_PATH = "${WORKSPACE}/test-results/report.html"
        JSON_REPORT_PATH = "${WORKSPACE}/test-results/results.json"
    }
    
    stages {
        stage('准备环境') {
            steps {
                echo '🚀 开始微信小程序按钮功能测试'
                echo "📁 工作空间: ${WORKSPACE}"
                echo "🔢 构建号: ${BUILD_NUMBER}"
                echo "🔗 构建URL: ${BUILD_URL}"
                
                sh 'mkdir -p test-results'
                sh 'node --version'
                sh 'npm --version'
            }
        }
        
        stage('执行按钮功能测试') {
            steps {
                script {
                    echo '🧪 执行按钮功能测试...'
                    
                    try {
                        def testResult = sh(
                            script: 'node jenkins-test.js --verbose',
                            returnStatus: true
                        )
                        
                        if (testResult != 0) {
                            currentBuild.result = 'UNSTABLE'
                            echo '⚠️ 测试执行完成，但存在失败的测试用例'
                        } else {
                            echo '✅ 所有测试通过'
                        }
                        
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        echo "❌ 测试执行失败: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }
        
        stage('分析测试结果') {
            steps {
                script {
                    echo '📈 分析测试结果...'
                    
                    try {
                        def testResults = readJSON file: 'test-results/results.json'
                        
                        def totalTests = testResults.summary.total
                        def passedTests = testResults.summary.passed
                        def failedTests = testResults.summary.failed
                        def errorTests = testResults.summary.errors
                        
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
                    }
                }
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true
            junit 'test-results/junit.xml'
            
            publishHTML target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'test-results',
                reportFiles: 'report.html',
                reportName: '按钮功能测试报告'
            ]
            
            echo '🧹 清理工作空间...'
        }
        
        success {
            echo '🎉 测试成功完成！'
        }
        
        unstable {
            echo '⚠️ 测试完成，但存在失败的测试用例'
        }
        
        failure {
            echo '❌ 测试执行失败！'
        }
    }
}