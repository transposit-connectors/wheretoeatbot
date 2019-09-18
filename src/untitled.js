(params) => {
  return {
    mission: "complete"
  };
}

/*
 * For sample code and reference material, visit
 * https://www.transposit.com/docs/references/js-operations
 */

  const parameters = {};
  parameters.$body = {
    channel : '<string>',
    as_user : true,
    text : '<string>'
  };
  return api.run('slack.post_chat_message', parameters);