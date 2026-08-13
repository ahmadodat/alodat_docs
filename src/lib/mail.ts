import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * حساب الوقت المتبقي حتى انتهاء الوثيقة
 *
 * يدعم:
 * 2026-08-25
 * 2026-08-25T23:59:59
 * 2026-08-25T23:59:59Z
 */
function getTimeRemaining(expiryDate: string): string {
  const now = new Date();
  const expiry = new Date(expiryDate);

  // التأكد من صحة التاريخ
  if (isNaN(expiry.getTime())) {
    return 'تاريخ غير صالح';
  }

  let diff = expiry.getTime() - now.getTime();

  // ==========================================
  // الوثيقة منتهية
  // ==========================================

  if (diff <= 0) {
    diff = Math.abs(diff);

    const days = Math.floor(
      diff / (1000 * 60 * 60 * 24)
    );

    diff %= 1000 * 60 * 60 * 24;

    const hours = Math.floor(
      diff / (1000 * 60 * 60)
    );

    diff %= 1000 * 60 * 60;

    const minutes = Math.floor(
      diff / (1000 * 60)
    );

    if (days > 0) {
      return `منتهية منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}${
        hours > 0
          ? ` و${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`
          : ''
      }`;
    }

    if (hours > 0) {
      return `منتهية منذ ${hours} ${
        hours === 1 ? 'ساعة' : 'ساعات'
      }`;
    }

    if (minutes > 0) {
      return `منتهية منذ ${minutes} ${
        minutes === 1 ? 'دقيقة' : 'دقائق'
      }`;
    }

    return 'منتهية الآن';
  }

  // ==========================================
  // الوثيقة لم تنتهِ
  // ==========================================

  const days = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );

  diff %= 1000 * 60 * 60 * 24;

  const hours = Math.floor(
    diff / (1000 * 60 * 60)
  );

  diff %= 1000 * 60 * 60;

  const minutes = Math.floor(
    diff / (1000 * 60)
  );

  // أكثر من يوم
  if (days > 0) {
    return `متبقي ${days} ${
      days === 1 ? 'يوم' : 'أيام'
    }${
      hours > 0
        ? ` و${hours} ${
            hours === 1 ? 'ساعة' : 'ساعات'
          }`
        : ''
    }`;
  }

  // أقل من يوم وأكثر من ساعة
  if (hours > 0) {
    return `متبقي ${hours} ${
      hours === 1 ? 'ساعة' : 'ساعات'
    }${
      minutes > 0
        ? ` و${minutes} ${
            minutes === 1 ? 'دقيقة' : 'دقائق'
          }`
        : ''
    }`;
  }

  // أقل من ساعة
  if (minutes > 0) {
    return `متبقي ${minutes} ${
      minutes === 1 ? 'دقيقة' : 'دقائق'
    }`;
  }

  return 'متبقي أقل من دقيقة';
}


/**
 * إرسال رسالة تنبيه انتهاء الوثيقة
 */
export async function sendExpiryAlertEmail({
  to,
  categoryName,
  expiryDate,
  personName,
  country,
  documentNumber,
  notes,
}: {
  to: string;
  categoryName: string;
  expiryDate: string;
  personName?: string;
  country?: string;
  documentNumber?: string;
  notes?: string | null;
}) {
  try {

    // حساب الوقت المتبقي تلقائياً
    const timeRemaining = getTimeRemaining(expiryDate);

    // هل الوثيقة منتهية؟
    const isExpired =
      new Date(expiryDate).getTime() <= Date.now();

    await resend.emails.send({

      from:
        process.env.EMAIL_FROM ||
        'onboarding@resend.dev',

      to: [to],

      subject: isExpired
        ? `⚠️ وثيقة ${categoryName} منتهية`
        : `⚠️ تنبيه: وثيقة ${categoryName} على وشك الانتهاء`,

      html: `
<!DOCTYPE html>

<html
  lang="ar"
  dir="rtl"
>

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>
تنبيه انتهاء الوثيقة
</title>

</head>


<body
  dir="rtl"
  style="
    margin:0;
    padding:0;
    background:#f4f6f8;
    font-family:
      Arial,
      Tahoma,
      sans-serif;
    direction:rtl;
    text-align:right;
    color:#1f2937;
  "
>


<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  dir="rtl"
  style="
    width:100%;
    padding:25px 12px;
    direction:rtl;
  "
>

<tr>

<td align="center">


<!-- MAIN CONTAINER -->

<table
  width="500"
  cellpadding="0"
  cellspacing="0"
  border="0"
  dir="rtl"
  style="
    width:100%;
    max-width:500px;
    background:#ffffff;
    border:1px solid #e5e7eb;
    border-radius:10px;
    overflow:hidden;
    direction:rtl;
  "
>


<!-- ================= HEADER ================= -->

<tr>

<td
  dir="rtl"
  style="
    padding:17px 20px;
    border-bottom:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  dir="rtl"
  style="
    direction:rtl;
  "
>

<tr>


<!-- LOGO -->

<td
  align="right"
  style="
    text-align:right;
  "
>

<div
  style="
    font-size:17px;
    font-weight:bold;
    color:#2563eb;
  "
>
  ALODAT
</div>

<div
  style="
    font-size:10px;
    color:#9ca3af;
    margin-top:2px;
  "
>
  نظام إدارة الوثائق
</div>

</td>


<!-- STATUS -->

<td
  align="left"
  style="
    text-align:left;
  "
>

<span
  style="
    font-size:11px;
    font-weight:bold;
    color:${isExpired ? '#dc2626' : '#d97706'};
  "
>
  ${isExpired ? 'منتهية' : 'تنبيه'}
</span>

</td>


</tr>

</table>

</td>

</tr>


<!-- ================= CONTENT ================= -->

<tr>

<td
  dir="rtl"
  style="
    padding:22px 20px;
    direction:rtl;
    text-align:right;
  "
>


<!-- TITLE -->

<div
  style="
    font-size:20px;
    font-weight:bold;
    color:#111827;
    margin-bottom:5px;
    text-align:right;
  "
>
  ${isExpired ? 'الوثيقة منتهية' : 'تنبيه انتهاء الوثيقة'}
</div>


<div
  style="
    font-size:12px;
    color:#6b7280;
    line-height:1.7;
    margin-bottom:16px;
    text-align:right;
  "
>
  ${
    isExpired
      ? 'نود إعلامك بأن الوثيقة التالية قد انتهت صلاحيتها.'
      : 'نود إعلامك بأن الوثيقة التالية ستنتهي قريباً.'
  }
</div>


<!-- ================= DOCUMENT DETAILS ================= -->

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  dir="rtl"
  style="
    width:100%;
    border:1px solid #e5e7eb;
    border-radius:7px;
    overflow:hidden;
    direction:rtl;
  "
>


<!-- CATEGORY -->

<tr>

<td
  width="38%"
  align="right"
  style="
    padding:9px 12px;
    background:#f8fafc;
    color:#6b7280;
    font-size:12px;
    text-align:right;
    border-bottom:1px solid #eeeeee;
  "
>
  نوع الوثيقة
</td>

<td
  align="right"
  style="
    padding:9px 12px;
    font-size:13px;
    font-weight:bold;
    text-align:right;
    border-bottom:1px solid #eeeeee;
  "
>
  ${categoryName}
</td>

</tr>


<!-- EXPIRY DATE -->

<tr>

<td
  width="38%"
  align="right"
  style="
    padding:9px 12px;
    background:#f8fafc;
    color:#6b7280;
    font-size:12px;
    text-align:right;
    border-bottom:1px solid #eeeeee;
  "
>
  تاريخ الانتهاء
</td>

<td
  align="right"
  style="
    padding:9px 12px;
    font-size:13px;
    font-weight:bold;
    color:#dc2626;
    text-align:right;
    border-bottom:1px solid #eeeeee;
  "
>
  ${expiryDate}
</td>

</tr>


<!-- TIME REMAINING -->

<tr>

<td
  width="38%"
  align="right"
  style="
    padding:9px 12px;
    background:#f8fafc;
    color:#6b7280;
    font-size:12px;
    text-align:right;
    border-bottom:1px solid #eeeeee;
  "
>
  الحالة
</td>

<td
  align="right"
  style="
    padding:9px 12px;
    font-size:13px;
    font-weight:bold;
    color:${isExpired ? '#dc2626' : '#d97706'};
    text-align:right;
    border-bottom:1px solid #eeeeee;
  "
>
  ${timeRemaining}
</td>

</tr>


<!-- DOCUMENT NUMBER -->

${
  documentNumber
    ? `
<tr>

<td
  width="38%"
  align="right"
  style="
    padding:9px 12px;
    background:#f8fafc;
    color:#6b7280;
    font-size:12px;
    text-align:right;
    border-bottom:1px solid #eeeeee;
  "
>
  رقم الوثيقة
</td>

<td
  align="right"
  style="
    padding:9px 12px;
    font-size:13px;
    text-align:right;
    border-bottom:1px solid #eeeeee;
  "
>
  ${documentNumber}
</td>

</tr>
`
    : ''
}


<!-- PERSON -->

${
  personName
    ? `
<tr>

<td
  width="38%"
  align="right"
  style="
    padding:9px 12px;
    background:#f8fafc;
    color:#6b7280;
    font-size:12px;
    text-align:right;
    border-bottom:1px solid #eeeeee;
  "
>
  صاحب الوثيقة
</td>

<td
  align="right"
  style="
    padding:9px 12px;
    font-size:13px;
    text-align:right;
    border-bottom:1px solid #eeeeee;
  "
>
  ${personName}
</td>

</tr>
`
    : ''
}


<!-- COUNTRY -->

${
  country
    ? `
<tr>

<td
  width="38%"
  align="right"
  style="
    padding:9px 12px;
    background:#f8fafc;
    color:#6b7280;
    font-size:12px;
    text-align:right;
  "
>
  الدولة
</td>

<td
  align="right"
  style="
    padding:9px 12px;
    font-size:13px;
    text-align:right;
  "
>
  ${country}
</td>

</tr>
`
    : ''
}


</table>


<!-- ================= NOTES ================= -->

${
  notes
    ? `
<div
  dir="rtl"
  style="
    margin-top:12px;
    padding:9px 12px;
    background:#fffbeb;
    border-right:3px solid #f59e0b;
    border-radius:5px;
    font-size:11px;
    line-height:1.7;
    color:#92400e;
    text-align:right;
    direction:rtl;
  "
>

<strong>
ملاحظة:
</strong>

${notes}

</div>
`
    : ''
}


<!-- ================= BUTTON ================= -->

<div
  style="
    text-align:center;
    margin-top:18px;
  "
>

<a
  href="https://alodat.net"
  style="
    display:inline-block;
    background:#2563eb;
    color:#ffffff;
    text-decoration:none;
    padding:10px 26px;
    border-radius:6px;
    font-size:13px;
    font-weight:bold;
  "
>
  مراجعة الوثيقة
</a>

</div>


</td>

</tr>


<!-- ================= FOOTER ================= -->

<tr>

<td
  dir="rtl"
  style="
    padding:11px 20px;
    border-top:1px solid #eeeeee;
    text-align:center;
    direction:rtl;
    font-size:10px;
    color:#9ca3af;
  "
>

رسالة تلقائية من نظام ALODAT — يرجى عدم الرد.

</td>

</tr>


</table>

</td>

</tr>

</table>


</body>

</html>
      `,
    });

  } catch (error) {

    console.error(
      'Error sending email:',
      error
    );

    throw error;
  }
}
