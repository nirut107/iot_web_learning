import { Lesson } from '@/types/curriculum';

export const m00Lessons: Lesson[] = [
  {
    id: 'm00-l01',
    slug: 'lab-architecture-layers',
    moduleId: 'm00',
    title: 'สถาปัตยกรรมระบบและเลเยอร์ของ Inception-of-Things',
    objectives: [
      'แยกแยะความแตกต่างของ 5 เลเยอร์: เครื่องจริง -> VM หลัก -> Vagrant Guest -> K3d Container -> Kubernetes Pod',
      'เข้าใจความหมายของข้อกำหนด "The whole project has to be done in a virtual machine"',
      'อธิบายได้ว่า "without Vagrant" ใน Part 3 หมายถึงอะไร และทำไมจึงไม่ขัดกับ General Guidelines',
      'ตรวจสอบ Nested Virtualization และการจัดสรรทรัพยากรของเครื่อง'
    ],
    prerequisiteIds: [],
    stage: 'Foundation',
    readingTime: 8,
    summary: 'ทำความเข้าใจสถาปัตยกรรมระดับชั้นของระบบ เพื่อไม่ให้สับสนว่าคำสั่งและเซอร์วิสแต่ละตัวรันอยู่ที่ใด',
    sourceRefs: [
      { sourceId: 'SUB-P4', title: 'en.subject.pdf (Page 4, Chapter III General Guidelines)' },
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12, Chapter IV.3 Part 3)' },
      { sourceId: 'S2', title: 'K3s Requirements' }
    ],
    exerciseIds: ['ex-m00-01'],
    checklistIds: ['chk-m00-l01-01', 'chk-m00-l01-02', 'chk-m00-l01-03'],
    content: `
### 1. ลำดับชั้นของระบบ (System Layers)

โปรเจกต์ **Inception-of-Things (IoT)** มีชื่อที่สื่อถึงภาพยนตร์เรื่อง *Inception* เพราะมีการซ้อนชั้นของสภาพแวดล้อมเสมือนหลายระดับ หากไม่เข้าใจว่าตนเองกำลังพิมพ์คำสั่งอยู่ที่เลเยอร์ใด จะทำให้การ Debug เกิดความสับสนอย่างรุนแรง

| ระดับ | เลเยอร์ | บทบาทและหน้าที่ | ตัวอย่างการใช้งานในโปรเจกต์ |
|---|---|---|---|
| **L0** | **เครื่องจริง (Bare-metal Host)** | เครื่องคอมพิวเตอร์ของคุณ (macOS, Windows, Linux) | เปิดโปรแกรม Hypervisor เช่น VirtualBox, UTM, VMware |
| **L1** | **VM หลัก (Main Guest VM)** | สภาพแวดล้อมที่โจทย์บังคับให้ทำงานทั้งหมด | เป็น Linux VM (เช่น Debian 12 หรือ Ubuntu 22.04) ที่เราใช้เปิด Terminal ทำงาน |
| **L2** | **Vagrant Guest VM** | เครื่องเสมือนที่สร้างโดย Vagrant ภายใน VM หลัก | ใช้สำหรับ **Part 1** (wilS, wilSW) และ **Part 2** (wilS) |
| **L3** | **K3d Node Container** | คอนเทนเนอร์ Docker ที่ทำหน้าที่จำลองเป็น K8s Node | ใช้สำหรับ **Part 3** และ **Bonus** โดยรันตรงบน Docker ของ VM หลัก (L1) |
| **L4** | **Kubernetes Pod** | คอนเทนเนอร์ของแอปพลิเคชันที่ถูกจัดการโดย Kubernetes | เช่น Pod wil-playground, Ingress Controller Traefik, Pod ของ GitLab |

> [!IMPORTANT]
> **กฎเหล็กของ General Guidelines:**
> เอกสารโจทย์หน้า 4 ระบุว่า: *"The whole project has to be done in a virtual machine."*
> นั่นหมายความว่า งานทั้งหมดไม่ว่าจะเป็น Part 1, 2, 3 หรือ Bonus ต้องอยู่ใน **VM หลัก (L1)** เสมอ

### 2. ความหมายของ "Without Vagrant" ใน Part 3

ในโจทย์ Part 3 (หน้า 12) มีข้อความว่า:
> *"Time to set up everything you have just learnt (and much more!) but without Vagrant this time. To begin, install K3d on your virtual machine."*

**ข้อควรระวังอย่างยิ่ง:**
คำว่า "without Vagrant" **ไม่ได้หมายความว่าให้คุณปิด VM แล้วกลับไปทำบนเครื่อง Mac หรือ Windows ของคุณ** แต่หมายถึง:
1. ใน Part 1 และ Part 2 เราใช้ Vagrant เพื่อสร้าง Guest VM (L2) ขึ้นมาติดตั้ง K3s
2. ใน Part 3 เราไม่ต้องสร้าง Guest VM อีกแล้ว แต่จะติดตั้ง **Docker** และ **K3d** ลงใน **VM หลัก (L1)** โดยตรง
3. แต่ละโหนดของ K3s จะถูกจำลองขึ้นมาเป็น **Docker Container (L3)** ภายใน VM หลักแทน

### 3. การตรวจสอบ Nested Virtualization

หากคุณเลือกที่จะรัน Vagrant + VirtualBox ซ้อนภายใน VM หลัก (Nested Virtualization) CPU ของเครื่องจริงจะต้องรองรับและเปิดใช้งานการส่งต่อคำสั่ง Virtualization (VT-x สำหรับ Intel หรือ AMD-V สำหรับ AMD)

วิธีตรวจสอบบน Linux VM หลัก:
\`\`\`bash
egrep -c "(vmx|svm)" /proc/cpuinfo
\`\`\`
- ถ้าได้ผลลัพธ์เป็น **ตัวเลขตั้งแต่ 1 ขึ้นไป**: แสดงว่าเครื่องเปิดใช้งาน Nested Virtualization สำเร็จ
- ถ้าได้ผลลัพธ์เป็น **0**: ให้ปิด VM หลัก แล้วไปเปิดฟังก์ชัน Nested VT-x/AMD-V ในการตั้งค่า Processor ของ Hypervisor บนเครื่องจริง
`
  },
  {
    id: 'm00-l02',
    slug: 'network-ip-resource-plan',
    moduleId: 'm00',
    title: 'แผนทรัพยากร, IP/Network Plan และการแกะ Subject v4.0',
    objectives: [
      'เข้าใจแผนผัง IP Address และความสำคัญของ Primary Dedicated Interface',
      'วิเคราะห์ความขัดแย้งของข้อกำหนด RAM 512MB ในโจทย์ เทียบกับ K3s ปัจจุบัน',
      'แกะข้อกำหนดและดักทางเงื่อนไขต่างๆ ของ Subject Version 4.0'
    ],
    prerequisiteIds: ['m00-l01'],
    stage: 'Foundation',
    readingTime: 9,
    summary: 'วางแผน IP 192.168.56.x จัดสรรงบประมาณ RAM/CPU และวิเคราะห์ข้อกำหนดใน Subject อย่างละเอียด',
    sourceRefs: [
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' },
      { sourceId: 'SUB-P9', title: 'en.subject.pdf (Page 9, Chapter IV.2 Part 2)' },
      { sourceId: 'S2', title: 'K3s Requirements' }
    ],
    exerciseIds: ['ex-m00-02'],
    checklistIds: ['chk-m00-l02-01', 'chk-m00-l02-02', 'chk-m00-l02-03'],
    content: `
### 1. แผนผัง IP และการตั้งชื่อตามโจทย์ (Naming & IP Plan)

โจทย์ Subject Version 4.0 กำหนดรูปแบบการตั้งชื่อและ IP Address ไว้อย่างชัดเจน โดยใช้ชื่อล็อกอินของสมาชิกในกลุ่มนำหน้า (สมมติว่าชื่อล็อกอินคือ \`wil\`):

| Part | เครื่อง / สภาพแวดล้อม | Hostname ที่ต้องตั้ง | IP Address ที่ต้องมี | บทบาทหน้าที่ |
|---|---|---|---|---|
| **Part 1** | Server VM | \`wilS\` (ลงท้ายด้วย S ตัวใหญ่) | \`192.168.56.110\` | K3s Controller / Server |
| **Part 1** | ServerWorker VM | \`wilSW\` (ลงท้ายด้วย SW ตัวใหญ่) | \`192.168.56.111\` | K3s Agent / Worker |
| **Part 2** | Server VM | \`wilS\` (ลงท้ายด้วย S ตัวใหญ่) | \`192.168.56.110\` | K3s Server รัน 3 Web Apps |
| **Part 3** | K3d on Main VM | ตามชื่อโฮสต์ของ VM หลัก | Localhost / \`0.0.0.0\` (Port 8888) | K3d Cluster + Argo CD |
| **Bonus** | GitLab on K3d | \`gitlab.local\` หรือ Service DNS | Cluster IP / Ingress | Local GitLab Instance |

> [!WARNING]
> **ระวังเรื่อง Predictable Network Interface Names:**
> ในภาพตัวอย่างของ Subject รุ่นเก่าจะแสดงชื่อ interface เป็น \`eth1\` แต่ใน Linux Distribution ยุคใหม่ (Debian 11/12, Ubuntu 22.04+) ระบบจะตั้งชื่อตามฮาร์ดแวร์จริง เช่น \`enp0s8\` หรือ \`enp0s3\` ดังนั้นอย่าเขียนสคริปต์แบบฮาร์ดโค้ด \`eth1\` ตายตัว ให้ตรวจหา interface จริงด้วย \`ip a\`

### 2. วิเคราะห์ประเด็น RAM 512 MB: คำแนะนำโจทย์ vs ความเป็นจริง

ในโจทย์ Part 1 หน้า 6 ระบุว่า:
> *"It is STRONGLY advised to allow only the bare minimum in terms of resources: 1 CPU and 512 MB of RAM (or 1024)."*

**สิ่งที่คุณต้องทราบเพื่อไม่ให้ระบบพัง:**
1. **สถานะของข้อกำหนด:** โจทย์ระบุว่า "STRONGLY advised" (แนะนำอย่างยิ่ง) และมีวงเล็บว่า **(or 1024)** แสดงว่า **1024 MB (1 GB) ได้รับอนุญาตตามโจทย์อย่างเป็นทางการ**
2. **K3s Requirement ปัจจุบัน:** เอกสารทางการของ K3s ระบุว่า K3s Server ต้องการ RAM ขั้นต่ำอย่างน้อย 512 MB สำหรับ agent และ 1-2 GB สำหรับ server
3. **ผลกระทบจากการฝืนใช้ 512 MB:** หากตั้ง 512 MB โดยไม่ปรับแต่ง เคอร์เนลจะเรียก **OOM-Killer (Out of Memory Killer)** มาสั่งฆ่าโปรเซสของ K3s หรือ Pod ของ CoreDNS/Flannel จนเกิดสถานะ \`CrashLoopBackOff\`
4. **แนวทางที่ถูกต้อง:**
   - ในการทำแล็บจริง แนะนำให้ใช้ **1024 MB** ตามที่โจทย์อนุญาต
   - หากต้องการทดลอง 512 MB ให้สร้าง **Linux Swap File** เพิ่มเติมขนาด 1-2 GB และส่งแฟล็กปิดเซอร์วิสที่ไม่จำเป็น เช่น \`--disable=traefik,servicelb,metrics-server\` ใน Part 1

### 3. งบประมาณทรัพยากรรวมของเครื่องโฮสต์ (Resource Budget)

| สเตจ | CPU Cores แนะนำ | RAM แนะนำ | พื้นที่ดิสก์ขั้นต่ำ |
|---|---|---|---|
| **Part 1 (Vagrant 2 VMs)** | 2 Cores | 2 GB (1GB ต่อ VM) | 20 GB |
| **Part 2 (Vagrant 1 VM)** | 1-2 Cores | 1.5 - 2 GB | 20 GB |
| **Part 3 (Docker + K3d)** | 2 Cores | 3 - 4 GB | 25 GB |
| **Bonus (GitLab + Argo)** | **4 Cores** | **6 - 8 GB** | **40 GB** |

> [!TIP]
> ส่วน Bonus (GitLab) เป็นส่วนที่กินทรัพยากรมากที่สุด หากเครื่องของคุณมี RAM ไม่ถึง 8 GB แนะนำให้โฟกัสที่การทำ Part 1, 2, 3 ให้สมบูรณ์แบบ 100% ก่อน เพราะโบนัสจะไม่ได้รับการตรวจหาก Mandatory มีข้อผิดพลาดแม้แต่ข้อเดียว
`
  }
];
