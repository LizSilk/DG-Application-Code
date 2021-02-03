import requests
import openpyxl
import tempfile
from datetime import date, datetime
import json


def lambda_handler(event, context):
    """
    This function receives a get or post request with an inverter model number
    It downloads the most recent list of approved inverters & checks if the inverter is in that list

    :return: Sends a reply to the request
    """

    try:
        # Download list of improved inverters from CEC's website
        file_request = requests.get(
            "http://www.cleanenergyregulator.gov.au/DocumentAssets/Documents/CEC%20approved%20inverters.xlsx")
    except:
        print("Lookup failed, couldn't connect to CEC site")
        return {
            "statusCode": 404,
            'body': "Couldn't connect"
        }

    print("file downloaded")
    # Put the information in a temporary file
    output = tempfile.TemporaryFile()
    output.write(file_request.content)
    print("written to tempfile")
    # open file as spreadsheet
    inverters = openpyxl.load_workbook(output)
    print("loaded as spreadsheet")
    # find the model column
    sheet = inverters['CEC approved inverters']
    for row in range(1, sheet.max_row + 1):
        for column in 'C':
            # read the cell name
            cell_name = "{}{}".format(column, row)
            # check if cell name is equal to the model number
            if sheet[cell_name].value == event['queryStringParameters']['ModelNum']:
                manufacturer_name_cell_name = "{}{}".format('A', row)
                manufacturer_name = sheet[manufacturer_name_cell_name].value
                date_cell_name = "{}{}".format('F', row)
                expiry_date = sheet[date_cell_name].value.date()
                if expiry_date <= date.today():
                    # close the file
                    output.close()
                    # send response
                    print('Response returned with code 400 (failure) - inverter expired')
                    return {
                        "statusCode": 503,
                        'body': "Inverter Expired"
                    }
                # close the file
                output.close()
                # send response
                print('Response returned with code 200 (success)')
                return {
                    "statusCode": 200,
                    'body': str(manufacturer_name)
                }
    # close the file
    output.close()
    # send response - 0 used to mean false
    print('Response returned with code 400 (failure)')
    return {
        "statusCode": 400,
        'body': "Lookup failed"
    }