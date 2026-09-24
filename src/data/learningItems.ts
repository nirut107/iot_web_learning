import { LearningItem } from '@/types/curriculum';

export const learningItemsData: LearningItem[] = [
  // Module 00
  {
    id: 'chk-m00-l01-01',
    lessonId: 'm00-l01',
    text: 'เข้าใจการแบ่งชั้นของระบบ: เครื่องจริง -> VM หลัก -> Vagrant Guest -> K3d Container -> Pod',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m00-l01-02',
    lessonId: 'm00-l01',
    text: 'เข้าใจความหมายของ "without Vagrant" ใน Part 3 ว่าไม่ได้ยกเลิกข้อกำหนดเรื่อง VM หลัก',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m00-l01-03',
    lessonId: 'm00-l01',
    text: 'ตรวจสอบคำสั่ง lscpu และ free -h บนเครื่อง VM หลักสำเร็จ',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m00-l02-01',
    lessonId: 'm00-l02',
    text: 'วางผัง IP 192.168.56.110 (Server) และ 192.168.56.111 (ServerWorker) ครบถ้วน',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m00-l02-02',
    lessonId: 'm00-l02',
    text: 'เข้าใจข้อจำกัดเรื่อง RAM 512MB/1GB ในโจทย์เทียบกับ K3s System Requirements ปัจจุบัน',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m00-l02-03',
    lessonId: 'm00-l02',
    text: 'รันคำสั่ง ip -br a และระบุชื่อ Predictable Network Interface จริงของระบบได้',
    required: true,
    kind: 'practice'
  },

  // Module 01
  {
    id: 'chk-m01-l01-01',
    lessonId: 'm01-l01',
    text: 'เข้าใจ Linux File Permissions (octal 755, 700, 600) และการตั้งค่าความปลอดภัย',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m01-l01-02',
    lessonId: 'm01-l01',
    text: 'สามารถใช้ systemctl และ journalctl ตรวจสอบสถานะและ log ของ service ได้',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m01-l01-03',
    lessonId: 'm01-l01',
    text: 'เข้าใจกลไก Process และความแตกต่างของ exit code (0 = สำเร็จ, non-zero = ผิดพลาด)',
    required: false,
    kind: 'concept'
  },
  {
    id: 'chk-m01-l02-01',
    lessonId: 'm01-l02',
    text: 'เขียน Bash script แบบ Idempotent ที่รันซ้ำแล้วไม่เกิดข้อผิดพลาดหรือข้อมูลซ้ำซ้อน',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m01-l02-02',
    lessonId: 'm01-l02',
    text: 'เข้าใจการใช้ set -euo pipefail และ Heredoc (cat << EOF) สำหรับสร้างไฟล์คอนฟิก',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m01-l02-03',
    lessonId: 'm01-l02',
    text: 'ฝึกฝน Git workflow: commit, push, revert สำหรับใช้งานร่วมกับ GitOps',
    required: true,
    kind: 'practice'
  },

  // Module 02
  {
    id: 'chk-m02-l01-01',
    lessonId: 'm02-l01',
    text: 'เข้าใจความแตกต่างระหว่าง NAT, Host-Only/Private Network และ Bridged Network',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m02-l01-02',
    lessonId: 'm02-l01',
    text: 'เข้าใจ Subnet Mask /24 และ Routing Gateway สำหรับเชื่อมต่อเครือข่ายภายใน',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m02-l01-03',
    lessonId: 'm02-l01',
    text: 'ทดสอบการ ping และ traceroute ข้าม IP ในวง private network สำเร็จ',
    required: false,
    kind: 'verification'
  },
  {
    id: 'chk-m02-l02-01',
    lessonId: 'm02-l02',
    text: 'เข้าใจการทำงานของ HTTP Host Header ในระดับ Layer 7 เทียบกับ DNS ใน Layer 3/4',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m02-l02-02',
    lessonId: 'm02-l02',
    text: 'สามารถใช้ curl -H "Host: ..." เพื่อทดสอบจำลอง Virtual Host ได้อย่างแม่นยำ',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m02-l02-03',
    lessonId: 'm02-l02',
    text: 'ตั้งค่า Passwordless SSH ด้วย Public Key และเข้าใจข้อกำหนดสิทธิ์ 700/600',
    required: true,
    kind: 'practice'
  },

  // Module 03
  {
    id: 'chk-m03-l01-01',
    lessonId: 'm03-l01',
    text: 'เข้าใจโครงสร้างไวยากรณ์ Ruby DSL ใน Vagrantfile และคอนฟิกชันพื้นฐาน',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m03-l01-02',
    lessonId: 'm03-l01',
    text: 'เชี่ยวชาญคำสั่งวงจรชีวิต Vagrant: vagrant up, halt, reload, destroy, status',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m03-l01-03',
    lessonId: 'm03-l01',
    text: 'เข้าใจกลไก Synced Folders ระหว่างโฮสต์และ guest VM',
    required: false,
    kind: 'concept'
  },
  {
    id: 'chk-m03-l02-01',
    lessonId: 'm03-l02',
    text: 'เขียน Vagrantfile แบบ Multi-machine สำหรับ Server (wilS) และ ServerWorker (wilSW)',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m03-l02-02',
    lessonId: 'm03-l02',
    text: 'กำหนด Dedicated IP: 192.168.56.110 และ 192.168.56.111 ใน Vagrantfile ถูกต้อง',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m03-l02-03',
    lessonId: 'm03-l02',
    text: 'ตั้งค่า Provisioning Script ผ่าน config.vm.provision "shell" แบบ non-interactive',
    required: true,
    kind: 'practice'
  },

  // Module 04
  {
    id: 'chk-m04-l01-01',
    lessonId: 'm04-l01',
    text: 'เข้าใจความแตกต่างเชิงสถาปัตยกรรมระหว่าง Container กับ Virtual Machine',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m04-l01-02',
    lessonId: 'm04-l01',
    text: 'เข้าใจบทบาทของ Linux Namespaces (PID, NET, MNT) และ Cgroups ในการจำกัดทรัพยากร',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m04-l01-03',
    lessonId: 'm04-l01',
    text: 'สามารถใช้คำสั่ง docker run, ps, exec, logs, rm ได้อย่างคล่องแคล่ว',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m04-l02-01',
    lessonId: 'm04-l02',
    text: 'เข้าใจโครงสร้าง Dockerfile: FROM, WORKDIR, COPY, RUN, EXPOSE, CMD',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m04-l02-02',
    lessonId: 'm04-l02',
    text: 'สามารถ build และติดแท็ก image v1 และ v2 ที่มีความต่างกันของเนื้อหาได้',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m04-l02-03',
    lessonId: 'm04-l02',
    text: 'เข้าใจการ Publish Port ผ่าน -p hostPort:containerPort และการทำ Volume Mount',
    required: true,
    kind: 'concept'
  },

  // Module 05
  {
    id: 'chk-m05-l01-01',
    lessonId: 'm05-l01',
    text: 'เข้าใจความแตกต่างระหว่าง Desired State กับ Actual State ใน Kubernetes',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m05-l01-02',
    lessonId: 'm05-l01',
    text: 'เข้าใจส่วนประกอบของ Control Plane (API Server, Controller Manager, Scheduler)',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m05-l01-03',
    lessonId: 'm05-l01',
    text: 'เข้าใจหน้าที่ของ Node Components: Kubelet, Kube-proxy, Container Runtime',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m05-l02-01',
    lessonId: 'm05-l02',
    text: 'แยกแยะความแตกต่างของ Pod, ReplicaSet, Deployment, Service, และ Ingress ได้',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m05-l02-02',
    lessonId: 'm05-l02',
    text: 'เขียน Declarative YAML manifest ที่ถูกต้องและจับคู่ Label Selectors ได้แม่นยำ',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m05-l02-03',
    lessonId: 'm05-l02',
    text: 'เข้าใจโครงสร้าง kubeconfig และคำสั่ง kubectl apply, get, describe, delete',
    required: true,
    kind: 'practice'
  },

  // Module 06
  {
    id: 'chk-m06-l01-01',
    lessonId: 'm06-l01',
    text: 'เข้าใจสถาปัตยกรรม K3s Server vs Agent และการใช้ SQLite datastore ในตัว',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m06-l01-02',
    lessonId: 'm06-l01',
    text: 'ติดตั้ง K3s Server บน wilS โดยระบุ --node-ip=192.168.56.110 และ --flannel-iface',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m06-l01-03',
    lessonId: 'm06-l01',
    text: 'ดึง Node Token จาก /var/lib/rancher/k3s/server/node-token อย่างถูกต้อง',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m06-l02-01',
    lessonId: 'm06-l02',
    text: 'เชื่อมต่อ Agent บน wilSW เข้ากับ Server ผ่าน K3S_URL และ K3S_TOKEN',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m06-l02-02',
    lessonId: 'm06-l02',
    text: 'ตรวจสอบสถานะด้วย kubectl get nodes -o wide พบทั้ง 2 โหนดขึ้นสถานะ Ready',
    required: true,
    kind: 'verification'
  },
  {
    id: 'chk-m06-l02-03',
    lessonId: 'm06-l02',
    text: 'ทดสอบรัน pod ทดสอบและ ping ข้ามโหนดเพื่อพิสูจน์การทำงานของ Flannel CNI',
    required: true,
    kind: 'verification'
  },

  // Module 07
  {
    id: 'chk-m07-l01-01',
    lessonId: 'm07-l01',
    text: 'สร้าง Deployment app2 กำหนด replicas: 3 ตามข้อกำหนดของโจทย์ Part 2',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m07-l01-02',
    lessonId: 'm07-l01',
    text: 'เข้าใจกลไก RollingUpdate และการแทนที่ Pod (Pod Replacement / Recreate)',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m07-l01-03',
    lessonId: 'm07-l01',
    text: 'ทดลองลบ Pod ของ app2 สดๆ และสังเกตการสร้าง Pod ใหม่กลับมาครบ 3 ตัวทันที',
    required: true,
    kind: 'verification'
  },
  {
    id: 'chk-m07-l02-01',
    lessonId: 'm07-l02',
    text: 'เข้าใจความแตกต่างระหว่าง port, targetPort, และ nodePort ใน Service',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m07-l02-02',
    lessonId: 'm07-l02',
    text: 'สร้าง ClusterIP Service สำหรับ app1, app2, app3 และตรวจดู Endpoints',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m07-l02-03',
    lessonId: 'm07-l02',
    text: 'เข้าใจความแตกต่างระหว่าง Liveness Probe กับ Readiness Probe',
    required: false,
    kind: 'concept'
  },

  // Module 08
  {
    id: 'chk-m08-l01-01',
    lessonId: 'm08-l01',
    text: 'เข้าใจการทำงานของ Reverse Proxy และ Traefik Ingress Controller ใน K3s',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m08-l01-02',
    lessonId: 'm08-l01',
    text: 'เข้าใจเส้นทางการเดินทางของ Request จากเครื่องผู้ใช้ -> Ingress -> Service -> Pod',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m08-l01-03',
    lessonId: 'm08-l01',
    text: 'ตรวจสอบ Traefik Pod และ ServiceLB ใน namespace kube-system สำเร็จ',
    required: true,
    kind: 'verification'
  },
  {
    id: 'chk-m08-l02-01',
    lessonId: 'm08-l02',
    text: 'สร้าง Ingress ที่กำหนด Host app1.com -> app1 และ app2.com -> app2',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m08-l02-02',
    lessonId: 'm08-l02',
    text: 'กำหนด defaultBackend ชี้ไปยัง app3 สำหรับการเข้าผ่าน IP ตรงหรือ Host อื่น',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m08-l02-03',
    lessonId: 'm08-l02',
    text: 'ทดสอบ curl ทั้ง 3 กรณีสำเร็จและเตรียมคำอธิบาย Ingress YAML ตอนสอบ Defense',
    required: true,
    kind: 'verification'
  },

  // Module 09
  {
    id: 'chk-m09-l01-01',
    lessonId: 'm09-l01',
    text: 'เข้าใจความแตกต่างระหว่าง K3s (รันบน OS) กับ K3d (รันโหนดใน Docker)',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m09-l01-02',
    lessonId: 'm09-l01',
    text: 'สร้างคลัสเตอร์ K3d ภายใน VM หลักโดยไม่ใช้ Vagrant ตามข้อกำหนด Part 3',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m09-l01-03',
    lessonId: 'm09-l01',
    text: 'สามารถสั่ง k3d cluster create, list, stop, start, delete ได้อย่างถูกต้อง',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m09-l02-01',
    lessonId: 'm09-l02',
    text: 'เข้าใจกลไก K3d Port Mapping (-p hostPort:containerPort@loadbalancer)',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m09-l02-02',
    lessonId: 'm09-l02',
    text: 'สร้างคลัสเตอร์ K3d พร้อมเปิดพอร์ต 8888 สำหรับแอปพลิเคชัน wil42/playground',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m09-l02-03',
    lessonId: 'm09-l02',
    text: 'เข้าใจ Docker Bridge Network ที่เชื่อมคอนเทนเนอร์โหนดของ K3d เข้าด้วยกัน',
    required: false,
    kind: 'concept'
  },

  // Module 10
  {
    id: 'chk-m10-l01-01',
    lessonId: 'm10-l01',
    text: 'เข้าใจหลักการ GitOps: Git เป็น Single Source of Truth และ Pull-based Model',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m10-l01-02',
    lessonId: 'm10-l01',
    text: 'เข้าใจว่า Argo CD ไม่ใช่ Image Builder แต่เป็น Manifest Continuous Delivery',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m10-l01-03',
    lessonId: 'm10-l01',
    text: 'ติดตั้ง Argo CD ลงใน namespace argocd และเข้าถึง Web UI / CLI ได้',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m10-l02-01',
    lessonId: 'm10-l02',
    text: 'เข้าใจฟิลด์สำคัญใน Application CRD: repoURL, targetRevision, path, destination',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m10-l02-02',
    lessonId: 'm10-l02',
    text: 'เข้าใจความแตกต่างและการตั้งค่า Automated Sync, Self-Heal, และ Prune',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m10-l02-03',
    lessonId: 'm10-l02',
    text: 'แยกแยะความแตกต่างระหว่างสถานะ Synced (Config ตรง Git) กับ Healthy (Pod รันปกติ)',
    required: true,
    kind: 'concept'
  },

  // Module 11
  {
    id: 'chk-m11-l01-01',
    lessonId: 'm11-l01',
    text: 'สร้าง Script ติดตั้งเครื่องมือทั้งหมด (Docker, K3d, kubectl) สำหรับรันตอนสอบ',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m11-l01-02',
    lessonId: 'm11-l01',
    text: 'สร้าง Public GitHub Repository โดยมี Login ของสมาชิกในชื่อ Repo ตามโจทย์',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m11-l01-03',
    lessonId: 'm11-l01',
    text: 'สร้าง Namespace แยก 2 ตัว: argocd และ dev บนคลัสเตอร์ K3d',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m11-l02-01',
    lessonId: 'm11-l02',
    text: 'Deploy แอปพลิเคชันเวอร์ชัน 1 (พอร์ต 8888) และทดสอบ curl ได้รับ {"message":"v1"}',
    required: true,
    kind: 'verification'
  },
  {
    id: 'chk-m11-l02-02',
    lessonId: 'm11-l02',
    text: 'แก้ manifest บน GitHub เป็นเวอร์ชัน 2 ทำการ git commit และ push',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m11-l02-03',
    lessonId: 'm11-l02',
    text: 'ตรวจสอบ Argo CD ทำการ Auto-sync และทดสอบ curl ได้รับ {"message":"v2"} สำเร็จ',
    required: true,
    kind: 'verification'
  },

  // Module 12
  {
    id: 'chk-m12-l01-01',
    lessonId: 'm12-l01',
    text: 'เข้าใจวงจรชีวิตของ PersistentVolume (PV), PersistentVolumeClaim (PVC), StorageClass',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m12-l01-02',
    lessonId: 'm12-l01',
    text: 'เข้าใจความแตกต่างระหว่าง Pod Recreate (ข้อมูลรอด) กับ K3d Cluster Deletion (ข้อมูลหาย)',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m12-l01-03',
    lessonId: 'm12-l01',
    text: 'เข้าใจว่า PV ไม่ใช่ระบบ Backup แต่เป็นกลไกการคงอยู่ของ Storage ในคลัสเตอร์',
    required: false,
    kind: 'concept'
  },
  {
    id: 'chk-m12-l02-01',
    lessonId: 'm12-l02',
    text: 'เข้าใจโครงสร้างของ Helm: Chart, Values, Template, และ Release',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m12-l02-02',
    lessonId: 'm12-l02',
    text: 'สามารถใช้ helm install, helm upgrade, และปรับแต่ง values.yaml ได้',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m12-l02-03',
    lessonId: 'm12-l02',
    text: 'เข้าใจการสร้าง Kubernetes Secret สำหรับเก็บ Credentials และ TLS Certs',
    required: true,
    kind: 'practice'
  },

  // Module 13
  {
    id: 'chk-m13-l01-01',
    lessonId: 'm13-l01',
    text: 'คำนวณและจัดสรรงบประมาณ RAM สำหรับ GitLab (ขั้นต่ำ 4GB-8GB พร้อม Swap)',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m13-l01-02',
    lessonId: 'm13-l01',
    text: 'สร้าง Dedicated Namespace ชื่อ gitlab สำหรับเก็บเซอร์วิสของ GitLab ทั้งหมด',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m13-l01-03',
    lessonId: 'm13-l01',
    text: 'ตรวจสอบเลขเวอร์ชันล่าสุดของ GitLab จาก official website และบันทึกไว้ในเอกสาร',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m13-l02-01',
    lessonId: 'm13-l02',
    text: 'ติดตั้ง GitLab Local instance ในคลัสเตอร์ และเข้าสู่ระบบสร้าง repo ได้สำเร็จ',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m13-l02-02',
    lessonId: 'm13-l02',
    text: 'แก้ปัญหา DNS Resolution และ In-cluster reachability ให้ Argo CD เข้าถึง GitLab ได้',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m13-l02-03',
    lessonId: 'm13-l02',
    text: 'สาธิต Workflow Part 3 (แก้ manifest -> commit/push -> auto-update) ผ่าน Local GitLab',
    required: true,
    kind: 'verification'
  },

  // Module 14
  {
    id: 'chk-m14-l01-01',
    lessonId: 'm14-l01',
    text: 'เข้าใจแนวทางการ Troubleshoot 5 เลเยอร์: Host -> VM/Vagrant -> K8s Nodes -> Pods -> App',
    required: true,
    kind: 'concept'
  },
  {
    id: 'chk-m14-l01-02',
    lessonId: 'm14-l01',
    text: 'สามารถวิเคราะห์อาการเสียทั่วไปจากตาราง Troubleshooting ได้อย่างคล่องแคล่ว',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m14-l01-03',
    lessonId: 'm14-l01',
    text: 'ฝึกใช้คำสั่ง kubectl describe, logs, get events, top ในการวินิจฉัยปัญหา',
    required: true,
    kind: 'practice'
  },
  {
    id: 'chk-m14-l02-01',
    lessonId: 'm14-l02',
    text: 'ทดสอบ Clean Rebuild ทุก Part (p1, p2, p3, bonus) จากศูนย์และทำงานได้อัตโนมัติ',
    required: true,
    kind: 'verification'
  },
  {
    id: 'chk-m14-l02-02',
    lessonId: 'm14-l02',
    text: 'ตรวจสอบโครงสร้างไดเรกทอรี root และไฟล์ confs/, scripts/ ตรงตาม Subject เป๊ะ',
    required: true,
    kind: 'verification'
  },
  {
    id: 'chk-m14-l02-03',
    lessonId: 'm14-l02',
    text: 'ซ้อมตอบคำถาม Defense ทุกข้อ และเข้าใจกับดักคำถามของผู้ประเมินผล',
    required: true,
    kind: 'concept'
  }
];
