import requests
import numpy as np
import pandas as pd
import datetime

pd.set_option('display.max_rows',20)
api_base_string = 'https://iss.moex.com/iss/'

# function to clean datestamp: take date from micex and add 18:45 minutes to make a proper datetime

def adjust_timestamp(datetimestamp):
  _g = datetimestamp
  return datetime.datetime(_g.year,_g.month,_g.day,18,30)

api_add_on = 'engines/futures/markets/forts/securities'
api_request = api_base_string + api_add_on + '.json' 

r = requests.get(api_request)

b_asset = pd.DataFrame.from_records(r.json()['securities']['data'], columns = r.json()['securities']['columns'], index = 'SECID')

#clean datetine columns
b_asset['LASTTRADEDATE'],b_asset['LASTDELDATE'] = pd.to_datetime(b_asset['LASTTRADEDATE']),pd.to_datetime(b_asset['LASTDELDATE'])
b_asset['FIRSTTRADEDATE'] = pd.to_datetime(b_asset['FIRSTTRADEDATE'])
b_asset['LASTTRADEDATE'] = b_asset['LASTTRADEDATE'].apply(adjust_timestamp)
b_asset['LASTDELDATE'] = b_asset['LASTDELDATE'].apply(adjust_timestamp)
b_asset['LASTDELDATE'] = b_asset['LASTDELDATE'].apply(adjust_timestamp)
b_asset['FIRSTTRADEDATE'] = b_asset['FIRSTTRADEDATE'].apply(adjust_timestamp)

# get instrument list

tickers = b_asset.ASSETCODE.unique()
tickers

# get price for FILTER
FILTER="RTS"
b_filtered = b_asset[b_asset['ASSETCODE'] == FILTER]
if b_filtered.shape[0] == 0:
  pass # error in filter, no records returned

today = datetime.date.today()
# get ticket with minimum date to ex
nearest_ticket=b_filtered['LASTTRADEDATE'].apply(lambda g: (g.date() - today).days).idxmin()

# Get underlying asset last price

api_add_on = 'engines/futures/markets/forts/securities/' + nearest_ticket
api_request = api_base_string + api_add_on + '.json' 
r = requests.get(api_request)
b = pd.DataFrame.from_records(r.json()['marketdata']['data'], columns = r.json()['marketdata']['columns'], index = 'SECID')
asset_price = int(b['LAST'])

# Get options quotes on that asset

api_add_on = 'engines/futures/markets/options/securities'
api_request = api_base_string + api_add_on + '.json' 

#r = requests.get(api_request)

b_opt = pd.DataFrame.from_records(r.json()['securities']['data'],
         columns = r.json()['securities']['columns'], index = 'SECID')
b_opt = b_opt[b_opt['ASSETCODE'] == FILTER]

b_opt_prices = pd.DataFrame.from_records(r.json()['marketdata']['data'],
         columns = r.json()['marketdata']['columns'], index = 'SECID')


b_opt = b_opt.join(b_opt_prices['LAST'], how = 'inner')


# parse option strike from SECID: 
# https://www.moex.com/s205
# first 2 char - asset code, then till "B" strike

b_opt['_STRIKE'] = b_opt['LATNAME'].apply(lambda g: int(g[2:g.find("B",2)]))


# clean datetime columns


b_opt['LASTTRADEDATE'],b_opt['LASTDELDATE'] = pd.to_datetime(b_opt['LASTTRADEDATE']),pd.to_datetime(b_opt['LASTDELDATE'])
b_opt['LASTTRADEDATE'] = b_opt['LASTTRADEDATE'].apply(adjust_timestamp)
b_opt['LASTDELDATE'] = b_opt['LASTDELDATE'].apply(adjust_timestamp)


# create option type - next char after strikexxxxxx+'B' margin option

call_definition = list('ABCDEFGHIJKL')
put_definiiton = list('MNOPQRSTUVWX')

index_values = b_opt.index.tolist()
b_opt['_OPT_TYPE'] = ['Call' if element[element.find("B",2)+1:element.find("B",2)+2] in call_definition else 'Put' for element in index_values]


# get N strikes above and below current asset price

N=2

strike_list = b_opt.sort_values(by = ['_STRIKE'])._STRIKE.unique().tolist()

if  strike_list[0]<asset_price<strike_list[-1]: #sanity check that asset price is within limits
  for x in range(0,len(strike_list)):
    if  strike_list[x]<asset_price<strike_list[x+1]:
      # now X points to index with  cental lowest strike in strike list
      break
else:
  print ('broke down')
  pass # need to raise exception

strike_step = strike_list[x+1] - strike_list[x]

# find which strike is closer to asset price and get N above and below that

if asset_price % strike_list[x] <=1250: #means closer to lowest strike
  central_strike = strike_list[x]
  N_strike_list = strike_list[x-N-1:x+N+1]
else:
  central_strike= strike_list[x+1]
  N_strike_list = strike_list[x+1-N: x+1+N+1]

# TODO  Check for N always be < len(strike_list)
b_opt_filtered = b_opt[b_opt['_STRIKE'].isin(N_strike_list)] 


# get option quotes for N_strike_list
b_opt_filtered[b_opt_filtered['_OPT_TYPE'] == 'Call'].sort_values(by = ['LASTTRADEDATE'])









