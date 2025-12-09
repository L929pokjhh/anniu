pipeline {
    agent any
    
    stages {
        stage('简单测试') {
            steps {
                echo '🚀 Jenkins配置测试'
                echo "📁 工作空间: ${env.WORKSPACE}"
                echo "🔢 构建号: ${env.BUILD_NUMBER}"
                
                // 测试目录创建
                sh '''
                    echo "当前目录内容:"
                    ls -la
                    echo "创建测试目录..."
                    mkdir -p test-results
                    echo "测试目录创建完成"
                '''
            }
        }
        
        stage('生成报告') {
            steps {
                echo '📊 生成简单报告...'
                
                // 使用最简单的方式生成文件
                sh '''
                    echo '<?xml version="1.0" encoding="UTF-8"?><testsuites><testsuite name="test" tests="1"><testcase name="配置测试" classname="config"></testcase></testsuite></testsuites>' > test-results/junit.xml
                    
                    echo '{"summary":{"total":1,"passed":1,"failed":0}}' > test-results/results.json
                    
                    echo '<html><body><h1>测试报告</h1><p>Jenkins配置成功！</p></body></html>' > test-results/report.html
                    
                    echo "✅ 报告生成完成"
                    ls -la test-results/
                '''
            }
        }
    }
    
    post {
        always {
            echo '📦 发布报告...'
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
            junit 'test-results/junit.xml'
            publishHTML target: [
                allowMissing: true,
                reportDir: 'test-results',
                reportFiles: 'report.html',
                reportName: '配置测试报告'
            ]
        }
        
        success {
            echo '🎉 Jenkins配置测试成功！'
        }
    }
}