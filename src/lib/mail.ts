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

      subject: `⚠️ تنبيه: وثيقة ${categoryName} على وشك الانتهاء`,

      html: `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>تنبيه انتهاء الوثيقة</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Tahoma,
        Arial,
        sans-serif;
      color: #0f172a;
    }

    table {
      border-spacing: 0;
    }

    @media only screen and (max-width: 600px) {

      .container {
        width: 100% !important;
        border-radius: 0 !important;
      }

      .content {
        padding: 25px 18px !important;
      }

      .header {
        padding: 28px 20px !important;
      }

      .footer {
        padding: 20px !important;
      }

      .title {
        font-size: 22px !important;
      }

      .remaining {
        font-size: 24px !important;
      }

      .info-label {
        font-size: 12px !important;
      }

      .info-value {
        font-size: 14px !important;
      }

      .button {
        display: block !important;
        width: auto !important;
      }
    }
  </style>

</head>

<body>

  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding: 35px 15px;">

        <!-- MAIN CONTAINER -->
        <table
          class="container"
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:600px;
            max-width:600px;
            background:#ffffff;
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 12px 40px rgba(15,23,42,0.10);
          "
        >

          <!-- ================= HEADER ================= -->

          <tr>
            <td
              class="header"
              style="
                padding:32px 38px;
                background:
                  linear-gradient(
                    135deg,
                    #0f172a 0%,
                    #172554 55%,
                    #1e3a8a 100%
                  );
              "
            >

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>

                  <td align="right">

                    <div
                      style="
                        font-size:11px;
                        font-weight:700;
                        letter-spacing:2px;
                        color:#93c5fd;
                        margin-bottom:8px;
                      "
                    >
                      ALODAT
                    </div>

                    <div
                      class="title"
                      style="
                        color:#ffffff;
                        font-size:24px;
                        font-weight:700;
                        line-height:1.4;
                      "
                    >
                      تنبيه انتهاء الوثيقة
                    </div>

                    <div
                      style="
                        color:#cbd5e1;
                        font-size:13px;
                        margin-top:6px;
                      "
                    >
                      إشعار تلقائي من نظام إدارة الوثائق
                    </div>

                  </td>

                  <td
                    width="65"
                    align="left"
                    valign="top"
                  >

                    <div
                      style="
                        width:52px;
                        height:52px;
                        background:rgba(255,255,255,0.10);
                        border:1px solid rgba(255,255,255,0.15);
                        border-radius:15px;
                        text-align:center;
                        line-height:52px;
                        font-size:25px;
                      "
                    >
                      🛡️
                    </div>

                  </td>

                </tr>
              </table>

            </td>
          </tr>


          <!-- ================= ALERT ================= -->

          <tr>
            <td
              style="
                padding:22px 38px 0 38px;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  background:#fff7ed;
                  border:1px solid #fed7aa;
                  border-radius:14px;
                "
              >

                <tr>

                  <td
                    width="55"
                    align="center"
                    valign="middle"
                    style="padding:16px 8px;"
                  >

                    <div
                      style="
                        width:38px;
                        height:38px;
                        background:#ffedd5;
                        border-radius:50%;
                        line-height:38px;
                        font-size:18px;
                      "
                    >
                      ⚠️
                    </div>

                  </td>

                  <td
                    style="
                      padding:14px 10px 14px 18px;
                    "
                  >

                    <div
                      style="
                        font-size:14px;
                        font-weight:700;
                        color:#9a3412;
                        margin-bottom:4px;
                      "
                    >
                      يتطلب اتخاذ إجراء
                    </div>

                    <div
                      style="
                        font-size:12px;
                        color:#c2410c;
                        line-height:1.7;
                      "
                    >
                      إحدى الوثائق المسجلة في حسابك اقتربت من تاريخ انتهاء الصلاحية.
                    </div>

                  </td>

                </tr>

              </table>

            </td>
          </tr>


          <!-- ================= CONTENT ================= -->

          <tr>
            <td class="content" style="padding:30px 38px 35px 38px;">

              <p
                style="
                  margin:0 0 24px 0;
                  font-size:14px;
                  color:#475569;
                  line-height:1.9;
                "
              >
                مرحبًا،
                <br>
                نود إعلامك بأن النظام قام برصد وثيقة تحتاج إلى المتابعة.
                فيما يلي تفاصيل الوثيقة المسجلة لديك:
              </p>


              <!-- ================= REMAINING CARD ================= -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  margin-bottom:24px;
                  background:#f8fafc;
                  border:1px solid #e2e8f0;
                  border-radius:16px;
                "
              >

                <tr>

                  <td
                    align="center"
                    style="padding:24px 15px;"
                  >

                    <div
                      style="
                        font-size:11px;
                        color:#64748b;
                        font-weight:600;
                        margin-bottom:8px;
                      "
                    >
                      الوقت المتبقي
                    </div>

                    <div
                      class="remaining"
                      style="
                        font-size:28px;
                        font-weight:800;
                        color:#dc2626;
                        line-height:1.3;
                      "
                    >
                      ${timeRemaining}
                    </div>

                    <div
                      style="
                        width:75%;
                        max-width:350px;
                        height:6px;
                        background:#e2e8f0;
                        border-radius:10px;
                        margin:15px auto 0 auto;
                      "
                    >

                      <div
                        style="
                          width:85%;
                          height:6px;
                          background:#ef4444;
                          border-radius:10px;
                        "
                      ></div>

                    </div>

                  </td>

                </tr>

              </table>


              <!-- ================= DOCUMENT ================= -->

              <div
                style="
                  font-size:13px;
                  font-weight:700;
                  color:#0f172a;
                  margin-bottom:10px;
                "
              >
                📄 تفاصيل الوثيقة
              </div>


              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  margin-bottom:22px;
                  border:1px solid #e2e8f0;
                  border-radius:14px;
                  overflow:hidden;
                "
              >

                <!-- CATEGORY -->

                <tr>

                  <td
                    class="info-label"
                    width="38%"
                    style="
                      padding:15px;
                      background:#f8fafc;
                      color:#64748b;
                      font-size:12px;
                      border-bottom:1px solid #e2e8f0;
                    "
                  >
                    التصنيف
                  </td>

                  <td
                    class="info-value"
                    style="
                      padding:15px;
                      font-size:14px;
                      font-weight:700;
                      color:#2563eb;
                      border-bottom:1px solid #e2e8f0;
                    "
                  >
                    ${categoryName}
                  </td>

                </tr>


                <!-- DOCUMENT NUMBER -->

                ${
                  documentNumber
                    ? `
                <tr>

                  <td
                    class="info-label"
                    style="
                      padding:15px;
                      background:#f8fafc;
                      color:#64748b;
                      font-size:12px;
                      border-bottom:1px solid #e2e8f0;
                    "
                  >
                    رقم الوثيقة
                  </td>

                  <td
                    class="info-value"
                    style="
                      padding:15px;
                      font-size:14px;
                      font-weight:600;
                      color:#0f172a;
                      border-bottom:1px solid #e2e8f0;
                    "
                  >
                    ${documentNumber}
                  </td>

                </tr>
                `
                    : ''
                }


                <!-- EXPIRY -->

                <tr>

                  <td
                    class="info-label"
                    style="
                      padding:15px;
                      background:#f8fafc;
                      color:#64748b;
                      font-size:12px;
                    "
                  >
                    تاريخ الانتهاء
                  </td>

                  <td
                    class="info-value"
                    style="
                      padding:15px;
                      font-size:14px;
                      font-weight:700;
                      color:#dc2626;
                    "
                  >
                    ${expiryDate}
                  </td>

                </tr>

              </table>


              <!-- ================= PERSONAL INFO ================= -->

              ${
                personName || country
                  ? `

              <div
                style="
                  font-size:13px;
                  font-weight:700;
                  color:#0f172a;
                  margin-bottom:10px;
                "
              >
                👤 بيانات صاحب الوثيقة
              </div>

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  margin-bottom:22px;
                  border:1px solid #e2e8f0;
                  border-radius:14px;
                  overflow:hidden;
                "
              >

                ${
                  personName
                    ? `
                <tr>

                  <td
                    width="38%"
                    style="
                      padding:15px;
                      background:#f8fafc;
                      color:#64748b;
                      font-size:12px;
                      border-bottom:${
                        country ? '1px solid #e2e8f0' : '0'
                      };
                    "
                  >
                    الاسم
                  </td>

                  <td
                    style="
                      padding:15px;
                      font-size:14px;
                      font-weight:600;
                      color:#0f172a;
                      border-bottom:${
                        country ? '1px solid #e2e8f0' : '0'
                      };
                    "
                  >
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

                  <td
                    style="
                      padding:15px;
                      background:#f8fafc;
                      color:#64748b;
                      font-size:12px;
                    "
                  >
                    الدولة
                  </td>

                  <td
                    style="
                      padding:15px;
                      font-size:14px;
                      font-weight:600;
                      color:#0f172a;
                    "
                  >
                    ${country}
                  </td>

                </tr>
                `
                    : ''
                }

              </table>
              `
                  : ''
              }


              <!-- ================= NOTES ================= -->

              ${
                notes
                  ? `
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  margin-bottom:25px;
                  background:#fffbeb;
                  border:1px solid #fde68a;
                  border-right:4px solid #f59e0b;
                  border-radius:12px;
                "
              >

                <tr>

                  <td
                    style="
                      padding:16px 18px;
                      font-size:13px;
                      color:#92400e;
                      line-height:1.8;
                    "
                  >

                    <strong>💡 ملاحظات النظام</strong>

                    <br>

                    ${notes}

                  </td>

                </tr>

              </table>
              `
                  : ''
              }


              <!-- ================= BUTTON ================= -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="margin-top:28px;"
              >

                <tr>

                  <td align="center">

                    <a
                      href="https://alodat.net"
                      class="button"
                      style="
                        display:inline-block;
                        background:#2563eb;
                        color:#ffffff;
                        text-decoration:none;
                        padding:15px 32px;
                        border-radius:10px;
                        font-size:14px;
                        font-weight:700;
                        box-shadow:0 6px 18px rgba(37,99,235,0.25);
                      "
                    >
                      إدارة وتجديد الوثيقة
                      &nbsp; ←
                    </a>

                  </td>

                </tr>

              </table>


              <p
                style="
                  margin:18px 0 0 0;
                  text-align:center;
                  font-size:11px;
                  color:#94a3b8;
                  line-height:1.7;
                "
              >
                يُنصح بمراجعة الوثيقة واتخاذ الإجراء المناسب قبل انتهاء صلاحيتها.
              </p>

            </td>
          </tr>


          <!-- ================= FOOTER ================= -->

          <tr>

            <td
              class="footer"
              style="
                padding:22px 38px;
                background:#f8fafc;
                border-top:1px solid #e2e8f0;
                text-align:center;
              "
            >

              <div
                style="
                  font-size:13px;
                  font-weight:700;
                  color:#334155;
                  margin-bottom:6px;
                "
              >
                ALODAT
              </div>

              <div
                style="
                  font-size:11px;
                  color:#94a3b8;
                  line-height:1.7;
                "
              >
                هذه رسالة آلية صادرة من نظام إدارة الوثائق.
                <br>
                يرجى عدم الرد على هذه الرسالة.
              </div>

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
