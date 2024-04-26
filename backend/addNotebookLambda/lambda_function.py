import uuid
import boto3

dynamodb = boto3.client('dynamodb', region_name='us-east-1')
TABLE_NAME = 'UserData'

def lambda_handler(event, context):
    email = event['email']
    notebook_name = event['notebook_name']
    notebook_content = event['notebook_content']

    if email in [None, ''] or notebook_name in [None, ''] or notebook_content==None:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': {'message': 'Email, notebook name, and content are required in the request body'}
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
        
    # Generate a unique notebook_id
    notebook_id = str(uuid.uuid4())

    # Update the user's notebooks list in the DynamoDB table
    dynamodb.update_item(
        TableName=TABLE_NAME,
        Key={'email': {'S': email}},
        UpdateExpression='SET notebooks = list_append(notebooks, :new_notebook_entry)',
        ExpressionAttributeValues={
            ':new_notebook_entry': {
                'L': [
                    {
                        'M': {
                            'notebook_id': {'S': notebook_id},
                            'notebook_name': {'S': notebook_name},
                            'notebook_content': {'S': notebook_content}
                        }
                    }
                ]
            }
        }
    )

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS, POST'
        },
        'body': {'message': 'Notebook entry added successfully'}
    }
