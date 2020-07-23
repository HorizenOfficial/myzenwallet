#!/usr/bin/env bash
set -eo pipefail

# Push our latest revision to GitHub, you should bump the version number and tag first
tag=$(git describe --tags $(git rev-list --tags --max-count=1))
git push origin development

# Clean rebuild
yarn run build

# Create deploy environment inside of .deploy directory
mkdir .deploy
cd .deploy
git init
git remote add origin git@github.com:HorizenOfficial/myzenwallet.git

# Add built site files
cp -r ../dist/* .
echo "myzenwallet.io" >> CNAME
git add .
git commit -S -m "Publish $tag"
git push -f origin master

# Cleanup .deploy directory after a successful push
cd .. && rm -rf .deploy
