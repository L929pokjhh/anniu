# Jenkins + Git 完整配置指南

## 🔧 一、Jenkins 基础配置

### 1. 安装必要插件
```
1. Jenkins管理 → 插件管理
2. 搜索并安装以下插件：
   ✅ Git Plugin (必需)
   ✅ Pipeline Plugin (必需)
   ✅ HTML Publisher Plugin (必需)
   ✅ NodeJS Plugin (推荐)
   ✅ Credentials Binding Plugin (推荐)
```

### 2. 配置全局工具

#### Node.js 配置 (如果需要)
```
1. Jenkins管理 → 全局工具配置
2. 找到 Node.js 部分
3. 点击"新增 Node.js"
4. 配置如下：
   - 名称: Node.js 18.x
   - 版本: 选择 18.17.0 或更高
   - ☑️ 勾选"自动安装"
   - 点击保存
```

#### Git 配置
```
1. Jenkins管理 → 全局工具配置
2. 找到 Git 部分
3. Git 可执行文件路径:
   - Linux/Mac: /usr/bin/git
   - Windows: C:\\Program Files\\Git\\bin\\git.exe
4. 点击保存
```

## 🔑 二、凭据配置

### 1. 访问 GitHub 仓库
由于你的仓库是公开的，可以无需凭据。但如果需要：

#### 方案A: 无凭据 (推荐，公开仓库)
```
1. Jenkins项目配置 → 源码管理
2. 选择 Git
3. Repository URL: https://github.com/L929pokjhh/anniu.git
4. 凭据: (无)
5. 分支: */main
```

#### 方案B: 使用 Personal Access Token
```
1. 登录 GitHub → Settings → Developer settings → Personal access tokens
2. 生成新的 Token (权限选择 repo)
3. Jenkins → 凭据 → 系统全局 → 全局凭据
4. 添加凭据:
   - 类型: Username with password
   - 用户名: 你的GitHub用户名
   - 密码: 生成的Token
   - ID: github-token
```

## 🏗️ 三、Jenkins项目配置

### 1. 创建Pipeline项目
```
1. Jenkins首页 → 新建Item
2. 输入项目名称: weapp-button-test
3. 选择: Pipeline
4. 点击确定
```

### 2. 配置Pipeline
```
1. 流水线 → 配置
2. Definition: Pipeline script from SCM
3. SCM: Git
4. Repository URL: https://github.com/L929pokjhh/anniu.git
5. Credentials: (选择你的凭据或留空)
6. Branch Specifier: */main
7. Script Path: Jenkinsfile
8. 点击保存
```

## 🚀 四、网络和权限问题排查

### 1. 检查网络连接
```bash
# 在Jenkins服务器上执行
ping github.com
curl -I https://github.com/L929pokjhh/anniu.git
```

### 2. 检查Git配置
```bash
# 检查Git版本
git --version

# 测试仓库访问
git ls-remote https://github.com/L929pokjhh/anniu.git
```

### 3. 代理设置 (如果需要)
```
如果Jenkins在代理环境：
1. Jenkins管理 → 系统配置
2. 找到代理服务器设置
3. 配置代理地址和端口
4. 排除域名: github.com
```

## 🔍 五、常见问题解决

### 问题1: Git命令找不到
```
解决方法:
1. 确认Git已安装在Jenkins服务器上
2. 在全局工具配置中设置正确的Git路径
3. 重启Jenkins服务
```

### 问题2: 权限被拒绝
```
解决方法:
1. 检查仓库是否为公开仓库
2. 配置正确的GitHub访问令牌
3. 检查凭据配置
```

### 问题3: 超时问题
```
解决方法:
1. 增加Git操作超时时间
2. 检查网络连接稳定性
3. 考虑使用Git镜像或代理
```

### 问题4: SSL证书问题
```
解决方法:
1. Jenkins管理 → 系统配置 → Git插件
2. 取消勾选"验证 SSL 证书"
3. 或安装正确的CA证书
```

## 🎯 六、推荐配置方案

### 方案A: 最简配置 (推荐)
```
- 不使用凭据 (公开仓库)
- 不配置Node.js (使用系统Node.js或跳过)
- 使用内联测试脚本
- 适用于快速测试和演示
```

### 方案B: 完整配置
```
- 配置GitHub Token
- 安装NodeJS插件
- 完整的工具链
- 适用于生产环境
```

## ✅ 七、验证配置

### 1. 验证Git连接
```bash
# 在Jenkins脚本控制台中执行
git ls-remote https://github.com/L929pokjhh/anniu.git
```

### 2. 验证Node.js
```bash
node --version
npm --version
```

### 3. 运行测试构建
```
1. 点击"立即构建"
2. 查看构建日志
3. 确认每个阶段都能正常执行
```

## 📋 八、检查清单

在开始前，请确认以下项目：

- [ ] Jenkins插件已安装
- [ ] Git工具已配置
- [ ] Node.js工具已配置 (可选)
- [ ] 网络连接正常
- [ ] 仓库地址正确
- [ ] 凭据配置正确
- [ ] 代理设置正确 (如需要)

## 🆘 九、获取帮助

如果仍然有问题，请检查：

1. **Jenkins系统日志**: Jenkins管理 → 系统日志
2. **构建日志**: 项目 → 构建历史 → 查看日志
3. **Git日志**: 查看Git操作的详细错误信息
4. **网络诊断**: 测试网络连通性

## 🎉 十、完成配置后的预期结果

配置完成后，你应该看到：

- ✅ **构建成功**: 状态为绿色
- ✅ **测试执行**: 5个按钮测试用例
- ✅ **报告生成**: JSON、JUnit、HTML三种格式
- ✅ **报告查看**: 在Jenkins界面查看HTML报告

---

## 📞 联系支持

如果按照本指南仍有问题，请提供：
1. Jenkins版本
2. 操作系统信息
3. 详细的错误日志
4. 网络环境描述

这样我们可以更精确地帮你解决问题！