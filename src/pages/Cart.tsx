import { useState } from 'react'
import useCartStore from '../store/cartStore'

const Cart: React.FC = () => {
  const { items, addToCart, removeFromCart, getTotalPrice } = useCartStore()
  const [payMethod, setPayMethod] = useState<'alipay' | 'wechat'>('alipay')
  const [loading, setLoading] = useState(false)
  const total = getTotalPrice()

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    const phone = localStorage.getItem('phone') || ''
    const dishes = items.map(item => ({
      name: item.dish.name,
      price: item.dish.price,
      quantity: item.quantity,
      specs: item.specs,
    }))

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishes, totalPrice: total, payMethod, phone }),
      })
      const data = await res.json()
      if (data.success && data.payUrl) {
        window.location.href = data.payUrl
      } else {
        alert('下单失败：' + (data.error || '未知错误'))
      }
    } catch {
      alert('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: '#999',
        fontSize: 15,
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
        <div>购物车是空的</div>
      </div>
    )
  }

  return (
    <div style={{ padding: 12, paddingBottom: 100, background: '#f8f8f8', minHeight: '100vh' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: 18, fontWeight: 600 }}>购物车</h3>

      {/* 菜品列表 */}
      {items.map(item => (
        <div
          key={item.dish.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            borderRadius: 12,
            padding: 10,
            marginBottom: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <img
            src={item.dish.image}
            style={{ width: 70, height: 70, borderRadius: 10, objectFit: 'cover', marginRight: 12 }}
            alt=""
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{item.dish.name}</div>
            {item.specs && (
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                {Object.values(item.specs).join('/')}
              </div>
            )}
            <div style={{ color: '#FF6B00', fontWeight: 600, fontSize: 16 }}>
              ¥{item.dish.price}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => removeFromCart(item.dish.id)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                border: '1px solid #ddd',
                background: '#fff',
                fontSize: 16,
                lineHeight: '28px',
                textAlign: 'center',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              −
            </button>
            <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 500 }}>{item.quantity}</span>
            <button
              onClick={() => addToCart(item.dish, item.specs)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                border: 'none',
                background: '#FF6B00',
                color: '#fff',
                fontSize: 16,
                lineHeight: '28px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </div>
      ))}

      {/* 支付方式选择：两个卡片按钮 */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontWeight: 500, marginBottom: 10, fontSize: 15 }}>支付方式</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {(['alipay', 'wechat'] as const).map(method => (
            <div
              key={method}
              onClick={() => setPayMethod(method)}
              style={{
                flex: 1,
                padding: '12px 0',
                borderRadius: 12,
                border: payMethod === method ? '2px solid #FF6B00' : '1px solid #e0e0e0',
                background: payMethod === method ? '#FFF7E6' : '#fff',
                textAlign: 'center',
                cursor: 'pointer',
                fontWeight: payMethod === method ? 600 : 400,
                color: payMethod === method ? '#FF6B00' : '#333',
                fontSize: 15,
                transition: 'all 0.2s',
              }}
            >
              {method === 'alipay' ? '支付宝' : '微信'}
            </div>
          ))}
        </div>
      </div>

      {/* 合计与结算 */}
      <div style={{ marginTop: 16, background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>合计</span>
          <span style={{ color: '#FF6B00', fontSize: 20, fontWeight: 700 }}>
            ¥{total.toFixed(2)}
          </span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 0',
            background: loading ? '#ccc' : '#FF6B00',
            border: 'none',
            borderRadius: 25,
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(255,107,0,0.3)',
          }}
        >
          {loading ? '处理中...' : '去结算'}
        </button>
      </div>
    </div>
  )
}

export default Cart