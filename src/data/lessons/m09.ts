import { Lesson } from '@/types/curriculum';

export const m09Lessons: Lesson[] = [
  {
    id: 'm09-l01',
    slug: 'k3s-vs-k3d-node-containers-lifecycle',
    moduleId: 'm09',
    title: 'K3s เทียบกับ K3d, Node Containers และการจัดการ Cluster Lifecycle',
    objectives: [
      'เข้าใจความแตกต่างเชิงสถาปัตยกรรมระหว่าง K3s และ K3d',
      'เรียนรู้วิธีการที่ K3d แปลงคอนเทนเนอร์ Docker ให้กลายเป็นโหนดของ Kubernetes',
      'เชี่ยวชาญคำสั่งวงจรชีวิตของ K3d: cluster create, list, stop, start, delete',
      'ทำความเข้าใจการผสาน Kubeconfig ระหว่าง K3d กับเครื่องโฮสต์'
    ],
    prerequisiteIds: ['m04-l01', 'm06-l01'],
    stage: 'Part 3',
    readingTime: 8,
    summary: 'สถาปัตยกรรมของ K3d การจำลองคลัสเตอร์ Kubernetes เบาหวิวภายใน Docker Container และการบริหารจัดการคลัสเตอร์ใน Part 3',
    sourceRefs: [
      { sourceId: 'S10', title: 'K3d Overview & Requirements' },
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12, Chapter IV.3 Part 3)' }
    ],
    exerciseIds: ['ex-m09-01'],
    checklistIds: ['chk-m09-l01-01', 'chk-m09-l01-02', 'chk-m09-l01-03'],
    content: `
### 1. K3s เทียบกับ K3d: ต่างกันอย่างไร?

คำถามยอดฮิตใน Subject หน้า 12:
> *"First of all, you must understand the difference between K3s and K3d."*

| หัวข้อ | K3s (ใช้ใน Part 1 & Part 2) | K3d (ใช้ใน Part 3 & Bonus) |
|---|---|---|
| **รูปแบบการรัน** | รันเป็น Systemd Service บนระบบปฏิบัติการของ VM โดยตรง | **รันเป็น Docker Containers บน Docker Daemon ของเครื่องหลัก** |
| **โหนดแต่ละตัวคืออะไร** | แต่ละโหนดคือ 1 Virtual Machine จริง (wilS, wilSW) | แต่ละโหนดคือ **1 Docker Container** (k3d-*-server-0, etc.) |
| **เครื่องมือที่ต้องพึ่งพา** | พึ่งพา Hypervisor / Vagrant | **พึ่งพา Docker Engine โดยตรง ("without Vagrant")** |
| **ความเร็วในการสร้าง** | ช้า (ต้องบูต VM และลง OS ใช้เวลา 2-5 นาที) | **เร็วมาก (สตาร์ตคอนเทนเนอร์เสร็จใน 10-20 วินาที)** |
| **การใช้ทรัพยากร** | กินแรมเยอะกว่า เพราะมี OS Kernel ซ้อนหลายชั้น | กินแรมน้อยกว่า เพราะแชร์ Kernel เดียวกับโฮสต์ |

### 2. โครงสร้างภายในของ K3d Cluster

เมื่อคุณสั่ง \`k3d cluster create mycluster\`:
1. K3d จะสร้าง Docker Network ขึ้นมา 1 วง (เช่น \`k3d-mycluster\`)
2. สร้างคอนเทนเนอร์โหนดเซิร์ฟเวอร์ \`k3d-mycluster-server-0\`
3. สร้างคอนเทนเนอร์พิเศษชื่อ **\`k3d-mycluster-serverlb\`** ทำหน้าที่เป็น Proxy Load Balancer หน้าบ้าน คอยดักพอร์ตจากเครื่องโฮสต์แล้วส่งเข้าโหนดภายใน

### 3. คำสั่งจัดการ K3d Lifecycle

\`\`\`bash
# สร้างคลัสเตอร์แบบ 1 server
k3d cluster create iot-cluster

# แสดงรายการคลัสเตอร์ทั้งหมดใน Docker
k3d cluster list

# หยุดการทำงานชั่วคราว (ประหยัดแรม)
k3d cluster stop iot-cluster

# สั่งให้กลับมาทำงานต่อ
k3d cluster start iot-cluster

# ลบคลัสเตอร์ทิ้งอย่างสมบูรณ์
k3d cluster delete iot-cluster
\`\`\`
`
  },
  {
    id: 'm09-l02',
    slug: 'k3d-port-mapping-exposing-services',
    moduleId: 'm09',
    title: 'K3d Port Mapping และการ Expose Services สู่ภายนอก',
    objectives: [
      'เข้าใจกลไก Port Mapping ของ K3d ผ่าน serverlb container',
      'ตั้งค่าแฟล็ก --port "8888:8888@loadbalancer" สำหรับแอปพลิเคชันตามโจทย์ Part 3',
      'เชื่อมโยงการตั้งค่าระหว่าง K3d Port Mapping, Service LoadBalancer, และ Pod Port 8888',
      'ทดสอบการยิง curl http://localhost:8888/ จากภายนอกคลัสเตอร์'
    ],
    prerequisiteIds: ['m09-l01', 'm04-l02', 'm07-l02'],
    stage: 'Part 3',
    readingTime: 9,
    summary: 'เทคนิคการเปิดพอร์ตจากภายนอกเข้าสู่ K3d คลัสเตอร์ การใช้งาน serverlb และการเตรียมพอร์ต 8888 สำหรับแอปพลิเคชันของ Wil ใน Part 3',
    sourceRefs: [
      { sourceId: 'S11', title: 'K3d Exposing Services & Port Mapping' },
      { sourceId: 'SUB-P13', title: 'en.subject.pdf (Page 13, Chapter IV.3 Part 3)' }
    ],
    exerciseIds: ['ex-m09-02'],
    checklistIds: ['chk-m09-l02-01', 'chk-m09-l02-02', 'chk-m09-l02-03'],
    content: `
### 1. ปัญหาการเข้าถึงพอร์ตใน K3d

เนื่องจาก K3d รันอยู่ภายใน Docker Containers หากเราสร้างคลัสเตอร์แบบธรรมดาโดยไม่ระบุการแมปพอร์ตไว้ล่วงหน้า คำสั่ง \`curl http://localhost:8888/\` บนเครื่อง VM หลักจะเจอข้อผิดพลาด **\`Connection Refused\`** ทันที เพราะไม่มีพอร์ต 8888 เปิดรับฟังอยู่บนโฮสต์

### 2. การแมปพอร์ตผ่าน @loadbalancer

ใน K3d เราสามารถส่งพารามิเตอร์ \`-p\` หรือ \`--port\` ขณะสร้างคลัสเตอร์ได้ โดยระบุปลายทางเป็น \`@loadbalancer\`:

\`\`\`bash
k3d cluster create iot-cluster \\
  --port "8888:8888@loadbalancer" \\
  --port "8080:80@loadbalancer"
\`\`\`

- \`8888:8888@loadbalancer\`: เปิดพอร์ต 8888 บนเครื่องโฮสต์ และส่งต่อไปยังพอร์ต 8888 ของคอนเทนเนอร์ \`k3d-iot-cluster-serverlb\`
- เมื่อมี Service ชนิด \`LoadBalancer\` หรือ Ingress ภายในคลัสเตอร์ที่ใช้พอร์ต 8888 ตัว Traefik / Klipper ServiceLB จะดึงทราฟฟิกนี้ไปส่งต่อให้ Pod โดยอัตโนมัติ

\`\`\`text
  ผู้ใช้ยิง: curl http://localhost:8888/
                       |
                       v
  [ Docker Host (VM หลัก) พอร์ต 8888 ]
                       |
                       v
  [ Container: k3d-iot-cluster-serverlb (Port 8888) ]
                       |
                       v
  [ Service: wil-playground-svc ชนิด LoadBalancer ]
                       |
                       v
  [ Pod: wil-playground (พอร์ต 8888 ใน dev namespace) ]
\`\`\`

> [!TIP]
> หากสร้างคลัสเตอร์ไปแล้วโดยไม่ได้ใส่พอร์ต 8888 คุณจะไม่สามารถเพิ่มพอร์ตเข้าไปในคลัสเตอร์เดิมได้โดยตรง วิธีที่สะอาดและเร็วที่สุดคือสั่ง \`k3d cluster delete iot-cluster\` แล้วสร้างใหม่โดยระบุพอร์ตให้ถูกต้อง
`
  }
];
