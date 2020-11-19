#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsAmplifyCdkIacStack } from '../lib/aws-amplify-cdk-iac-stack';

const app = new cdk.App();
new AwsAmplifyCdkIacStack(app, 'AwsAmplifyCdkIacStack');
