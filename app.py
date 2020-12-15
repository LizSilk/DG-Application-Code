from flask import Flask, request, render_template, Response
import requests
import openpyxl
import os

app = Flask(__name__)


@app.route('/inverter', methods=['GET', 'POST'])
def lookup_inverter():
    print(request.values)
    file_request = requests.get(
        "http://www.cleanenergyregulator.gov.au/DocumentAssets/Documents/CEC%20approved%20inverters.xlsx")

    output = open('CEC approved inverters.xlsx', 'wb')
    output.write(file_request.content)
    output.close()

    inverters = openpyxl.load_workbook('CEC approved inverters.xlsx')
    sheet = inverters['CEC approved inverters']
    for row in range(1, sheet.max_row + 1):
        for column in 'C':
            cell_name = "{}{}".format(column, row)
            if sheet[cell_name].value == request.form['ModelNum']:
                os.remove("CEC approved inverters.xlsx")
                return ('1')
    os.remove("CEC approved inverters.xlsx")
    return "0"


@app.route('/icp', methods=['GET', 'POST'])
def lookup_icp():
    print(request.values)
    icp_request = requests.get("https://emi.azure-api.net/ICPConnectionData/v2/single/?ICP=" + request.form['ICPNum'],
                               headers={'Ocp-Apim-Subscription-Key': 'b995a640a14b469cae8755d23c33256e'})
    print(icp_request.status_code)
    if icp_request.status_code == 200:
        return icp_request.json()[0]["Address"]
    else:
        return Response("Bad ICP", status=400)

@app.route('/test')
def test_env():
    return render_template("test-page.html")


if __name__ == '__main__':
    app.run()
