# RogueItemTracker
### Why?
I'm a college student powerlifter who as many people during COVID-19 was 
unable to access the gym. As a result, I decided to create a home gym and to do 
that I needed some gym equipment. However, many sites were out of stock, especially
Rogue, my favorite fitness company. As a result, I decided to create this bot
to update myself whenever an equipment is back in stock. I encountered a community
on reddit r/homegym where other users faced the same problem and I decided this would
be a great tool to help others just like me. 

### What?
* Search for your favorite Rogue Fitness equipment
* Get notified whenever items are back in stock through FB messenger
* Limit of 10 items
* Checks items every 30 seconds

![result](/views/images/home-demo.png)

### Updates
v 1.3
* Included a new “non-cached” link with a random 6 letter string appended to the URL
    * This link redirects you to the page when a restock occurs and clears the cache so the items should show up instantly
    * Kept the original link as a back up
* Included the following items
    * SAML-24 Monster Lite Safety Spotter Arms (Pair)
    * Monster Safety Spotter Arms 2.0
    * Rogue Infinity Safety Spotter Arms
    * Rogue Landmines
    * Rogue Thompson Fatbells
* Removed customizable buggy items for now such as OPB cerakote, OPB ss
    * Unable to add custom items for now such as loadable dumbbells, monster utility bench 2.0

v 1.2
* Fixed bug where some pages did not correctly indicate they were in stock

v 1.1
* Included boneyard and misc used barbells. 
    * Right now this feature only checks if the boneyard page is up
    * Thus, have the search enabled, and it will msg you when the boneyard page shows up
* Fixed bug where ‘stop’ would prevent user from searching again until next reset


### Commands
| Name | Purpose | 
|:-:|:-:|
| help | Returns all commands of items to search | 
| status | Checks current items and how long they have been searching for | 
| stop | Stops checking all items | 

### How to use
Refer to `roguestockbot.com/bot-guide` for tutorial of all the commands