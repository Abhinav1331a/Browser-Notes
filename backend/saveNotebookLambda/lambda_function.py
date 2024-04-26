import uuid
import boto3

dynamodb = boto3.client('dynamodb', region_name='us-east-1')
TABLE_NAME = 'UserData'

def lambda_handler(event, context):
    try:
        email = event['email']
        notebook_id = event.get('notebook_id')
        notebook_name = event.get('notebook_name')
        notebook_content = event.get('notebook_content')

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
            
        # Get notebooks array from the existing user
        notebooks = existing_user['Item'].get('notebooks', {'L': []})['L']

        # If notebook_id is provided, update the existing notebook
        if notebook_id:
            for notebook in notebooks:
                if notebook['M']['notebook_id']['S'] == notebook_id:
                    notebook['M']['notebook_name']['S'] = notebook_name or "New Untitled Notebook"
                    notebook['M']['notebook_content']['S'] = notebook_content or ""
                    break
        
            dynamodb.update_item(
                TableName=TABLE_NAME,
                Key={'email': {'S': email}},
                UpdateExpression='SET notebooks = :val',
                ExpressionAttributeValues={':val': {'L': notebooks}}
            )
        else:
            # If notebook_id is not provided, create a new notebook
            # Generate a unique notebook_id
            notebook_id = str(uuid.uuid4())

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
                                    'notebook_name': {'S': notebook_name or "New Untitled Notebook"},
                                    'notebook_content': {'S': notebook_content or ""}
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
            'body': {'message': 'Notebook details updated successfully', "notebook_id": notebook_id}
        }
    except Exception as e:
        print('Error updating notebook details:', e)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': {'message': 'Error updating notebook details'}
        }
