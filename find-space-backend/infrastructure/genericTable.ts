import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { join } from 'path';


export interface TableProps {
    tableName:string,
    primaryKey:string,
    createLambdaPath?:string,
    readLambdaPath?:string,
    updateLambdaPath?:string,
    deleteLambdaPath?:string,
    secondaryIndexes?:string[]
}

export class GenericTable {
    private stack:Stack;
    private props:TableProps;
    private table: Table;

    private createLambda:NodejsFunction|undefined;
    private readLambda:NodejsFunction|undefined;
    private updateLambda:NodejsFunction|undefined;
    private deleteLambda:NodejsFunction|undefined;
    
    public createLambdaIngegration:LambdaIntegration;
    public readLambdaIngegration:LambdaIntegration;
    public updateLambdaIngegration:LambdaIntegration;
    public deleteLambdaIngegration:LambdaIntegration;

    public constructor(stack:Stack, props:TableProps){
        this.stack=stack;
        this.props=props;
        this.initialize();
    }

    private initialize(){
        this.createTable();
        this.addSecondaryIndexs();
        this.createLambdas();
        this.grandTableRights();
    }

    private createTable(){
        this.table=new Table(this.stack,this.props.tableName,
            {
                partitionKey:{
                    name:this.props.primaryKey,
                    type:AttributeType.STRING
                },
                tableName:this.props.tableName,
                removalPolicy:RemovalPolicy.DESTROY
            });
    }

    private addSecondaryIndexs(){
        if(this.props.secondaryIndexes){
            for(const secondarIndex of this.props.secondaryIndexes){
                this.table.addGlobalSecondaryIndex(
                    {
                        indexName:secondarIndex,
                        partitionKey:{
                            name:secondarIndex,
                            type:AttributeType.STRING
                        }
                    }
                )
            }
        }
    }
    private createLambdas(){
        if(this.props.createLambdaPath){
            this.createLambda=this.createSingleLambda(this.props.createLambdaPath);
            this.createLambdaIngegration = new LambdaIntegration(this.createLambda);
        }
        if(this.props.readLambdaPath){
            this.readLambda=this.createSingleLambda(this.props.readLambdaPath);
            this.readLambdaIngegration = new LambdaIntegration(this.readLambda);
        }
        if(this.props.updateLambdaPath){
            this.updateLambda=this.createSingleLambda(this.props.updateLambdaPath);
            this.updateLambdaIngegration = new LambdaIntegration(this.updateLambda);
        }
        if(this.props.deleteLambdaPath){
            this.deleteLambda=this.createSingleLambda(this.props.deleteLambdaPath);
            this.deleteLambdaIngegration = new LambdaIntegration(this.deleteLambda);
        }
    }
    private createSingleLambda(lambdaName:string):NodejsFunction{
        const lambdaId = `${this.props.tableName}-${lambdaName}`
        return new NodejsFunction(this.stack,lambdaId,
            {
                entry:(join(__dirname,'..', 'services', this.props.tableName,`${lambdaName}.ts`)),
                handler:"handler",
                functionName:lambdaId,
                environment:{
                    TABLE_NAME:this.props.tableName,
                    PRIMARY_KEY:this.props.primaryKey
                }

            }
        );
    }

    private grandTableRights(){
        if(this.createLambda){
            this.table.grantWriteData(this.createLambda);
        }
        if(this.readLambda){
            this.table.grantReadData(this.readLambda);
        }
        if(this.updateLambda){
            this.table.grantWriteData(this.updateLambda);
        }
        if(this.deleteLambda){
            this.table.grantWriteData(this.deleteLambda);
        }
    }
}