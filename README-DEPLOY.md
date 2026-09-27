# Gaming League — Payment Backend (Razorpay + Vercel, 100% free)

This gives your app a secure payment server. **Free** — Vercel's free plan is plenty. No Firebase Blaze needed.

Your Razorpay **Key Secret never goes in the app** — it lives only on Vercel. That's what keeps payments safe.

## What you need
- A Razorpay account (you have one) → Dashboard → **Settings → API Keys** → generate:
  - **Key ID** (looks like `rzp_test_xxxx` or `rzp_live_xxxx`) — public, goes in the admin app
  - **Key Secret** — SECRET, goes ONLY in Vercel (never share, never in the app)
- A free Vercel account (vercel.com — sign up with GitHub or email)

## Deploy (about 10 minutes)

### Option A — Vercel website (easiest, no coding tools)
1. Put this whole `vercel-payments` folder on GitHub (new repo → upload files), OR use Option B.
2. Go to **vercel.com → Add New → Project → Import** your repo.
3. Before deploying, open **Environment Variables** and add:
   - `RAZORPAY_KEY_ID` = your Key ID
   - `RAZORPAY_KEY_SECRET` = your Key Secret
4. Click **Deploy**. You get a URL like `https://gl-payments.vercel.app`.

### Option B — Vercel CLI (from a computer)
```
npm i -g vercel
cd vercel-payments
vercel            # follow prompts, links the project
vercel env add RAZORPAY_KEY_ID         # paste your Key ID
vercel env add RAZORPAY_KEY_SECRET     # paste your Key Secret
vercel --prod     # deploys, prints your https URL
```

## Your two endpoints (after deploy)
- `https://YOUR-URL.vercel.app/api/create-order`
- `https://YOUR-URL.vercel.app/api/verify`

Test create-order in a browser terminal:
```
curl -X POST https://YOUR-URL.vercel.app/api/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":20,"matchId":1,"username":"test"}'
```
You should get back `{"orderId":"order_...","keyId":"rzp_..."}`.

## Connect it to the app
In the **GL Admin app → More → Payment Gateway**:
1. **Razorpay Key ID** → paste your `rzp_...` Key ID
2. **Payment API URL** → paste `https://YOUR-URL.vercel.app`  (no /api at the end)
3. Turn **Enable paid entry** ON
4. Publish

## Test first with Razorpay TEST mode
- Use your `rzp_test_...` Key ID + its test secret first.
- In checkout use Razorpay test cards / test UPI `success@razorpay`.
- When it all works, switch to `rzp_live_...` keys (redeploy env vars) and go live.

## How the flow works (secure)
```
Player taps PAY → app calls /api/create-order → Razorpay order made
   → Razorpay Checkout opens in the app (UPI / card)
   → player pays → app calls /api/verify → server checks the signature
   → verified → slot is booked. Money settles to your Razorpay business account.
```
A fake "success" can't book a slot, because only the server (with the Key Secret) can verify.

## Important (legal)
Only run **paid** entry once your lawyer has confirmed your OGAI e-sports registration.
Money must settle to your **business/current account** via Razorpay — never a personal savings account.
Keep it skill-only, 18+, with GST/TDS handled by your accountant.
