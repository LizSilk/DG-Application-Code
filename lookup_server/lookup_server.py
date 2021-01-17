"""
This script creates a Flask server to look up ICP numbers & inverters
The ICP numbers come from the Electricity Authority's api
The inverter data comes from the Clean Energy Council's list of improved inverters

"""
from flask import Flask, request, render_template, redirect, url_for, make_response
import requests
import openpyxl
import tempfile

# create flask object
app = Flask(__name__)


@app.route('/inverter', methods=['GET', 'POST', 'OPTIONS'])
def lookup_inverter():
    """
    This function receives a get or post request with an inverter model number
    It downloads the most recent list of approved inverters & checks if the inverter is in that list

    :return: Sends a reply to the request
    """

    # Deal with preflight requests
    if request.method == 'OPTIONS':
        print("Preflight request received for inverter lookup")
        return build_preflight_response()

    try:
        # Download list of improved inverters from CEC's website
        file_request = requests.get(
        "http://www.cleanenergyregulator.gov.au/DocumentAssets/Documents/CEC%20approved%20inverters.xlsx")
    except:
        print("Lookup failed, couldn't connect to CEC site")
        response = make_response("Couldn't connect", 404)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    # Put the information in a temporary file
    output = tempfile.TemporaryFile()
    output.write(file_request.content)

    # open file as spreadsheet
    inverters = openpyxl.load_workbook(output)
    # find the model column
    sheet = inverters['CEC approved inverters']
    for row in range(1, sheet.max_row + 1):
        for column in 'C':
            # read the cell name
            cell_name = "{}{}".format(column, row)
            # check if cell name is equal to the model number
            if sheet[cell_name].value == request.form['ModelNum']:
                # close the file
                output.close()
                # send response - 1 used to mean true
                response = make_response("1", 200)
                response.headers.add("Access-Control-Allow-Origin", "*")
                print('Response returned with code 200 (success)')
                return response
    # close the file
    output.close()
    # send response - 0 used to mean false
    response = make_response("0", 400)
    response.headers.add("Access-Control-Allow-Origin", "*")
    print('Response returned with code 400 (failure)')
    return response


def build_preflight_response():
    """
        This method is called if the request method is options
        This is because most browsers use CORS to prevent cross site scripting
        This means that when a complex http request is sent, the browser sends an inital request to find out the access
        control settings

        This method puts together a response that tells the browser that yes, this is actually fine
    """
    response = make_response("", 400)
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response


@app.route('/icp', methods=['GET', 'POST', 'OPTIONS'])
def lookup_icp():
    """
    This function receives a get or post request with a ICP number
    it sends a request to the Electricity Authorities ICP API
    it then cuts the address data out from the reply and sends it as a response to the original request

    :return: address data formatted as JSON
    """

    # Deal with preflight requests
    if request.method == 'OPTIONS':
        print("Preflight request received for ICP lookup")
        return build_preflight_response()

    try:
        # Send request to Electricity Authority ICP API
        icp_request = requests.get(
            "https://emi.azure-api.net/ICPConnectionData/v2/single/?ICP=" + request.form['ICPNum'],
            headers={'Ocp-Apim-Subscription-Key': 'b995a640a14b469cae8755d23c33256e'})
    except:
        print("Lookup failed, couldn't connect to api")
        response = make_response("Couldn't connect", 404)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    print("API request returned with code " + str(icp_request.status_code))

    # If the API returned usable data
    if icp_request.status_code == 200:
        print("Response sent with value " + str(icp_request.json()[0]["Address"]))
        response = make_response(icp_request.json()[0]["Address"], 200)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    # If the API did not return usable data
    elif icp_request.status_code == 429 or icp_request.status_code == 503:
        print("Lookup failed, couldn't connect to api")
        response = make_response("Couldn't connect", 404)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        print("Lookup failed, response returned with code 400")
        response = make_response("Bad ICP", 400)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response


@app.route('/test')
def test_env():
    """
    used to provide a webpage to test on
    :return:
    """
    return render_template("test-page.html")


@app.route('/')
def index():
    return redirect(url_for('test_env'))


# run the flask app
if __name__ == '__main__':
    app.run()
