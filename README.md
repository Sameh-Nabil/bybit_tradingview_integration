# ByBit TradingView Integration

## **Important Notice**
Please only use this project with a Testnet ByBit account.
I am not a financial analyst, I do not give financial advice, I am not responsible for your usage of this project. I have created this project for a fun experiment to interface with Webhooks and APIs. Please do not use this project if you do not understand how it works.

Also, this is my first open-source project, so there will probably be many issues. I am open to feedback and improvements on the project.

---

## **Requirements**
- NodeJS v12+
- latest firebase-tools
- A ByBit account (note: if you are in the US you will need to use a VPN based in a different country. You can view restricted countries [here](https://help.bybit.com/hc/en-us/articles/360039750013-Service-Restricted-Countries))
- A paid TradingView account (to use Webhooks) | [Referral link](https://www.tradingview.com/gopro/?share_your_love=adahl5)

---

## **Setup**
To setup this project you will probably need to be mildly comfortable with Firebase. I will try to guide you through the process but will not being going in depth. If you need help, please create an issue. The getting started guide [here](https://firebase.google.com/docs/functions/get-started) should use as a useful base for getting started with Firebase Cloud Functions.

1. Fork this repo on Github so you can use Github actions for your own deployment.
   
2. Clone your forked repo to your computer. (Do not clone this repo) Note: If you use 2FA on your GitHub account, you will need to clone the repo through SSH.
3. Delete `firebase.json` and `.firebaserc` in the root folder, if present.
4. Create an API key for your ByBit account. 
   [Testnet API Link](https://testnet.bybit.com/app/user/api-management) |
   [Regular API Link](https://www.bybit.com/app/user/api-management) (use at your own risk)
5. Copy down both the API Key and the Private Key.
6. Go to the settings of your forked repo and click on "Secrets"
7. Click on "New repository secret"
8. Name the first secret as `API_KEY` and enter the API Key from ByBit into the value field.
9. Repeat this for the private key, naming it `PRIVATE_KEY`
10. Run `npm install` in the root directory of the project and in the `functions` directory
11. Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/u/0/)
12. Click on Functions under the Develop heading on the left side bar.
13. Press "Upgrade project" (this will allow you to use cloud functions in your project)
14. Proceed through the dialog boxes to upgrade your project (there is very little chance you will be charged for your usage)
15. Return to your terminal and run `npm install -g firebase-tools` if you have not already installed them.
16. Now run `firebase init` in the root folder to initialize your Firebase project.
17. Select `Functions` from the menu. This is the only required feature at this time.
18. In the next menu, choose `Use an existing project` and select the project you previously created.
19. ```
    What language would you like to use to write Cloud Functions? JavaScript
    Do you want to use ESLint to catch probable bugs and enforce style? No
    File functions/package.json already exists. Overwrite? (y/N) n 
    i  Skipping write of functions/package.json
    File functions/index.js already exists. Overwrite? No
    Skipping write of functions/index.js
    File functions/.gitignore already exists. Overwrite? No
    Skipping write of functions/.gitignore
    Do you want to install dependencies with npm now? (Y/n) y
    ```
20. Run `firebase login:ci` and follow the onscreen steps.
21. Return to your repo's secrets and add the token as `FIREBASE_TOKEN`
    - the token should start with `1//` or something similar
22. Run `git push` to push your changes to your forked repo. 
    - Note: If you use 2FA you will need to follow the steps [here](https://www.freecodecamp.org/news/git-ssh-how-to/) to create and add a ssh key so you can push your changes to your forked repo. 
23. Go to the `Actions` tab of your repo and press the button that says `I understand my workflows, go ahead and enable them`
24. Click on `CI` and press `Run workflow` and the press the `Run workflow` button in the modal.
25. If everything goes well, you should now have your Firebase Cloud Function deployed.
26. Now, go to the Firebase console and go to `Functions`. You should now be able to see your newly created function with a URL that will invoke the function.
27. Create an alert on TradingView and check the `Webhook URL` checkbox.
28. Paste the function's URL into the box below the `Webhook URL` checkbox.
29. In the message field, paste the following code, adjusting the settings according to the table below.
    - ```{"side": "Buy/Sell", "qty": 0, "symbol": {{ticker}}, "price":{{close}}, "leverage": 0, "order_type": "Market/Limit", "take_profit": 0, "stop_loss": 0, "order_link_id": "{{time}}"}```

---
## **Reference**
| Argument | Options | Type | Description |
|----------|---------|------|-------------|
| side | Buy or Sell | string | Buy will create a long position, Sell will create a short position. |
| qty | Any positive integer | integer | Position size in USD |
| symbol | Any valid ByBit ticker | string | Trade ticker, automatically filled in by your TradingView alert |
| price | Any positive number | float | Trade price, this is automatically filled in by your TradingView alert (does nothing if order_type is Market) |
| leverage | Any integer 0 to 100 | integer | Your chosen leverage, please understand how this works before you use it. Choosing 0 will trade in Cross Margin mode.
| order_type | Market or Limit | string | Market will fill your trade at the current market price, limit will set an order to fill at the specified price.
| take_profit | Any number | float | The change in price from the trade price to trigger a take profit order. Will be positive for a Long order and negative for a Short order. |
| stop_loss | Any number | float | The change in price from the trade price to trigger a stop loss order. Will be negative for a Long order and negative for a Short order. |
| order_link_id | Any string | string | A unique ID for your trade. If the ID is not unique, the trade will no go through. This is automatically filled as the current time by your TradingView alert. |
---
Message template: 
>```{"side": "Buy/Sell", "qty": 0, "symbol": {{ticker}}, "price":{{close}}, "leverage": 0, "order_type": "Market/Limit", "take_profit": 0, "stop_loss": 0, "order_link_id": "{{time}}"}```