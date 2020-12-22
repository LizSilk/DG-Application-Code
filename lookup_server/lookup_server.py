"""
This script creates a Flask server to look up ICP numbers & inverters
The ICP numbers come from the Electricity Authority's api
The inverter data comes from the Clean Energy Council's list of improved inverters
"""
from flask import Flask, request, render_template, redirect, url_for, make_response
import requests
import openpyxl
import tempfile

app = Flask(__name__)


@app.route('/inverter', methods=['GET', 'POST', 'OPTIONS'])
def lookup_inverter():
    """
    This function receives a get or post request with an inverter model number
    It downloads the most recent list of approved inverters & checks if the inverter is in that list

    :return: Sends a reply to the request
    """

    if request.method == 'OPTIONS':
        return build_preflight_response()

    print(request.values)
    file_request = requests.get(
        "http://www.cleanenergyregulator.gov.au/DocumentAssets/Documents/CEC%20approved%20inverters.xlsx")

    output = tempfile.TemporaryFile()
    output.write(file_request.content)

    inverters = openpyxl.load_workbook(output)
    sheet = inverters['CEC approved inverters']
    for row in range(1, sheet.max_row + 1):
        for column in 'C':
            cell_name = "{}{}".format(column, row)
            if sheet[cell_name].value == request.form['ModelNum']:
                output.close()
                # 1 used to mean true
                response = make_response("1", 200)
                response.headers.add("Access-Control-Allow-Origin", "*")
                return response
    output.close()
    # 0 used to mean false
    response = make_response("0", 400)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/icp', methods=['GET', 'POST', 'OPTIONS'])
def lookup_icp():
    """
    This function receives a get or post request with a ICP number
    it sends a request to the Electricity Authorities ICP api
    it then cuts the address data out from the reply and sends it as a response to the original request

    :return: address data formatted as JSON
    """

    if request.method == 'OPTIONS':
        return build_preflight_response()

    print(request.values)
    icp_request = requests.get("https://emi.azure-api.net/ICPConnectionData/v2/single/?ICP=" + request.form['ICPNum'],
                               headers={'Ocp-Apim-Subscription-Key': 'b995a640a14b469cae8755d23c33256e'})
    print(icp_request.status_code)
    if icp_request.status_code == 200:
        print(icp_request.json()[0]["Address"])
        response = make_response(icp_request.json()[0]["Address"], 200)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
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


if __name__ == '__main__':
    app.run()


def build_preflight_response():
    response = make_response("", 400)
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response
