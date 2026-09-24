import { Lesson } from '@/types/curriculum';

export const m01Lessons: Lesson[] = [
  {
    id: 'm01-l01',
    slug: 'linux-permissions-processes-systemd',
    moduleId: 'm01',
    title: 'Linux Filesystem, สิทธิ์ และการจัดการ Systemd Services',
    objectives: [
      'เข้าใจโครงสร้าง Filesystem สำคัญ เช่น /etc, /var/log, /var/lib/rancher',
      'เชี่ยวชาญการกำหนดสิทธิ์ด้วย chmod แบบ Octal และความสำคัญของ 700/600 ใน SSH',
      'ตรวจสอบและควบคุม Systemd Service (k3s, docker, sshd) ด้วย systemctl และ journalctl',
      'วิเคราะห์สถานะ Process และการใช้งานทรัพยากรด้วย ps, top, และ free'
    ],
    prerequisiteIds: ['m00-l01'],
    stage: 'Foundation',
    readingTime: 8,
    summary: 'รากฐานของระบบปฏิบัติการ Linux การจัดการไฟล์ สิทธิ์ความปลอดภัย และการควบคุมเซอร์วิสในเบื้องหลัง',
    sourceRefs: [
      { sourceId: 'S4', title: 'K3s Architecture & Quick Start' }
    ],
    exerciseIds: ['ex-m01-01'],
    checklistIds: ['chk-m01-l01-01', 'chk-m01-l01-02', 'chk-m01-l01-03'],
    content: `
### 1. โครงสร้าง Linux Filesystem ที่สำคัญในโปรเจกต์นี้

ใน Inception-of-Things คุณจะต้องทำงานกับไฟล์คอนฟิกและไฟล์ระบบของ K3s และ Docker อย่างใกล้ชิด:

- \`/etc/rancher/k3s/\`: ที่เก็บไฟล์ \`config.yaml\` และการตั้งค่าของ K3s Server
- \`/var/lib/rancher/k3s/server/\`: ที่เก็บข้อมูล Datastore ภายใน (SQLite), ใบรับรอง TLS, และไฟล์ **\`node-token\`** ที่ใช้สำหรับให้ Agent จอยเข้ามา
- \`/etc/systemd/system/\`: ที่เก็บ Unit file ของเซอร์วิส เช่น \`k3s.service\` และ \`k3s-agent.service\`
- \`~/.kube/config\`: ไฟล์คอนฟิกการเข้าถึงคลัสเตอร์สำหรับคำสั่ง \`kubectl\`

### 2. สิทธิ์ความปลอดภัยของไฟล์ (File Permissions)

ในงาน System Administration สิทธิ์ของไฟล์มีความสำคัญอย่างยิ่ง โดยเฉพาะกับไฟล์กุญแจ SSH และ Token ลับ:

\`\`\`text
  r w x  r - x  r - -
  | | |  | | |  | | |
  4 2 1  4 0 1  4 0 0
  -----  -----  -----
  User   Group  Others   => 754
\`\`\`

> [!CAUTION]
> **กฎความปลอดภัยของ SSH:**
> โปรแกรม OpenSSH จะ **ปฏิเสธการเชื่อมต่อทันที** หากสิทธิ์ของไดเรกทอรีหรือไฟล์กุญแจเปิดกว้างเกินไป:
> - โฟลเดอร์ \`~/.ssh\` ต้องมีสิทธิ์เป็น **\`700\`** (\`drwx------\`)
> - ไฟล์ \`~/.ssh/authorized_keys\` และ Private Key ต้องมีสิทธิ์เป็น **\`600\`** (\`-rw-------\`)

### 3. การควบคุมเซอร์วิสด้วย Systemd

ทั้ง Docker และ K3s ทำงานเป็น Systemd Service ใน Linux การตรวจสอบสถานะและดู log อย่างคล่องแคล่วจึงเป็นทักษะจำเป็นอันดับหนึ่ง:

\`\`\`bash
# ตรวจสอบสถานะว่าเซอร์วิสรันอยู่หรือไม่
sudo systemctl status k3s

# สั่งเริ่ม / หยุด / เริ่มใหม่
sudo systemctl restart k3s

# สั่งให้เริ่มทำงานอัตโนมัติตอนบูตเครื่อง
sudo systemctl enable --now k3s

# ดู Log สดๆ ขณะทำงาน (Tail follow)
sudo journalctl -u k3s -f

# ดู Log ย้อนหลัง 100 บรรทัดล่าสุดที่มี error
sudo journalctl -u k3s -n 100 -p err
\`\`\`
`
  },
  {
    id: 'm01-l02',
    slug: 'bash-automation-idempotency-git',
    moduleId: 'm01',
    title: 'Bash Scripting แบบ Idempotent และ Git สำหรับ GitOps',
    objectives: [
      'เข้าใจหลักการ Idempotency ในการเขียนสคริปต์ Provisioning และติดตั้งเครื่องมือ',
      'ใช้งาน Bash Safety Flags: set -euo pipefail เพื่อป้องกันสคริปต์ทำงานผิดพลาดเงียบๆ',
      'ใช้งาน Heredoc (cat << EOF) สำหรับสร้างไฟล์คอนฟิกแบบ Multi-line อย่างสะอาดตา',
      'ฝึกฝน Git Workflow พื้นฐานที่ต้องใช้ใน Part 3 (Commit, Push, Revert, Tagging)'
    ],
    prerequisiteIds: ['m01-l01'],
    stage: 'Foundation',
    readingTime: 9,
    summary: 'เทคนิคการเขียนสคริปต์อัตโนมัติที่ปลอดภัย รันซ้ำได้ไม่พัง และการใช้งาน Git ที่สอดคล้องกับแนวคิด GitOps',
    sourceRefs: [
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12, Chapter IV.3 Part 3)' },
      { sourceId: 'S12', title: 'Argo CD Automated Sync' }
    ],
    exerciseIds: ['ex-m01-02'],
    checklistIds: ['chk-m01-l02-01', 'chk-m01-l02-02', 'chk-m01-l02-03'],
    content: `
### 1. หลักการ Idempotency (ความเป็นเอกพันธ์)

> **นิยาม:** คำสั่งหรือสคริปต์ที่มีคุณสมบัติ **Idempotent** คือเมื่อรัน 1 ครั้ง หรือรัน 100 ครั้ง ผลลัพธ์สุดท้ายของระบบต้องเหมือนเดิมเสมอ โดยไม่สร้างไฟล์ขยะซ้ำ ไม่เพิ่มข้อความซ้ำซ้อน และไม่พ่น Error ออกมา

ในการเขียนสคริปต์ติดตั้งสำหรับ Part 3 (\`install_tools.sh\`) หรือ Vagrant Provisioning ผู้ตรวจอาจรันสคริปต์ซ้ำหลายรอบ หากเขียนแบบไม่ดักไว้ สคริปต์อาจพังทันที

**เปรียบเทียบสคริปต์แบบธรรมดา vs แบบ Idempotent:**

\`\`\`bash
# ❌ แบบไม่ Idempotent (รันครั้งที่สองจะ error หรือเขียนทับซ้ำๆ)
mkdir /opt/myapp
echo "export PATH=$PATH:/opt/k3s" >> ~/.bashrc

# ✅ แบบ Idempotent (ตรวจเช็กก่อนทำเสมอ)
mkdir -p /opt/myapp
if ! grep -q "/opt/k3s" ~/.bashrc; then
  echo 'export PATH=$PATH:/opt/k3s' >> ~/.bashrc
fi
\`\`\`

### 2. เทคนิค Bash ที่ปลอดภัยสำหรับ Automation

เมื่อเขียน Shell Script สำหรับงานโครงสร้างพื้นฐาน ควรวาง Header เหล่านี้ไว้ที่บรรทัดบนสุดเสมอ:

\`\`\`bash
#!/bin/bash
set -euo pipefail

# -e : หยุดการทำงานทันทีหากมีคำสั่งใดคืนค่า exit code ไม่เท่ากับ 0
# -u : แจ้งเตือนข้อผิดพลาดทันทีหากมีการอ้างถึงตัวแปรที่ยังไม่ได้ประกาศ (Unset variables)
# -o pipefail : หากคำสั่งใน pipe เช่น cmd1 | cmd2 ล้มเหลว ให้ถือว่าทั้งบรรทัดล้มเหลว
\`\`\`

### 3. การสร้างไฟล์คอนฟิกด้วย Heredoc

แทนที่จะใช้ \`echo\` ทีละบรรทัด ให้ใช้ \`cat << 'EOF'\` เพื่อเขียน YAML หรือ Vagrantfile ทั้งบล็อก:

\`\`\`bash
cat << 'EOF' > /tmp/demo-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: demo-svc
spec:
  ports:
  - port: 80
    targetPort: 80
EOF
\`\`\`

> [!TIP]
> การใส่ Single Quote ครอบ \`'EOF'\` จะป้องกันไม่ให้ Bash ทำการแทนที่ตัวแปร (Variable expansion) เช่น \`$VAR\` ภายในเนื้อหา ทำให้เขียนไฟล์คอนฟิกได้ตรงตามต้นฉบับเป๊ะ

### 4. Git Workflow สำหรับ GitOps ใน Part 3

ใน Part 3 คุณจะต้องใช้ Git ในการสั่งให้ Argo CD ดึงการเปลี่ยนแปลงไปปรับใช้ในคลัสเตอร์:
1. \`git clone <url>\`: โคลน repository จาก GitHub ลงมาในเครื่อง
2. \`git status\`: ตรวจสอบสถานะการแก้ไขไฟล์
3. \`git commit -am "update image to v2"\`: บันทึกการเปลี่ยนแปลง
4. \`git push origin main\`: ส่งข้อมูลขึ้น GitHub ซึ่งจะส่งผลให้ Argo CD ตรวจพบและอัปเดตคลัสเตอร์
5. \`git revert HEAD\`: สร้าง commit ใหม่เพื่อย้อนการเปลี่ยนแปลงล่าสุดกลับคืนมา (เป็นวิธี Rollback ที่ถูกต้องใน GitOps)
`
  }
];
