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
    body,
    table,
    td,
    div,
    p,
    span {
      font-family: Tahoma, Arial, "Segoe UI", sans-serif !important;
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
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>
<tr>
<td align="center">

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
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>

<div
  style="
    font-size:15px;
    font-weight:bold;
    color:#2563eb;
    direction:rtl;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>

<div
  style="
    display:inline-block;
    font-size:11px;
    color:#dc2626;
    font-weight:bold;
    background:#fef2f2;
    padding:4px 8px;
    border-radius:5px;
    direction:rtl;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>
<tr>

<!-- الأيقونة -->

<td
  width="43"
  valign="top"
  style="
    width:43px;
    padding-left:10px;
    direction:rtl;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>

<div
  style="
    width:34px;
    height:34px;
    line-height:34px;
    text-align:center;
    background:#fef2f2;
    border-radius:8px;
    font-size:18px;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>

<div
  style="
    font-size:19px;
    font-weight:bold;
    line-height:1.5;
    color:#111827;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
    margin-top:10px;
    margin-bottom:14px;
    padding:9px 12px;
    background:#f8fafc;
    border-right:3px solid #2563eb;
    border-radius:5px;
    color:#475569;
    font-size:12px;
    line-height:1.6;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>
  <strong
    style="
      color:#1e40af;
      font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>

<!-- نوع الوثيقة -->

<tr>

<td
  width="38%"
  dir="rtl"
  style="
    width:38%;
    padding:9px 12px;
    background:#f9fafb;
    color:#6b7280;
    font-size:12px;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>
  نوع الوثيقة
</td>

<td
  dir="rtl"
  style="
    padding:9px 12px;
    font-size:13px;
    font-weight:bold;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>
  ${categoryName}
</td>

</tr>


<!-- تاريخ الانتهاء -->

<tr>

<td
  dir="rtl"
  style="
    padding:9px 12px;
    background:#f9fafb;
    color:#6b7280;
    font-size:12px;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>
  تاريخ الانتهاء
</td>

<td
  dir="rtl"
  style="
    padding:9px 12px;
    font-size:13px;
    font-weight:bold;
    color:#dc2626;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>
  ${expiryDate}
</td>

</tr>


<!-- الوقت المتبقي -->

<tr>

<td
  dir="rtl"
  style="
    padding:9px 12px;
    background:#f9fafb;
    color:#6b7280;
    font-size:12px;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>
  الوقت المتبقي
</td>

<td
  dir="rtl"
  style="
    padding:9px 12px;
    font-size:13px;
    font-weight:bold;
    color:#dc2626;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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

<td
  dir="rtl"
  style="
    padding:9px 12px;
    background:#f9fafb;
    color:#6b7280;
    font-size:12px;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>
  رقم الوثيقة
</td>

<td
  dir="rtl"
  style="
    padding:9px 12px;
    font-size:13px;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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

<td
  dir="rtl"
  style="
    padding:9px 12px;
    background:#f9fafb;
    color:#6b7280;
    font-size:12px;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>
  صاحب الوثيقة
</td>

<td
  dir="rtl"
  style="
    padding:9px 12px;
    font-size:13px;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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

<td
  dir="rtl"
  style="
    padding:9px 12px;
    background:#f9fafb;
    color:#6b7280;
    font-size:12px;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
  "
>
  الدولة
</td>

<td
  dir="rtl"
  style="
    padding:9px 12px;
    font-size:13px;
    border-top:1px solid #eeeeee;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
    margin-top:10px;
    padding:8px 11px;
    background:#fffbeb;
    border-right:3px solid #f59e0b;
    border-radius:4px;
    font-size:12px;
    color:#92400e;
    line-height:1.5;
    direction:rtl;
    text-align:right;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
    padding:11px 18px;
    border-top:1px solid #eeeeee;
    text-align:center;
    font-size:10px;
    color:#9ca3af;
    line-height:1.5;
    direction:rtl;
    font-family:Tahoma,Arial,'Segoe UI',sans-serif;
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
