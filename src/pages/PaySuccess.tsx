import { Result, Button } from 'antd-mobile'
import { useSearchParams, useNavigate } from 'react-router-dom'

const PaySuccess: React.FC = () => {
  const [searchParams] = useSearchParams()
  const orderNo = searchParams.get('orderNo')
  const navigate = useNavigate()

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', background: '#fff', minHeight: '100vh' }}>
      <Result
        status='success'
        title='支付成功！'
        description={orderNo ? `订单号：${orderNo}` : '订单号获取中...'}
      />
      <Button
        block
        color='primary'
        size='large'
        onClick={() => navigate('/', { replace: true })}
        style={{ marginTop: 24, background: '#FFB000', borderColor: '#FFB000' }}
      >
        继续点餐
      </Button>
    </div>
  )
}

export default PaySuccess