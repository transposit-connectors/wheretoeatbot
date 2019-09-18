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
      	let maxPrice = lex_result[0]["slots"]["Price"];
      	let userAddress = lex_result[0]["slots"]["Location"];
      	// avg walk speed is 1.4 m/s, so max time in min * 1.4 * 60 to get maxDistance in meters
      	let maxDistance = lex_result[0]["slots"]["Distance"] * 1.4 * 60;
      
    	let slack_recommendations = api.run("this.post_chat_message", {lexResponse : "I have some suggestions...", channelId : channelId});
      	
      	let google_geocode_results = api.run("this.geocode", {address : userAddress});      
      	let latLong = [google_geocode_results[0]["results"][0]["geometry"]["location"]["lat"], 
                       google_geocode_results[0]["results"][0]["geometry"]["location"]["lng"]];
      	latLong = latLong.join();
      	
      	console.log("maxDistance " + maxDistance);
      	console.log("location " + latLong);
      	
        let google_place_results = api.run("this.search_nearby", {radius : maxDistance, location : latLong});
      
      	console.log(google_place_results);
    }
  } 
  return { status_code: 200 };
}  
