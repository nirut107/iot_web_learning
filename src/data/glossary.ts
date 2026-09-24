import { GlossaryEntry } from '@/types/curriculum';

export const glossaryData: GlossaryEntry[] = [
  {
    id: 'glo-k8s',
    term: 'Kubernetes (K8s)',
    aliases: ['K8s', 'kube'],
    thaiMeaning: 'ระบบจัดการคอนเทนเนอร์ระดับคลัสเตอร์แบบอัตโนมัติ',
    explanation: 'แพลตฟอร์ม Open-source สำหรับจัดการ Containerized Workloads แบบอัตโนมัติ ทั้งการกระจายโหลด (Scheduling), การขยายจำนวน (Scaling), การอัปเดตเวอร์ชันแบบไม่หยุดทำงาน (Rolling Update) และการดูแลรักษาสถานะของระบบให้ตรงกับที่ประกาศไว้ (Self-healing)',
    category: 'Kubernetes',
    lessonIds: ['m05-l01', 'm05-l02']
  },
  {
    id: 'glo-pod',
    term: 'Pod',
    aliases: ['pods', 'k8s pod'],
    thaiMeaning: 'หน่วยการทำงานที่เล็กที่สุดใน Kubernetes',
    explanation: 'หน่วยพื้นฐานของ Kubernetes ที่ห่อหุ้มคอนเทนเนอร์ 1 ตัวหรือหลายตัวที่ทำงานร่วมกัน (Co-located) โดยคอนเทนเนอร์ภายใน Pod เดียวกันจะแชร์ Network Namespace (IP เดียวกันและคุยกันผ่าน localhost) และแชร์ Storage Volumes ร่วมกันได้ มีอายุขัยชั่วคราว (Ephemeral)',
    category: 'Kubernetes',
    lessonIds: ['m05-l02', 'm07-l01']
  },
  {
    id: 'glo-replicaset',
    term: 'ReplicaSet',
    aliases: ['rs'],
    thaiMeaning: 'ตัวควบคุมจำนวนสำเนาของ Pod ให้คงที่ตามที่ระบุ',
    explanation: 'Controller ใน Kubernetes ที่มีหน้าที่รับประกันว่าจำนวน Pod ที่ตรงตาม Label Selector จะมีจำนวนทำงานอยู่เท่ากับค่า replicas ที่กำหนดเสมอ หากมี Pod ดับหรือพัง ReplicaSet จะสั่งสร้าง Pod ใหม่ขึ้นมาแทนที่',
    category: 'Kubernetes',
    lessonIds: ['m05-l02', 'm07-l01']
  },
  {
    id: 'glo-deployment',
    term: 'Deployment',
    aliases: ['deploy'],
    thaiMeaning: 'ตัวจัดการ Workload ระดับสูงสำหรับแอปพลิเคชันแบบ Stateless',
    explanation: 'Controller ที่อยู่เหนือ ReplicaSet ทำหน้าที่จัดการวงจรชีวิตของแอปพลิเคชัน การอัปเดตเวอร์ชันใหม่ (Rolling Update / Recreate) และการย้อนกลับเวอร์ชันเดิม (Rollback) โดยผู้ใช้จะประกาศ Pod template และ replicas ใน Deployment เสมอแทนที่จะสร้าง Pod ตรงๆ',
    category: 'Kubernetes',
    lessonIds: ['m05-l02', 'm07-l01']
  },
  {
    id: 'glo-service',
    term: 'Service',
    aliases: ['svc', 'k8s service'],
    thaiMeaning: 'จุดเข้าถึงเครือข่ายและโหลดบาลานเซอร์ภายในสำหรับกลุ่มของ Pod',
    explanation: 'Abstraction ที่กำหนด IP คงที่ (ClusterIP) และ DNS name สำหรับเข้าถึงกลุ่มของ Pod ที่มี label ตรงกัน ทำหน้าที่เป็น Internal Load Balancer กระจายทราฟฟิกไปยัง Pods ที่สุขภาพดี (Readiness Probe ผ่าน) โดยอัตโนมัติ',
    category: 'Kubernetes',
    lessonIds: ['m05-l02', 'm07-l02']
  },
  {
    id: 'glo-ingress',
    term: 'Ingress',
    aliases: ['ing'],
    thaiMeaning: 'กฎการกำหนดเส้นทาง HTTP/HTTPS จากภายนอกเข้าสู่ Service ภายในคลัสเตอร์',
    explanation: 'Kubernetes Resource ที่ทำหน้าที่ประกาศกฎการเร้าต์ทราฟฟิกภายนอกเข้ามายัง Services ภายใน โดยอิงตาม Domain Name (Host header) หรือ URL Path (เช่น app1.com -> app1-service) โดยตัว Ingress Resource เองเป็นเพียงเอกสารประกาศกฎ ต้องมี Ingress Controller เป็นผู้ทำงานจริง',
    category: 'Kubernetes',
    lessonIds: ['m05-l02', 'm08-l01', 'm08-l02']
  },
  {
    id: 'glo-ingress-controller',
    term: 'Ingress Controller',
    aliases: ['Traefik', 'Nginx Ingress'],
    thaiMeaning: 'ซอฟต์แวร์ Reverse Proxy ที่คอยตรวจจับและบังคับใช้กฎ Ingress Resource',
    explanation: 'แอปพลิเคชัน (เช่น Traefik หรือ Nginx) ที่รันอยู่ในคลัสเตอร์ ทำหน้าที่คอยฟังสภาพของ Ingress Resources จาก Kubernetes API แล้วนำกฎเหล่านั้นมาตั้งค่า Reverse Proxy ภายในตัวเพื่อรับ Request จากภายนอกแล้วส่งต่อไปยัง Pod ปลายทางอย่างถูกต้อง',
    category: 'Kubernetes',
    lessonIds: ['m08-l01', 'm08-l02']
  },
  {
    id: 'glo-k3s',
    term: 'K3s',
    aliases: ['k3s server', 'k3s agent'],
    thaiMeaning: 'Kubernetes ฉบับกระชับพิเศษ (Lightweight Kubernetes)',
    explanation: 'Kubernetes Distribution ที่พัฒนาโดย Rancher Labs ได้รับการรับรองจาก CNCF โดยรวมทุกอย่างไว้ในไฟล์ไบนารีเดียวขนาดเล็กกว่า 100MB ตัดโค้ด Cloud Provider รุ่นเก่าออก และใช้ SQLite เป็น datastore เริ่มต้นแทน etcd กินแรมน้อย เหมาะกับ edge และ lab',
    category: 'Kubernetes',
    lessonIds: ['m06-l01', 'm06-l02']
  },
  {
    id: 'glo-k3d',
    term: 'K3d',
    aliases: ['k3d cluster'],
    thaiMeaning: 'เครื่องมือรันคลัสเตอร์ K3s ภายใน Docker Containers',
    explanation: 'ยูทิลิตี้น้ำหนักเบาที่สร้างคลัสเตอร์ K3s ขึ้นมาโดยแปลงแต่ละโหนดของ Kubernetes ให้กลายเป็นคอนเทนเนอร์ Docker บนเครื่องโฮสต์ ทำให้สร้าง คลัสเตอร์หลายโหนดและลบทิ้งได้อย่างรวดเร็วมากภายในไม่กี่วินาที เหมาะกับการทำ CI/CD และ Local GitOps',
    category: 'Kubernetes',
    lessonIds: ['m09-l01', 'm09-l02']
  },
  {
    id: 'glo-vagrant',
    term: 'Vagrant',
    aliases: ['Vagrantfile'],
    thaiMeaning: 'เครื่องมือสร้างและจำลองสภาพแวดล้อม VM ด้วยโค้ดคำสั่ง (IaC)',
    explanation: 'เครื่องมือจาก HashiCorp สำหรับสร้าง ควบคุม และตั้งค่า Virtual Machines ผ่านไฟล์คำสั่ง Vagrantfile (ไวยากรณ์ Ruby) ช่วยให้สร้างเครื่องเสมือนที่เหมือนกันเป๊ะซ้ำๆ ได้อย่างรวดเร็ว รองรับ providers เช่น VirtualBox, VMware, Libvirt',
    category: 'Vagrant',
    lessonIds: ['m03-l01', 'm03-l02']
  },
  {
    id: 'glo-gitops',
    term: 'GitOps',
    aliases: ['GitOps principle'],
    thaiMeaning: 'แนวคิดการบริหารระบบ Infrastructure และ App โดยใช้ Git เป็นศูนย์กลางความจริงเดียว',
    explanation: 'แนวทางปฏิบัติที่ใช้ Git Repository เป็น "Single Source of Truth" สำหรับสถานะที่ต้องการ (Desired State) ของระบบ โดยมีเอเจนต์อัตโนมัติ (เช่น Argo CD) คอยตรวจสอบและปรับแต่งสถานะของคลัสเตอร์จริง (Actual State) ให้ตรงกับ Git เสมอ',
    category: 'GitOps',
    lessonIds: ['m10-l01', 'm10-l02']
  },
  {
    id: 'glo-argo-cd',
    term: 'Argo CD',
    aliases: ['argocd'],
    thaiMeaning: 'เครื่องมือ Continuous Delivery สำหรับ Kubernetes ตามหลักการ GitOps',
    explanation: 'GitOps Controller ที่ติดตั้งใน Kubernetes ทำหน้าที่ดึงโค้ด Manifest จาก Git แล้วนำไปเปรียบเทียบกับคลัสเตอร์ หากมีความแตกต่าง (Drift) จะสามารถสั่ง Sync เพื่ออัปเดตระบบอัตโนมัติ พร้อมทั้งมี UI กราฟิกแสดงสุขภาพของทรัพยากร',
    category: 'GitOps',
    lessonIds: ['m10-l01', 'm10-l02', 'm11-l02']
  },
  {
    id: 'glo-desired-actual',
    term: 'Desired State vs Actual State',
    aliases: ['declarative model'],
    thaiMeaning: 'สถานะที่ต้องการตามคำประกาศ เทียบกับ สถานะที่เป็นอยู่จริงในระบบ',
    explanation: 'หัวใจของ Kubernetes และ GitOps: Desired State คือสิ่งที่เราเขียนระบุใน YAML หรือ Git (เช่น ต้องการ 3 Pods image v2) ส่วน Actual State คือสิ่งที่กำลังรันอยู่จริงในคลัสเตอร์ คอนโทรลเลอร์จะทำงานในลูปไม่สิ้นสุดเพื่อปรับให้ Actual State สอดคล้องกับ Desired State',
    category: 'GitOps',
    lessonIds: ['m05-l01', 'm10-l01']
  },
  {
    id: 'glo-auto-sync',
    term: 'Auto-Sync',
    aliases: ['automated sync'],
    thaiMeaning: 'ฟีเจอร์ของ Argo CD ที่สั่งปรับปรุงคลัสเตอร์ทันทีเมื่อพบการเปลี่ยนแปลงใน Git',
    explanation: 'คุณสมบัติของ Argo CD Application ที่เมื่อเปิดใช้งานแล้ว หากมีการ commit การเปลี่ยนแปลงใหม่ขึ้นสู่ Git repository ตัว Controller จะสั่งกระบวนการ Sync ให้คลัสเตอร์เปลี่ยนตาม Git โดยอัตโนมัติโดยที่มนุษย์ไม่ต้องกดปุ่ม Sync',
    category: 'GitOps',
    lessonIds: ['m10-l02', 'm11-l02']
  },
  {
    id: 'glo-self-heal',
    term: 'Self-Heal',
    aliases: ['selfHeal'],
    thaiMeaning: 'การแก้ไขความเบี่ยงเบน (Drift) ในคลัสเตอร์ให้กลับมาตรงกับ Git อัตโนมัติ',
    explanation: 'ฟีเจอร์ของ Argo CD ที่หากมีใครใช้ kubectl ไปแก้ไข ลบ หรือเปลี่ยนแปลงทรัพยากรในคลัสเตอร์โดยตรง (Live Drift) Argo CD จะตรวจพบและสั่งย้อนการตั้งค่านั้นกลับมาให้ตรงกับ Git ทันที เพื่อป้องกันการแก้ค่าสดนอก Git',
    category: 'GitOps',
    lessonIds: ['m10-l02']
  },
  {
    id: 'glo-prune',
    term: 'Pruning',
    aliases: ['prune'],
    thaiMeaning: 'การลบทรัพยากรในคลัสเตอร์ทิ้งเมื่อมันถูกลบออกจาก Git',
    explanation: 'พฤติกรรมใน GitOps ที่เมื่อไฟล์ manifest ของ resource ตัวใดถูกลบทิ้งไปจาก Git repository แล้ว คอนโทรลเลอร์จะสั่งลบ resource นั้นออกจาก Kubernetes cluster ด้วย เพื่อไม่ให้มีทรัพยากรตกค้างที่ไม่ถูกประกาศใน Git',
    category: 'GitOps',
    lessonIds: ['m10-l02']
  },
  {
    id: 'glo-pv-pvc',
    term: 'PV & PVC (PersistentVolume / Claim)',
    aliases: ['PV', 'PVC'],
    thaiMeaning: 'พื้นที่จัดเก็บข้อมูลถาวร และใบคำขอจัดสรรพื้นที่ใน Kubernetes',
    explanation: 'PersistentVolume (PV) คือก้อน Storage จริงในคลัสเตอร์ที่ถูกจัดเตรียมไว้ (เช่น โฟลเดอร์ในดิสก์ หรือ NFS) ส่วน PersistentVolumeClaim (PVC) คือคำขอของ Pod เพื่อขอจับคู่และใช้งาน PV ก้อนนั้น ข้อมูลใน PV จะไม่สูญหายเมื่อ Pod ถูก restart หรือ recreate',
    category: 'Kubernetes',
    lessonIds: ['m12-l01']
  },
  {
    id: 'glo-storageclass',
    term: 'StorageClass',
    aliases: ['sc'],
    thaiMeaning: 'ตัวกำหนดชนิดและโปรวิชันเนอร์ของ Storage อัตโนมัติแบบ Dynamic',
    explanation: 'Resource ที่ช่วยให้เมื่อผู้ใช้สร้าง PVC ขึ้นมาระบบสามารถสั่งสร้าง PV ขึ้นมารองรับโดยอัตโนมัติ (Dynamic Provisioning) ใน K3s มี StorageClass เริ่มต้นชื่อ local-path ที่เก็บไฟล์ไว้บน filesystem ของโหนด',
    category: 'Kubernetes',
    lessonIds: ['m12-l01']
  },
  {
    id: 'glo-helm',
    term: 'Helm',
    aliases: ['helm chart'],
    thaiMeaning: 'ตัวจัดการแพ็กเกจสำหรับ Kubernetes (Kubernetes Package Manager)',
    explanation: 'เครื่องมือที่รวบรวมไฟล์ YAML หลายๆ ไฟล์เข้าด้วยกันเป็นโครงสร้างที่เรียกว่า Chart โดยมีระบบ Templating และ values.yaml เพื่อให้สามารถปรับแต่งค่าคอนฟิกและติดตั้งแอปพลิเคชันขนาดใหญ่ (เช่น GitLab) ได้ด้วยคำสั่งเดียว',
    category: 'Kubernetes',
    lessonIds: ['m12-l02', 'm13-l02']
  },
  {
    id: 'glo-flannel',
    term: 'Flannel CNI',
    aliases: ['CNI', 'vxlan'],
    thaiMeaning: 'เครือข่ายเชื่อมต่อระหว่างโหนดสำหรับ Pod ใน K3s (Overlay Network)',
    explanation: 'Container Network Interface (CNI) ปลั๊กอินเริ่มต้นของ K3s ที่ทำหน้าที่สร้างเครือข่ายเสมือนแบบ Overlay (VXLAN พอร์ต 8472 UDP) เพื่อให้ Pod บนโหนด Server สามารถคุยกับ Pod บนโหนด Agent ได้โดยตรงผ่าน IP ของ Pod',
    category: 'Network',
    lessonIds: ['m06-l01', 'm06-l02']
  },
  {
    id: 'glo-host-header',
    term: 'HTTP Host Header',
    aliases: ['Host header', 'virtual host'],
    thaiMeaning: 'ส่วนหัวใน HTTP Request ที่ระบุชื่อ Domain ปลายทางที่ต้องการเข้าถึง',
    explanation: 'Header ในระดับ HTTP (Layer 7) ที่เว็บเบราว์เซอร์หรือ curl แนบไปกับ request เพื่อบอกเว็บเซิร์ฟเวอร์หรือ Ingress Controller ว่าต้องการเปิดเว็บไซต์ชื่อใด ทำให้ IP เดียวกันสามารถโฮสต์เว็บไซต์ได้หลายร้อยโดเมน (Virtual Hosting)',
    category: 'Network',
    lessonIds: ['m02-l02', 'm08-l01']
  },
  {
    id: 'glo-passwordless-ssh',
    term: 'Passwordless SSH',
    aliases: ['SSH key auth'],
    thaiMeaning: 'การเข้าสู่ระบบผ่าน SSH ด้วยกุญแจเข้ารหัสสาธารณะโดยไม่ต้องกรอกรหัสผ่าน',
    explanation: 'กระบวนการยืนยันตัวตนด้วย Asymmetric Cryptography โดยนำ Public Key ไปหยอดไว้ในไฟล์ ~/.ssh/authorized_keys ของเครื่องปลายทาง ทำให้ Private Key ในเครื่องต้นทางสามารถยืนยันตัวตนได้โดยอัตโนมัติ มีความปลอดภัยสูงและจำเป็นต่อการทำ Automation',
    category: 'Linux',
    lessonIds: ['m02-l02', 'm06-l02']
  },
  {
    id: 'glo-idempotency',
    term: 'Idempotency',
    aliases: ['idempotent script'],
    thaiMeaning: 'คุณสมบัติของคำสั่งหรือสคริปต์ที่รันซ้ำกี่ครั้งก็ได้ผลลัพธ์คงเดิมโดยไม่พัง',
    explanation: 'หลักการสำคัญในการเขียนสคริปต์ Automation: สคริปต์ต้องตรวจดูก่อนว่าสิ่งนั้นมีอยู่แล้วหรือไม่ ถ้ามีแล้วให้ข้าม ไม่ใช่สั่งเพิ่มซ้ำซ้อนจน error หรือสร้างไฟล์ขยะซ้ำๆ เช่น การใช้ mkdir -p หรือตรวจว่า service รันอยู่แล้วหรือไม่ก่อนเริ่มคำสั่ง',
    category: 'Linux',
    lessonIds: ['m01-l02']
  }
];
