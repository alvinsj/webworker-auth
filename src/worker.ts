
let isLoggedIn : string | undefined;
let username: string | undefined, password: string | undefined;

const mockLogin = (username: string, password: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      isLoggedIn = 'secret'
      resolve('logged in')
      console.log('Worker: logged in.');

      setTimeout(() => { 
        console.log('Worker: logged out.');
        isLoggedIn = undefined 
      }, 1000 * 5)
    }, 0)
  })
}

const mockLogout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      isLoggedIn = undefined;
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

onmessage = async function (e) {
  const [uuid, url, opts, stream] = e.data;
  const options = opts || {}

  const tryLogin = async () => {
    if(!username || !password) {
      postMessage([uuid, {error: 'no previous session'}])
      return false
    }
    if(!isLoggedIn) await mockLogin(username, password)

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
    }
    
    // general requests
    default: {
      if(!(await tryLogin())) return

      const res = await mockFetch(url, opts)
      postMessage([uuid, res])
    }
  }
}
