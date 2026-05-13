const crypto = require('crypto');
const Enrollment = require('../models/Enrollment');
const { error } = require('../utils/apiResponse');

function safeCompare(a, b) {
  const aBuf = Buffer.from(a || '', 'utf8');
  const bBuf = Buffer.from(b || '', 'utf8');
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

exports.paymentWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    if (!signature) return error(res, 'Signature invalide', 401);

    const rawBody = req.rawBody || JSON.stringify(req.body);
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(rawBody, 'utf8')
      .digest('hex');

    if (!safeCompare(signature, expectedSignature)) {
      return error(res, 'Signature invalide', 401);
    }

    const { event, data } = req.body;

    if (event === 'payment.succeeded') {
      const enrollment = await Enrollment.findByPk(data.enrollment_id);
      if (!enrollment) return error(res, 'Enrollment introuvable', 404);

      enrollment.payment_status = 'paid';
      enrollment.status = 'active';
      await enrollment.save();
    }

    return res.status(200).json({ success: true, received: true });
  } catch (err) {
    next(err);
  }
};