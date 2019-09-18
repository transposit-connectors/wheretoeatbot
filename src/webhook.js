({ http_event }) => {
  const parsed_body = http_event.parsed_body;
  const workspaceId = parsed_body.team_id;
  const userId = parsed_body.user_id;
  const response_url = parsed_body.response_url;
  const channelId = parsed_body.event.channel;
  
  if (parsed_body.challenge) {
	let body = parsed_body;
    return {
      status_code: 200,
      headers: { "Content-Type": "text/plain" },
      body: body.challenge
    };
  }
  
  //check if not a bot
  if (!parsed_body.event.bot_id && !http_event.headers['X-Slack-Retry-Num'])  {
    let body_text = parsed_body.event.text;    
    let lex_result = api.run("this.post_text", {slackText : body_text, userId : "taylor1"});
        
    if (lex_result[0].dialogState != "ReadyForFulfillment") {
    	let lex_slack = lex_result[0].message;
    	let lex_slack_response = api.run("this.post_chat_message", {lexResponse : lex_slack, channelId : channelId});      
    }
    else if (lex_result[0].dialogState === "ReadyForFulfillment"){
      	console.log("We are now ready for fulfillment....");
      	let maxPrice = lex_result[0]["Slot"]["Price"];
      	console.log(maxPrice);
      
        //console.log(lex_result);
    	let slack_recommendations = api.run("this.post_chat_message", {lexResponse : "I have some suggestions...", channelId : channelId});
      	console.log("ready to use google API!");
      
        //let google_results = api.run("this.search_nearby", {});
    }
  } 
  return { status_code: 200 };
}  
