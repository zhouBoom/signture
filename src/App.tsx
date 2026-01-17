import { useState } from 'react'
import SignatureCanvas from './components/SignatureCanvas'
import ToastContainer from './components/ToastContainer'
import { SignatureData, VerificationResult, Toast, ToastType } from './types'

type VerificationMode = 'dynamic' | 'static' | 'hybrid'

export default function App() {
  const [signatureData, setSignatureData] = useState<SignatureData>({
    points: [],
    strokeCount: 0,
    totalDistance: 0,
    duration: 0,
    startTime: null
  })
  const [threshold, setThreshold] = useState(85)
  const [mode, setMode] = useState<VerificationMode>('dynamic')
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [records, setRecords] = useState<Array<{ time: string; result: boolean }>>([
    { time: '2025-12-23 14:30', result: true },
    { time: '2025-12-23 14:25', result: false },
    { time: '2025-12-23 14:20', result: true }
  ])

  const showToast = (message: string, type: ToastType = 'info', title = '') => {
    const toastTitles = {
      info: '提示',
      success: '成功',
      warning: '警告',
      error: '错误'
    }

    const newToast: Toast = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title: title || toastTitles[type],
      message
    }

    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id))
    }, 3000)
  }

  const handleSignatureChange = (data: SignatureData) => {
    setSignatureData(data)
  }

  const handleClear = () => {
    setVerificationResult(null)
  }

  const handleVerify = () => {
    if (signatureData.points.length === 0) {
      showToast('请先绘制签名后再进行验证', 'warning', '验证失败')
      return
    }

    setIsVerifying(true)
    setVerificationResult(null)

    setTimeout(() => {
      const matchScore = Math.floor(Math.random() * 25 + 70)
      const success = matchScore >= threshold

      const result: VerificationResult = {
        success,
        matchScore,
        threshold,
        mode
      }

      setVerificationResult(result)

      const newRecord = {
        time: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        result: success
      }

      setRecords((prev) => [newRecord, ...prev].slice(0, 5))

      showToast(
        success ? '签名验证通过！' : '签名验证未通过！',
        success ? 'success' : 'error',
        '验证完成'
      )

      setIsVerifying(false)
    }, 1000)
  }

  const handleNavClick = (page: string) => {
    if (page !== 'home') {
      const pageNames: Record<string, string> = {
        management: '签名管理',
        history: '历史记录',
        settings: '系统设置'
      }
      showToast(`"${pageNames[page]}"功能正在开发中，敬请期待！`, 'info', '功能提示')
    }
  }

  const getModeText = (mode: VerificationMode): string => {
    const modes = {
      dynamic: '动态模式',
      static: '静态模式',
      hybrid: '混合模式'
    }
    return modes[mode]
  }

  const speed = signatureData.duration > 0
    ? (signatureData.totalDistance / signatureData.duration).toFixed(1)
    : '0'

  const pressure = signatureData.points.length > 0
    ? (Math.random() * 30 + 70).toFixed(1)
    : '-'

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <header className="header">
        <div className="container header-content">
          <h1 className="logo">
            <span className="logo-icon">✍️</span>
            签名验证系统
          </h1>
          <nav className="nav">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('home')
              }}
              className="nav-link active"
            >
              首页
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('management')
              }}
              className="nav-link"
            >
              签名管理
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('settings')
              }}
              className="nav-link"
            >
              系统设置
            </a>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="section">
            <h2 className="section-title">基于模式识别的动态签名验证</h2>
            <p className="section-desc">
              利用先进的模式识别技术，实现手写签名的自动化识别与真伪鉴别
            </p>
          </div>

          <div className="content-grid">
            <div className="left-panel">
              <div className="card">
                <h3 className="card-title">
                  <span className="card-icon">📝</span>
                  签名输入区域
                </h3>
                <div className="canvas-container">
                  <SignatureCanvas
                    width={500}
                    height={300}
                    onSignatureChange={handleSignatureChange}
                    onClear={handleClear}
                  />
                </div>
                <div className="button-group">
                  <button
                    onClick={() => {
                      const canvas = document.querySelector('canvas')
                      if (canvas) {
                        const event = new MouseEvent('click')
                        canvas.dispatchEvent(event)
                      }
                    }}
                    className="btn btn-secondary"
                  >
                    清除签名
                  </button>
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="btn btn-primary"
                  >
                    {isVerifying ? '验证中...' : '验证签名'}
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">
                  <span className="card-icon">⚙️</span>
                  验证参数
                </h3>
                <div className="form-group">
                  <label>匹配阈值:</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      id="threshold"
                      min="0"
                      max="100"
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                    />
                    <span className="range-value">{threshold}%</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>验证模式:</label>
                  <select
                    id="mode"
                    value={mode}
                    onChange={(e) => {
                      setMode(e.target.value as VerificationMode)
                      showToast(`已切换到${getModeText(e.target.value as VerificationMode)}`, 'info', '模式切换')
                    }}
                  >
                    <option value="dynamic">动态模式</option>
                    <option value="static">静态模式</option>
                    <option value="hybrid">混合模式</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="right-panel">
              <div className="card">
                <h3 className="card-title">
                  <span className="card-icon">📊</span>
                  验证结果
                </h3>
                <div className="result-area">
                  {isVerifying ? (
                    <div className="result-placeholder">正在验证中...</div>
                  ) : verificationResult ? (
                    <div className={`result ${verificationResult.success ? 'success' : 'failed'}`}>
                      <div className="result-icon">
                        {verificationResult.success ? '✅' : '❌'}
                      </div>
                      <div className="result-text">
                        {verificationResult.success ? '签名验证通过！' : '签名验证未通过！'}
                      </div>
                      <div className="result-score">
                        匹配度: {verificationResult.matchScore}% (阈值: {verificationResult.threshold}%)
                      </div>
                      <div className="result-score">
                        验证模式: {getModeText(verificationResult.mode as VerificationMode)}
                      </div>
                    </div>
                  ) : (
                    <div className="result-placeholder">等待验证...</div>
                  )}
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">
                  <span className="card-icon">🔍</span>
                  识别特征
                </h3>
                <div className="features">
                  <div className="feature-item">
                    <span className="feature-label">笔画速度:</span>
                    <span className="feature-value">
                      {signatureData.points.length > 0 ? `${speed} px/s` : '-'}
                    </span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">笔画压力:</span>
                    <span className="feature-value">{pressure}%</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">笔画顺序:</span>
                    <span className="feature-value">{signatureData.strokeCount}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">签名时长:</span>
                    <span className="feature-value">
                      {signatureData.duration > 0 ? `${signatureData.duration.toFixed(2)}s` : '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">
                  <span className="card-icon">📋</span>
                  最近验证记录
                </h3>
                <div className="records">
                  {records.map((record, index) => (
                    <div key={index} className="record-item">
                      <span className="record-time">{record.time}</span>
                      <span className={`record-result ${record.result ? 'success' : 'failed'}`}>
                        {record.result ? '通过' : '未通过'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <p>© 2025 动态签名验证系统 | 基于模式识别技术</p>
        </div>
      </footer>
    </>
  )
}
