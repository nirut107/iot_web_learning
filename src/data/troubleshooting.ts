import { TroubleshootingItem } from '@/types/curriculum';

export const troubleshootingData: TroubleshootingItem[] = [
  {
    id: 'tb-01',
    symptom: 'ชื่อ Network Interface ใน Vagrant ไม่ใช่ eth1 (ขึ้นเป็น enp0s8 หรือชื่ออื่น)',
    category: 'Vagrant/VM',
    stage: 'Part 1',
    lessonId: 'm02-l01',
    possibleCauses: [
      'Linux distribution รุ่นใหม่ (Debian 11/12, Ubuntu 20.04+) เปิดใช้งาน Predictable Network Interface Names โดยค่าเริ่มต้น',
      'VirtualBox จัดสรร interface ตาม PCI slot ทำให้ได้ชื่อ enp0s3 (NAT) และ enp0s8 (Host-only)'
    ],
    verification: 'รันคำสั่ง ip -br a เพื่อดูรายชื่อ interface ทั้งหมดและ IP ที่ผูกอยู่',
    fix: 'ห้ามฮาร์ดโค้ด eth1 ในสคริปต์ ให้ใช้ตัวแปรตรวจจับ interface ที่ถือ IP 192.168.56.x โดยอัตโนมัติ เช่น IFACE=$(ip -br a | grep 192.168.56 | awk \'{print $1}\') หรือใช้ K3S_FLANNEL_IFACE=enp0s8 ให้ตรงกับเครื่องจริง'
  },
  {
    id: 'tb-02',
    symptom: 'K3s Agent ไม่ยอมเชื่อมต่อเข้า Server หรือโหนด Agent ขึ้นสถานะ NotReady นานเกินไป',
    category: 'K3s/Network',
    stage: 'Part 1',
    lessonId: 'm06-l02',
    possibleCauses: [
      'Token ที่ดึงมาจาก Server (/var/lib/rancher/k3s/server/node-token) ไม่ถูกต้องหรือมี newline/ช่องว่างติดมา',
      'Port 6443 บน Server ถูกไฟร์วอลล์ (UFW/iptables) บล็อกไว้',
      'Agent พยายามต่อเข้า IP ผิด หรือต่อผ่าน NAT interface (10.0.2.15) แทนที่จะเป็น 192.168.56.110'
    ],
    verification: 'บนเครื่อง Agent รัน curl -k https://192.168.56.110:6443 และดู log ด้วย journalctl -u k3s-agent -e',
    fix: 'ตรวจสอบว่า Agent รันด้วย K3S_URL=https://192.168.56.110:6443 และดึง token ที่ถูกต้อง ปิดหรืออนุญาตพอร์ต 6443 ในไฟร์วอลล์'
  },
  {
    id: 'tb-03',
    symptom: 'Pod ข้ามโหนด ping ข้ามหากันไม่ได้ หรือ Flannel bind ไปที่ IP 10.0.2.15 ของ NAT',
    category: 'K3s/Network',
    stage: 'Part 1',
    lessonId: 'm06-l01',
    possibleCauses: [
      'K3s เลือก network interface ตัวแรก (default gateway ซึ่งเป็น NAT 10.0.2.15) มาทำ VXLAN Overlay Network ทำให้ทราฟฟิกระหว่าง Pod ข้ามโหนดหลงทาง'
    ],
    verification: 'รัน kubectl get nodes -o wide ดูคอลัมน์ INTERNAL-IP หากขึ้นเป็น 10.0.2.15 แสดงว่าผิด interface',
    fix: 'ต้องใส่พารามิเตอร์ตอนเริ่ม K3s Server และ Agent ดังนี้: --flannel-iface=<interface-name> และ --node-ip=192.168.56.11x เพื่อบังคับให้ Flannel คุยกันผ่าน private network interface เท่านั้น'
  },
  {
    id: 'tb-04',
    symptom: 'SSH ระหว่างเครื่องยังคงถามรหัสผ่าน (Passwordless SSH ไม่ทำงาน)',
    category: 'Vagrant/VM',
    stage: 'Part 1',
    lessonId: 'm02-l02',
    possibleCauses: [
      'สิทธิ์ของไดเรกทอรี ~/.ssh หรือไฟล์ authorized_keys หละหลวมเกินไป (SSH daemon จะปฏิเสธทันที)',
      'ไม่ได้ใส่ public key ของทั้ง Server และ Agent เข้าหากัน',
      'SSH Config บนเครื่องไม่ได้ตั้ง StrictHostKeyChecking=no ทำให้ติดถาม known_hosts'
    ],
    verification: 'ตรวจสอบสิทธิ์ด้วย ls -la ~/.ssh ต้องเป็น 700 สำหรับโฟลเดอร์ และ 600 สำหรับ authorized_keys',
    fix: 'รัน chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys และเพิ่ม StrictHostKeyChecking no ใน /etc/ssh/ssh_config'
  },
  {
    id: 'tb-05',
    symptom: 'K3s หรือ Pod ดับกะทันหัน หรือเกิด CrashLoopBackOff เนื่องจาก RAM 512MB ไม่พอ',
    category: 'Vagrant/VM',
    stage: 'Part 1',
    lessonId: 'm06-l02',
    possibleCauses: [
      'คำแนะนำในโจทย์ระบุ 512MB RAM แต่ K3s รุ่นใหม่ๆ ร่วมกับ Containerd และ Systemd มี baseline memory สูงจนชนขีดจำกัด'
    ],
    verification: 'รัน free -h และ dmesg -T | grep -i oom-killer จะเห็นเคอร์เนลฆ่า k3s process',
    fix: '1) ปรับ RAM ใน Vagrantfile เป็น 1024MB (โจทย์ระบุ 512 หรือ 1024 ได้) 2) เพิ่ม swap file ขนาด 1GB 3) ปิดคอมโพเนนต์ที่ไม่ใช้ใน p1 เช่น --disable=traefik,servicelb,metrics-server ใน k3s server args'
  },
  {
    id: 'tb-06',
    symptom: 'ยิง curl ด้วย IP ตรง (http://192.168.56.110/) แต่ไม่ยอมวิ่งไปที่ app3 (ได้ 404 แทน)',
    category: 'Ingress/Routing',
    stage: 'Part 2',
    lessonId: 'm08-l02',
    possibleCauses: [
      'Ingress ประกาศเฉพาะ rules ที่มี host: app1.com และ host: app2.com แต่ไม่ได้กำหนด defaultBackend ในระดับ root ของ spec',
      'Traefik รุ่นใหม่ต้องการ Ingress spec ที่ถูกต้องตาม networking.k8s.io/v1'
    ],
    verification: 'รัน kubectl get ingress -o yaml สังเกตว่ามีบล็อก defaultBackend ชี้ไปยัง service ของ app3 หรือไม่',
    fix: 'เพิ่ม spec.defaultBackend.service.name: app3-service และ port: 80 นอกบล็อก rules ในไฟล์ Ingress manifest'
  },
  {
    id: 'tb-07',
    symptom: 'แอป app2 มี Pod รันขึ้นมาแค่ 1 ตัว ทั้งที่โจทย์สั่ง 3 Replicas',
    category: 'Ingress/Routing',
    stage: 'Part 2',
    lessonId: 'm07-l01',
    possibleCauses: [
      'ใน Deployment manifest ลืมใส่ replicas: 3 หรือใส่ผิดที่ (ต้องอยู่ใต้ spec ของ Deployment ไม่ใช่อยู่ใน template)',
      'ทรัพยากรเครื่องไม่พอ ทำให้ Pod ที่ 2 และ 3 ค้างสถานะ Pending'
    ],
    verification: 'รัน kubectl describe deployment app2 และ kubectl get pods -l app=app2',
    fix: 'แก้ spec.replicas: 3 ใน Deployment manifest แล้วรัน kubectl apply -f confs/app2.yaml หรือรัน kubectl scale deployment app2 --replicas=3'
  },
  {
    id: 'tb-08',
    symptom: 'ยิง curl http://localhost:8888/ ใน Part 3 แล้วเจอ Connection Refused',
    category: 'K3d/Docker',
    stage: 'Part 3',
    lessonId: 'm09-l02',
    possibleCauses: [
      'ตอนสร้างคลัสเตอร์ K3d ลืม map port -p 8888:8888@loadbalancer',
      'Service ใน dev namespace ไม่ได้ expose พอร์ต 8888 หรือ Pod ยังไม่พร้อม'
    ],
    verification: 'รัน docker ps ดูพอร์ตของ container k3d-*-serverlb ว่ามีการ map 0.0.0.0:8888->8888 หรือไม่ และตรวจ kubectl get svc -n dev',
    fix: 'สร้างคลัสเตอร์ K3d ด้วย k3d cluster create mycluster --port "8888:8888@loadbalancer" และตรวจสอบว่า Service ใน dev ชนิด NodePort/LoadBalancer รับพอร์ต 8888 ตรงกัน'
  },
  {
    id: 'tb-09',
    symptom: 'Argo CD Application ขึ้นสถานะ OutOfSync หรือ Synced: False ตลอดเวลา',
    category: 'ArgoCD/Git',
    stage: 'Part 3',
    lessonId: 'm10-l02',
    possibleCauses: [
      'ชื่อ targetRevision ใน Application ไม่ตรงกับ branch บน GitHub (เช่น ระบุ master แต่ GitHub ใช้ชื่อ main)',
      'path ใน repository ระบุผิดโฟลเดอร์',
      'Manifest ใน Git มี syntax error หรือ API version เก่าเกินไป'
    ],
    verification: 'รัน argocd app get <app-name> หรือดูที่หน้าเว็บ UI ของ Argo CD ดู error message สีแดง',
    fix: 'ตรวจสอบ branch บน GitHub ให้แน่ชัดว่าชื่อ main หรือ master แล้วแก้ targetRevision ให้ตรงกัน'
  },
  {
    id: 'tb-10',
    symptom: 'หลัง git push อัปเดต v2 แล้ว Argo CD ไม่ยอมอัปเดตแอป ต้องรอนานมาก',
    category: 'ArgoCD/Git',
    stage: 'Part 3',
    lessonId: 'm10-l02',
    possibleCauses: [
      'Argo CD มีรอบการ Reconcile ตรวจจับ Git ตามรอบเริ่มต้นทุกๆ 3 นาที (180 วินาที) หากไม่ได้ติดตั้ง Webhook'
    ],
    verification: 'ดูเวลาที่ commit push กับเวลาที่ Argo CD ตรวจพบ',
    fix: 'ในการสอบ Defense แนะนำให้รัน argocd app sync <app-name> หรือกดปุ่ม Sync ใน Web UI เพื่อบังคับ sync ทันที หรือตั้งค่า timeout.reconciliation ใน argocd-cm ให้สั้นลง'
  },
  {
    id: 'tb-11',
    symptom: 'Argo CD ไม่สามารถดึง Repo จาก Local GitLab ได้ (Failed to connect to repository)',
    category: 'GitLab/Storage',
    stage: 'Bonus',
    lessonId: 'm13-l02',
    possibleCauses: [
      'DNS ภายในคลัสเตอร์ไม่สามารถ resolve ชื่อโดเมนภายนอกของ GitLab ได้',
      'URL ของ repo เป็น HTTPS แต่ไม่ได้ตั้งค่าใบรับรอง (Self-signed cert)',
      'GitLab HTTP redirect ไปยัง URL ภายนอกที่ไม่มีอยู่จริง'
    ],
    verification: 'เข้าไปใน pod argocd-repo-server แล้วทดสอบ git clone ด้วยคำสั่ง kubectl exec -it deploy/argocd-repo-server -n argocd -- git clone <url>',
    fix: 'ใช้ CoreDNS ConfigMap เพิ่ม hosts mapping สำหรับ gitlab.local หรือใช้ Service DNS ภายใน เช่น http://gitlab-webservice-default.gitlab.svc.cluster.local:8181/...'
  },
  {
    id: 'tb-12',
    symptom: 'GitLab Pod พังและดับด้วย Exit Code 137 (OOMKilled)',
    category: 'GitLab/Storage',
    stage: 'Bonus',
    lessonId: 'm13-l01',
    possibleCauses: [
      'GitLab มีความต้องการทรัพยากรสูงมาก (ค่าเริ่มต้นกินแรม 4GB-8GB) เมื่อรันบน VM ที่มีแรมน้อย เคอร์เนลจะยิง SIGKILL (137) ทันที'
    ],
    verification: 'รัน kubectl describe pod <gitlab-pod> -n gitlab สังเกตดู Last State: Terminated Reason: OOMKilled Exit Code: 137',
    fix: 'เพิ่ม RAM ของ VM หลักเป็น 8GB ขึ้นไป, เปิด swap เพิ่มเติม 4GB, และปิด service เสริมที่ไม่จำเป็นของ GitLab ใน values.yaml (เช่น gitlab-runner, prometheus, grafana)'
  }
];
