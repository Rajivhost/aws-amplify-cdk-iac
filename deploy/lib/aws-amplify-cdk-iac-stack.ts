import * as cdk from '@aws-cdk/core';
import * as amplify from "@aws-cdk/aws-amplify";
import * as cognito from '@aws-cdk/aws-cognito';
import * as iam from "@aws-cdk/aws-iam";

export class AwsAmplifyCdkIacStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const awsRegion = cdk.Aws.REGION;
    const awsAccountId = cdk.Aws.ACCOUNT_ID;

    const userPool = new cognito.UserPool(this, "userPool", {
        userPoolName: "Saas-Userpool",
        mfa: cognito.Mfa.OPTIONAL,
        selfSignUpEnabled: false,
        signInAliases: {
          username: true,
          phone: true
        },
        autoVerify: {
          email: true,
          phone: true,
        },
        passwordPolicy: {
            minLength: 8,
            requireLowercase: true,
            requireUppercase: true,
            requireDigits: true,
            requireSymbols: false,
            tempPasswordValidity: cdk.Duration.days(7),
        },
        standardAttributes: {
            email: {
                required: true,
                mutable: true,
            },
            familyName: {
              required: true,
              mutable: true
            },
            givenName: {
              required: true,
              mutable: true
            },
            phoneNumber: {
              required: true,
              mutable: true
            },
            preferredUsername: {
              required: true,
              mutable: true
            }
        },
        customAttributes: {
          tenant_id: new cognito.StringAttribute({ mutable: false, minLen: 1, maxLen: 256 }),
          tier: new cognito.StringAttribute({ mutable: true, minLen: 1, maxLen: 256 }),
          company_name: new cognito.StringAttribute({ mutable: true, minLen: 1, maxLen: 256 }),
          role: new cognito.StringAttribute({ mutable: true, minLen: 1, maxLen: 256 }),
          account_name: new cognito.StringAttribute({ mutable: true, minLen: 1, maxLen: 256 }),
        },
        accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
        
    });

    const userPoolClient = new cognito.UserPoolClient(this, "client", {
        userPool,
        userPoolClientName: "Saas-Client-App",
        generateSecret: false,
        authFlows: {
          adminUserPassword: false,
          userPassword: false,
          userSrp: false,
          custom: false
        },
        preventUserExistenceErrors: true,
    });

    const defaultUser = new cognito.CfnUserPoolUser(this, 'Saas-DefaultUser', {
      username: "admin",
      userPoolId: userPool.userPoolId,
      desiredDeliveryMediums: ['EMAIL'],
      userAttributes: [
        {
          name: 'email',
          value: "rajiv.mounguengue@hotmail.fr",
        },
      ],
    })

    const defaultGroup = new cognito.CfnUserPoolGroup(this, 'Saas-DefaultGroup', {
      groupName: "Admins",
      userPoolId: userPool.userPoolId,
    })

    const userPoolUserToGroupAttachment = new cognito.CfnUserPoolUserToGroupAttachment(this, `AdminAttachment`, {
      userPoolId: userPool.userPoolId,
      groupName: defaultGroup.ref,
      username: defaultUser.ref
    });

    const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      identityPoolName: "Saas-Identity-Pool",
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });

    const identityPoolAuthRole = new iam.Role(this, 'AuthIdentitiesRole', {
      assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': identityPool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated'
        }
      }, 'sts:AssumeRoleWithWebIdentity')
    });

    identityPoolAuthRole.addToPolicy(new iam.PolicyStatement({
			effect: iam.Effect.ALLOW,
			actions: [
				"mobileanalytics:PutEvents",
				"cognito-sync:*"
			],
			resources: [`arn:aws:cognito-identity:${awsRegion}:${awsAccountId}:identitypool/${identityPool.ref}`],
    }))

    const identityPoolRoleAttachment = new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentitiesRoleAttachment', {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: identityPoolAuthRole.roleArn,
      },
      // roleMappings: labMemberRoleMapping
    });

    // const region = cdk.Stack.of(this).region;

    // const describeCognitoUserPoolClient = new cr.AwsCustomResource(
    //     this,
    //     "DescribeCognitoUserPoolClient",
    //     {
    //         resourceType: "Custom::DescribeCognitoUserPoolClient",
    //         onCreate: {
    //             region,
    //             service: "CognitoIdentityServiceProvider",
    //             action: "describeUserPoolClient",
    //             parameters: {
    //                 UserPoolId: userPool.userPoolId,
    //                 ClientId: userPoolClient.userPoolClientId,
    //             },
    //             physicalResourceId: cr.PhysicalResourceId.of(
    //                 userPoolClient.userPoolClientId
    //             ),
    //         },
    //         // TODO: can we restrict this policy more?
    //         policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
    //             resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
    //         }),
    //     }
    // );

    
    // const amplifyApp = new amplify.App(this, "cdk-amplify", {
    //   sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
    //     owner: 'Rajivhost',
    //     repository: 'aws-amplify-cdk-iac',
    //     oauthToken: cdk.SecretValue.secretsManager("github-token")
    //   }),
    // });
    
    // const masterBranch = amplifyApp.addBranch("master");

    // const domain = amplifyApp.addDomain('www.fnstack.io');
    // domain.mapRoot(masterBranch);
    // domain.mapSubDomain(masterBranch, 'www');
  }
}
