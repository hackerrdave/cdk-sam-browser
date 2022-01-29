import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as CdkSamBrowser from '../lib/cdk-sam-browser-stack';

test('Lambda Function Created', () => {
  const app = new cdk.App();
  const stack = new CdkSamBrowser.CdkSamBrowserStack(app, 'MyTestStack');

  const template = Template.fromStack(stack);

  expect(
    Object.keys(
      template.findResources('AWS::Lambda::Function')
    )
  ).toHaveLength(2);
});
