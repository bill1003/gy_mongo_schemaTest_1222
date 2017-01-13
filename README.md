

# Schema for magnet_price_v1

    
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

#Data Source(Han)
<#price/s2330.csv>

    > date,adj_close,close,high,low,open,volume
    > 2000-01-04,29.618,83.0813,83.0813,81.6811,83.0813,149083800
    > 2000-01-05,30.2836,84.9482,84.9482,82.1478,83.0813,299016300
    > 2000-01-06,29.618,83.0813,84.9482,83.0813,84.4815,146768300
    > 2000-01-07,28.7861,80.7476,81.6811,79.3474,80.2809,174796200
    > 2000-01-10,29.7844,83.54799999999999,84.0148,81.6811,83.0813,205184200
    > 2000-01-11,29.2852,82.1478,85.415,81.6811,84.4815,206371300
    > 2000-01-12,30.1172,84.4815,84.4815,82.1478,82.6146,160662500

 
# Web View for Price Entry

> http://140.112.48.141:40053/prices/


# Sample Code to http Post Data to Server (Python)

<#Please put price folder beside your python code>

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
#Query Stock object from partial schema filed

    Ex1. 
    If you want to get match result for stock_id = 2330 
    you just need to access url  
	

http://140.112.48.141:40053/prices/findPrice?stock_id=2331
    
    Ex2. 
    If you want to get match result for stock_id = 2330 & volume = 5752400
    you just need to access url  
	

http://140.112.48.141:40053/prices/findPrice?stock_id=2331&volume=5752400

