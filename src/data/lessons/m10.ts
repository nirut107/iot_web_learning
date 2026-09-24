import { Lesson } from '@/types/curriculum';

export const m10Lessons: Lesson[] = [
  {
    id: 'm10-l01',
    slug: 'gitops-concepts-argocd-architecture',
    moduleId: 'm10',
    title: 'หลักการ GitOps และสถาปัตยกรรมภายในของ Argo CD',
    objectives: [
      'แยกแยะความแตกต่างระหว่าง Continuous Integration (CI), Continuous Delivery (CD), และ GitOps',
      'เข้าใจว่าทำไม Git จึงเป็น "Single Source of Truth"',
      'เข้าใจว่า Argo CD ไม่ใช่ Image Builder แต่เป็น Manifest Continuous Delivery',
      'สำรวจคอมโพเนนต์ภายในของ Argo CD: Application Controller, Repo Server, API Server'
    ],
    prerequisiteIds: ['m05-l01', 'm01-l02'],
    stage: 'Part 3',
    readingTime: 9,
    summary: 'ปรัชญาของ GitOps การดึงความจริงจาก Git สู่คลัสเตอร์ และสถาปัตยกรรมของ Argo CD ในการทำ Continuous Delivery',
    sourceRefs: [
      { sourceId: 'S12', title: 'Argo CD Automated Sync' },
      { sourceId: 'S13', title: 'Argo CD Getting Started Guide' },
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12, Chapter IV.3 Part 3)' }
    ],
    exerciseIds: ['ex-m10-01'],
    checklistIds: ['chk-m10-l01-01', 'chk-m10-l01-02', 'chk-m10-l01-03'],
    content: `
### 1. แยกความต่าง: CI vs CD vs GitOps

ในโจทย์ Part 3 หน้า 12 ใช้คำว่า *"create your first continuous integration"*:
แต่วิศวกรระบบจำเป็นต้องเข้าใจความหมายทางเทคนิคที่แม่นยำเพื่อไม่ให้ตอบผู้ตรวจผิด:

- **Continuous Integration (CI):** มุ่งเน้นไปที่การคอมไพล์โค้ด รัน Unit Test และ **Build Container Image** นำไปพุชขึ้น Registry
- **Continuous Delivery (CD):** มุ่งเน้นไปที่การนำเอาซอฟต์แวร์หรือ Image นั้นไป **Deploy ลงในเซิร์ฟเวอร์/คลัสเตอร์**
- **GitOps:** คือกระบวนทัศน์การทำ CD โดยกำหนดให้ **Git Repository เป็นศูนย์กลางความจริงเดียว (Single Source of Truth)** โดยสถานะของคลัสเตอร์จะต้องถูกกำหนดผ่านไฟล์ Manifest ใน Git และมีตัวดึง (Pull-based Agent) มาปรับคลัสเตอร์ให้ตรงกับ Git เสมอ

> [!IMPORTANT]
> **Argo CD ไม่ได้สร้าง Image ให้คุณ:**
> Argo CD ไม่ได้มีคำสั่ง \`docker build\` ในตัว มันอ่านเฉพาะไฟล์ Kubernetes YAML/Helm จาก Git แล้วเอาไปสั่งสร้างในคลัสเตอร์เท่านั้น ดังนั้น Image (เช่น \`wil42/playground:v1\`) จะต้องถูกสร้างและอยู่บน Docker Hub อยู่แล้ว

### 2. สถาปัตยกรรมภายในของ Argo CD

เมื่อเราติดตั้ง Argo CD ใน namespace \`argocd\` จะมี Pods สำคัญ 3 ตัวทำงานร่วมกัน:

\`\`\`text
  [ Git Repository (GitHub / Local GitLab) ]
                    |
                    | (1. Git Clone / Fetch manifests)
                    v
       [ argocd-repo-server ]
                    |
                    | (2. แปลง manifest เป็น Kubernetes Objects)
                    v
   [ argocd-application-controller ]  <--->  [ Kubernetes API Server ]
                    ^                               (ตรวจจับ Live Drift)
                    | (3. ส่งสถานะ Sync/Health)
                    v
          [ argocd-server ]  <--->  [ Web UI / CLI / Browser ]
\`\`\`

1. **\`argocd-repo-server\`:** ทำหน้าที่โคลน Git repo และอ่านไฟล์ YAML
2. **\`argocd-application-controller\`:** สมองกลที่คอยเปรียบเทียบ Desired State (จาก Git) กับ Actual State (ในคลัสเตอร์) แล้วสั่งปรับแต่ง (Reconciliation)
3. **\`argocd-server\`:** ให้บริการ Web Dashboard และ REST/gRPC API สำหรับผู้ใช้งาน
`
  },
  {
    id: 'm10-l02',
    slug: 'application-crd-autosync-selfheal-prune',
    moduleId: 'm10',
    title: 'Argo CD Application CRD, Auto-Sync, Self-Heal และ Prune',
    objectives: [
      'เข้าใจโครงสร้างไฟล์ Application Custom Resource Definition (CRD)',
      'แยกแยะความต่างระหว่าง Automated Sync, Self-Heal, และ Prune',
      'เข้าใจความแตกต่างเชิงลึกระหว่างสถานะ Synced กับ Healthy',
      'เรียนรู้วิธีการทำ Rollback และการรับมือกับการเปลี่ยนแปลงในระดับ Git'
    ],
    prerequisiteIds: ['m10-l01', 'm05-l02'],
    stage: 'Part 3',
    readingTime: 10,
    summary: 'การเขียนคอนฟิก Application ของ Argo CD กลไกการตรวจจับความผิดปกติ และนโยบายการประสานสถานะอัตโนมัติ',
    sourceRefs: [
      { sourceId: 'S12', title: 'Argo CD Automated Sync' },
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12, Chapter IV.3 Part 3)' }
    ],
    exerciseIds: ['ex-m10-02'],
    checklistIds: ['chk-m10-l02-01', 'chk-m10-l02-02', 'chk-m10-l02-03'],
    content: `
### 1. โครงสร้าง Application CRD สำหรับ Part 3

ไฟล์ Application คือเอกสารบอก Argo CD ว่าจะให้ดึงอะไรจากไหนไปลงที่ใด:

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: wil-playground
  namespace: argocd
spec:
  project: default
  # 1. แหล่งที่มา (Source): Git Repo ที่เก็บ Manifests
  source:
    repoURL: 'https://github.com/wil-login-iot/iot-config.git'
    targetRevision: HEAD    # หรือระบุ main / master
    path: app               # โฟลเดอร์ใน repo ที่มี deployment.yaml

  # 2. ปลายทาง (Destination): คลัสเตอร์และ namespace dev
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: dev

  # 3. นโยบายการ Sync (Sync Policy)
  syncPolicy:
    automated:
      prune: true     # ลบ resource ในคลัสเตอร์ทิ้งถ้าไฟล์ถูกลบออกจาก Git
      selfHeal: true  # ดึงคลัสเตอร์กลับให้ตรงกับ Git ถ้ามีคนแอบแก้ด้วย kubectl
    syncOptions:
    - CreateNamespace=true
\`\`\`

### 2. นโยบาย Sync 3 ฟังก์ชัน: อย่าจำสับสน!

| ฟังก์ชัน | พฤติกรรมเมื่อเกิดเหตุการณ์ | ตัวอย่างการใช้งาน |
|---|---|---|
| **Automated Sync** | เมื่อคุณ \`git push\` โค้ดใหม่ขึ้น GitHub -> Argo CD จะสั่งปรับคลัสเตอร์ให้ตาม Git อัตโนมัติ | อัปเดต image จาก v1 เป็น v2 |
| **Self-Heal** | เมื่อมีใครใช้ \`kubectl delete pod\` หรือแก้ replicas สดๆ ในคลัสเตอร์ -> Argo CD จะกู้คืนกลับมาให้ตรงกับ Git ทันที | ป้องกัน Human Error ในคลัสเตอร์ |
| **Pruning** | เมื่อคุณลบไฟล์ \`service.yaml\` ออกจาก Git -> Argo CD จะสั่งลบ Service นั้นออกจากคลัสเตอร์ตามด้วย | กำจัดทรัพยากรที่เลิกใช้งานแล้ว |

### 3. Synced vs Healthy: สองสถานะที่แยกจากกันโดยสิ้นเชิง

ประเด็นข้อสอบยอดนิยมตอนสอบ Defense:

> **Synced (มิติของ Configuration):**
> บอกว่าไฟล์ในคลัสเตอร์ตรงกับใน Git หรือไม่ (Synced / OutOfSync)

> **Healthy (มิติของ Runtime สุขภาพแอป):**
> บอกว่า Pod ที่สร้างขึ้นมาทำงานได้ปกติหรือไม่ (Healthy / Progressing / Degraded)

**ตัวอย่างจริง:**
สมมติว่าคุณเขียน manifest ชี้ไปที่ \`wil42/playground:v9999\` (ซึ่งไม่มี image นี้อยู่จริง):
- สถานะใน Argo CD จะขึ้น **Synced** (เพราะในคลัสเตอร์ก็พยายามรัน v9999 ตรงตาม Git แล้ว)
- แต่สถานะสุขภาพจะขึ้นเป็น **Degraded / ErrImagePull** (ไม่ Healthy)
`
  }
];
