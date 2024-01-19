from anatomic_site import AnatomyMap
import mysql.connector
import credentials

mydb = mysql.connector.connect(
    host='localhost',
    user=credentials.sql_user,
    password=credentials.sql_password,
    database="ildsdb"
)

cursor = mydb.cursor()

amap = AnatomyMap()

for site in amap.anatomic_sites:
    query = f"INSERT IGNORE INTO Anatomic_Site (anatomic_id, anatomic_site, as_level, parent) VALUES " \
            + f"({site['index']}, '{site['site']}', {site['level']}, { amap.get_parent_site(site['index']) ['index'] } );"
    print(query)
    cursor.execute(query)
    print(cursor.rowcount, "record inserted.")

mydb.commit()