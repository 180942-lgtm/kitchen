import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import { AppOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons'
import { ShoppingCartOutlined } from '@ant-design/icons'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Login from './pages/Login'
import TableOrder from './pages/TableOrder'
import PaySuccess from './pages/PaySuccess'
import OrderFail from './pages/OrderFail'
import useCartStore from './store/cartStore'

const tabs = [
  { key: '/shop', title: '点菜', icon: <AppOutline /> },
  { key: '/orders', title: '订单', icon: <UnorderedListOutline /> },
  { key: '/cart', title: '购物车', icon: <span id="cart-tab"><ShoppingCartOutlined /></span>, isCart: true },
  { key: '/profile', title: '我的', icon: <UserOutline /> },
]

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const totalCount = useCartStore(state => state.getTotalCount())
  const phone = localStorage.getItem('phone')

  if (!phone && location.pathname !== '/login' && !location.pathname.startsWith('/pay-success') && !location.pathname.startsWith('/order-fail')) {
    return <Navigate to="/login" replace />
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 内容区：无底部内边距，背景浅灰 */}
      <div style={{ flex: 1, overflow: 'auto', background: '#f8f8f8' }}>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/table/:tableId" element={<TableOrder />} />
          <Route path="/pay-success" element={<PaySuccess />} />
          <Route path="/order-fail" element={<OrderFail />} />
        </Routes>
      </div>

      {/* 包裹一层 div，强制 45px 高度，溢出隐藏 */}
      <div style={{ height: 45, overflow: 'hidden', background: '#fff', border: 'none' }}>
        <TabBar
          activeKey={location.pathname === '/' ? '/shop' : location.pathname}
          onChange={key => navigate(key)}
          safeArea={false}
          style={{ height: 45 }}
        >
          {tabs.map(item => (
            <TabBar.Item
              key={item.key}
              icon={item.icon}
              title={item.title}
              badge={item.isCart ? (totalCount > 0 ? totalCount : undefined) : undefined}
            />
          ))}
        </TabBar>
      </div>
    </div>
  )
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}