
export type SetupOpts = {
  statusEl: HTMLDivElement,
  worker: Worker
}

export function setupSendAnAuthenticatedRequest(element: HTMLButtonElement, opts: SetupOpts) {
  const {
    statusEl,
    worker
  } = opts
  
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    statusEl.innerHTML = `send is ${counter}`
    worker.postMessage([counter])
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}

export function setupPromptForAuthentication(element: HTMLButtonElement, opts: SetupOpts) {
  const {
    statusEl,
    worker
  } = opts

  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    statusEl.innerHTML = `prompt is ${counter}`
    worker.postMessage([counter])
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}
