// Gaming League — hosted Razorpay checkout page (opens in the phone browser so UPI works)
module.exports = (req, res) => {
  const q = req.query || {};
  const esc = s => String(s == null ? '' : s).replace(/[<>"'&]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','&':'&amp;'}[c]));
  const oid = esc(q.oid), kid = esc(q.kid), amt = esc(q.amt), name = esc(q.name), email = esc(q.email), contact = esc(q.contact), title = esc(q.title || 'Tournament entry');

  const html = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gaming League — Secure Payment</title>
<style>
  body{margin:0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#0a1020;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:24px}
  .box{max-width:340px}
  .logo{width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#3b6bff,#7a3bff);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:24px;margin:0 auto 16px}
  h1{font-size:20px;margin:0 0 6px}
  p{color:#9fb0d5;font-size:14px;line-height:1.5}
  .amt{font-size:34px;font-weight:800;color:#ffc933;margin:10px 0}
  .btn{margin-top:16px;background:linear-gradient(135deg,#3b6bff,#7a3bff);color:#fff;border:0;border-radius:12px;padding:14px 22px;font-size:16px;font-weight:700;width:100%}
  .ok{color:#2fe089}.err{color:#ff6b8b}
</style></head>
<body><div class="box">
  <div class="logo">GL</div>
  <h1>Gaming League</h1>
  <div class="amt">₹${amt ? (parseInt(amt,10)/100) : ''}</div>
  <p>${title}</p>
  <p id="msg">Opening secure payment…</p>
  <button class="btn" id="payBtn" style="display:none" onclick="openPay()">Pay now</button>
</div>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
  var opts={key:${JSON.stringify(kid)},order_id:${JSON.stringify(oid)},amount:${JSON.stringify(amt)},currency:'INR',
    name:'Gaming League',description:${JSON.stringify(title)},
    prefill:{name:${JSON.stringify(name)},email:${JSON.stringify(email)},contact:${JSON.stringify(contact)}},
    theme:{color:'#6a3bff'},
    handler:function(r){document.getElementById('msg').innerHTML='<b class="ok">✅ Payment successful!</b><br>Return to the Gaming League app — your slot is being booked.';document.getElementById('payBtn').style.display='none';},
    modal:{ondismiss:function(){document.getElementById('msg').innerHTML='Payment cancelled. You can close this tab and try again in the app.';document.getElementById('payBtn').style.display='block';}}};
  function openPay(){try{var rzp=new Razorpay(opts);rzp.on('payment.failed',function(){document.getElementById('msg').innerHTML='<b class="err">Payment failed.</b><br>Close this tab and try again in the app.';document.getElementById('payBtn').style.display='block';});rzp.open();}catch(e){document.getElementById('msg').innerHTML='<b class="err">Could not start payment.</b> Please try again in the app.';}}
  window.onload=function(){openPay();};
</script>
</body></html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
};
