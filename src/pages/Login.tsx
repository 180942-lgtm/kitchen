import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!phone) return alert('请输入手机号')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('phone', data.phone)
        navigate('/shop', { replace: true })
      } else {
        alert(data.error || '登录失败')
      }
    } catch {
      alert('网络错误')
    }
  }

  return (
    <div style={{ padding: 20, background: '#fff', minHeight: '100vh' }}>
      <h2>手机验证码登录</h2>
      <input
        placeholder="手机号"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '1px solid #ddd' }}
      />
      <input
        placeholder="验证码（测试码1234）"
        value={code}
        onChange={e => setCode(e.target.value)}
        style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '1px solid #ddd' }}
      />
      <button
        onClick={handleLogin}
        style={{
          width: '100%', padding: 14, background: '#FFB000', color: '#fff',
          border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold'
        }}
      >
        登录
      </button>
    </div>
  )
}

export default Login