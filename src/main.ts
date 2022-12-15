import './style.css'
import {setupPromptForAuthentication, setupSendAnAuthenticatedRequest} from './auth'
import { log } from './log'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>POC for Web Worker Auth</h1>
    <main>
      <section id="steps">
        <h2>Actions</h2>
        <ol>
          <li><button id="prompt">Prompt for Authentication</button></li>
          <li><button id="send">Send an authenticated request</button></li>
        </ol>
      </section>
      <section id="log">
        <h2>Log</h2>
        <textarea id="status">
        </textarea>
      </section>
    </main>
  </div>
`
if (window.Worker) {
  const worker = new Worker(new URL('./worker.ts', import.meta.url))
  setupPromptForAuthentication(
    document.querySelector<HTMLButtonElement>('#prompt')!, { 
      worker 
    }
  )
  setupSendAnAuthenticatedRequest(
    document.querySelector<HTMLButtonElement>('#send')!, { 
      worker 
    }  )

  
} else {
  log('Your browser doesn\'t support web workers.');
}


