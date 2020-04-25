import os 
import sys 
import requests
import time
import fbchat


from bs4 import BeautifulSoup
from datetime import datetime
from getpass import getpass
from fbchat import Client


def check_page():
    print("=============== Requesting page... ===============")
    page = requests.get("https://www.roguefitness.com/rogue-color-echo-bumper-plate")
    #page = requests.get("https://www.roguefitness.com/rogue-olympic-plates")
    soup = BeautifulSoup(page.text, 'html.parser')
    in_stock_items = []
    out_stock_items = []

    results = soup.findAll("div", {"class": 'grouped-item'})

    for item in results:
        names = item.findAll("div", {"class": 'item-name'})
        prices = item.findAll("span", {"class": 'price'})
        in_stock = item.findAll("div", {"class": 'bin-stock-availability'})
        
        # Out of stock items
        if len(in_stock) != 0:
            out_stock_items.append({names[0].text, prices[0].text})
        # In stock items
        else:
            in_stock_items.append({names[0].text, prices[0].text})
    print("=============== In stock items ===================")
    print(in_stock_items)

    print("=============== Out of stock items ===============")
    print(out_stock_items)
    print("")

    # username = "jonnyxchow@gmail.com"
    # client = fbchat.Client(username, getpass()) 
    
    # print("Own id: {}".format(client.uid))

   

    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    print("Current Time =", current_time)
    print("")


def main():
    while True:
        check_page()
        time.sleep(60)

if __name__ == "__main__":
    main()