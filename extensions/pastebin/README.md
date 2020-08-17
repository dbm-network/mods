# Pastebin

## Preview
![Pastebin Extension](/extensions/pastebin/images/preview.png?raw=true)

## Get API Key
1. Login to your pastebin account at [here](https://pastebin.com/login)
2. Go to this [link](https://pastebin.com/api#1) and you should able see section like below
![Pastebin API Page](/extensions/pastebin/images/pastebin_api_page.png?raw=true)
3. Copy the key from **Your Unique Developer API Key** to inside Pastebin extension

## Download Raw Data
1. Paste the pastebin link to URL input box, valid url are 'https://pastebin.com/example', 'https://pastebin.com/raw/example' and 'example'
2. Switch **Type** from `None` to `Download`
3. Wait for status change to **Downloaded**
4. Close Pastebin extension, it should be added to your bot's command or event

## Upload Raw Data
1. Get your API key here if `key` input box still empty
2. Switch **Type** from `None` to `Upload`
3. Wait for status change to **Post!**
4. You should able see the pastebin link at URL, link valid for 30 days and the link is unlisted

## Status Code
- Downloaded - Successful downloaded raw data from pastebin
- Post! - Successful uploaded raw data to pastebin
- Error! - Something error, read the error below
- Key not found. - Please input your API key before upload raw data
