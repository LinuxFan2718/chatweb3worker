addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * @param {Request} request
 */
async function handleRequest(request) {
  const allowedOrigins = [
    "https://chatweb3.cahillanelabs.com",
    "https://chatweb3worker.dennislibre.workers.dev",
    "https://chatweb3.pages.dev/",
    "http://127.0.0.1:3000",
    "http://localhost:3000"
  ];
  const requestUrl = request.headers.get('origin');
  let allow_origin = "https://chatweb3.cahillanelabs.com";
  if (allowedOrigins.includes(requestUrl)) {
    allow_origin = requestUrl;
  }
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
  //const model = 'text-davinci-003';
  const model = 'davinci:ft-personal-2023-02-02-03-15-59';
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
  let response;
  try {
    response = await fetch(url, {
      method: 'post',
      headers: headers,
      body: JSON.stringify(data)
    });
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }

  const results = JSON.stringify(await response.json());

  return new Response(results, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': allow_origin,
      'Access-Control-Allow-Credentials': 'true'
    },
  });
}
