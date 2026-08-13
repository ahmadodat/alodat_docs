import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendExpiryAlertEmail({
  to,
  categoryName,
  expiryDate,
  timeRemaining,
  personName,
  country,
  documentNumber,
  notes,
}: {
  to: string;
  categoryName: string;
  expiryDate: string;
  timeRemaining: string;
  personName?: string;
  country?: string;
  documentNumber?: string;
  notes?: string | null;
}) {
  try {
    await resend.emails.send({
      from:
        process.env.EMAIL_FROM ||
        'نظام إدارة الوثائق الشخصية <onboarding@resend.dev>',

      to: [to],

      subject: `⚠️ تنبيه: ${categoryName} على وشك الانتهاء`,

      html: `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <title>تنبيه انتهاء الوثيقة</title>

  <style>
    html,
    body,
    table,
    tbody,
    tr,
    td,
    div,
    p,
    span,
    strong {
      font-family: Arial, sans-serif !important;
    }
  </style>

</head>

<body
  dir="rtl"
  style="
    margin:0;
    padding:0;
    background:#f5f6f8;
    color:#1f2937;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
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
    padding:22px 12px;
    direction:rtl;
    font-family:Arial,sans-serif;
  "
>
<tr>

<td
  align="center"
  style="
    font-family:Arial,sans-serif;
  "
>

<table
  width="520"
  cellpadding="0"
  cellspacing="0"
  border="0"
  dir="rtl"
  style="
    width:100%;
    max-width:520px;
    background:#ffffff;
    border:1px solid #e5e7eb;
    border-radius:10px;
    overflow:hidden;
    direction:rtl;
    font-family:Arial,sans-serif;
  "
>

<!-- ================= HEADER ================= -->

<tr>

<td
  dir="rtl"
  style="
    padding:18px 20px;
    border-bottom:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
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
    font-family:Arial,sans-serif;
  "
>

<tr>

<!-- اسم النظام -->

<td
  align="right"
  dir="rtl"
  style="
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>

<div
  style="
    font-size:16px;
    font-weight:bold;
    color:#2563eb;
    direction:rtl;
    font-family:Arial,sans-serif;
  "
>
  نظام إدارة الوثائق الشخصية
</div>

</td>


<!-- كلمة تنبيه -->

<td
  align="left"
  dir="rtl"
  style="
    direction:rtl;
    text-align:left;
    font-family:Arial,sans-serif;
  "
>

<div
  style="
    display:inline-block;
    font-size:12px;
    color:#dc2626;
    font-weight:bold;
    background:#fef2f2;
    padding:5px 9px;
    border-radius:5px;
    direction:rtl;
    font-family:Arial,sans-serif;
  "
>
  تنبيه
</div>

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
    padding:20px;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>


<!-- ================= TITLE ================= -->

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  dir="rtl"
  style="
    width:100%;
    direction:rtl;
    font-family:Arial,sans-serif;
  "
>

<tr>

<!-- الأيقونة -->

<td
  width="45"
  valign="top"
  style="
    width:45px;
    padding-left:10px;
    direction:rtl;
    font-family:Arial,sans-serif;
  "
>

<div
  style="
    width:36px;
    height:36px;
    line-height:36px;
    text-align:center;
    background:#fef2f2;
    border-radius:8px;
    font-size:19px;
    font-family:Arial,sans-serif;
  "
>
  ⚠️
</div>

</td>


<!-- العنوان -->

<td
  valign="middle"
  dir="rtl"
  style="
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>

<div
  style="
    font-size:20px;
    font-weight:bold;
    line-height:1.5;
    color:#111827;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  تنبيه انتهاء الوثيقة
</div>

</td>

</tr>

</table>


<!-- ================= REMINDER ================= -->

<div
  dir="rtl"
  style="
    margin-top:11px;
    margin-bottom:15px;
    padding:10px 13px;
    background:#f8fafc;
    border-right:3px solid #2563eb;
    border-radius:5px;
    color:#475569;
    font-size:13px;
    line-height:1.7;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>

<strong
  style="
    color:#1e40af;
    font-family:Arial,sans-serif;
  "
>
  تذكير:
</strong>

لا تنسَ تجديد الوثيقة قبل انتهاء صلاحيتها.

</div>


<!-- ================= DETAILS ================= -->

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
    font-family:Arial,sans-serif;
  "
>


<!-- نوع الوثيقة -->

<tr>

<!-- اليسار: Bold -->

<td
  width="38%"
  dir="rtl"
  style="
    width:38%;
    padding:10px 12px;
    background:#f9fafb;
    color:#6b7280;
    font-size:13px;
    font-weight:bold;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  نوع الوثيقة
</td>

<!-- اليمين: عادي -->

<td
  dir="rtl"
  style="
    padding:10px 12px;
    font-size:14px;
    font-weight:normal;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  ${categoryName}
</td>

</tr>


<!-- تاريخ الانتهاء -->

<tr>

<!-- اليسار: Bold -->

<td
  dir="rtl"
  style="
    padding:10px 12px;
    background:#f9fafb;
    color:#6b7280;
    font-size:13px;
    font-weight:bold;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  تاريخ الانتهاء
</td>

<!-- اليمين: عادي -->

<td
  dir="rtl"
  style="
    padding:10px 12px;
    font-size:14px;
    font-weight:normal;
    color:#dc2626;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  ${expiryDate}
</td>

</tr>


<!-- الوقت المتبقي -->

<tr>

<!-- اليسار: Bold -->

<td
  dir="rtl"
  style="
    padding:10px 12px;
    background:#f9fafb;
    color:#6b7280;
    font-size:13px;
    font-weight:bold;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  الوقت المتبقي
</td>

<!-- اليمين: عادي -->

<td
  dir="rtl"
  style="
    padding:10px 12px;
    font-size:14px;
    font-weight:normal;
    color:#dc2626;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  ${timeRemaining}
</td>

</tr>


<!-- رقم الوثيقة -->

${
  documentNumber
    ? `
<tr>

<!-- اليسار: Bold -->

<td
  dir="rtl"
  style="
    padding:10px 12px;
    background:#f9fafb;
    color:#6b7280;
    font-size:13px;
    font-weight:bold;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  رقم الوثيقة
</td>

<!-- اليمين: عادي -->

<td
  dir="rtl"
  style="
    padding:10px 12px;
    font-size:14px;
    font-weight:normal;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  ${documentNumber}
</td>

</tr>
`
    : ''
}


<!-- صاحب الوثيقة -->

${
  personName
    ? `
<tr>

<!-- اليسار: Bold -->

<td
  dir="rtl"
  style="
    padding:10px 12px;
    background:#f9fafb;
    color:#6b7280;
    font-size:13px;
    font-weight:bold;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  صاحب الوثيقة
</td>

<!-- اليمين: عادي -->

<td
  dir="rtl"
  style="
    padding:10px 12px;
    font-size:14px;
    font-weight:normal;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  ${personName}
</td>

</tr>
`
    : ''
}


<!-- الدولة -->

${
  country
    ? `
<tr>

<!-- اليسار: Bold -->

<td
  dir="rtl"
  style="
    padding:10px 12px;
    background:#f9fafb;
    color:#6b7280;
    font-size:13px;
    font-weight:bold;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  الدولة
</td>

<!-- اليمين: عادي -->

<td
  dir="rtl"
  style="
    padding:10px 12px;
    font-size:14px;
    font-weight:normal;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
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
    margin-top:11px;
    padding:9px 12px;
    background:#fffbeb;
    border-right:3px solid #f59e0b;
    border-radius:4px;
    font-size:13px;
    font-weight:normal;
    color:#92400e;
    line-height:1.6;
    direction:rtl;
    text-align:right;
    font-family:Arial,sans-serif;
  "
>
  ${notes}
</div>
`
    : ''
}


</td>

</tr>


<!-- ================= FOOTER ================= -->

<tr>

<td
  dir="rtl"
  style="
    padding:12px 18px;
    border-top:1px solid #eeeeee;
    text-align:center;
    font-size:11px;
    font-weight:normal;
    color:#9ca3af;
    line-height:1.5;
    direction:rtl;
    font-family:Arial,sans-serif;
  "
>

رسالة تلقائية من نظام إدارة الوثائق الشخصية — يرجى عدم الرد.

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
    console.error('Error sending email:', error);
    throw error;
  }
}
