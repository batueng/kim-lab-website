#!/bin/bash

cd server
mkdir myapp/common/tmp
mkdir myapp/common/tmp/processed
mkdir myapp/common/tmp/excel
python3 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
cd myapp
python3 manage.py migrate

cd ../..

cd client
cd myapp
npm install
npm audit fix