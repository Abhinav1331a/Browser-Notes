import json
import os
import boto3

sns = boto3.client('sns')
topic_arn = os.environ.get('USER_SUBSCRIBE_TOPIC_ARN')

def lambda_handler(event, context):
    try:
        email = event['email']

        if not email:
            print("Please provide a proper email value")
            return {
                'statusCode': 422,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': {'error': "Please provide a proper email value"}
            }

        subscribe_params = {
            'Protocol': 'email',
            'TopicArn': topic_arn,
            'Endpoint': email,
            'Attributes': {
                'FilterPolicy': json.dumps({"email": [email, "banana"]})
            }
        }

        response = sns.subscribe(**subscribe_params)
        print('User subscribed successfully:', response)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': 'User subscribed successfully'
        }
    except Exception as e:
        print('Error subscribing user:', e)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': 'Error subscribing user'
        }
