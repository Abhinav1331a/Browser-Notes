import uuid
import boto3

dynamodb = boto3.client('dynamodb', region_name='us-east-1')
TABLE_NAME = 'UserData'

def lambda_handler(event, context):
    email = event['email']
    notebook_id = event['notebook_id']

    if email in [None, ''] or notebook_id in [None, '']:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, DELETE'
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
                'Access-Control-Allow-Methods': 'OPTIONS, DELETE'
            },
            'body': {'message': 'User with the provided email does not exist'}
        }

    # Extracting notebooks from the response
    notebooks = existing_user['Item']['notebooks']['L']
    
    # Filtering out the notebook with the given notebook_id
    updated_notebooks = [notebook for notebook in notebooks if notebook['M']['notebook_id']['S'] != notebook_id]
    
    # Updating DynamoDB item with the filtered notebooks
    dynamodb.update_item(
        TableName=TABLE_NAME,
        Key={
            'email': {'S': email}
        },
        UpdateExpression='SET notebooks = :val',
        ExpressionAttributeValues={
            ':val': {'L': updated_notebooks}
        }
    )
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS, DELETE'
        },
        'body': 'Notebook deleted successfully'
    }
