import './style.css'
import {setupPromptForAuthentication, setupSendAnAuthenticatedRequest} from './auth'



document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>POC for Web Worker Auth</h1>
    <main>
      <section id="status">
        Status: <code id="status">Idle</code>
      </section>
      <section id="steps">
        <ol>
          <li><button id="prompt">Prompt for Authentication</button></li>
          <li><button id="send">Send an authenticated request</button></li>
        </ol>
      </section>
    </main>
  </div>
`
if (window.Worker) {
  const worker = new Worker(new URL('./worker.ts', import.meta.url))
  worker.onmessage = function(e) {
    console.log('Message received from worker ' + e.data);
  }

  setupPromptForAuthentication(
    document.querySelector<HTMLButtonElement>('#prompt')!, { 
      statusEl: document.querySelector<HTMLDivElement>('#status')! , 
      worker 
    }
  )
  setupSendAnAuthenticatedRequest(
    document.querySelector<HTMLButtonElement>('#send')!, { 
      statusEl: document.querySelector<HTMLDivElement>('#status')! , 
      worker 
    }  )

  
} else {
  console.log('Your browser doesn\'t support web workers.');
}


