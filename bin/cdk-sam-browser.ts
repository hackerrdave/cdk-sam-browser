#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkSamBrowserStack } from '../lib/cdk-sam-browser-stack';

const app = new cdk.App();
new CdkSamBrowserStack(app, 'CdkSamBrowserStack', {});
