#!/usr/bin/env bash
set -eo pipefail

# Push our latest revision to GitHub
git push origin development

# Clean rebuild
yarn run build

# Create deploy environment inside of .deploy directory
mkdir .deploy
cd .deploy
git init
git remote add origin git@github.com:ZencashOfficial/myzenwallet.git

# Add built site files
cp -r ../dist/* .
echo "myzenwallet.io" >> CNAME
git add .
git commit -m 'Publish'
git push -f origin master

# Cleanup .deploy directory after a successful push
cd .. && rm -rf .deploy