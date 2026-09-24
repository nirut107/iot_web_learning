import { Lesson } from '@/types/curriculum';

export const m11Lessons: Lesson[] = [
  {
    id: 'm11-l01',
    slug: 'setup-scripts-github-namespaces-p3',
    moduleId: 'm11',
    title: 'ประกอบ Part 3: สคริปต์ติดตั้ง, GitHub Repo และ Namespaces',
    objectives: [
      'เขียนสคริปต์ติดตั้งเครื่องมือทั้งหมด (Docker, K3d, kubectl) เพื่อใช้ระหว่างการตรวจตามโจทย์',
      'สร้าง Public GitHub Repository โดยมีชื่อล็อกอินของสมาชิกตามข้อกำหนด',
      'สร้าง Namespace แยก 2 ตัว: argocd และ dev บนคลัสเตอร์ K3d',
      'ตั้งค่า Argo CD ให้เชื่อมต่อกับ Public GitHub Repository'
    ],
    prerequisiteIds: ['m10-l02', 'm09-l02'],
    stage: 'Part 3',
    readingTime: 9,
    summary: 'การจัดเตรียมระบบสำหรับ Part 3 สคริปต์ติดตั้งแพ็กเกจแบบอัตโนมัติ ข้อกำหนดของ GitHub Repository และการแยกเนมสเปซ',
    sourceRefs: [
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12-13, Chapter IV.3 Part 3)' },
      { sourceId: 'S13', title: 'Argo CD Getting Started' }
    ],
    exerciseIds: ['ex-m11-01'],
    checklistIds: ['chk-m11-l01-01', 'chk-m11-l01-02', 'chk-m11-l01-03'],
    content: `
### 1. สคริปต์ติดตั้งเครื่องมือตามโจทย์ (Installation Script)

ในโจทย์ Part 3 หน้า 12 ระบุว่า:
> *"You will need Docker for K3d to work, and probably some other software as well. Therefore, you must write a script to install all the necessary packages and tools during your defense."*

เขียนสคริปต์ \`install_tools.sh\` เก็บไว้ในโฟลเดอร์ \`p3/scripts/\`:

\`\`\`bash
#!/bin/bash
set -euo pipefail

echo "=== 1. Installing Docker ==="
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker "$USER"
fi

echo "=== 2. Installing kubectl ==="
if ! command -v kubectl &>/dev/null; then
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
  rm kubectl
fi

echo "=== 3. Installing K3d ==="
if ! command -v k3d &>/dev/null; then
  curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
fi

echo "=== All tools installed successfully! ==="
\`\`\`

### 2. กฎการตั้งชื่อ Public GitHub Repository

ในโจทย์หน้า 12 มีข้อกำหนดบังคับว่า:
> *"The only mandatory requirement is to put the login of a member of the group in the name of your repository."*

- ตัวอย่างชื่อที่ **ถูกต้อง**: \`https://github.com/myaccount/wil-iot-gitops\` หรือ \`wil_iot_part3\`
- ตัวอย่างชื่อที่ **ผิด (อาจถูกปรับตก)**: \`iot-k3d-demo\` (ไม่มีชื่อล็อกอินของสมาชิก)
- ตรวจสอบให้แน่ใจว่าได้ตั้งสถานะเป็น **Public Repository** เพื่อให้ Argo CD สามารถโคลนได้โดยไม่ต้องใช้รหัสผ่านหรือ SSH Key

### 3. การสร้าง Cluster และ Namespaces

เขียนสคริปต์ \`setup_cluster.sh\`:

\`\`\`bash
#!/bin/bash
set -euo pipefail

# 1. สร้างคลัสเตอร์ K3d พร้อมพอร์ต 8888 สำหรับแอป
k3d cluster create iot-cluster --port "8888:8888@loadbalancer"

# 2. สร้าง namespaces ตามโจทย์
kubectl create namespace argocd
kubectl create namespace dev

# 3. ติดตั้ง Argo CD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 4. รอจนกว่าระบบพร้อม
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s
\`\`\`
`
  },
  {
    id: 'm11-l02',
    slug: 'gitops-demo-v1-v2-verification',
    moduleId: 'm11',
    title: 'จบ Part 3: การสาธิตแก้ Version v1 สู่ v2 และการตรวจผลงาน',
    objectives: [
      'เข้าใจขั้นตอนการสาธิตการตรวจผลงาน Part 3 ตาม Subject หน้า 14-16',
      'ทดสอบส่งคำขอ curl http://localhost:8888/ เพื่อยืนยันเวอร์ชัน v1',
      'แก้ไฟล์ manifest บน GitHub แล้วสังเกต Argo CD ทำการ synchronize อัตโนมัติ',
      'ยืนยันผลลัพธ์ว่าแอปพลิเคชันเปลี่ยนเป็น v2 สำเร็จ 100%'
    ],
    prerequisiteIds: ['m11-l01', 'm10-l02'],
    stage: 'Part 3',
    readingTime: 10,
    summary: 'ขั้นตอนการสาธิต GitOps Continuous Delivery สดๆ ต่อหน้าผู้ตรวจ ตั้งแต่ v1 ถึง v2 และคำสั่งตรวจผลลัพธ์',
    sourceRefs: [
      { sourceId: 'SUB-P14', title: 'en.subject.pdf (Page 14-16, Chapter IV.3 Part 3)' },
      { sourceId: 'S12', title: 'Argo CD Automated Sync' }
    ],
    exerciseIds: ['ex-m11-02'],
    checklistIds: ['chk-m11-l02-01', 'chk-m11-l02-02', 'chk-m11-l02-03'],
    content: `
### 1. ลำดับขั้นตอนการตรวจงาน Part 3 (ตามรูปใน Subject)

การตรวจงาน Part 3 จะดำเนินตามขั้นตอนในเอกสารโจทย์หน้า 13-16 ดังนี้:

#### ขั้นที่ 1: ตรวจสอบ Namespaces และ Pod ใน dev
\`\`\`bash
# ผู้ตรวจจะสั่งดู namespaces
kubectl get ns
# คาดหวัง: เห็น argocd และ dev

# ดู Pod ใน dev
kubectl get pods -n dev
# คาดหวัง: เห็น wil-playground รันอยู่ 1/1 Running
\`\`\`

#### ขั้นที่ 2: ตรวจสอบแอปเวอร์ชัน v1
\`\`\`bash
curl http://localhost:8888/
# คาดหวัง: {"status":"ok", "message": "v1"}
\`\`\`

#### ขั้นที่ 3: สาธิตการแก้เวอร์ชันบน GitHub
แก้ไขไฟล์ \`deployment.yaml\` ใน repository:
\`\`\`bash
# เปลี่ยนจาก v1 เป็น v2
sed -i 's/playground:v1/playground:v2/g' deployment.yaml

# Push ขึ้น GitHub
git add deployment.yaml
git commit -m "update application to v2"
git push origin main
\`\`\`

#### ขั้นที่ 4: ตรวจสอบใน Argo CD และทดสอบ v2
รอสักครู่ (หรือกดปุ่ม Refresh ใน Argo CD Web UI เพื่อลดเวลารอ) จากนั้นรัน:
\`\`\`bash
# ตรวจสอบว่า Pod ตัวใหม่ถูกสร้างขึ้นมา
kubectl get pods -n dev

# ยิง curl ทดสอบเวอร์ชันใหม่
curl http://localhost:8888/
# คาดหวัง: {"status":"ok", "message": "v2"}
\`\`\`

> [!TIP]
> **เคล็ดลับสำหรับการสอบ Defense:**
> Argo CD จะดึงความเปลี่ยนแปลงจาก GitHub ตามรอบตรวจสอบปกติทุก 3 นาที (180 วินาที) หากคุณไม่ต้องการยืนรอ ให้เปิดหน้าเว็บ Dashboard ของ Argo CD หรือรันคำสั่ง \`argocd app sync wil-playground\` เพื่อสั่ง Reconcile ทันที ผู้ตรวจจะประทับใจที่คุณเข้าใจกลไกการ Poll ของ GitOps
`
  }
];
