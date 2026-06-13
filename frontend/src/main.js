import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>📧 AI Email Spam Checker</h1>
    <p class="subtitle">Enter an email message below to check if it's spam.</p>
    
    <div class="input-group">
      <textarea id="emailInput" placeholder="Paste email content here..."></textarea>
    </div>
    
    <button id="checkBtn">Check Email</button>
    
    <div id="result" class="result-container hidden"></div>
  </div>
`

const checkBtn = document.getElementById('checkBtn')
const emailInput = document.getElementById('emailInput')
const resultDiv = document.getElementById('result')

checkBtn.addEventListener('click', async () => {
  const text = emailInput.value.trim()

  if (!text) {
    showError('Please enter some text to check.')
    return
  }

  setLoading(true)

  try {
    const response = await fetch('http://localhost:10000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    const data = await response.json()

    if (data.error) {
      showError(data.error)
    } else {
      showResult(data.prediction, data.confidence)
    }
  } catch (error) {
    showError('Failed to connect to the server. Is the backend running?')
    console.error(error);
  } finally {
    setLoading(false)
  }
})

function setLoading(isLoading) {
  checkBtn.disabled = isLoading
  checkBtn.textContent = isLoading ? 'Analyzing...' : 'Check Email'
  if (isLoading) {
    resultDiv.classList.add('hidden')
    resultDiv.innerHTML = ''
  }
}

function showResult(prediction, confidence) {
  resultDiv.classList.remove('hidden')

  const isSpam = prediction === 'Spam'
  const emoji = isSpam ? '🚨' : '✅'
  const colorClass = isSpam ? 'spam' : 'safe'

  resultDiv.innerHTML = `
    <div class="result-box ${colorClass}">
      <div class="result-header">
        <span class="emoji">${emoji}</span>
        <h2>${prediction}</h2>
      </div>
      <p class="confidence">Confidence: <strong>${confidence}%</strong></p>
      <p class="message">${isSpam ? 'This email looks suspicious.' : 'This email looks safe.'}</p>
    </div>
  `
}

function showError(message) {
  resultDiv.classList.remove('hidden')
  resultDiv.innerHTML = `
    <div class="error-box">
      ⚠️ ${message}
    </div>
  `
}
