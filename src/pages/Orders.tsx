import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [message, setMessage] = useState('加载中...')
  const navigate = useNavigate()
  const phone = localStorage.getItem('phone')

  useEffect(() => {
    if (!phone) {
      navigate('/login')
      return
    }

    fetch(`/api/orders?phone=${encodeURIComponent(phone)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data)
          setMessage('')
        } else {
          setOrders([])
          setMessage('暂无订单')
        }
      })
      .catch(err => {
        setMessage('请求失败：' + err.message)
        setOrders([])
      })
  }, [phone, navigate])

  if (!phone) return null

  return (
    <div style={{ padding: 12, minHeight: '100vh', background: '#f8f8f8' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: 18, fontWeight: 600 }}>我的订单</h3>

      {message && (
        <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>{message}</div>
      )}

      {orders.map(order => (
        <div
          key={order.orderNo}
          style={{
            background: '#fff',
            borderRadius: 12,
            marginBottom: 10,
            padding: 14,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          {/* 头部信息 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>
                订单 #{order.orderNo?.slice(0, 8) || '无号'}
              </div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                {order.created_at ? new Date(order.created_at).toLocaleString() : ''}
              </div>
            </div>
            <span style={{
              color: order.status === 'paid' ? '#52c41a' : '#faad14',
              fontSize: 14,
              fontWeight: 500,
            }}>
              {order.status === 'paid' ? '已支付' : order.status === 'pending' ? '待支付' : order.status}
            </span>
          </div>

          {/* 金额 */}
          <div style={{ marginTop: 10, fontSize: 16, fontWeight: 'bold', color: '#FF6B00' }}>
            总金额：¥{Number(order.totalPrice || 0).toFixed(2)}
          </div>

          {/* 菜品列表（与点菜页卡片风格一致） */}
          {order.dishes && order.dishes.length > 0 && (
            <div style={{ marginTop: 12, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>菜品清单</div>
              {order.dishes.map((dish: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fafafa',
                    borderRadius: 10,
                    padding: '8px 10px',
                    marginBottom: 6,
                  }}
                >
                  {/* 菜品图标 */}
                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    background: '#eee',
                    marginRight: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ccc',
                    fontSize: 12,
                  }}>
                    🍽️
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{dish.name || '未知菜品'}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>x{dish.quantity || 1}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#FF6B00', fontWeight: 600 }}>
                      ¥{((dish.price || 0) * (dish.quantity || 1)).toFixed(2)}
                    </div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      单价 ¥{Number(dish.price || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Orders