"""
Script used to test lookup-server.py since I apparently never actually committed my test suite
"""
import requests
import json
import random
import string

# # r = requests.post('http://127.0.0.1:5000/inverter', data={'ModelNum':'PVS-100-TL'})
# #r = requests.post('http://127.0.0.1:5000/icp', data={'ICPNum': '18984CP2DD'})
# print(r.text)
# request_json = r.json()
# print(json.dumps(request_json, indent=4, sort_keys=True))
# addr_num = request_json[0]["Address"]["PhysicalAddressNumber"]
# addr_street = request_json[0]["Address"]["PhysicalAddressStreet"]
# sub = request_json[0]["Address"]["PhysicalAddressSuburb"]
# town = request_json[0]["Address"]["PhysicalAddressTown"]
# region = request_json[0]["Address"]["PhysicalAddressRegion"]
# postcode = request_json[0]["Address"]["PhysicalAddressPostCode"]

#url = "https://www.cleanenergycouncil.org.au/api/manufacturers/inverter.json?" + "model=pv360"
#r = requests.get(url, verify=False)


url = "https://emi.azure-api.net/ICPConnectionData/v2/single/?ICP=0082738402PC806"
r = requests.get(url, headers={'Ocp-Apim-Subscription-Key': 'ec356fec7d13442094eb8cf7f9c1b20d'})
request_json = r.json()
print(json.dumps(request_json, indent=4, sort_keys=True))