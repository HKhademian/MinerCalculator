import json
import os, sys
from typing import List

def _from_list(json_data, parser):
	return [parser(it) for it in json_data]


class Person:
	def __init__(self,
		id :str,
		name:str,
		saving_wallet:float=0.0,
		working_wallet:float=0.0,
		state_total_topup: float=0.0,
		state_total_dispose: float=0.0,
		state_total_income: float=0.0,
		state_total_miner: float=0.0,
	):
		self.id = id
		self.name = name
		self.saving_wallet = saving_wallet
		self.working_wallet = working_wallet
		self.state_total_topup = state_total_topup
		self.state_total_dispose = state_total_dispose
		self.state_total_income = state_total_income
		self.state_total_miner = state_total_miner
	
	def from_json(json_data):
		return Person(
			id=json_data['id'],
			name=json_data['name'],
			saving_wallet=json_data['saving_wallet'],
			working_wallet=json_data['working_wallet'],
			state_total_topup=json_data['state_total_topup'],
			state_total_dispose=json_data['state_total_dispose'],
			state_total_income=json_data['state_total_income'],
			state_total_miner=json_data['state_total_miner'],
		)

class Miner:
	def __init__(self,
		power: float,
		life: int,
		buy_company: str,
		buy_factor_id: str,
		buy_price: str,
		buy_start_date: int,
		buy_end_date: int,
		buy_all_life: int,
		owners: dict,
	):
		self.power = power
		self.life = life
		self.buy_company = buy_company
		self.buy_factor_id = buy_factor_id
		self.buy_price = buy_price
		self.buy_start_date = buy_start_date
		self.buy_end_date = buy_end_date
		self.buy_all_life = buy_all_life
		self.owners = owners
	
	def from_json(json_data):
		return Miner(
			power=json_data['power'],
			life=json_data['life'],
			buy_company =json_data['buy_company'],
			buy_factor_id =json_data['buy_factor_id'],
			buy_price =json_data['buy_price'],
			buy_start_date =json_data['buy_start_date'],
			buy_end_date =json_data['buy_end_date'],
			buy_all_life =json_data['buy_all_life'],
			owners =json_data['owners'],
		)

class Calculator:
	def __init__(self, miners : List[Miner] = [], persons : List[Miner] = []):
		self.miners = miners
		self.persons = persons
	
	def from_json(json_data):
		return Calculator(
			miners=_from_list(json_data['miners'], Miner.from_json),
			persons=_from_list(json_data['persons'], Person.from_json),
		)

