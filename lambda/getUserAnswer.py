import json
import boto3 # AWS SDK
import os
import base64
from boto3.dynamodb.conditions import Key # To filter results
from decimal import Decimal # Import Decimal to properly encode/decode numbers
from json import loads


dynamoDB = boto3.resource('dynamodb') # Create a DynamoDB resource
submission_table = dynamoDB.Table('survey-submissions') # Connect to the submissions table

kms = boto3.client('kms')
KMS_KEY_ARN = os.environ.get('KMS_KEY_ARN')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super().default(obj)

def decrypt_answer(encrypted_answer):
    # Decrypt answer and convert back to string
    #print("Decrypting answer: " + encrypted_answer)

    decrypted_answer = kms.decrypt(
        KeyId = KMS_KEY_ARN,
        CiphertextBlob = base64.b64decode(encrypted_answer)
    )

    #print("Decrypted answer: " + decrypted_answer['Plaintext'].decode('utf-8'))
    
    return decrypted_answer['Plaintext'].decode('utf-8')

def lambda_handler(event, context):

    user_id = event['requestContext']['authorizer']['claims']['sub']

    query_result = submission_table.query(
        KeyConditionExpression=Key('user-id').eq(user_id)
    )

    query_items = query_result.get('Items', [])

    # Decrypt all user answers
    for item in query_items:
        # print("Item keys:", item.keys())
        # print("Answer value:", item.get('answers', 'FIELD NOT FOUND'))
        if 'answers' in item:
            decrypted_answer = decrypt_answer(item['answers'])
            item['answers'] = json.loads(decrypted_answer)

    if not query_items:
        return {
            'statusCode': 404,
            'body': json.dumps(f'No submissions found for user {user_id}')
        }

    return {
        'statusCode': 200,
        'body': json.dumps(query_items, cls = DecimalEncoder)
    }