class shoes:

    def __init__(self, name, path, marketprice):
        self.name = name
        self.path = path
        self.marketprice = marketprice

    def getPrice(self):
        return self.marketprice