# FInd space project

## Init node project
```
npm init -y
```
## add dev dependences (CDK V2)
```
npm i -D aws-cdk aws-cdk-lib constructs ts-node typescript
```
## Initiate typescript
```
tsc --init
```

## bootstrap with cloud
```
cdk bootstrap
```


## Reference
https://github.com/barosanuemailtest/space-finder-backend
https://github.com/barosanuemailtest/space-finder-frontend


### aws-lambda-nodejs
https://docs.aws.amazon.com/cdk/api/v1/docs/aws-lambda-nodejs-readme.html

```
$ npm install --save-dev esbuild@0
```

## cognito change user password
```
aws cognito-idp admin-set-user-password --user-pool-id us-east-1_YjuZDrBGZ --username findspaceuser --password "zaq1@WSX" --permanent
```
jwt.io

### Cognito references
Fine-grained Access Control with Amazon Cognito Identity Pools
https://www.youtube.com/watch?v=tAUmz94O2Qo
Serverless Authentication and Authorization
https://www.youtube.com/watch?v=VZqG7HjT2AQ
Building Multi-Tenant Solutions on AWS
https://www.youtube.com/watch?v=mwQ5lipGTBI
