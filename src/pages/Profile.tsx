import { List, Dialog, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const phone = localStorage.getItem('phone')

  const handleLogout = () => {
    Dialog.confirm({
      content: '确定要退出登录吗？',
      onConfirm: () => {
        localStorage.clear()  // 清除所有登录信息
        Toast.show('已退出登录')
        // 跳转到登录页并强制刷新，确保路由守卫生效
        window.location.href = '/login'
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
          {phone || '未登录'}
        </div>
      </div>

      <List>
        <List.Item arrow onClick={handleLogout}>
          退出登录
        </List.Item>
        <List.Item arrow onClick={() => navigate('/orders')}>
          我的订单
        </List.Item>
        <List.Item arrow>
          充值 (开发中)
        </List.Item>
        <List.Item arrow onClick={() => navigate('/table/123')}>
          🍽️ 餐桌扫码点餐 (演示桌号123)
        </List.Item>
      </List>
    </div>
  )
}

export default Profile