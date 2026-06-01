import { List, Dialog, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const phone = localStorage.getItem('phone')
  const isLoggedIn = !!phone

  const handleLogout = () => {
    Dialog.confirm({
      content: '确定要退出登录吗？',
      onConfirm: () => {
        localStorage.removeItem('phone')
        localStorage.removeItem('token')
        Toast.show('已退出登录')
        window.location.reload()
      },
    })
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
          {isLoggedIn ? phone : '未登录'}
        </div>
      </div>

      <List>
        {isLoggedIn ? (
          <List.Item arrow onClick={handleLogout}>
            退出登录
          </List.Item>
        ) : (
          <List.Item arrow onClick={() => navigate('/login')}>
            登录/注册
          </List.Item>
        )}
        <List.Item arrow onClick={() => navigate('/orders')}>
          我的订单
        </List.Item>
        <List.Item arrow>
          充值 (开发中)
        </List.Item>
        <List.Item arrow onClick={() => {
          navigate('/table/123')
        }}>
          🍽️ 餐桌扫码点餐 (演示桌号123)
        </List.Item>
      </List>
    </div>
  )
}

export default Profile