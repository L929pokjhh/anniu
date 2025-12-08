@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    微信小程序按钮功能测试工具
echo ========================================
echo.

echo 📋 使用说明：
echo 1. 请确保微信开发者工具已打开项目
echo 2. 在调试器Console中运行测试脚本
echo 3. 选择测试方式：
echo    - 完整测试：WeChatButtonTest.runAllTests()
echo    - 快速测试：WeChatButtonTest.quickTestCurrentPage()
echo.

echo 📄 可用的测试脚本：
echo 1. button-test.js - 通用浏览器测试脚本
echo 2. wechat-button-test.js - 微信小程序专用测试脚本
echo.

echo 🚀 正在打开测试脚本文件...
echo.

:: 打开微信小程序专用的测试脚本
start notepad "wechat-button-test.js"

:: 尝试打开项目目录
echo 📂 项目目录: %CD%
explorer "%CD%"

echo.
echo ✅ 测试工具已准备就绪！
echo.
echo 🔧 下一步操作：
echo 1. 在微信开发者工具中打开项目
echo 2. 打开调试器（Ctrl+Shift+I）
echo 3. 切换到Console标签
echo 4. 复制粘贴 wechat-button-test.js 的内容
echo 5. 运行 WeChatButtonTest.runAllTests() 开始测试
echo.

pause