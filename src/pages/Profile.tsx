import { useNavigate } from 'react-router-dom'

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const phone = localStorage.getItem('phone')

  const handleLogout = () => {
    localStorage.clear()
    // 强制跳转登录页，并刷新整个应用
    window.location.replace('/login')
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{
          width: 60, height: 60, background: '#eee', borderRadius: '50%',
          margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, color: '#999'
        }}>
          👤
        </div>
        <div style={{ marginTop: 8, fontWeight: 'bold' }}>
          {phone || '未登录'}
        </div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '12px 0', marginTop: 16,
            background: '#ff4d4f', color: '#fff', border: 'none',
            borderRadius: 8, fontSize: 16, fontWeight: 'bold'
          }}
        >
          退出登录
        </button>
      </div>
      <div style={{ marginTop: 32, padding: '0 16px' }}>
        <div style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>其它功能</div>
        <div onClick={() => navigate('/orders')} style={{ padding: '12px 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}>
          我的订单
        </div>
        <div style={{ padding: '12px 0', borderBottom: '1px solid #eee', color: '#ccc' }}>
          充值 (开发中)
        </div>
        <div onClick={() => navigate('/table/123')} style={{ padding: '12px 0', cursor: 'pointer' }}>
          🍽️ 餐桌扫码点餐 (演示桌号123)
        </div>
      </div>
    </div>
  )
}

export default Profile