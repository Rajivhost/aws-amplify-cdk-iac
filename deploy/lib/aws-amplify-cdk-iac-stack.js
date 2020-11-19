"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsAmplifyCdkIacStack = void 0;
const cdk = require("@aws-cdk/core");
const amplify = require("@aws-cdk/aws-amplify");
class AwsAmplifyCdkIacStack extends cdk.Stack {
    constructor(scope, id, props) {
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
        const domain = amplifyApp.addDomain('www.fnstack.io');
        domain.mapRoot(masterBranch);
        // domain.mapSubDomain(masterBranch, 'www');
    }
}
exports.AwsAmplifyCdkIacStack = AwsAmplifyCdkIacStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWFtcGxpZnktY2RrLWlhYy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF3cy1hbXBsaWZ5LWNkay1pYWMtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLGdEQUFnRDtBQUVoRCxNQUFhLHFCQUFzQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2xELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNkNBQTZDO1FBQzdDLE1BQU0sVUFBVSxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3RELGtCQUFrQixFQUFFLElBQUksT0FBTyxDQUFDLHdCQUF3QixDQUFDO2dCQUN2RCxLQUFLLEVBQUUsV0FBVztnQkFDbEIsVUFBVSxFQUFFLHFCQUFxQjtnQkFDakMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQzthQUMzRCxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVwRCxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM3Qiw0Q0FBNEM7SUFDOUMsQ0FBQztDQUNGO0FBbkJELHNEQW1CQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGFtcGxpZnkgZnJvbSBcIkBhd3MtY2RrL2F3cy1hbXBsaWZ5XCI7XG5cbmV4cG9ydCBjbGFzcyBBd3NBbXBsaWZ5Q2RrSWFjU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXG4gICAgY29uc3QgYW1wbGlmeUFwcCA9IG5ldyBhbXBsaWZ5LkFwcCh0aGlzLCBcImNkay1hbXBsaWZ5XCIsIHtcbiAgICAgIHNvdXJjZUNvZGVQcm92aWRlcjogbmV3IGFtcGxpZnkuR2l0SHViU291cmNlQ29kZVByb3ZpZGVyKHtcbiAgICAgICAgb3duZXI6ICdSYWppdmhvc3QnLFxuICAgICAgICByZXBvc2l0b3J5OiAnYXdzLWFtcGxpZnktY2RrLWlhYycsXG4gICAgICAgIG9hdXRoVG9rZW46IGNkay5TZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcihcImdpdGh1Yi10b2tlblwiKVxuICAgICAgfSksXG4gICAgfSk7XG4gICAgXG4gICAgY29uc3QgbWFzdGVyQnJhbmNoID0gYW1wbGlmeUFwcC5hZGRCcmFuY2goXCJtYXN0ZXJcIik7XG5cbiAgICBjb25zdCBkb21haW4gPSBhbXBsaWZ5QXBwLmFkZERvbWFpbignd3d3LmZuc3RhY2suaW8nKTtcbiAgICBkb21haW4ubWFwUm9vdChtYXN0ZXJCcmFuY2gpO1xuICAgIC8vIGRvbWFpbi5tYXBTdWJEb21haW4obWFzdGVyQnJhbmNoLCAnd3d3Jyk7XG4gIH1cbn1cbiJdfQ==