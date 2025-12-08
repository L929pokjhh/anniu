pipeline {
    agent any
    
    environment {
        TEST_REPORT_DIR = "${WORKSPACE}/test-results"
    }
    
    stages {
        stage('检查文件') {
            steps {
                echo '🔍 检查工作空间文件...'
                
                // 列出工作空间中的所有文件
                sh 'ls -la || dir'
                
                // 检查关键文件是否存在
                script {
                    def filesToCheck = ['jenkins-test.js', 'jenkins-tutorial.md', 'BUTTON_TEST_README.md']
                    
                    filesToCheck.each { fileName ->
                        def fileExists = fileExists(fileName)
                        if (fileExists) {
                            echo "✅ ${fileName} - 文件存在"
                        } else {
                            echo "❌ ${fileName} - 文件不存在"
                        }
                    }
                }
                
                // 创建测试报告目录
                sh 'mkdir -p test-results'
            }
        }
        
        stage('检查Node.js环境') {
            steps {
                script {
                    try {
                        def nodeVersion = sh(script: 'node --version', returnStdout: true).trim()
                        echo "✅ Node.js版本: ${nodeVersion}"
                        env.NODE_AVAILABLE = 'true'
                        
                        // 测试能否读取测试脚本
                        def scriptContent = readFile 'jenkins-test.js'
                        echo "✅ jenkins-test.js 文件可读取，大小: ${scriptContent.length()} 字节"
                        
                    } catch (Exception e) {
                        echo "❌ Node.js检查失败: ${e.getMessage()}"
                        env.NODE_AVAILABLE = 'false'
                        
                        // 尝试创建简单的错误报告
                        sh '''
                            echo '<?xml version="1.0" encoding="UTF-8"?><testsuites name="微信小程序按钮功能测试" tests="1" failures="1" errors="0"><testsuite name="环境检查" tests="1" failures="1"><testcase name="Node.js环境检查" classname="environment"><failure message="Node.js未安装">Node.js环境未配置，需要在Jenkins中安装Node.js</failure></testcase></testsuite></testsuites>' > test-results/junit.xml
                            echo '<html><head><title>按钮功能测试报告</title></head><body><h1>❌ Node.js环境未配置</h1><p>请在Jenkins中安装Node.js</p></body></html>' > test-results/report.html
                            echo '{"summary":{"total":1,"passed":0,"failed":1,"errors":0},"testCases":[],"errors":[{"error":"Node.js环境未配置","timestamp":"'$(date -Iseconds)'"}]}' > test-results/results.json
                        '''
                    }
                }
            }
        }
        
        stage('执行测试') {
            when {
                expression { env.NODE_AVAILABLE == 'true' }
            }
            steps {
                echo '🧪 开始执行按钮功能测试...'
                
                script {
                    try {
                        // 使用绝对路径执行脚本
                        def testResult = sh(
                            script: '''
                                echo "执行测试脚本: jenkins-test.js"
                                if [ -f "jenkins-test.js" ]; then
                                    echo "测试脚本文件存在，开始执行..."
                                    node jenkins-test.js --verbose
                                    echo "测试脚本执行完成，退出码: $?"
                                else
                                    echo "测试脚本文件不存在！"
                                    echo "当前目录内容:"
                                    ls -la
                                    exit 1
                                fi
                            ''',
                            returnStatus: true
                        )
                        
                        if (testResult != 0) {
                            echo '⚠️ 测试执行完成，但存在失败的测试用例'
                            currentBuild.result = 'UNSTABLE'
                        } else {
                            echo '✅ 所有测试通过'
                        }
                        
                    } catch (Exception e) {
                        echo "❌ 测试执行异常: ${e.getMessage()}"
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                try {
                    echo '📊 发布测试报告...'
                    
                    // 检查报告文件
                    sh '''
                        echo "检查报告文件:"
                        ls -la test-results/ || echo "test-results目录不存在"
                        
                        if [ -f test-results/junit.xml ]; then
                            echo "✅ JUnit报告存在"
                            wc -l test-results/junit.xml
                        else
                            echo "❌ JUnit报告不存在"
                        fi
                        
                        if [ -f test-results/report.html ]; then
                            echo "✅ HTML报告存在"
                            wc -l test-results/report.html
                        else
                            echo "❌ HTML报告不存在"
                        fi
                        
                        if [ -f test-results/results.json ]; then
                            echo "✅ JSON报告存在"
                            wc -l test-results/results.json
                        else
                            echo "❌ JSON报告不存在"
                        fi
                    '''
                    
                    // 归档和发布报告
                    archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true, allowEmptyArchive: true
                    junit 'test-results/junit.xml'
                    publishHTML target: [
                        allowMissing: true,
                        reportDir: 'test-results',
                        reportFiles: 'report.html',
                        reportName: '按钮功能测试报告'
                    ]
                    
                } catch (Exception e) {
                    echo "⚠️ 报告发布失败: ${e.getMessage()}"
                }
            }
        }
        
        success {
            echo '🎉 构建成功完成！'
        }
        
        unstable {
            echo '⚠️ 构建完成，但存在配置问题'
        }
        
        failure {
            echo '❌ 构建失败！'
        }
    }
}