import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as apigatewayv2_integ from '@aws-cdk/aws-apigatewayv2-integrations';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as cforig from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../../extensions';


const app = new cdk.App();
const stack = new cdk.Stack(app, 'norquestr');

const lambdafn = new lambda.Function(stack, 'lambda', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(
    `
      exports.handler = async function (event) {
        console.log("request:", JSON.stringify(event, undefined, 2));
        return {
          statusCode: 200,
          headers: { "Content-Type": "text/html" },
          body: "<h1>Hello CDK!</h1>",
        };
      };
    `),
});

const lambda_integ = new apigatewayv2_integ.LambdaProxyIntegration({ handler: lambdafn });
const api = new apigatewayv2.HttpApi(stack, 'ag2');
api.addRoutes({
  path: '/hellocdk',
  methods: [apigatewayv2.HttpMethod.GET],
  integration: lambda_integ,
});

const normalizeQueryString = new extensions.NormalizeQueryString(stack, 'norquestrext');
const cfDistribution = new cf.Distribution(stack, 'cfDistribution', {
  defaultBehavior: {
    origin: new cforig.HttpOrigin(`${api.httpApiId}.execute-api.${stack.region}.${stack.urlSuffix}`, {}),
    edgeLambdas: [normalizeQueryString],
    cachePolicy: new cf.CachePolicy(stack, 'CachePolicy', {
      queryStringBehavior: cf.CacheQueryStringBehavior.all(),
      maxTtl: cdk.Duration.seconds(10),
      defaultTtl: cdk.Duration.seconds(10),
    }),
    originRequestPolicy: new cf.OriginRequestPolicy(stack, 'RequestPolicy', {
      queryStringBehavior: cf.OriginRequestQueryStringBehavior.all(),
    }),
  },
  priceClass: cf.PriceClass.PRICE_CLASS_100,
});
new cdk.CfnOutput(stack, 'APIGatewayURL', { value: `${api.url!}` });
new cdk.CfnOutput(stack, 'CloudFrontURL', { value: cfDistribution.domainName });