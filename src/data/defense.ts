import { DefenseQuestion } from '@/types/curriculum';

export const defenseData: DefenseQuestion[] = [
  {
    id: 'def-01',
    question: 'ทำไมทั้งโปรเจกต์ต้องทำใน VM และใน Part 3 คำว่า "without Vagrant" หมายถึงอะไร?',
    answer: 'ข้อกำหนดทั่วไปของโจทย์ (Chapter III) ระบุชัดเจนว่า "The whole project has to be done in a virtual machine" เพื่อแยกสภาพแวดล้อมออกจากเครื่องโฮสต์จริงและป้องกันผลกระทบต่อระบบ ส่วนใน Part 3 คำว่า "without Vagrant" หมายถึงการเปลี่ยนวิธีสร้างคลัสเตอร์ Kubernetes จากการใช้ Vagrant มาใช้ K3d ซึ่งรันอยู่บน Docker โดยตรงภายใน VM หลักตัวเดิม ไม่ได้แปลว่าให้ยกเลิกข้อกำหนดเรื่อง VM ของทั้งโปรเจกต์',
    stage: 'General / P3',
    relatedLessons: ['m00-l01', 'm09-l01'],
    keyPoints: [
      'โจทย์ข้อ General Guidelines ยังคงบังคับใช้ตลอดทุก Part',
      'Vagrant ใช้สำหรับ Part 1 และ Part 2 ในการสร้าง guest VM',
      'Part 3 ใช้ K3d บน Docker ของ VM หลัก ไม่ต้องสร้าง Vagrant VM ซ้อนอีกชั้น'
    ],
    trap: 'ผู้ตรวจอาจลองถามว่า "Part 3 ทำบนเครื่อง Mac/Host จริงได้ไหมเพราะโจทย์บอก without Vagrant?" ตอบ: ไม่ได้ เพราะ General guideline บังคับให้ทั้งโครงการอยู่ใน VM'
  },
  {
    id: 'def-02',
    question: 'K3s กับ K3d มีความเหมือนและแตกต่างกันอย่างไร?',
    answer: 'K3s คือ Kubernetes Distribution แบบ Lightweight ที่พัฒนาโดย Rancher โดยคอมไพล์คอมโพเนนต์ทั้งหมดเป็นไบนารีเดียวและรันบนโฮสต์โดยตรงหรือใน VM ส่วน K3d คือเครื่องมือ Wrapper/Utility ที่นำเอา K3s มารันไว้ภายในคอนเทนเนอร์ Docker โดยแปลงแต่ละคอนเทนเนอร์ให้เป็นโหนดของ K3s ทำให้สามารถจำลองคลัสเตอร์หลายโหนดบนเครื่องเดียวได้รวดเร็วและใช้ทรัพยากรน้อยมาก',
    stage: 'Foundation / P3',
    relatedLessons: ['m06-l01', 'm09-l01'],
    keyPoints: [
      'K3s = ตัวระบบ Kubernetes เอง (Lightweight binary)',
      'K3d = ตัวช่วยรัน K3s ภายใน Docker containers',
      'โหนดของ K3s ใน K3d จะเป็น docker container ที่รันคอร์ k3s server/agent ภายใน'
    ],
    trap: 'อย่าตอบสับสนว่า K3d เป็น distribution ใหม่ มันคือ wrapper tool ที่เอา k3s มารันใน docker container'
  },
  {
    id: 'def-03',
    question: 'ทำไม K3s จึงมีขนาดเบาและใช้ทรัพยากรน้อยกว่า Kubernetes ตัวเต็ม (Vanilla K8s)?',
    answer: 'K3s ถูกออกแบบมาให้กะทัดรัดโดย: 1) ตัด Cloud Controller Manager ของคลาวด์ภายนอกรุ่นเก่าออก 2) รวมทุกคอมโพเนนต์ (API server, controller manager, scheduler, kubelet, containerd, flannel) ไว้ในไบนารีเดียว 3) ใช้ SQLite/etcd-embedded เป็น Datastore เริ่มต้นแทน etcd ภายนอกขนาดใหญ่ 4) ลด Memory footprint ให้เหลือน้อยกว่า 512MB-1GB',
    stage: 'Part 1',
    relatedLessons: ['m06-l01'],
    keyPoints: [
      'Single binary รวมทุกอย่าง',
      'ตัด legacy in-tree cloud providers',
      'Datastore ในตัว (SQLite) ไม่ต้องรัน etcd คลัสเตอร์แยกสำหรับ single node'
    ]
  },
  {
    id: 'def-04',
    question: 'Flannel CNI ทำงานอย่างไร และทำไมใน Part 1 ต้องระบุพารามิเตอร์ --flannel-iface?',
    answer: 'Flannel ทำหน้าที่สร้าง Overlay Network (VXLAN) เพื่อให้ Pod ข้ามโหนดสามารถสื่อสารกันได้ผ่าน Pod IP เสมือนอยู่ในวงแลนเดียวกัน ใน Vagrant VM มักจะมี 2 interface: ตัวแรกคือ NAT (เช่น eth0 รับ IP 10.0.2.15) และตัวที่สองคือ Private Network (เช่น eth1 หรือ enp0s8 รับ IP 192.168.56.x) หากไม่ระบุ --flannel-iface ตัว Flannel จะเลือก interface แรกที่เป็น default gateway เสมอ ส่งผลให้แพ็กเก็ตข้ามโหนดวิ่งไปติดที่ NAT และสื่อสารกันไม่ผ่าน',
    stage: 'Part 1',
    relatedLessons: ['m02-l01', 'm06-l01'],
    keyPoints: [
      'Flannel สร้าง VXLAN tunnel บน UDP พอร์ต 8472',
      'ต้องบังคับให้ผูกกับ Dedicated Private IP (192.168.56.110/111)',
      'ป้องกันไม่ให้ VXLAN ไป bind กับ NAT interface 10.0.2.15'
    ],
    trap: 'ถ้าผู้ตรวจถามว่าทำไม Pod ping กันไม่ติด ให้ตอบเรื่อง Flannel interface binding ทันที'
  },
  {
    id: 'def-05',
    question: 'Ingress Resource กับ Ingress Controller แตกต่างกันอย่างไร?',
    answer: 'Ingress Resource เป็นเพียงเอกสารการประกาศกฎ (Declarative rule) ใน Kubernetes API ว่าทราฟฟิก Host ใด Path ใดควรถูกส่งไปยัง Service ไหน ตัวมันเองไม่สามารถรับส่งข้อมูลจริงได้ ส่วน Ingress Controller คือซอฟต์แวร์ Reverse Proxy ที่กำลังทำงานอยู่จริง (ใน K3s คือ Traefik) ซึ่งคอยตรวจจับ Ingress Resource แล้วนำกฎเหล่านั้นไปโปรแกรมลงใน routing engine ของตนเพื่อรับแพ็กเก็ตจากภายนอกเข้ามาส่งต่อ',
    stage: 'Part 2',
    relatedLessons: ['m08-l01'],
    keyPoints: [
      'Ingress Resource = กฎ (Specification/Data)',
      'Ingress Controller = คนทำงานจริง (Software/Reverse Proxy เช่น Traefik, Nginx)',
      'ถ้าไม่มี Controller ต่อให้สร้าง Resource ขึ้นมากฎก็ไม่มีผลต่อทราฟฟิก'
    ],
    trap: 'ผู้ตรวจมักถามว่า "Ingress ของคุณตัวไหนรับทราฟฟิก?" ต้องอธิบายให้ชัดว่า Traefik Controller เป็นตัวรับ แล้วเทียบกับ Ingress YAML ที่เราเขียน'
  },
  {
    id: 'def-06',
    question: 'ทำไมการเขียนกฎ host: app3.com เพียงอย่างเดียวจึงไม่ผ่านข้อกำหนดของ Part 2?',
    answer: 'โจทย์หน้า 9 ระบุว่า "When the HOST app1.com is used -> app1. When the HOST app2.com is used -> app2. Otherwise, app3 will be selected by default." คำว่า "Otherwise" และ "by default" หมายถึงเมื่อส่งคำขอผ่าน IP ตรงๆ (ไม่มี Host header) หรือส่ง Host header เป็นชื่ออื่นๆ เช่น random.com, test.org ระบบต้องตอบกลับเป็น app3 เสมอ ดังนั้นจึงต้องประกาศ app3 เป็น defaultBackend นอกบล็อก rules ไม่ใช่แค่ตั้ง rule สำหรับ app3.com',
    stage: 'Part 2',
    relatedLessons: ['m08-l02'],
    keyPoints: [
      'โจทย์ต้องการ Default / Fallback Backend',
      'การใส่แค่ host: app3.com จะรับเฉพาะ request ที่ส่ง Host: app3.com เท่านั้น แต่ไม่รับ request ที่เข้าผ่าน IP ตรงๆ',
      'ต้องมี spec.defaultBackend.service ใน Ingress'
    ],
    trap: 'ผู้ตรวจจะทดสอบ curl http://192.168.56.110/ โดยไม่ส่ง -H "Host: ..." เพื่อดูว่าจะตกไป app3 หรือได้ 404'
  },
  {
    id: 'def-07',
    question: 'DNS กับ HTTP Host Header แตกต่างกันอย่างไรในการทดสอบด้วยคำสั่ง curl?',
    answer: 'DNS (Domain Name System) ทำงานในชั้น Network/Transport เพื่อแปลงชื่อโดเมนเป็น IP Address ปลายทางที่จะส่งแพ็กเก็ตไปหา ส่วน Host Header เป็นข้อมูลในชั้น Application (HTTP Request Header) ที่ส่งไปกับตัวข้อความ HTTP เพื่อบอกเว็บเซิร์ฟเวอร์ว่าต้องการเว็บไซต์ใด ในการทดสอบเราสามารถใช้ curl -H "Host: app1.com" http://192.168.56.110/ เพื่อส่งแพ็กเก็ตตรงไปที่ IP โดยไม่ต้องพึ่งการเซ็ต DNS จริงใน /etc/hosts',
    stage: 'Part 2',
    relatedLessons: ['m02-l02', 'm08-l01'],
    keyPoints: [
      'DNS บอกว่าจะส่งแพ็กเก็ตไปที่ IP ไหน',
      'Host Header บอก Ingress Controller ว่าจะเข้า virtual host ไหนในเครื่องนั้น'
    ]
  },
  {
    id: 'def-08',
    question: 'GitOps คืออะไร และแตกต่างจาก Traditional CI/CD อย่างไร?',
    answer: 'GitOps คือแนวทางปฏิบัติที่ใช้ Git Repository เป็นศูนย์กลางความจริงเดียว (Single Source of Truth) สำหรับสถานะของ Infrastructure และ Applications โดยมีเอเจนต์ที่รันอยู่ภายในคลัสเตอร์ (เช่น Argo CD) คอยดึงสถานะจาก Git มา Reconcile ให้คลัสเตอร์ตรงตาม Git เสมอ ต่างจาก CI/CD แบบเดิมที่เป็นการ "Push" โค้ดจากภายนอกเข้ามาสั่งรันคำสั่ง kubectl บนคลัสเตอร์ ซึ่งเสี่ยงต่อการรั่วไหลของ Credentials และเกิดปัญหา Configuration Drift',
    stage: 'Part 3',
    relatedLessons: ['m10-l01'],
    keyPoints: [
      'Git เป็น Single Source of Truth',
      'Pull-based deployment (ปลอดภัย ไม่ต้องเปิดพอร์ตให้ภายนอกยิงเข้ามา)',
      'Automated Drift detection และ Reconciliation'
    ]
  },
  {
    id: 'def-09',
    question: 'Argo CD ทำหน้าที่ build Docker image ให้เราหรือไม่?',
    answer: 'ไม่ทำครับ Argo CD เป็นเครื่องมือสำหรับ Continuous Delivery/Deployment (CD) มีหน้าที่จัดการและ Reconcile ไฟล์ Kubernetes Manifests (YAML) เท่านั้น ไม่ได้มี Container Image Builder ในตัว หากต้องการ build Docker image ใหม่จะต้องมีกระบวนการ CI ภายนอก (เช่น GitHub Actions, GitLab CI หรือ Docker build) สั่ง build และ push image ขึ้น Registry ก่อน จากนั้นจึงมาอัปเดตแท็กใน Git เพื่อให้ Argo CD นำไป deploy',
    stage: 'Part 3',
    relatedLessons: ['m10-l01', 'm11-l02'],
    keyPoints: [
      'Argo CD = Manifest continuous delivery, ไม่ใช่ Image builder',
      'Image ต้องถูกเตรียมและ build ไว้ล่วงหน้าบน Registry (Docker Hub)'
    ],
    trap: 'คำถามกับดักยอดนิยม: ผู้ตรวจมักถามว่า "ตอนคุณ git push v2 ขึ้นไป Argo CD มันคอมไพล์ image v2 ให้ตรงไหน?" ตอบ: มันไม่ได้ build แต่เป็นดึง manifest ที่ชี้ไปที่ image tag ใหม่'
  },
  {
    id: 'def-10',
    question: 'ใน Argo CD สถานะ Synced กับ Healthy แตกต่างกันอย่างไร?',
    answer: 'Synced หมายถึงสถานะของ Kubernetes Manifests ในคลัสเตอร์ตรงกับสิ่งที่ประกาศไว้ใน Git Repository แล้วหรือไม่ (มิติของความถูกต้องของ Configuration) ส่วน Healthy หมายถึงสถานะสุขภาพของทรัพยากรที่สร้างขึ้นว่ากำลังทำงานปกติหรือไม่ เช่น Pod รันสำเร็จผ่าน Readiness Probe หรือไม่ ดังนั้นแอปสามารถอยู่ในสถานะ Synced แต่ Degraded (ไม่ Healthy) ได้หาก image ดึงไม่ผ่านหรือแอป CrashLoopBackOff',
    stage: 'Part 3',
    relatedLessons: ['m10-l02'],
    keyPoints: [
      'Synced = Manifest ตรงกับ Git (ใช่/ไม่ใช่)',
      'Healthy = Pod/Workload ทำงานได้ปกติ (ผ่าน Health Checks)',
      'ทั้งสองสถานะแยกจากกันโดยสิ้นเชิง'
    ]
  },
  {
    id: 'def-11',
    question: 'Auto-sync, Self-Heal และ Prune ใน Argo CD ทำหน้าที่แตกต่างกันอย่างไร?',
    answer: '1) Automated Sync: สั่งให้ Argo CD ปรับใช้การเปลี่ยนแปลงในคลัสเตอร์ทันทีเมื่อมี commit ใหม่ใน Git 2) Self-Heal: เมื่อมีใครไปแก้ไขหรือลบ resource ในคลัสเตอร์สดๆ ด้วย kubectl (Live Drift) Argo CD จะย้อนค่ากลับมาให้ตรงกับ Git อัตโนมัติ 3) Prune: เมื่อเราลบไฟล์ resource ออกจาก Git แล้ว commit ตัว Argo CD จะสั่งลบ resource นั้นออกจาก Kubernetes คลัสเตอร์ด้วย',
    stage: 'Part 3',
    relatedLessons: ['m10-l02'],
    keyPoints: [
      'Auto-sync: Git เปลี่ยน -> คลัสเตอร์เปลี่ยนตาม',
      'Self-heal: คลัสเตอร์แอบเปลี่ยน -> ดึงกลับให้ตรง Git',
      'Prune: Git ลบออก -> คลัสเตอร์ลบทิ้งตาม'
    ]
  },
  {
    id: 'def-12',
    question: 'ถ้ามีคนใช้ kubectl delete deployment wil-playground โดยตรงในคลัสเตอร์ จะเกิดอะไรขึ้นถ้าเปิด Self-Heal?',
    answer: 'Argo CD จะตรวจพบ Live Drift ภายในรอบการตรวจสอบ และจะสั่งสร้าง Deployment wil-playground นั้นกลับคืนมาใหม่ทันทีให้ตรงกับ Manifest ใน Git Repository ซึ่งเป็นการป้องกัน Human Error และคงสภาพแวดล้อมให้ตรงกับ Single Source of Truth',
    stage: 'Part 3',
    relatedLessons: ['m10-l02'],
    keyPoints: [
      'Self-heal จะตรวจพบความต่างและ Re-create resource กลับมาทันที',
      'ผู้เรียนสามารถสาธิตจุดนี้ให้ผู้ตรวจประทับใจได้'
    ]
  },
  {
    id: 'def-13',
    question: 'ในกระบวนการ GitOps หากต้องการย้อนกลับ (Rollback) แอปพลิเคชันจาก v2 กลับไปเป็น v1 ต้องทำอย่างไร?',
    answer: 'ตามหลักการ GitOps เราจะไม่ใช้คำสั่ง kubectl rollout undo ตรงๆ ในคลัสเตอร์ เพราะจะทำให้เกิด Drift กับ Git และจะถูก Self-Heal ทับ แต่จะต้องย้อนการเปลี่ยนแปลงที่ Git Repository โดยตรง เช่น การใช้ git revert หรือแก้ไขไฟล์ deployment.yaml ให้กลับเป็นแท็ก v1 แล้วทำการ git push ขึ้นไป จากนั้น Argo CD จะทำการตรวจพบและ rollout เวอร์ชัน v1 กลับมาอย่างถูกต้องและมี Audit log ใน Git ชัดเจน',
    stage: 'Part 3',
    relatedLessons: ['m10-l02', 'm11-l02'],
    keyPoints: [
      'ย้อนกลับที่ Git Repository เสมอ (git revert / edit manifest -> commit -> push)',
      'ห้ามแก้สดด้วย kubectl undo ในระบบ GitOps'
    ]
  },
  {
    id: 'def-14',
    question: 'ทำไมเบราว์เซอร์บนเครื่องหลักเปิดเข้าหน้าเว็บ Local GitLab ได้ แต่ Argo CD กลับ clone repository ไม่สำเร็จ?',
    answer: 'เพราะเบราว์เซอร์บนเครื่องหลักและ Argo CD อยู่คนละ Network Namespace และใช้ DNS Resolver คนละชุดกัน: เบราว์เซอร์ใช้ DNS ของเครื่องโฮสต์ (หรือ /etc/hosts ของเครื่องโฮสต์) แต่ Pod ของ Argo CD รันอยู่ในคอนเทนเนอร์ภายในคลัสเตอร์ K3d ซึ่งพึ่งพา CoreDNS ภายในคลัสเตอร์ หากชื่อโดเมนไม่ได้ถูกประกาศใน CoreDNS หรือไม่ได้ตั้งค่า Service DNS ภายใน คอนเทนเนอร์จะไม่รู้จักชื่อโดเมนนั้น หรืออาจเกิดปัญหาจาก Self-signed TLS Certificate ที่ Git client ภายใน Pod ปฏิเสธ',
    stage: 'Bonus',
    relatedLessons: ['m13-l02'],
    keyPoints: [
      'Host Network vs Cluster In-pod Network มี DNS แยกกัน',
      'เบราว์เซอร์มองเห็นผ่าน port forward/ingress แต่ Pod ข้างในต้อง resolve ผ่าน CoreDNS หรือ Service Name',
      'TLS Certificate Verification ของ Git client ภายใน pod'
    ]
  },
  {
    id: 'def-15',
    question: 'PersistentVolume (PV) ถือเป็นการสำรองข้อมูล (Backup) หรือไม่?',
    answer: 'ไม่ใช่ครับ PV เป็นเพียงกลไกการคงอยู่ของข้อมูล (Persistence) ไม่ให้สูญหายเมื่อ Pod ถูก restart หรือ recreate เท่านั้น หากโหนดหรือดิสก์ของเครื่องเสมือนเสียหาย ข้อมูลใน PV ก็จะหายไปด้วย การสำรองข้อมูล (Backup) จำเป็นต้องมีกระบวนการ snapshot หรือส่งข้อมูลออกไปเก็บไว้ยังพื้นที่จัดเก็บภายนอกแยกต่างหาก',
    stage: 'Bonus',
    relatedLessons: ['m12-l01'],
    keyPoints: [
      'Persistence != Backup',
      'PV รอดจากการตายของ Pod แต่ไม่รอดจากการลบ Disk/Cluster',
      'Backup ต้องสำรองข้อมูลข้ามระบบ'
    ]
  },
  {
    id: 'def-16',
    question: 'การสั่ง Restart Pod กับการลบ K3d Cluster ทิ้ง ส่งผลต่อข้อมูลใน PV อย่างไร?',
    answer: 'การสั่ง Restart Pod หรือลบ Pod แล้วสร้างใหม่ Pod ใหม่จะกลับมา mount กับ PVC/PV เดิม ทำให้ข้อมูลที่เขียนไว้ยังอยู่ครบถ้วน แต่สำหรับการลบ K3d Cluster ทิ้ง (k3d cluster delete) หากเราไม่ได้ทำ Volume Mount ผูกโฟลเดอร์จากเครื่องโฮสต์เข้ามาใน Docker container ข้อมูลในโหนดคอนเทนเนอร์จะถูกทำลายและสูญหายทั้งหมดเมื่อคลัสเตอร์ถูกลบ',
    stage: 'Bonus',
    relatedLessons: ['m12-l01', 'm13-l01'],
    keyPoints: [
      'Pod Lifecycle: ข้อมูลใน PVC รอด',
      'K3d Cluster Lifecycle: ถือเป็น ephemeral node containers เว้นแต่ผูก host volume'
    ]
  }
];
