

# Define schema for magnet_price_v1

    {
		    "volume": [5752400],
		    "open": [28.33765],
		    "low": [27.57476],
		    "high": [28.66463],
		    "close": [27.79271],
		    "adj_close": [11.5773],
		    "date": "2000-01-24T00:00:00.000Z",
		    "stock_id": [2331]
	}
 
# Web View for Price Entry

> http://140.112.48.141:40053/prices/
# Sample Code for httpPost Data to Server(Python)
> PS. Please put price folder beside your python code

    import csv
    import json
    import sys
    import re
    import os
    import requests
    f = open(sys.argv[1],'r')
    
    matchObj =re.match(r'price/s(.*)\.csv',sys.argv[1],re.M|re.I)
    print(matchObj.group(1))
    counter=0
    for row in csv.DictReader(f):
            row['stock_id']=matchObj.group(1)
            url = "http://140.112.48.141:40053/prices"
            if(counter!=-1):
                    print(row)
                    headers = {'Content-Type': 'application/json'}
                    r = requests.post(url, data=json.dumps(row), headers=headers)
            counter=counter+1

