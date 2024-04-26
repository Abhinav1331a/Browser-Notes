import uuid
import boto3

dynamodb = boto3.client('dynamodb', region_name='us-east-1')
TABLE_NAME = 'UserData'

def lambda_handler(event, context):
    try:
        email = event['email']
        notebook_id = event['notebook_id']

        if email in [None, ''] or notebook_id in [None, '']:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': {'message': 'Email and notebook ID are required in the request body'}
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
            
        # Return notebooks array from the existing user
        notebooks = existing_user['Item']['notebooks']['L']    

        # Search for the notebook with the provided notebook_id
        matching_notebook = None
        for notebook in notebooks:
            if notebook['M']['notebook_id']['S'] == notebook_id:
                matching_notebook = notebook
                break
        
        if matching_notebook:
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': {'notebook': matching_notebook['M']}
            }
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': {'message': 'Notebook with the provided ID does not exist for the user'}
            }
    except Exception as e:
        print('Error retrieving notebook:', e)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': {'message': 'Error retrieving notebook'}
        }
