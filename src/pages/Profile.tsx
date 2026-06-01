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
      {/* 头部区域 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFB000 0%, #FF8C00 100%)',
          padding: '28px 20px 20px',
          color: '#fff',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          marginBottom: 16,
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
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>欢迎来到魔法小厨房</div>
          </div>
        </div>
      </div>

      {/* 功能菜单卡片 */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          margin: '0 12px 12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        <div
          onClick={() => navigate('/orders')}
          style={{
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f5f5f5',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 15 }}>
            <span style={{ marginRight: 8 }}>📋</span>我的订单
          </span>
          <span style={{ color: '#ccc', fontSize: 16 }}>›</span>
        </div>
        <div
          style={{
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f5f5f5',
            color: '#bbb',
          }}
        >
          <span style={{ fontSize: 15 }}>
            <span style={{ marginRight: 8 }}>💰</span>充值（开发中）
          </span>
          <span style={{ fontSize: 16 }}>›</span>
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
          <span style={{ fontSize: 15 }}>
            <span style={{ marginRight: 8 }}>🍽️</span>餐桌扫码点餐（演示桌号123）
          </span>
          <span style={{ color: '#ccc', fontSize: 16 }}>›</span>
        </div>
      </div>

      {/* 退出登录按钮 */}
      <div style={{ padding: '0 12px', marginTop: 8 }}>
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
            fontWeight: 600,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            cursor: 'pointer',
          }}
        >
          退出登录
        </button>
      </div>
    </div>
  )
}

export default Profile