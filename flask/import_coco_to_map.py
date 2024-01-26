
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

file = "bodysites.json"

map = {}

with (open(file) as f):
    json_str = f.read()
    map = json.loads(json_str)

def get_id_by_title(title):
    cursor.execute(f"SELECT anatomic_id FROM Anatomic_Site WHERE anatomic_site = '{title}'")
    for res in cursor:
        return res[0]

def construct_poly(title, segmentation):
    coords = str(segmentation).replace('[','').replace(']','')
    str_out = f"    <area shape=\"poly\" coords=\"{coords}\" title=\"{title}\" onClick=\"handleSelectSite({get_id_by_title(title)})\" />"
    return str_out

start_tag = "<map id=\"body-site-map\" name=\"body-site-map\">"

html = start_tag

out_map = []

for annotation in map["annotations"]:
    title = annotation["name"]
    for segmentation in annotation["segmentation"]:
        area = {}
        area["title"] = title
        area["shape"] = "poly"
        area["coords"] = segmentation
        area["fillColor"] = "#81aae64f"
        area["strokeColor"] = "#5b7fb3ff"
        area["name"] = get_id_by_title(title)
        out_map.append(area)
        # html += "\n" + construct_poly(title, segmentation)

end_tag = "</map>"

html += "\n" + end_tag

# print(html)

with (open ("body_sites.json", "w") as of):
    of.write(json.dumps(out_map))
    of.close()

# cursor.execute("SELECT * FROM Anatomic_site;")

# for x in cursor:
#     print(x)

# mydb.commit()