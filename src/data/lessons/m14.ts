import { Lesson } from '@/types/curriculum';

export const m14Lessons: Lesson[] = [
  {
    id: 'm14-l01',
    slug: 'layered-troubleshooting-smoke-checks',
    moduleId: 'm14',
    title: 'เทคนิค Layered Troubleshooting และ Smoke Checks',
    objectives: [
      'เข้าใจกระบวนการสืบหาสาเหตุของปัญหาแบบ 5 เลเยอร์อย่างเป็นระบบ',
      'เรียนรู้การทำ Smoke Checks เพื่อประเมินสุขภาพของระบบได้อย่างรวดเร็วใน 30 วินาที',
      'ใช้คำสั่งวินิจฉัยเชิงลึก: dmesg, journalctl, kubectl describe, kubectl logs, tcpdump',
      'สามารถระบุอาการเสียทั่วไปและวิธีแก้ไขเฉพาะหน้าได้อย่างแม่นยำ'
    ],
    prerequisiteIds: ['m06-l02', 'm08-l02', 'm11-l02'],
    stage: 'Defense',
    readingTime: 10,
    summary: 'ยุทธวิธีในการแก้ไขปัญหาอย่างเป็นระบบ การไล่หาสาเหตุจากภายนอกเข้าสู่ภายใน และการทดสอบระบบก่อนเริ่มการประเมินผล',
    sourceRefs: [
      { sourceId: 'S20', title: 'Liveness/Readiness/Startup Probes' },
      { sourceId: 'S21', title: 'Resource Management for Pods' }
    ],
    exerciseIds: ['ex-m14-01'],
    checklistIds: ['chk-m14-l01-01', 'chk-m14-l01-02', 'chk-m14-l01-03'],
    content: `
### 1. ยุทธวิธี Layered Troubleshooting 5 ระดับ

เมื่อระบบไม่ทำงานหรือ curl ไม่ตอบสนอง อย่าเพิ่งเดาสุ่ม ให้ไล่เช็กตาม 5 เลเยอร์จากล่างขึ้นบนเสมอ:

\`\`\`text
  [ เลเยอร์ 5: Application Logic ]  ---> โค้ดของแอปฟังพอร์ตตรงไหม? ตอบ JSON ถูกฟอร์แมตไหม?
               ^
               |
  [ เลเยอร์ 4: Kubernetes Service ] ---> EndpointSlice มี IP ของ Pod ครบไหม? Ingress ชี้ถูก Service ไหม?
               ^
               |
  [ เลเยอร์ 3: Pod & Container ]   ---> Pod รันสถานะ Running ไหม? หรือ CrashLoopBackOff? ติด OOM ไหม?
               ^
               |
  [ เลเยอร์ 2: K8s Node & CNI ]    ---> โหนดสถานะ Ready ไหม? Flannel VXLAN ผูกถูก interface ไหม?
               ^
               |
  [ เลเยอร์ 1: VM & Operating System ] -> IP ของเครื่องถูกไหม? RAM เต็มไหม? Systemd k3s รันอยู่ไหม?
\`\`\`

### 2. ลำดับคำสั่ง Smoke Checks (ตรวจครบใน 30 วินาที)

ก่อนเรียกผู้ประเมินมาเริ่มตรวจ ให้พิมพ์ชุดคำสั่งนี้เพื่อยืนยันความพร้อม:

\`\`\`bash
# 1. เช็กหน่วยความจำและดิสก์ของเครื่อง
free -h && df -h /

# 2. เช็กโหนดทั้งหมดในคลัสเตอร์
kubectl get nodes -o wide

# 3. เช็กหา Pod ที่มีปัญหาในทุก namespaces
kubectl get pods -A --field-selector=status.phase!=Running

# 4. เช็ก Events ล่าสุดที่มี Warning หรือ Error
kubectl get events -A --sort-by=.metadata.creationTimestamp | tail -n 15

# 5. ทดสอบยิงคำขอหลัก
curl -sI -H "Host: app1.com" http://192.168.56.110/ || true
curl -s http://localhost:8888/ || true
\`\`\`

> [!TIP]
> หากพบ Pod ติดสถานะ \`CrashLoopBackOff\` คำสั่งแรกที่ต้องรันคือ:
> \`kubectl describe pod <pod-name> -n <ns>\` (ดูที่บรรทัด Events ด้านล่างสุด)
> และตามด้วย:
> \`kubectl logs <pod-name> -n <ns> --previous\` (เพื่อดูข้อความ log ก่อนที่คอนเทนเนอร์จะแครช)
`
  },
  {
    id: 'm14-l02',
    slug: 'clean-rebuild-drill-defense-simulation',
    moduleId: 'm14',
    title: 'Clean Rebuild Drill, ตรวจสอบ Submission และซ้อมสอบ Defense',
    objectives: [
      'ฝึกซ้อม Clean Rebuild จากศูนย์เพื่อการันตีว่าระบบทำซ้ำได้ 100% (Reproducibility)',
      'ตรวจสอบโครงสร้างโฟลเดอร์ root (p1, p2, p3, bonus) และไฟล์ scripts, confs ตาม Subject หน้า 17',
      'ตรวจเช็กความปลอดภัยของ Git ไม่ให้มี Secret, Token หรือ Private Key หลงเหลือ',
      'ซ้อมตอบคำถาม Defense ยอดนิยมและเตรียมตัวรับมือกับข้อสอบของ 42'
    ],
    prerequisiteIds: ['m14-l01', 'm11-l02'],
    stage: 'Defense',
    readingTime: 11,
    summary: 'ขั้นตอนการซ้อมรันระบบจากศูนย์ การตรวจสอบไฟล์ส่งงานตามกฎของ Subject และการเตรียมความพร้อมสำหรับการสอบประเมินผล',
    sourceRefs: [
      { sourceId: 'SUB-P17', title: 'en.subject.pdf (Page 17-18, Chapter VI Submission)' }
    ],
    exerciseIds: ['ex-m14-02'],
    checklistIds: ['chk-m14-l02-01', 'chk-m14-l02-02', 'chk-m14-l02-03'],
    content: `
### 1. Clean Rebuild Drill: ซ้อมสร้างใหม่จากความว่างเปล่า

ความผิดพลาดอันดับหนึ่งของการสอบโปรเจกต์กลุ่มวิชา SysAdmin คือ:
> *"เมื่อตอนทดลองทำ มันทำงานได้ แต่พอถึงวันสอบจริงและต้องสั่งบูตเครื่องใหม่ กลับพังและไม่ทำงาน"*

เพื่อป้องกันเหตุการณ์นี้ คุณต้องทำการ **Clean Rebuild Drill** อย่างน้อย 2 ครั้งก่อนวันสอบจริง:

\`\`\`bash
# 1. ทำลาย Part 1 & Part 2 ให้ราบคาบ
cd p1 && vagrant destroy -f && cd ..
cd p2 && vagrant destroy -f && cd ..

# 2. ลบ K3d Cluster ของ Part 3 & Bonus
k3d cluster delete --all || true

# 3. โคลน Git Repository ลงในโฟลเดอร์ใหม่เอี่ยม
git clone <your-git-repo> /tmp/defense-test
cd /tmp/defense-test

# 4. ทดสอบสั่ง vagrant up และรัน scripts ทั้งหมดตั้งแต่ศูนย์
# ยืนยันว่าไม่มีคำสั่งใดที่ต้องพิมพ์แก้ด้วยมือระหว่างทาง!
\`\`\`

### 2. ตรวจสอบโครงสร้าง Submission ตาม Subject หน้า 17

\`\`\`text
.
├── p1/
│   ├── Vagrantfile
│   ├── scripts/
│   │   ├── setup_server.sh
│   │   └── setup_worker.sh
│   └── confs/
├── p2/
│   ├── Vagrantfile
│   ├── scripts/
│   │   └── setup.sh
│   └── confs/
│       ├── app1.yaml
│       ├── app2.yaml
│       ├── app3.yaml
│       └── ingress.yaml
├── p3/
│   ├── scripts/
│   │   ├── install_tools.sh
│   │   └── bootstrap.sh
│   └── confs/
│       └── application.yaml
└── bonus/
    ├── scripts/
    └── confs/
\`\`\`

> [!CAUTION]
> **ตรวจความสะอาดของ Git ก่อนส่ง:**
> 1. ตรวจสอบว่าไม่มีโฟลเดอร์ \`.vagrant/\` ติดเข้าไปใน repo
> 2. ตรวจสอบว่าไม่มี private key (\`id_rsa\`, \`id_ed25519\`) หรือ token ติดเข้าไป
> 3. รัน \`git status\` ต้องขึ้นว่า \`nothing to commit, working tree clean\`

### 3. Checklist สุดท้ายก่อนเริ่มการประเมิน Defense

- [ ] เตรียมแผนอธิบายความแตกต่างของ K3s vs K3d ได้อย่างคล่องแคล่ว
- [ ] เตรียมเปิดแสดง Ingress YAML ใน Part 2 พร้อมอธิบาย Host routing และ fallback
- [ ] มี Public GitHub Repository ที่มี login ของสมาชิกในชื่อ
- [ ] สามารถสาธิตแก้ version ใน GitHub แล้วแอปใน dev อัปเดต v1 -> v2 ได้จริง
- [ ] มั่นใจ 100% ว่าไม่มีคำสั่งใดที่ต้องพึ่งพาการคลิกหรือแก้ไขไฟล์ด้วยมือ
`
  }
];
