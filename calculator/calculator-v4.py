from io import StringIO
from sources import *
import time

wallet = 0
account = 0
total_income = start_income
miners = start_miners

no_ask_top_up = True
no_ask_step = True
no_print_miner = False
log_duration = 1

last_miner_buy = 0
changed = True
i=-1

output = open(f'logs/log-{miner_name}-{round(time.time())}.txt', 'wt')

print(f"{miner_name=}", file=output)
print(f"{miner_url=}", file=output)
print(f"{miner_life=}", file=output)
print(f"{miner_price=}", file=output)
print(f"{miner_buy_min=}", file=output)
print(f"{miner_profit=}", file=output)
print(f"{miner_unit=}", file=output)
print(f"{price_unit=}", file=output)
print(f"{start_miners=}", file=output)
print(f"{start_income=}", file=output)
print(f"\n\n", file=output)

while changed and i<(365*2+1):
    buffer = StringIO()
    changed = False
    i+=1

    print(f"start day#{i} | week#{(i/7):3.1f} | month#{(i/30):3.1f}", file=buffer)
    print(f"- start wallet: {wallet:0.8f}", file=buffer)
    print(f"- start account: {account:0.8f}", file=buffer)
    # print(f"- total_income: {total_income:0.8f}", file=buffer)
    print(f"- each miner_profit: {miner_profit:0.8f}", file=buffer)
    print(f"- ", file=buffer)

    available_miner_life = sum(miners)
    active_miners = [it for it in miners if it>0]
    dead_miners = [it for it in miners if it<=0]
    print(f"- all miners: {len(miners)} {miner_unit}", file=buffer)
    print(f"- active_miners: {len(active_miners)} {miner_unit}", file=buffer)
    print(f"- dead_miners: {len(dead_miners)} {miner_unit}", file=buffer)
    print(f"- {available_miner_life=} {miner_unit}", file=buffer)
    if (not no_print_miner) and len(active_miners)<50:
        print(f"- miners: {active_miners}", file=buffer)
    print(f"- ", file=buffer)
    
    mine_income = len(active_miners) * miner_profit
    print(f"- mine_income: {mine_income:0.8f}", file=buffer)

    changed = changed or (mine_income>0)
    miner_profit *= miner_profit_lost_rate

    if take_profit_from_day<i:
        wallet_plus = mine_income * take_profit_rate
        account_plus = mine_income * (1-take_profit_rate)
    else:
        wallet_plus = 0
        account_plus = mine_income
    
    print(f"- add to wallet: {wallet_plus:0.8f}", file=buffer)
    print(f"- add to account: {account_plus:0.8f}", file=buffer)
   
    wallet += wallet_plus
    account += account_plus
    total_income += mine_income
    print(f"- wallet: {wallet:0.8f}", file=buffer)
    print(f"- account: {account:0.8f}", file=buffer)
    

    miners = [it if it<=0 else it-1 for it in miners]

    top_up = "" if no_ask_top_up else input(f"input topup value day#{i}: ")
    if len(top_up):
        top_up = float(top_up)

        if top_up>0:
            changed = True
            print("- add {top_up:0.8f} to account", file=buffer)
        elif top_up<0:
            changed = True
            print("- take {top_up:0.8f} from account", file=buffer)
        
        account += top_up
        print(f"- account: {account:0.8f}", file=buffer)

    new_miner = int(account // miner_price)
    if (stop_buy_from_day<0 or stop_buy_from_day>i) and new_miner > 0:
        print(f"- ", file=buffer)
        changed = True
        print(f"- buy {new_miner=} {miner_unit}", file=buffer)
        miners += [miner_life] * new_miner
        account -= (new_miner * miner_price)
        print(f"- distant from last perchase: {i-last_miner_buy}", file=buffer)
        last_miner_buy = i

    if (not no_ask_step) and (i>0 and i%10==0):
        input("press to countinue\n")
        
    print("", file=buffer)
    print("", file=buffer)

    if i%30 == 0 :
        print("", file=buffer)
        print("", file=buffer)

    if i%log_duration == 0:
        print(buffer.getvalue(), file=output)
    

print(f"at last active miners:\n{active_miners}", file=output)

output.close()

