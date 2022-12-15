import { fetchWith } from './fetchWith'
import { log } from './log'

export type SetupOpts = {
  statusEl?: HTMLDivElement,
  worker: Worker
}

const username = 'alvin'
const password = '#secretAvocad0'

export function setupLoginRequest(element: HTMLButtonElement, opts: SetupOpts) {
  const {
    worker
  } = opts
  
  element.addEventListener('click', () => {
    fetchWith(worker)('?login', { body: JSON.stringify({username, password}) }).then(res => {
      log(`Success = ${res}`)
      log('')
    }).catch(err => {
      log(`Error = ${err}`)
    })
  })
}

export function setupSendAnAuthenticatedRequest(element: HTMLButtonElement, opts: SetupOpts) {
  const {
    worker
  } = opts
  
  element.addEventListener('click', () => {
    fetchWith(worker)('/abc').then(res => {
      log(`Success = ${res}`)
      log('')
    }).catch(err => {
      log(`Error = ${err}`)
    })
  })
}

export function setupLogOutRequest(element: HTMLButtonElement, opts: SetupOpts) {
  const {
    worker
  } = opts
  
  element.addEventListener('click', () => {
    fetchWith(worker)('?logout').then(res => {
      log(`Success = ${res}`)
      log('')
    }).catch(err => {
      log(`Error = ${err}`)
    })
  })
}


