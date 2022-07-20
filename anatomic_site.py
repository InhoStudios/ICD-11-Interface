from bs4 import BeautifulSoup
import requests

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
HEADERS = { 'User-Agent': USER_AGENT }

ROOT_URL = 'https://anatomymapper.com/Terms/AMID'

class AnatomyMap():
    def __init__(self):
        self.anatomic_sites = []
        
        src = requests.get(ROOT_URL, headers=HEADERS)
        soup = BeautifulSoup(src.text, "html.parser")
        rows = soup.find_all('tr')
        rows = rows[1:]

        for row in rows:
            row_text = str(row).replace("<tr>", "").replace("<td>", "").replace("</tr>", "")
            columns = row_text.split('</td>')
            col_number = 0
            index = 0
            for column in columns:
                if (column.replace(" ", "") != ""):
                    if (col_number == 0):
                        index = column.split("</a>")[-1]
                    else:
                        item = {
                            'site': column[1:],
                            'level': int(col_number),
                            'index': int(index)
                        }
                        self.anatomic_sites.append(item)
                col_number += 1
            
    def get_parent_site(self, index):
        parent_site = "None"
        index_level = self.anatomic_sites[index-1]['level']
        for site in self.anatomic_sites:
            if site['level'] == index_level-1:
                parent_site = site
            if site['index'] >= index:
                break
        return parent_site
    
    def get_root_site(self, index):
        root_site = "None"
        for site in self.anatomic_sites:
            if site['level'] == 1:
                root_site = site
            if site['index'] >= index:
                break
        return root_site

    def get_site_by_index(self, index):
        return self.anatomic_sites[index-1]
    
    def get_anatomic_sites(self):
        return self.anatomic_sites