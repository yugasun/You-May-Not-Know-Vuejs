#!/usr/bin/env sh

set -e

npm run build

cd docs/.vuepress/dist

git init
git config user.name 'yugasun'
git config user.email 'yuga_sun@163.com'
git add -A
git commit -m 'deploy'

git push -f git@github.com:yugasun/you-may-not-know-vuejs.git master:gh-pages

cd -