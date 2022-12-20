import { FetchOpts } from "./fetchWith";

let authToken : string | undefined;

let username: string | undefined, password: string | undefined;

const postLoginRequest = (username: string, password: string) => {
  return fetch('/api/login', { 
    method: 'POST',
    body: JSON.stringify({username, password}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => res.json())
  .then((res) => {
    authToken = res.token
    console.log('Worker: logged in.');
  })
  .catch(e => { throw e })
}

const deleteLogoutRequest = () => {
  return fetch(
    '/api/logout', 
    addBearerToken({ method: 'DELETE' })
  ).then(() => {
    authToken = undefined;
    username = undefined;
    password = undefined;

    console.log('Worker: logged out.');    
  })
  .catch(e => { throw e })
}

const addBearerToken = (opts: FetchOpts) => ({
  ...opts,
  headers: new Headers({
    ...Object.fromEntries(opts?.headers?.entries() || []),
    'Authorization': `Bearer ${authToken}`, 
  })
})

const fetchWithAuth = (url: string, opts: FetchOpts = {}) => 
  fetch(`/api/${url}`, addBearerToken(opts))
  .then(res => res.json())
  .catch(e => { throw e })

const downloadFile = async (url: string, opts = {}) => {
  // FIXME use API instead of static files
  const response = await fetch(url, addBearerToken(opts)).catch(e => { throw e });

  if (!response.ok) {
    throw new Error(`Unable to download file: ${response.status}`);
  }

  const data = await response.blob();
  const blobUrl = URL.createObjectURL(data);

  return blobUrl;
}

onmessage = async function (e) {
  const [uuid, url, opts, stream] = e.data;
  const options = opts || {}

  const tryLogin = async () => {
    if(!username || !password) {
      postMessage([uuid, {error: 'no previous session'}])
      return false
    }
    if(!authToken) await postLoginRequest(username, password)

    return true
  }

  switch(true) {
    // login
    case url === '?login': {
      const { username: u, password: p } = JSON.parse(options.body || {});
      
      try {
        await postLoginRequest(u, p)
        username = u
        password = p
      } catch(e) {
        postMessage([uuid, {error: 'failed logging in'}])
      }
      
      postMessage([uuid, 'logged in'])
      return
    }

    // logout 
    case url === '?logout': {
      
      try {
        await deleteLogoutRequest()
      } catch(e) {
        postMessage([uuid, {error: 'failed logging in'}])
      }
      
      postMessage([uuid, 'logged out'])
      return
    }

    // upload
    case Boolean(stream): { 
      if(!(await tryLogin())) return
      
      // NOTE can add more capability, e.g. progress
      const res = await fetchWithAuth(url, {
        ...opts, 
        method: 'POST',
        body: stream
      })
      console.log('Worker: uploaded for stream')
      postMessage([uuid, res])
      return
    }

    // download
    case /#download$/.test(url): {
      if(!(await tryLogin())) return

      try {
        console.log('Worker: start downloading')
        
        const blobUrl = await downloadFile(url, opts)
        console.log(`Worker: downloaded ${blobUrl}`)

        postMessage([uuid, blobUrl])
      } catch(e) {
        console.log(`Worker: failed download - {e.message}`)
        postMessage([uuid, {error: (e as Error).message }])
      }
      return
    }
    
    // general requests
    default: {
      if(!(await tryLogin())) return

      const res = await fetchWithAuth(url, opts)
      postMessage([uuid, res])
    }
  }
}
