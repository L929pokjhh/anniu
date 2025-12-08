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
                script {
                    echo "🚀 开始微信小程序按钮功能测试"
                    echo "📁 工作空间: ${WORKSPACE}"
                    echo "🔢 构建号: ${BUILD_NUMBER}"
                    echo "🔗 构建URL: ${BUILD_URL}"
                }
                
                // 创建测试报告目录
                sh 'mkdir -p test-results'
                
                // 显示Node.js版本
                sh 'node --version'
                sh 'npm --version'
            }
        }
        
        stage('安装依赖') {
            steps {
                script {
                    echo "📦 安装测试依赖..."
                }
                
                // 如果有package.json，安装依赖
                sh '''
                if [ -f package.json ]; then
                    npm install
                else
                    echo "未找到package.json，跳过依赖安装"
                fi
                '''
            }
        }
        
        stage('代码检查') {
            steps {
                script {
                    echo "🔍 执行代码检查..."
                }
                
                // 可以添加ESLint等代码检查工具
                sh '''
                if command -v eslint &> /dev/null && [ -f .eslintrc.js ]; then
                    echo "执行ESLint检查..."
                    eslint . --ext .js --format junit --output-file test-results/eslint.xml || true
                else
                    echo "跳过ESLint检查"
                fi
                '''
            }
        }
        
        stage('执行按钮功能测试') {
            steps {
                script {
                    echo "🧪 执行按钮功能测试..."
                    
                    try {
                        // 运行测试脚本
                        def testResult = sh(
                            script: 'node jenkins-test.js --verbose',
                            returnStatus: true
                        )
                        
                        if (testResult != 0) {
                            currentBuild.result = 'UNSTABLE'
                            echo "⚠️ 测试执行完成，但存在失败的测试用例"
                        } else {
                            echo "✅ 所有测试通过"
                        }
                        
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        echo "❌ 测试执行失败: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }
        
        stage('生成测试报告') {
            steps {
                script {
                    echo "📊 生成测试报告..."
                    
                    // 检查测试结果文件是否存在
                    sh '''
                    echo "检查测试报告文件..."
                    ls -la test-results/
                    if [ -f test-results/junit.xml ]; then
                        echo "✅ JUnit报告已生成"
                    else
                        echo "❌ JUnit报告未找到"
                    fi
                    
                    if [ -f test-results/report.html ]; then
                        echo "✅ HTML报告已生成"
                    else
                        echo "❌ HTML报告未找到"
                    fi
                    
                    if [ -f test-results/results.json ]; then
                        echo "✅ JSON报告已生成"
                    else
                        echo "❌ JSON报告未找到"
                    fi
                    '''
                }
            }
        }
        
        stage('分析测试结果') {
            steps {
                script {
                    echo "📈 分析测试结果..."
                    
                    // 解析JSON测试结果
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
                    echo "   通过率: ${totalTests > 0 ? (passedTests / totalTests * 100).round(2) : 0}%"
                    
                    // 如果测试失败，设置构建状态
                    if (failedTests > 0 || errorTests > 0) {
                        currentBuild.result = 'UNSTABLE'
                        echo "⚠️ 存在失败的测试用例"
                        
                        // 显示失败的测试用例
                        echo "失败的测试用例:"
                        testResults.testCases.each { testCase ->
                            if (testCase.status != 'passed') {
                                echo "   ❌ ${testCase.name}: ${testCase.message}"
                            }
                        }
                    }
                    
                    // 将测试结果写入构建描述
                    def passRate = totalTests > 0 ? (passedTests / totalTests * 100).round(2) : 0
                    currentBuild.description = "测试: ${passedTests}/${totalTests} (${passRate}%)"
                }
            }
        }
    }
    
    post {
        always {
            // 归档测试报告
            archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true
            
            // 发布JUnit报告
            junit 'test-results/junit.xml' || true
            
            // 发布HTML报告
            publishHTML (
                target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'test-results',
                    reportFiles: 'report.html',
                    reportName: '按钮功能测试报告'
                ]
            ) || true
            
            // 清理工作空间
            echo "🧹 清理工作空间..."
        }
        
        success {
            script {
                echo "🎉 测试成功完成！"
                
                // 可以添加通知逻辑，如发送邮件、钉钉消息等
                echo "📧 构建成功通知可以在这里配置"
            }
        }
        
        unstable {
            script {
                echo "⚠️ 测试完成，但存在失败的测试用例"
                
                // 发送警告通知
                echo "📧 构建不稳定通知可以在这里配置"
            }
        }
        
        failure {
            script {
                echo "❌ 测试执行失败！"
                
                // 发送失败通知
                echo "📧 构建失败通知可以在这里配置"
            }
        }
    }
}