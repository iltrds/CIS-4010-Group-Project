import json
import boto3
import os
import base64
from decimal import Decimal


dynamoDB = boto3.resource('dynamodb')
kms = boto3.client('kms')
answer_table = dynamoDB.Table('survey-submissions')
KMS_KEY_ARN = os.environ['KMS_KEY_ARN']

def lambda_handler(event, context):
    
    request = json.loads(event['body']) # Parse string into dictionary object

    user_id = request['user-id']
    survey_id = int(request['survey-id'])
    survey_answers = request['answers'] # This is a list of answer objects (Survey Question: User Answer)

    encrypted = kms.encrypt(
        KeyId=KMS_KEY_ARN,
        Plaintext=json.dumps(survey_answers).encode('utf-8')
    )

    encrypted_answers = base64.b64encode(encrypted['CiphertextBlob']).decode('utf-8')

    answer_table.put_item(
        Item = {
            'user-id' : user_id,
            'survey-id' : survey_id,
            'answers' : encrypted_answers
        }
    )

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Survey Answers written to DB'})
    }
