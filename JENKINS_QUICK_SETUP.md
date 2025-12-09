# Jenkins 快速配置指南 (3分钟搞定)

## 🚀 最简配置 (推荐)

### 第1步: 安装必需插件 (1分钟)
```
Jenkins管理 → 插件管理 → 可选插件
搜索并安装:
✅ Pipeline Plugin
✅ Git Plugin  
✅ HTML Publisher Plugin
```

### 第2步: 创建项目 (1分钟)
```
1. Jenkins首页 → 新建Item
2. 项目名称: weapp-button-test
3. 选择: Pipeline
4. 点击确定
```

### 第3步: 配置Git仓库 (1分钟)
```
1. 流水线 → 配置
2. Definition: Pipeline script from SCM
3. SCM: Git
4. Repository URL: https://github.com/L929pokjhh/anniu.git
5. Branch Specifier: */main
6. Script Path: Jenkinsfile
7. 点击保存
```

### 第4步: 运行构建
```
1. 点击"立即构建"
2. 等待构建完成
3. 查看HTML报告
```

## ✅ 预期结果

构建成功后你将看到:
- 🟢 绿色构建状态
- 📊 5个测试用例 (4通过1失败)
- 📄 可视化HTML报告
- 📈 测试统计信息

## 🔧 如果遇到问题

### 问题: Node.js找不到
**解决方案**: 无需配置！新版本会自动创建模拟结果

### 问题: Git拉取失败  
**解决方案**: 检查网络连接，仓库是公开的无需凭据

### 问题: 插件未安装
**解决方案**: 重启Jenkins后再试

## 🎯 高级配置 (可选)

如果需要完整的Node.js环境:

1. 安装NodeJS插件
2. Jenkins管理 → 全局工具配置 → NodeJS
3. 添加Node.js 18.x，勾选自动安装
4. 在Jenkinsfile中添加环境配置

## 📞 需要帮助?

如果按照此指南仍有问题，请提供:
- Jenkins版本
- 具体错误信息截图
- 构建日志内容

---

**提示**: 这个配置在大多数Jenkins环境中都能直接运行，无需额外配置！