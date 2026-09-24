import { Lesson } from '@/types/curriculum';

export const m03Lessons: Lesson[] = [
  {
    id: 'm03-l01',
    slug: 'vagrant-basics-ruby-dsl-lifecycle',
    moduleId: 'm03',
    title: 'Vagrant พื้นฐาน, โครงสร้าง Vagrantfile และวงจรชีวิตของเครื่องเสมือน',
    objectives: [
      'เข้าใจแนวคิด Infrastructure as Code (IaC) ด้วย Vagrant',
      'เรียนรู้ไวยากรณ์ Ruby DSL ขั้นพื้นฐานที่ใช้ใน Vagrantfile',
      'เชี่ยวชาญคำสั่งควบคุม Vagrant Lifecycle: up, status, ssh, halt, reload, destroy',
      'ทำความเข้าใจบทบาทของ Vagrant Box และ Hypervisor Provider (เช่น VirtualBox)'
    ],
    prerequisiteIds: ['m00-l01', 'm01-l01'],
    stage: 'Foundation',
    readingTime: 8,
    summary: 'การจำลองและควบคุมสภาพแวดล้อมเสมือนด้วยโค้ด คำสั่งจัดการวงจรชีวิตเครื่อง และโครงสร้างไฟล์ Vagrantfile',
    sourceRefs: [
      { sourceId: 'S1', title: 'Vagrant Multi-Machine Documentation' },
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' }
    ],
    exerciseIds: ['ex-m03-01'],
    checklistIds: ['chk-m03-l01-01', 'chk-m03-l01-02', 'chk-m03-l01-03'],
    content: `
### 1. ทำไมต้องใช้ Vagrant?

ในงาน System Administration ยุคใหม่ เราจะไม่เปิดโปรแกรม VirtualBox แล้วคลิกเมาส์สร้าง VM ทีละเครื่องด้วยตนเอง เพราะมีข้อเสียคือ:
- ทำซ้ำได้ยาก เกิดความผิดพลาดระหว่างคลิก (Human Error)
- จดจำประวัติการตั้งค่าไม่ได้ ไม่สามารถนำเข้า Git ได้

**Vagrant** เข้ามาแก้ปัญหานี้โดยทำหน้าที่เป็นตัวสั่งการ Hypervisor ผ่านไฟล์ **\`Vagrantfile\`** เพียงไฟล์เดียว ทำให้สามารถสร้างเครื่องขึ้นมาใหม่กี่ครั้งก็ได้ผลลัพธ์เหมือนเดิมเป๊ะ

### 2. โครงสร้างพื้นฐานของ Vagrantfile

\`Vagrantfile\` ใช้ไวยากรณ์ภาษา Ruby โครงสร้างมาตรฐานมีดังนี้:

\`\`\`ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # กำหนด Base Box (Image ระบบปฏิบัติการ)
  config.vm.box = "generic/debian12"

  # ปรับแต่งทรัพยากรของ Hypervisor (VirtualBox)
  config.vm.provider "virtualbox" do |vb|
    vb.name = "my-iot-vm"
    vb.memory = "1024" # หน่วยเป็น MB
    vb.cpus = 1
  end
end
\`\`\`

### 3. คำสั่งควบคุมวงจรชีวิต (Vagrant Lifecycle)

\`\`\`bash
# 1. เริ่มสร้างและบูตเครื่องขึ้นมาทำงาน
vagrant up

# 2. ตรวจสอบสถานะของเครื่องทั้งหมดในโฟลเดอร์
vagrant status

# 3. รีโมตเข้าสู่เชลล์ของเครื่องเสมือน
vagrant ssh

# 4. สั่งชัตดาวน์เครื่องอย่างนุ่มนวล (Graceful shutdown)
vagrant halt

# 5. รีสตาร์ตเครื่องพร้อมโหลดคอนฟิกใหม่
vagrant reload

# 6. ลบเครื่องเสมือนและไฟล์ดิสก์ทิ้งอย่างถาวร
vagrant destroy -f
\`\`\`
`
  },
  {
    id: 'm03-l02',
    slug: 'multi-machine-private-network-provisioning',
    moduleId: 'm03',
    title: 'Multi-machine, Private Network และ Automated Provisioning',
    objectives: [
      'เข้าใจขอบเขตการทำงาน (Scope) ของ multi-machine ใน Vagrantfile เดียว',
      'กำหนด Hostname และ Dedicated IP ตามโจทย์ Part 1 (192.168.56.110 และ 192.168.56.111)',
      'ตั้งค่า Shell Provisioner เพื่อรันสคริปต์ติดตั้ง K3s อัตโนมัติเมื่อสั่ง vagrant up',
      'ป้องกันปัญหาการล็อกอินถาม password ด้วยการแชร์ SSH keys อัตโนมัติ'
    ],
    prerequisiteIds: ['m03-l01', 'm02-l01', 'm02-l02'],
    stage: 'Foundation',
    readingTime: 9,
    summary: 'เทคนิคการเขียน Vagrantfile สำหรับควบคุมเครื่องหลายเครื่องพร้อมกัน การจัดสรร IP วงคงที่ และการติดตั้งซอฟต์แวร์อัตโนมัติ',
    sourceRefs: [
      { sourceId: 'S1', title: 'Vagrant Multi-Machine & Private Networks' },
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' }
    ],
    exerciseIds: ['ex-m03-02'],
    checklistIds: ['chk-m03-l02-01', 'chk-m03-l02-02', 'chk-m03-l02-03'],
    content: `
### 1. Multi-Machine Configuration: จัดการ 2 เครื่องในไฟล์เดียว

ใน Part 1 เราต้องสร้าง 2 เครื่อง: Server (\`wilS\`) และ ServerWorker (\`wilSW\`) แทนที่จะแยกคนละโฟลเดอร์ เราสามารถนิยามทั้ง 2 เครื่องใน \`Vagrantfile\` เดียวกันได้ด้วย \`config.vm.define\`:

\`\`\`ruby
Vagrant.configure("2") do |config|
  # คอนฟิกร่วมกันของทุกเครื่อง
  config.vm.box = "generic/debian12"
  config.vm.box_check_update = false

  # --- เครื่องที่ 1: Server (Controller) ---
  config.vm.define "wilS" do |server|
    server.vm.hostname = "wilS"
    server.vm.network "private_network", ip: "192.168.56.110"
    
    server.vm.provider "virtualbox" do |vb|
      vb.name = "wilS"
      vb.memory = "1024"
      vb.cpus = 1
    end

    # สั่งรันสคริปต์ติดตั้ง Server
    server.vm.provision "shell", path: "scripts/setup_server.sh"
  end

  # --- เครื่องที่ 2: ServerWorker (Agent) ---
  config.vm.define "wilSW" do |worker|
    worker.vm.hostname = "wilSW"
    worker.vm.network "private_network", ip: "192.168.56.111"

    worker.vm.provider "virtualbox" do |vb|
      vb.name = "wilSW"
      vb.memory = "1024"
      vb.cpus = 1
    end

    # สั่งรันสคริปต์ติดตั้ง Worker
    worker.vm.provision "shell", path: "scripts/setup_worker.sh"
  end
end
\`\`\`

### 2. คำสั่งควบคุม Multi-machine

เมื่อมีหลายเครื่องในไฟล์เดียว คุณสามารถระบุชื่อเครื่องต่อท้ายคำสั่งได้:

\`\`\`bash
# บูตเฉพาะเครื่อง Server ขึ้นมาก่อน
vagrant up wilS

# บูตเครื่อง ServerWorker ตาม
vagrant up wilSW

# SSH เข้าเครื่อง Server
vagrant ssh wilS

# SSH เข้าเครื่อง ServerWorker
vagrant ssh wilSW

# สั่งรัน provisioning script ใหม่อีกครั้ง
vagrant provision wilS
\`\`\`

> [!TIP]
> **การส่งผ่าน Node Token ระหว่างเครื่อง:**
> ในการเชื่อมต่อ Agent เข้า Server ตัว Agent จำเป็นต้องรู้ \`node-token\` ของ Server วิธีที่นิยมและเสถียรที่สุดคือให้สคริปต์ของ Server เขียน token ออกมาไว้ในโฟลเดอร์ที่แชร์ร่วมกัน (\`/vagrant/token\`) เพื่อให้สคริปต์ของ Worker หยิบไปใช้งานได้โดยอัตโนมัติ
`
  }
];
