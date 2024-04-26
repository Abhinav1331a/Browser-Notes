import json
import boto3

dynamodb = boto3.client('dynamodb', region_name='us-east-1')
table_name = 'UserData'

def lambda_handler(event, context):
    try:
        email = event['email']
        password = event['password']

        if not email or not password:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': json.dumps({'message': 'Email and password are required in the request body'})
            }

        existing_user = dynamodb.get_item(
            TableName=table_name,
            Key={'email': {'S': email}}
        )

        if 'Item' in existing_user:
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': json.dumps({'message': 'The DB already contains this email address'})
            }

        dynamodb.put_item(
            TableName=table_name,
            Item={'email': {'S': email}, 'password': {'S': password}, 'notebooks': {'L': []}}
        )

        return {
            'statusCode': 201,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'email': email})
        }
    except Exception as e:
        print("Error:", e)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'message': 'An error occurred'})
        }
