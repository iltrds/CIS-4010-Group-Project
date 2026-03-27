import json
import boto3

dynamoDB = boto3.resource('dynamodb')
survey_table = dynamoDB.Table('surveys') # We want to submit our data to the surveys table

def generate_survey_id():
    scan_result = survey_table.scan(
        ProjectionExpression='#sid',
        ExpressionAttributeNames={'#sid': 'survey-id'}
    )
    items = scan_result.get('Items', [])
    
    if len(items) == 0:
        return 1
    
    max_id = max(item['survey-id'] for item in items)
    return max_id + 1

def verify_questions(request_questions):

    errors = []
    VALID_ANSWER_TYPES = ["String", "Number"]

    for question, answer_type in request_questions.items():

        if isinstance(question, str) is False or len(question) == 0:
            errors.append("Question keys must be non-empty strings")
        
        if isinstance(answer_type, str):
            if answer_type not in VALID_ANSWER_TYPES:
                errors.append("Answer type for " + question + " must be String or Number")
        elif isinstance(answer_type, list):
            if len(answer_type) == 0:
                errors.append(f'Question "{question}" has an empty options list')

            for option in answer_type:
                    if not isinstance(option, (str, int, float)):
                        errors.append(
                            f'Question "{question}" contains an invalid option: {option}'
                        )
        else:
            errors.append(f'Answer type for "{question}" is not a string or list')  # Fix 1: missing opening quote
        
    if len(errors) > 0:
        return False, errors
    
    else:
        return True, []


def verify_handle_survey(request_body):
    REQUIRED_FIELDS = ["survey-id", "questions", "survey_name"]

    if request_body is None:
        return None, ['Missing Request Body']

    errors = [] # Array to collect all of the potential errors we can identify

    # Do prelimanry checks on the request body to ensure the quiz has all necessary components
    if "survey-id" not in request_body:
        # Auto generate survey ID based on current max survey id + 1
        request_body["survey-id"] = generate_survey_id()

    elif isinstance(request_body["survey-id"], int) is False: # survey-id must be an integer
        errors.append("survey-id must be an integer")
    else:
        request_body["survey-id"] = generate_survey_id

    if "survey_name" not in request_body:
        errors.append("Missing survey_name in request body")
    elif isinstance(request_body["survey_name"], str) is False: #survey_name must be a string
        errors.append("survey_name must be a non-empty string")
    elif len(request_body["survey_name"]) == 0: # survey_name cannot be the empty string
        errors.append("survey_name cannot be an empty string")
    
    if "questions" not in request_body:
        errors.append("Missing questions array in request body")
    elif not isinstance(request_body["questions"], dict) or (len(request_body['questions']) == 0): # The list of questions must be a dictionary, and cannot be empty
        errors.append("Questions must be a non-empty dictionary")
    else:
        is_valid, question_errors = verify_questions(request_body["questions"])            

        errors.extend(question_errors)

        # Check if the number of questions was submitted
        if "num-questions" not in request_body: # If not define the number of questions to the length of the questions dictionary
            request_body["num-questions"] = len(request_body["questions"])
        elif isinstance(request_body["num-questions"], int) is False: # num-questions must be an integer
            errors.append("num-questions must be an integer")
        elif request_body["num-questions"] <= 0: # num-questions must be greater than 0
            errors.append("num-questions must be greater than 0")

    # Check if the survey description was submitted (OPTIONAL FIELD)
    if "survey-description" not in request_body:
        request_body["survey-description"] = "No description provided."
    elif isinstance(request_body["survey-description"], str) is False: # survey_description must be a string
        errors.append("survey-description must be of type string")
    
    if  len(errors) > 0: # If we found errors, we want to report them back to the user
        return None, errors
    else:
        new_survey = {
            "survey-id": request_body["survey-id"],
            "survey_name": request_body["survey_name"],
            "questions": request_body["questions"],
            "survey-description": request_body['survey-description'],
            "num-questions": request_body["num-questions"]
        }
        return new_survey, errors
    


def lambda_handler(event, context):
    # PUT request to submit a new survey given the HTML for it.

    try:
        request_body = event.get('body')
        if request_body is None:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing request body'})
            }

        # If the request body is a string, we want to parse it into JSON
        if isinstance(request_body, str):
            request_body = json.loads(request_body)
        # else:
        #     raise TypeError("Request body must be a string or JSON object")

        new_survey, errors = verify_handle_survey(request_body)

        if len(errors) > 0:
            return {
                'statusCode': 400,
                'body': json.dumps({'errors': errors})
            }
        
        survey_table.put_item(
            Item=new_survey,
            ConditionExpression='attribute_not_exists(#sid)',
            ExpressionAttributeNames={'#sid': 'survey-id'}
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Survey created successfully'})
        }

    except dynamoDB.meta.client.exceptions.ConditionalCheckFailedException:
        return {
            'statusCode': 409,
            'body': json.dumps({'error': 'A survey with that ID already exists'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
