
import mysql.connector
import credentials
import json

mydb = mysql.connector.connect(
    host='localhost',
    user=credentials.sql_user,
    password=credentials.sql_password,
    database="ildsdb"
)
cursor = mydb.cursor()

cursor.execute("SELECT * FROM Anatomic_site ORDER BY Anatomic_id ASC;")

out = []

for x in cursor:
    print(x)
    row = {
        "id": x[0],
        "name": x[1],
        "level": x[2]
    }
    out.append(row)

with (open ("all_sites.json", "w") as of):
    of.write(json.dumps(out))
    of.close()

# mydb.commit()