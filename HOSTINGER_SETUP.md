# 🚀 دليل رفع التطبيق على Hostinger VPS

## المتطلبات
- VPS على Hostinger (Ubuntu 20.04 أو أحدث)
- Domain مربوط بالسيرفر (اختياري)

---

## الخطوة 1: الاتصال بالسيرفر

```bash
ssh root@YOUR_SERVER_IP
```

---

## الخطوة 2: تثبيت المتطلبات

```bash
# تحديث النظام
apt update && apt upgrade -y

# تثبيت Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# التحقق من التثبيت
node -v
npm -v

# تثبيت PM2 لإدارة التطبيق
npm install -g pm2

# تثبيت Nginx
apt install nginx -y

# تثبيت unzip
apt install unzip -y
```

---

## الخطوة 3: إنشاء مجلد التطبيق

```bash
# إنشاء المجلد
mkdir -p /var/www/documents-app
cd /var/www/documents-app
```

---

## الخطوة 4: رفع الملفات

### الطريقة 1: عبر wget (الأسهل)
```bash
# حمّل الملفات مباشرة (استبدل الرابط برابط التحميل)
wget YOUR_DOWNLOAD_LINK -O documents-app.zip
unzip documents-app.zip
rm documents-app.zip
```

### الطريقة 2: عبر FileZilla (FTP/SFTP)
1. افتح FileZilla
2. اتصل بـ: sftp://YOUR_SERVER_IP
3. المستخدم: root
4. كلمة المرور: كلمة مرور السيرفر
5. ارفع الملفات إلى /var/www/documents-app

### الطريقة 3: عبر Git
```bash
cd /var/www/documents-app
git clone https://github.com/YOUR_USERNAME/documents-app.git .
```

---

## الخطوة 5: إعداد ملف البيئة

```bash
cd /var/www/documents-app

# إنشاء ملف .env
cat > .env << 'EOF'
MYSQL_HOST=srv1252.hstgr.io
MYSQL_USER=u418912083_alodat_docs
MYSQL_PASSWORD=7$Du|mm05e^N
MYSQL_DATABASE=u418912083_alodat_docs
JWT_SECRET=قم-بتغيير-هذا-لقيمة-سرية-طويلة-جدا-123456789
EOF
```

---

## الخطوة 6: تثبيت وبناء التطبيق

```bash
cd /var/www/documents-app

# تثبيت المتطلبات
npm install

# بناء التطبيق
npm run build
```

---

## الخطوة 7: تشغيل التطبيق بـ PM2

```bash
# تشغيل التطبيق
pm2 start npm --name "documents-app" -- start

# حفظ الإعدادات
pm2 save

# التشغيل التلقائي عند إعادة تشغيل السيرفر
pm2 startup
```

### أوامر PM2 المفيدة:
```bash
pm2 status          # عرض حالة التطبيقات
pm2 logs            # عرض السجلات
pm2 restart all     # إعادة تشغيل
pm2 stop all        # إيقاف
```

---

## الخطوة 8: إعداد Nginx

```bash
# إنشاء ملف الإعدادات
cat > /etc/nginx/sites-available/documents-app << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;
    # أو استخدم _ للعمل مع أي domain
    # server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# تفعيل الموقع
ln -s /etc/nginx/sites-available/documents-app /etc/nginx/sites-enabled/

# إزالة الإعداد الافتراضي
rm /etc/nginx/sites-enabled/default

# اختبار الإعدادات
nginx -t

# إعادة تشغيل Nginx
systemctl restart nginx
systemctl enable nginx
```

---

## الخطوة 9: إعداد SSL (HTTPS) - اختياري لكن مهم

```bash
# تثبيت Certbot
apt install certbot python3-certbot-nginx -y

# الحصول على شهادة SSL
certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com

# التجديد التلقائي
certbot renew --dry-run
```

---

## الخطوة 10: إعداد الجدار الناري

```bash
# تفعيل UFW
ufw allow ssh
ufw allow 'Nginx Full'
ufw enable
```

---

## ✅ اختبار التطبيق

افتح المتصفح واذهب إلى:
- http://YOUR_SERVER_IP (إذا لم يكن لديك domain)
- http://YOUR_DOMAIN.com (إذا كان لديك domain)

---

## 🔧 استكشاف الأخطاء

### التطبيق لا يعمل:
```bash
pm2 logs documents-app
```

### مشكلة في Nginx:
```bash
tail -f /var/log/nginx/error.log
```

### مشكلة في قاعدة البيانات:
- تأكد من تفعيل Remote MySQL في لوحة تحكم Hostinger
- أضف IP السيرفر أو % للسماح بجميع الاتصالات

---

## 🔄 تحديث التطبيق مستقبلاً

```bash
cd /var/www/documents-app
git pull  # إذا كنت تستخدم Git
# أو ارفع الملفات الجديدة

npm install
npm run build
pm2 restart documents-app
```
