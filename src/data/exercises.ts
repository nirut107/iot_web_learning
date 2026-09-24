import { Exercise } from '@/types/curriculum';

export const exercisesData: Exercise[] = [
  {
    id: 'ex-m00-01',
    lessonId: 'm00-l01',
    title: 'ตรวจสอบ Virtualization Support และแยกเลเยอร์ของระบบ',
    goal: 'ยืนยันว่าเครื่อง VM หลักรองรับการรัน K3d / Docker และตรวจสอบการแยกชั้นระบบ',
    prerequisites: ['เข้าสู่ terminal ของ Linux VM หลัก'],
    executionContext: 'Terminal ของ VM หลัก (Ubuntu 22.04 หรือ Debian 12)',
    steps: [
      {
        stepNumber: 1,
        instruction: 'ตรวจสอบว่า CPU รองรับ Virtualization extensions (VT-x/AMD-V) หรือไม่',
        command: 'egrep -c "(vmx|svm)" /proc/cpuinfo',
        explanation: 'หากค่ามากกว่า 0 แสดงว่า CPU มีการส่งต่อคำสั่ง virtualization'
      },
      {
        stepNumber: 2,
        instruction: 'ตรวจสอบสถาปัตยกรรม CPU และหน่วยความจำทั้งหมด',
        command: 'lscpu | grep "Architecture\\|Model name\\|CPU(s):" && free -h',
        explanation: 'ยืนยันว่าเป็น x86_64 และมี RAM เพียงพอตามแผน'
      }
    ],
    expectedResult: 'แสดงจำนวน core มากกว่า 0 และ RAM ไม่น้อยกว่า 4GB-8GB สำหรับการทำ lab',
    verification: 'สามารถรันคำสั่ง lscpu และ free -h สำเร็จโดยเห็นทรัพยากรตรงตามสเปก',
    cleanup: 'ไม่ต้องล้างข้อมูล',
    troubleshooting: 'หากค่า vmx/svm เป็น 0 ให้เปิด Nested Virtualization ในโปรแกรม VirtualBox หรือไฮเปอร์ไวเซอร์ของเครื่องโฮสต์'
  },
  {
    id: 'ex-m00-02',
    lessonId: 'm00-l02',
    title: 'ตรวจสอบ Network Interfaces และวางผัง IP 192.168.56.x',
    goal: 'ทำความเข้าใจ interface จริงใน Linux และเตรียม Network Plan ตามโจทย์',
    prerequisites: ['เข้าสู่ terminal ของ VM หลัก'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'ตรวจสอบรายชื่อ network interface ทั้งหมดที่ระบบมองเห็น',
        command: 'ip -br a',
        explanation: 'ดูชื่อ interface เช่น enp0s3, enp0s8, eth0, eth1'
      },
      {
        stepNumber: 2,
        instruction: 'ทดสอบเส้นทาง default route ของเครื่อง',
        command: 'ip route show default',
        explanation: 'ระบุว่า interface ตัวใดทำหน้าที่เชื่อมต่ออินเทอร์เน็ตออกสู่ภายนอก'
      }
    ],
    expectedResult: 'เห็นรายชื่อ interfaces ชัดเจนและรู้ว่า interface ใดเป็น NAT และใดจะใช้เป็น Host-Only',
    verification: 'สามารถระบุชื่อ interface ที่จะใช้สำหรับวง 192.168.56.0/24 ได้อย่างถูกต้อง',
    troubleshooting: 'หากมีเฉพาะ loopback ให้ตรวจสอบ Virtual Network Adapter ในการตั้งค่า VM'
  },
  {
    id: 'ex-m01-01',
    lessonId: 'm01-l01',
    title: 'จัดการสิทธิ์ Linux Filesystem และการตรวจสถานะ Systemd Service',
    goal: 'ฝึกใช้คำสั่ง chmod, chown, และ systemctl ตรวจสอบ daemon',
    prerequisites: ['มีสิทธิ์ sudo บนเครื่อง VM'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'สร้างโฟลเดอร์สำหรับทดสอบ และตั้งค่าสิทธิ์ให้ปลอดภัย',
        command: 'mkdir -p /tmp/iot-test && chmod 700 /tmp/iot-test && ls -ld /tmp/iot-test',
        explanation: 'สิทธิ์ 700 อนุญาตเฉพาะเจ้าของโฟลเดอร์เท่านั้น'
      },
      {
        stepNumber: 2,
        instruction: 'ตรวจสอบสถานะของ sshd service และดู log ล่าสุด',
        command: 'systemctl is-active ssh || systemctl is-active sshd',
        explanation: 'ผลลัพธ์ควรขึ้นว่า active'
      }
    ],
    expectedResult: 'โฟลเดอร์ /tmp/iot-test มีสิทธิ์ drwx------ และ ssh service มีสถานะ active',
    verification: 'รันคำสั่งสำเร็จโดยไม่มี permission denied',
    cleanup: 'rm -rf /tmp/iot-test',
    troubleshooting: 'หาก ssh ไม่ active ให้รัน sudo systemctl start ssh'
  },
  {
    id: 'ex-m01-02',
    lessonId: 'm01-l02',
    title: 'เขียน Bash Automation Script แบบ Idempotent พร้อม Heredoc',
    goal: 'สร้างสคริปต์ provisioning ที่สามารถรันซ้ำได้โดยไม่พัง',
    prerequisites: ['ความเข้าใจ Bash scripting ขั้นพื้นฐาน'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'เขียนสคริปต์ทดสอบ idempotency ด้วย heredoc',
        command: `cat << 'EOF' > /tmp/idempotent_test.sh
#!/bin/bash
set -euo pipefail
TARGET_FILE="/tmp/iot_test_config.conf"
if grep -q "CONFIG_INIT=done" "$TARGET_FILE" 2>/dev/null; then
    echo "Configuration already applied, skipping."
else
    echo "CONFIG_INIT=done" >> "$TARGET_FILE"
    echo "Configuration added."
fi
EOF
chmod +x /tmp/idempotent_test.sh`,
        explanation: 'ใช้ set -euo pipefail และเช็ก grep ก่อนเขียนไฟล์เสมอ'
      },
      {
        stepNumber: 2,
        instruction: 'ทดสอบรันสคริปต์ 2 ครั้งติดต่อกัน',
        command: '/tmp/idempotent_test.sh && /tmp/idempotent_test.sh',
        explanation: 'ครั้งแรกรันจะบอก Configuration added, ครั้งที่สองจะบอก already applied, skipping'
      }
    ],
    expectedResult: 'การรันครั้งที่สองข้ามการทำงานโดยไม่เกิด error',
    verification: 'ตรวจดูเนื้อหา /tmp/iot_test_config.conf มีข้อความเพียง 1 บรรทัด',
    cleanup: 'rm -f /tmp/idempotent_test.sh /tmp/iot_test_config.conf',
    troubleshooting: 'หากมี error syntax ให้ตรวจสอบ EOF ว่าไม่มีช่องว่างนำหน้า'
  },
  {
    id: 'ex-m02-01',
    lessonId: 'm02-l01',
    title: 'ทดสอบการส่ง Host Header ด้วย curl โดยไม่ต้องแก้ /etc/hosts',
    goal: 'เข้าใจว่า HTTP Host Header ส่งผลต่อการทำ Virtual Host และ Ingress อย่างไร',
    prerequisites: ['ติดตั้ง curl เรียบร้อยแล้ว'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'ทดสอบยิง HTTP Request แบบระบุ Host Header ไปยังปลายทาง',
        command: 'curl -sI -H "Host: app1.com" http://httpbin.org/get || curl -sI https://www.google.com',
        explanation: 'curl จะส่งแพ็กเก็ตไปที่ IP ปลายทาง แต่ใส่ฟิลด์ Host: app1.com ใน Header HTTP'
      }
    ],
    expectedResult: 'curl สามารถส่ง Request สำเร็จและได้รับการตอบกลับ HTTP status 200 หรือตามที่เซิร์ฟเวอร์กำหนด',
    verification: 'เข้าใจความแตกต่างระหว่าง DNS resolution กับ HTTP Host Header',
    troubleshooting: 'หากต่ออินเทอร์เน็ตไม่ได้ ให้ตรวจสอบการเชื่อมต่อ NAT'
  },
  {
    id: 'ex-m02-02',
    lessonId: 'm02-l02',
    title: 'สร้างและตั้งค่า Passwordless SSH Key Pair',
    goal: 'ฝึกฝนการสร้าง SSH Key และคอนฟิก authorized_keys ให้เชื่อมต่อได้โดยไม่ถาม password',
    prerequisites: ['ติดตั้ง OpenSSH client และ server'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'สร้าง SSH Key แบบ ed25519 โดยไม่มีรหัสผ่านกำกับ (Passphrase ว่าง)',
        command: 'ssh-keygen -t ed25519 -N "" -f /tmp/test_id_ed25519',
        explanation: 'ได้ไฟล์ private key /tmp/test_id_ed25519 และ public key .pub'
      },
      {
        stepNumber: 2,
        instruction: 'ใส่ public key ลงใน authorized_keys ของผู้ใช้ปัจจุบัน',
        command: 'mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat /tmp/test_id_ed25519.pub >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys',
        explanation: 'สิทธิ์ของ authorized_keys ต้องเป็น 600 เสมอ'
      },
      {
        stepNumber: 3,
        instruction: 'ทดสอบ SSH เข้า localhost ด้วย key ที่เพิ่งสร้าง',
        command: 'ssh -i /tmp/test_id_ed25519 -o StrictHostKeyChecking=no localhost "echo SSH connection successful!"',
        explanation: 'ต้องล็อกอินผ่านทันทีและพิมพ์ข้อความสำเร็จ'
      }
    ],
    expectedResult: 'พิมพ์ข้อความ "SSH connection successful!" โดยไม่มีการถาม password',
    verification: 'ยืนยันว่าการทดสอบ SSH สำเร็จสมบูรณ์',
    cleanup: 'rm -f /tmp/test_id_ed25519*',
    troubleshooting: 'หากยังถาม password ให้ตรวจสอบว่า sshd_config อนุญาต PubkeyAuthentication yes'
  },
  {
    id: 'ex-m03-01',
    lessonId: 'm03-l01',
    title: 'สร้าง Vagrantfile เครื่องเดี่ยว และสำรวจวงจรชีวิต (Lifecycle)',
    goal: 'เข้าใจคำสั่ง vagrant init, up, ssh, halt, destroy',
    prerequisites: ['ติดตั้ง Vagrant และ VirtualBox บนเครื่อง VM หรือโฮสต์'],
    executionContext: 'Terminal ในโฟลเดอร์สำหรับทำแล็บ',
    steps: [
      {
        stepNumber: 1,
        instruction: 'สร้างโฟลเดอร์แล็บและเขียน Vagrantfile ตัวอย่าง',
        command: `mkdir -p /tmp/vagrant-demo && cd /tmp/vagrant-demo
cat << 'EOF' > Vagrantfile
Vagrant.configure("2") do |config|
  config.vm.box = "generic/debian12"
  config.vm.hostname = "demo-vm"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
    vb.cpus = 1
  end
end
EOF`,
        explanation: 'โครงสร้างพื้นฐานของ Vagrantfile'
      }
    ],
    expectedResult: 'มีไฟล์ Vagrantfile ที่พร้อมสั่ง vagrant up',
    verification: 'รัน vagrant validate เพื่อตรวจดูความถูกต้องของไวยากรณ์',
    cleanup: 'rm -rf /tmp/vagrant-demo',
    troubleshooting: 'หาก vagrant validate ฟ้อง syntax error ให้ตรวจดูไวยากรณ์ Ruby'
  },
  {
    id: 'ex-m03-02',
    lessonId: 'm03-l02',
    title: 'เขียน Multi-machine Vagrantfile 2 เครื่องพร้อม Private Network',
    goal: 'สร้างโครงสร้างโค้ดสำหรับ Server (.110) และ ServerWorker (.111) ตามโจทย์ Part 1',
    prerequisites: ['ความเข้าใจ Vagrant Multi-machine scope'],
    executionContext: 'โฟลเดอร์สำหรับทำแล็บ',
    steps: [
      {
        stepNumber: 1,
        instruction: 'เขียน Vagrantfile ที่นิยาม 2 เครื่องพร้อมกัน',
        command: `mkdir -p /tmp/vagrant-p1-demo && cd /tmp/vagrant-p1-demo
cat << 'EOF' > Vagrantfile
Vagrant.configure("2") do |config|
  config.vm.box = "generic/debian12"

  config.vm.define "wilS" do |server|
    server.vm.hostname = "wilS"
    server.vm.network "private_network", ip: "192.168.56.110"
    server.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 1
    end
  end

  config.vm.define "wilSW" do |worker|
    worker.vm.hostname = "wilSW"
    worker.vm.network "private_network", ip: "192.168.56.111"
    worker.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 1
    end
  end
end
EOF`,
        explanation: 'ใช้ config.vm.define แยกเครื่อง Server และ ServerWorker ชัดเจน'
      }
    ],
    expectedResult: 'Vagrantfile ถูกต้องตามมาตรฐาน multi-machine',
    verification: 'รัน vagrant validate สำเร็จ',
    cleanup: 'rm -rf /tmp/vagrant-p1-demo',
    troubleshooting: 'ตรวจสอบการปิด block do |...| ... end ให้ครบทุกระดับ'
  },
  {
    id: 'ex-m04-01',
    lessonId: 'm04-l01',
    title: 'รัน Docker Container สำรวจ Linux Namespaces และ Cgroups',
    goal: 'เห็นภาพว่าคอนเทนเนอร์เป็นเพียงโปรเซสธรรมดาที่ถูกกักบริเวณด้วยเคอร์เนล',
    prerequisites: ['ติดตั้ง Docker เรียบร้อยแล้ว'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'รันคอนเทนเนอร์ nginx ชั่วคราวในเบื้องหลัง',
        command: 'docker run -d --name test-box -p 8080:80 nginx:alpine',
        explanation: 'รัน nginx และ map พอร์ต 8080 ของโฮสต์เข้าพอร์ต 80 ของคอนเทนเนอร์'
      },
      {
        stepNumber: 2,
        instruction: 'ตรวจสอบโปรเซสจริงบนเครื่องโฮสต์ผ่าน ps',
        command: 'docker top test-box',
        explanation: 'จะเห็น PID ของโปรเซส nginx ที่รันอยู่จริงบนเคอร์เนลของเครื่องหลัก'
      }
    ],
    expectedResult: 'เห็นโปรเซส nginx กำลังทำงาน และยิง curl http://localhost:8080 ได้รับหน้าต้อนรับของ Nginx',
    verification: 'curl -I http://localhost:8080 คืนค่า HTTP 200 OK',
    cleanup: 'docker rm -f test-box',
    troubleshooting: 'หากพอร์ต 8080 ชน ให้เปลี่ยนเป็นพอร์ตอื่น เช่น 8081'
  },
  {
    id: 'ex-m04-02',
    lessonId: 'm04-l02',
    title: 'เขียน Dockerfile สร้าง Web App สองเวอร์ชัน (v1 / v2)',
    goal: 'เข้าใจขั้นตอนการเขียน Dockerfile, Build, และ Tagging v1/v2',
    prerequisites: ['ความเข้าใจคำสั่ง Docker build'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'สร้าง Dockerfile สำหรับแอปพลิเคชันเวอร์ชัน 1',
        command: `mkdir -p /tmp/my-app && cd /tmp/my-app
cat << 'EOF' > Dockerfile
FROM alpine:latest
RUN apk add --no-cache python3
WORKDIR /app
ARG APP_VERSION=v1
RUN echo "{\"status\":\"ok\", \"message\": \"$APP_VERSION\"}" > index.html
EXPOSE 8888
CMD ["python3", "-m", "http.server", "8888"]
EOF`,
        explanation: 'สร้างเว็บเซิร์ฟเวอร์แบบเบาหวิวที่ส่งกลับ JSON ระบุเวอร์ชันตามพอร์ต 8888'
      },
      {
        stepNumber: 2,
        instruction: 'Build image พร้อมแท็ก v1 และ v2',
        command: 'docker build --build-arg APP_VERSION=v1 -t myapp:v1 /tmp/my-app && docker build --build-arg APP_VERSION=v2 -t myapp:v2 /tmp/my-app',
        explanation: 'สร้าง image สองชุดที่มีความต่างของเนื้อหาชัดเจน'
      }
    ],
    expectedResult: 'มี Docker images myapp:v1 และ myapp:v2 ปรากฏใน docker images',
    verification: 'รัน docker images | grep myapp เห็นทั้งสองแท็ก',
    cleanup: 'docker rmi -f myapp:v1 myapp:v2 && rm -rf /tmp/my-app',
    troubleshooting: 'หาก apk add ช้า ให้ตรวจอินเทอร์เน็ตของโฮสต์'
  },
  {
    id: 'ex-m05-01',
    lessonId: 'm05-l01',
    title: 'สำรวจ Kubernetes Cluster Info และ Kubeconfig Context',
    goal: 'ทำความคุ้นเคยกับคำสั่ง kubectl และการตรวจสอบการเชื่อมต่อไปยัง API Server',
    prerequisites: ['ติดตั้ง kubectl แล้ว'],
    executionContext: 'เครื่องที่มีสิทธิ์ติดต่อ Kubernetes cluster',
    steps: [
      {
        stepNumber: 1,
        instruction: 'ตรวจสอบเวอร์ชันของ client และ cluster info',
        command: 'kubectl version --client && kubectl cluster-info',
        explanation: 'แสดงที่อยู่ของ Kubernetes Control Plane'
      }
    ],
    expectedResult: 'แสดง Kubernetes control plane running at ...',
    verification: 'kubectl สามารถสื่อสารกับ API server ได้ปกติ',
    troubleshooting: 'หาก connection refused ให้ตรวจสอบว่า k3s service รันอยู่หรือไม่'
  },
  {
    id: 'ex-m05-02',
    lessonId: 'm05-l02',
    title: 'สร้าง Declarative YAML Manifest สำหรับ Pod และ Deployment',
    goal: 'เขียนไฟล์ YAML ที่ถูกต้องตามหลัก API version, metadata, และ spec',
    prerequisites: ['ความเข้าใจเรื่อง YAML syntax และ Label Selectors'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'เขียน manifest ตัวอย่างสำหรับ Deployment',
        command: `cat << 'EOF' > /tmp/sample-deploy.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-deploy
  labels:
    app: demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: demo
  template:
    metadata:
      labels:
        app: demo
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80
EOF`,
        explanation: 'มี selector.matchLabels ที่ตรงกับ template.metadata.labels'
      }
    ],
    expectedResult: 'ได้ไฟล์ YAML ที่ถูกต้องตามโครงสร้างของ Kubernetes',
    verification: 'สามารถรัน kubectl apply --dry-run=client -f /tmp/sample-deploy.yaml สำเร็จ',
    cleanup: 'rm -f /tmp/sample-deploy.yaml',
    troubleshooting: 'ระวังเรื่องการเว้นวรรค 2 spaces ห้ามใช้ tab ในไฟล์ YAML'
  },
  {
    id: 'ex-m06-01',
    lessonId: 'm06-l01',
    title: 'ติดตั้ง K3s Server บน wilS และดึง Node Token',
    goal: 'ติดตั้ง K3s Server โหมดพร้อมกำหนด node-ip และ flannel interface',
    prerequisites: ['เครื่อง VM Server (wilS) พร้อมทำงานที่ IP 192.168.56.110'],
    executionContext: 'Vagrant guest wilS (192.168.56.110)',
    steps: [
      {
        stepNumber: 1,
        instruction: 'ติดตั้ง K3s Server แบบระบุ node-ip และ flannel interface',
        command: 'curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--node-ip=192.168.56.110 --flannel-iface=eth1 --write-kubeconfig-mode 644" sh -',
        explanation: 'ผูกกับ IP 192.168.56.110 และ interface eth1 ปรับสิทธิ์ kubeconfig ให้ผู้ใช้ทั่วไปอ่านได้'
      },
      {
        stepNumber: 2,
        instruction: 'ดึง Node Token สำหรับให้ Agent นำไปเชื่อมต่อ',
        command: 'cat /var/lib/rancher/k3s/server/node-token',
        explanation: 'โทเค็นลับสำหรับใช้จอยคลัสเตอร์'
      }
    ],
    expectedResult: 'k3s service รันสถานะ active และได้ node token เริ่มต้นด้วย K10...',
    verification: 'รัน kubectl get nodes แสดงโหนด wilS สถานะ Ready',
    troubleshooting: 'หากชื่อ interface ไม่ใช่ eth1 ให้ใช้คำสั่ง ip a ตรวจหาชื่อจริง เช่น enp0s8'
  },
  {
    id: 'ex-m06-02',
    lessonId: 'm06-l02',
    title: 'เชื่อมต่อ K3s Agent บน wilSW เข้ากับ Server',
    goal: 'เชื่อมโหนดที่สอง (Agent) เข้าสู่คลัสเตอร์ และตรวจสอบสถานะ 2 โหนด',
    prerequisites: ['Server wilS รันพร้อมแล้ว และมี Node Token'],
    executionContext: 'Vagrant guest wilSW (192.168.56.111)',
    steps: [
      {
        stepNumber: 1,
        instruction: 'รันสคริปต์ติดตั้ง K3s ในโหมด Agent โดยส่ง URL และ Token ของ Server',
        command: 'curl -sfL https://get.k3s.io | K3S_URL=https://192.168.56.110:6443 K3S_TOKEN="<SERVER_TOKEN>" INSTALL_K3S_EXEC="--node-ip=192.168.56.111 --flannel-iface=eth1" sh -',
        explanation: 'ชี้ Agent เข้าหาพอร์ต 6443 ของ Server'
      },
      {
        stepNumber: 2,
        instruction: 'กลับมาที่เครื่อง Server แล้วตรวจสอบรายชื่อโหนดในคลัสเตอร์',
        command: 'kubectl get nodes -o wide',
        explanation: 'ต้องเห็น wilS และ wilSW สถานะ Ready ทั้งคู่'
      }
    ],
    expectedResult: 'kubectl get nodes แสดงทั้ง 2 โหนด และ INTERNAL-IP เป็น .110 และ .111',
    verification: 'ทั้งสองโหนดสถานะ Ready และไม่มี CrashLoopBackOff',
    troubleshooting: 'หาก Agent ไม่เชื่อมต่อ ให้ทดสอบ curl -k https://192.168.56.110:6443 จาก wilSW'
  },
  {
    id: 'ex-m07-01',
    lessonId: 'm07-l01',
    title: 'สร้าง Deployment app2 จำนวน 3 Replicas และทดสอบ Self-Healing',
    goal: 'สร้างแอปพลิเคชัน 3 สำเนาตามโจทย์ Part 2 และทดสอบการสร้าง Pod แทนที่เมื่อ Pod ดับ',
    prerequisites: ['คลัสเตอร์ K3s พร้อมใช้งาน'],
    executionContext: 'Vagrant guest wilS (Part 2 VM)',
    steps: [
      {
        stepNumber: 1,
        instruction: 'สร้าง Deployment app2 ที่มี 3 replicas',
        command: `cat << 'EOF' | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app2
  labels:
    app: app2
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app2
  template:
    metadata:
      labels:
        app: app2
    spec:
      containers:
      - name: app2
        image: nginx:alpine
        ports:
        - containerPort: 80
EOF`,
        explanation: 'กำหนด replicas: 3'
      },
      {
        stepNumber: 2,
        instruction: 'ลบ Pod ตัวหนึ่งทิ้งสดๆ แล้วดูการสร้างตัวใหม่ทดแทน',
        command: 'POD_NAME=$(kubectl get pods -l app=app2 -o jsonpath="{.items[0].metadata.name}") && kubectl delete pod $POD_NAME && kubectl get pods -l app=app2',
        explanation: 'ReplicaSet จะสร้าง Pod ใหม่ขึ้นมาแทนที่ทันทีเพื่อให้ครบ 3 replicas เสมอ'
      }
    ],
    expectedResult: 'มี 3 Pods กำลังทำงานในสถานะ Running ตลอดเวลา',
    verification: 'kubectl get deployment app2 แสดง READY 3/3',
    troubleshooting: 'หาก Pod ค้าง Pending ให้ตรวจสอบ memory ของ VM'
  },
  {
    id: 'ex-m07-02',
    lessonId: 'm07-l02',
    title: 'สร้าง ClusterIP Service และทดสอบการกระจายโหลดผ่าน EndpointSlices',
    goal: 'ผูก Service เข้ากับ Pods ด้วย Label Selector และทดสอบเรียกใช้งานภายใน',
    prerequisites: ['มี Deployment app2 รันอยู่แล้ว'],
    executionContext: 'Vagrant guest wilS',
    steps: [
      {
        stepNumber: 1,
        instruction: 'สร้าง Service สำหรับ app2',
        command: `cat << 'EOF' | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: app2-service
spec:
  selector:
    app: app2
  ports:
  - port: 80
    targetPort: 80
EOF`,
        explanation: 'สร้าง ClusterIP Service พอร์ต 80 ชี้ไปยัง containerPort 80 ของ app2'
      },
      {
        stepNumber: 2,
        instruction: 'ตรวจสอบ Endpoints ที่ Service ผูกอยู่',
        command: 'kubectl get endpoints app2-service',
        explanation: 'ต้องเห็น IP ของ Pod ทั้ง 3 ตัวในรายการ Endpoints'
      }
    ],
    expectedResult: 'เห็น Endpoints ชี้ไปยัง 3 Pod IPs',
    verification: 'kubectl describe svc app2-service แสดง Endpoints ถูกต้องครบ 3 ตัว',
    troubleshooting: 'หาก Endpoints ว่างเปล่า ให้เช็กว่า selector ของ Service ตรงกับ labels ของ Pod หรือไม่'
  },
  {
    id: 'ex-m08-01',
    lessonId: 'm08-l01',
    title: 'สำรวจ Traefik Ingress Controller ใน K3s',
    goal: 'ทำความเข้าใจว่า Traefik ทำหน้าที่เป็น Ingress Controller และรับทราฟฟิกอย่างไร',
    prerequisites: ['K3s server ที่ไม่ได้ปิด traefik'],
    executionContext: 'Vagrant guest wilS',
    steps: [
      {
        stepNumber: 1,
        instruction: 'ตรวจสอบ Pod และ Service ของ Traefik Ingress Controller',
        command: 'kubectl get pods,svc -n kube-system -l app.kubernetes.io/name=traefik',
        explanation: 'Traefik จะถูกรันใน kube-system และมี ServiceLB คอยเปิดพอร์ต 80 และ 443'
      }
    ],
    expectedResult: 'พบ Pod traefik สถานะ Running และ Service traefik ชนิด LoadBalancer',
    verification: 'curl -I http://127.0.0.1/ ได้รับ HTTP status 404 (จาก Traefik default backend)',
    troubleshooting: 'หากไม่พบ traefik ให้ตรวจสอบว่าไม่ได้ส่งแฟล็ก --disable=traefik ตอนลง k3s'
  },
  {
    id: 'ex-m08-02',
    lessonId: 'm08-l02',
    title: 'ตั้งค่า Ingress Routing สำหรับ Part 2: app1.com, app2.com และ app3 Fallback',
    goal: 'เขียน Ingress manifest ที่ตรงตามข้อกำหนดของโจทย์ Part 2 ทั้งหมด',
    prerequisites: ['มี app1, app2 (3 replicas), และ app3 service พร้อมรัน'],
    executionContext: 'Vagrant guest wilS (192.168.56.110)',
    steps: [
      {
        stepNumber: 1,
        instruction: 'เขียน Ingress Manifest พร้อม defaultBackend และ Host rules',
        command: `cat << 'EOF' | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  defaultBackend:
    service:
      name: app3-service
      port:
        number: 80
  rules:
  - host: app1.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app1-service
            port:
              number: 80
  - host: app2.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app2-service
            port:
              number: 80
EOF`,
        explanation: 'กำหนด defaultBackend ชี้ไปยัง app3-service สำหรับ request ที่ไม่ตรงกับ host ใด'
      },
      {
        stepNumber: 2,
        instruction: 'ทดสอบ curl ทั้ง 3 กรณี',
        command: 'curl -H "Host: app1.com" http://192.168.56.110/ && curl -H "Host: app2.com" http://192.168.56.110/ && curl http://192.168.56.110/',
        explanation: 'ทดสอบเข้า app1.com, app2.com, และเข้าผ่าน IP ตรงเพื่อดู fallback ไป app3'
      }
    ],
    expectedResult: 'app1.com ตอบกลับ app1, app2.com ตอบกลับ app2, และ IP ตรงตอบกลับ app3',
    verification: 'ครบทั้ง 3 เงื่อนไขและสามารถอธิบาย Ingress YAML ตอนสอบได้',
    troubleshooting: 'หาก IP ตรงได้ 404 ให้ตรวจสอบ defaultBackend ของ Ingress'
  },
  {
    id: 'ex-m09-01',
    lessonId: 'm09-l01',
    title: 'ติดตั้ง K3d และสร้างคลัสเตอร์บน Docker ใน VM หลัก',
    goal: 'สร้างคลัสเตอร์ K3d ภายใน VM หลักโดยไม่ใช้ Vagrant ตามโจทย์ Part 3',
    prerequisites: ['ติดตั้ง Docker บน VM หลักเรียบร้อยแล้ว'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'ดาวน์โหลดและติดตั้ง K3d CLI',
        command: 'curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash && k3d version',
        explanation: 'ติดตั้ง k3d binary'
      },
      {
        stepNumber: 2,
        instruction: 'สร้างคลัสเตอร์ K3d พร้อม map พอร์ต 8888 สำหรับแอปพลิเคชัน',
        command: 'k3d cluster create iot-cluster --port "8888:8888@loadbalancer"',
        explanation: 'สร้างคลัสเตอร์และแมปพอร์ต 8888 จากเครื่องโฮสต์เข้าสู่ k3d-serverlb container'
      }
    ],
    expectedResult: 'คลัสเตอร์ถูกสร้างเสร็จ และ kubectl get nodes แสดงโหนด k3d-iot-cluster-server-0 สถานะ Ready',
    verification: 'รัน k3d cluster list แสดงคลัสเตอร์ iot-cluster มี 1 server container',
    cleanup: 'k3d cluster delete iot-cluster',
    troubleshooting: 'หาก permission denied ให้ใส่ user ใน docker group: sudo usermod -aG docker $USER && newgrp docker'
  },
  {
    id: 'ex-m09-02',
    lessonId: 'm09-l02',
    title: 'ทดสอบ Port Forwarding และ Exposing Services ใน K3d',
    goal: 'ทดสอบว่าคำขอมายัง http://localhost:8888 สามารถวิ่งทะลุเข้าสู่ Pod ภายในได้',
    prerequisites: ['คลัสเตอร์ K3d รันอยู่พร้อมพอร์ต 8888 mapped'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'สร้าง Pod ทดสอบที่ฟังพอร์ต 8888 และสร้าง NodePort/LoadBalancer Service',
        command: `kubectl create deployment test-app --image=wil42/playground:v1
kubectl expose deployment test-app --port=8888 --target-port=8888 --type=LoadBalancer`,
        explanation: 'สร้าง service ชนิด LoadBalancer เพื่อให้ k3d serverlb รับพอร์ต 8888'
      },
      {
        stepNumber: 2,
        instruction: 'ทดสอบยิง curl ไปยัง localhost:8888',
        command: 'curl http://localhost:8888/',
        explanation: 'ทดสอบการเข้าถึงจากภายนอกคลัสเตอร์'
      }
    ],
    expectedResult: 'ได้รับ response {"status":"ok", "message": "v1"}',
    verification: 'curl สำเร็จโดยไม่ต้องทำ kubectl port-forward',
    cleanup: 'kubectl delete deployment test-app && kubectl delete svc test-app',
    troubleshooting: 'หาก connection refused ให้ตรวจสอบ docker ps ว่ามี 0.0.0.0:8888->8888 หรือไม่'
  },
  {
    id: 'ex-m10-01',
    lessonId: 'm10-l01',
    title: 'ติดตั้ง Argo CD ลงใน Namespace argocd',
    goal: 'ติดตั้งและตรวจสอบสุขภาพของ Argo CD components ในคลัสเตอร์ K3d',
    prerequisites: ['คลัสเตอร์ K3d พร้อมใช้งาน'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'สร้าง namespace argocd และติดตั้ง Argo CD stable manifest',
        command: `kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml`,
        explanation: 'ติดตั้ง Argo CD controllers, repo-server, server, redis, dex'
      },
      {
        stepNumber: 2,
        instruction: 'รอให้ Pods ของ Argo CD รันพร้อมทำงานครบทั้งหมด',
        command: 'kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s',
        explanation: 'ยืนยันว่า argocd-server พร้อมรับคำสั่ง'
      }
    ],
    expectedResult: 'ทุก Pod ใน namespace argocd สถานะ Running 1/1',
    verification: 'kubectl get pods -n argocd แสดงสถานะ Running ครบทุกตัว',
    troubleshooting: 'หากดึง image ช้า ให้รอจนครบ timeout หรือตรวจ DNS'
  },
  {
    id: 'ex-m10-02',
    lessonId: 'm10-l02',
    title: 'สร้าง Argo CD Application พร้อม Auto-Sync และทดสอบ Self-Heal',
    goal: 'สร้าง Application CRD ชี้ไปยัง Git และทดสอบการทำงานของ Self-Heal เมื่อคลัสเตอร์เกิด drift',
    prerequisites: ['Argo CD ติดตั้งแล้ว และมี namespace dev'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'สร้าง namespace dev สำหรับ deploy แอปพลิเคชัน',
        command: 'kubectl create namespace dev',
        explanation: 'namespace เป้าหมายตามโจทย์ Part 3'
      },
      {
        stepNumber: 2,
        instruction: 'ประกาศ Application manifest พร้อม syncPolicy automated',
        command: `cat << 'EOF' | kubectl apply -f -
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: playground-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/<YOUR-LOGIN>-iot/iot-manifests.git'
    targetRevision: HEAD
    path: app
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: dev
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
EOF`,
        explanation: 'ตั้งค่า auto-sync, prune, และ selfHeal ให้ระบบทำงานอัตโนมัติ'
      }
    ],
    expectedResult: 'Application ถูกสร้างใน Argo CD และพร้อมทำ Reconciliation',
    verification: 'kubectl get application -n argocd แสดง playground-app',
    troubleshooting: 'ตรวจสอบ URL ของ repoURL ว่าสะกดถูกต้องและเป็น public repository'
  },
  {
    id: 'ex-m11-01',
    lessonId: 'm11-l01',
    title: 'สร้าง Public GitHub Repository พร้อม Login ในชื่อ และเตรียม Manifests',
    goal: 'จัดเตรียม Git repository และโครงสร้างไฟล์ Kubernetes ตามข้อกำหนดของโจทย์',
    prerequisites: ['มีบัญชี GitHub และสร้าง Public Repo ที่ชื่อมี login เช่น wil-iot-gitops'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'สร้างไดเรกทอรีโลคัลและเขียนไฟล์ deployment.yaml สำหรับ wil42/playground:v1',
        command: `mkdir -p /tmp/iot-repo/app && cd /tmp/iot-repo/app
cat << 'EOF' > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wil-playground
  namespace: dev
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wil-playground
  template:
    metadata:
      labels:
        app: wil-playground
    spec:
      containers:
      - name: playground
        image: wil42/playground:v1
        ports:
        - containerPort: 8888
---
apiVersion: v1
kind: Service
metadata:
  name: wil-playground-svc
  namespace: dev
spec:
  type: LoadBalancer
  selector:
    app: wil-playground
  ports:
  - port: 8888
    targetPort: 8888
EOF`,
        explanation: 'เขียน Deployment ชี้ไปที่ v1 และ Service พอร์ต 8888'
      }
    ],
    expectedResult: 'ได้ manifest ที่พร้อม push ขึ้น Public GitHub repository',
    verification: 'git push ขึ้น GitHub และเปิดดูไฟล์บนเว็บเบราว์เซอร์ได้',
    cleanup: 'rm -rf /tmp/iot-repo',
    troubleshooting: 'ตรวจสอบให้แน่ใจว่า repository บน GitHub ตั้งเป็น Public'
  },
  {
    id: 'ex-m11-02',
    lessonId: 'm11-l02',
    title: 'สาธิตแก้ Version v1 เป็น v2 บน GitHub แล้วพิสูจน์ App Update อัตโนมัติ',
    goal: 'จำลองขั้นตอนการตรวจของ Part 3: curl v1 -> git commit v2 -> push -> curl v2',
    prerequisites: ['แอป v1 กำลังรันอยู่ใน namespace dev ผ่าน Argo CD'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'ทดสอบ curl เวอร์ชันแรก',
        command: 'curl http://localhost:8888/',
        explanation: 'ต้องได้รับข้อความ "message": "v1"'
      },
      {
        stepNumber: 2,
        instruction: 'แก้ไขไฟล์ manifest ใน repo ให้เป็น image: wil42/playground:v2',
        command: "sed -i 's/playground:v1/playground:v2/g' deployment.yaml && git commit -am 'update to v2' && git push",
        explanation: 'บันทึก desired state ใหม่ขึ้น Git'
      },
      {
        stepNumber: 3,
        instruction: 'รอ Argo CD ตรวจพบและ sync หรือกด sync ใน web UI จากนั้นยิง curl ทดสอบอีกครั้ง',
        command: 'sleep 10 && curl http://localhost:8888/',
        explanation: 'ต้องได้รับข้อความ "message": "v2"'
      }
    ],
    expectedResult: 'ข้อความตอบกลับเปลี่ยนจาก v1 เป็น v2 โดยอัตโนมัติ',
    verification: 'พิสูจน์การทำงานของ GitOps Continuous Deployment สำเร็จ 100%',
    troubleshooting: 'หากยังไม่อัปเดต ให้สั่ง argocd app sync playground-app เพื่อกระตุ้น reconciliation ทันที'
  },
  {
    id: 'ex-m12-01',
    lessonId: 'm12-l01',
    title: 'สร้าง PVC ด้วย local-path StorageClass และทดสอบความคงอยู่ของข้อมูล',
    goal: 'เข้าใจการทำงานของ Persistent Storage ใน K3s/K3d และเห็นความต่างของการตายของ Pod',
    prerequisites: ['คลัสเตอร์ Kubernetes พร้อม StorageClass local-path'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'สร้าง PersistentVolumeClaim ขนาด 500Mi',
        command: `cat << 'EOF' | kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: demo-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500Mi
EOF`,
        explanation: 'ขอจัดสรรพื้นที่แบบ ReadWriteOnce'
      }
    ],
    expectedResult: 'PVC ถูกสร้างและเปลี่ยนสถานะเป็น Bound เมื่อถูกนำไปผูกกับ Pod',
    verification: 'kubectl get pvc demo-pvc แสดงสถานะ Bound',
    cleanup: 'kubectl delete pvc demo-pvc',
    troubleshooting: 'หาก PVC ขึ้น Pending ให้รอสร้าง Pod มาเรียกใช้ก่อน (Late binding)'
  },
  {
    id: 'ex-m12-02',
    lessonId: 'm12-l02',
    title: 'ติดตั้งและใช้งาน Helm CLI จัดการ Release ใน Kubernetes',
    goal: 'ฝึกใช้คำสั่ง helm repo add, search, install, upgrade, uninstall',
    prerequisites: ['ติดตั้ง Helm CLI v3+'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'เพิ่ม Bitnami Helm Repository และค้นหา Chart',
        command: 'helm repo add bitnami https://charts.bitnami.com/bitnami && helm repo update',
        explanation: 'อัปเดตดัชนีแพ็กเกจของ Helm'
      }
    ],
    expectedResult: 'Helm repo update สำเร็จพร้อมดาวน์โหลดดัชนีล่าสุด',
    verification: 'helm list แสดงรายการ release ที่ติดตั้งในคลัสเตอร์',
    troubleshooting: 'หาก helm คำสั่งไม่พบ ให้ลงไบนารีจาก helm.sh'
  },
  {
    id: 'ex-m13-01',
    lessonId: 'm13-l01',
    title: 'จัดเตรียมทรัพยากรและสร้าง Namespace gitlab สำหรับ Bonus',
    goal: 'คำนวณงบประมาณ RAM/CPU สำหรับ GitLab และสร้าง namespace แยกตามโจทย์',
    prerequisites: ['VM หลักมี RAM อย่างน้อย 6-8GB'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'สร้าง namespace gitlab',
        command: 'kubectl create namespace gitlab',
        explanation: 'namespace สำหรับรองรับโบนัสตาม subject'
      },
      {
        stepNumber: 2,
        instruction: 'ตรวจสอบ Memory usage ปัจจุบันก่อนลง GitLab',
        command: 'free -m',
        explanation: 'ต้องมีหน่วยความจำเหลือไม่น้อยกว่า 3500MB'
      }
    ],
    expectedResult: 'Namespace gitlab พร้อมใช้งาน และทรัพยากรเครื่องอยู่ในเกณฑ์ปลอดภัย',
    verification: 'kubectl get ns gitlab แสดงสถานะ Active',
    troubleshooting: 'หาก RAM เหลือน้อย ให้ปิดโปรแกรมอื่นหรือเพิ่ม swap: sudo fallocate -l 4G /swapfile'
  },
  {
    id: 'ex-m13-02',
    lessonId: 'm13-l02',
    title: 'ติดตั้ง Local GitLab และสลับท่อ GitOps ของ Argo CD ชี้สู่ภายใน',
    goal: 'ทำให้ Workflow ทั้งหมดของ Part 3 ทำงานผ่าน Local GitLab ในเครื่อง',
    prerequisites: ['Namespace gitlab สร้างแล้ว และเตรียม repo บน Local GitLab'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'ตรวจสอบ Pod ของ GitLab ใน namespace gitlab ว่ารันพร้อมทำงาน',
        command: 'kubectl get pods -n gitlab',
        explanation: 'Pods ของ webservice, gitaly, postgresql รันปกติ'
      },
      {
        stepNumber: 2,
        instruction: 'ปรับ repoURL ใน Argo CD Application ให้ชี้ไปยัง Local GitLab',
        command: 'kubectl patch application playground-app -n argocd --type="merge" -p \'{"spec":{"source":{"repoURL":"http://gitlab.gitlab.svc.cluster.local/root/iot-repo.git"}}}\'',
        explanation: 'เปลี่ยน Single Source of Truth จาก GitHub มาเป็น Local GitLab ในเครื่อง'
      }
    ],
    expectedResult: 'Argo CD เชื่อมต่อ Local GitLab สำเร็จ และแสดงสถานะ Synced',
    verification: 'แก้ manifest บน Local GitLab แล้ว push -> แอปพลิเคชันใน dev อัปเดตตามปกติ',
    troubleshooting: 'หาก Argo CD ฟ้อง authentication required ให้ใส่ credentials ใน Argo CD Repository Settings'
  },
  {
    id: 'ex-m14-01',
    lessonId: 'm14-l01',
    title: 'ฝึกซ้อม Layered Troubleshooting จากภายนอกเข้าสู่ภายใน',
    goal: 'ฝึกฝนกระบวนการไล่หาสาเหตุของปัญหาตามชั้นระบบอย่างเป็นระบบ',
    prerequisites: ['ความเข้าใจเลเยอร์ Host -> VM -> K8s -> Pod -> App'],
    executionContext: 'Terminal ของ VM หลัก',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Layer 1: ตรวจสอบสถานะ Process และ Systemd Service',
        command: 'systemctl is-active docker && systemctl is-active k3s || echo "Checked"',
        explanation: 'ตรวจดูว่า daemon หลักยังไม่ดับ'
      },
      {
        stepNumber: 2,
        instruction: 'Layer 2: ตรวจสอบโหนดและคลัสเตอร์',
        command: 'kubectl get nodes && kubectl get cs || kubectl get --raw /livez',
        explanation: 'เช็กสุขภาพของ Kubernetes Control plane'
      },
      {
        stepNumber: 3,
        instruction: 'Layer 3: ตรวจสอบ Pod และ Events',
        command: 'kubectl get pods -A --field-selector=status.phase!=Running && kubectl get events --sort-by=.metadata.creationTimestamp | tail -n 10',
        explanation: 'ดูว่ามี Pod ใดติด CrashLoopBackOff หรือ OOMKilled หรือไม่'
      }
    ],
    expectedResult: 'สามารถวิเคราะห์ปัญหาได้อย่างรวดเร็วโดยไม่ต้องเดาสุ่ม',
    verification: 'เข้าใจลำดับการตรวจเช็กทั้ง 5 ระดับอย่างแม่นยำ',
    troubleshooting: 'หากคำสั่งใดค้าง ให้ตรวจสอบการตอบสนองของเครื่องผ่าน top/htop'
  },
  {
    id: 'ex-m14-02',
    lessonId: 'm14-l02',
    title: 'ซ้อม Clean Rebuild สปีดเร็ว และตรวจความพร้อมของ Git Submission',
    goal: 'ทดสอบสร้างระบบทั้งหมดจากศูนย์เพื่อรับประกันว่าไม่มีจุดสะดุดในวันสอบ Defense',
    prerequisites: ['บันทึกโค้ดและสคริปต์ทั้งหมดลงใน repository แล้ว'],
    executionContext: 'Terminal ของเครื่องทดสอบ',
    steps: [
      {
        stepNumber: 1,
        instruction: 'ตรวจสอบโครงสร้างไดเรกทอรีตรงตาม subject เป๊ะทุกตัวอักษร',
        command: 'find p1 p2 p3 bonus -maxdepth 2 -ls 2>/dev/null || ls -la',
        explanation: 'ตรวจสอบว่ามี p1, p2, p3, bonus และโฟลเดอร์ย่อย scripts/, confs/'
      },
      {
        stepNumber: 2,
        instruction: 'ตรวจสอบความสะอาดของ Git Repository ว่าไม่มี secret หรือ key หลงเหลือ',
        command: 'git status && git log -n 5 --oneline',
        explanation: 'working tree ต้อง clean และไม่มี commit ที่เก็บ password/token'
      }
    ],
    expectedResult: 'โครงสร้างไดเรกทอรีถูกต้อง 100% และไม่มีไฟล์ขยะตกค้าง',
    verification: 'พร้อมสำหรับการประเมินผล Defense ตามเกณฑ์ของ 42',
    troubleshooting: 'หากมีไฟล์แปลกปลอม ให้ใส่ชื่อใน .gitignore ก่อน commit'
  }
];
