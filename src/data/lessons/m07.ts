import { Lesson } from '@/types/curriculum';

export const m07Lessons: Lesson[] = [
  {
    id: 'm07-l01',
    slug: 'deployments-replicas-rolling-updates',
    moduleId: 'm07',
    title: 'Deployment, Replicas 3 ตัวของ app2 และการจัดการ Pod Lifecycle',
    objectives: [
      'เข้าใจการทำงานของ Deployment ในการดูแลรักษาจำนวน Replicas ผ่าน ReplicaSet',
      'เขียน Deployment manifest สำหรับ app2 ที่กำหนด replicas: 3 ตามโจทย์ Part 2',
      'เข้าใจกลไก Rolling Update strategy (maxSurge, maxUnavailable) และการ Rollback',
      'ทดลองลบ Pod เพื่อดูพฤติกรรม Self-healing ของ Kubernetes'
    ],
    prerequisiteIds: ['m05-l02'],
    stage: 'Part 2',
    readingTime: 9,
    summary: 'การจัดการ Workload ระดับสูง การกำหนด Replicas และการทำความเข้าใจความต่างระหว่าง Pod ตาย กับ Pod ถูกแทนที่',
    sourceRefs: [
      { sourceId: 'S6', title: 'Kubernetes Deployments Documentation' },
      { sourceId: 'SUB-P9', title: 'en.subject.pdf (Page 9, Chapter IV.2 Part 2)' }
    ],
    exerciseIds: ['ex-m07-01'],
    checklistIds: ['chk-m07-l01-01', 'chk-m07-l01-02', 'chk-m07-l01-03'],
    content: `
### 1. ทำไมโจทย์จึงสั่งให้ app2 มี 3 Replicas?

ในโจทย์ Part 2 (หน้า 9) มีข้อกำหนดเฉพาะว่า:
> *"As you can see, application number 2 has 3 replicas. Adapt your configuration to create the replicas."*

**ข้อควรระวัง:**
- \`replicas: 3\` หมายถึง **รัน Pod สำเนาของ app2 จำนวน 3 ตัวพร้อมกันบนเครื่อง K3s เดียวกัน**
- **ไม่ใช่** การสร้าง VM 3 เครื่อง! ใน Part 2 เราใช้ VM เพียงเครื่องเดียว (\`wilS\`)

### 2. โครงสร้าง Deployment ของ app2

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app2
  labels:
    app: app2
spec:
  replicas: 3          # กำหนด 3 สำเนาตามโจทย์ Part 2
  selector:
    matchLabels:
      app: app2
  template:
    metadata:
      labels:
        app: app2
    spec:
      containers:
      - name: app2
        image: paulbouwer/hello-kubernetes:1.10 # หรือ nginx:alpine ที่แสดงชื่อ app2
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "32Mi"
            cpu: "20m"
          limits:
            memory: "64Mi"
            cpu: "50m"
\`\`\`

### 3. กลไก Pod Replacement และ Self-healing

เมื่อคุณสั่ง \`kubectl delete pod <pod-name>\`:
1. ReplicaSet Controller จะสังเกตเห็นว่าจำนวน Pod ในสถานะพร้อมทำงานลดเหลือ 2 ตัว (ซึ่งน้อยกว่า \`desired: 3\`)
2. Controller จะส่งคำสั่งไปยัง kube-apiserver ให้สร้าง Pod ใหม่ขึ้นมาแทนที่ในทันที
3. ภายในเวลา 1-2 วินาที จำนวน Pod จะกลับมาเป็น 3/3 เช่นเดิม
`
  },
  {
    id: 'm07-l02',
    slug: 'services-endpoints-health-probes',
    moduleId: 'm07',
    title: 'Kubernetes Service, EndpointSlices และการตรวจสุขภาพ (Health Probes)',
    objectives: [
      'เข้าใจความแตกต่างระหว่าง port, targetPort, และ nodePort',
      'เรียนรู้ประเภทของ Service: ClusterIP, NodePort, LoadBalancer',
      'ทำความเข้าใจบทบาทของ EndpointSlices ในการติดตาม Pod IPs',
      'แยกแยะความแตกต่างระหว่าง Liveness Probe, Readiness Probe, และ Startup Probe'
    ],
    prerequisiteIds: ['m07-l01', 'm02-l01'],
    stage: 'Part 2',
    readingTime: 10,
    summary: 'ระบบเครือข่ายภายในและการกระจายโหลดของ Kubernetes การจับคู่พอร์ต และการตรวจเช็กความพร้อมของแอป',
    sourceRefs: [
      { sourceId: 'S7', title: 'Kubernetes Service Documentation' },
      { sourceId: 'S20', title: 'Configure Liveness, Readiness and Startup Probes' },
      { sourceId: 'S21', title: 'Resource Management for Pods' }
    ],
    exerciseIds: ['ex-m07-02'],
    checklistIds: ['chk-m07-l02-01', 'chk-m07-l02-02', 'chk-m07-l02-03'],
    content: `
### 1. คลายความสับสน: port vs targetPort vs nodePort

ในการเขียนไฟล์ Service YAML มักมีพอร์ต 3 ตัวที่ผู้เรียนมักสับสน:

\`\`\`yaml
spec:
  type: NodePort
  ports:
  - port: 80          # พอร์ตที่ Service ให้บริการภายในคลัสเตอร์ (ClusterIP)
    targetPort: 8080  # พอร์ตจริงที่ Container/Pod เปิดรับฟัง (Listening inside container)
    nodePort: 30080   # พอร์ตที่เปิดบน Host IP ของทุกโหนดในคลัสเตอร์ (30000-32767)
\`\`\`

\`\`\`text
  Request จากภายนอก
         |
         v
  [ NodePort: 30080 ] (เข้าทาง IP ของโหนด)
         |
         v
  [ Service Port: 80 ] (ClusterIP ลำดับถัดมา)
         |
         v
  [ Container TargetPort: 8080 ] (ส่งเข้าโปรเซสจริงใน Pod)
\`\`\`

### 2. การทำงานของ EndpointSlices

เมื่อเราสร้าง Service ที่มี \`selector: app=app2\` ตัว Kubernetes Controller จะไปกวาดหา Pods ทั้งหมดที่มี label \`app=app2\` แล้วนำ IP Address ของ Pods เหล่านั้นมาบันทึกไว้ใน **EndpointSlice Object**

หาก Pod ตัวใดดับหรือถูกลบ และมี Pod ใหม่สร้างขึ้นมา IP ของ Pod ใหม่จะถูกอัปเดตลงใน EndpointSlice อัตโนมัติ ทำให้ Service สามารถกระจายโหลดไปยัง Pods ที่มีชีวิตอยู่จริงได้อย่างแม่นยำ

### 3. ความต่างของ Health Probes (คำถามยอดฮิตตอนสอบ)

- **Readiness Probe:** ตรวจว่า "แอปพร้อมรับ Traffic หรือยัง?"
  - หากตรวจ **ไม่ผ่าน**: Service จะตัด IP ของ Pod นั้นออกจาก Endpoints ชั่วคราว (แต่ไม่ฆ่า Pod) เพื่อไม่ให้ลูกค้าเจอหน้าจอ Error
- **Liveness Probe:** ตรวจว่า "แอปค้างหรือ Deadlock หรือไม่?"
  - หากตรวจ **ไม่ผ่าน**: Kubelet จะสั่ง **Restart หรือฆ่าคอนเทนเนอร์ทิ้งทันที** เพื่อเริ่มใหม่
`
  }
];
