import { Lesson } from '@/types/curriculum';

export const m12Lessons: Lesson[] = [
  {
    id: 'm12-l01',
    slug: 'kubernetes-storage-pv-pvc-localpath',
    moduleId: 'm12',
    title: 'Storage Architecture: PV, PVC, StorageClass และ Local-Path',
    objectives: [
      'เข้าใจวงจรชีวิตของ PersistentVolume (PV) และ PersistentVolumeClaim (PVC)',
      'ทำความเข้าใจบทบาทของ StorageClass และ Dynamic Provisioning ใน K3s/K3d',
      'แยกแยะความต่างระหว่าง Pod Recreate (ข้อมูลยังอยู่) กับ K3d Cluster Deletion (ข้อมูลหาย)',
      'เข้าใจอย่างถ่องแท้ว่า "Persistence ไม่เท่ากับ Backup"'
    ],
    prerequisiteIds: ['m05-l02', 'm09-l01'],
    stage: 'Bonus',
    readingTime: 9,
    summary: 'รากฐานของพื้นที่จัดเก็บข้อมูลถาวรใน Kubernetes การทำงานของ local-path provisioner และการเตรียมความพร้อมก่อนติดตั้ง GitLab',
    sourceRefs: [
      { sourceId: 'S15', title: 'Kubernetes Persistent Volumes & Claims' },
      { sourceId: 'SUB-P16', title: 'en.subject.pdf (Page 16, Chapter V Bonus part)' }
    ],
    exerciseIds: ['ex-m12-01'],
    checklistIds: ['chk-m12-l01-01', 'chk-m12-l01-02', 'chk-m12-l01-03'],
    content: `
### 1. ทำไมต้องเรียนเรื่อง Storage ก่อนทำ GitLab Bonus?

GitLab เป็นแอปพลิเคชันที่ต้องจัดเก็บข้อมูลมหาศาล (Stateful Application) ทั้งฐานข้อมูล PostgreSQL, แคช Redis, และ Git Repositories ของผู้ใช้ หากไม่มีความเข้าใจเรื่อง Kubernetes Storage เมื่อ Pod ของ GitLab ถูกรีสตาร์ต ข้อมูลทั้งหมดจะสูญหายทันที

### 2. โมเดลการจัดสรรพื้นที่ใน Kubernetes

\`\`\`text
  [ Pod spec.volumes ]
           |
           v (อ้างอิง)
  [ PersistentVolumeClaim (PVC) ]  ---> "ใบคำขอพื้นที่ เช่น ขอ 10Gi แบบ ReadWriteOnce"
           |
           v (จับคู่ / Bind)
  [ PersistentVolume (PV) ]        ---> "ก้อนพื้นที่จัดเก็บจริงบนดิสก์"
           ^
           | (สร้างให้อัตโนมัติโดย)
  [ StorageClass (local-path) ]    ---> "ผู้ให้บริการสร้าง PV แบบ Dynamic"
\`\`\`

- **PersistentVolume (PV):** ตัวแทนของดิสก์จริงในระบบ มี Reclaim Policy เช่น \`Delete\` (ลบทิ้งเมื่อเลิกใช้) หรือ \`Retain\` (เก็บไฟล์ไว้แม้ลบ PVC)
- **PersistentVolumeClaim (PVC):** ใบคำขอที่ Pod ยื่นเพื่อขอใช้งานพื้นที่
- **StorageClass (local-path ใน K3s):** ตัวโปรวิชันเนอร์ที่จะสร้างโฟลเดอร์บน Filesystem ของโหนด K3s (เช่น \`/var/lib/rancher/k3s/storage/\`) มารองรับ PVC ให้โดยอัตโนมัติ

### 3. ประเด็นสำคัญ: Persistence != Backup

> [!CAUTION]
> **คำเตือนเรื่องความปลอดภัยของข้อมูล:**
> - เมื่อ Pod ถูก \`kubectl delete pod\` ข้อมูลใน PVC จะ **ยังคงอยู่** และ Pod ใหม่จะกลับมาต่อกับข้อมูลเดิมได้
> - แต่ถ้าคุณสั่ง \`k3d cluster delete\` ข้อมูลในคอนเทนเนอร์โหนดจะถูก **ทำลายทิ้งทั้งหมด** เว้นแต่คุณจะทำ Volume Mount จากเครื่องโฮสต์เข้ามาใน Docker โหนดตั้งแต่ตอนสร้างคลัสเตอร์
> - **PV ไม่ใช่ Backup:** PV ป้องกันแค่ Pod ตาย แต่ไม่ป้องกันดิสก์พังหรือคลัสเตอร์ถูกลบ
`
  },
  {
    id: 'm12-l02',
    slug: 'helm-package-manager-kubernetes-secrets',
    moduleId: 'm12',
    title: 'Helm Package Manager และ Kubernetes Credentials & Secrets',
    objectives: [
      'เข้าใจโครงสร้างของ Helm: Chart, Template, values.yaml, และ Release',
      'แยกแยะความแตกต่างระหว่าง Chart Version กับ Application Version',
      'เรียนรู้คำสั่ง Helm พื้นฐาน: repo add, search, install, upgrade, uninstall',
      'เข้าใจการจัดการ Kubernetes Secret (TLS Certificates, Private Key, API Tokens)'
    ],
    prerequisiteIds: ['m12-l01', 'm05-l02'],
    stage: 'Bonus',
    readingTime: 9,
    summary: 'ตัวจัดการแพ็กเกจ Helm เครื่องมือช่วยติดตั้งระบบขนาดใหญ่อย่าง GitLab และการจัดเก็บข้อมูลลับในคลัสเตอร์',
    sourceRefs: [
      { sourceId: 'S16', title: 'Using Helm Documentation' },
      { sourceId: 'S14', title: 'Argo CD Private Repositories & Credentials' },
      { sourceId: 'SUB-P16', title: 'en.subject.pdf (Page 16, Chapter V Bonus part)' }
    ],
    exerciseIds: ['ex-m12-02'],
    checklistIds: ['chk-m12-l02-01', 'chk-m12-l02-02', 'chk-m12-l02-03'],
    content: `
### 1. Helm คืออะไร และทำไมโจทย์จึงแนะนำให้ใช้?

ในโจทย์ Bonus หน้า 16 มีคำแนะนำว่า:
> *"You are allowed to use whatever you need to achieve this extra. For example, helm could be useful here."*

การติดตั้ง GitLab ด้วยไฟล์ YAML ดิบๆ จะต้องเขียนไฟล์ manifest หลายสิบไฟล์ (ทั้ง PostgreSQL, Redis, Webservice, Gitaly, Ingress, Secrets) ซึ่งซับซ้อนและผิดพลาดได้ง่ายมาก **Helm** ทำหน้าที่เสมือน \`apt\` หรือ \`brew\` ของ Kubernetes โดยรวบรวมไฟล์ทั้งหมดไว้เป็นแพ็กเกจที่เรียกว่า **Chart** และเปิดให้เราปรับแต่งการตั้งค่าผ่านไฟล์ **\`values.yaml\`** เพียงไฟล์เดียว

### 2. คำสั่ง Helm ที่ต้องใช้

\`\`\`bash
# 1. เพิ่ม Repository ของ GitLab
helm repo add gitlab https://charts.gitlab.io/
helm repo update

# 2. ค้นหาเวอร์ชันของ Chart
helm search repo gitlab/gitlab --versions

# 3. ติดตั้งหรืออัปเกรดแอปพลิเคชันด้วย values ที่กำหนด
helm upgrade --install my-gitlab gitlab/gitlab \\
  -n gitlab \\
  -f my-values.yaml

# 4. ดูรายการ Release ที่ติดตั้งอยู่
helm list -n gitlab
\`\`\`

### 3. การจัดการ Kubernetes Secret

ในการเชื่อมต่อ Argo CD เข้ากับ Private Repository บน GitLab หรือการตั้งค่ารหัสผ่าน root:

\`\`\`bash
# สร้าง Secret แบบ Generic จากคำสั่ง
kubectl create secret generic gitlab-root-pass \\
  --from-literal=password="MyStrongPassword123" \\
  -n gitlab

# สร้าง TLS Secret จากไฟล์ใบรับรอง
kubectl create secret tls gitlab-tls \\
  --cert=tls.crt \\
  --key=tls.key \\
  -n gitlab
\`\`\`
`
  }
];
