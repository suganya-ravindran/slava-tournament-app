import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_nR8f1vAaA",
      userPoolClientId: "4s5v0rdru57plbfr3hf4cvh88",
      region: "us-east-1",
      loginWith: {
        email: true,
      },
    },
  },
});