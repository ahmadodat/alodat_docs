#!/bin/bash

# ===========================================
# سكربت تثبيت تطبيق إدارة الوثائق على Hostinger VPS
# ===========================================

set -e

echo "🚀 بدء تثبيت تطبيق إدارة الوثائق الشخصية..."
echo ""

# الألوان
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# التحقق من صلاحيات root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ يرجى تشغيل السكربت كـ root${NC}"
    echo "استخدم: sudo bash install.sh"
    exit 1
fi

echo -e "${GREEN}✓ صلاحيات root متوفرة${NC}"

# تحديث النظام
echo ""
echo -e "${YELLOW}📦 تحديث النظام...${NC}"
apt update && apt upgrade -y

# تثبيت Node.js
echo ""
echo -e "${YELLOW}📦 تثبيت Node.js 20...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# تثبيت PM2
echo ""
echo -e "${YELLOW}📦 تثبيت PM2...${NC}"
npm install -g pm2
echo -e "${GREEN}✓ PM2 مثبت${NC}"

# تثبيت Nginx
echo ""
echo -e "${YELLOW}📦 تثبيت Nginx...${NC}"
apt install nginx unzip -y
echo -e "${GREEN}✓ Nginx مثبت${NC}"

# إنشاء مجلد التطبيق
echo ""
echo -e "${YELLOW}📁 إنشاء مجلد التطبيق...${NC}"
mkdir -p /var/www/documents-app
cd /var/www/documents-app

# طلب رابط التحميل
echo ""
echo -e "${YELLOW}📥 أدخل رابط تحميل ملف المشروع (documents-app.zip):${NC}"
read -p "الرابط: " DOWNLOAD_URL

if [ -n "$DOWNLOAD_URL" ]; then
    wget "$DOWNLOAD_URL" -O documents-app.zip
    unzip -o documents-app.zip
    rm documents-app.zip
fi

# إعداد ملف البيئة
echo ""
echo -e "${YELLOW}⚙️ إعداد ملف البيئة...${NC}"

echo -e "${YELLOW}أدخل معلومات قاعدة البيانات:${NC}"
read -p "MYSQL_HOST [srv1252.hstgr.io]: " MYSQL_HOST
MYSQL_HOST=${MYSQL_HOST:-srv1252.hstgr.io}

read -p "MYSQL_USER [u418912083_alodat_docs]: " MYSQL_USER
MYSQL_USER=${MYSQL_USER:-u418912083_alodat_docs}

read -p "MYSQL_PASSWORD: " MYSQL_PASSWORD

read -p "MYSQL_DATABASE [u418912083_alodat_docs]: " MYSQL_DATABASE
MYSQL_DATABASE=${MYSQL_DATABASE:-u418912083_alodat_docs}

# إنشاء JWT_SECRET عشوائي
JWT_SECRET=$(openssl rand -base64 32)

cat > .env << EOF
MYSQL_HOST=$MYSQL_HOST
MYSQL_USER=$MYSQL_USER
MYSQL_PASSWORD=$MYSQL_PASSWORD
MYSQL_DATABASE=$MYSQL_DATABASE
JWT_SECRET=$JWT_SECRET
EOF

echo -e "${GREEN}✓ تم إنشاء ملف .env${NC}"

# تثبيت المتطلبات
echo ""
echo -e "${YELLOW}📦 تثبيت متطلبات Node.js...${NC}"
npm install

# بناء التطبيق
echo ""
echo -e "${YELLOW}🔨 بناء التطبيق...${NC}"
npm run build

# تشغيل التطبيق
echo ""
echo -e "${YELLOW}🚀 تشغيل التطبيق...${NC}"
pm2 delete documents-app 2>/dev/null || true
pm2 start npm --name "documents-app" -- start
pm2 save
pm2 startup

echo -e "${GREEN}✓ التطبيق يعمل على المنفذ 3000${NC}"

# إعداد Nginx
echo ""
echo -e "${YELLOW}🌐 إعداد Nginx...${NC}"

read -p "أدخل اسم الدومين (أو اتركه فارغاً للعمل بدون دومين): " DOMAIN_NAME

if [ -n "$DOMAIN_NAME" ]; then
    SERVER_NAME="$DOMAIN_NAME www.$DOMAIN_NAME"
else
    SERVER_NAME="_"
fi

cat > /etc/nginx/sites-available/documents-app << EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# تفعيل الموقع
ln -sf /etc/nginx/sites-available/documents-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# اختبار وإعادة تشغيل Nginx
nginx -t && systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}✓ Nginx معد ويعمل${NC}"

# إعداد الجدار الناري
echo ""
echo -e "${YELLOW}🔒 إعداد الجدار الناري...${NC}"
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

echo -e "${GREEN}✓ الجدار الناري مفعل${NC}"

# تثبيت SSL إذا كان هناك دومين
if [ -n "$DOMAIN_NAME" ]; then
    echo ""
    read -p "هل تريد تثبيت شهادة SSL؟ (y/n): " INSTALL_SSL
    if [ "$INSTALL_SSL" = "y" ]; then
        apt install certbot python3-certbot-nginx -y
        certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --non-interactive --agree-tos --email admin@$DOMAIN_NAME || true
    fi
fi

# الانتهاء
echo ""
echo "==========================================="
echo -e "${GREEN}✅ تم تثبيت التطبيق بنجاح!${NC}"
echo "==========================================="
echo ""
if [ -n "$DOMAIN_NAME" ]; then
    echo -e "🌐 افتح: ${GREEN}http://$DOMAIN_NAME${NC}"
else
    SERVER_IP=$(curl -s ifconfig.me)
    echo -e "🌐 افتح: ${GREEN}http://$SERVER_IP${NC}"
fi
echo ""
echo "أوامر مفيدة:"
echo "  pm2 status        - حالة التطبيق"
echo "  pm2 logs          - عرض السجلات"
echo "  pm2 restart all   - إعادة تشغيل"
echo ""
