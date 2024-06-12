#!/bin/bash
cd /home/ec2-user/server/QA-sprint-mission
sudo su -
npm install
npm run build
pm2 restart my-app