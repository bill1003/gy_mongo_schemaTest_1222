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
		jsonFile = open ('file.json','w')
		jsonObject=json.dump(row,jsonFile)
		r = requests.post(url, data=row)
		#jsonFile.write('\n')
		print(row)
		#requests.post(url, data="file.json")
		#cmd="curl -H \"Content-Type: application/json\" --data @file.json http://140.112.48.141:40053/prices" 
		#cmd="curl -H \"Content-Type: application/json\" -d @file.json http://140.112.48.141:40053/prices" 
		#print(cmd)
		#os.system(cmd)
		#os.system("rm file.json")
	counter=counter+1
#cmd4="sed -i s#{#{@stock_id@:@" +matchObj.group(1)+ "@,# file.json"
#cmd5="sed -i 's#@#\"#g' file.json"
#print(cmd4)
#os.system(cmd4)
#os.system(cmd5)

