
export function log(message: string) {
  let statusEl = document.querySelector<HTMLDivElement>('#status')
  if(statusEl) statusEl.innerHTML += '&#13;&#10;' + message

  // console.log(message)
}
