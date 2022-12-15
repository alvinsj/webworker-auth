
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
      resolve('Authenticated request sent.')
    }, 0)
  })
} 

onmessage = async function (e) {
  const [uuid, url, body] = e.data;

  switch(true) {
    case url === '?login': {
      const { username: u, password: p } = JSON.parse(body);
      
      try {
        await mockLogin(u, p)
        username = u
        password = p
      } catch(e) {
        postMessage([uuid, 'failed logging in'])
      }
      
      postMessage([uuid, 'logged in'])
      return
    }
    case url === '?logout': {
      
      try {
        await mockLogout()
      } catch(e) {
        postMessage([uuid, 'failed logging in'])
      }
      
      postMessage([uuid, 'logged out'])
      return
    }
    default: {
      if(!username || !password) {
        this.postMessage([uuid, 'error: no previous session'])
        return 
      }
      if(!isLoggedIn) await mockLogin(username, password)
  
      const res = await mockFetch(url)
      postMessage([uuid, res])
    }
  }
}
