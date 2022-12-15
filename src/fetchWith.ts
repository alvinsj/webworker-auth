
import { log } from './log'

export type FetchOpts = {
  body: string
}

const makeWorkerPromise = (worker: Worker, { url, opts }: {url: string, opts?: FetchOpts}) => new Promise((resolve) => {
  const uuid = crypto.randomUUID()

  worker.postMessage([uuid, url, opts?.body])
  const listener = (e) => { 
    const requestUUID = e.data[0];
    if(requestUUID === uuid) {
      resolve(e.data[1])
      log(`message handler removed for request ${uuid}.`)
      worker.removeEventListener('message', listener)
    }
  }
  worker.addEventListener('message', listener);  
  log(`message handler added for ${uuid}.`)
}).catch(err => log(err))



export function fetchWith(worker: Worker) {
  return function get(url: string, opts?: FetchOpts) {
    return makeWorkerPromise(worker, { url, opts })
  }
}
