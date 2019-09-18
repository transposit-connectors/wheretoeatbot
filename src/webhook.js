/**
 * This operation is an example of a JavaScript operation deployed as a Webhook
 * and configured to work with Slack.
 *
 * For sample code and reference material, visit
 * https://www.transposit.com/docs/building/webhooks
 */
({ http_event }) => {
  const parsed_body = http_event.parsed_body;
  const workspaceId = parsed_body.team_id;
  const userId = parsed_body.user_id;
  const response_url = parsed_body.response_url;  
  
  if (parsed_body.challenge) {
	let body = parsed_body;
    return {
      status_code: 200,
      headers: { "Content-Type": "text/plain" },
      body: body.challenge
    };
  }
  
  let body_text = parsed_body.event.text;
  let lex_result = api.run("this.post_text", {slackText : body_text});
  
  console.log(lex_result[0].message);
  
  let lex_to_slack = api.run("this.post_chat_message", { lexResponse : lex_result[0].message });
//   setImmediate(() => {
//     let user = api.user({type: "slack", workspaceId, userId});
//     if (user) {
//       let message = api.run('this.get_slack_message', {}, {asUser: user.id})[0];
//       api.run("slack_webhook.post_to_response_url", {
//         response_url: response_url,
//         post_body: message
//       });      
//     } else {
//       api.run("slack_webhook.post_to_response_url", {
//         response_url: response_url,
//         post_body: {text: 'Please configure your user at ' + env.getBuiltin().appUrl}
//       });      
//     }
//   });
    return { status_code: 200 };
}  
