import boto3

dynamodb = boto3.client('dynamodb', region_name='us-east-1')
TABLE_NAME = 'UserData'

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
                'body': {'message': 'Email and password are required in the request body'}
            }

        existing_user = dynamodb.get_item(
            TableName=TABLE_NAME,
            Key={'email': {'S': email}}
        )

        if 'Item' in existing_user:
            stored_password = existing_user['Item']['password']['S']
            if stored_password == password:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'OPTIONS, POST'
                    },
                    'body': {'message': 'Login successful', 'email': email}
                }
            else:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'OPTIONS, POST'
                    },
                    'body': {'message': 'Incorrect password'}
                }
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': {'message': 'Email not found'}
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
            'body': {'message': 'An error occurred'}
        }
