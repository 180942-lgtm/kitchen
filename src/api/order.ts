export async function createOrder(params: {
  dishes: { name: string; price: number; quantity: number }[]
  totalPrice: number
  payMethod: 'alipay' | 'wechat'
}) {
  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return res.json()
}