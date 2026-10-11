// Copy buttons and prompt tabs. Without JavaScript the buttons stay hidden,
// the tab row stays hidden and every prompt is shown, ready to select. If the
// clipboard is refused, the text is selected so a keyboard copy finishes it.
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

// Tabs: arrow keys move between them, as the ARIA tabs pattern expects.
for (const box of document.querySelectorAll('[data-tabs]')) {
  const list = box.querySelector('[role=tablist]')
  const tabs = [...box.querySelectorAll('[role=tab]')]
  if (!list || !tabs.length) continue
  const select = (tab, focus) => {
    for (const t of tabs) {
      const on = t === tab
      t.setAttribute('aria-selected', String(on))
      t.tabIndex = on ? 0 : -1
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on
    }
    if (focus) tab.focus()
  }
  list.hidden = false
  select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0], false)
  for (const tab of tabs) tab.addEventListener('click', () => select(tab, false))
  list.addEventListener('keydown', (event) => {
    const i = tabs.indexOf(document.activeElement)
    if (i < 0) return
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(tabs[(next + tabs.length) % tabs.length], true)
  })
}

// Switchboard: each jack swaps the model string in the code window, to show
// that changing provider is one string. Without JavaScript the jacks stay
// disabled and the list simply names the providers.
const model = document.getElementById('live-model')
const keyLine = document.getElementById('live-key')
const jacks = [...document.querySelectorAll('.jack[data-model]')]
if (model && keyLine) {
  for (const jack of jacks) {
    jack.disabled = false
    jack.addEventListener('click', () => {
      for (const j of jacks) j.setAttribute('aria-pressed', String(j === jack))
      model.textContent = jack.dataset.model
      const key = jack.dataset.key
      keyLine.innerHTML = ''
      if (key) {
        const b = document.createElement('b')
        b.textContent = key
        keyLine.append('Reads ', b, ' from the environment.')
      } else {
        keyLine.textContent = 'No key: it runs on your own machine.'
      }
    })
  }
}
