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
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],

      subject: `تنبيه: ${categoryName} على وشك الانتهاء`,

      html: `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="
  margin:0;
  padding:0;
  background:#f5f6f8;
  font-family:Arial,Tahoma,sans-serif;
  color:#1f2937;
">

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="padding:25px 12px;"
>
<tr>
<td align="center">

<table
  width="520"
  cellpadding="0"
  cellspacing="0"
  style="
    width:100%;
    max-width:520px;
    background:#ffffff;
    border:1px solid #e5e7eb;
    border-radius:10px;
    overflow:hidden;
  "
>


<!-- HEADER -->

<tr>
<td style="
  padding:18px 22px;
  border-bottom:1px solid #eeeeee;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>

<td>

<div style="
  font-size:17px;
  font-weight:bold;
  color:#2563eb;
">
  ALODAT
</div>

</td>

<td align="left">

<div style="
  font-size:11px;
  color:#dc2626;
  font-weight:bold;
">
  تنبيه
</div>

</td>

</tr>
</table>

</td>
</tr>


<!-- CONTENT -->

<tr>
<td style="
  padding:22px;
">


<div style="
  font-size:20px;
  font-weight:bold;
  margin-bottom:7px;
">
  تنبيه انتهاء الوثيقة
</div>

<div style="
  font-size:13px;
  color:#6b7280;
  margin-bottom:18px;
">
  يرجى مراجعة الوثيقة قبل انتهاء صلاحيتها.
</div>


<!-- DETAILS -->

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="
    border:1px solid #e5e7eb;
    border-radius:7px;
    overflow:hidden;
  "
>

<tr>

<td style="
  padding:10px 13px;
  background:#f9fafb;
  color:#6b7280;
  font-size:12px;
  width:38%;
">
  نوع الوثيقة
</td>

<td style="
  padding:10px 13px;
  font-size:13px;
  font-weight:bold;
">
  ${categoryName}
</td>

</tr>


<tr>

<td style="
  padding:10px 13px;
  background:#f9fafb;
  color:#6b7280;
  font-size:12px;
  border-top:1px solid #eeeeee;
">
  تاريخ الانتهاء
</td>

<td style="
  padding:10px 13px;
  font-size:13px;
  font-weight:bold;
  color:#dc2626;
  border-top:1px solid #eeeeee;
">
  ${expiryDate}
</td>

</tr>


<tr>

<td style="
  padding:10px 13px;
  background:#f9fafb;
  color:#6b7280;
  font-size:12px;
  border-top:1px solid #eeeeee;
">
  الوقت المتبقي
</td>

<td style="
  padding:10px 13px;
  font-size:13px;
  font-weight:bold;
  color:#dc2626;
  border-top:1px solid #eeeeee;
">
  ${timeRemaining}
</td>

</tr>


${
  documentNumber
    ? `
<tr>

<td style="
  padding:10px 13px;
  background:#f9fafb;
  color:#6b7280;
  font-size:12px;
  border-top:1px solid #eeeeee;
">
  رقم الوثيقة
</td>

<td style="
  padding:10px 13px;
  font-size:13px;
  border-top:1px solid #eeeeee;
">
  ${documentNumber}
</td>

</tr>
`
    : ''
}


${
  personName
    ? `
<tr>

<td style="
  padding:10px 13px;
  background:#f9fafb;
  color:#6b7280;
  font-size:12px;
  border-top:1px solid #eeeeee;
">
  صاحب الوثيقة
</td>

<td style="
  padding:10px 13px;
  font-size:13px;
  border-top:1px solid #eeeeee;
">
  ${personName}
</td>

</tr>
`
    : ''
}


${
  country
    ? `
<tr>

<td style="
  padding:10px 13px;
  background:#f9fafb;
  color:#6b7280;
  font-size:12px;
  border-top:1px solid #eeeeee;
">
  الدولة
</td>

<td style="
  padding:10px 13px;
  font-size:13px;
  border-top:1px solid #eeeeee;
">
  ${country}
</td>

</tr>
`
    : ''
}

</table>


${
  notes
    ? `
<div style="
  margin-top:12px;
  padding:9px 12px;
  background:#fffbeb;
  border-right:3px solid #f59e0b;
  font-size:12px;
  color:#92400e;
">
  ${notes}
</div>
`
    : ''
}


<!-- BUTTON -->

<div style="
  text-align:center;
  margin-top:18px;
">

<a
  href="https://alodat.net"
  style="
    display:inline-block;
    background:#2563eb;
    color:#ffffff;
    text-decoration:none;
    padding:10px 25px;
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


<!-- FOOTER -->

<tr>

<td style="
  padding:12px 20px;
  border-top:1px solid #eeeeee;
  text-align:center;
  font-size:10px;
  color:#9ca3af;
">

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
    console.error("Error sending email:", error);
    throw error;
  }
}
