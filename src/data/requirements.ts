import { Requirement } from '@/types/curriculum';

export const requirementsData: Requirement[] = [
  // --- GENERAL REQUIREMENTS ---
  {
    id: 'req-gen-01',
    stage: 'General',
    title: 'โครงการทั้งหมดต้องทำใน Virtual Machine',
    detail: 'งานทั้งหมดของโปรเจกต์ Inception-of-Things ต้องถูกพัฒนาและทำงานอยู่ภายใน Virtual Machine ที่ติดตั้งบนเครื่องโฮสต์จริงของผู้เรียน ไม่รันบน bare-metal host โดยตรง',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P4', title: 'en.subject.pdf (Page 4, Chapter III General Guidelines)' }
    ],
    lessonIds: ['m00-l01', 'm03-l01'],
    verification: 'เปิดดู environment ของเครื่องที่ใช้รัน ยืนยันว่ากำลังทำงานอยู่ใน guest Linux VM (เช่น Ubuntu 22.04 หรือ Debian 12 บน VirtualBox/UTM/VMware)'
  },
  {
    id: 'req-gen-02',
    stage: 'General',
    title: 'ลำดับการทำ Mandatory ต้องเรียงตาม p1 -> p2 -> p3',
    detail: 'โปรเจกต์แบ่งออกเป็น 3 ส่วนหลักที่ต้องทำตามลำดับอย่างเคร่งครัด ได้แก่ Part 1 (K3s and Vagrant), Part 2 (K3s and 3 apps), Part 3 (K3d and Argo CD)',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P5', title: 'en.subject.pdf (Page 5, Chapter IV Mandatory part)' }
    ],
    lessonIds: ['m00-l02', 'm06-l02', 'm08-l02', 'm11-l02'],
    verification: 'ตรวจลำดับผลงานและความพร้อม โดย Part 1 และ Part 2 ต้องสมบูรณ์ก่อนที่จะเริ่มและตรวจ Part 3'
  },
  {
    id: 'req-gen-03',
    stage: 'General',
    title: 'โฟลเดอร์ Root ต้องมี p1, p2, p3 และ bonus',
    detail: 'ไฟล์การตั้งค่าทั้งหมดต้องจัดเก็บในโฟลเดอร์ที่ root ของ Git repository ตามชื่อ p1, p2, p3 และ bonus (สำหรับส่วนโบนัส)',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P4', title: 'en.subject.pdf (Page 4, Chapter III General Guidelines)' },
      { sourceId: 'SUB-P17', title: 'en.subject.pdf (Page 17, Chapter VI Submission)' }
    ],
    lessonIds: ['m00-l02', 'm14-l02'],
    verification: 'รันคำสั่ง ls -d */ ที่ root ของ repo ต้องเห็น p1/ p2/ p3/ และ bonus/ (ถ้ามีโบนัส)'
  },
  {
    id: 'req-gen-04',
    stage: 'General',
    title: 'โครงสร้างภายในแต่ละโฟลเดอร์ต้องมี scripts และ confs',
    detail: 'ภายในแต่ละโฟลเดอร์ (p1, p2, p3, bonus) ต้องมี Vagrantfile (สำหรับ p1/p2), ไดเรกทอรี scripts/ สำหรับ automated scripts และ confs/ สำหรับ configuration manifests',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P17', title: 'en.subject.pdf (Page 17, Chapter VI Submission)' }
    ],
    lessonIds: ['m00-l02', 'm14-l02'],
    verification: 'รันคำสั่ง find -maxdepth 2 -ls เพื่อตรวจดูโครงสร้างไดเรกทอรีและสิทธิ์ของไฟล์ให้ตรงกับภาพตัวอย่างใน subject หน้า 17'
  },
  {
    id: 'req-gen-05',
    stage: 'General',
    title: 'การตรวจงาน (Defense) ตรวจจาก Git Repository บนเครื่องของกลุ่ม',
    detail: 'การประเมินผลจะตรวจเฉพาะไฟล์ที่อยู่ใน Git repository เท่านั้น และต้องสามารถรันและสาธิตให้ผู้ตรวจดูได้สดๆ',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P17', title: 'en.subject.pdf (Page 17, Chapter VI Submission)' }
    ],
    lessonIds: ['m14-l02'],
    verification: 'ยืนยันว่าไม่มีไฟล์จำเป็นใดที่ไม่ได้ git add/commit และสามารถ git clone repo ไปที่โฟลเดอร์ใหม่แล้วรันโปรเจกต์ได้ทันที'
  },

  // --- PART 1 REQUIREMENTS ---
  {
    id: 'req-p1-01',
    stage: 'P1',
    title: 'สร้าง VM 2 เครื่องด้วย Vagrant ด้วย Linux Stable รุ่นล่าสุด',
    detail: 'เขียน Vagrantfile เพื่อสร้างเครื่องเสมือน 2 เครื่องโดยใช้ Linux distribution รุ่น stable ล่าสุดตามต้องการ (เช่น debian/bookworm64 หรือ ubuntu/jammy64)',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' }
    ],
    lessonIds: ['m03-l02', 'm06-l01', 'm06-l02'],
    verification: 'รัน vagrant status ภายในโฟลเดอร์ p1 ต้องเห็นเครื่องทำงานอยู่ 2 เครื่องสถานะ running'
  },
  {
    id: 'req-p1-02',
    stage: 'P1',
    title: 'ตั้งชื่อ Hostname ตาม login สมาชิก ลงท้ายด้วย S และ SW',
    detail: 'ชื่อเครื่องต้องขึ้นต้นด้วย login สมาชิก เช่น wil; เครื่องแรก Server ต้องมี hostname ลงท้ายด้วย S (เช่น wilS) และเครื่องที่สอง ServerWorker ต้องลงท้ายด้วย SW (เช่น wilSW)',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' }
    ],
    lessonIds: ['m03-l02', 'm06-l02'],
    verification: 'vagrant ssh <machine> แล้วรัน hostname ต้องได้ <login>S บนเครื่อง Server และ <login>SW บนเครื่อง ServerWorker'
  },
  {
    id: 'req-p1-03',
    stage: 'P1',
    title: 'กำหนด Dedicated Static IP: Server .110 และ ServerWorker .111',
    detail: 'กำหนด Dedicated IP บน primary network interface ของทั้งสองเครื่อง โดย Server คือ 192.168.56.110 และ ServerWorker คือ 192.168.56.111',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' }
    ],
    lessonIds: ['m02-l01', 'm03-l02', 'm06-l02'],
    verification: 'รัน ip a บนทั้งสองเครื่อง ตรวจสอบว่า IP 192.168.56.110 และ 192.168.56.111 ปรากฏอยู่บน network interface (เช่น eth1 หรือ enp0s8) และ ping ข้ามหากันได้'
  },
  {
    id: 'req-p1-04',
    stage: 'P1',
    title: 'เชื่อมต่อ SSH ระหว่างเครื่องได้โดยไม่ต้องใส่รหัสผ่าน (Passwordless SSH)',
    detail: 'ตั้งค่า Key-based authentication เพื่อให้สามารถ SSH เข้าหากันระหว่างโฮสต์และ VM รวมถึงระหว่าง VM ทั้งสองได้โดยไม่ต้องถาม password',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' }
    ],
    lessonIds: ['m02-l02', 'm06-l02'],
    verification: 'ทดสอบ ssh vagrant@192.168.56.110 และ ssh vagrant@192.168.56.111 จากเครื่องโฮสต์และระหว่าง VM ทั้งสอง ต้องล็อกอินผ่านทันทีโดยไม่ถาม password'
  },
  {
    id: 'req-p1-05',
    stage: 'P1',
    title: 'ติดตั้ง K3s Controller Mode บน Server และ Agent Mode บน ServerWorker',
    detail: 'ติดตั้ง K3s บนเครื่องแรก (<login>S) ในโหมด server/controller และติดตั้ง K3s บนเครื่องที่สอง (<login>SW) ในโหมด agent โดยชี้ k3s agent เข้าหา Server ด้วย URL และ Token',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' }
    ],
    lessonIds: ['m06-l01', 'm06-l02'],
    verification: 'รัน kubectl get nodes บนเครื่อง Server ต้องเห็น 2 โหนด (<login>S และ <login>SW) ในสถานะ Ready โดย Server มี role control-plane,master และ ServerWorker มี role <none>'
  },
  {
    id: 'req-p1-06',
    stage: 'P1',
    title: 'ติดตั้งและใช้งาน kubectl ได้อย่างสมบูรณ์',
    detail: 'มีคำสั่ง kubectl ใช้งานได้บนเครื่อง Server (และติดตั้งเพื่อใช้งานได้ตามที่โจทย์ระบุ)',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' }
    ],
    lessonIds: ['m05-l02', 'm06-l02'],
    verification: 'รัน kubectl version --client และ kubectl cluster-info แสดงผลปกติโดยไม่มี error'
  },
  {
    id: 'req-p1-adv01',
    stage: 'P1',
    title: '[คำแนะนำโจทย์] จำกัดทรัพยากร VM: 1 CPU และ RAM 512 MB (หรือ 1024 MB)',
    detail: 'โจทย์แนะนำอย่างยิ่ง (STRONGLY advised) ให้จัดสรรทรัพยากรเพียง 1 CPU และ RAM 512MB หรือ 1024MB ต่อเครื่อง ทั้งนี้ต้องตรวจสอบและทดสอบกับ K3s เวอร์ชันจริงเพื่อไม่ให้เกิดปัญหา OOM',
    classification: 'advice',
    sourceRefs: [
      { sourceId: 'SUB-P6', title: 'en.subject.pdf (Page 6, Chapter IV.1 Part 1)' },
      { sourceId: 'S2', title: 'K3s Requirements' }
    ],
    lessonIds: ['m00-l02', 'm03-l02', 'm06-l02'],
    verification: 'เปิดดูการตั้งค่า vb.memory และ vb.cpus ใน Vagrantfile ตรวจสอบว่าใช้ 1 CPU และ RAM 512MB-1024MB พร้อมทดสอบ swap หรือ memory overhead'
  },

  // --- PART 2 REQUIREMENTS ---
  {
    id: 'req-p2-01',
    stage: 'P2',
    title: 'ใช้ 1 VM ชนิด Linux Stable, Hostname <login>S, IP 192.168.56.110',
    detail: 'สำหรับ Part 2 ใช้เครื่องเสมือนเพียง 1 เครื่องที่ติดตั้ง K3s server mode โดยมี hostname <login>S และ IP 192.168.56.110',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P9', title: 'en.subject.pdf (Page 9, Chapter IV.2 Part 2)' }
    ],
    lessonIds: ['m08-l01', 'm08-l02'],
    verification: 'vagrant status ใน p2 แสดง 1 VM และรัน kubectl get nodes แสดง 1 node <login>S สถานะ Ready'
  },
  {
    id: 'req-p2-02',
    stage: 'P2',
    title: 'ติดตั้งและรัน Web Application 3 แอปที่แยกจากกัน',
    detail: 'สร้าง Pod หรือ Deployment สำหรับเว็บแอปพลิเคชัน 3 ตัวที่แตกต่างกัน (app1, app2, app3) ในคลัสเตอร์ K3s',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P9', title: 'en.subject.pdf (Page 9, Chapter IV.2 Part 2)' }
    ],
    lessonIds: ['m07-l01', 'm07-l02', 'm08-l02'],
    verification: 'รัน kubectl get deployments และ kubectl get pods ตรวจดูว่า app1, app2 และ app3 รันอยู่ครบถ้วน'
  },
  {
    id: 'req-p2-03',
    stage: 'P2',
    title: 'Host Routing: เมื่อ Request มี Host: app1.com ให้แสดงผล app1',
    detail: 'ตั้งค่า Ingress กฎว่าเมื่อเรียก HTTP request ไปที่ IP 192.168.56.110 โดยส่ง Host Header เป็น app1.com ต้องได้รับหน้าเว็บของ app1',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P9', title: 'en.subject.pdf (Page 9, Chapter IV.2 Part 2)' }
    ],
    lessonIds: ['m08-l01', 'm08-l02'],
    verification: 'รัน curl -H "Host: app1.com" http://192.168.56.110/ ต้องได้ response บ่งบอกว่าเป็น app1'
  },
  {
    id: 'req-p2-04',
    stage: 'P2',
    title: 'Host Routing: เมื่อ Request มี Host: app2.com ให้แสดงผล app2',
    detail: 'ตั้งค่า Ingress กฎว่าเมื่อเรียก HTTP request ไปที่ IP 192.168.56.110 โดยส่ง Host Header เป็น app2.com ต้องได้รับหน้าเว็บของ app2',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P9', title: 'en.subject.pdf (Page 9, Chapter IV.2 Part 2)' }
    ],
    lessonIds: ['m08-l01', 'm08-l02'],
    verification: 'รัน curl -H "Host: app2.com" http://192.168.56.110/ ต้องได้ response บ่งบอกว่าเป็น app2'
  },
  {
    id: 'req-p2-05',
    stage: 'P2',
    title: 'Default Routing: เข้าผ่าน IP ตรง หรือ Host อื่น ต้องตกไปที่ app3',
    detail: 'ถ้าเข้าผ่าน IP โดยตรง (ไม่มี Host header เฉพาะ) หรือส่ง Host header เป็นชื่ออื่นใดที่ไม่ใช่ app1.com / app2.com ระบบต้อง fallback มาแสดงผล app3 เสมอ (Default Backend)',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P9', title: 'en.subject.pdf (Page 9, Chapter IV.2 Part 2)' }
    ],
    lessonIds: ['m08-l01', 'm08-l02'],
    verification: 'รัน curl http://192.168.56.110/ และ curl -H "Host: other.com" http://192.168.56.110/ ทั้งสองคำสั่งต้องแสดงผลลัพธ์ของ app3'
  },
  {
    id: 'req-p2-06',
    stage: 'P2',
    title: 'Application 2 (app2) ต้องมี 3 Replicas',
    detail: 'Deployment ของ app2 ต้องกำหนด replicas: 3 และมี Pod ทำงานพร้อมกัน 3 ชุดจริงในคลัสเตอร์',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P9', title: 'en.subject.pdf (Page 9, Chapter IV.2 Part 2)' }
    ],
    lessonIds: ['m07-l01', 'm08-l02'],
    verification: 'รัน kubectl get deployment app2 แสดง READY 3/3 และ kubectl get pods -l app=app2 แสดง 3 pods สถานะ Running'
  },
  {
    id: 'req-p2-07',
    stage: 'P2',
    title: 'แสดง Ingress Configuration และอธิบายให้ผู้ตรวจฟังตอน Defense',
    detail: 'ผู้เรียนต้องสามารถเปิด Ingress manifest และอธิบายโครงสร้าง routing rules, backend service, และกลไกของ Traefik controller ให้ผู้ตรวจเข้าใจได้',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P11', title: 'en.subject.pdf (Page 11, Chapter IV.2 Part 2)' }
    ],
    lessonIds: ['m08-l01', 'm08-l02', 'm14-l02'],
    verification: 'รัน kubectl get ingress -o yaml และสามารถชี้ระบุ rules และ defaultBackend พร้อมอธิบายทิศทางไหลของแพ็กเก็ตได้คล่องแคล่ว'
  },

  // --- PART 3 REQUIREMENTS ---
  {
    id: 'req-p3-01',
    stage: 'P3',
    title: 'ติดตั้ง K3d บน VM โดยไม่ใช้ Vagrant สำหรับคลัสเตอร์ส่วนนี้',
    detail: 'ใน Part 3 คลัสเตอร์ Kubernetes ต้องสร้างด้วย K3d บน VM หลักโดยตรง ไม่ใช้ Vagrant ในการสร้าง VM ซ้อนอีกชุดสำหรับคลัสเตอร์นี้',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12, Chapter IV.3 Part 3)' }
    ],
    lessonIds: ['m09-l01', 'm09-l02', 'm11-l01'],
    verification: 'รัน k3d cluster list แสดงรายการคลัสเตอร์ที่รันอยู่บน Docker ของเครื่อง VM หลัก'
  },
  {
    id: 'req-p3-02',
    stage: 'P3',
    title: 'ติดตั้ง Docker สำหรับให้ K3d ทำงาน',
    detail: 'เครื่อง VM หลักต้องติดตั้ง Docker daemon และสิทธิ์ผู้ใช้ให้สามารถรันคำสั่ง docker ได้อย่างราบรื่น เนื่องจาก K3d ทำงานอยู่บนคอนเทนเนอร์ Docker',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12, Chapter IV.3 Part 3)' }
    ],
    lessonIds: ['m04-l01', 'm09-l01'],
    verification: 'รัน docker info และ docker ps แสดงผลปกติโดยไม่ต้องใช้ sudo'
  },
  {
    id: 'req-p3-03',
    stage: 'P3',
    title: 'มี Script ติดตั้ง Packages และ Tools ทั้งหมดเพื่อใช้ระหว่างตรวจ',
    detail: 'ต้องเขียน shell script (เช่น install_tools.sh) เพื่อติดตั้งเครื่องมือทั้งหมดที่จำเป็น (Docker, K3d, kubectl, etc.) ระหว่างการตรวจ เพื่อให้การตั้งค่าทำซ้ำได้อัตโนมัติ',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12, Chapter IV.3 Part 3)' }
    ],
    lessonIds: ['m01-l02', 'm11-l01'],
    verification: 'ทดสอบรันสคริปต์บนเครื่อง VM เปล่า ยืนยันว่าสามารถติดตั้งเครื่องมือทั้งหมดสำเร็จโดยไม่ต้องกดตอบโต้ (non-interactive)'
  },
  {
    id: 'req-p3-04',
    stage: 'P3',
    title: 'สร้าง Namespace 2 ตัว: argocd และ dev',
    detail: 'ในคลัสเตอร์ K3d ต้องสร้าง namespace แยกสำหรับระบบ โดย argocd เก็บระบบ Argo CD และ dev บรรจุแอปพลิเคชันที่ถูก deploy',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12, Chapter IV.3 Part 3)' }
    ],
    lessonIds: ['m11-l01'],
    verification: 'รัน kubectl get ns แสดงรายการ namespaces มีทั้ง argocd และ dev ในสถานะ Active'
  },
  {
    id: 'req-p3-05',
    stage: 'P3',
    title: 'สร้าง Public GitHub Repository โดยมี Login สมาชิกในชื่อ Repo',
    detail: 'สร้าง Public Repository บน GitHub เพื่อเก็บไฟล์ Kubernetes manifests โดยชื่อ repository ต้องมี login ของสมาชิกในกลุ่มอย่างน้อย 1 คน (เช่น wil-iot-config)',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12, Chapter IV.3 Part 3)' }
    ],
    lessonIds: ['m01-l02', 'm11-l01'],
    verification: 'เปิดเบราว์เซอร์หรือ curl ไปที่ https://github.com/<user>/<repo> ตรวจสอบว่าเป็น public และมี login ในชื่อ repo'
  },
  {
    id: 'req-p3-06',
    stage: 'P3',
    title: 'Argo CD Deploy แอปใน Namespace dev จาก GitHub โดยอัตโนมัติ',
    detail: 'สร้าง Application resource ใน Argo CD ที่ชี้ไปยัง Public GitHub repo และ target namespace เป็น dev ให้ Argo CD ดึง manifest และสั่งสร้าง Pod ในคลัสเตอร์',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P12', title: 'en.subject.pdf (Page 12, Chapter IV.3 Part 3)' }
    ],
    lessonIds: ['m10-l01', 'm10-l02', 'm11-l02'],
    verification: 'รัน kubectl get pods -n dev พบ Pod ของแอปพลิเคชันรันอยู่ และใน Argo CD แสดงสถานะ Synced / Healthy'
  },
  {
    id: 'req-p3-07',
    stage: 'P3',
    title: 'แอปพลิเคชันมี 2 เวอร์ชัน (v1 และ v2) พอร์ต 8888',
    detail: 'แอปต้องมี 2 เวอร์ชันที่ตอบกลับต่างกันอย่างชัดเจน สามารถเลือกใช้ pre-made image wil42/playground:v1 และ v2 (พอร์ต 8888) หรือเขียนแอปของตนเองขึ้น Docker Hub',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P13', title: 'en.subject.pdf (Page 13, Chapter IV.3 Part 3)' }
    ],
    lessonIds: ['m11-l02'],
    verification: 'รัน curl http://localhost:8888/ ต้องได้รับ response {"status":"ok", "message": "v1"} เมื่อใช้เวอร์ชัน 1'
  },
  {
    id: 'req-p3-08',
    stage: 'P3',
    title: 'สาธิตแก้ Version บน GitHub แล้ว Argo CD อัปเดตแอปอัตโนมัติ',
    detail: 'แสดงการแก้ไข image tag ใน deployment.yaml บน GitHub (เช่น จาก v1 เป็น v2) จากนั้น commit และ push แล้วตรวจสอบว่า Argo CD ตรวจพบและทำการ rollout Pod ใหม่ใน dev อัตโนมัติ',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P14', title: 'en.subject.pdf (Page 14-15, Chapter IV.3 Part 3)' }
    ],
    lessonIds: ['m10-l02', 'm11-l02'],
    verification: 'หลัง git push v2 ให้รอ Argo CD sync แล้วรัน curl http://localhost:8888/ ต้องเปลี่ยนเป็น {"status":"ok", "message": "v2"}'
  },
  {
    id: 'req-p3-cond01',
    stage: 'P3',
    title: '[เงื่อนไขเฉพาะ] หากทำแอปเอง ต้องมี Public Docker Hub Repo พร้อม Tags v1 และ v2',
    detail: 'เฉพาะกรณีที่ไม่ได้ใช้ wil42/playground: ผู้เรียนต้องสร้าง Docker image ของตนเองและพุชขึ้น Public Docker Hub repository พร้อมติดแท็ก v1 และ v2 ที่มีความต่างกัน',
    classification: 'optional',
    applicabilityCondition: 'ใช้เฉพาะเมื่อเลือกสร้างแอปพลิเคชันเองแทนการใช้ wil42/playground',
    sourceRefs: [
      { sourceId: 'SUB-P13', title: 'en.subject.pdf (Page 13, Chapter IV.3 Part 3)' }
    ],
    lessonIds: ['m04-l02', 'm11-l02'],
    verification: 'เข้าดูบน Docker Hub ว่า repo เป็น public และมีแท็ก v1, v2 พร้อมทดสอบ pull มารันได้'
  },

  // --- BONUS REQUIREMENTS ---
  {
    id: 'req-bon-01',
    stage: 'Bonus',
    title: 'ติดตั้ง GitLab เพิ่มเติมใน Lab ของ Part 3',
    detail: 'ต่อยอดระบบ K3d ใน Part 3 โดยติดตั้งระบบ GitLab เข้ามาทำงานร่วมกัน',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P16', title: 'en.subject.pdf (Page 16, Chapter V Bonus part)' }
    ],
    lessonIds: ['m13-l01', 'm13-l02'],
    verification: 'ตรวจสอบใน K3d cluster พบ Pods หรือ Services ของ GitLab กำลังทำงาน'
  },
  {
    id: 'req-bon-02',
    stage: 'Bonus',
    title: 'ใช้ GitLab เวอร์ชันล่าสุดที่มีจากเว็บไซต์ทางการ',
    detail: 'ต้องใช้ GitLab official distribution รุ่นล่าสุดที่มีให้ดาวน์โหลด ณ วันที่ทำและตรวจงาน (บันทึกเลขเวอร์ชันที่ใช้ทดสอบจริง)',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P16', title: 'en.subject.pdf (Page 16, Chapter V Bonus part)' }
    ],
    lessonIds: ['m13-l01', 'm13-l02'],
    verification: 'เปิดหน้า Help/About ของ GitLab หรือรันคำสั่งตรวจดู image tag ของ GitLab ยืนยันว่าเป็นเวอร์ชันล่าสุด'
  },
  {
    id: 'req-bon-03',
    stage: 'Bonus',
    title: 'GitLab ต้องรันในเครื่อง (Local Instance) ไม่ใช้ gitlab.com',
    detail: 'อินสแตนซ์ของ GitLab ต้องโฮสต์และทำงานอยู่ภายในเครื่องเสมือนของผู้เรียน ห้ามใช้บัญชีคลาวด์บน gitlab.com ทดแทน',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P16', title: 'en.subject.pdf (Page 16, Chapter V Bonus part)' }
    ],
    lessonIds: ['m13-l01', 'm13-l02'],
    verification: 'เข้าใช้งานหน้า GitLab ผ่าน URL โลคัล เช่น http://gitlab.local หรือ IP ของคลัสเตอร์'
  },
  {
    id: 'req-bon-04',
    stage: 'Bonus',
    title: 'สร้าง Dedicated Namespace ชื่อ gitlab',
    detail: 'ทรัพยากรทั้งหมดที่เกี่ยวข้องกับ GitLab ต้องถูกจัดวางอยู่ภายใน namespace ชื่อ gitlab',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P16', title: 'en.subject.pdf (Page 16, Chapter V Bonus part)' }
    ],
    lessonIds: ['m13-l02'],
    verification: 'รัน kubectl get ns gitlab และ kubectl get all -n gitlab แสดงรายการทรัพยากรของ GitLab ครบถ้วน'
  },
  {
    id: 'req-bon-05',
    stage: 'Bonus',
    title: 'Workflow ทั้งหมดของ Part 3 ต้องทำงานผ่าน Local GitLab',
    detail: 'Argo CD ต้องถูกตั้งค่าให้ไปดึง manifest จาก repository บน Local GitLab แทนที่ GitHub โดยการแก้ image tag บน Local GitLab แล้ว git push ต้อง trigger ให้แอปใน dev อัปเดตได้เหมือน Part 3',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P16', title: 'en.subject.pdf (Page 16, Chapter V Bonus part)' }
    ],
    lessonIds: ['m13-l02'],
    verification: 'แก้ manifest บน Local GitLab แล้ว push -> ตรวจสอบว่า Argo CD sync การเปลี่ยนแปลงมาสู่ namespace dev ได้สำเร็จ'
  },
  {
    id: 'req-bon-06',
    stage: 'Bonus',
    title: 'ส่งไฟล์งานในโฟลเดอร์ bonus/ ที่ root ของ repository',
    detail: 'ไฟล์ scripts, confs, Helm values หรือ manifest ทั้งหมดสำหรับส่วนโบนัสต้องจัดเก็บในโฟลเดอร์ bonus/ โดยแยกจาก p1, p2, p3',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P16', title: 'en.subject.pdf (Page 16, Chapter V Bonus part)' },
      { sourceId: 'SUB-P17', title: 'en.subject.pdf (Page 17, Chapter VI Submission)' }
    ],
    lessonIds: ['m13-l02', 'm14-l02'],
    verification: 'ตรวจโครงสร้างไดเรกทอรี bonus/ scripts/ และ confs/'
  },
  {
    id: 'req-bon-07',
    stage: 'Bonus',
    title: 'โบนัสจะได้รับการตรวจเฉพาะเมื่อ Mandatory ผ่านสมบูรณ์แบบ (Flawless)',
    detail: 'ข้อกำหนดของ 42 ระบุชัดเจนว่าโบนัสจะได้รับการประเมินก็ต่อเมื่อ Part 1, 2, 3 ผ่านครบถ้วน 100% โดยไม่มีข้อผิดพลาดใดๆ',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P16', title: 'en.subject.pdf (Page 16, Chapter V Bonus part)' }
    ],
    lessonIds: ['m00-l02', 'm14-l02'],
    verification: 'ประเมินสถานะของ Mandatory ทั้งหมดว่าได้รับการ Verify ครบถ้วนก่อนส่งตรวจส่วนโบนัส'
  },

  // --- SUBMISSION REQUIREMENTS ---
  {
    id: 'req-sub-01',
    stage: 'Submission',
    title: 'โครงสร้างไดเรกทอรีถูกต้องตาม Subject เป๊ะทุกตัวอักษร',
    detail: 'ตรวจสอบโครงสร้าง root repo: p1/, p2/, p3/ และ bonus/ พร้อมไฟล์ Vagrantfile, scripts/ และ confs/ ภายในแต่ละโฟลเดอร์',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P17', title: 'en.subject.pdf (Page 17, Chapter VI Submission)' }
    ],
    lessonIds: ['m14-l02'],
    verification: 'รัน tree หรือ ls -R ตรวจสอบว่าไม่มีตัวสะกดผิด เช่น Scripts ตัวใหญ่ หรือ path ผิดที่'
  },
  {
    id: 'req-sub-02',
    stage: 'Submission',
    title: 'ลบไฟล์ขยะ, Private Keys และ Secrets ทั้งหมดก่อนส่ง',
    detail: 'ตรวจสอบ .gitignore ไม่ให้เผลอ commit ไฟล์ id_rsa ส่วนตัว, credentials, tokens, หรือไฟล์ชั่วคราวของ Vagrant (.vagrant/)',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P17', title: 'en.subject.pdf (Page 17, Chapter VI Submission)' }
    ],
    lessonIds: ['m01-l02', 'm14-l02'],
    verification: 'รัน git status --ignored และ git log ตรวจสอบว่าไม่มี secret หรือ private key หลุดเข้าไปในประวัติ git'
  },
  {
    id: 'req-sub-03',
    stage: 'Submission',
    title: 'ซ้อม Clean Rebuild จากศูนย์แล้วระบบทำงานได้ 100%',
    detail: 'ทดสอบ destroy เครื่องเสมือนและคลัสเตอร์ทั้งหมด แล้วรันสคริปต์ provisioning ตั้งแต่ต้นเพื่อพิสูจน์ว่าไม่มีขั้นตอนใดที่ต้องแก้ด้วยมือ',
    classification: 'mandatory',
    sourceRefs: [
      { sourceId: 'SUB-P17', title: 'en.subject.pdf (Page 17, Chapter VI Submission)' }
    ],
    lessonIds: ['m14-l02'],
    verification: 'ทำ vagrant destroy -f และลบ k3d cluster แล้วรันใหม่จนผ่านการทดสอบทุกข้อโดยไม่มี error'
  }
];
