import { Module } from '@/types/curriculum';

export const modulesData: Module[] = [
  {
    id: 'm00',
    order: 0,
    title: 'บท 0: เตรียม Lab และอ่านโจทย์ Subject',
    subtitle: 'ทำความเข้าใจสถาปัตยกรรมระดับชั้น และแกะเงื่อนไขของโจทย์ Inception-of-Things',
    stage: 'Foundation',
    description: 'เรียนรู้การแยกชั้นระบบ (เครื่องจริง, VM หลัก, Vagrant guest, K3d container, Kubernetes Pod) การจัดงบประมาณทรัพยากร CPU/RAM/Disk และการวางแผน IP/Interface',
    iconName: 'Layers',
    lessonIds: ['m00-l01', 'm00-l02']
  },
  {
    id: 'm01',
    order: 1,
    title: 'บท 1: Linux, Bash และ Git ที่ใช้จริง',
    subtitle: 'รากฐานระบบปฏิบัติการและสคริปต์อัตโนมัติสำหรับโปรเจกต์',
    stage: 'Foundation',
    description: 'เจาะลึก Filesystem, Permissions, Process, Systemd service, สคริปต์ Bash แบบ Idempotent, Heredoc, Exit codes และ Git workflow สำหรับ GitOps',
    iconName: 'Terminal',
    lessonIds: ['m01-l01', 'm01-l02']
  },
  {
    id: 'm02',
    order: 2,
    title: 'บท 2: Network, HTTP และ SSH',
    subtitle: 'เครือข่ายสำหรับคลัสเตอร์และการสื่อสารข้ามโหนด',
    stage: 'Foundation',
    description: 'ทำความเข้าใจ IP, Subnet, Routing, ความต่างของ NAT vs Host-Only vs Bridged network, TCP Ports, HTTP Host Header และ SSH Key-based authentication',
    iconName: 'Network',
    lessonIds: ['m02-l01', 'm02-l02']
  },
  {
    id: 'm03',
    order: 3,
    title: 'บท 3: VM และ Vagrant',
    subtitle: 'การควบคุมและจำลองเครื่องเสมือนด้วยโค้ด (Infrastructure as Code)',
    stage: 'Foundation',
    description: 'ไวยากรณ์ Ruby DSL ของ Vagrantfile, การสร้าง Multi-machine (Server & ServerWorker), Private network IP, Synced folder และ Vagrant Provisioning',
    iconName: 'Cpu',
    lessonIds: ['m03-l01', 'm03-l02']
  },
  {
    id: 'm04',
    order: 4,
    title: 'บท 4: Container และ Docker',
    subtitle: 'การห่อหุ้มแอปพลิเคชันด้วย Linux Namespaces และ Cgroups',
    stage: 'Foundation',
    description: 'ความต่างของ Container เทียบกับ VM, Image, Registry, Digest, Port publishing, Volume mount, และการเขียน Dockerfile เพื่อเตรียม image สำหรับ Part 3',
    iconName: 'Box',
    lessonIds: ['m04-l01', 'm04-l02']
  },
  {
    id: 'm05',
    order: 5,
    title: 'บท 5: Kubernetes และ YAML Declarative',
    subtitle: 'สถาปัตยกรรมระบบจัดการคอนเทนเนอร์และภาษาประกาศสถานะ',
    stage: 'Foundation',
    description: 'Desired State vs Actual State, Control Plane vs Worker Node, ทรัพยากรพื้นฐาน (Pod, ReplicaSet, Deployment, Service, Ingress), Labels/Selectors และ kubectl',
    iconName: 'Boxes',
    lessonIds: ['m05-l01', 'm05-l02']
  },
  {
    id: 'm06',
    order: 6,
    title: 'บท 6: K3s และจบ Part 1',
    subtitle: 'คลัสเตอร์ K3s 2 โหนดบน Vagrant ตามข้อกำหนดของโจทย์อย่างแม่นยำ',
    stage: 'Part 1',
    description: 'ติดตั้ง K3s Server บน wilS (192.168.56.110) และ Agent บน wilSW (192.168.56.111), เชื่อมต่อด้วย token, ตรวจสอบ flannnel interface และทดสอบ kubectl get nodes',
    iconName: 'Server',
    lessonIds: ['m06-l01', 'm06-l02']
  },
  {
    id: 'm07',
    order: 7,
    title: 'บท 7: Workloads และ Service',
    subtitle: 'การรันแอปพลิเคชันหลายชุด (Replicas) และการเข้าถึงผ่านระบบเครือข่ายภายใน',
    stage: 'Part 2',
    description: 'Deployment Rollout, Pod replacement, Service Selectors, EndpointSlices, พอร์ต port vs targetPort vs nodePort, และ Health probes (Liveness/Readiness)',
    iconName: 'Repeat',
    lessonIds: ['m07-l01', 'm07-l02']
  },
  {
    id: 'm08',
    order: 8,
    title: 'บท 8: Ingress และจบ Part 2',
    subtitle: 'Reverse Proxy และการกระจายคำขอด้วย Host Header ตามโจทย์ Part 2',
    stage: 'Part 2',
    description: 'ติดตั้ง 3 Web Apps (app1, app2 มี 3 replicas, app3), ตั้งค่า Traefik Ingress สำหรับ app1.com, app2.com และ app3 เป็น Default Fallback สำหรับ IP ตรงและ Host อื่น',
    iconName: 'Route',
    lessonIds: ['m08-l01', 'm08-l02']
  },
  {
    id: 'm09',
    order: 9,
    title: 'บท 9: K3d และ Network ซ้อนใน Docker',
    subtitle: 'การรันคลัสเตอร์ Kubernetes แบบเบาหวิวภายในคอนเทนเนอร์ Docker',
    stage: 'Part 3',
    description: 'ความต่างของ K3d vs K3s, การสร้างคลัสเตอร์ K3d ภายใน VM โดยไม่ใช้ Vagrant, การแมปพอร์ต (-p 8888:8888@loadbalancer) และ Docker network bridge',
    iconName: 'Container',
    lessonIds: ['m09-l01', 'm09-l02']
  },
  {
    id: 'm10',
    order: 10,
    title: 'บท 10: GitOps และ Argo CD',
    subtitle: 'การปรับเปลี่ยนระบบแบบอัตโนมัติโดยใช้ Git เป็น Single Source of Truth',
    stage: 'Part 3',
    description: 'แนวคิด GitOps, สถาปัตยกรรม Argo CD (Application Controller, Repo Server, API), CRD Application, Auto-sync, Self-heal, Prune และความต่างของ Sync vs Health',
    iconName: 'GitBranch',
    lessonIds: ['m10-l01', 'm10-l02']
  },
  {
    id: 'm11',
    order: 11,
    title: 'บท 11: ประกอบและจบ Part 3',
    subtitle: 'สร้างระบบ GitOps เต็มรูปแบบด้วย GitHub, Argo CD และ Wil Playground',
    stage: 'Part 3',
    description: 'สร้าง Script ติดตั้งเครื่องมืออัตโนมัติ, Namespace argocd และ dev, เชื่อมต่อ Public GitHub Repo (มีชื่อ login), สาธิตอัปเดตแอปจาก v1 เป็น v2 โดยอัตโนมัติ',
    iconName: 'CheckCircle2',
    lessonIds: ['m11-l01', 'm11-l02']
  },
  {
    id: 'm12',
    order: 12,
    title: 'บท 12: Storage, Helm และ Credentials',
    subtitle: 'ระบบพื้นที่จัดเก็บถาวร ตัวจัดการแพ็กเกจ และความปลอดภัย',
    stage: 'Bonus',
    description: 'PersistentVolume (PV), PersistentVolumeClaim (PVC), StorageClass local-path, พื้นฐานการใช้งาน Helm (Charts, Values, Releases) และการสร้าง Kubernetes Secret',
    iconName: 'HardDrive',
    lessonIds: ['m12-l01', 'm12-l02']
  },
  {
    id: 'm13',
    order: 13,
    title: 'บท 13: GitLab Bonus แบบเข้าใจทั้งระบบ',
    subtitle: 'การติดตั้ง Local GitLab ในคลัสเตอร์และเปลี่ยนทางน้ำ GitOps ให้ชี้สู่ภายใน',
    stage: 'Bonus',
    description: 'ติดตั้ง GitLab เวอร์ชันล่าสุดใน Namespace gitlab บนคลัสเตอร์ K3d ในเครื่อง, บริหารจัดการ RAM/Storage, แก้ไขปัญหา In-cluster DNS และต่อท่อ Argo CD เข้า GitLab',
    iconName: 'Award',
    lessonIds: ['m13-l01', 'm13-l02']
  },
  {
    id: 'm14',
    order: 14,
    title: 'บท 14: Rebuild, Debug และ Defense',
    subtitle: 'การซ้อมรันระบบจากศูนย์ แก้ไขปัญหาเฉพาะหน้า และเตรียมตัวสอบ Defense',
    stage: 'Defense',
    description: 'ฝึกซ้อม Clean Rebuild สปีดเร็ว, ลำดับการ Troubleshooting จากภายนอกเข้าภายใน, ตรวจสอบโครงสร้างโฟลเดอร์ p1/p2/p3/bonus และซ้อมตอบคำถามประเมินผล',
    iconName: 'ShieldAlert',
    lessonIds: ['m14-l01', 'm14-l02']
  }
];
