from icdutils import ICDManager

manager = ICDManager()

load = manager.search("atopic eczema")
print(load)