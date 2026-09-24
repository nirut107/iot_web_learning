import { Lesson } from '@/types/curriculum';

export const m05Lessons: Lesson[] = [
  {
    id: 'm05-l01',
    slug: 'k8s-architecture-declarative-model',
    moduleId: 'm05',
    title: 'Kubernetes Architecture และ Declarative Desired State',
    objectives: [
      'เข้าใจปัญหาที่ Kubernetes เข้ามาแก้ไขเมื่อเทียบกับการรัน Docker ธรรมดา',
      'อธิบายแนวคิด Desired State เทียบกับ Actual State และกลไก Reconciliation Loop',
      'เข้าใจหน้าที่ของ Control Plane: kube-apiserver, kube-controller-manager, kube-scheduler, etcd',
      'เข้าใจหน้าที่ของ Node Components: kubelet, kube-proxy, container runtime'
    ],
    prerequisiteIds: ['m04-l01'],
    stage: 'Foundation',
    readingTime: 9,
    summary: 'สถาปัตยกรรมภายในของ Kubernetes คอนโทรลเลอร์ควบคุมสถานะ และเหตุผลที่ระบบจัดการคอนเทนเนอร์ระดับโลกทำงานแบบ Declarative',
    sourceRefs: [
      { sourceId: 'S5', title: 'Kubernetes Components Overview' },
      { sourceId: 'SUB-P3', title: 'en.subject.pdf (Page 3, Chapter II Introduction)' }
    ],
    exerciseIds: ['ex-m05-01'],
    checklistIds: ['chk-m05-l01-01', 'chk-m05-l01-02', 'chk-m05-l01-03'],
    content: `
### 1. ปัญหาที่ Kubernetes เข้ามาแก้

เมื่อคุณรันคอนเทนเนอร์ด้วย Docker บนเครื่องเดี่ยว:
- หากคอนเทนเนอร์แอปพัง ดับ หรือเมมโมรีเต็ม คุณต้องเขียนสคริปต์มาคอยเช็กและสั่ง \`docker restart\` เอง
- หากเครื่องเซิร์ฟเวอร์ฮาร์ดแวร์ดับ คอนเทนเนอร์ทั้งหมดในเครื่องนั้นจะหายไป ไม่มีใครย้ายแอปไปรันเครื่องอื่นให้
- การขยายขนาด (Scale) เพื่อรองรับคนเข้าชมเยอะๆ ทำได้ยาก ต้องคอยปรับพอร์ตและคอนฟิกบาลานเซอร์เอง

**Kubernetes** แก้ปัญหานี้โดยรวมเครื่องเซิร์ฟเวอร์หลายๆ เครื่องเข้าด้วยกันเป็น **คลัสเตอร์ (Cluster)** แล้วทำหน้าที่เป็นผู้จัดการกระจายงาน (Orchestrator) จัดสรรทรัพยากร และคอยดูแลรักษาแอปให้อยู่ในสถานะที่กำหนดตลอดเวลา

### 2. โมเดล Declarative: Desired State vs Actual State

หัวใจของ Kubernetes (และ GitOps ใน Part 3) อยู่ที่ 2 คำนี้:

\`\`\`text
  [สิ่งที่เราประกาศใน YAML หรือ Git]  --->  Desired State (สถานะที่ต้องการ)
                                              |
                                              | (Reconciliation Loop คอยตรวจ)
                                              v
  [สิ่งที่รันอยู่จริงบนเซิร์ฟเวอร์]  --->   Actual State (สถานะที่เป็นจริง)
\`\`\`

- **Imperative (วิธีเดิม):** เราสั่งคำสั่งเป็นลำดับ เช่น "สร้างคอนเทนเนอร์ตัวที่ 1", "สร้างตัวที่ 2", "เปิดพอร์ต 80" ถ้าขั้นตอนไหนล้มเหลว ระบบจะค้างครึ่งๆ กลางๆ
- **Declarative (วิธีของ Kubernetes):** เราบอกแค่ "ผลลัพธ์สุดท้ายที่ต้องการ" เช่น *"ต้องการให้แอป wil-playground รันอยู่ 3 ตัวเสมอ"* ไม่ว่าโหนดจะพัง หรือมีใครแอบไปกดลบคอนเทนเนอร์ คอนโทรลเลอร์จะตรวจพบความแตกต่างและสร้างตัวใหม่มาทดแทนโดยอัตโนมัติ

### 3. ส่วนประกอบสำคัญของคลัสเตอร์

#### Control Plane (สมองของคลัสเตอร์):
- **kube-apiserver:** ด่านหน้าคอยรับคำสั่ง REST/gRPC ทั้งหมดจาก kubectl และคอมโพเนนต์อื่น
- **etcd / sqlite:** ฐานข้อมูลจัดเก็บสถานะทั้งหมดของคลัสเตอร์ (ใน K3s รวมอยู่ในตัว)
- **kube-scheduler:** คอยมองหา Pod ที่เพิ่งสร้างและตัดสินใจว่าจะส่งไปรันบน Worker โหนดไหนที่ทรัพยากรว่างพอ
- **kube-controller-manager:** คอนโทรลเลอร์ที่คอยรัน Reconciliation loops ตรวจจับการดับของ Pod, Node

#### Worker Node (คนทำงาน):
- **kubelet:** เอเจนต์ที่รันอยู่บนทุกโหนด คอยคุยกับ apiserver และสั่ง container runtime ให้เริ่มหรือหยุด Pod
- **kube-proxy:** จัดการกฎเครือข่าย (iptables/IPVS) สำหรับการทำ Service Load Balancing
- **Container Runtime (containerd):** ตัวดาวน์โหลด Image และรันคอนเทนเนอร์จริง
`
  },
  {
    id: 'm05-l02',
    slug: 'core-resources-yaml-kubectl',
    moduleId: 'm05',
    title: 'Core Resources, ไวยากรณ์ YAML และการใช้ kubectl',
    objectives: [
      'เข้าใจความสัมพันธ์ของ Pod, ReplicaSet, Deployment, Service, และ Ingress',
      'เรียนรู้โครงสร้าง YAML 4 ฟิลด์หลัก: apiVersion, kind, metadata, spec',
      'เข้าใจกลไก Label Selectors ที่ใช้ผูกความสัมพันธ์ระหว่าง Objects ข้ามชนิด',
      'เชี่ยวชาญคำสั่ง kubectl: apply, get, describe, logs, exec, delete'
    ],
    prerequisiteIds: ['m05-l01', 'm04-l02'],
    stage: 'Foundation',
    readingTime: 10,
    summary: 'เจาะลึกประเภททรัพยากรพื้นฐาน โครงสร้างไฟล์ Manifest และคำสั่งควบคุมคลัสเตอร์ผ่าน kubectl CLI',
    sourceRefs: [
      { sourceId: 'S5', title: 'Kubernetes Components Overview' },
      { sourceId: 'S6', title: 'Kubernetes Deployments' },
      { sourceId: 'S7', title: 'Kubernetes Service' }
    ],
    exerciseIds: ['ex-m05-02'],
    checklistIds: ['chk-m05-l02-01', 'chk-m05-l02-02', 'chk-m05-l02-03'],
    content: `
### 1. ลำดับชั้นของ Kubernetes Resources

\`\`\`text
  [ Ingress ]            (รับทราฟฟิกภายนอก app1.com / app2.com)
       |
       v
  [ Service ]            (จุดรวม IP และกระจายโหลดภายใน)
       |
       v
  [ Deployment ]         (จัดการเวอร์ชัน และ Rolling Updates)
       |
       v
  [ ReplicaSet ]         (การันตีจำนวน Replicas ให้คงที่ เช่น 3 ตัว)
       |
       v
  [ Pod ]                (หน่วยรัน Container จริง)
\`\`\`

### 2. โครงสร้างไฟล์ YAML 4 ส่วนมาตรฐาน

ทุกไฟล์ Manifest ของ Kubernetes จะต้องมี 4 ฟิลด์หลักนี้เสมอ:

\`\`\`yaml
apiVersion: apps/v1        # 1. API Group และ Version ของทรัพยากร
kind: Deployment           # 2. ชนิดของ Object (Pod, Service, Deployment, Ingress)
metadata:                  # 3. ข้อมูลระบุตัวตน (ชื่อ, namespace, labels)
  name: wil-app
  namespace: dev
  labels:
    app: wil-app
spec:                      # 4. รายละเอียดสถานะที่ต้องการ (Desired State)
  replicas: 1
  selector:
    matchLabels:
      app: wil-app
  template:                # โครงสร้างของ Pod ที่จะสร้าง
    metadata:
      labels:
        app: wil-app
    spec:
      containers:
      - name: web
        image: wil42/playground:v1
        ports:
        - containerPort: 8888
\`\`\`

> [!IMPORTANT]
> **ความเชื่อมโยงผ่าน Label Selectors:**
> สังเกตว่าใน \`spec.selector.matchLabels\` ต้องตรงกับ \`template.metadata.labels\` เสมอ หากไม่ตรงกัน Deployment จะปฏิเสธการทำงานทันที

### 3. คีย์ลัดและคำสั่ง kubectl ที่ใช้บ่อย

\`\`\`bash
# รันไฟล์ manifest หรืออัปเดตการเปลี่ยนแปลง
kubectl apply -f manifest.yaml

# แสดงรายการทรัพยากรทั้งหมดใน namespace dev
kubectl get pods,svc,ingress -n dev -o wide

# ดูข้อมูลเชิงลึกและ Events ล่าสุด (สำคัญมากเวลา Pod พัง)
kubectl describe pod <pod-name> -n dev

# ดู Log ของแอปในคอนเทนเนอร์
kubectl logs -f <pod-name> -n dev

# เข้าไปรัน shell ชั่วคราวภายใน Pod
kubectl exec -it <pod-name> -n dev -- sh

# ลบทรัพยากรตามไฟล์ manifest
kubectl delete -f manifest.yaml
\`\`\`
`
  }
];
