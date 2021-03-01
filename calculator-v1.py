# # pishtazminer BTC price
# miner_weeks = 55
# miner_price = 0.0014616
# week_income = 0.0000812

# # pishtazminer IRT price
# miner_weeks = 55
# miner_price = 450
# week_profit_forcast = 25

# # hamyarminer IRT price
# miner_weeks = 55
# miner_price = 476
# week_profit_forcast = 135

# # hamyarminer IRT price - yearly
# miner_weeks = 55
# miner_price = 500
# week_profit_forcast = 25

# # hamyarminer IRT price - 6 monthly
# miner_weeks = 27
# miner_price = 1500
# week_profit_forcast = 25*5

# hamyarminer IRT price - 6 monthly
miner_weeks = 26
miner_price = 290
week_profit_forcast = 25.5

# # hashing24 USD price - 12 monthly
# miner_weeks = 52
# miner_price = 84.10
# week_profit_forcast = 1.86

start_miners = [miner_weeks]*5*(1+2+3+1)
start_income = - (1+2+3+1)*1500

lost_rate = 1
no_top_up = True
no_step = True
no_miner = True

stop_buy_from = -1
take_rate = 0.25
start_wallet_from = (30*6/7)

wallet = 0
account = 0
total_income = start_income
miners = start_miners

last_miner = 0
changed = True
i=-1

while changed and i<(52*2.5+1):
    changed = False
    i+=1

    print(f"start week #{i} or month #{(i*7/30):2.1f}")
    print(f"- start wallet: {wallet:0.7f}")
    print(f"- start account: {account:0.7f}")
    # print(f"- total_income: {total_income:0.7f}")
    print(f"- week_profit_forcast: {week_profit_forcast:0.4f}")
    print(f"- ")

    available_miner_weeks = sum(miners)
    active_miners = [it for it in miners if it>0]
    dead_miners = [it for it in miners if it<=0]
    print(f"- all miner count: {len(miners)}")
    print(f"- active_miners: {len(active_miners)}")
    print(f"- dead_miners: {len(dead_miners)}")
    print(f"- {available_miner_weeks=}")
    if (not no_miner) and len(active_miners)<50:
        print(f"- miners: {active_miners}")
    print(f"- ")
    
    mine_income = len(active_miners) * week_profit_forcast
    print(f"- mine_income: {mine_income:0.7f}")

    changed = changed or (mine_income>0)
    week_profit_forcast *= lost_rate

    if start_wallet_from<i:
        wallet_plus = mine_income * take_rate
        account_plus = mine_income * (1-take_rate)
        print(f"- add to wallet: {wallet_plus:0.7f}")
    else:
        wallet_plus = 0
        account_plus = mine_income
    
    print(f"- add to account: {account_plus:0.7f}")
    
    wallet += wallet_plus
    account += account_plus
    
    #print(f"- account: {account:0.7f}")
    #print(f"- wallet: {wallet:0.7f}")
    total_income += mine_income
    

    miners = [it if it<=0 else it-1 for it in miners]

    top_up = "" if no_top_up else input("input topup value: ")
    if len(top_up):
        top_up = float(top_up)

        if top_up>0:
            changed = True
            print("- add {top_up:0.7f} to account")
        elif top_up<0:
            changed = True
            print("- take {top_up:0.7f} from account")
        
        account += top_up
        print(f"- account: {account:0.7f}")

    new_miner = int(account // miner_price)
    if (stop_buy_from<0 or stop_buy_from>i) and new_miner > 0:
        print(f"- ")
        changed = True
        print(f"- buy {new_miner=}")
        miners += [miner_weeks] * new_miner
        account -= (new_miner * miner_price)
        print(f"- distant from last perchase: {i-last_miner}")
        last_miner = i

    if (not no_step) and (i>0 and i%10==0):
        input("press to countinue\n")
        
    print()
    print()

    

 

