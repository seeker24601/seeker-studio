// Copy buttons for the agent prompts and commands. Without JavaScript the
// buttons stay hidden and the text is there to select. If the clipboard is
// refused, the text is selected so a keyboard copy finishes the job.
const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

function selectText(element) {
  const range = document.createRange()
  range.selectNodeContents(element)
  const selection = getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

function show(button, text, done) {
  button.textContent = text
  if (done) button.dataset.done = ''
  setTimeout(() => { button.textContent = 'Copy'; delete button.dataset.done }, 2500)
}

for (const button of document.querySelectorAll('[data-copy]')) {
  const source = document.getElementById(button.dataset.copy)
  if (!source) continue
  button.hidden = false
  button.addEventListener('click', async () => {
    const text = source.textContent.trim()
    try {
      await navigator.clipboard.writeText(text)
      show(button, 'Copied', true)
      return
    } catch {
      // Clipboard API missing or refused: fall through.
    }
    selectText(source)
    let copied = false
    try { copied = document.execCommand('copy') } catch { copied = false }
    show(button, copied ? 'Copied' : mac ? 'Press ⌘C' : 'Press Ctrl+C', copied)
  })
}
