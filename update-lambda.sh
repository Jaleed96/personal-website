#!/bin/bash

cd lambda

rm -f ./*.zip

zip -r lambda.zip .

aws lambda update-function-code --function-name github-repository-fetcher --zip-file fileb://lambda.zip