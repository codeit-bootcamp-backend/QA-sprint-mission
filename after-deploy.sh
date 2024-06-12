#!/bin/bash
sudo su -
cd /home/ec2-user/server/QA-sprint-mission
npm install
npm run build
pm2 restart my-app