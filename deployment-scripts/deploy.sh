#!/bin/bash

# stop vue server
pid=`ps -aux | grep node | grep vue-cli-service | sed -nr 's/[^ ]+\s+([^ ]+).*/\1/p'`
kill -9 $pid

# delete deployment
rm -rf deploy

# re-create deploy directory and check code out into it
mkdir deploy
cd deploy
git clone https://github.com/ampp33/switch-thing.git

# go into code dir and get main branch
cd switch-thing
git checkout main
git pull

# start server
npm install
npm run serve
