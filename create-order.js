// Gaming League — create a Razorpay order (server-side; keeps Key Secret safe)
const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const amount = Math.round(Number(body.amount));
    if (!amount || amount < 1) return res.status(400).json({ error: 'Invalid amount' });

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await rzp.orders.create({
      amount: amount * 100,          // paise
      currency: 'INR',
      receipt: 'gl_' + (body.matchId || 'x') + '_' + Date.now(),
      notes: {
        matchId: String(body.matchId || ''),
        username: String(body.username || ''),
      },
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,   // public key id, safe to return
    });
  } catch (e) {
    res.status(500).json({ error: (e && e.message) || 'order failed' });
  }
};
