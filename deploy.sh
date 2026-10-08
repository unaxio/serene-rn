#!/bin/bash
set -e
npm run build:web:prod
cd dist && zip -r ../rn-dist.zip ./* && cd ..
scp ./rn-dist.zip serene@sh:/tmp/rn-dist.zip
mv rn-dist.zip ./dist
ssh -t serene@sh "sudo unzip -o /tmp/rn-dist.zip -d /home/www/rn-dist/"
