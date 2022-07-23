import { Stack, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { CloudFrontWebDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { join } from 'path';

export class FindSpaceWeb {
    private stack:Stack;
    private bucketSuffix:string;
    private webContentBucket:Bucket;

    constructor(stack:Stack,bucketSuffix:string){
        this.stack=stack;
        this.bucketSuffix=bucketSuffix;
        this.initialize();

    }
    private initialize(){
        const bucketName='find-space-app-web-'+this.bucketSuffix;
        this.webContentBucket = new Bucket(this.stack,'find-space-app-web-content',{
            bucketName:bucketName,
            publicReadAccess:false,
            removalPolicy:RemovalPolicy.DESTROY,
            websiteIndexDocument:'index.html'
        });
        new BucketDeployment(
            this.stack,
            'find-space-web-content-bucket-deployment',{
                destinationBucket:this.webContentBucket,
                sources:[
                    Source.asset(
                        join(__dirname,'../../find-space-frontend/build')
                        ),
                ]
            }
        );
        new CfnOutput(this.stack,'spaceFinderWebAppS3URL',{
            value:this.webContentBucket.bucketWebsiteUrl
        });
        const cloudFront = new CloudFrontWebDistribution(
            this.stack,
            'find-space-cf',
            {
                originConfigs:[
                    {
                        behaviors:[
                            {
                                isDefaultBehavior:true
                            }
                        ],
                        s3OriginSource:{
                            s3BucketSource:this.webContentBucket
                        }
                    }
                ]
            }
        );
        new CfnOutput(this.stack,'find-space-CF-URL',{
            value:cloudFront.distributionDomainName
        })
    }
}