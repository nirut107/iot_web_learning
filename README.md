# Inception-of-Things (IoT) - Web Learning Platform & 42 Defense Simulator

เว็บแอปพลิเคชันสำหรับการเรียนรู้ ฝึกปฏิบัติ และติดตามความพร้อมในการทำโปรเจกต์ **Inception-of-Things (IoT)** ของหลักสูตร 42 Network ครอบคลุมตั้งแต่พื้นฐาน Virtualization, Vagrant, K3s Multi-node, Ingress Controller, K3d, Argo CD (GitOps), ไปจนถึง Bonus GitLab พร้อมระบบจำลองแบบประเมินจริงตาม `eval.pdf` และคลังคำถามเจาะลึก Defense 16 ข้อ

---

## 🌟 จุดเด่นของระบบ (Key Highlights)

1. **เนื้อหาภาษาไทยเชิงเทคนิคครบ 15 โมดูล 30 บทเรียน:**
   - เขียนขึ้นจากข้อกำหนดจริงตาม `en.subject.pdf` (v4.0) และแผนการเรียน `Inception-of-Things-Learning-Plan-TH.md`
   - ไม่มี placeholder, ไม่มี dummy text, มี code block แยกคำสั่ง (Command) และผลลัพธ์ที่คาดหวัง (Expected Output) ชัดเจน
2. **ระบบติดตามความพร้อมแยก Mandatory vs Bonus อย่างแม่นยำ:**
   - แยกสถานะระหว่าง **"เรียนจบเนื้อหา" (Lesson Learned)** กับ **"ทดสอบ Requirement ผ่าน" (Requirement Verified)**
   - คิดเปอร์เซ็นต์ Mandatory และ Bonus แยกขาดจากกัน ไม่นำคะแนนเสริมมาปะปน
3. **แบบจำลองเกณฑ์ตรวจจริง 42 Intra Scale Sheet (`eval.pdf`):**
   - มีหน้า `/defense` รวบรวมขั้นตอนตรวจของ Evaluator ทั้ง 5 ส่วน
   - ไฮไลต์จุดตาย **"Evaluation stops here"** 6 จุดสำคัญที่ทำให้ได้ 0 คะแนนทันที
4. **ความคงทนของข้อมูล 100% (Zero Data Loss):**
   - บันทึกสถานะ, checkbox, และ personal notes ลงใน `localStorage` อัตโนมัติ
   - ป้องกัน hydration mismatch และมีระบบ Versioning schema (v1)
   - รองรับการ Export / Import JSON เพื่อสำรองหรือย้ายเครื่อง
5. **เครื่องมือสนับสนุนการเรียนรู้ครบวงจร:**
   - Interactive Checklist 35+ ข้อกำหนดพร้อมลิงก์กลับไปยังบทเรียน
   - คู่มือวินิจฉัยปัญหาแบบแบ่งชั้น (Layered Troubleshooting) 12 เคสจริง
   - พจนานุกรมคำศัพท์เทคนิค (Glossary) 23 คำศัพท์
   - คลังอ้างอิงเอกสารทางการ (Official References S1 - S21)
   - ค้นหาแบบ Full-text / Fuzzy Search ทั่วทั้งระบบด้วยปุ่มลัด `⌘K` / `Ctrl+K`

---

## 🛠️ Stack และ Runtime ที่รองรับ

- **Framework:** Next.js 16.3.6 (App Router, Turbopack)
- **Language:** TypeScript 5.8
- **UI & Styling:** React 19, Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Icons:** Lucide React
- **Runtime Environment:** Node.js `>= 18.18.0` (ทดสอบบน Node v20.20.2)
- **Package Manager:** `pnpm` (v10.8.1 หรือ v9+) หรือ `npm`

---

## 🚀 วิธีการติดตั้งและเปิดใช้งาน (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
# ใช้ pnpm (แนะนำ)
pnpm install

# หรือใช้ npm
npm install
```

### 2. รันในโหมด Development
```bash
pnpm dev
# หรือ npm run dev
```
เปิดเว็บเบราว์เซอร์แล้วเข้าไปที่: **`http://localhost:3000`**

### 3. รันระบบตรวจความถูกต้องของข้อมูล (Integrity Test Suite)
```bash
pnpm test
# หรือ npm test
```
คำสั่งนี้จะรัน `tsx scripts/verify-integrity.mjs` เพื่อทดสอบ:
- การแมปทั้ง 15 โมดูล 30 บทเรียน
- ความถูกต้องของ Unique IDs, Exercises และ Checklist items
- การเชื่อมโยง Requirements กับบทเรียนและ Stage
- ความสอดคล้องของคำศัพท์ Glossary, Troubleshooting และ Defense Q&A
- ความถูกต้องของสูตรคำนวณ Progress

### 4. Build และรันในโหมด Production
```bash
pnpm build
pnpm start
```
ระบบจะทำการ Pre-render แบบ Static Generation (SSG) ครบทั้ง 42 routes ทันที

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
├── src/
│   ├── app/                               # Next.js App Router (Pages & Layouts)
│   │   ├── checklist/page.tsx             # หน้ารายการตรวจ Subject Requirements
│   │   ├── defense/page.tsx               # หน้าจำลอง 42 Eval Sheet & Defense Q&A
│   │   ├── glossary/page.tsx              # หน้าพจนานุกรมคำศัพท์เทคนิค
│   │   ├── modules/                       # หน้าภาพรวม 15 โมดูล
│   │   │   └── [moduleId]/[lessonId]/     # หน้ารายละเอียดบทเรียน (SSG 30 หน้า)
│   │   ├── references/page.tsx            # หน้าแหล่งอ้างอิงทางการ (S1 - S21)
│   │   ├── search/page.tsx                # หน้าค้นหาแบบเต็มจอ
│   │   ├── settings/page.tsx              # หน้า Export/Import, Reset, Storage stats
│   │   ├── troubleshooting/page.tsx       # หน้าคู่มือแก้ปัญหา 12 เคส
│   │   ├── layout.tsx                     # Global Root Layout พร้อม Context Providers
│   │   └── page.tsx                       # หน้าแรก (Dashboard & Quick Resume)
│   ├── components/                        # Reusable React Components
│   │   ├── CodeBlock.tsx                  # แสดง Code พร้อมปุ่ม Copy และแยก Output
│   │   ├── Footer.tsx                     # ส่วนท้ายหน้าเว็บ พร้อม Disclaimer
│   │   ├── LessonView.tsx                 # หน้ารายละเอียดบทเรียน (Sidebar, Checklist, Notes)
│   │   ├── Navbar.tsx                     # แถบเมนูด้านบน, Search modal trigger, Theme toggle
│   │   ├── ProgressBar.tsx                # แถบแสดงความคืบหน้าแบบ Accessible
│   │   ├── RequirementCard.tsx            # การ์ดแสดง Requirement พร้อม dropdown สถานะ
│   │   └── SearchModal.tsx                # Popup ค้นหาด่วน (⌘K)
│   ├── context/                           # State Management & Persistence
│   │   ├── ProgressContext.tsx            # จัดการ Progress, Checked Items, Notes, LocalStorage
│   │   └── ThemeContext.tsx               # สลับ Dark / Light Mode
│   ├── data/                              # Structured Curriculum Data
│   │   ├── defense.ts                     # คลังคำถามซ้อมสอบ 16 ข้อ + กับดักผู้ตรวจ
│   │   ├── evalSheet.ts                   # โครงสร้างแบบประเมิน 42 Intra Scale Sheet
│   │   ├── exercises.ts                   # 30 แบบฝึกหัดปฏิบัติจริง
│   │   ├── glossary.ts                    # 23 รายการคำศัพท์
│   │   ├── learningItems.ts               # 60+ Interactive Checklist items
│   │   ├── modules.ts                     # 15 Modules metadata
│   │   ├── references.ts                  # S1 - S21 Official Sources
│   │   ├── requirements.ts                # 35 Subject Requirements (v4.0)
│   │   ├── troubleshooting.ts             # 12 ปัญหาจริงและแนวทางวินิจฉัย
│   │   └── lessons/                       # เนื้อหาเชิงลึกทั้ง 30 บทเรียน (m00 ถึง m14)
│   └── types/
│       └── curriculum.ts                  # TypeScript Interfaces และ Type Definitions
├── scripts/
│   └── verify-integrity.mjs               # automated integrity & regression test suite
├── COVERAGE.md                            # ตารางแมปความครอบคลุมเนื้อหาเทียบเอกสาร 42
├── AGENT.md                               # เอกสารข้อกำหนดระบบ
├── en.subject.pdf                         # เอกสารโจทย์หลัก 42 Inception-of-Things
├── eval.pdf                               # เอกสารเกณฑ์ตรวจ 42 Intra Scale Sheet
└── Inception-of-Things-Learning-Plan-TH.md# แผนการเรียน 15 บท ภาษาไทย
```

---

## 📊 กติกาการคำนวณสถานะความคืบหน้า (Progress Calculation Rules)

ระบบแยกความคืบหน้าออกเป็น 2 มิติที่แตกต่างกันโดยสิ้นเชิง:

1. **Lesson Completion Rate (%):**
   - คำนวณจากสัดส่วนของบทเรียนที่ผู้ใช้คลิก "เรียนจบแล้ว" ในหน้าบทเรียน หรือติ๊ก Checklist item ครบทุกข้อในบทนั้น
   - แยกคอลัมน์ระหว่าง Mandatory Modules (`m00` ถึง `m12`, `m14`) กับ Bonus Module (`m13`)

2. **Requirement Readiness Rate (%):**
   - คำนวณจากสถานะของข้อกำหนดในหน้า `/checklist`:
     - **Verified (ทดสอบผ่านแล้ว):** นับเป็น 100%
     - **In Progress (กำลังทำ/ติดปัญหา):** นับเป็น 50%
     - **Not Started (ยังไม่เริ่ม):** นับเป็น 0%
     - **Not Applicable:** ไม่นำมาเป็นตัวหาร
   - **Mandatory Readiness:** คิดเฉพาะข้อกำหนดในหมวด `general`, `p1`, `p2`, `p3`, `submission`
   - **Bonus Readiness:** คิดเฉพาะข้อกำหนดในหมวด `bonus` แยกเด็ดขาด ไม่นำไปฉุดหรือดันคะแนนหลัก

---

## ✍️ วิธีการแก้ไขหรือเพิ่มเนื้อหา (Content Extension)

เนื้อหาของบทเรียนถูกแยกออกจากโค้ด UI อย่างชัดเจนในโฟลเดอร์ `src/data/`:
1. **เพิ่ม/แก้ไขบทเรียน:** แก้ไขไฟล์ใน `src/data/lessons/mXX.ts` โดยใช้รูปแบบ Markdown สำหรับข้อความ และระบุ Code blocks ให้ถูกต้อง
2. **เพิ่มข้อกำหนดใหม่:** อัปเดต `src/data/requirements.ts` โดยกำหนด `id` ใหม่ตามรูปแบบ `req-<stage>-<number>` พร้อมระบุ `sourceRef`
3. **ตรวจสอบความถูกต้อง:** ทุกครั้งที่เพิ่มหรือแก้ไขข้อมูล ให้รัน:
   ```bash
   pnpm test
   ```
   ระบบจะตรวจสอบทันทีว่ามี ID ซ้ำ หรือมี Foreign Key ที่ชี้ไม่ติดหรือไม่

---

## 💾 ข้อจำกัดของ LocalStorage และการกู้คืนข้อมูล

1. **Storage Scope:** ข้อมูลทั้งหมดถูกเก็บไว้ในเบราว์เซอร์เครื่องปัจจุบัน (Client-side `localStorage`) ภายใต้คีย์ `iot_learning_progress_v1` และ `iot_theme`
2. **Private/Incognito Browsing:** หากเปิดใช้งานในโหมดไม่ระบุตัวตน ข้อมูลจะถูกล้างเมื่อปิดหน้าต่างเบราว์เซอร์
3. **การล้างแคช (Cache Clear):** การสั่ง Clear Browsing Data / Site Data ในเบราว์เซอร์จะทำให้ความคืบหน้าหายไป
4. **คำแนะนำด้านความปลอดภัย:**
   - หมั่นเข้าไปที่หน้า **Settings (`/settings`)** แล้วกด **"Export Data (JSON)"** เพื่อดาวน์โหลดไฟล์สำรองข้อมูลเก็บไว้
   - หากย้ายเครื่องหรือเปลี่ยนเบราว์เซอร์ สามารถนำไฟล์ JSON ดังกล่าวมากด **"Import Data"** เพื่อกู้คืนสถานะเดิมได้ 100%

---

## ⚖️ ข้อสงวนสิทธิ์และความจริงใจทางวิชาการ (Disclaimer)

- เว็บแอปพลิเคชันนี้สร้างขึ้นเพื่อเป็น **เครื่องมือช่วยเรียนรู้และจำลองการประเมินตนเอง (Self-Study Companion & Practice Simulator)** เท่านั้น
- **การที่ Checklist ในแอปขึ้น 100% ไม่ได้รับประกันว่าผู้เรียนจะผ่านการประเมินจริงที่ 42** เนื่องจากในการสอบจริง (Peer-Evaluation) ผู้ตรวจจะสั่งรันคำสั่งสด ตรวจสอบความเข้าใจแบบปากเปล่า และตรวจสอบไฟล์ใน Git Repository จริงของนักเรียน
- ผู้เรียนต้องฝึกรันคำสั่งจริงบน Terminal และทำความเข้าใจเหตุผลเบื้องหลังของทุกเทคโนโลยีตามที่ระบุไว้ในบทเรียนอย่างแท้จริง
# iot_web_learning
