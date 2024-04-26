import boto3
import json
import os

sns = boto3.client('sns')

dynamodb = boto3.client('dynamodb', region_name='us-east-1')
TABLE_NAME = 'UserData'
topicARN = os.environ.get('USER_SUBSCRIBE_TOPIC_ARN')

def lambda_handler(event, context):
    try:
        email = event['email']
        notebook_id = event['notebook_id']

        if not email or not notebook_id:
            print("Please provide a proper email and notebook_id value")
            return {
                'statusCode': 422,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': {'error': "Please provide a proper email and notebook_id value"}
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

        # Search for the notebook with the provided notebook_id
        matching_notebook = None
        for notebook in notebooks:
            if notebook['M']['notebook_id']['S'] == notebook_id:
                matching_notebook = notebook
                break
        
        if not matching_notebook:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': {'message': 'Notebook with the provided ID does not exist for the user'}
            }

        # Prepare message content
        notebook_name = matching_notebook['M']['notebook_name']['S']
        notebook_content = matching_notebook['M']['notebook_content']['S']
        message = f"Notebook Name: {notebook_name}\n\nNotebook Content:\n{notebook_content}"

        # Publish message to SNS with message attributes for individual user
        response = sns.publish(
            TopicArn=topicARN, 
            Message=message,
            Subject='Notebook Details',
            MessageAttributes={
                'email': {
                    'DataType': 'String',
                    'StringValue': email
                }
            }
        )

        print('Notebook details sent successfully:', response)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': 'Notebook details sent successfully'
        }
    except Exception as e:
        print('Error sending notebook details:', e)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': 'Error sending notebook details'
        }
