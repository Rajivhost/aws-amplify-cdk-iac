import * as cdk from '@aws-cdk/core';
import * as amplify from "@aws-cdk/aws-amplify";

export class AwsAmplifyCdkIacStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const amplifyApp = new amplify.App(this, "cdk-amplify", {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'Rajivhost',
        repository: 'aws-amplify-cdk-iac',
        oauthToken: cdk.SecretValue.secretsManager("github-token")
      }),
    });
    
    const masterBranch = amplifyApp.addBranch("master");

    // const domain = amplifyApp.addDomain('www.fnstack.io');
    // domain.mapRoot(masterBranch);
    // domain.mapSubDomain(masterBranch, 'www');
  }
}
