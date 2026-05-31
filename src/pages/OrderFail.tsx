import { Result, Button } from 'antd-mobile'
import { useSearchParams, useNavigate } from 'react-router-dom'

const OrderFail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const orderNo = searchParams.get('orderNo')
  const navigate = useNavigate()

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', background: '#fff', minHeight: '100vh' }}>
      <Result status='warning' title='支付失败或已取消' description={`订单号：${orderNo || '未知'}，您可以重新下单。`} />
      <Button block color='primary' size='large' onClick={() => navigate('/', { replace: true })} style={{ marginTop: 24, background: '#FFB000', borderColor: '#FFB000' }}>
        返回首页
      </Button>
    </div>
  )
}

export default OrderFail