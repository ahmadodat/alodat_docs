// مثال توضيحي لتحديث منطق الفحص في الـ Cron Job
const today = new Date();

// حساب الفرق بالأيام لكل وثيقة
const diffTime = document.expiryDate.getTime() - today.getTime();
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

// إرسال إشعار قبل 3 أشهر (حوالي 90 يوماً) أو قبل شهر واحد (حوالي 30 يوماً)
if (diffDays === 90 || diffDays === 30) {
  // تنفيذ إرسال الإشعار أو البريد الإلكتروني
  await sendExpiryNotification(document, diffDays);
}
