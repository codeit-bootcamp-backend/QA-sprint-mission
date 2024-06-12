#!/bin/bash
cd /home/ec2-user/server/QA-sprint-mission
sudo npm install
sudo npm run build
pm2 restart my-app