import json
import boto3 # AWS SDK
from decimal import Decimal # Import Decimal to properly encode/decode numbers

dynamoDB = boto3.resource('dynamodb')
survey_table = dynamoDB.Table('surveys')


# Querying dynamoDB returns numbers as decimal.Decimal objects.
# Trying this data as is results  in - Object of type 'Decimal' is not JSON serializable
# This converts decimal.Decimal types to integer
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super().default(obj)

def lambda_handler(event, context):
    survey_id = int(event['pathParameters']['id']) # parse the 'survey-id' query parameter from the API gateway request

    query_result = survey_table.get_item(
        Key={
            'survey-id': survey_id
        }
    )

   # If the survey doesn't exist, return a 404 error
    if 'Item' not in query_result:
        return {
            'statusCode': 404,
            'body': json.dumps('ERROR! Survey not found.')
        }

    # print(query_result)
    # print(type(query_result))

    # Otherwise return the survey as JSON
    return {
        'statusCode': 200,
        'body': json.dumps(query_result['Item'], cls = DecimalEncoder)
    }