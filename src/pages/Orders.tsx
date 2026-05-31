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
    // 未登录，跳转到登录页
    if (!phone) {
      navigate('/login')
      return
    }

    // 已登录，根据手机号获取订单
    fetch(`/api/orders?phone=${phone}`)
      .then(res => {
        if (!res.ok) throw new Error('服务器响应错误 ' + res.status)
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          // 过滤掉无效数据（订单号或菜品缺失）
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

  if (!phone) return null // 等待跳转时不渲染

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
                <span>¥{Number(order.totalPrice).toFixed(2)}</span>
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
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>{dish.name} x{dish.quantity}</span>
                  <span>¥{((dish.price || 0) * (dish.quantity || 0)).toFixed(1)}</span>
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