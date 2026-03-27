import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId:  'us-east-1_R5HBRua88',
            userPoolClientId: '6k52pg7b8h9lcf4b2nf7n1n2tn',
        },
    },
});