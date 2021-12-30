#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core'
import { CdkFirstStack } from '../lib/cdk-first-stack';

const app = new cdk.App();
new CdkFirstStack(app, 'CdkFirstStack', {});

//new CdkFirstStack(app,'second-stack-from-first',{});
