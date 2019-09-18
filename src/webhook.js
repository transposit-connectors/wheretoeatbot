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
  
  if (!parsed_body.event.bot_id)  {
    let body_text = parsed_body.event.text;
    let lex_result = api.run("this.post_text", {slackText : body_text});

    let lexResponse = lex_result[0].message;
    let lex_slack = api.run("this.post_chat_message", {lexReponse : lexResponse, channelId : channelId});
  } 
  return { status_code: 200 };
}  
