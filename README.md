# WhereToEatBot

A bot that helps you find highly rated food recommendations nearby, using AWS Lex and the Google Maps Places API. 

Time estimate: 30 minutes (20 minutes if you are familiar with AWS Console or creating Slack apps)

Before you begin, you need: 
- A Transposit account with a forked version of [this app](https://console.transposit.com/t/taylor/wheretoeatbot?fork=true)
- A Slack workspace where you can create and install apps 
- A hunger for good food nearby

TODO: Picture in action, waiting until have icon

## Setup AWS

### Set up your Lex bot

1. If you don't already have an AWS account, follow the instructions [here](https://docs.aws.amazon.com/lex/latest/dg/gs-account.html). You don't need to get setup with the AWS CLI.
2. Once you are signed into AWS, navigate to the Amazon Lex console at https://console.aws.amazon.com/lex/.
3. If this is your first Lex bot, choose the "Get Started" button; otherwise, on the Bots page, choose the "Create" button.
4. On the Create your bot page, set the following: 
    - Bot name: WhereToEat
    - Output voice: None
    - Session timeout: 10 min
    - COPPA: No
5. Click the "Create Intent" button, choose "Create intent," and give it the name "FindRestaurant"
6. Under Sample utterances, Copy and paste the following phrases, you can add others, but these are good to start with:
    - food nearby
    - I want to eat food
    - I want food
    - Help me find a restaurant
    - Help me find a place to eat
    - What is a good place to eat
    - What food is nearby
    - Where should we eat
7. Under Slot types in the left navigation, create a slot type:
    - Name: PriceLevel
    - Description: The restaurant price level on Google Maps
    - Slot Resolution: Restrict to Slot values and Synonyms
    - Under Value: 
        - 1, Synonyms: inexpensive, cheap
        - 2, Synonyms: moderate
        - 3, Synonyms: expensive
        - 4, Synonyms: very expensive
8. Under Slots, add these three slots:
    - Name: Location, Slot type: AMAZON.PostalAddress, Prompt: What address are you located at?
    - Name: Price, Slot type: PriceLevel, Prompt: How much do you want to spend? (Inexpensive, Moderate, Expensive, Very Expensive)
    - Name: Distance, Slot type: AMAZON.NUMBER, Prompt: How far do you want to walk? (in minutes)
9. Make sure to save the intent at the bottom of the page and build it at top
10. You can now test out the basic functionality in the console's test chatbot feature
11. After confirming the setup, you can publish. You will create an alias (i.e. TEST) that will later be used in Transposit.

### Get Access and Secret Keys

Here we are creating a user. Following the principle of least privilege, we’re going to only give them access to the permissions they need to run a Lex bot, and nothing else.

1. Under Services in AWS, navigate to Identity and Access Management (IAM) 
2. Click on Groups, and Create New Group
3. Choose a group name related to Lex (e.g. LexProduction)
4. Attach the AmazonLexRunBotsOnly policy and create the group
5. Click on Users, and Add user. 
6. Choose a user name that will be descriptive for it being able to programmatically access your Lex bot (e.g. lex-runtime)
7. Make sure to only check the Programmatic access under AWS access type
8. Add user to the group you just created by checking the box for the corresponding group
9. You don't need any tags, so click through to create user

### Set up AWS Lex in Transposit

1. Now that you have your Access key ID and Secret access key, navigate to your forked Transposit app.
2. Under Auth & settings > Keys, click the Connect button and fill it in with your Access key ID and Secret access key.
3. Under Deploy > Production Keys, click Add key for aws_lex_runtime and fill it in again with the same Access key ID and Secret access key.
4. Under Code > Data connections -> aws_lex_runtime, add what AWS region you are using, you can see this in the URL for the AWS console (e.g. us-west-2).
5. Lastly, in the post_text operation, change the bot alias to the one you published with (e.g. 'TEST') and change the botName to 'WhereToEat'.
6. You should be able to click Run and get results, similar to this: 

```json
[
  {
    "dialogState": "ElicitIntent",
    "intentName": null,
    "message": "Sorry, can you please repeat that?",
    "messageFormat": "PlainText",
    "responseCard": null,
    "sessionAttributes": null,
    "slotToElicit": null,
    "slots": null
  }
]
```

## Setup Google Maps

1. Go to https://cloud.google.com/maps-platform/#get-started to get an API key for the Google Maps Places API
2. You will be prompted to login to the Google account you want to associate the key with
3. Select Places checkbox in the pop up (TODO: Add picture just in case UI is different)
4. Enter new project name (e.g. WhereToEat)
5. You may need to set up billing, Google Cloud Platform will likely give you a year long free trial at this time if you have haven't set this up before
6. You will see a pop up with your API key, copy this key
7. In Transposit, under Auth & settings > Keys, add your key to the google_maps connector.
8. Under Deploy > Production Keys, click Add key for google_maps
9. You should be able to now click Run on both the search_nearby and geocode operation and get results, similar to this: 

```json
[
  {
    "geometry": {
      "location": {
        "lat": 30.2638741,
        "lng": -97.7632745
      },
      "viewport": {
        "northeast": {
          "lat": 30.2651373802915,
          "lng": -97.76206546970849
        },
        "southwest": {
          "lat": 30.2624394197085,
          "lng": -97.7647634302915
        }
      }
    },
    "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
    "id": "66bbf61a9a69c5bc038ade813ca4d1f9b113aaa9",
    "name": "Chuy's",
    "opening_hours": {
      "open_now": true
    },
    ...
  }
]
```

```json
[
  {
    "results": [
      {
        "address_components": [
          {
            "long_name": "1207",
            "short_name": "1207",
            "types": [
              "street_number"
            ]
          },
          {
            "long_name": "Barton Springs Road",
            "short_name": "Barton Springs Rd",
            "types": [
              "route"
            ]
          },
    ...
  }
]
```

## Setup Slack

1. Create a new app [here](https://api.slack.com/apps) in Slack
2. Copy the URL for your webhook in Transposit under Deploy > Endpoints, under the deploy as webhook checkbox, similar to this: `https://wheretoeabot.transposit.com/api/v1/execute-http/webhook?api_key=abcdefghijklmnop123`
3. In your Slack App configure page, select Event Subscriptions, and paste in the URL you copied from Transposit (Note: It should automatically verify that the function is valid)
4. On the same page, under Subscribe to Bot Events, add the message.im event and message.channels event (only if you want it to listen to channels too)
5. In your Slack App configure page, select Bot Users, and add a bot user with the WhereToEat display name, wheretoeat username, and always show the bot as online
6. Follow the instructions [here](https://www.transposit.com/docs/guides/slack/chatbots/#acting-as-your-bot-user) to get OAuth setup and under Scopes in Slack, make sure to set the chat:write:bot and bot scopes
7. If you have not installed or reinstalled the app, in the Slack app configure page, go to Install App and install it into your workspace
8. Now you can DM your bot telling it, you want a place to eat and follow its prompts! 

> Note: Right now, you will need to message the bot something similar to the sample utterances for the bot to understand your prompt. 

## Go further:
- Add another criteria (type of restaurant, minimum rating, etc) using slot values with AWS Lex
- Include validation for responses or more sample utterances in AWS Lex to make the bot “smarter” 
