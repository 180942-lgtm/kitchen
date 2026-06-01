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

// 路由守卫组件：未登录重定向到 /login
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const phone = localStorage.getItem('phone')
  if (!phone) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

const tabs = [
  { key: '/shop', title: '点菜', icon: <AppOutline /> },
  { key: '/orders', title: '订单', icon: <UnorderedListOutline /> },
  {
    key: '/cart',
    title: '购物车',
    icon: <span id="cart-tab"><ShoppingCartOutlined /></span>,
    isCart: true,
  },
  { key: '/profile', title: '我的', icon: <UserOutline /> },
]

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const totalCount = useCartStore(state => state.getTotalCount())

  // 如果当前路径是登录页，不显示底部 Tab
  if (location.pathname === '/login') {
    return (
      <div style={{ height: '100vh' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
          <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/table/:tableId" element={<ProtectedRoute><TableOrder /></ProtectedRoute>} />
          <Route path="/pay-success" element={<PaySuccess />} />
          <Route path="/order-fail" element={<OrderFail />} />
          <Route path="*" element={<Navigate to="/shop" replace />} />
        </Routes>
      </div>
      <TabBar
        activeKey={location.pathname === '/' ? '/shop' : location.pathname}
        onChange={key => navigate(key)}
        safeArea
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
  )
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}