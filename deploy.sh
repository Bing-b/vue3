#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e


DIST_PATH="dist"
REMOTE_REPO="git@github.com:Bing-b/vue3.git"
BRANCH="gh-pages"


echo "🚀 开始构建项目..."
pnpm run build

# 进入生成的文件夹
cd $DIST_PATH

# 静态站点优化
# 防止 GitHub Pages 忽略以下划线开头的文件夹 (如 _next)
touch .nojekyll

# 初始化并提交
echo "📦 准备提交到 $BRANCH 分支..."
git init
git add -A
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# 强制推送
# 使用 HEAD:gh-pages 确保将当前目录内容推送到远程仓库的指定分支
echo "📤 正在推送到 GitHub..."
git push -f "$REMOTE_REPO" HEAD:"$BRANCH"

# 回到原目录并清理
cd -
echo "✅ 部署完成！"