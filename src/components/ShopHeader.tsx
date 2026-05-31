import { shopInfo } from '../data/menu'

const ShopHeader: React.FC = () => {
  return (
    <div style={{ background: '#fff' }}>
      <img src={shopInfo.banner} style={{ width: '100%', height: 140, objectFit: 'cover' }} alt="" />
      <div style={{ padding: '12px' }}>
        <div style={{ fontWeight: 'bold', fontSize: 18 }}>{shopInfo.name}</div>
        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{shopInfo.notice}</div>
      </div>
    </div>
  )
}

export default ShopHeader