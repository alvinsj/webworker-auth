
let authToken : string | undefined;
let refreshToken : string | undefined;

let username: string | undefined, password: string | undefined;

const mockLogin = (username: string, password: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      authToken = 'secret'
      resolve('logged in')
      console.log('Worker: logged in.');

      setTimeout(() => { 
        console.log('Worker: logged out.');
        authToken = undefined 
      }, 1000 * 5)
    }, 0)
  })
}

const mockLogout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      authToken = undefined;
      username = undefined;
      password = undefined;

      resolve('logged out')
      console.log('Worker: logged out.');
    }, 0)
  })
}

const mockFetch = (url: string, opts = {}) => {
  return new Promise((resolve,) => {
    setTimeout(() => {
      resolve(`Authenticated request sent for ${opts?.method || 'GET'} ${url}`)
    }, 0)
  })
} 

const downloadFile = async (url: string, opts = {}) => {
  const response = await fetch(url);

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
    if(!authToken) await mockLogin(username, password)

    return true
  }

  switch(true) {
    // login
    case url === '?login': {
      const { username: u, password: p } = JSON.parse(options.body || {});
      
      try {
        await mockLogin(u, p)
        username = u
        password = p
      } catch(e) {
        postMessage([uuid, {error:'failed logging in'}])
      }
      
      postMessage([uuid, 'logged in'])
      return
    }

    // logout 
    case url === '?logout': {
      
      try {
        await mockLogout()
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
      const res = await mockFetch(url, {
        ...opts, 
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

      const res = await mockFetch(url, opts)
      postMessage([uuid, res])
    }
  }
}
