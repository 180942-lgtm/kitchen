const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const fs = require('fs');

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
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const fs = require('fs');
const querystring = require('querystring');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'magic_kitchen',
  password: 'Wmq20011004...',   // 你的真实密码
  database: 'magic_kitchen',
  waitForConnections: true,
  connectionLimit: 10,
});

// ========== 核心配置 ==========
const USE_REAL_ALIPAY = true;
const SERVER_HOST = 'http://47.103.21.131';   // 不带端口，Nginx 代理
const ALIPAY_APP_ID = '9021000164632391';
const ALIPAY_GATEWAY = 'https://openapi-sandbox.dl.alipaydev.com/gateway.do';

// 读取私钥
const privateKey = fs.readFileSync(__dirname + '/private_key.pem', 'utf8');

// 支付宝沙箱的 AES 密钥（从你的开发设置中获取）
const AES_KEY = 'F9Pdp1q/iEFoLnl3/yuapw==';

// AES-128-ECB 加密函数
function aesEncrypt(data, key) {
  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key, 'base64'), null);
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]).toString('base64');
}

function rsaSign(data) {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data, 'utf8');
  return sign.sign(privateKey, 'base64');
}

function getAlipayTime() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function createPayUrl(orderNo, totalAmount) {
  // 业务参数原文
  const bizContent = JSON.stringify({
    out_trade_no: orderNo,
    total_amount: Number(totalAmount).toFixed(2),
    subject: '魔法小厨房点餐',
    product_code: 'QUICK_WAP_WAY',
    quit_url: `${SERVER_HOST}/order-fail?orderNo=${orderNo}`,
  });

  // 对 biz_content 进行 AES 加密
  const encryptedBiz = aesEncrypt(bizContent, AES_KEY);

  const params = {
    app_id: ALIPAY_APP_ID,
    biz_content: encryptedBiz,         // 使用加密后的值
    charset: 'utf-8',
    method: 'alipay.trade.wap.pay',
    notify_url: `${SERVER_HOST}/api/pay/notify/alipay`,
    return_url: `${SERVER_HOST}/pay-success?orderNo=${orderNo}`,
    sign_type: 'RSA2',
    timestamp: getAlipayTime(),
    version: '1.0',
    encrypt_type: 'AES',              // 告诉网关已加密
  };

  const sortedKeys = Object.keys(params).sort();
  const signStr = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  params.sign = rsaSign(signStr);

  return ALIPAY_GATEWAY + '?' + querystring.stringify(params);
}

// ========== 登录 ==========
app.post('/api/login', async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.json({ success: false, error: '参数错误' });
  if (code !== '1234') return res.json({ success: false, error: '验证码错误' });
  try {
    const [rows] = await db.execute('SELECT id FROM users WHERE phone = ?', [phone]);
    if (rows.length === 0) await db.execute('INSERT INTO users (phone) VALUES (?)', [phone]);
    const token = uuidv4();
    await db.execute('UPDATE users SET token = ? WHERE phone = ?', [token, phone]);
    res.json({ success: true, token, phone });
  } catch (err) {
    res.json({ success: false, error: '登录失败' });
  }
});

// ========== 下单 ==========
app.post('/api/order', async (req, res) => {
  const { dishes, totalPrice, payMethod, phone } = req.body;
  if (!dishes || !totalPrice || !payMethod) return res.json({ success: false, error: '缺少参数' });

  const orderNo = uuidv4();
  try {
    await db.execute(
      'INSERT INTO orders (order_no, total_price, pay_method, phone, dishes) VALUES (?, ?, ?, ?, ?)',
      [orderNo, totalPrice, payMethod, phone || null, JSON.stringify(dishes)]
    );

    let payUrl = '';
    if (payMethod === 'alipay' && USE_REAL_ALIPAY) {
      payUrl = createPayUrl(orderNo, totalPrice);
    } else {
      // 安全模拟支付
      const timestamp = Date.now();
      const sign = crypto.createHmac('sha256', 'magic_key')
        .update(`${orderNo}_${timestamp}`)
        .digest('hex');
      payUrl = `${SERVER_HOST}/api/pay/mock?orderNo=${orderNo}&t=${timestamp}&sign=${sign}`;
    }

    res.json({ success: true, orderNo, payUrl });
  } catch (err) {
    console.error('下单失败:', err);
    res.json({ success: false, error: '下单失败' });
  }
});

// ========== 安全模拟支付 ==========
app.get('/api/pay/mock', async (req, res) => {
  const { orderNo, t, sign } = req.query;
  const checkSign = crypto.createHmac('sha256', 'magic_key')
    .update(`${orderNo}_${t}`)
    .digest('hex');
  if (checkSign !== sign || Date.now() - Number(t) > 5 * 60 * 1000) {
    return res.send('无效请求');
  }

  await db.execute('UPDATE orders SET status = "paid", paid_at = NOW() WHERE order_no = ?', [orderNo]);
  res.redirect(`${SERVER_HOST}/pay-success?orderNo=${orderNo}`);
});

// ========== 支付宝异步通知 ==========
app.post('/api/pay/notify/alipay', (req, res) => {
  if (req.body.trade_status === 'TRADE_SUCCESS') {
    db.execute('UPDATE orders SET status = "paid", paid_at = NOW() WHERE order_no = ?', [req.body.out_trade_no]);
  }
  res.send('success');
});

// ========== 订单列表 ==========
app.get('/api/orders', async (req, res) => {
  const { phone } = req.query;
  if (!phone) return res.json([]);
  const [rows] = await db.execute('SELECT * FROM orders WHERE phone = ? ORDER BY created_at DESC', [phone]);
  res.json(rows.map(row => ({
    ...row,
    dishes: JSON.parse(row.dishes || '[]')
  })));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ 服务运行在 http://0.0.0.0:${PORT}`);
  console.log(`✅ 支付宝沙箱配置：APPID=${ALIPAY_APP_ID}，已开启AES加密`);
});