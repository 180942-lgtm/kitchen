import { useNavigate } from 'react-router-dom'

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const phone = localStorage.getItem('phone')

  const handleLogout = () => {
    localStorage.clear()
    window.location.replace('/login')
  }

  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh', paddingBottom: 80 }}>
      {/* 顶部个人卡片（完全贴边） */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%)',
          padding: '30px 20px 24px',
          color: '#fff',
          borderRadius: '0 0 20px 20px',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              marginRight: 16,
            }}
          >
            👤
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{phone || '未登录'}</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>欢迎回来</div>
          </div>
        </div>
      </div>

      {/* 功能菜单卡片（左右撑满） */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          margin: '0 0 12px 0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        <div
          onClick={() => navigate('/orders')}
          style={{
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f5f5f5',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 16 }}>我的订单</span>
          <span style={{ color: '#ccc', fontSize: 18 }}>›</span>
        </div>
        <div
          style={{
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f5f5f5',
            color: '#bbb',
          }}
        >
          <span style={{ fontSize: 16 }}>充值（开发中）</span>
          <span style={{ fontSize: 18 }}>›</span>
        </div>
        <div
          onClick={() => navigate('/table/123')}
          style={{
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 16 }}>餐桌扫码点餐（演示桌号123）</span>
          <span style={{ color: '#ccc', fontSize: 18 }}>›</span>
        </div>
      </div>

      {/* 退出登录按钮 */}
      <div style={{ marginTop: 8 }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '16px 0',
            background: '#fff',
            border: '1px solid #e0e0e0',
            color: '#ff4d4f',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 600,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            letterSpacing: 1,
          }}
        >
          退出登录
        </button>
      </div>
    </div>
  )
}

export default Profile