import { useState } from 'react'
import { Button, Popup, Radio, Space } from 'antd-mobile'
import { PlusOutlined } from '@ant-design/icons'
import type { Dish } from '../data/menu'
import useCartStore from '../store/cartStore'

interface Props {
  dish: Dish
  topRank?: number
}

const MenuItem: React.FC<Props> = ({ dish, topRank }) => {
  const addToCart = useCartStore(state => state.addToCart)
  const [specVisible, setSpecVisible] = useState(false)
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({})
  const [flyingDots, setFlyingDots] = useState<{ id: number; x: number; y: number; targetX: number; targetY: number }[]>([])

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
    const startX = buttonRect.left + buttonRect.width / 2
    const startY = buttonRect.top

    // 获取购物车图标位置
    const cartIcon = document.getElementById('cart-tab')
    let targetX = startX
    let targetY = startY
    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect()
      targetX = cartRect.left + cartRect.width / 2
      targetY = cartRect.top
    }

    const dot = {
      id: Date.now(),
      x: startX,
      y: startY,
      targetX,
      targetY,
    }
    setFlyingDots(prev => [...prev, dot])

    // 600ms 后移除圆点
    setTimeout(() => {
      setFlyingDots(prev => prev.filter(d => d.id !== dot.id))
    }, 600)

    if (dish.specs && dish.specs.length > 0) {
      setSpecVisible(true)
    } else {
      addToCart(dish)
    }
  }

  const handleSpecConfirm = () => {
    addToCart(dish, selectedSpecs)
    setSpecVisible(false)
  }

  const totalPrice = dish.specs
    ? dish.price + Object.values(selectedSpecs).reduce((sum, specVal) => {
        const spec = dish.specs!.find(s => s.name)
        const option = spec?.options.find(o => o.label === specVal)
        return sum + (option?.price || 0)
      }, 0)
    : dish.price

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 12, padding: 10, marginBottom: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', marginRight: 10 }}>
          <img src={dish.image} style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} alt="" />
          {topRank && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              background: topRank <= 3 ? '#FF4D4F' : '#FF7A45',
              color: '#fff',
              fontSize: 11,
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: '0 0 8px 0',
            }}>
              Top{topRank}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: '500' }}>{dish.name}</div>
          {dish.description && (
            <div style={{ fontSize: 12, color: '#999', margin: '4px 0' }}>{dish.description}</div>
          )}
          <div style={{ color: '#FF6B00', fontWeight: 'bold', fontSize: 16 }}>¥{totalPrice}</div>
        </div>
        <Button size='small' shape='rounded' style={{ background: '#FF6B00', color: '#fff', border: 'none' }} onClick={handleAdd}>
          <PlusOutlined />
        </Button>
      </div>

      {/* 飞入动画点 */}
      {flyingDots.map(dot => (
        <div
          key={dot.id}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: 12,
            height: 12,
            background: '#FF6B00',
            borderRadius: '50%',
            zIndex: 1000,
            pointerEvents: 'none',
            transform: `translate(${dot.x - 6}px, ${dot.y - 6}px)`,
            animation: `flyToCart 0.5s ease-in forwards`,
            '--targetX': `${dot.targetX - 6}px`,
            '--targetY': `${dot.targetY - 6}px`,
          } as React.CSSProperties}
        />
      ))}

      <style>{`
        @keyframes flyToCart {
          0% { transform: translate(${/* 由内联样式控制 */ 'var(--startX)'}, var(--startY)); }
          100% { transform: translate(var(--targetX), var(--targetY)); opacity: 0; }
        }
      `}</style>

      {/* 规格弹窗 */}
      <Popup visible={specVisible} onMaskClick={() => setSpecVisible(false)} bodyStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>选择规格</div>
        {dish.specs?.map(spec => (
          <div key={spec.name} style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>{spec.name}</div>
            <Radio.Group value={selectedSpecs[spec.name]} onChange={val => setSelectedSpecs({ ...selectedSpecs, [spec.name]: val as string })}>
              <Space direction='vertical'>
                {spec.options.map(opt => (
                  <Radio key={opt.label} value={opt.label}>
                    {opt.label} {opt.price > 0 ? `+¥${opt.price}` : ''}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        ))}
        <Button block color='warning' onClick={handleSpecConfirm} style={{ borderRadius: 20 }}>确定</Button>
      </Popup>
    </>
  )
}

export default MenuItem