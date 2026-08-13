<!-- REMINDER -->

<div
  dir="rtl"
  style="
    margin-top:11px;
    padding:9px 12px;
    background:#eff6ff;
    border-right:3px solid #2563eb;
    border-radius:5px;
    font-size:12px;
    color:#1e40af;
    line-height:1.6;
    direction:rtl;
    text-align:right;
  "
>
  <strong>تذكير:</strong>
  لا تنسَ تجديد الوثيقة قبل انتهاء صلاحيتها.
</div>


<!-- NOTES -->

${
  notes
    ? `
<div
  dir="rtl"
  style="
    margin-top:9px;
    padding:8px 11px;
    background:#fffbeb;
    border-right:3px solid #f59e0b;
    border-radius:4px;
    font-size:12px;
    color:#92400e;
    line-height:1.5;
    direction:rtl;
    text-align:right;
  "
>
  ${notes}
</div>
`
    : ''
}
