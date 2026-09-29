// Gaming League — check if a Razorpay order is paid (server-side, secure)
const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const orderId = body.orderId;
    if (!orderId) return res.status(400).json({ error: 'orderId required' });

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const o = await rzp.orders.fetch(orderId);
    const paid = o && o.status === 'paid';
    res.status(200).json({ paid: !!paid, status: o ? o.status : 'unknown', amountPaid: o ? o.amount_paid : 0 });
  } catch (e) {
    res.status(500).json({ paid: false, error: (e && e.message) || 'status failed' });
  }
};
