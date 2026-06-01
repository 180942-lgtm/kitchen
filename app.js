const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'magic_kitchen',
  password: 'Wmq20011004...',   // 你的真实密码
  database: 'magic_kitchen',
  waitForConnections: true,
  connectionLimit: 10,
});

// 登录
app.post('/api/login', async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: '参数错误' });
  if (code !== '1234') return res.status(400).json({ error: '验证码错误（测试码1234）' });
  try {
    const [rows] = await db.execute('SELECT id FROM users WHERE phone = ?', [phone]);
    if (rows.length === 0) {
      await db.execute('INSERT INTO users (phone) VALUES (?)', [phone]);
    }
    const token = uuidv4();
    await db.execute('UPDATE users SET token = ? WHERE phone = ?', [token, phone]);
    res.json({ success: true, token, phone });
  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 下单（携带 phone）
app.post('/api/order', async (req, res) => {
  const { dishes, totalPrice, payMethod, phone } = req.body;
  if (!dishes || !totalPrice || !payMethod) return res.status(400).json({ error: '缺少参数' });
  const orderNo = uuidv4();
  try {
    await db.execute(
      'INSERT INTO orders (order_no, total_price, pay_method, phone, dishes) VALUES (?, ?, ?, ?, ?)',
      [orderNo, totalPrice, payMethod, phone || null, JSON.stringify(dishes)]
    );
    const mockPayUrl = `http://47.103.21.131/api/pay/mock?orderNo=${orderNo}`;
    res.json({ success: true, payUrl: mockPayUrl });
  } catch (err) {
    console.error('下单失败:', err);
    res.status(500).json({ error: '下单失败' });
  }
});

// 模拟支付回调
app.get('/api/pay/mock', async (req, res) => {
  const { orderNo } = req.query;
  if (!orderNo) return res.status(400).send('缺少订单号');
  try {
    await db.execute('UPDATE orders SET status = ?, paid_at = NOW() WHERE order_no = ?', ['paid', orderNo]);
    res.redirect(`http://47.103.21.131/pay-success?orderNo=${orderNo}`);
  } catch (err) {
    console.error('支付回调失败:', err);
    res.status(500).send('支付处理错误');
  }
});

// 订单列表（按手机号）
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
    console.error('获取订单列表失败:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 订单状态查询
app.get('/api/order/status', async (req, res) => {
  const { orderNo } = req.query;
  if (!orderNo) return res.status(400).json({ error: '缺少订单号' });
  try {
    const [rows] = await db.execute('SELECT status FROM orders WHERE order_no = ?', [orderNo]);
    if (rows.length === 0) return res.status(404).json({ error: '订单不存在' });
    res.json({ status: rows[0].status });
  } catch (err) {
    console.error('查询状态失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 订单详情
app.get('/api/order/detail', async (req, res) => {
  const { orderNo } = req.query;
  if (!orderNo) return res.status(400).json({ error: '缺少订单号' });
  try {
    const [rows] = await db.execute(
      'SELECT order_no, total_price, status, pay_method, dishes, created_at, paid_at FROM orders WHERE order_no = ?',
      [orderNo]
    );
    if (rows.length === 0) return res.status(404).json({ error: '订单不存在' });
    const order = rows[0];
    order.dishes = typeof order.dishes === 'string' ? JSON.parse(order.dishes) : order.dishes;
    res.json(order);
  } catch (err) {
    console.error('查询详情失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ 后端运行在 http://localhost:${PORT}`));