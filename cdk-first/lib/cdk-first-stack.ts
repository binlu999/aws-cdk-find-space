import * as cdk from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { CfnOutput, CfnParameter } from '@aws-cdk/core';

export class CdkFirstStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const duration = new CfnParameter(this,'duration',{
      type:'Number',
      default: 6,
      minValue:1,
      maxValue:10
    });

    const newBucket = new Bucket(this, 'somebucket',
      {
        bucketName: "amyam-test-bucket",
        lifecycleRules: [
          {
            expiration: cdk.Duration.days(duration.valueAsNumber)
          }
        ]
      });

      new CfnOutput(this,'my-bucket-name',{
        value:newBucket.bucketName
      })
  };


}
