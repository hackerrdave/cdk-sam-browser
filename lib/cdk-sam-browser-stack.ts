import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

export class CdkSamBrowserStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sendMetricsFunction = new lambda.Function(this, "SendMetricsFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "app.lambdaHandler",
      code: lambda.Code.fromAsset("./src/functions/send-metrics"),
      timeout: Duration.seconds(5),
      memorySize: 256,
      description: "Send Metrics for Website Finder Results"
    });

    const websiteFinderFunction = new lambda.Function(this, "WebsiteFinderFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "app.lambdaHandler",
      code: lambda.Code.fromAsset("./src/functions/website-finder"),
      timeout: Duration.seconds(30),
      memorySize: 2048, // Chrome will require higher memory
      description: "Find Web Page DOM Element Function"
    });

    const websiteFinderTask = new tasks.LambdaInvoke(this, "WebsiteFinderTask", {
      lambdaFunction: websiteFinderFunction
    });

    const sendMetricsTask = new tasks.LambdaInvoke(this, "SendMetricsTask", {
      lambdaFunction: sendMetricsFunction,
    });

    let stateMachineDefinition = new stepfunctions.Pass(this, "Start")
      .next(websiteFinderTask)
      .next(sendMetricsTask);
    
    new stepfunctions.StateMachine(this, "TrackUptimeMachine", {
      definition: stateMachineDefinition
    });
  }
}