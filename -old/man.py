from lib import *

# calc  = Calculator()

pers = Person(
	id="h", name="Hossain"
)
print(pers)
print()

# calc.persons.append(pers)


pers_str = json.dumps(pers, default=lambda obj: obj.__dict__)
print(pers_str)
print()

pers_obj = json.loads(pers_str)
print(pers_obj)
print()

pers = Person.from_json(pers_obj)
print(pers)
print()




pers_str = json.dumps(pers, default=lambda obj: obj.__dict__)
print(pers_str)
print()

pers_obj = json.loads(pers_str)
print(pers_obj)
print()

pers = Person.from_json(pers_obj)
print(pers)
