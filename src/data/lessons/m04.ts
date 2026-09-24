import { Lesson } from '@/types/curriculum';

export const m04Lessons: Lesson[] = [
  {
    id: 'm04-l01',
    slug: 'container-vs-vm-namespaces-cgroups',
    moduleId: 'm04',
    title: 'Container เทียบกับ VM, สถาปัตยกรรม Namespaces และ Cgroups',
    objectives: [
      'เข้าใจความแตกต่างอย่างลึกซึ้งระหว่าง Container กับ Virtual Machine',
      'ทำความเข้าใจบทบาทของ Linux Namespaces (PID, NET, MNT, IPC, UTS, USER)',
      'เข้าใจกลไก Control Groups (Cgroups) ในการจำกัด CPU และ Memory',
      'แยกแยะคำศัพท์สำคัญ: Image, Container, Registry, Repository, Tag, และ Digest'
    ],
    prerequisiteIds: ['m01-l01'],
    stage: 'Foundation',
    readingTime: 8,
    summary: 'รากฐานของคอนเทนเนอร์ การทำงานภายใต้เคอร์เนลของ Linux และความแตกต่างเชิงโครงสร้างเมื่อเทียบกับเครื่องเสมือน',
    sourceRefs: [
      { sourceId: 'S3', title: 'Docker: What is a container?' },
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12, Chapter IV.3 Part 3)' }
    ],
    exerciseIds: ['ex-m04-01'],
    checklistIds: ['chk-m04-l01-01', 'chk-m04-l01-02', 'chk-m04-l01-03'],
    content: `
### 1. ความแตกต่างระหว่าง Container และ Virtual Machine

| คุณลักษณะ | Virtual Machine (VM) | Container (Docker / Pod) |
|---|---|---|
| **Hypervisor / Engine** | มี Hypervisor (Type 1 หรือ Type 2) จำลองฮาร์ดแวร์เสมือน | รันตรงบน Linux Kernel ผ่าน Container Runtime (containerd) |
| **ระบบปฏิบัติการ (OS)** | แต่ละ VM ต้องมี **Guest OS + Kernel ของตนเอง** | **แชร์ Host OS Kernel ร่วมกันทั้งหมด** |
| **ขนาด (Footprint)** | หลายกิกะไบต์ (GBs) บูตช้า (10-60 วินาที) | ไม่กี่เมกะไบต์ (MBs) บูตเร็วในระดับมิลลิวินาที |
| **การกินทรัพยากร** | กินแรมและ CPU เยอะตามที่จองไว้ | ใช้ทรัพยากรเท่าที่โปรเซสต้องการจริง |

### 2. เทคโนโลยีเบื้องหลังของ Linux Container

คอนเทนเนอร์ไม่ใช่เวทมนตร์ แต่เป็นการรวมตัวกันของ 2 ฟีเจอร์หลักใน Linux Kernel:

1. **Linux Namespaces (การแยกการมองเห็น):**
   - **PID Namespace:** คอนเทนเนอร์จะมองเห็นว่าโปรเซสของตนเองเป็น PID 1 เสมือนเป็นเครื่องเดี่ยว
   - **NET Namespace:** มี Network Interface, IP, และ Routing Table แยกเป็นของตนเอง
   - **MNT Namespace:** มีมุมมอง Filesystem (Rootfs) เป็นของตนเอง ไม่เห็นไฟล์ของโฮสต์
   - **UTS Namespace:** สามารถตั้งค่า Hostname แยกต่างหากได้

2. **Control Groups / Cgroups (การจำกัดทรัพยากร):**
   - คอยควบคุมและวัดปริมาณทรัพยากร เช่น จำกัดว่าคอนเทนเนอร์นี้ห้ามใช้ CPU เกิน 1 Core และห้ามใช้ RAM เกิน 256 MB หากใช้แรมเกินขีดจำกัด Cgroup จะสั่งยิง **OOM-Killer (Exit Code 137)** ทันที

### 3. ศัพท์สำคัญที่ห้ามจำสับสน

- **Image:** แม่พิมพ์คงที่ (Immutable template) ประกอบด้วย binaries, libraries และโค้ด
- **Container:** สำเนาการทำงานจริง (Runtime instance) ของ Image ที่กำลังรันอยู่
- **Registry:** เซิร์ฟเวอร์ที่เก็บรวบรวม Images (เช่น Docker Hub, GitHub Packages, Local GitLab)
- **Tag:** ป้ายบอกเวอร์ชัน เช่น \`:v1\`, \`:v2\`, \`:latest\`
- **Digest (SHA256):** ลายนิ้วมือแฮชของ Image ป้องกันการเปลี่ยนเนื้อหาภายใต้แท็กเดิม
`
  },
  {
    id: 'm04-l02',
    slug: 'port-publishing-volumes-dockerfile',
    moduleId: 'm04',
    title: 'Port Publishing, Volumes และการเขียน Dockerfile สำหรับแอป',
    objectives: [
      'เข้าใจกลไกการ Publish Port (-p hostPort:containerPort) ผ่าน iptables NAT',
      'ทำความเข้าใจ Volume Mount เพื่อรักษาข้อมูลให้คงอยู่ (Data Persistence)',
      'เขียน Dockerfile สำหรับสร้าง Custom Application เพื่อใช้ใน Part 3',
      'เรียนรู้วิธีการ Build, Tagging และ Push image ขึ้นสู่ Docker Hub'
    ],
    prerequisiteIds: ['m04-l01', 'm02-l01'],
    stage: 'Foundation',
    readingTime: 9,
    summary: 'การเชื่อมต่อพอร์ตเครือข่ายเข้าคอนเทนเนอร์ การจัดเก็บข้อมูลถาวร และการเขียน Dockerfile เพื่อสร้าง Image สองเวอร์ชันตามโจทย์',
    sourceRefs: [
      { sourceId: 'SUB-P13', title: 'en.subject.pdf (Page 13, Chapter IV.3 Part 3)' },
      { sourceId: 'S3', title: 'Docker: What is a container?' }
    ],
    exerciseIds: ['ex-m04-02'],
    checklistIds: ['chk-m04-l02-01', 'chk-m04-l02-02', 'chk-m04-l02-03'],
    content: `
### 1. การเชื่อมต่อพอร์ต (Port Publishing)

เนื่องจากคอนเทนเนอร์มี Network Namespace เป็นของตนเอง จึงมี IP ภายในที่ไม่สามารถเข้าถึงได้จากภายนอกเครื่องโฮสต์โดยตรง การเปิดพอร์ตทำได้ด้วยคำสั่ง:

\`\`\`bash
docker run -d -p 8888:80 --name my-web nginx:alpine
\`\`\`
- \`8888\`: พอร์ตบนเครื่องโฮสต์ (ที่ผู้ใช้เข้าหาผ่าน \`http://localhost:8888\`)
- \`80\`: พอร์ตภายในคอนเทนเนอร์ที่โปรแกรมกำลังเปิดรับฟัง (Listening)

### 2. ทางเลือกใน Part 3: Wil Playground vs Custom App

ในโจทย์ Part 3 หน้า 13 ให้ทางเลือกคุณ 2 ทาง:
1. **ใช้แอปของ Wil:** มี Image สำเร็จรูปบน Docker Hub ชื่อ \`wil42/playground:v1\` และ \`wil42/playground:v2\` โดยแอปนี้จะเปิดรับฟังที่ **พอร์ต 8888** และส่งค่า JSON ออกมาเป็น \`{"status":"ok", "message": "v1"}\`
2. **สร้างแอปด้วยตนเอง:** เขียนโค้ดเองและสร้าง Dockerfile จากนั้นสร้าง Public Docker Hub repo แล้ว push แท็ก \`v1\` และ \`v2\` ที่มีความต่างกันของเนื้อหา

> [!TIP]
> **คำแนะนำเชิงกลยุทธ์:**
> การเลือกใช้ \`wil42/playground\` ช่วยประหยัดเวลาและตรงกับตัวอย่างใน Subject หน้า 14-16 เป๊ะที่สุด แต่หากต้องการทำแอปเอง ให้ดูตัวอย่าง Dockerfile ด้านล่าง

### 3. ตัวอย่างการเขียน Dockerfile สองเวอร์ชัน

\`\`\`dockerfile
# ใช้ Base image ขนาดเล็ก
FROM alpine:3.19

# ติดตั้งแพ็กเกจที่จำเป็น
RUN apk add --no-cache python3

WORKDIR /app

# รับตัวแปรเวอร์ชันตอน build
ARG VERSION=v1
RUN echo "{\"status\":\"ok\", \"message\": \"$VERSION\"}" > index.html

EXPOSE 8888

# รัน HTTP server จำลอง
CMD ["python3", "-m", "http.server", "8888"]
\`\`\`

#### คำสั่ง Build และ Tag:
\`\`\`bash
# Build เวอร์ชัน 1
docker build --build-arg VERSION=v1 -t <your-dockerhub-user>/my-iot-app:v1 .

# Build เวอร์ชัน 2
docker build --build-arg VERSION=v2 -t <your-dockerhub-user>/my-iot-app:v2 .

# Push ขึ้น Docker Hub
docker push <your-dockerhub-user>/my-iot-app:v1
docker push <your-dockerhub-user>/my-iot-app:v2
\`\`\`
`
  }
];
