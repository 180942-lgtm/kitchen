import { Button, List, SwipeAction, Empty, Radio, Space } from 'antd-mobile'
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
    const phone = localStorage.getItem('phone')
    const dishes = items.map(item => ({
      name: item.dish.name,
      price: item.dish.price,
      quantity: item.quantity,
      specs: item.specs,
    }))

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishes, totalPrice: total, payMethod, phone }),
      })
      const data = await response.json()

      if (data.success && data.payUrl) {
        window.location.href = data.payUrl
      } else {
        alert('下单失败：' + (data.error || '未知错误'))
      }
    } catch (err) {
      alert('网络错误，请检查连接后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 12, paddingBottom: 80 }}>
      <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>购物车</div>
      {items.length === 0 ? (
        <Empty description="购物车是空的" />
      ) : (
        <>
          <List>
            {items.map(item => (
              <SwipeAction
                key={item.dish.id}
                rightActions={[{ key: 'delete', text: '删除', color: 'danger', onClick: () => removeFromCart(item.dish.id) }]}
              >
                <List.Item
                  prefix={<img src={item.dish.image} style={{ width: 48, height: 48, borderRadius: 8 }} />}
                  description={
                    <div>
                      <span>¥{item.dish.price}</span>
                      {item.specs && <span style={{ marginLeft: 8, color: '#999' }}>{Object.values(item.specs).join('/')}</span>}
                    </div>
                  }
                  extra={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Button size='mini' onClick={() => removeFromCart(item.dish.id)}>-</Button>
                      <span>{item.quantity}</span>
                      <Button size='mini' onClick={() => addToCart(item.dish, item.specs)}>+</Button>
                    </div>
                  }
                >
                  {item.dish.name}
                </List.Item>
              </SwipeAction>
            ))}
          </List>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>选择支付方式：</div>
            <Radio.Group value={payMethod} onChange={(val) => setPayMethod(val as 'alipay' | 'wechat')}>
              <Space>
                <Radio value="alipay">支付宝</Radio>
                <Radio value="wechat">微信</Radio>
              </Space>
            </Radio.Group>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 18, fontWeight: 'bold' }}>
            <span>合计</span>
            <span style={{ color: '#e94560' }}>¥{total.toFixed(2)}</span>
          </div>

          <Button
            color="primary"
            block
            size="large"
            onClick={handleCheckout}
            disabled={items.length === 0}
            loading={loading}
            style={{ borderRadius: 8 }}
          >
            去结算
          </Button>
        </>
      )}
    </div>
  )
}

export default Cart