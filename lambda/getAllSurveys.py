import json
import boto3 # AWS SDK
from decimal import Decimal # Import Decimal to properly encode/decode numbers

dynamoDB = boto3.resource('dynamodb')
survey_table = dynamoDB.Table('surveys')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super().default(obj)

def lambda_handler(event, context):
    
    response = survey_table.scan()
    all_surveys = response['Items']


    return {
        'statusCode': 200,
        'body': json.dumps(all_surveys, cls=DecimalEncoder)
    }
