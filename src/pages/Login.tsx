import { useState } from 'react'
import { Button, Form, Input, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!phone) {
      Toast.show('请输入手机号')
      return
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('phone', data.phone)
        Toast.show('登录成功')
        navigate(-1)
      } else {
        Toast.show(data.error || '登录失败')
      }
    } catch (e) {
      Toast.show('网络错误')
    }
  }

  return (
    <div style={{ padding: 20, background: '#fff', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center' }}>手机验证码登录</h2>
      <Form layout='vertical'>
        <Form.Item label='手机号'>
          <Input placeholder='请输入手机号' value={phone} onChange={val => setPhone(val)} />
        </Form.Item>
        <Form.Item label='验证码'>
          <Input placeholder='请输入验证码' value={code} onChange={val => setCode(val)} />
        </Form.Item>
      </Form>
      <Button block color='warning' size='large' onClick={handleLogin}>登录</Button>
      <div style={{ textAlign: 'center', marginTop: 12, color: '#999' }}>测试验证码：1234</div>
    </div>
  )
}

export default Login