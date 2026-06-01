import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Orders: React.FC = () => {
  const [rawText, setRawText] = useState('加载中...')
  const [orders, setOrders] = useState<any[]>([])
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
        // 直接展示原始数据，不做过滤，方便你查看实际内容
        if (Array.isArray(data)) {
          setOrders(data)
          setRawText(`共 ${data.length} 条记录`)
        } else {
          setRawText('返回数据不是数组：' + JSON.stringify(data))
        }
      })
      .catch(err => setRawText('请求失败：' + err.message))
  }, [phone, navigate])

  if (!phone) return null

  return (
    <div style={{ padding: 12, background: '#f8f8f8', minHeight: '100vh' }}>
      <h3>我的订单</h3>
      <div style={{ background: '#fff3cd', padding: 8, borderRadius: 6, marginBottom: 12, fontSize: 13 }}>
        {rawText}
      </div>

      {orders.length === 0 && rawText.includes('共 0 条') ? (
        <div style={{ textAlign: 'center', padding: 20 }}>暂无订单</div>
      ) : (
        orders.map((order, idx) => (
          <div key={order.orderNo || idx} style={{ background: '#fff', borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div><b>订单 #{order.orderNo ? order.orderNo.slice(0,8) : '无号'}</b></div>
            <div>金额：¥{order.totalPrice}</div>
            <div>状态：{order.status}</div>
            <div>时间：{order.created_at ? new Date(order.created_at).toLocaleString() : ''}</div>
            <div style={{ marginTop: 8 }}>
              {order.dishes && order.dishes.map((dish: any, i: number) => (
                <div key={i}>{dish.name} x{dish.quantity} ¥{dish.price}</div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Orders