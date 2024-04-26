import json
import boto3
from datetime import datetime

dynamodb = boto3.client('dynamodb')
s3 = boto3.client('s3')

TABLE_NAME = 'UserData'
S3_BUCKET = 'backupbucket-csci5409-b00929073'

def lambda_handler(event, context):
    try:
        response = dynamodb.scan(
            TableName=TABLE_NAME
        )
        items = response['Items']

        # Prepare data for upload to S3
        timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        s3_key = f'dynamodb-UserData-export-{timestamp}.json'
        data = json.dumps(items)

        # Upload data to S3
        s3.put_object(
            Bucket=S3_BUCKET,
            Key=s3_key,
            Body=data
        )

        print(f'Data exported to S3: s3://{S3_BUCKET}/{s3_key}')
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': 'Data exported to S3'
        }
    except Exception as e:
        print('Error exporting data:', e)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': 'Error exporting data'
        }
