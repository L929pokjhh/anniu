@echo off
chcp 65001 >nul
cls

echo.
echo ========================================
echo    Jenkins 微信小程序按钮测试工具
echo ========================================
echo.

echo 📋 本地测试模式 - 模拟Jenkins环境运行
echo.

:: 检查Node.js是否安装
echo 🔍 检查环境...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ 未找到npm，请检查Node.js安装
    pause
    exit /b 1
)

echo ✅ Node.js环境检查通过
node --version
npm --version
echo.

:: 设置环境变量（模拟Jenkins环境）
set WORKSPACE=%CD%
set BUILD_NUMBER=LOCAL-001
set JOB_NAME=weapp-button-test-local
set BUILD_URL=local
set JENKINS_URL=local
set TEST_REPORT_DIR=%CD%\test-results
set JUNIT_REPORT_PATH=%CD%\test-results\junit.xml
set HTML_REPORT_PATH=%CD%\test-results\report.html
set JSON_REPORT_PATH=%CD%\test-results\results.json

echo 📁 工作空间: %WORKSPACE%
echo 🔢 构建号: %BUILD_NUMBER%
echo 📂 报告目录: %TEST_REPORT_DIR%
echo.

:: 创建报告目录
if not exist "test-results" mkdir test-results
echo ✅ 报告目录已创建

:: 检查测试脚本文件
if not exist "jenkins-test.js" (
    echo ❌ 未找到测试脚本 jenkins-test.js
    echo 请确保测试脚本在当前目录中
    pause
    exit /b 1
)

echo ✅ 测试脚本检查通过
echo.

:: 运行测试
echo 🚀 开始执行按钮功能测试...
echo ========================================
echo.

:: 执行测试脚本
node jenkins-test.js --verbose

set TEST_RESULT=%ERRORLEVEL%
echo.

:: 检查结果
if %TEST_RESULT% equ 0 (
    echo ✅ 测试执行成功！
) else (
    echo ❌ 测试执行失败，错误代码: %TEST_RESULT%
)

echo.
echo 📊 测试报告位置:
echo   JUnit报告: %JUNIT_REPORT_PATH%
echo   HTML报告: %HTML_REPORT_PATH%
echo   JSON报告: %JSON_REPORT_PATH%
echo.

:: 检查报告文件是否生成
if exist "%HTML_REPORT_PATH%" (
    echo 📄 HTML报告已生成，是否打开查看？(Y/N)
    set /p OPEN_REPORT=
    if /i "%OPEN_REPORT%"=="Y" (
        echo 正在打开HTML报告...
        start "" "%HTML_REPORT_PATH%"
    )
)

if exist "%JUNIT_REPORT_PATH%" (
    echo ✅ JUnit报告已生成
)

if exist "%JSON_REPORT_PATH%" (
    echo ✅ JSON报告已生成
)

echo.
echo 📋 下一步操作建议:
echo 1. 检查生成的测试报告
echo 2. 如果有失败的测试，查看详细错误信息
echo 3. 在Jenkins中配置CI/CD流水线
echo 4. 参考 jenkins-tutorial.md 配置Jenkins环境
echo.

:: 询问是否打开配置目录
echo 📂 是否打开Jenkins配置教程目录？(Y/N)
set /p OPEN_TUTORIAL=
if /i "%OPEN_TUTORIAL%"=="Y" (
    echo 正在打开配置教程...
    start notepad "jenkins-tutorial.md"
)

echo.
echo 🎉 本地测试完成！
pause