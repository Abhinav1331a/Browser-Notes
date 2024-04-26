import uuid
import boto3

dynamodb = boto3.client('dynamodb', region_name='us-east-1')
TABLE_NAME = 'UserData'

def lambda_handler(event, context):
    try:
        email = event['email']

        if email in [None, '']:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': {'message': 'Email is required in the request body'}
            }

        existing_user = dynamodb.get_item(
            TableName=TABLE_NAME,
            Key={'email': {'S': email}}
        )

        if 'Item' not in existing_user:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': {'message': 'User with the provided email does not exist'}
            }
            
        # return notebooks array from the existing user
        notebooks = existing_user['Item']['notebooks']['L']    

        regular_notebooks = []
        for notebook in notebooks:
            notebook_entry = {}
            for key, value in notebook['M'].items():
                notebook_entry[key] = value[list(value.keys())[0]]
            regular_notebooks.append(notebook_entry)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': {'message': 'Notebook entries retrieved successfully', 'notebooks': regular_notebooks}
        }
    except Exception as e:
        print('Error retrieving notebook entries:', e)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': {'message': 'Error retrieving notebook entries'}
        }
