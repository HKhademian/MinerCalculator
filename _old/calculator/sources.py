# hamyarminer IRT price - daily - 6Moth
miner_name = 'hamyarminer'
miner_url = 'https://hamyarminer.org/'
miner_life = 30*6
miner_price = 1500
miner_buy_min = 1
miner_profit = 20.322
miner_unit = '*(5 TH/s)'
price_unit = 'IRT'
start_miners = [miner_life]*7
start_income = - (miner_price)*7

# # pishtazminer IRT price - daily - 12Month
# miner_name = 'pishtazminer'
# miner_url = 'https://pishtazminer.com/'
# miner_life = 365
# miner_price = 450
# miner_buy_min = 1
# miner_profit = 3.706
# miner_unit = 'TH/s'
# price_unit = 'IRT'
# start_miners = [miner_life]*4*(5)
# start_income = - (450)*4*5

miner_profit_lost_rate = 0.9999

stop_buy_from_day = -1
take_profit_rate = 0.25
take_profit_from_day = (30*6)
