import json
import requests

def lambda_handler(event,context):
    """
    This function receives a get or post request with a ICP number
    it sends a request to the Electricity Authorities ICP API
    it then cuts the address data out from the reply and sends it as a response to the original request

    :return: address data formatted as JSON
    """


    try:
        # Send request to Electricity Authority ICP API
        icp_request = requests.get(
            "https://emi.azure-api.net/ICPConnectionData/v2/single/?ICP=" + event['queryStringParameters']['ICPNum'],
            headers={'Ocp-Apim-Subscription-Key': 'ec356fec7d13442094eb8cf7f9c1b20d'})
    except:
        return {"body": "Couldn't connect",
                "statusCode" : 404
        }
    print("API request returned with code " + str(icp_request.status_code))

    # If the API returned usable data
    if icp_request.status_code == 200:
        print("request code 200")
        if icp_request.json()[0]["Network"]["NetworkParticipantID"] == "POCO":
            response_content = {"Address": icp_request.json()[0]["Address"],
                                "Trader": icp_request.json()[0]["Trader"]["TraderParticipantName"]}
            print("replying on our network", response_content)
            return {
                "statusCode": 200,
                'body' : json.dumps(response_content)
            }
        #ICP not on Powerco's network
        elif icp_request.json()[0]["Network"]["NetworkParticipantID"] != "POCO":
            print("ICP not on Powerco's Network")
            return {
                "statusCode": 503,
                'body': "ICP not on Powerco's Network"
            }
    # If the API did not return usable data
    elif icp_request.status_code == 429 or icp_request.status_code == 503 or icp_request.status_code == 404:
        print("Lookup failed, couldn't connect to api")
        return {
            'statusCode' : 404,
            'body': "Couldn't connect"
        }
    else:
        print("Lookup failed, response returned with code 400")
        return {
            'statusCode' : 400,
            'body': "Bad ICP"
        }
