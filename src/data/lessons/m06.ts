import { Lesson } from '@/types/curriculum';

export const m06Lessons: Lesson[] = [
  {
    id: 'm06-l01',
    slug: 'k3s-architecture-tokens-network-binding',
    moduleId: 'm06',
    title: 'สถาปัตยกรรม K3s Server/Agent, Token และการ Bind Interface',
    objectives: [
      'เข้าใจโครงสร้าง K3s Server (Control plane + Datastore) เทียบกับ K3s Agent (Worker)',
      'เข้าใจกระบวนการ Authentication ระหว่าง Node ด้วย Node Token',
      'เรียนรู้การส่งพารามิเตอร์สำคัญ: --node-ip และ --flannel-iface เพื่อป้องกันทราฟฟิกหลงทาง',
      'ปรับสิทธิ์ Kubeconfig ด้วย --write-kubeconfig-mode 644 เพื่อให้ใช้งาน kubectl ได้สะดวก'
    ],
    prerequisiteIds: ['m05-l01', 'm02-l01', 'm03-l02'],
    stage: 'Part 1',
    readingTime: 9,
    summary: 'สถาปัตยกรรมภายในของ K3s กลไกการเชื่อมต่อข้ามโหนด และการผูกอินเทอร์เฟซเครือข่ายสำหรับคลัสเตอร์สองเครื่องใน Part 1',
    sourceRefs: [
      { sourceId: 'S4', title: 'K3s Architecture & Quick Start' },
      { sourceId: 'S2', title: 'K3s Installation Requirements' },
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' }
    ],
    exerciseIds: ['ex-m06-01'],
    checklistIds: ['chk-m06-l01-01', 'chk-m06-l01-02', 'chk-m06-l01-03'],
    content: `
### 1. สถาปัตยกรรม K3s: Server vs Agent

ใน K3s มี 2 โหมดการทำงานหลัก:

\`\`\`text
  +-------------------------------------------------------------+
  | K3s Server Node (wilS - 192.168.56.110)                     |
  |  - API Server (Port 6443)                                  |
  |  - Controller Manager & Scheduler                          |
  |  - SQLite Datastore (embedded)                             |
  |  - Flannel CNI & Traefik Ingress                           |
  |  - Kubelet & Containerd (สามารถรัน Pods ได้ด้วย)           |
  +-------------------------------------------------------------+
                                 ^
                                 |  (K3S_TOKEN + Port 6443)
                                 v
  +-------------------------------------------------------------+
  | K3s Agent Node (wilSW - 192.168.56.111)                    |
  |  - Kubelet & Kube-proxy                                    |
  |  - Flannel VXLAN (Port 8472 UDP)                           |
  |  - Containerd (สำหรับรัน Pods)                             |
  +-------------------------------------------------------------+
\`\`\`

### 2. กับดักเรื่อง Network Interface และ Flannel

ในเครื่อง Vagrant จะมี 2 interfaces เสมอ:
1. Interface แรก (เช่น \`eth0\` หรือ \`enp0s3\`) รับ IP จาก NAT เช่น \`10.0.2.15\` มี default gateway ออกเน็ต
2. Interface ที่สอง (เช่น \`eth1\` หรือ \`enp0s8\`) รับ IP Dedicated จาก Private Network เช่น \`192.168.56.110\`

> [!CAUTION]
> **ทำไมต้องระบุ \`--flannel-iface\` และ \`--node-ip\`?**
> หากไม่ระบุพารามิเตอร์เหล่านี้ K3s จะเลือก interface ตัวแรกที่เป็น default route (\`10.0.2.15\`) ส่งผลให้:
> - ใน \`kubectl get nodes -o wide\` จะขึ้น INTERNAL-IP เป็น \`10.0.2.15\` แทนที่จะเป็น \`192.168.56.x\`
> - Flannel VXLAN tunnel จะพยายามส่งข้อมูลผ่าน NAT ทำให้ Pod ระหว่าง Server และ Agent คุยกันไม่ได้เลย

### 3. สคริปต์ติดตั้งฝั่ง Server (\`setup_server.sh\`)

\`\`\`bash
#!/bin/bash
set -euo pipefail

# ค้นหาชื่อ interface ที่ถือ IP 192.168.56.110
IFACE=$(ip -br a | grep "192.168.56.110" | awk '{print $1}')

# ติดตั้ง K3s ในโหมด Server
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="
  --node-ip=192.168.56.110
  --flannel-iface=$IFACE
  --write-kubeconfig-mode 644
" sh -

# คัดลอก node-token ออกมาไว้ในแชร์โฟลเดอร์สำหรับให้ worker ดึงไปใช้
mkdir -p /vagrant/shared
cp /var/lib/rancher/k3s/server/node-token /vagrant/shared/node-token
\`\`\`
`
  },
  {
    id: 'm06-l02',
    slug: 'assemble-part1-vagrant-verification',
    moduleId: 'm06',
    title: 'ประกอบและจบ Part 1: Vagrantfile 2 เครื่อง และการตรวจผล',
    objectives: [
      'ประกอบ Vagrantfile และ Provisioning Scripts ให้ทำงานได้สมบูรณ์ในคำสั่ง vagrant up เดียว',
      'จัดการลำดับการติดตั้ง: Server ต้องบูตและสร้าง Token เสร็จก่อน Agent จะเริ่มติดตั้ง',
      'ตรวจสอบข้อกำหนด Part 1 ครบถ้วน: Hostname (wilS/wilSW), Dedicated IP, Passwordless SSH, K3s Status',
      'ซ้อมตอบคำถามที่ผู้ประเมินผลจะถามใน Part 1'
    ],
    prerequisiteIds: ['m06-l01', 'm03-l02', 'm02-l02'],
    stage: 'Part 1',
    readingTime: 10,
    summary: 'ขั้นตอนประกอบงาน Part 1 ฉบับสมบูรณ์ สคริปต์ฝั่ง Worker การตั้งค่า SSH แบบไร้รหัสผ่าน และคำสั่งตรวจผลงาน',
    sourceRefs: [
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6-8, Chapter IV.1 Part 1)' },
      { sourceId: 'S4', title: 'K3s Architecture & Quick Start' }
    ],
    exerciseIds: ['ex-m06-02'],
    checklistIds: ['chk-m06-l02-01', 'chk-m06-l02-02', 'chk-m06-l02-03'],
    content: `
### 1. สคริปต์ติดตั้งฝั่ง Agent (\`setup_worker.sh\`)

ฝั่ง Worker จำเป็นต้องรอให้ไฟล์ \`node-token\` ปรากฏในแชร์โฟลเดอร์ก่อน จึงจะเริ่มรันสคริปต์ติดตั้งได้:

\`\`\`bash
#!/bin/bash
set -euo pipefail

# รอจนกว่าไฟล์ token จากเครื่อง Server จะถูกสร้างขึ้น
TOKEN_FILE="/vagrant/shared/node-token"
echo "Waiting for Server node token..."
while [ ! -f "$TOKEN_FILE" ]; do
  sleep 2
done
TOKEN=$(cat "$TOKEN_FILE")

IFACE=$(ip -br a | grep "192.168.56.111" | awk '{print $1}')

# ติดตั้ง K3s ในโหมด Agent
curl -sfL https://get.k3s.io | \\
  K3S_URL="https://192.168.56.110:6443" \\
  K3S_TOKEN="$TOKEN" \\
  INSTALL_K3S_EXEC="--node-ip=192.168.56.111 --flannel-iface=$IFACE" \\
  sh -
\`\`\`

### 2. การตั้งค่า Passwordless SSH ระหว่างเครื่อง

เพื่อตอบโจทย์ *"Be able to connect with SSH on both machines with no password"*:

สามารถเพิ่มโค้ดในสคริปต์เพื่อสร้างกุญแจ SSH และส่งผ่าน Authorized Keys ระหว่างเครื่อง:

\`\`\`bash
# สร้าง SSH key บนเครื่องหากยังไม่มี
if [ ! -f /home/vagrant/.ssh/id_rsa ]; then
  ssh-keygen -t rsa -N "" -f /home/vagrant/.ssh/id_rsa
  chown vagrant:vagrant /home/vagrant/.ssh/id_rsa*
fi

# รวม public key ของทั้ง 2 เครื่องลงใน authorized_keys
cat /home/vagrant/.ssh/id_rsa.pub >> /vagrant/shared/authorized_keys
cat /vagrant/shared/authorized_keys >> /home/vagrant/.ssh/authorized_keys
sort -u /home/vagrant/.ssh/authorized_keys -o /home/vagrant/.ssh/authorized_keys
chmod 600 /home/vagrant/.ssh/authorized_keys
chown vagrant:vagrant /home/vagrant/.ssh/authorized_keys
\`\`\`

### 3. Checklist การตรวจรับงาน Part 1 ของผู้ประเมิน

เมื่อผู้ตรวจมานั่งข้างๆ คุณ คำสั่งที่จะถูกรันเพื่อประเมิน Part 1 มีดังนี้:

\`\`\`bash
# 1. ตรวจสอบสถานะ VM ทั้งสองเครื่อง
vagrant status

# 2. SSH เข้าเครื่อง Server
vagrant ssh wilS

# 3. ตรวจสอบโหนดและสถานะในคลัสเตอร์ (ต้องเห็น 2 โหนด Ready)
kubectl get nodes -o wide
# ผลลัพธ์ที่คาดหวัง:
# NAME    STATUS   ROLES                  AGE   VERSION   INTERNAL-IP
# wilS    Ready    control-plane,master   5m    v1.28.x   192.168.56.110
# wilSW   Ready    <none>                 3m    v1.28.x   192.168.56.111

# 4. ทดสอบ SSH ข้ามเครื่องโดยไม่ต้องใส่รหัสผ่าน
ssh vagrant@192.168.56.111 "hostname"
# ผลลัพธ์ที่คาดหวัง: wilSW
\`\`\`
`
  }
];
