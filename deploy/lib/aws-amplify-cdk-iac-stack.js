"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsAmplifyCdkIacStack = void 0;
const cdk = require("@aws-cdk/core");
const cognito = require("@aws-cdk/aws-cognito");
const iam = require("@aws-cdk/aws-iam");
class AwsAmplifyCdkIacStack extends cdk.Stack {
    constructor(scope, id, props) {
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
        });
        const defaultGroup = new cognito.CfnUserPoolGroup(this, 'Saas-DefaultGroup', {
            groupName: "Admins",
            userPoolId: userPool.userPoolId,
        });
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
        }));
        const identityPoolRoleAttachment = new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentitiesRoleAttachment', {
            identityPoolId: identityPool.ref,
            roles: {
                authenticated: identityPoolAuthRole.roleArn,
            },
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
exports.AwsAmplifyCdkIacStack = AwsAmplifyCdkIacStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWFtcGxpZnktY2RrLWlhYy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF3cy1hbXBsaWZ5LWNkay1pYWMtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBRXJDLGdEQUFnRDtBQUNoRCx3Q0FBd0M7QUFFeEMsTUFBYSxxQkFBc0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNsRCxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ2pDLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBRXhDLE1BQU0sUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELFlBQVksRUFBRSxlQUFlO1lBQzdCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVE7WUFDekIsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixhQUFhLEVBQUU7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsS0FBSyxFQUFFLElBQUk7YUFDWjtZQUNELFVBQVUsRUFBRTtnQkFDVixLQUFLLEVBQUUsSUFBSTtnQkFDWCxLQUFLLEVBQUUsSUFBSTthQUNaO1lBQ0QsY0FBYyxFQUFFO2dCQUNaLFNBQVMsRUFBRSxDQUFDO2dCQUNaLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixjQUFjLEVBQUUsS0FBSztnQkFDckIsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzdDO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ2hCLEtBQUss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LDRDQUE0QztRQUU1QyxrRUFBa0U7UUFDbEUsWUFBWTtRQUNaLHVDQUF1QztRQUN2QyxRQUFRO1FBQ1IsaUVBQWlFO1FBQ2pFLHNCQUFzQjtRQUN0QixzQkFBc0I7UUFDdEIseURBQXlEO1FBQ3pELGdEQUFnRDtRQUNoRCw0QkFBNEI7UUFDNUIsbURBQW1EO1FBQ25ELDZEQUE2RDtRQUM3RCxpQkFBaUI7UUFDakIsNERBQTREO1FBQzVELGtEQUFrRDtRQUNsRCxpQkFBaUI7UUFDakIsYUFBYTtRQUNiLHFEQUFxRDtRQUNyRCw0REFBNEQ7UUFDNUQsa0VBQWtFO1FBQ2xFLGNBQWM7UUFDZCxRQUFRO1FBQ1IsS0FBSztRQUdMLDREQUE0RDtRQUM1RCwrREFBK0Q7UUFDL0QsMEJBQTBCO1FBQzFCLHlDQUF5QztRQUN6QyxpRUFBaUU7UUFDakUsUUFBUTtRQUNSLE1BQU07UUFFTix1REFBdUQ7UUFFdkQseURBQXlEO1FBQ3pELGdDQUFnQztRQUNoQyw0Q0FBNEM7SUFDOUMsQ0FBQztDQUNGO0FBaExELHNEQWdMQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGFtcGxpZnkgZnJvbSBcIkBhd3MtY2RrL2F3cy1hbXBsaWZ5XCI7XG5pbXBvcnQgKiBhcyBjb2duaXRvIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2duaXRvJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tIFwiQGF3cy1jZGsvYXdzLWlhbVwiO1xuXG5leHBvcnQgY2xhc3MgQXdzQW1wbGlmeUNka0lhY1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGF3c1JlZ2lvbiA9IGNkay5Bd3MuUkVHSU9OO1xuICAgIGNvbnN0IGF3c0FjY291bnRJZCA9IGNkay5Bd3MuQUNDT1VOVF9JRDtcblxuICAgIGNvbnN0IHVzZXJQb29sID0gbmV3IGNvZ25pdG8uVXNlclBvb2wodGhpcywgXCJ1c2VyUG9vbFwiLCB7XG4gICAgICAgIHVzZXJQb29sTmFtZTogXCJTYWFzLVVzZXJwb29sXCIsXG4gICAgICAgIG1mYTogY29nbml0by5NZmEuT1BUSU9OQUwsXG4gICAgICAgIHNlbGZTaWduVXBFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgc2lnbkluQWxpYXNlczoge1xuICAgICAgICAgIHVzZXJuYW1lOiB0cnVlLFxuICAgICAgICAgIHBob25lOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGF1dG9WZXJpZnk6IHtcbiAgICAgICAgICBlbWFpbDogdHJ1ZSxcbiAgICAgICAgICBwaG9uZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgcGFzc3dvcmRQb2xpY3k6IHtcbiAgICAgICAgICAgIG1pbkxlbmd0aDogOCxcbiAgICAgICAgICAgIHJlcXVpcmVMb3dlcmNhc2U6IHRydWUsXG4gICAgICAgICAgICByZXF1aXJlVXBwZXJjYXNlOiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZURpZ2l0czogdHJ1ZSxcbiAgICAgICAgICAgIHJlcXVpcmVTeW1ib2xzOiBmYWxzZSxcbiAgICAgICAgICAgIHRlbXBQYXNzd29yZFZhbGlkaXR5OiBjZGsuRHVyYXRpb24uZGF5cyg3KSxcbiAgICAgICAgfSxcbiAgICAgICAgc3RhbmRhcmRBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBlbWFpbDoge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIG11dGFibGU6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFtaWx5TmFtZToge1xuICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgbXV0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdpdmVuTmFtZToge1xuICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgbXV0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBob25lTnVtYmVyOiB7XG4gICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgICBtdXRhYmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJlZmVycmVkVXNlcm5hbWU6IHtcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgIG11dGFibGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY3VzdG9tQXR0cmlidXRlczoge1xuICAgICAgICAgIHRlbmFudF9pZDogbmV3IGNvZ25pdG8uU3RyaW5nQXR0cmlidXRlKHsgbXV0YWJsZTogZmFsc2UsIG1pbkxlbjogMSwgbWF4TGVuOiAyNTYgfSksXG4gICAgICAgICAgdGllcjogbmV3IGNvZ25pdG8uU3RyaW5nQXR0cmlidXRlKHsgbXV0YWJsZTogdHJ1ZSwgbWluTGVuOiAxLCBtYXhMZW46IDI1NiB9KSxcbiAgICAgICAgICBjb21wYW55X25hbWU6IG5ldyBjb2duaXRvLlN0cmluZ0F0dHJpYnV0ZSh7IG11dGFibGU6IHRydWUsIG1pbkxlbjogMSwgbWF4TGVuOiAyNTYgfSksXG4gICAgICAgICAgcm9sZTogbmV3IGNvZ25pdG8uU3RyaW5nQXR0cmlidXRlKHsgbXV0YWJsZTogdHJ1ZSwgbWluTGVuOiAxLCBtYXhMZW46IDI1NiB9KSxcbiAgICAgICAgICBhY2NvdW50X25hbWU6IG5ldyBjb2duaXRvLlN0cmluZ0F0dHJpYnV0ZSh7IG11dGFibGU6IHRydWUsIG1pbkxlbjogMSwgbWF4TGVuOiAyNTYgfSksXG4gICAgICAgIH0sXG4gICAgICAgIGFjY291bnRSZWNvdmVyeTogY29nbml0by5BY2NvdW50UmVjb3ZlcnkuRU1BSUxfT05MWSxcbiAgICAgICAgXG4gICAgfSk7XG5cbiAgICBjb25zdCB1c2VyUG9vbENsaWVudCA9IG5ldyBjb2duaXRvLlVzZXJQb29sQ2xpZW50KHRoaXMsIFwiY2xpZW50XCIsIHtcbiAgICAgICAgdXNlclBvb2wsXG4gICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogXCJTYWFzLUNsaWVudC1BcHBcIixcbiAgICAgICAgZ2VuZXJhdGVTZWNyZXQ6IGZhbHNlLFxuICAgICAgICBhdXRoRmxvd3M6IHtcbiAgICAgICAgICBhZG1pblVzZXJQYXNzd29yZDogZmFsc2UsXG4gICAgICAgICAgdXNlclBhc3N3b3JkOiBmYWxzZSxcbiAgICAgICAgICB1c2VyU3JwOiBmYWxzZSxcbiAgICAgICAgICBjdXN0b206IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHByZXZlbnRVc2VyRXhpc3RlbmNlRXJyb3JzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZGVmYXVsdFVzZXIgPSBuZXcgY29nbml0by5DZm5Vc2VyUG9vbFVzZXIodGhpcywgJ1NhYXMtRGVmYXVsdFVzZXInLCB7XG4gICAgICB1c2VybmFtZTogXCJhZG1pblwiLFxuICAgICAgdXNlclBvb2xJZDogdXNlclBvb2wudXNlclBvb2xJZCxcbiAgICAgIGRlc2lyZWREZWxpdmVyeU1lZGl1bXM6IFsnRU1BSUwnXSxcbiAgICAgIHVzZXJBdHRyaWJ1dGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICAgIHZhbHVlOiBcInJhaml2Lm1vdW5ndWVuZ3VlQGhvdG1haWwuZnJcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSlcblxuICAgIGNvbnN0IGRlZmF1bHRHcm91cCA9IG5ldyBjb2duaXRvLkNmblVzZXJQb29sR3JvdXAodGhpcywgJ1NhYXMtRGVmYXVsdEdyb3VwJywge1xuICAgICAgZ3JvdXBOYW1lOiBcIkFkbWluc1wiLFxuICAgICAgdXNlclBvb2xJZDogdXNlclBvb2wudXNlclBvb2xJZCxcbiAgICB9KVxuXG4gICAgY29uc3QgdXNlclBvb2xVc2VyVG9Hcm91cEF0dGFjaG1lbnQgPSBuZXcgY29nbml0by5DZm5Vc2VyUG9vbFVzZXJUb0dyb3VwQXR0YWNobWVudCh0aGlzLCBgQWRtaW5BdHRhY2htZW50YCwge1xuICAgICAgdXNlclBvb2xJZDogdXNlclBvb2wudXNlclBvb2xJZCxcbiAgICAgIGdyb3VwTmFtZTogZGVmYXVsdEdyb3VwLnJlZixcbiAgICAgIHVzZXJuYW1lOiBkZWZhdWx0VXNlci5yZWZcbiAgICB9KTtcblxuICAgIGNvbnN0IGlkZW50aXR5UG9vbCA9IG5ldyBjb2duaXRvLkNmbklkZW50aXR5UG9vbCh0aGlzLCAnSWRlbnRpdHlQb29sJywge1xuICAgICAgaWRlbnRpdHlQb29sTmFtZTogXCJTYWFzLUlkZW50aXR5LVBvb2xcIixcbiAgICAgIGFsbG93VW5hdXRoZW50aWNhdGVkSWRlbnRpdGllczogZmFsc2UsXG4gICAgICBjb2duaXRvSWRlbnRpdHlQcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNsaWVudElkOiB1c2VyUG9vbENsaWVudC51c2VyUG9vbENsaWVudElkLFxuICAgICAgICAgIHByb3ZpZGVyTmFtZTogdXNlclBvb2wudXNlclBvb2xQcm92aWRlck5hbWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaWRlbnRpdHlQb29sQXV0aFJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0F1dGhJZGVudGl0aWVzUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5GZWRlcmF0ZWRQcmluY2lwYWwoJ2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbScsIHtcbiAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgJ2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTphdWQnOiBpZGVudGl0eVBvb2wucmVmXG4gICAgICAgIH0sXG4gICAgICAgICdGb3JBbnlWYWx1ZTpTdHJpbmdMaWtlJzoge1xuICAgICAgICAgICdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206YW1yJzogJ2F1dGhlbnRpY2F0ZWQnXG4gICAgICAgIH1cbiAgICAgIH0sICdzdHM6QXNzdW1lUm9sZVdpdGhXZWJJZGVudGl0eScpXG4gICAgfSk7XG5cbiAgICBpZGVudGl0eVBvb2xBdXRoUm9sZS5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG5cdFx0XHRlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG5cdFx0XHRhY3Rpb25zOiBbXG5cdFx0XHRcdFwibW9iaWxlYW5hbHl0aWNzOlB1dEV2ZW50c1wiLFxuXHRcdFx0XHRcImNvZ25pdG8tc3luYzoqXCJcblx0XHRcdF0sXG5cdFx0XHRyZXNvdXJjZXM6IFtgYXJuOmF3czpjb2duaXRvLWlkZW50aXR5OiR7YXdzUmVnaW9ufToke2F3c0FjY291bnRJZH06aWRlbnRpdHlwb29sLyR7aWRlbnRpdHlQb29sLnJlZn1gXSxcbiAgICB9KSlcblxuICAgIGNvbnN0IGlkZW50aXR5UG9vbFJvbGVBdHRhY2htZW50ID0gbmV3IGNvZ25pdG8uQ2ZuSWRlbnRpdHlQb29sUm9sZUF0dGFjaG1lbnQodGhpcywgJ0lkZW50aXRpZXNSb2xlQXR0YWNobWVudCcsIHtcbiAgICAgIGlkZW50aXR5UG9vbElkOiBpZGVudGl0eVBvb2wucmVmLFxuICAgICAgcm9sZXM6IHtcbiAgICAgICAgYXV0aGVudGljYXRlZDogaWRlbnRpdHlQb29sQXV0aFJvbGUucm9sZUFybixcbiAgICAgIH0sXG4gICAgICAvLyByb2xlTWFwcGluZ3M6IGxhYk1lbWJlclJvbGVNYXBwaW5nXG4gICAgfSk7XG5cbiAgICAvLyBjb25zdCByZWdpb24gPSBjZGsuU3RhY2sub2YodGhpcykucmVnaW9uO1xuXG4gICAgLy8gY29uc3QgZGVzY3JpYmVDb2duaXRvVXNlclBvb2xDbGllbnQgPSBuZXcgY3IuQXdzQ3VzdG9tUmVzb3VyY2UoXG4gICAgLy8gICAgIHRoaXMsXG4gICAgLy8gICAgIFwiRGVzY3JpYmVDb2duaXRvVXNlclBvb2xDbGllbnRcIixcbiAgICAvLyAgICAge1xuICAgIC8vICAgICAgICAgcmVzb3VyY2VUeXBlOiBcIkN1c3RvbTo6RGVzY3JpYmVDb2duaXRvVXNlclBvb2xDbGllbnRcIixcbiAgICAvLyAgICAgICAgIG9uQ3JlYXRlOiB7XG4gICAgLy8gICAgICAgICAgICAgcmVnaW9uLFxuICAgIC8vICAgICAgICAgICAgIHNlcnZpY2U6IFwiQ29nbml0b0lkZW50aXR5U2VydmljZVByb3ZpZGVyXCIsXG4gICAgLy8gICAgICAgICAgICAgYWN0aW9uOiBcImRlc2NyaWJlVXNlclBvb2xDbGllbnRcIixcbiAgICAvLyAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgLy8gICAgICAgICAgICAgICAgIFVzZXJQb29sSWQ6IHVzZXJQb29sLnVzZXJQb29sSWQsXG4gICAgLy8gICAgICAgICAgICAgICAgIENsaWVudElkOiB1c2VyUG9vbENsaWVudC51c2VyUG9vbENsaWVudElkLFxuICAgIC8vICAgICAgICAgICAgIH0sXG4gICAgLy8gICAgICAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBjci5QaHlzaWNhbFJlc291cmNlSWQub2YoXG4gICAgLy8gICAgICAgICAgICAgICAgIHVzZXJQb29sQ2xpZW50LnVzZXJQb29sQ2xpZW50SWRcbiAgICAvLyAgICAgICAgICAgICApLFxuICAgIC8vICAgICAgICAgfSxcbiAgICAvLyAgICAgICAgIC8vIFRPRE86IGNhbiB3ZSByZXN0cmljdCB0aGlzIHBvbGljeSBtb3JlP1xuICAgIC8vICAgICAgICAgcG9saWN5OiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoe1xuICAgIC8vICAgICAgICAgICAgIHJlc291cmNlczogY3IuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFLFxuICAgIC8vICAgICAgICAgfSksXG4gICAgLy8gICAgIH1cbiAgICAvLyApO1xuXG4gICAgXG4gICAgLy8gY29uc3QgYW1wbGlmeUFwcCA9IG5ldyBhbXBsaWZ5LkFwcCh0aGlzLCBcImNkay1hbXBsaWZ5XCIsIHtcbiAgICAvLyAgIHNvdXJjZUNvZGVQcm92aWRlcjogbmV3IGFtcGxpZnkuR2l0SHViU291cmNlQ29kZVByb3ZpZGVyKHtcbiAgICAvLyAgICAgb3duZXI6ICdSYWppdmhvc3QnLFxuICAgIC8vICAgICByZXBvc2l0b3J5OiAnYXdzLWFtcGxpZnktY2RrLWlhYycsXG4gICAgLy8gICAgIG9hdXRoVG9rZW46IGNkay5TZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcihcImdpdGh1Yi10b2tlblwiKVxuICAgIC8vICAgfSksXG4gICAgLy8gfSk7XG4gICAgXG4gICAgLy8gY29uc3QgbWFzdGVyQnJhbmNoID0gYW1wbGlmeUFwcC5hZGRCcmFuY2goXCJtYXN0ZXJcIik7XG5cbiAgICAvLyBjb25zdCBkb21haW4gPSBhbXBsaWZ5QXBwLmFkZERvbWFpbignd3d3LmZuc3RhY2suaW8nKTtcbiAgICAvLyBkb21haW4ubWFwUm9vdChtYXN0ZXJCcmFuY2gpO1xuICAgIC8vIGRvbWFpbi5tYXBTdWJEb21haW4obWFzdGVyQnJhbmNoLCAnd3d3Jyk7XG4gIH1cbn1cbiJdfQ==