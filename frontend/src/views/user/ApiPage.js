"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import "../../assets/ApiPage.css"

const ApiPage = () => {
  const { token, API_BASE_URL } = useAuth()
  const [apiToken, setApiToken] = useState("")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)
  const [activeTab, setActiveTab] = useState("curl")
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  useEffect(() => {
    fetchApiToken()
  }, [])

  const fetchApiToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/api-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setApiToken(data.apiToken)
      }
    } catch (error) {
      console.error("Failed to fetch API token:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      showNotification(`${type} copied to clipboard!`, "success")
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      showNotification("Failed to copy to clipboard", "error")
    }
  }

  const apiExamples = {
    curl: `curl -X GET "https://dvshortylinks.com/api?api=${apiToken}&url=https://example.com&alias=mylink&format=json"`,
    javascript: `// Using fetch API
const response = await fetch('https://dvshortylinks.com/api', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Using query parameters
const params = new URLSearchParams({
  api: '${apiToken}',
  url: 'https://example.com',
  alias: 'mylink', // optional
  format: 'json' // or 'text'
});

const apiUrl = \`https://dvshortylinks.com/api?\${params}\`;
const response = await fetch(apiUrl);
const data = await response.json();`,
    php: `<?php
$api_token = '${apiToken}';
$url = 'https://example.com';
$alias = 'mylink'; // optional

$api_url = 'https://dvshortylinks.com/api?' . http_build_query([
    'api' => $api_token,
    'url' => $url,
    'alias' => $alias,
    'format' => 'json'
]);

$response = file_get_contents($api_url);
$data = json_decode($response, true);

if ($data['status'] === 'success') {
    echo 'Shortened URL: ' . $data['shortenedUrl'];
} else {
    echo 'Error: ' . $data['message'];
}
?>`,
    python: `import requests

api_token = '${apiToken}'
url = 'https://example.com'
alias = 'mylink'  # optional

params = {
    'api': api_token,
    'url': url,
    'alias': alias,
    'format': 'json'
}

response = requests.get('https://dvshortylinks.com/api', params=params)
data = response.json()

if data['status'] == 'success':
    print(f"Shortened URL: {data['shortenedUrl']}")
else:
    print(f"Error: {data['message']}")`,
  }

  if (loading) {
    return (
      <div className="api-page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading API documentation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="api-page-container">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <i className={`fas ${notification.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-code"></i>
          API Documentation
        </h1>
        <p className="page-subtitle">Integrate dvshortylinks URL shortening into your applications</p>
      </div>

      <div className="api-content">
        {/* API Token */}
        <div className="api-card">
          <div className="card-header">
            <div className="header-icon">
              <i className="fas fa-key"></i>
            </div>
            <div className="header-text">
              <h2 className="card-title">Your API Token</h2>
              <p className="card-description">Use this token to authenticate your API requests</p>
            </div>
          </div>
          <div className="card-content">
            <div className="token-display">
              <input value={apiToken} readOnly className="token-input" />
              <button onClick={() => copyToClipboard(apiToken, "API Token")} className="copy-btn">
                {copied === "API Token" ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
              </button>
            </div>
            <p className="security-note">
              <i className="fas fa-shield-alt"></i>
              Keep this token secure and don't share it publicly
            </p>
          </div>
        </div>

        {/* API Endpoint */}
        <div className="api-card">
          <div className="card-header">
            <div className="header-icon">
              <i className="fas fa-external-link-alt"></i>
            </div>
            <div className="header-text">
              <h2 className="card-title">API Endpoint</h2>
            </div>
          </div>
          <div className="card-content">
            <div className="endpoint-display">
              <code>GET https://dvshortylinks.com/api</code>
            </div>
            <div className="parameters-section">
              <h4 className="parameters-title">Parameters:</h4>
              <div className="parameters-list">
                <div className="parameter-item">
                  <div className="parameter-badge required">Required</div>
                  <code className="parameter-name">api</code>
                  <span className="parameter-description">Your API token</span>
                </div>
                <div className="parameter-item">
                  <div className="parameter-badge required">Required</div>
                  <code className="parameter-name">url</code>
                  <span className="parameter-description">The URL to shorten</span>
                </div>
                <div className="parameter-item">
                  <div className="parameter-badge optional">Optional</div>
                  <code className="parameter-name">alias</code>
                  <span className="parameter-description">Custom short code</span>
                </div>
                <div className="parameter-item">
                  <div className="parameter-badge optional">Optional</div>
                  <code className="parameter-name">format</code>
                  <span className="parameter-description">Response format (json or text)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Response Examples */}
        <div className="api-card">
          <div className="card-header">
            <div className="header-icon">
              <i className="fas fa-file-code"></i>
            </div>
            <div className="header-text">
              <h2 className="card-title">Response Examples</h2>
            </div>
          </div>
          <div className="card-content">
            <div className="response-tabs">
              <button
                className={`response-tab ${activeTab === "success" ? "active" : ""}`}
                onClick={() => setActiveTab("success")}
              >
                Success Response
              </button>
              <button
                className={`response-tab ${activeTab === "error" ? "active" : ""}`}
                onClick={() => setActiveTab("error")}
              >
                Error Response
              </button>
            </div>
            <div className="response-content">
              {activeTab === "success" && (
                <div className="code-block">
                  <pre>{`{
  "status": "success",
  "shortenedUrl": "https://dvshortylinks.com/abc123"
}`}</pre>
                </div>
              )}
              {activeTab === "error" && (
                <div className="code-block">
                  <pre>{`{
  "status": "error",
  "message": "Invalid API token"
}`}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="api-card">
          <div className="card-header">
            <div className="header-icon">
              <i className="fas fa-code"></i>
            </div>
            <div className="header-text">
              <h2 className="card-title">Code Examples</h2>
              <p className="card-description">Ready-to-use code snippets in different programming languages</p>
            </div>
          </div>
          <div className="card-content">
            <div className="code-tabs">
              {Object.keys(apiExamples).map((language) => (
                <button
                  key={language}
                  className={`code-tab ${activeTab === language ? "active" : ""}`}
                  onClick={() => setActiveTab(language)}
                >
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </button>
              ))}
            </div>
            <div className="code-content">
              <div className="code-block-wrapper">
                <pre className="code-block">
                  <code>{apiExamples[activeTab]}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(apiExamples[activeTab], `${activeTab} code`)}
                  className="code-copy-btn"
                >
                  {copied === `${activeTab} code` ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="api-card guidelines-card">
          <div className="card-header">
            <div className="header-icon">
              <i className="fas fa-book-open"></i>
            </div>
            <div className="header-text">
              <h2 className="card-title">Guidelines & Limits</h2>
            </div>
          </div>
          <div className="card-content">
            <ul className="guidelines-list">
              <li>API rate limit: 100 requests per 15 minutes</li>
              <li>Keep your API token secure and don't expose it in client-side code</li>
              <li>Use HTTPS for all API requests</li>
              <li>Custom aliases must be unique across the platform</li>
              <li>URLs must be valid and accessible</li>
              <li>Inappropriate content is not allowed</li>
            </ul>
          </div>
        </div>

        {/* Test Section */}
        <div className="api-card">
          <div className="card-header">
            <div className="header-icon">
              <i className="fas fa-flask"></i>
            </div>
            <div className="header-text">
              <h2 className="card-title">Test the API</h2>
              <p className="card-description">Quick test to make sure your API token is working</p>
            </div>
          </div>
          <div className="card-content">
            <div className="test-section">
              <p className="test-description">Try this URL in your browser:</p>
              <div className="test-url-display">
                <code className="test-url">
                  https://dvshortylinks.com/api?api={apiToken}&url=https://google.com&format=json
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `https://dvshortylinks.com/api?api=${apiToken}&url=https://google.com&format=json`,
                      "Test URL",
                    )
                  }
                  className="copy-btn"
                >
                  {copied === "Test URL" ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiPage
