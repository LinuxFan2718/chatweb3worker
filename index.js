addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * @param {Request} request
 */
async function handleRequest(request) {
  const allow_origin = '*';
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Origin': allow_origin,
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  let prompt = "What is an empty prompt on a web form?";
  try {
    const requestJson = await request.json();
    prompt = requestJson['prompt'];
  } catch (e) {
    console.error(e);
  }
  const url = 'https://api.openai.com/v1/completions';
  const model = 'text-davinci-003';
  const authorizationHeader = `Bearer ${OPENAI_API_KEY}`
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': authorizationHeader
  };
  const data = {
    model: model,
    prompt: prompt,
    max_tokens: 40,
    temperature: 0
  }
  const response = await fetch(url, {
    method: 'post',
    headers: headers,
    body: JSON.stringify(data)
  })

  const results = JSON.stringify(await response.json());

  return new Response(results, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': allow_origin,
      'Access-Control-Allow-Credentials': 'true'
    },
  });
}
