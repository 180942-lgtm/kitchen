import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedMap, setExpandedMap] = useState<{ [key: string]: boolean }>({})
  const navigate = useNavigate()
  const phone = localStorage.getItem('phone')

  useEffect(() => {
    if (!phone) {
      navigate('/login')
      return
    }

    fetch(`/api/orders?phone=${encodeURIComponent(phone)}`)
      .then(res => {
        if (!res.ok) throw new Error('服务器响应错误 ' + res.status)
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          const validOrders = data.filter((o: any) => o.orderNo && Array.isArray(o.dishes))
          setOrders(validOrders)
        } else {
          setError('数据格式错误')
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [phone, navigate])

  const toggleExpand = (orderNo: string) => {
    setExpandedMap(prev => ({ ...prev, [orderNo]: !prev[orderNo] }))
  }

  if (!phone) return null

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>加载中...</div>
  }

  if (error) {
    return <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>出错了：{error}</div>
  }

  if (orders.length === 0) {
    return <div style={{ padding: 20, textAlign: 'center' }}>暂无订单</div>
  }

  return (
    <div style={{ padding: 12, minHeight: '100vh', background: '#f8f8f8' }}>
      <h3>我的订单</h3>
      {orders.map(order => (
        <div
          key={order.orderNo}
          style={{
            background: '#fff',
            borderRadius: 8,
            marginBottom: 8,
            padding: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <div
            onClick={() => toggleExpand(order.orderNo)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <div>
              <div>
                <b>订单 #{order.orderNo.slice(0, 8)}</b>
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>
                {order.created_at ? new Date(order.created_at).toLocaleString() : ''}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: order.status === 'paid' ? 'green' : 'orange' }}>
                {order.status === 'paid' ? '已支付' : '待支付'}
              </span>
              <span>{expandedMap[order.orderNo] ? '▲' : '▼'}</span>
            </div>
          </div>

          {expandedMap[order.orderNo] && (
            <div style={{ marginTop: 12, borderTop: '1px solid #eee', paddingTop: 12 }}>
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>总金额</span>
                <span style={{ fontWeight: 'bold', color: '#FF6B00' }}>¥{Number(order.totalPrice).toFixed(2)}</span>
              </div>
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>支付方式</span>
                <span>
                  {order.payMethod === 'alipay' ? '支付宝' : order.payMethod === 'wechat' ? '微信' : order.payMethod}
                </span>
              </div>
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>下单时间</span>
                <span>{order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</span>
              </div>
              {order.paid_at && (
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>支付时间</span>
                  <span>{new Date(order.paid_at).toLocaleString()}</span>
                </div>
              )}

              <div style={{ fontWeight: 'bold', margin: '8px 0 4px' }}>菜品清单：</div>
              {order.dishes.map((dish: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fafafa',
                    borderRadius: 6,
                    padding: '6px 10px',
                    marginBottom: 6,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 500 }}>{dish.name}</span>
                    <span style={{ color: '#999', marginLeft: 8 }}>x{dish.quantity}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#999', fontSize: 12 }}>¥{Number(dish.price).toFixed(2)}</span>
                    <span style={{ marginLeft: 8, fontWeight: 500 }}>
                      ¥{((Number(dish.price) || 0) * (dish.quantity || 1)).toFixed(2)}
                    </span>
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