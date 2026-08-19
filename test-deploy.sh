#!/bin/bash
set -e
npm run build:web:test
cd dist && zip -r ../rn-dist.zip ./* && cd ..
scp ./rn-dist.zip serene@pc:/tmp/rn-dist.zip
mv rn-dist.zip ./dist
ssh -t serene@pc "sudo unzip -o /tmp/rn-dist.zip -d /home/www/rn-dist/"
