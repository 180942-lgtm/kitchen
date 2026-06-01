import { useNavigate } from 'react-router-dom'

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const phone = localStorage.getItem('phone')

  const handleLogout = () => {
    localStorage.clear()
    window.location.replace('/login')
  }

  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #FFB000 0%, #FF8C00 100%)',
          padding: '28px 20px 20px',
          color: '#fff',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 60,
              height: 60,
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              marginRight: 14,
            }}
          >
            👤
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>{phone || '未登录'}</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>欢迎来到魔法小厨房</div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          margin: '0 12px 12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div
          onClick={() => navigate('/orders')}
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 15 }}>📋 我的订单</span>
          <span style={{ color: '#ccc' }}>›</span>
        </div>
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#ccc',
          }}
        >
          <span style={{ fontSize: 15 }}>💰 充值 (开发中)</span>
          <span>›</span>
        </div>
        <div
          onClick={() => navigate('/table/123')}
          style={{
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 15 }}>🍽️ 餐桌扫码点餐 (演示桌号123)</span>
          <span style={{ color: '#ccc' }}>›</span>
        </div>
      </div>

      <div style={{ padding: '0 12px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '14px 0',
            background: '#fff',
            border: '1px solid #ff4d4f',
            color: '#ff4d4f',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 'bold',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          退出登录
        </button>
      </div>
    </div>
  )
}

export default Profile