# 🚀 دليل نشر شمس النيل على GitHub Pages
## SunNile — GitHub Pages Deployment Guide

---

## الخطوة ١: إنشاء Repository جديد على GitHub

1. اذهب إلى **github.com** وسجّل دخولك
2. اضغط **"+"** في أعلى اليمين ← **"New repository"**
3. اكتب اسم الـ repository: `sunnile`
4. اختر **Public** (ضروري لـ GitHub Pages المجاني)
5. **لا تُضف** README أو .gitignore
6. اضغط **"Create repository"**

---

## الخطوة ٢: رفع الملفات

### الطريقة السهلة (بدون Git):
1. في صفحة الـ repository الجديد، اضغط **"uploading an existing file"**
2. اسحب وأفلت جميع ملفات HTML السبعة دفعة واحدة:
   - `index.html`
   - `calculator.html`
   - `inverters.html`
   - `standards.html`
   - `future.html`
   - `policy.html`
   - `institute.html`
3. في حقل "Commit changes" اكتب: `Initial SunNile website launch`
4. اضغط **"Commit changes"**

---

## الخطوة ٣: تفعيل GitHub Pages

1. في صفحة الـ repository، اضغط **"Settings"** (الإعدادات)
2. من القائمة الجانبية اضغط **"Pages"**
3. تحت **"Source"** اختر: **"Deploy from a branch"**
4. تحت **"Branch"** اختر: **"main"** ← **"/ (root)"**
5. اضغط **"Save"**

⏳ **انتظر 2–5 دقائق** ثم سيظهر لك رابط مثل:
```
https://YOUR-USERNAME.github.io/sunnile/
```

---

## الخطوة ٤ (لاحقاً): ربط sunnile.org

بعد شراء الدومين من Namecheap:

### في Namecheap:
1. اذهب إلى **Domain List** ← اضغط **Manage** بجانب sunnile.org
2. اذهب إلى **Advanced DNS**
3. أضف هذه السجلات:

| Type | Host | Value |
|------|------|-------|
| A Record | @ | 185.199.108.153 |
| A Record | @ | 185.199.109.153 |
| A Record | @ | 185.199.110.153 |
| A Record | @ | 185.199.111.153 |
| CNAME Record | www | YOUR-USERNAME.github.io |

### في GitHub Pages Settings:
- في حقل **"Custom domain"** اكتب: `sunnile.org`
- اضغط **Save**
- فعّل **"Enforce HTTPS"** ✓

---

## ✅ قائمة التحقق قبل النشر

- [ ] جميع الملفات السبعة موجودة في المجلد
- [ ] index.html هو ملف الصفحة الرئيسية
- [ ] جربت فتح كل ملف محلياً في المتصفح
- [ ] التنقل بين الصفحات يعمل بشكل صحيح

---

## 📁 هيكل الملفات النهائي

```
sunnile/
├── index.html          ← الصفحة الرئيسية
├── calculator.html     ← حاسبة النظام الشمسي
├── inverters.html      ← سجل الإنفرترات
├── standards.html      ← معايير شمس النيل
├── future.html         ← مستقبل الطاقة
├── policy.html         ← مركز السياسات
└── institute.html      ← معهد فنيي الطاقة الشمسية
```

---

**شمس النيل — Sudan's Rooftop Solar Initiative**
*sunnile.org*
