import boto3
envid=['e-ddeaaem7pm'] #id of the ebs environment
client = boto3.client('elasticbeanstalk')
def handler(event, context):
    try:
         for appid in range(len(envid)):
             response = client.rebuild_environment(EnvironmentId=str(envid[appid].strip()))
             if response:
                 print('Restore environment %s' %str(envid[appid]))
             else:
                 print('Failed to Restore environment %s' %str(envid[appid]))

    except Exception as e:
        print(e)