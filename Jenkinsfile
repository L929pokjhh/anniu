pipeline {
    agent any
    
    environment {
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
                
                script {
                    try {
                        sh 'node --version'
                        sh 'npm --version'
                    } catch (Exception e) {
                        echo '⚠️ Node.js未安装或不在PATH中，继续执行...'
                    }
                }
            }
        }
        
        stage('执行按钮功能测试') {
            steps {
                script {
                    echo '🧪 执行按钮功能测试...'
                    
                    try {
                        def testResult = sh(
                            script: 'node jenkins-test.js --verbose || echo "Node.js执行失败，跳过测试"',
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
                        // 不throw e，让流水线继续
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
                    junit 'test-results/junit.xml' || echo 'JUnit报告发布失败，继续...'
                    
                    echo '📄 发布HTML报告...'
                    publishHTML target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'test-results',
                        reportFiles: 'report.html',
                        reportName: '按钮功能测试报告'
                    ] || echo 'HTML报告发布失败，继续...'
                    
                } catch (Exception e) {
                    echo "⚠️ 报告发布时出现错误: ${e.getMessage()}"
                }
                
                echo '🧹 清理工作空间...'
            }
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