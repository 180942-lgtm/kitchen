const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==================== 数据库 ====================
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'magic_kitchen',
  password: 'Wmq20011004...',   // 👈 你的真实密码
  database: 'magic_kitchen',
  waitForConnections: true,
  connectionLimit: 10,
});

// ==================== 配置 ====================
const USE_REAL_ALIPAY = false;               // 真实支付宝开关
const SERVER_HOST = 'http://47.103.21.131';  // 你的公网IP，通过Nginx代理，无需加端口
const SECRET_KEY = 'magic_kitchen_pay_2025'; // 模拟支付签名密钥（自定义，不泄露即可）

// 支付宝沙箱官方配置（已修正网关）
const ALIPAY_APP_ID = '2021006157677469';                                // 你的沙箱APPID
const ALIPAY_GATEWAY = 'https://openapi-sandbox.dl.alipaydev.com/gateway.do'; // ✅ 正确沙箱网关
const ALIPAY_PRIVATE_KEY = (() => {
  // 仅在真实支付时读取，模拟支付不读取
  if (!USE_REAL_ALIPAY) return '';
  try {
    return require('fs').readFileSync(__dirname + '/private_key.pem', 'ascii');
  } catch {
    console.error('⚠️ 缺少 private_key.pem，真实支付将无法工作');
    return '';
  }
})();

// ==================== 工具函数 ====================
// 模拟支付签名（HMAC-SHA256）
function generatePaySign(orderNo, timestamp) {
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(`${orderNo}:${timestamp}`);
  return hmac.digest('hex');
}

// 校验签名（5分钟内有效）
function verifyPaySign(orderNo, timestamp, sign) {
  if (Date.now() - Number(timestamp) > 5 * 60 * 1000) return false; // 过期
  return generatePaySign(orderNo, timestamp) === sign;
}

// 支付宝支付 URL 构建（真实支付时使用）
function buildAlipayUrl(orderNo, totalAmount) {
  const bizContent = JSON.stringify({
    subject: '魔法小厨房点餐',
    out_trade_no: orderNo,
    total_amount: totalAmount,
    product_code: 'QUICK_WAP_WAY',
    quit_url: `${SERVER_HOST}/order-fail?orderNo=${orderNo}`,
  });
  const params = {
    app_id: ALIPAY_APP_ID,
    method: 'alipay.trade.wap.pay',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, '+0800').replace('T', ' '),
    version: '1.0',
    notify_url: `${SERVER_HOST}/api/pay/notify/alipay`,
    return_url: `${SERVER_HOST}/pay-success?orderNo=${orderNo}`,
    biz_content: bizContent,
  };
  // RSA签名（需私钥）
  const signer = crypto.createSign('RSA-SHA256');
  const sortedKeys = Object.keys(params).sort();
  signer.update(sortedKeys.map(k => `${k}=${params[k]}`).join('&'));
  params.sign = signer.sign(ALIPAY_PRIVATE_KEY, 'base64');
  const query = new URLSearchParams(params).toString();
  return `${ALIPAY_GATEWAY}?${query}`;
}

// ==================== 登录 ====================
app.post('/api/login', async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: '参数错误' });
  if (code !== '1234') return res.status(400).json({ error: '验证码错误（测试码1234）' });
  try {
    const [rows] = await db.execute('SELECT id FROM users WHERE phone = ?', [phone]);
    if (rows.length === 0) await db.execute('INSERT INTO users (phone) VALUES (?)', [phone]);
    const token = uuidv4();
    await db.execute('UPDATE users SET token = ? WHERE phone = ?', [token, phone]);
    res.json({ success: true, token, phone });
  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ==================== 下单 ====================
app.post('/api/order', async (req, res) => {
  const { dishes, totalPrice, payMethod, phone } = req.body;
  if (!dishes || !totalPrice || !payMethod) return res.status(400).json({ error: '缺少参数' });

  const orderNo = uuidv4();
  try {
    await db.execute(
      'INSERT INTO orders (order_no, total_price, pay_method, phone, dishes) VALUES (?, ?, ?, ?, ?)',
      [orderNo, totalPrice, payMethod, phone || null, JSON.stringify(dishes)]
    );

    let payUrl;
    if (payMethod === 'alipay' && USE_REAL_ALIPAY && ALIPAY_PRIVATE_KEY) {
      payUrl = buildAlipayUrl(orderNo, totalPrice.toFixed(2));
    } else {
      // 模拟支付：生成签名链接
      const timestamp = Date.now();
      const sign = generatePaySign(orderNo, timestamp);
      payUrl = `${SERVER_HOST}/api/pay/mock?orderNo=${orderNo}&timestamp=${timestamp}&sign=${sign}`;
    }
    res.json({ success: true, orderNo, payUrl });
  } catch (err) {
    console.error('下单失败:', err);
    res.status(500).json({ error: '下单失败' });
  }
});

// ==================== 安全模拟支付（GET + 签名校验） ====================
app.get('/api/pay/mock', async (req, res) => {
  const { orderNo, timestamp, sign } = req.query;
  if (!orderNo || !timestamp || !sign) return res.status(400).send('参数错误');
  if (!verifyPaySign(orderNo, timestamp, sign)) return res.status(403).send('请求无效或已过期');

  try {
    const [orders] = await db.execute('SELECT status FROM orders WHERE order_no = ?', [orderNo]);
    if (orders.length === 0) return res.status(404).send('订单不存在');
    if (orders[0].status === 'paid') return res.redirect(`${SERVER_HOST}/pay-success?orderNo=${orderNo}&repeat=1`);

    await db.execute('UPDATE orders SET status = ?, paid_at = NOW() WHERE order_no = ?', ['paid', orderNo]);
    res.redirect(`${SERVER_HOST}/pay-success?orderNo=${orderNo}`);
  } catch (err) {
    console.error('支付处理失败:', err);
    res.status(500).send('服务器错误');
  }
});

// ==================== 支付宝异步通知（标准接口） ====================
app.post('/api/pay/notify/alipay', async (req, res) => {
  // 生产环境需要验签，此处略，仅处理状态
  const { out_trade_no, trade_status } = req.body;
  if (trade_status === 'TRADE_SUCCESS') {
    await db.execute('UPDATE orders SET status = ?, paid_at = NOW() WHERE order_no = ?', ['paid', out_trade_no]);
  }
  res.send('success');
});

// ==================== 订单列表 ====================
app.get('/api/orders', async (req, res) => {
  const { phone } = req.query;
  if (!phone) return res.json([]);
  try {
    const [rows] = await db.execute(
      'SELECT order_no, total_price, status, pay_method, dishes, created_at, paid_at FROM orders WHERE phone = ? ORDER BY created_at DESC',
      [phone]
    );
    const orders = rows.map(row => ({
      ...row,
      dishes: typeof row.dishes === 'string' ? JSON.parse(row.dishes) : (row.dishes || []),
    }));
    res.json(orders);
  } catch (err) {
    console.error('订单查询失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 启动
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ 后端运行在 http://localhost:${PORT}`);
  console.log(`✅ 模拟支付安全加固完成，签名5分钟有效`);
  console.log(`✅ 真实支付宝开关：${USE_REAL_ALIPAY ? '开启' : '关闭'}`);
});