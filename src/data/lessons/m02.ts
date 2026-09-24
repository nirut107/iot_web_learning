import { Lesson } from '@/types/curriculum';

export const m02Lessons: Lesson[] = [
  {
    id: 'm02-l01',
    slug: 'network-interfaces-subnets-routing',
    moduleId: 'm02',
    title: 'IP, Subnet, Routing และความต่างของรูปแบบเครือข่าย VM',
    objectives: [
      'แยกแยะความแตกต่างระหว่าง NAT, Host-Only (Private Network), และ Bridged Network',
      'เข้าใจการจัดสรรวงเครือข่าย 192.168.56.0/24 ใน Vagrant',
      'ทำความเข้าใจความแตกต่างของ Listening Address ระหว่าง 127.0.0.1 (Localhost) กับ 0.0.0.0 (All interfaces)',
      'ตรวจสอบ Routing Table และ Default Gateway ของเครื่อง'
    ],
    prerequisiteIds: ['m00-l02'],
    stage: 'Foundation',
    readingTime: 8,
    summary: 'รากฐานระบบเครือข่ายสำหรับ Virtual Machines การเลือกประเภทการเชื่อมต่อ และการสื่อสารข้ามโหนด',
    sourceRefs: [
      { sourceId: 'S1', title: 'Vagrant Multi-Machine & Private Networks' },
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' }
    ],
    exerciseIds: ['ex-m02-01'],
    checklistIds: ['chk-m02-l01-01', 'chk-m02-l01-02', 'chk-m02-l01-03'],
    content: `
### 1. เปรียบเทียบโหมดเครือข่ายของ Virtual Machine

เมื่อเราสร้างเครื่องเสมือนใน Hypervisor (เช่น VirtualBox) เราสามารถเลือกโหมดเครือข่ายได้หลายแบบ:

| ชนิดเครือข่าย | การเข้าถึงอินเทอร์เน็ต | เครื่องโฮสต์เข้าหา VM | VM อื่นในโฮสต์เดียวกันเข้าหา | ใช้ตรงไหนในโปรเจกต์ |
|---|---|---|---|---|
| **NAT (Default)** | เข้าถึงเน็ตภายนอกได้ | เข้าไม่ได้โดยตรง (ต้องทำ Port Forward) | คุยกันไม่ได้ | interface แรกสำหรับดาวน์โหลดแพ็กเกจ |
| **Host-Only / Private** | ออกเน็ตภายนอกไม่ได้ | **โฮสต์เข้าหา VM ได้โดยตรง** | **VM ในวงเดียวกันคุยกันได้** | **ใช้ใน Part 1 และ Part 2 สำหรับ 192.168.56.x** |
| **Bridged** | เข้าถึงเน็ตและเกาะวงแลนจริงของโฮสต์ | โฮสต์และอุปกรณ์อื่นในบ้านเข้าหาได้ | ทุกเครื่องในบ้านเข้าหาได้ | ไม่แนะนำสำหรับโปรเจกต์นี้เพราะ IP จะเปลี่ยนตาม Wi-Fi |

> [!IMPORTANT]
> **ทำไมต้องมี 2 Interfaces ใน Part 1?**
> ใน Vagrant เครื่อง Server และ ServerWorker จะมี 2 interfaces เสมอ:
> 1. \`eth0\` (NAT): มีไว้เพื่อให้เครื่องสามารถต่อเน็ตเพื่อ \`apt update\` และโหลด k3s script
> 2. \`eth1\` (Private Network): มีไว้เพื่อให้โฮสต์และ VM ทั้งสองคุยกันได้ผ่านวงคงที่ **192.168.56.110** และ **192.168.56.111**

### 2. Listening Address: 127.0.0.1 vs 0.0.0.0

- **\`127.0.0.1\` (Loopback / Localhost):** เซอร์วิสจะรับคำขอเฉพาะโปรเซสที่รันอยู่บนเครื่องเดียวกันเท่านั้น หากรันเว็บเซิร์ฟเวอร์ผูกกับ 127.0.0.1 เครื่องภายนอกจะไม่สามารถเปิดเว็บได้เลย
- **\`0.0.0.0\` (INADDR_ANY):** เซอร์วิสจะเปิดรับการเชื่อมต่อจากทุก Network Interface ในเครื่อง ทั้ง NAT, Private Network และ Localhost (เว็บเซิร์ฟเวอร์และ Ingress ต้องผูกกับ 0.0.0.0 เสมอ)
`
  },
  {
    id: 'm02-l02',
    slug: 'http-host-header-ssh-keys',
    moduleId: 'm02',
    title: 'HTTP Host Header, Virtual Hosting และ Passwordless SSH',
    objectives: [
      'เข้าใจบทบาทของ HTTP Host Header ในการทำ Virtual Hosting และ Ingress Routing',
      'ใช้คำสั่ง curl -H "Host: ..." เพื่อทดสอบจำลองทราฟฟิกโดยไม่ต้องพึ่งพา DNS',
      'สร้างและตั้งค่า SSH Key Pair (Ed25519/RSA) สำหรับการล็อกอินแบบ Passwordless',
      'ทำความเข้าใจความต่างของ ~/.ssh/known_hosts และ ~/.ssh/authorized_keys'
    ],
    prerequisiteIds: ['m02-l01', 'm01-l01'],
    stage: 'Foundation',
    readingTime: 9,
    summary: 'กลไกของ HTTP Host Header สำหรับการเร้าต์ใน Part 2 และการตั้งค่ากุญแจ SSH สำหรับการควบคุมข้ามเครื่องโดยไม่ต้องใส่รหัสผ่าน',
    sourceRefs: [
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' },
      { sourceId: 'SUB-P9', title: 'en.subject.pdf (Page 9, Chapter IV.2 Part 2)' },
      { sourceId: 'S8', title: 'Kubernetes Ingress Concept' }
    ],
    exerciseIds: ['ex-m02-02'],
    checklistIds: ['chk-m02-l02-01', 'chk-m02-l02-02', 'chk-m02-l02-03'],
    content: `
### 1. HTTP Host Header: หัวใจของการทำ Ingress ใน Part 2

ในระดับเครือข่าย:
1. **IP Address (Layer 3):** ใช้ส่งแพ็กเก็ตจากต้นทางไปยังเครื่องปลายทาง (\`192.168.56.110\`)
2. **HTTP Host Header (Layer 7):** เป็นบรรทัดข้อความใน HTTP Request ที่บอกว่าต้องการเว็บไซต์ใด:

\`\`\`http
GET / HTTP/1.1
Host: app1.com
User-Agent: curl/7.88.1
Accept: */*
\`\`\`

เมื่อ Ingress Controller (Traefik) รับคำขอนี้เข้ามา มันจะอ่านบรรทัด \`Host: app1.com\` แล้วนำไปเทียบกับ Ingress Rules ในคลัสเตอร์เพื่อส่งทราฟฟิกต่อไปยัง Service ของ \`app1\` ได้อย่างถูกต้อง

#### วิธีทดสอบด้วย curl โดยไม่ต้องแก้ไฟล์ /etc/hosts:
\`\`\`bash
# ส่งคำขอไปที่ IP 192.168.56.110 แต่แนบ Host header เป็น app1.com
curl -H "Host: app1.com" http://192.168.56.110/

# ส่งคำขอไปที่ IP ตรงๆ เพื่อดูว่า Ingress จะ fallback ไปหา app3 หรือไม่
curl http://192.168.56.110/
\`\`\`

### 2. Passwordless SSH: กุญแจและระบบยืนยันตัวตน

ในโจทย์ Part 1 หน้า 6 ระบุข้อกำหนดว่า:
> *"Be able to connect with SSH on both machines with no password."*

#### หลักการทำงานของ Asymmetric Cryptography:
1. **Private Key (ตัวลับ):** เก็บไว้ที่เครื่องต้นทาง ห้ามเปิดเผยให้ใครรู้เด็ดขาด มีสิทธิ์ \`600\`
2. **Public Key (กุญแจสาธารณะ):** นำไปวางต่อท้ายในไฟล์ \`~/.ssh/authorized_keys\` บนเครื่องปลายทาง

#### ขั้นตอนการตั้งค่า:
\`\`\`bash
# 1. สร้าง Key pair แบบ Ed25519 (เร็วกว่าและปลอดภัยกว่า RSA)
ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519

# 2. คัดลอก Public Key ไปยังเครื่องปลายทาง
ssh-copy-id -i ~/.ssh/id_ed25519.pub vagrant@192.168.56.110

# 3. ทดสอบการเชื่อมต่อ
ssh vagrant@192.168.56.110 "hostname"
\`\`\`

> [!TIP]
> เพื่อป้องกันไม่ให้ SSH ถามยืนยัน \`Are you sure you want to continue connecting (yes/no)?\` ตอนรันอัตโนมัติ ให้เพิ่มออปชัน:
> \`-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null\`
`
  }
];
