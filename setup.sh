#!/bin/bash

cd server
python3 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
cd myapp
python3 manage.py migrate
mkdir common/tmp/processed

cd ../..

cd client
cd myapp
npm install
npm audit fix