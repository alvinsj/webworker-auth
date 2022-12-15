
let isLoggedIn : string | undefined

const mockLogin = () => {
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

const mockFetch = (url: string, opts = {}) => {
  return new Promise((resolve,) => {
    setTimeout(() => {
      resolve('Authenticated request sent.')
    }, 0)
  })
} 


onmessage = async function (e) {
  const [uuid, url] = e.data;

  if(!isLoggedIn) await mockLogin()
  
  const res = await mockFetch(url)
  postMessage([uuid, res])
  
}
