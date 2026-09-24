# แผนเรียน Inception-of-Things (IoT) แบบละเอียด: Mandatory + Bonus

อ้างอิงโจทย์ **Inception-of-Things Version 4.0** จากไฟล์ `en.subject (6).pdf` จำนวน 18 หน้า และเอกสารทางการที่ตรวจวันที่ 24 กันยายน 2026

เลขหน้าโจทย์ในเอกสารนี้ใช้เลขที่พิมพ์ท้ายหน้า PDF เช่น หน้า 6 คือหน้าไฟล์ลำดับที่ 7

เป้าหมายคือทำโปรเจกต์ได้ด้วยความเข้าใจ อธิบายการทำงานได้ และหาสาเหตุเมื่อระบบเสียได้ แผนนี้เป็นหลักสูตรเรียนและแผนลงมือทำ ไม่ใช่โค้ดเฉลยทั้งโปรเจกต์

## 1. ภาพรวมและลำดับที่แนะนำ

**Linux และ Bash → Network/HTTP/SSH → VM และ Vagrant → Container → Kubernetes/YAML → K3s และ Part 1 → Deployment/Service → Ingress และ Part 2 → K3d → GitOps/Argo CD และ Part 3 → Storage/Helm → GitLab Bonus → ทดสอบจากเครื่องสะอาดและซ้อมตรวจ**

ให้สร้างชิ้นงานจริงหลังเรียนแต่ละกลุ่ม ไม่ต้องรออ่าน Kubernetes ทั้งหมดก่อนเริ่มเขียนโปรเจกต์ ส่วน Mandatory ต้องทำตามลำดับ p1 → p2 → p3 ตามโจทย์

สมมติว่าผู้อ่านเขียนโปรแกรมพื้นฐานและใช้ Git เบื้องต้นได้แล้ว หากยังไม่คล่องให้เพิ่มเวลาในบทพื้นฐาน หากใช้ Docker หรือ Linux ได้อยู่แล้ว ให้ทดสอบเกณฑ์ผ่านของบทนั้นแล้วข้ามส่วนที่ทำได้

### แยกชั้นของระบบให้ชัดตั้งแต่วันแรก

| ชั้น | ความหมายในโปรเจกต์ | สิ่งที่ต้องระวัง |
|---|---|---|
| เครื่องจริง | คอมพิวเตอร์ที่ใช้เรียนและตรวจงาน | CPU architecture, RAM, disk และ virtualization |
| VM หลัก | Linux VM ที่ใช้เป็นสภาพแวดล้อมทำโปรเจกต์ | โจทย์กำหนดให้งานทั้งหมดทำใน VM |
| Vagrant guest | VM ที่ Vagrant สร้างใน p1/p2 ตาม provider ที่เลือก | ถ้ารัน provider ภายใน VM หลัก ต้องตรวจ nested virtualization |
| Docker container ของ K3d | container ที่ทำหน้าที่เป็น K3s node ใน p3 | ใช้ kernel ของ VM หลัก ไม่ใช่ guest VM อีกชุด |
| Kubernetes Pod | หน่วยที่ Kubernetes ใช้รัน workload | Pod มี network และ lifecycle ของตนเอง |

การจัดวาง VM/provider อาจต่างกันตามเครื่องที่ใช้ แต่ต้องอธิบายได้ว่าคำสั่งแต่ละอันรันบนชั้นไหน และยังทำตามข้อกำหนดทั้งโปรเจกต์อยู่ใน VM

ใน Part 3 คำว่า “without Vagrant” หมายถึงเปลี่ยนวิธีสร้าง cluster มาใช้ K3d ภายใน VM ไม่ได้ยกเลิกข้อกำหนดเรื่อง VM ของทั้งโปรเจกต์

## 2. ข้อกำหนดที่ต้องทำให้ครบ

### Part 1: K3s และ Vagrant — โจทย์หน้า 6–8

- สร้าง 2 เครื่องด้วย Vagrant และใช้ Linux distribution รุ่น stable ล่าสุดตามโจทย์
- ใช้ login ของสมาชิกในกลุ่มเป็นชื่อฐาน: hostname เครื่องแรกลงท้าย `S` ตัวใหญ่ เครื่องที่สองลงท้าย `SW` ตัวใหญ่
- Server ใช้ `192.168.56.110`; ServerWorker ใช้ `192.168.56.111` บน interface เครือข่ายที่โจทย์กำหนดให้เป็น primary/dedicated interface
- เชื่อม SSH เข้าได้ทั้งสองเครื่องโดยไม่ต้องใส่ password ด้วย key-based authentication
- เครื่องแรกติดตั้ง K3s แบบ server/controller; เครื่องที่สองแบบ agent และอยู่ใน cluster เดียวกัน
- ติดตั้งและใช้ `kubectl` ได้
- โจทย์แนะนำอย่างมากให้ใช้ทรัพยากรน้อย: 1 CPU, RAM 512 MB หรือ 1024 MB
- ตรวจชื่อ interface จริงด้วย `ip a`; รูปตัวอย่าง `eth1` และเวอร์ชันใน screenshot ไม่ใช่ข้อบังคับให้ใช้รุ่นเก่า

**ข้อควรจัดการเรื่องทรัพยากร:** เอกสาร K3s ปัจจุบันระบุ minimum server 2 cores / 2 GB และ agent 1 core / 512 MB ซึ่งไม่ตรงกับคำแนะนำทรัพยากรใน subject รุ่นนี้ ให้บันทึกความต่าง เลือกและทดสอบเวอร์ชันจริง วัดปัญหา RAM/CPU และตรวจเกณฑ์ที่ใช้ประเมินก่อนล็อก configuration อย่าสรุปว่า 512 MB ใช้ได้แน่หรือเปลี่ยนข้อกำหนดโจทย์เอง [S2]

### Part 2: K3s และเว็บ 3 แอป — โจทย์หน้า 9–11

- ใช้ 1 VM ชื่อ login ตามด้วย `S`, IP `192.168.56.110` และ K3s server mode
- รัน web application ที่แยกกัน 3 แอป
- request ที่มี `Host: app1.com` แสดง app1
- request ที่มี `Host: app2.com` แสดง app2
- Host อื่น รวมถึงเข้าผ่าน IP ตามปกติ ต้องแสดง app3 เป็นค่า default
- app2 ต้องมี 3 replicas
- ต้องแสดง Ingress และอธิบายให้ผู้ตรวจได้

**app3.com อย่างเดียวไม่พอ:** ข้อกำหนดคือ app3 รับ request ที่ไม่ตรงกับ app1/app2 ไม่ใช่แค่มี host ของตัวเอง

### Part 3: K3d และ Argo CD — โจทย์หน้า 12–15

- ใช้ K3d ใน VM โดยไม่ใช้ Vagrant สำหรับส่วนนี้ และมี Docker ซึ่ง K3d ต้องใช้
- มี script ติดตั้ง packages และ tools ที่จำเป็น เพื่อใช้ระหว่างการตรวจ
- มี namespace สำหรับ Argo CD; ใช้ชื่อ `argocd` ตามแนวทางและตัวอย่างได้ และมี namespace ชื่อ `dev` สำหรับแอป
- สร้าง public GitHub repository เก็บ configuration โดยชื่อ repository ต้องมี login ของสมาชิกอย่างน้อยหนึ่งคน
- Argo CD deploy แอปใน `dev` จาก GitHub repository นี้โดยอัตโนมัติ
- แอปมี 2 เวอร์ชันที่ต่างกัน เลือก `wil42/playground:v1`, `v2` หรือทำแอปเอง
- หากทำแอปเอง ต้องมี public Docker Hub repository และ tags `v1`, `v2` ที่มีความต่างให้ตรวจได้
- แอปของ Wil ใช้ port `8888`; ถ้าทำแอปเองให้อธิบาย port และวิธีเข้าถึงของตน
- ต้องสาธิตแก้ version ใน GitHub แล้วแอปที่ใช้งานจริงเปลี่ยนตาม

subject ใช้คำว่า continuous integration แต่สิ่งที่ต้องพิสูจน์เป็นหลักคือ **GitOps continuous delivery/deployment**: Argo CD อ่าน manifest จาก Git แล้วปรับ cluster ให้ตรงกัน โจทย์ไม่ได้บังคับให้ build image ใหม่ด้วย CI ในทุก commit

### Bonus: GitLab ในเครื่อง — โจทย์หน้า 16

- เพิ่ม GitLab ให้ lab ของ Part 3
- ใช้ GitLab เวอร์ชันล่าสุดที่มีจากเว็บไซต์ทางการตามโจทย์ ตรวจใหม่ใกล้วันตรวจและบันทึกเลขเวอร์ชันที่ทดสอบจริง
- GitLab ต้องรันในเครื่อง ไม่ใช่ใช้ GitLab.com แทน
- มี namespace ชื่อ `gitlab`
- ทำให้ GitLab ทำงานกับ cluster และ workflow ทุกอย่างของ Part 3 ทำงานโดยใช้ GitLab ในเครื่อง
- แนวทางที่แสดงการทำตามโจทย์ได้ชัดเจนคือรัน GitLab workload ใน namespace `gitlab` แล้วให้ Argo CD อ่าน repository จาก instance นี้
- เก็บงานใน `bonus/` ที่ root repository
- โบนัสจะถูกตรวจเมื่อ Mandatory ครบและทำงานได้อย่างไม่มีปัญหาเท่านั้น

Helm เป็นตัวเลือกที่โจทย์เสนอ ไม่ใช่ข้อบังคับ และไม่มีข้อความบังคับ GitLab Runner, `.gitlab-ci.yml`, private registry, automatic image build หรือ webhook สิ่งเหล่านี้เลือกทำเพิ่มหลังงานที่บังคับสำเร็จได้

### การส่งงาน — โจทย์หน้า 4 และ 17

- root repository มี `p1/`, `p2/`, `p3/` และ `bonus/` สำหรับโบนัส
- scripts อยู่ในโฟลเดอร์ `scripts/`; configuration อยู่ใน `confs/` ของส่วนนั้น
- ส่ง configuration และ scripts ที่จำเป็นทั้งหมดใน repository
- ผู้ตรวจประเมินงานใน repository บนเครื่องของกลุ่ม ไม่ควรมีขั้นตอนสำคัญที่ทำไว้ในเครื่องแต่ไม่มีหลักฐานหรือวิธีสร้างซ้ำ

## 3. วิธีใช้แผนเรียน

ในแต่ละบท ทำตามวงรอบ: **อธิบายแนวคิด → ทดลองเล็ก ๆ → ตรวจผล → ทำให้เสียหนึ่งจุด → หาสาเหตุ → แก้ → บันทึกสิ่งที่พบ**

ใช้เวลาประมาณ 30% อ่าน, 50% ลงมือ, 20% debug และอธิบาย ข้อนี้เป็นแนวทางจัดเวลา ไม่ใช่เกณฑ์ของโจทย์

ทุกครั้งที่ใช้คำสั่งให้ตอบ 4 อย่าง: รันที่ไหน, คุยกับระบบไหน, เปลี่ยน state อะไร, จะตรวจผลจากอะไร คำสั่งที่มีชื่อ resource ตัวอย่างต้องปรับให้ตรงกับ manifest จริง

| บท | เรื่อง | ชั่วโมงประมาณ | ผลลัพธ์ |
|---|---|---:|---|
| 0 | สำรวจเครื่องและแยก requirement | 2–3 | แผน topology และรายการตรวจ |
| 1 | Linux, Bash, Git | 4–6 | script พื้นฐานและการอ่าน log |
| 2 | Network, HTTP, SSH | 6–10 | ตรวจ connection ทีละชั้นได้ |
| 3 | VM และ Vagrant | 6–10 | 2 VM สร้างซ้ำได้ |
| 4 | Container และ Docker | 4–6 | เข้าใจ image, tag, port, volume |
| 5 | Kubernetes และ YAML | 6–10 | อ่าน manifest และ state ได้ |
| 6 | K3s และจบ p1 | 6–10 | server/agent Ready |
| 7 | Deployment, Service, probes | 8–12 | แอปที่ scale และเข้าถึงได้ |
| 8 | Ingress และจบ p2 | 6–10 | routing 3 แอปและ 3 replicas |
| 9 | K3d | 4–6 | cluster ใน Docker และ access path |
| 10 | GitOps และ Argo CD | 8–12 | Git commit ทำให้แอปเปลี่ยน |
| 11 | จบและตรวจ p3 | 4–6 | demo v1/v2 อัตโนมัติ |
| 12 | Storage, Helm, Secrets | 6–10 | พร้อมติดตั้งระบบ stateful |
| 13 | GitLab Bonus | 12–20 | GitLab ในเครื่องควบคุม deployment |
| 14 | Rebuild, debug, defense | 6–10 | สร้างซ้ำและอธิบายครบ |
| รวม | รวมเวลาเรียนและฝึก | **88–141** | ยังอาจต้องเผื่อปัญหาเครื่อง/ดาวน์โหลด |

ถ้าเรียนประมาณ 12 ชั่วโมงต่อสัปดาห์ ให้เผื่อราว **8–12 สัปดาห์** ตัวเลขนี้เป็นประมาณการตามแผน ไม่ใช่เวลาที่ 42 กำหนดและไม่ใช่การรับประกันว่า setup ทุกเครื่องจะใช้เวลาเท่ากัน

## บท 0 — เตรียม lab และแยกสิ่งที่โจทย์บังคับ

### ต้องเรียนอะไร

1. **Infrastructure layers:** แยกเครื่องจริง, VM หลัก, Vagrant guest, Docker container และ Pod เพื่อไม่ใช้ IP, path หรือ localhost ผิดที่
2. **CPU architecture:** รู้ว่าเครื่องเป็น x86_64 หรือ ARM64 และ base box/container image/provider รองรับอะไร อย่าถือว่า image ทุกตัวมีทุก architecture
3. **Virtualization:** hypervisor สร้าง VM ที่มี guest kernel ส่วน nested virtualization คือให้ VM หลักใช้ความสามารถ virtualization เพื่อเปิด guest VM ข้างใน
4. **Resource budget:** RAM ของเครื่องจริงต้องรับทั้ง OS, VM หลัก, guest และ workloads พร้อม overhead; การใส่ RAM ใน Vagrantfile ไม่ได้เพิ่ม RAM จริง
5. **Version compatibility:** บันทึก OS, Vagrant/provider, Docker, K3s, K3d, kubectl, Argo CD และ GitLab/chart ที่ใช้ ตรวจความเข้ากันได้จากเอกสารเวอร์ชันนั้น
6. **Required vs recommended:** ชื่อ/IP/namespace/repository และพฤติกรรมแอปเป็น requirement ส่วนเครื่องมือเสริมจำนวนมากเป็นทางเลือก

### แบบฝึกหัด

- เขียนตารางว่าคำสั่ง `vagrant`, `docker`, `k3d`, `kubectl`, `curl` แต่ละชุดจะรันบนเครื่องใด
- ตรวจ `uname -m`, `lscpu`, `free -h`, `df -h`, `ip a` บน VM หลัก และทดสอบว่า provider ใช้งานได้จริง
- สร้าง VM ทดลองหนึ่งเครื่องก่อนลง K3s เพื่อแยกปัญหา virtualization ออกจาก Kubernetes
- เขียนตาราง IP และ port ที่จะใช้ รวมทั้ง `192.168.56.110` ที่ซ้ำระหว่าง p1/p2
- วางแผนหยุด VM ของ p1 ก่อนเปิด p2 บน network เดียวกัน เพื่อไม่ให้ IP ซ้ำ

### เกณฑ์ผ่าน

อธิบายได้ว่าโปรเซสใดอยู่ชั้นไหน และ `localhost` ใน terminal แต่ละหน้าหมายถึงอะไร พร้อมเปิด VM ทดลองและ SSH เข้าได้

## บท 1 — Linux, Bash และ Git ที่ใช้จริง

### 1.1 Linux filesystem และสิทธิ์

รู้จัก absolute/relative path, current directory, owner/group และสิทธิ์ read/write/execute; รู้ว่าทำไม script ต้อง executable และทำไม key/token ไม่ควร world-readable

ฝึก `pwd`, `ls`, `cd`, `mkdir`, `cp`, `mv`, `cat`, `less`, `chmod`, `chown`, `id`, `sudo` ให้เข้าใจผลกระทบ ไม่ต้องท่อง option ทุกตัว การใช้ root ต้องมีเหตุผล เช่นติดตั้ง package หรือแก้ service configuration

### 1.2 Process, service และ logs

Process คือโปรแกรมที่กำลังรัน; systemd service คือการให้ OS ดูแลโปรแกรม เช่นเริ่มตอน boot และ restart ตาม policy การที่ package ติดตั้งแล้วไม่ได้แปลว่า service กำลังทำงาน

ฝึก `ps`, `systemctl status`, `systemctl is-active`, `systemctl enable`, `journalctl -u`, `journalctl -f`, `ss -lntp`, `free -h`, `df -h` ต้องแยก service ไม่ได้ start, process crash, port ไม่ listen และ resource เต็มให้ออก

### 1.3 Bash สำหรับ automation

- shebang, variable, environment variable และ scope ของ shell
- single/double quote, command substitution และความเสี่ยงของการแทรก input ลงคำสั่ง
- exit code, `if`, loop, function และการแยก stdout/stderr
- redirection, pipe และ heredoc สำหรับสร้างไฟล์ config
- `set -euo pipefail` ช่วยให้เห็นข้อผิดพลาด แต่ต้องเข้าใจข้อยกเว้นของ `-e` ใน condition/pipeline และจัดการ error ที่คาดไว้เอง
- **Idempotency:** รันซ้ำแล้วได้สภาพเดิมที่ต้องการ ไม่เพิ่มบรรทัด `/etc/hosts` ซ้ำหรือสร้าง cluster ชื่อเดิมจนล้ม
- **Readiness:** รอให้สิ่งที่ต้องพึ่งพร้อมจริง พร้อม timeout แทนการเดาว่า `sleep 10` เพียงพอ
- การอ่าน config จากตัวแปรหรือไฟล์เดียว เพื่อไม่ให้ชื่อ/IP/namespace ต่างกันในหลาย script

### 1.4 Git ที่พอสำหรับ GitOps

เข้าใจ working tree → staging → commit → remote; branch, remote URL, `git diff`, `git log`, `git status`, `git push`, `git revert` และ `.gitignore`

การแก้ไฟล์บนเครื่องแต่ไม่ push ยังไม่ใช่การเปลี่ยน desired state ที่ Argo CD อ่านจาก remote การ revert สร้าง commit ย้อนการเปลี่ยนที่ตรวจสอบย้อนหลังได้

### แบบฝึกหัด

เขียน script ตรวจว่ามี tool ที่ต้องใช้หรือไม่ รายงาน service status และสร้างไฟล์ config แบบรันซ้ำได้ ฝึกทำผิดหนึ่งอย่าง เช่นชื่อ package ผิด แล้วให้ script หยุดพร้อมข้อความที่อ่านเข้าใจ

สร้าง Git repository ทดลอง แก้ config, commit, push, ตรวจ remote จาก clone อีกชุด แล้วใช้ revert ย้อนหนึ่ง commit

### เกณฑ์ผ่านและคำถามตรวจ

- รัน script 2 รอบแล้วระบบไม่เสียและไม่มีข้อมูลซ้ำ
- เมื่อคำสั่งกลาง script ล้ม อธิบายได้ว่าส่วนใดยังรันต่อและควรจัดการอย่างไร
- ตอบได้ว่า restart service ต่างจาก reboot VM อย่างไร และจะหา log ของ K3s จากที่ไหน
- อธิบายได้ว่าการ commit โดยไม่ push ส่งผลต่อ Argo CD หรือไม่

## บท 2 — Network, HTTP และ SSH

### 2.1 IP, subnet และ route

IP เป็น address ของ interface ไม่ใช่ address เดียวของทั้งเครื่อง เครื่องหนึ่งมีหลาย IP ได้ `192.168.56.110/24` ประกอบด้วย address และ prefix ของ network; `/24` ไม่ใช่ port

เรียน private IP, subnet, default gateway, routing table และ interface ว่าเกี่ยวกันอย่างไร ใช้ `ip a` ดู address และ `ip route` ดูเส้นทาง เมื่อมี NAT network กับ private network พร้อมกัน K3s อาจเลือก address ที่ไม่ได้ต้องการ จึงต้องรู้ว่า node advertise IP ใด

### 2.2 NAT, host-only/private และ bridged network

- NAT มักช่วย guest ออกอินเทอร์เน็ต แต่การเข้าจากภายนอกต้องมีเส้นทางหรือ port forwarding
- private/host-only network ใช้ให้ VM กับ host/provider host คุยกันตาม topology
- bridged network ทำให้ guest อยู่บน network ที่ bridge เข้าไป ต้องเข้าใจ DHCP และนโยบายเครือข่ายที่ใช้อยู่

ชื่อและพฤติกรรมละเอียดขึ้นกับ provider ให้ตรวจ route จริง การมองเห็น guest จาก VM หลักไม่ได้แปลว่าเครื่องจริงเข้าถึง guest โดยตรงได้เสมอ

### 2.3 Port, TCP และ listening address

Port แยกบริการใน IP เดียวกัน เรียน `22` สำหรับ SSH, `80/443` สำหรับ HTTP/HTTPS, `6443` สำหรับ Kubernetes API ใน setup ปกติ และ `8888` ของแอปตัวอย่าง

`127.0.0.1:8888` รับจาก loopback ของ network namespace นั้น ส่วนการ bind `0.0.0.0:8888` รับจาก IPv4 interfaces ของ namespace นั้น ขอบเขตการเปิดจริงยังขึ้นกับ firewall และ port mapping

`connection refused` มักเป็นไม่มีผู้รับหรือถูกปฏิเสธ, `timeout` อาจเกิดจาก route/firewall/server ไม่ตอบ, `could not resolve host` เป็นปัญหาแปลงชื่อ ต้องใช้ข้อมูลประกอบ ไม่วินิจฉัยจากข้อความเดียว

### 2.4 HTTP และ Host header

ต้องอ่าน request ได้ เช่น `GET / HTTP/1.1` และ `Host: app1.com` เครื่องปลายทางเดียวกันสามารถเลือกเว็บจาก Host ได้ นี่คือหัวใจ Part 2

DNS ตอบว่าไป IP ไหน ส่วน Host header บอกเว็บที่ต้องการ ณ server นั้น การเขียน `/etc/hosts` ช่วย resolver ของเครื่องที่แก้ไฟล์ แต่ไม่ได้เปลี่ยน DNS ของ Pod ใน cluster ตามไปด้วย

ฝึกจากเครื่องที่มี route ไปยัง VM:

```bash
curl -v http://192.168.56.110/
curl -v -H 'Host: app1.com' http://192.168.56.110/
curl --resolve app1.com:80:192.168.56.110 http://app1.com/
```

สองคำสั่งหลังช่วยทดสอบ virtual host โดยไม่ต้องซื้อ domain จริง ส่วน DNS, Host header และ TLS SNI เป็นคนละหน้าที่; HTTPS ต้องเรียน certificate/SNI เพิ่มเมื่อตัดสินใจใช้

### 2.5 SSH keys

public key ใช้ฝั่ง server เพื่ออนุญาตการเข้า ส่วน private key ต้องอยู่กับผู้ถือ key เรียน `authorized_keys`, `known_hosts`, host key fingerprint, `ssh -i` และ `vagrant ssh-config`

Passwordless login หมายถึงใช้ authentication ที่เหมาะสม เช่น SSH key ไม่ได้หมายถึงตั้งรหัสผ่านว่าง และไม่จำเป็นต้องใช้ root login

### แบบฝึกหัดและเกณฑ์ผ่าน

- ให้สอง VM ping และ SSH ถึงกันตาม network ที่ตั้งไว้ แล้วทดสอบบริการ TCP จริงด้วย เพราะ ping ผ่านไม่ได้แปลว่า port เป้าหมายเปิด
- เปิดเว็บ service ใน guest ทดสอบจาก guest เองและจาก VM หลัก แล้วอธิบายเส้นทาง
- อธิบายว่าทำไมแก้ `/etc/hosts` บน laptop แล้ว Argo CD ยังหา GitLab ไม่เจอได้
- วินิจฉัย DNS failure, timeout, refused และ HTTP 404 ด้วยขั้นตอนคนละชุด
- ตอบได้ว่า `localhost` ของ Argo CD Pod ไม่ใช่ localhost ของ VM หลัก

## บท 3 — VM และ Vagrant

### ต้องเรียนอะไร

**Vagrant** อ่าน configuration และจัดวงจรชีวิตสภาพแวดล้อม ส่วน **provider** เช่น VirtualBox หรือ libvirt ทำหน้าที่สร้างและรัน VM จริง **box** คือ base image ที่ใช้เริ่มต้น VM ทั้งสามอย่างไม่ใช่สิ่งเดียวกัน

อ่าน Ruby DSL ใน `Vagrantfile` เท่าที่จำเป็น: block `do ... end`, variable, string และ scope ไม่ต้องเรียน Ruby ทั้งภาษา

ศึกษา `config.vm.box`, `config.vm.define`, `vm.hostname`, `vm.network`, provider CPU/RAM, synced folders และ shell provisioner แยก global configuration กับของเครื่องย่อยให้ได้ เพื่อไม่ให้ script ของ server ไปรันบน worker โดยไม่ตั้งใจ [S1]

คำสั่งหลัก: `vagrant validate`, `up`, `status`, `ssh`, `ssh-config`, `provision`, `reload`, `halt`, `destroy` โดย `destroy` ใช้เฉพาะ VM lab ที่ตั้งใจลบ

**Provisioning** คือขั้นตอนเตรียม guest ให้พร้อมหลังสร้าง เช่นติดตั้ง software และวาง config ต้องสร้าง state ได้จาก source ที่ส่งใน Git

### แบบฝึกหัด

1. สร้าง guest หนึ่งเครื่องที่ตั้ง hostname และ IP ได้
2. เพิ่มอีกเครื่องด้วย multi-machine Vagrantfile
3. แยก script server กับ worker ให้แต่ละเครื่องรันถูกชุด
4. SSH เข้าแต่ละเครื่องโดยไม่ใส่ password และตรวจ `hostname`, `ip a`
5. รัน provision อีกครั้งและ reboot ดูว่า configuration ยังถูก
6. ลบเฉพาะ lab ทดลองแล้วสร้างใหม่จาก repository

### จุดที่ต้องระวัง

- guest box ต้องตรง provider/architecture และเป็น distribution stable ตามที่โจทย์กำหนด
- interface มีชื่อจริงต่างกันได้ ไม่ hardcode `eth1` จากรูป
- Vagrant `primary: true` หมายถึง default machine ของ Vagrant ไม่ใช่การกำหนด primary network interface
- synced folder เช่น `/vagrant` ทำให้ไฟล์ปรากฏทั้งสองฝั่ง แต่ไม่ได้ทำให้ไฟล์ลับปลอดภัยโดยอัตโนมัติ
- p1 และ p2 ใช้ IP เดียวกันบางส่วน ต้องจัดการไม่ให้ VM สองชุดชนกัน

### เกณฑ์ผ่าน

จากโฟลเดอร์ p1 สร้าง 2 VM ที่ชื่อ/IP ถูกต้องได้ซ้ำ โดย configuration ของแต่ละเครื่องไม่ปะปนกัน และอธิบายได้ว่า Vagrant ส่ง provisioning script ไปทำอะไรบน guest

## บท 4 — Container และ Docker

### ต้องเรียนอะไร

Container เป็นการรัน process โดยแยกสภาพแวดล้อมและจำกัดทรัพยากรโดยกลไกของ OS ไม่ได้สร้าง guest kernel ใหม่เหมือน VM เรียน namespaces และ cgroups ระดับแนวคิดก่อน ไม่ต้องลงรายละเอียด kernel implementation [S3]

- **Image:** ชุด filesystem/metadata สำหรับสร้าง container
- **Container:** instance ที่กำลังหรือเคยรันจาก image
- **Registry:** บริการแจกจ่าย image เช่น Docker Hub
- **Repository ของ image:** ชุด image ภายใต้ชื่อเดียว ไม่ใช่ Git repository
- **Tag:** ชื่ออ้างอิง version เช่น `v1`/`v2`; เปลี่ยนสิ่งที่ tag ชี้ได้ จึงไม่ใช่ immutable identity
- **Digest:** ตัวระบุจาก content ใช้ตรึง image ได้แน่นกว่า tag
- **Port publishing:** map port จาก host เข้า container; `EXPOSE` ใน Dockerfile ไม่ได้เปิด port บน host เอง
- **Volume/bind mount:** เก็บข้อมูลนอก writable layer ของ container
- **Environment variable และ logs:** ส่ง config และตรวจสิ่งที่ process ทำ

ใช้ `docker run`, `ps`, `logs`, `exec`, `inspect`, `images`, `pull`, `build`, `tag`, `push`, `network`, `volume` เฉพาะส่วนที่สัมพันธ์กับ lab

### ทำไมต้องเรียนก่อน Kubernetes

เมื่อ Pod ดึง image ไม่ได้ หรือเว็บ listen ผิด address ต้องรู้พฤติกรรมแอป/container ก่อน Kubernetes จึงช่วยจัดการ lifecycle ได้ K3s ใช้ containerd เป็น runtime โดยค่าเริ่มต้น ไม่ต้องติดตั้ง Docker เพื่อทำ p1/p2 ตามปกติ ส่วน K3d ใช้ Docker เพื่อรัน K3s nodes [S4, S10]

### แบบฝึกหัด

- รันเว็บง่าย ๆ ด้วย port mapping แล้วตรวจว่าปิด container ทำให้ endpoint หาย
- เปลี่ยน port ฝั่ง host โดยไม่เปลี่ยน port ที่แอป listen และอธิบายได้
- ทดสอบ tag สองเวอร์ชันของแอปให้ตอบข้อความต่างกัน ถ้าเลือกแอป Wil ให้ตรวจ tags/architecture ปัจจุบันก่อนใช้จริง
- สร้างไฟล์ใน container ที่ไม่มี volume แล้วเปรียบเทียบกับไฟล์ที่เก็บผ่าน volume เมื่อ replace container
- ถ้าจะทำแอปเอง จึงค่อยเรียน Dockerfile, build context, `.dockerignore`, entrypoint/CMD และ public Docker Hub push

### เกณฑ์ผ่าน

อธิบาย image/container/registry/tag/digest/volume ได้ และแสดงแอป v1 กับ v2 ผ่าน Docker ได้ด้วยตนเองก่อนนำไป debug บน Kubernetes

## บท 5 — Kubernetes, YAML และ declarative configuration

### 5.1 ปัญหาที่ Kubernetes ช่วยแก้

เมื่อมีหลาย container เราต้องเลือกเครื่องที่จะรัน เริ่มใหม่เมื่อเสีย รักษาจำนวน instance และเปิดช่องทางเข้าถึง Kubernetes ให้เราระบุ **desired state** แล้ว controllers พยายามทำให้ **actual state** ตรงกับที่ประกาศ

ตัวอย่าง: ประกาศว่าต้องมีเว็บ 3 replicas ไม่ได้สั่ง “สร้าง container แล้วจบ” แต่ตั้งความต้องการคงไว้ หาก Pod ที่ถูกควบคุมหาย controller จะสร้างทดแทนเมื่อมีทรัพยากรและเงื่อนไขพร้อม

### 5.2 ส่วนประกอบของ cluster

| คำ | หน้าที่ | ต้องเข้าใจแค่ไหนในโปรเจกต์ |
|---|---|---|
| Cluster | กลุ่ม node ที่ใช้ control plane ร่วมกัน | แยกแต่ละ cluster/context ให้ได้ |
| Node | เครื่องหรือสภาพแวดล้อมที่รัน Kubernetes node components | p1 เป็น VM, p3 เป็น container ของ K3d |
| API server | จุดรับคำสั่งและอ่าน/เขียน Kubernetes API | kubectl และ Argo CD คุยกับ API |
| Scheduler | เลือก node ให้ Pod ที่ยังไม่ได้ถูกจัดวาง | รู้ว่า resource/เงื่อนไขไม่พอทำให้ Pending ได้ |
| Controllers | ทำให้ resource มี state ตามที่ต้องการ | ใช้อธิบาย replica และ rollout |
| Datastore | เก็บข้อมูล state ของ cluster | upstream มักพูดถึง etcd; K3s แบบ single server ใช้ SQLite ได้ |
| Kubelet | ดูแล Pod/container บนแต่ละ node | เชื่อม control plane กับสิ่งที่รันจริง |
| Container runtime | สร้างและรัน container | K3s ปกติใช้ containerd |
| CNI | กลไก/ปลั๊กอินเครือข่าย container | รู้หน้าที่เชื่อม Pod ข้าม node |
| CoreDNS | DNS ภายใน cluster | ใช้เรียก Service ด้วยชื่อ |

ไม่ต้องเรียนติดตั้ง Kubernetes แบบ kubeadm, HA etcd หรือเขียน CNI เองเพื่อทำ subject นี้ แต่ต้องรู้ตำแหน่งและหน้าที่ของแต่ละส่วน [S4, S5]

### 5.3 Resource ที่ต้องแยกให้ออก

**Pod** เป็นหน่วยจัดวาง workload มีหนึ่งหรือหลาย container ที่สัมพันธ์กัน ใน lab นี้ส่วนใหญ่หนึ่งแอปต่อ Pod จึงเริ่มจากรูปแบบนี้ก่อน

**ReplicaSet** ดูแลจำนวน Pod ที่ตรง selector ส่วน **Deployment** ดูแล ReplicaSets และ rollout ของแอป จึงควรใช้ Deployment จัดการแอป stateless แทนสร้าง Pod เดี่ยวทุกตัวเอง [S6]

**Service** ให้ชื่อ/address สำหรับเข้าถึงชุด Pod ที่เปลี่ยนไปได้ ส่วน **Ingress** ประกาศ routing HTTP(S) ไปยังบริการ และต้องมี **Ingress controller** มารับและประมวลผลกฎนั้นจริง [S7, S8]

**Namespace** แบ่งชื่อและขอบเขตของ resources หลายชนิดใน cluster เดียวกัน ไม่ใช่ cluster ใหม่หรือขอบเขต security ที่สมบูรณ์โดยอัตโนมัติ บาง resource เช่น Node, PersistentVolume และ IngressClass เป็น cluster-scoped

**ConfigMap** เก็บ config ที่ไม่ใช่ความลับ ส่วน **Secret** ใช้เก็บข้อมูลอ่อนไหวใน Kubernetes API แต่ข้อมูลแบบ base64 ใน YAML ไม่ใช่การเข้ารหัสเพื่อป้องกันคนที่อ่านไฟล์ได้

### 5.4 YAML และ manifest

เรียน indentation ด้วย spaces, key/value, mapping, list, string/number/boolean, multiline string และ `---` แยก document ความผิดพลาดของ indentation อาจทำให้ความหมายเปลี่ยนโดยที่ดูคล้ายเดิม

Manifest ส่วนใหญ่มี `apiVersion`, `kind`, `metadata`, `spec`; `status` เป็นข้อมูลสถานะที่ระบบรายงาน ไม่ใช่ส่วนที่ปกติเขียน desired state ของแอปเอง

ต้องอ่าน dotted path ได้ เช่น `spec.template.metadata.labels` กับ `metadata.labels` ไม่ใช่ตำแหน่งเดียวกัน โดยอันแรกเป็น labels ของ Pod ที่ Deployment สร้าง

เรียน `labels` และ `selectors` ให้แน่น เพราะเป็นตัวเชื่อม resource หลายชนิด เช่น Service เลือก Pod ไม่ใช่เลือก Deployment ตามชื่อโดยอัตโนมัติ

### 5.5 kubectl และ kubeconfig

`kubectl` คือ client, `kubeconfig` ระบุ cluster endpoint/credentials/context และ context รวม cluster, user, namespace ที่ใช้เป็นค่า default

คำสั่งที่ควรใช้เองได้:

```bash
kubectl config current-context
kubectl config get-contexts
kubectl cluster-info
kubectl get nodes -o wide
kubectl get namespaces
kubectl get pods -A -o wide
kubectl explain deployment.spec.template
kubectl apply -f ./confs/
kubectl get deployments,services,ingresses -A
```

`-n` เลือก namespace, `-A` อ่านหลาย namespace, `-o wide` เพิ่มรายละเอียด, `-o yaml` อ่าน representation ของ object จริง `kubectl get all` ไม่ได้รวม resource ทุกชนิด โดยเฉพาะอย่าใช้แทนการตรวจ Ingress, Secret และ PVC

### แบบฝึกหัดและเกณฑ์ผ่าน

- อ่าน manifest แล้วอธิบายว่าค่าแต่ละตัวเป็นของ Deployment, Pod หรือ container
- สร้าง namespace ทดลองและ deploy แอปหนึ่งตัว
- เปิด context ผิดโดยตั้งใจใน lab แล้วฝึกตรวจ context ก่อนแก้ resource
- อธิบายความต่างระหว่าง object ถูกสร้างสำเร็จ, Pod Running, container Ready และแอปเข้าถึงได้จริง
- วาดความสัมพันธ์ Deployment → ReplicaSet → Pod และ Service → selector → Pod ได้

## บท 6 — K3s และการทำ Part 1 ให้จบ

### ต้องเรียนอะไร

K3s เป็น Kubernetes distribution ที่จัดแพ็กเกจส่วนประกอบให้ติดตั้งง่าย server รัน control plane/datastore และโดยปกติมีความสามารถรัน workload ด้วย agent รันงานฝั่ง node แต่ไม่มี control plane/datastore ของตน [S4]

ศึกษาให้เข้าใจ:

- installer และวิธีระบุ version/config แทนปล่อยผลการติดตั้งเปลี่ยนโดยไม่บันทึก
- ความต่างของ `k3s server` และ `k3s agent`
- server URL เช่น `https://192.168.56.110:6443` และ token ที่ agent ใช้ join
- ความหมายของ `K3S_URL`, `K3S_TOKEN` หรือรูปแบบ configuration ที่เลือกใช้
- node IP และ interface ที่ใช้สำหรับ cluster traffic เมื่อ guest มีหลาย network
- service `k3s` และ `k3s-agent`, lifecycle ตอน boot/reboot
- kubeconfig ที่ K3s สร้าง และสิทธิ์การอ่านที่เหมาะสม
- readiness และการส่ง token ให้ worker อย่างมีขั้นตอน โดยไม่ commit token/key ลง public repository

ลำดับการติดตั้งต้องเป็น **server เริ่มทำงาน → endpoint/token พร้อม → agent เชื่อม → node Ready** ชื่อเครื่อง/เวลาเครื่อง/network/credentials ล้วนมีผลกับการ join

### แผนลงมือทำ p1

1. ใช้ Vagrantfile ที่ผ่านบท 3 ตั้งชื่อและ IP ตามโจทย์
2. ติดตั้ง server จาก script แยก แล้วตรวจ service/API
3. รอให้ token และ endpoint พร้อม พร้อม timeout ที่มีเหตุผล
4. ให้ worker ได้ token ผ่านกลไกของ lab ที่อธิบายได้และไม่เผยแพร่ secret
5. ติดตั้ง agent โดยชี้ server URL ถูกเครื่อง
6. รอทั้งสอง node Ready แล้วตรวจ Internal-IP และ version
7. ตรวจ SSH แบบไม่ใช้ password ทั้งสองเครื่อง
8. ทดสอบ reboot และการ provision ซ้ำ

### วิธีตรวจและลำดับ debug

บนเครื่องที่มี kubeconfig ของ cluster นี้:

```bash
kubectl get nodes -o wide
kubectl get pods -A
```

บน server และ worker ตามลำดับ:

```bash
systemctl status k3s
journalctl -u k3s --no-pager -n 100
systemctl status k3s-agent
journalctl -u k3s-agent --no-pager -n 100
```

สอง service ไม่จำเป็นต้องมีทั้งคู่บนทุกเครื่อง ให้รันตรวจบน node ที่ทำหน้าที่ตรงกัน

หาก worker ไม่เข้า cluster ให้ไล่: service เริ่มไหม → server IP/route ถูกไหม → TCP 6443 ถึงไหม → token ถูกไหม → เวลา/certificate ถูกไหม → node IP/CNI ถูกไหม อย่า reinstall ทุกอย่างก่อนอ่าน log

### เกณฑ์ผ่าน p1

- 2 VM มาจาก Vagrant และ hostname suffix ถูก
- IP `.110`/`.111` ถูกตาม interface ที่ตั้งไว้
- SSH ไม่ต้องกรอก password
- server/controller หนึ่งเครื่องและ agent หนึ่งเครื่องใน cluster เดียวกัน
- ทั้งสอง node Ready พร้อม Internal-IP ตามที่ออกแบบ
- ใช้ kubectl ได้จริงและสร้างใหม่ด้วยไฟล์ใน p1 ได้

### คำถามที่ต้องตอบ

ทำไมต้องมี token? Agent เรียก API ที่ไหน? Server รัน Pod ได้หรือไม่? ถ้า control plane หยุด workload เดิมกับความสามารถ schedule งานใหม่จะได้รับผลต่างกันอย่างไร? ทำไม Pod และ Service IP ไม่จำเป็นต้องอยู่ subnet เดียวกับ IP ของ VM?

## บท 7 — Deployment, replicas, Service และสุขภาพแอป

### 7.1 เรียน Deployment ให้ถึงการเปลี่ยนเวอร์ชัน

อ่าน `replicas`, Pod template, container image, labels/selectors และ rollout เมื่อ Pod template เปลี่ยน การแก้ image ใน template ทำให้ Deployment จัด rollout ไม่ใช่เปิด image ใหม่ใน container เดิมแบบแก้ไฟล์สด

เรียน RollingUpdate, desired/current/ready/available replicas ในระดับที่อ่านสถานะได้ ระหว่าง rollout จำนวน Pod อาจมากกว่าค่า replicas ชั่วคราวตาม strategy จึงดูทั้งสถานะระหว่างทางและหลัง rollout จบ

ลบ Pod หนึ่งตัวใน Deployment แล้วดูตัวใหม่เกิดขึ้น แยกกรณี container restart ภายใน Pod เดิมกับ Pod ใหม่ที่มีชื่อ/UID ใหม่

### 7.2 เรียน Service ให้เข้าใจทั้ง selector และ ports

| ช่อง | หมายถึง | ไม่ได้หมายถึง |
|---|---|---|
| แอป listen port | port ที่ process รับจริง | ค่าอื่นจะบังคับให้โปรแกรมเปลี่ยน port เอง |
| `containerPort` | การประกาศ port ของ container ใน manifest | การเปิด port บน host อัตโนมัติ |
| Service `port` | port ที่ client ใช้เรียก Service | ต้องเท่ากับ port แอปเสมอ |
| Service `targetPort` | port/ชื่อ port ที่ส่งต่อไปยัง Pod | port ของเครื่องจริง |
| `nodePort` | port บน node สำหรับ Service ประเภท NodePort | port ที่ browser ต้องใช้ในทุก setup |
| K3d/Docker published port | ช่องทางจาก VM หลักเข้า container ของ node/LB | Kubernetes Service port โดยอัตโนมัติ |

`ClusterIP` ใช้เข้าจากภายใน cluster โดยปกติ, `NodePort` เปิดบน node และ `LoadBalancer` ต้องมี implementation ที่จัดการให้ ไม่ได้หมายความว่าระบบจะสร้าง public cloud load balancer โดยไม่มีส่วนประกอบอื่น [S7]

Service เลือก Pod ด้วย label selector และระบบแสดงปลายทางใน EndpointSlices ถ้า endpoints ว่าง ให้ตรวจ selector, namespace และ readiness

### 7.3 Readiness, liveness และ startup

- **Readiness:** พร้อมรับ traffic หรือยัง
- **Liveness:** container ค้าง/เสียจนต้อง restart หรือไม่
- **Startup:** ให้แอปที่เริ่มนานมีเวลา ก่อนใช้การตรวจ readiness/liveness ตามพฤติกรรมที่ตั้ง

สามอย่างนี้ไม่ได้ใช้แทนกัน ตั้ง liveness รุนแรงไปทำให้ restart ซ้ำก่อนแอปเริ่มเสร็จ โดยเฉพาะ GitLab ในโบนัส

เรียน CPU/memory **requests** สำหรับการวางแผนจัดสรร และ **limits** สำหรับขอบเขตการใช้ แยก CPU throttling, OOMKilled และ node pressure ให้ได้ ไม่ต้องทำ autoscaling เพื่อผ่านโจทย์

### ตัวอย่าง manifest สำหรับอ่านและทดลอง

ตัวอย่างนี้ใช้ image ที่ subject เสนอ ให้ตรวจว่า image ใช้ได้บน architecture ของ lab ก่อน ชื่อ `lab-demo` และ namespace `lab` เป็นชื่อแบบฝึกหัด ไม่ใช่ข้อบังคับของโปรเจกต์

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lab-demo
  namespace: lab
spec:
  replicas: 3
  selector:
    matchLabels:
      app: lab-demo
  template:
    metadata:
      labels:
        app: lab-demo
    spec:
      containers:
        - name: web
          image: wil42/playground:v1
          ports:
            - name: http
              containerPort: 8888
---
apiVersion: v1
kind: Service
metadata:
  name: lab-demo
  namespace: lab
spec:
  selector:
    app: lab-demo
  ports:
    - port: 80
      targetPort: http
```

สร้าง namespace `lab` ก่อน apply ตัวอย่างนี้ จากนั้นอ่านการเชื่อมกัน 4 จุด: Deployment selector → Pod label → Service selector → named targetPort `http` ที่ประกาศเป็น 8888 ส่วน Service ไม่มี `type` จึงใช้ค่า default ClusterIP

### แบบฝึกหัด

1. เริ่ม 1 replica แล้วเพิ่มเป็น 3 ด้วย manifest
2. ลบ Pod หนึ่งตัว ตรวจว่าระบบสร้างทดแทนจนพร้อมครบ
3. เปลี่ยน Service selector ให้ไม่ตรงใน lab แล้วดู EndpointSlices
4. เปลี่ยน targetPort ให้ผิด แล้วดูว่าต่างจาก selector ผิดอย่างไร
5. ทดลอง image tag ที่ไม่มีจริง อ่าน Events แล้วแก้กลับ
6. เรียก Service จาก Pod ทดสอบใน cluster จากนั้นใช้ port-forward เพื่อตรวจแอปจากภายนอก

```bash
kubectl get deployments,pods,services -n lab -o wide
kubectl get endpointslices -n lab
kubectl describe deployment lab-demo -n lab
kubectl logs -n lab deployment/lab-demo
kubectl rollout status deployment/lab-demo -n lab
kubectl port-forward -n lab service/lab-demo 8888:80
```

### เกณฑ์ผ่าน

ทำให้แอปมี 3 Ready replicas ได้ Service มีปลายทางตรง และแยกได้ว่าเหตุใด Pod Running แต่เรียกเว็บไม่ได้ ถ้าใช้ port-forward ต้องรู้ว่ามันทำงานเฉพาะตอน process ยังรันและ bind ที่เครื่องใด

## บท 8 — Ingress และการทำ Part 2 ให้จบ

### 8.1 ต้องเข้าใจ reverse proxy ก่อน

Reverse proxy รับ request แล้วเลือก backend ให้ ใน Part 2 ทุกแอปเข้าผ่าน IP เดียว แยกด้วย HTTP Host ไม่ใช่ให้ผู้ใช้เลือก port ของแอปเอง

**Ingress resource** คือกฎ ส่วน **Ingress controller** คือ software ที่นำกฎไปทำงาน K3s ติดตั้ง Traefik มาโดยปกติ แต่ให้ตรวจ cluster จริงว่ามี controller และ IngressClass ใด [S8, S9]

เรียน `networking.k8s.io/v1`, `ingressClassName`, `rules.host`, `http.paths`, `pathType`, `backend.service.name` และ Service port ที่ backend อ้างถึง

### 8.2 Routing ตามโจทย์

| Request ที่ IP `192.168.56.110` | ผลที่ต้องได้ |
|---|---|
| `Host: app1.com` | app1 |
| `Host: app2.com` | app2 ซึ่งมี 3 Ready replicas |
| `Host: anything.invalid` | app3 |
| เข้า IP โดยตรงผ่าน curl/browser | app3 |

ทำ app3 เป็น fallback ด้วยรูปแบบที่ controller/version รองรับ เช่น catch-all hostless rule หรือ default backend ตามเอกสารของ controller ต้องทดสอบว่า named-host rules ยังชนะ fallback อย่าถือว่าใส่ `defaultBackend` ใน YAML แล้ว controller ทุกตัวทำงานเหมือนกัน

ข้อกำหนดคือผลลัพธ์ request ถูก ไม่ใช่แค่มี object ชื่อ Ingress สร้างสำเร็จ และไม่ควรใช้ app3.com เพียงชื่อเดียวแทน fallback

### 8.3 เส้นทาง request ที่ต้องอธิบายได้

Client ติดต่อ VM IP:80 → controller รับ HTTP request → ตรวจ Host/path → เลือก Service ของแอป → ส่งไปยัง Pod backend ที่พร้อมใช้งาน

นี่เป็นภาพทางตรรกะ: controller บาง implementation เชื่อมไป Pod endpoints โดยตรงจากข้อมูล Service ไม่จำเป็นต้องผ่าน ClusterIP ของ Service ทุก packet แต่ Service/selector ยังใช้ระบุชุด backend

### แผนลงมือทำ p2

1. หยุด lab p1 ที่ใช้ IP เดียวกันบน network เดียวกัน
2. สร้าง 1 VM ด้วย Vagrant และติดตั้ง K3s server
3. สร้าง app1, app2, app3 ให้ response แยกกันชัด อาจใช้เว็บเล็ก ๆ แสดงชื่อแอป
4. สร้าง Deployment และ Service ของแต่ละแอป
5. ตั้ง app2 replicas เป็น 3 และตรวจ Ready ครบ
6. ตรวจแต่ละ Service จากใน cluster ก่อนเพิ่ม Ingress
7. เพิ่ม routing สำหรับ app1/app2 และ fallback app3
8. ทดสอบ request ทั้งตารางจากเครื่องที่มี route เข้า VM
9. restart/recreate เฉพาะ lab แล้วตรวจอีกครั้งจาก scripts/confs

```bash
curl -H 'Host: app1.com' http://192.168.56.110/
curl -H 'Host: app2.com' http://192.168.56.110/
curl -H 'Host: anything.invalid' http://192.168.56.110/
curl http://192.168.56.110/
kubectl get ingress -A
kubectl get deployments,pods,services -A
```

ถ้าต้องการโชว์การกระจาย request ให้แอปตอบ hostname/Pod name ด้วยได้ แต่ไม่สรุปว่าต้องสลับ 1→2→3 ทุกครั้ง เพราะการเลือก backend และการ reuse connection ขึ้นกับ implementation ให้พิสูจน์ 3 replicas จาก Kubernetes พร้อมกับพิสูจน์ endpoint ใช้งานได้

### เกณฑ์ผ่านและคำถามตรวจ

Host ที่กำหนดเลือกแอปถูก, Host อื่นได้ app3, app2 มี 3 Ready replicas และอธิบาย traffic path/IngressClass/selector/ports ของตนได้

ต้องตอบได้: ทำไมเปลี่ยน Host แล้วแอปเปลี่ยนทั้งที่ IP เดิม? Service กับ Ingress แทนกันได้หรือไม่? ทำไมต้องมี controller? ถ้าได้ 404 กับ 502/503 จะเริ่มตรวจตรงไหนต่างกัน? ถ้า app2 Pod หายหนึ่งตัวใครสร้างกลับ?

## บท 9 — K3d และ network ที่ซ้อนใน Docker

### 9.1 K3s กับ K3d ต่างกันอย่างไร

| เครื่องมือ | หน้าที่ | ในโปรเจกต์ใช้ที่ไหน |
|---|---|---|
| Kubernetes | ระบบจัดการ container workloads และ API | แนวคิดพื้นฐานทุกส่วน |
| K3s | Kubernetes distribution | ติดตั้งบน VM ใน p1/p2 และอยู่ข้างใน K3d nodes ใน p3 |
| K3d | เครื่องมือสร้าง K3s cluster โดยรัน nodes ใน Docker | p3 และ bonus |
| Docker | รัน container ของ K3d nodes | อยู่บน VM หลักของ p3 |
| kubectl | client ติดต่อ Kubernetes API | ใช้ได้ทั้ง K3s และ K3d เมื่อ kubeconfig ถูก |

K3d ไม่ใช่ Kubernetes อีกชนิดที่ต้องเรียน manifest ใหม่ แอป Deployment/Service เดิมใช้แนวคิดเดียวกัน เปลี่ยนวิธีสร้าง node และเส้นทาง network เป็นหลัก [S10]

### 9.2 สิ่งที่ต้องเรียน

- สร้าง/ลบ/เริ่ม/หยุด cluster ด้วย `k3d cluster ...`
- server/agent nodes และ container สำหรับ load balancer ของ K3d เมื่อเปิดใช้
- ดู `docker ps` แล้วเทียบกับ `kubectl get nodes`
- เลือก Kubernetes/K3s version ที่เข้ากับ tools ที่ต้องติดตั้ง
- kubeconfig/context ที่ K3d สร้างและการสลับกลับ cluster อื่น
- การเปิด port ผ่าน K3d config/flags, Ingress, NodePort หรือ port-forward ตามรูปแบบที่เลือก
- container image ใน Docker ของ VM กับ image cache ใน containerd ของ K3s node ไม่ใช่ที่เก็บเดียวกันโดยอัตโนมัติ
- port และ volume mappings ต้องวางแผนตั้งแต่สร้าง cluster และเก็บเป็น configuration ที่สร้างซ้ำได้

### 9.3 กำหนด access path ก่อนติดตั้ง Argo CD

การเปิด `http://localhost:8888` ต้องระบุด้วยว่า localhost ของใคร ตัวอย่าง `kubectl port-forward` บน VM หลักทำให้ VM หลักเรียก loopback นั้นได้ ส่วน browser บนเครื่องจริงต้องมีช่องทางเข้า VM เพิ่ม

เลือกแนวทางเข้าถึงแอปและ Argo CD ที่ทำซ้ำได้: port-forward สำหรับ lab เริ่มต้น หรือ K3d port mapping ร่วมกับ Service/Ingress สำหรับการเปิดใช้งานที่ไม่ต้องค้าง terminal เดิม และอธิบายทั้งเส้นทางได้ [S11]

### แบบฝึกหัด

1. ติดตั้ง Docker, kubectl และ K3d ใน VM ด้วย script
2. สร้าง cluster ชื่อทดสอบ ตรวจ node Ready
3. deploy manifest ที่เข้าใจแล้วจากบท 7
4. เข้าถึงแอปจาก VM หลักและจากจุดที่ผู้ตรวจจะใช้งาน
5. หยุด port-forward แล้วอธิบายว่าทำไม endpoint ที่อาศัยมันหาย
6. ลบเฉพาะ cluster ทดลองแล้วสร้างกลับด้วย config เดิม

### เกณฑ์ผ่าน

อธิบายความต่าง K3s/K3d ได้โดยไม่ใช้คำว่า “อันหนึ่งเบากว่า” อย่างเดียว และชี้ทุก port hop จาก client ถึงแอปได้

## บท 10 — GitOps และ Argo CD

### 10.1 แยก Git, CI, CD และ GitOps

| เรื่อง | หน้าที่ | ตัวอย่างใน lab |
|---|---|---|
| Git | เก็บประวัติและ version ของไฟล์ | commit ที่เปลี่ยน image v1 เป็น v2 |
| CI | ตรวจ/build/test เมื่อ source เปลี่ยน | build image ใหม่จาก source ของแอปเอง เป็นส่วนเสริม |
| CD | ส่งการเปลี่ยนไป environment | นำ manifest ใหม่ไปใช้ใน dev |
| GitOps | ใช้ Git เป็น desired state และมี controller reconcile | Argo CD ตรวจ Git แล้วทำ cluster ให้ตรง |

Argo CD ทำหน้าที่อ่าน source, render configuration ตามเครื่องมือที่ใช้, เปรียบเทียบกับ live state และ sync โดยใช้ Kubernetes API ส่วน node runtime เป็นผู้ดึง image จาก registry เพื่อรัน workload

**GitHub เก็บ manifest ส่วน Docker Hub เก็บ image** การแก้ code ใน Git ไม่ทำให้มี image ใหม่เอง และการ push image tag เดิมเข้า registry ก็ไม่ได้ทำให้ Argo CD เปลี่ยน manifest หรือ restart Pod ให้อัตโนมัติตามโจทย์

### 10.2 Desired state และ reconciliation

ถ้า Git ระบุ `image: ...:v1` และ cluster ยังเป็น v1 จะถือว่าตรงกันในส่วนนี้ เมื่อแก้ Git เป็น v2 และ push แล้ว Argo CD ตรวจพบความต่าง จากนั้น auto-sync ปรับ Deployment และ Deployment controller จัด rollout

Argo CD มีรอบตรวจ Git หรือรับ webhook ตาม configuration จึงไม่ต้องเปลี่ยนทันทีในเสี้ยววินาที และต้องแยก **เห็น commit ใหม่แล้ว** จาก **apply แล้ว** และ **แอปใหม่พร้อมจริงแล้ว** [S12]

### 10.3 Argo CD components ที่ควรรู้

- API/server: UI/API สำหรับดูและจัดการ Argo CD
- repo-server: เข้าถึง repository และสร้าง manifests จาก source
- application-controller: เปรียบเทียบ desired/live state และควบคุมการ sync
- CRD `Application`: Kubernetes custom resource ที่บอกว่าจะอ่านอะไรและ deploy ไปที่ไหน

เรียนบทบาทพอใช้ debug ไม่ต้องลงลึก internal architecture ทั้งหมด การเปิด UI ได้ยังไม่ยืนยันว่า repo-server clone Git ได้

### 10.4 ฟิลด์ของ Application ที่ต้องอธิบาย

| ฟิลด์ | ความหมาย | อาการเมื่อผิด |
|---|---|---|
| `metadata.namespace` | ที่เก็บ Application เช่น argocd | Argo CD อาจไม่ได้เฝ้าดู namespace นั้นตาม setup |
| `source.repoURL` | Git repository ของ manifests | clone ไม่ได้/URL ผิด/credential ผิด |
| `source.targetRevision` | branch, tag หรือ revision ที่ติดตาม | push คนละ branch แล้วแอปไม่เปลี่ยน |
| `source.path` | โฟลเดอร์ภายใน repo ที่มี manifests | หาไฟล์ผิดชุดหรือไม่มี resource |
| `destination.server` | API ของ cluster ปลายทาง | ไปผิด cluster หรือเข้าถึงไม่ได้ |
| `destination.namespace` | namespace ของแอป เช่น dev | แอปอยู่ผิด namespace |
| `project` | Argo CD AppProject ที่ใช้ควบคุมขอบเขต | policy อาจไม่อนุญาต source/destination |
| `syncPolicy` | วิธี sync และตัวเลือกประกอบ | ต้องกด manual หรือ drift ไม่ถูกแก้ตามที่คาด |

### 10.5 Auto-sync, self-heal และ prune ไม่ใช่ค่าเดียวกัน

- **Auto-sync:** ให้ Argo CD apply การเปลี่ยนตาม desired state โดยไม่ต้องกด Sync ทุกครั้ง
- **Self-heal:** ให้ Argo CD แก้ live resource ที่ถูกเปลี่ยนออกจาก Git กลับไปตาม desired state เมื่อเปิดใช้
- **Prune:** ลบ resource ที่ Argo CD เคยจัดการแต่ถูกเอาออกจาก desired state เมื่อเปิดใช้ ต้องรู้ขอบเขตการลบ

Auto-sync จำเป็นต่อผลลัพธ์ deploy อัตโนมัติในโจทย์ ส่วน self-heal/prune เป็น policy ที่ควรเรียนและเลือกอย่างมีเหตุผล ไม่ใช่ข้อความบังคับแยกใน subject [S12]

**Kubernetes self-healing กับ Argo CD self-heal ต่างกัน:** Pod ของ Deployment หายแล้ว ReplicaSet สร้างใหม่ได้แม้ไม่ได้เปิด Argo selfHeal ส่วนคนแก้ replicas หรือ image ของ Deployment ผิดจาก Git เป็นกรณี drift ที่ Argo CD self-heal ใช้จัดการ

### 10.6 Sync กับ Health แยกกัน

| สถานะ | ตอบคำถามอะไร |
|---|---|
| Synced / OutOfSync | live configuration ตรงกับ desired configuration ใน Git หรือไม่ |
| Healthy / Progressing / Degraded ฯลฯ | resources มีสุขภาพและพร้อมใช้งานอย่างไร |

แอปอาจ Synced แต่ image ดึงไม่ได้ หรือยัง Progressing จึงต้องตรวจทั้งสถานะและ response จริง ห้ามใช้หน้าจอสีเขียวจุดเดียวแทนการทดสอบทั้งหมด

### แบบฝึกหัด

1. สร้าง namespace `argocd` และ `dev`, ติดตั้ง Argo CD จากแหล่งทางการแบบระบุ version ที่บันทึกไว้
2. รอ CRDs/controllers พร้อมก่อนสร้าง Application ที่พึ่ง CRD
3. สร้าง public GitHub repository ชื่อมี login แล้ว push Deployment/Service ของแอป v1
4. สร้าง Application ที่ source path และ destination ถูก พร้อม auto-sync
5. ตรวจ deployed image, rollout และ response v1
6. เปลี่ยน manifest เป็น v2, commit, push; สังเกต revision, sync, rollout และ response v2
7. ใช้ `git revert` แล้ว push เพื่อกลับ v1 ตาม desired state ใน Git
8. ถ้าเปิด selfHeal ให้ทดลองแก้ live replicas ชั่วคราวและดูว่ากลับตาม Git

การ bootstrap Argo CD/Application ด้วย script หรือ kubectl เป็นเรื่องปกติ แต่หลังเชื่อม GitOps แล้ว การสาธิต v1→v2 ต้องไม่ใช้ `kubectl set image` หรือ apply แอปจาก local file เพื่อทำให้ดูเหมือน Argo CD ทำเอง

### เกณฑ์ผ่าน

อธิบายได้ตั้งแต่ commit ถึง response ใหม่ ระบุว่าใครอ่าน Git, ใครเรียก Kubernetes API, ใครดึง image และใครจัด rollout ถ้า push แล้วไม่เปลี่ยน ต้องไล่ตรวจทั้ง 4 ขั้นนี้ได้

## บท 11 — ประกอบ Part 3 และตรวจครบตามโจทย์

### ชิ้นงานที่ควรมี

| ตำแหน่งตัวอย่าง | หน้าที่ |
|---|---|
| `p3/scripts/install-tools.sh` | ติดตั้ง packages/tools บน VM ตามเงื่อนไขที่ตรวจ |
| `p3/scripts/setup.sh` | สร้าง K3d cluster, namespaces, Argo CD และ Application |
| `p3/scripts/verify.sh` | ตรวจสถานะและการเข้าถึง ไม่แก้ version แทน Git |
| `p3/confs/k3d.yaml` | cluster/port/volume configuration หากเลือกใช้ config file |
| `p3/confs/argocd-application.yaml` | แหล่ง Git และปลายทาง dev |
| path ใน public GitHub repo | desired Deployment/Service ของแอปจริง |

ชื่อไฟล์ในตารางเป็นข้อเสนอ ไม่ใช่ชื่อบังคับ ยึดโฟลเดอร์ p3/scripts และ p3/confs ตามโจทย์

### แยกบทบาท repository

| Repository | ต้องมีอะไร | สิ่งที่อย่าลืม |
|---|---|---|
| Repository ส่งงาน | p1, p2, p3, bonus และวิธีสร้างระบบ | งานสำคัญต้องอยู่ในสิ่งที่ส่งตรวจ |
| Public GitHub ที่ Argo CD ติดตาม | manifests จริงตาม source.path | ชื่อมี login และ branch/path ตรง |
| Local GitLab ในโบนัส | manifests สำหรับ workflow เดียวกัน | ต้องใช้ local instance จริง |

Repository ส่งงานกับ public GitHub จะเป็นอันเดียวกันหรือแยกกันขึ้นกับวิธีจัดงาน แต่ต้องทำตาม visibility/name/path ที่โจทย์กำหนด อย่าให้ Application ชี้ repo ที่ไม่มีไฟล์ deploy จริง

### Demo ที่ต้องทำได้

1. แสดง script ติดตั้งเครื่องมือและ version ที่ใช้
2. แสดง K3d cluster/node และ namespaces
3. แสดง Argo Application ที่ชี้ public GitHub repository ถูกต้อง
4. เรียกแอปและได้ v1
5. แก้ **remote desired state** เป็น v2 ผ่าน commit/push
6. แสดง revision ใหม่ที่ Argo CD เห็นและ auto-sync
7. รอ rollout พร้อมแล้วเรียกแอปได้ v2
8. ชี้ให้เห็นว่า workload อยู่ namespace dev

### เกณฑ์ผ่าน p3

สร้างใหม่ได้จาก scripts/confs, มี tools installer, repository public และชื่อถูก, deploy อัตโนมัติจริง, เวอร์ชันแอปต่างกันจริง และอธิบายทางเข้าถึงทั้ง UI/แอปได้

เก็บ p3 ที่ผ่านไว้ให้รันกับ GitHub ได้ต่อ แม้โบนัสจะเปลี่ยน source เป็น GitLab ใช้ config/profile แยกหรือ cluster แยกตามทรัพยากร ไม่แก้จน mandatory สาธิตไม่ได้

## บท 12 — Persistent storage, Helm และ credentials

### 12.1 ทำไมต้องเรียน storage ก่อน GitLab

เว็บตัวอย่างถูกสร้างใหม่จาก image ได้ง่าย แต่ GitLab มี repositories, users, database, secrets และ config ที่ต้องคงอยู่ ถ้าข้อมูลอยู่เฉพาะ filesystem ชั่วคราวของ Pod การ replace อาจทำให้สูญหาย

เรียน 5 อย่าง:

1. **Volume:** ที่ mount เข้า container และอายุข้อมูลขึ้นกับชนิด volume
2. **PersistentVolume (PV):** resource ที่แทน storage ที่จัดเตรียมให้ cluster
3. **PersistentVolumeClaim (PVC):** คำขอใช้ storage จาก namespace ของ workload
4. **StorageClass/provisioner:** วิธีจัดหา storage อัตโนมัติและคุณสมบัติที่เกี่ยวข้อง
5. **Reclaim policy และ backup:** ลบ PVC/cluster แล้วข้อมูลจะเป็นอย่างไร ต้องอ่านนโยบายจริง [S15]

เพิ่ม StatefulSet ระดับแนวคิด: เหมาะกับ workload ที่ต้องการ identity/storage ที่คงที่ แต่ไม่ได้ทำให้แอปมี persistence หรือ backup เองถ้าไม่ออกแบบ volume

**สำคัญใน K3d:** local-path/PVC อาจเก็บไฟล์อยู่ภายใน filesystem ของ node container การอยู่รอดเมื่อ restart Pod ไม่ได้แปลว่าอยู่รอดเมื่อลบ cluster ต้องวางแผน host/volume mapping และ backup แยกต่างหาก

### 12.2 Helm

Helm ช่วยติดตั้งชุด Kubernetes resources ที่มี parameters โดยใช้ chart และ values file:

| คำ | ความหมาย |
|---|---|
| Chart | ชุด templates/default values/metadata ของ package |
| Values | ค่าที่ใช้ปรับ templates สำหรับ environment |
| Release | installation ของ chart พร้อม configuration/version ที่ใช้ |
| Chart repository | ที่แจกจ่าย charts |
| Chart version | version ของ package chart |
| App version | version ของ software ที่ chart ติดตั้ง ไม่จำเป็นต้องมีเลขเดียวกับ chart |

ฝึก `helm repo add/update`, `helm search repo --versions`, `helm show chart`, `helm show values`, `helm template`, `helm upgrade --install`, `helm status`, `helm get values`, `helm list` และอ่าน rendered YAML ก่อนติดตั้งชุดใหญ่ [S16]

คำสั่ง rollback/uninstall ต้องเข้าใจผลต่อ stateful data ไม่ทดลองกับข้อมูลที่ต้องเก็บโดยไม่มีแผนกู้คืน

### 12.3 Credentials และ TLS เท่าที่ใช้

- root/admin password ของ GitLab ต่างจาก token ที่ Argo CD ใช้อ่าน Git
- เลือก read-only repository credential เช่น deploy token/deploy key ตามวิธีและ edition/version ที่รองรับ
- เก็บ Argo CD repository credential ใน namespace/configuration ที่ Argo CD ใช้ ไม่ใส่ secret ลง public GitHub
- HTTPS ด้วย private CA ต้องทำให้ client ที่เกี่ยวข้อง trust CA; SSH ต้องรู้จัก server host key
- Base64 ไม่ใช่ encryption; การลบ secret จาก commit ล่าสุดไม่ลบออกจาก Git history จึงควรไม่ commit ตั้งแต่ต้น

### แบบฝึกหัด

1. สร้าง workload ทดลองที่เขียนข้อมูลลง PVC
2. replace Pod แล้วตรวจข้อมูลยังอยู่
3. ระบุ storage อยู่ที่ไหนจริงและเกิดอะไรถ้าลบ K3d node/cluster โดยยังไม่ลบข้อมูลสำคัญเพื่อทดลอง
4. ติดตั้ง chart เล็กหนึ่ง release แล้วแก้ values และ upgrade
5. ใช้ `helm template` หา Service/Ingress/PVC ที่จะถูกสร้าง

### เกณฑ์ผ่าน

อธิบายได้ว่า data อยู่บน disk ของเครื่องไหน แยก restart Pod กับ delete cluster ได้ และอ่าน values ของ chart ก่อนติดตั้งเพื่อรู้ว่ากำลังเปิด component อะไร

## บท 13 — GitLab Bonus แบบเข้าใจทั้งระบบ

### 13.1 งานเพิ่มจาก Part 3 คืออะไร

แทนที่แหล่ง Git สาธารณะของการสาธิตด้วย GitLab ที่ติดตั้งใน lab เอง โดยยังคงวงรอบ commit → Argo CD → Deployment rollout → แอปเปลี่ยนเวอร์ชัน

การมีหน้า login GitLab อย่างเดียวไม่พอ ต้องสร้าง repository, push manifests, ให้ Argo CD อ่าน repository นั้น และเปลี่ยน v1/v2 ได้จริง ส่วน Docker image ยังคงใช้ public Docker Hub ตาม workflow เดิมได้ ไม่จำเป็นต้องสร้าง registry ใน GitLab

### 13.2 เข้าใจ components ตามวิธีติดตั้ง

| Component/ข้อมูล | หน้าที่ | เหตุผลที่ต้องรู้ |
|---|---|---|
| Web/API ของ GitLab | UI และ API | หน้าเว็บอาจพร้อมไม่เท่ากับทั้งระบบพร้อม |
| Git access / Gitaly | อ่านเขียน repositories | clone/push ต้องทำงานจริง |
| PostgreSQL | เก็บข้อมูลแอป | ต้องมี connection/storage/version compatible |
| Redis | cache/queue ที่ส่วนต่าง ๆ ใช้ | อาจเป็น dependency ของ background jobs |
| Background workers | งาน asynchronous เช่น Sidekiq | ดู log เมื่อ setup หรือ task ค้าง |
| Object storage | ข้อมูลบางประเภทตาม deployment model | chart ปัจจุบันมี requirement ที่ต้องเตรียม |
| Persistent data/config/secrets | รักษา state ของ instance | restart/rebuild ต้องไม่ทำให้ repo หายโดยไม่ตั้งใจ |

ไม่ต้องเชี่ยวชาญแต่ละฐานข้อมูลเพื่อเริ่ม แต่ต้องรู้ว่า dependency ใดทำให้ GitLab ยังไม่พร้อม

### 13.3 เลือกแนวทางติดตั้งก่อนเขียน setup

**ทางเลือก A: Official GitLab Helm chart** เหมาะเมื่ออยากฝึกการ deploy ระบบหลาย component บน Kubernetes ต้องอ่าน prerequisites, support matrix, dependencies, storage และ values ของรุ่นปัจจุบันให้ครบ

เอกสารทางการที่ตรวจครั้งนี้ระบุว่า chart ต้องใช้ **external PostgreSQL, Redis และ object storage** อย่าถือว่า tutorial เก่าที่ให้ chart สร้าง dependencies ทั้งหมดด้วย flags เดิมยังใช้ได้ คำว่า external ในบริบทนี้คือแยกจากตัว chart; topology และแนวทางที่รองรับต้องตรวจในเอกสารที่ใช้จริง สำหรับ lab ให้จัดบริการเหล่านี้อย่างชัดเจนและไม่เปลี่ยนงานไปพึ่ง cloud โดยไม่จำเป็น [S17]

เอกสาร chart กล่าวถึง cluster ขนาด 8 vCPU/30 GB RAM สำหรับค่าเริ่มต้น และบอกว่าสามารถลด configuration สำหรับ non-production ได้ ตัวเลขนี้ไม่ใช่ทรัพยากรที่โจทย์ 42 บังคับ และไม่ใช่การรับประกันว่า lab ที่ลดค่าใดก็ทำงานได้ [S18]

**ทางเลือก B: ใช้ official GitLab Linux-package container มาจัดเป็น workload ของ lab ใน namespace gitlab** เป็นทางเลือกเชิงออกแบบ lab ที่ต้องตรวจและทดสอบการรัน image บน Kubernetes เอง ไม่ใช่อ้างว่า Docker installation guide เป็น production Kubernetes deployment ที่รับรองอยู่แล้ว ต้องดู lifecycle, persistent paths, resource, permissions, shared memory และ external URL ตาม image/version ที่เลือก [S19]

โจทย์อนุญาตเครื่องมือที่จำเป็น จึงไม่บังคับว่าต้องใช้ chart แต่ไม่ควรเอา GitLab ไปเปิดด้วย `docker run` นอก cluster แล้วสร้าง namespace ว่างเพื่อให้ดูเหมือนทำ integration ครบ แนวทางหลักในแผนนี้คือติดตั้ง workload ใน `gitlab` ให้แสดงความสัมพันธ์กับ cluster ได้จริง

**การตัดสินใจที่แนะนำ:** สำรวจ RAM/CPU ก่อน จากนั้นเลือกวิธีติดตั้งเพียงวิธีเดียวและทำให้สร้างซ้ำได้ อย่าเสียเวลาเรียนสองวิธีจน Mandatory ไม่เสร็จ

### 13.4 Version ล่าสุดและการทำซ้ำ

โจทย์ต้องการ latest GitLab จากทางการ จึงต้องเช็ก release ที่มีจริงในวันที่เตรียมตรวจ บันทึก app version ที่เลือกและ chart version ถ้าใช้ Helm พร้อมตรวจ Kubernetes/Helm support matrix

ระหว่างพัฒนาใช้ version ที่ระบุชัดเพื่อสร้างซ้ำได้ ใกล้ส่งจึงตรวจว่าต้อง update ตาม latest requirement หรือไม่ แล้วทดสอบครบใหม่ อย่าใช้คำว่า `latest` ในไฟล์แล้วสรุปว่าเวอร์ชันตรงโดยไม่ได้ตรวจ image ที่รันจริง

### 13.5 Reachability จากแต่ละฝั่ง

| ผู้เรียก | ต้องเข้าถึงอะไร | วิธีพิสูจน์ |
|---|---|---|
| Browser ของผู้ใช้ | GitLab UI และ Argo CD UI | เข้า URL ที่กำหนดผ่าน network path จริง |
| Git CLI บน VM หลัก | GitLab clone/push endpoint | clone และ push repository ได้ |
| Argo CD repo-server ใน cluster | GitLab repository URL | Argo repository connection/clone สำเร็จ |
| Node runtime | Docker Hub image ที่ manifest ระบุ | Pod pull/run image ได้ |
| Client ทดสอบแอป | แอปใน namespace dev | HTTP response ตรง version หลัง sync |

เลือก hostname ภายใน lab เช่น `gitlab.iot.test` ได้ แต่ต้องจัด name resolution แยกสำหรับผู้ใช้/VM/Pod ตาม topology ไม่ใช่แก้ `/etc/hosts` ที่เครื่องหนึ่งแล้วคาดว่าทุกที่รู้จักชื่อนั้น

GitLab ต้องรู้ external URL ที่เหมาะกับทางเข้าถึง ถ้าเลือก hostname/port ไม่ตรง อาจ redirect ไป address ที่อีกฝั่งเข้าไม่ได้ โดยเฉพาะการใช้ `localhost` หรือ port-forward URL เป็น repository URL ให้ Pod

Argo CD ควรใช้ repository URL ที่ clone ได้โดยตรง GitLab บาง setup redirect เพื่อเติม `.git` แต่ Argo CD ไม่ตาม redirect นี้ จึงใช้ URL ลงท้าย `.git` ตามเอกสาร [S14]

ถ้าใช้ SSH ให้ตรวจ host key และ port mapping เพิ่ม การที่ SSH ของ VM ใช้ port 22 ไม่ได้หมายความว่า GitLab SSH ต้องเปิดบน host port 22 ตัวเดียวกัน หากเลือก Git over HTTPS ก็ไม่ต้องเพิ่ม SSH routing เพื่อผ่าน workflow นี้

### 13.6 แก้ปัญหา bootstrap ที่พึ่งตัวเอง

ถ้า repository มีอยู่ใน GitLab ที่ยังไม่ถูกสร้าง จะให้ Argo CD อ่าน repository นั้นเพื่อติดตั้ง GitLab ครั้งแรกไม่ได้ ให้มี bootstrap scripts/config ที่อยู่ใน repository ส่งงานก่อน

ลำดับที่ทำซ้ำได้:

1. เตรียม VM/tools/K3d cluster และ namespaces ที่จำเป็น
2. เตรียม storage และ dependencies ของ GitLab ตามวิธีที่เลือก
3. ติดตั้ง GitLab ใน namespace `gitlab`
4. รอ initialization/migration และตรวจ readiness ตาม endpoint/เอกสารของรุ่นนั้น
5. สร้าง user/project/repository และ credentials ที่ต้องใช้ ด้วยขั้นตอนหรือ API script ที่บันทึกไว้
6. push manifests เวอร์ชัน v1 เข้า GitLab ในเครื่อง
7. ติดตั้ง/ตั้งค่า Argo CD และ repository credential ให้เข้าถึงได้
8. สร้าง Application ที่ชี้ local GitLab, branch/path ถูก และ deploy ลง `dev`
9. ตรวจ auto-sync, rollout และ response v1
10. เปลี่ยนเป็น v2 ใน repository บน local GitLab แล้วตรวจทั้งวงรอบ

การใช้ API สร้าง project และ push repository อัตโนมัติเป็นทางเลือกเพื่อให้ setup ซ้ำง่าย ไม่ใช่ข้อบังคับแยกของ subject ต้องจัดการ token โดยไม่พิมพ์หรือ commit ลง source

### 13.7 สิ่งที่มักทำให้ติดตั้งไม่ผ่าน

- **Pending:** CPU/RAM ไม่พอตาม requests หรือ PVC ยัง bind ไม่ได้
- **OOMKilled:** memory เกิน limit/ทรัพยากรไม่พอ ไม่ใช่แก้ด้วย restart อย่างเดียว
- **CrashLoopBackOff:** ดู logs และ previous logs อาจเป็น config/dependency/permission ไม่ใช่ทุกครั้งเป็น RAM
- **เริ่มนาน:** migration และ initialization ต้องใช้ readiness/startup timeout ที่เหมาะสม
- **Ingress ชน:** GitLab chart กับ Traefik เดิมอาจเลือก controller/class/ports ไม่ตรง ให้เลือกชัดว่าใครรับ traffic
- **DNS ผิด:** Browser เข้าได้ แต่ repo-server ไม่รู้จัก hostname
- **TLS ผิด:** CA trust หรือ certificate hostname ไม่ตรง
- **Auth ผิด:** token scope/expiry หรือ key access ไม่พอ
- **ข้อมูลหาย:** persistence อยู่ผิดตำแหน่งหรือถูกลบไปพร้อม cluster/node container

### 13.8 Demo โบนัสและเกณฑ์ผ่าน

- แสดง GitLab version ที่รันจริงและหลักฐานแหล่ง official ที่ใช้เลือก version
- แสดง workload/resources ใน namespace `gitlab`
- เข้า UI และ clone/push local repository ได้
- แสดงว่า Argo Application ชี้ **local GitLab URL** ไม่ใช่ยังอ่าน GitHub
- เรียกแอปได้ v1, เปลี่ยน manifest และ push เข้า local GitLab, รอ auto-sync, เรียกแอปได้ v2
- restart Pod ตามแผนแล้ว repository/config ที่ตั้งใจเก็บยังอยู่
- แสดง scripts/config ที่สร้างระบบและ bootstrap กลับได้
- กลับไปสาธิต Mandatory p3 ผ่าน GitHub ได้จาก configuration ของ p3 ที่เก็บไว้

### สิ่งที่เรียนเพิ่มได้หลังโบนัสครบ

GitLab Runner, CI YAML, build/test/push image pipeline, registry, webhook, image scanning และ automated image update เป็นงานต่อยอด หากทำ pipeline ให้เรียนลำดับ source commit → build/test → publish image tag ใหม่ → update manifest → Argo sync พร้อมสิทธิ์ของแต่ละระบบ อย่าให้ pipeline กับ Argo CD แย่งกันแก้ live Deployment โดยไม่มี source of truth ชัดเจน

## บท 14 — ทดสอบการสร้างซ้ำ ฝึก debug และซ้อมตรวจ

### 14.1 ทดสอบสามระดับ

**ระดับ configuration:** ตรวจว่า Vagrantfile/YAML/scripts อ่านได้ ชื่อ/IP/namespace/repo/path/version สอดคล้องกัน และไม่มี secret ที่ไม่ควรอยู่ใน Git

**ระดับ platform:** VM, services, nodes, DNS, storage และ controllers พร้อมตามลำดับ ไม่ใช่เพียง installer จบ exit 0

**ระดับผลลัพธ์ผู้ใช้:** SSH เข้าได้, Host เลือกแอปถูก, replicas พร้อมครบ และ push Git แล้ว response เปลี่ยนเวอร์ชันโดยอัตโนมัติ

ทำ smoke checks เท่าที่พิสูจน์ requirement และความเสี่ยงจริง ไม่ต้องสร้างระบบทดสอบใหญ่เกินโปรเจกต์

### 14.2 ฝึก debug จากนอกเข้าใน

1. **จุดที่เรียก:** คำสั่ง curl/browser ทำงานบนเครื่องไหน ใช้ URL/Host/port อะไร
2. **Name resolution:** ชื่อแปลงเป็น IP อะไรจากเครื่องหรือ Pod นั้น
3. **Transport:** route/port/firewall/port mapping ทำให้เชื่อมถึงไหม
4. **Routing:** IngressClass/controller/Host/path ถูกไหม
5. **Service:** port/targetPort/selector/namespace ถูกไหม
6. **Endpoints:** มี Ready endpoints หรือไม่
7. **Pod/app:** status/events/logs/probes/image/resources เป็นอย่างไร

ถ้าเป็น GitOps ให้เพิ่ม **remote commit → Argo source/path/credentials → sync → Kubernetes rollout → response** ก่อนสรุปว่าเป็นปัญหาของตัวแอป

### ตารางอาการและจุดตรวจแรก

| อาการ | ตรวจอะไรก่อน | สิ่งที่อย่าด่วนสรุป |
|---|---|---|
| VM ไม่เปิด | provider, box architecture, nested virtualization, resource | ไม่ใช่ Kubernetes เสมอ |
| SSH ไม่เข้า | IP/port/key/user, `vagrant ssh-config` | passwordless ไม่ได้แปลว่าไม่ต้องมี auth |
| Node NotReady | service logs, CNI, IP, disk/memory และ conditions | Ready ไม่ได้ขึ้นอยู่กับชื่อ role เพียงอย่างเดียว |
| Pod Pending | Events, requests, node capacity, PVC, scheduling constraints | image ผิดมักเป็นคนละขั้น |
| ImagePullBackOff | tag, registry access/auth, architecture, network | สร้าง image ใน host Docker แล้วไม่ได้อยู่ใน node เสมอ |
| CrashLoopBackOff | logs, previous logs, exit code, config/probes | ไม่ใช่ทุกครั้งคือ RAM ไม่พอ |
| OOMKilled | limits, actual memory use, node pressure | restart ซ้ำไม่ได้แก้ sizing |
| Service ไม่มี endpoints | labels/selectors, namespace, readiness | Pod Running ไม่ยืนยัน Ready |
| Ingress ได้ 404 | Host/path/class และ controller ที่รับ request | อาจเป็น request ไม่ match rule |
| Proxy ได้ 502/503 | backend port, endpoints, app readiness/logs | HTTP code จริงขึ้นกับ controller/config |
| Argo clone ไม่ได้ | DNS/network/TLS/auth/repoURL `.git` | browser เปิด GitLab ได้ยังไม่พอ |
| Push แล้วไม่ deploy | remote branch/path, revision, auto-sync, reconciliation/error | local commit อย่างเดียว Argo ไม่เห็น |
| Synced แต่เว็บเสีย | Health, rollout, Events, app response | Synced ไม่เท่ากับใช้งานได้ |
| GitLab repo หายหลังสร้างใหม่ | PVC/volume mapping, reclaim/backup | persistence ไม่ใช่ backup |

### 14.3 Rebuild ที่ควรซ้อม

- ทำบน lab ของตัวเองและสำรอง stateful data ที่ต้องเก็บก่อนลบ
- เริ่มจาก VM ที่มี prerequisite พื้นฐานตาม README แล้วรัน scripts ตามลำดับ
- ถ้า instruction บอกให้ clone/push หรือเตรียม credential ให้ทำตามเอกสารนั้นและตรวจว่าไม่มีขั้นตอนสำคัญตกหล่น
- ใช้ wait/readiness ที่มี timeout แทนแก้ด้วยเวลารอคงที่ที่ไม่รู้เหตุผล
- จำลองไม่มี local image cache หรือบันทึกอย่างชัดเจนว่า network/download ยังเป็น prerequisite
- แยก cleanup ของแต่ละ part ไม่ลบ cluster/VM/volume อื่นที่ไม่เกี่ยวข้อง
- ตรวจว่าไม่ต้อง copy/paste token หรือไฟล์ที่หลงอยู่นอก repository โดยไม่มีขั้นตอนสร้าง

### 14.4 README ที่ควรมี

อธิบาย prerequisites และ versions, topology, วิธีเริ่มแต่ละ part, วิธีตรวจผล, URLs/ports, วิธีจัดการ credentials, วิธีหยุดและ cleanup, ข้อมูลที่ต้องเก็บก่อนลบ, ปัญหาที่พบบ่อย และวิธีสาธิตโบนัสโดยยังตรวจ mandatory ได้

README ไม่ควรมีเพียงคำสั่งติดตั้ง ต้องอธิบายเหตุผลของ configuration ที่เลือก เช่นทำไมใช้ network interface นี้ ทำไม map port นี้ และข้อมูล GitLab อยู่ที่ไหน

## 4. Roadmap รายสัปดาห์

ตัวอย่างนี้ใช้เวลาประมาณ 12 ชั่วโมงต่อสัปดาห์ ปรับให้เร็วหรือช้าตามเกณฑ์ผ่าน ไม่ต้องย้ายไปบทถัดไปเพียงเพราะถึงวันที่กำหนด

| สัปดาห์ | เนื้อหา | ชิ้นงานเมื่อจบ |
|---|---|---|
| 1 | บท 0–1 และเริ่ม Network | topology, version checklist, shell script และ Git workflow |
| 2 | จบ Network/SSH และเริ่ม Vagrant | VM เข้าถึงได้พร้อมอธิบาย IP/port/Host |
| 3 | จบ Vagrant และ Container/YAML | multi-machine config, เว็บใน container, อ่าน manifest ได้ |
| 4 | Kubernetes พื้นฐานและ K3s | p1 ผ่าน: 2 nodes Ready และ SSH/IP/name ถูก |
| 5 | Deployment/Service/probes | 3 replicas พร้อมและแก้ selector/port ผิดได้ |
| 6 | Ingress/Part 2 และเริ่ม K3d | p2 ผ่านและมี cluster K3d ทดลอง |
| 7 | GitOps/Argo CD | GitHub v1→v2 เปลี่ยนแอปอัตโนมัติ |
| 8 | จบ p3, Storage และ Helm | p3 สร้างซ้ำได้ พร้อม storage/Helm lab |
| 9 | GitLab install/dependencies/DNS | GitLab local clone/push และ Argo เชื่อมได้ |
| 10 | Bonus v1→v2/persistence/rebuild | bonus ผ่านทั้ง workflow |
| 11–12 | เวลาสำรองตามปัญหาจริงและ defense | rebuild สำเร็จ, mandatory ไม่เสีย, ตอบคำถามได้ |

หาก Linux/Docker พื้นฐานแน่น ให้ลดเวลาบท 1 และ 4 ตามผลทดสอบ แต่ยังควรทำแบบฝึกหัดเรื่อง network, kubectl context, selectors, Argo reconciliation และ GitLab reachability เพราะเป็นปัญหาคนละชั้นกับการใช้ Docker Compose ทั่วไป

### รูปแบบการเรียนหนึ่งครั้ง 2 ชั่วโมง

| เวลา | ทำอะไร |
|---|---|
| 0–20 นาที | อ่านแนวคิดหนึ่งเรื่องและเขียนอธิบายด้วยภาษาตนเอง |
| 20–75 นาที | ทำ lab เล็กที่พิสูจน์เรื่องนั้น |
| 75–100 นาที | ทำให้เสียหนึ่งจุด อ่านอาการ แล้วแก้ |
| 100–120 นาที | สรุปคำสั่ง/สาเหตุ/วิธีตรวจ และ commit ชิ้นงานที่เหมาะสม |

ก่อนเลิกเรียนให้จดเพียง 4 บรรทัด: วันนี้เข้าใจอะไร, ทำอะไรได้จริง, ยังติดอะไรพร้อม error ที่เกี่ยวข้อง, รอบหน้าจะทดสอบสมมติฐานใด

## 5. Checklist สำหรับใช้ปิดแต่ละส่วน

### Mandatory Part 1

- [ ] ใช้ Vagrant สร้าง 2 เครื่องจาก configuration ใน p1
- [ ] ใช้ stable distribution ตามข้อกำหนด และบันทึกรุ่น/box/provider
- [ ] ชื่อ/hostname ของทีมและ suffix S/SW ถูก
- [ ] IP server `.110`, worker `.111` ถูก และรู้ interface ที่ใช้
- [ ] SSH เข้าได้ด้วย key โดยไม่กรอก password
- [ ] K3s server และ agent ทำงานใน cluster เดียวกัน
- [ ] kubectl ใช้งานได้และทั้งสอง node Ready
- [ ] ทรัพยากรที่เลือกทดสอบแล้ว พร้อมอธิบายความต่างจากคำแนะนำใน subject หากมี
- [ ] reboot/provision/rebuild lab ทำซ้ำได้

### Mandatory Part 2

- [ ] ใช้ 1 VM ตามชื่อ/IP/distribution ที่โจทย์กำหนด และ K3s server
- [ ] app1/app2/app3 มี response แยกกันชัด
- [ ] Host app1.com ไป app1
- [ ] Host app2.com ไป app2
- [ ] Host อื่นและเข้าผ่าน IP ได้ app3
- [ ] app2 มี 3 Ready replicas เมื่อระบบนิ่ง
- [ ] แสดง Ingress/IngressClass/controller และ Service mapping ได้
- [ ] p1/p2 ไม่ชน IP เมื่อสลับตรวจ

### Mandatory Part 3

- [ ] ทำใน VM และใช้ K3d/Docker โดยไม่ใช้ Vagrant สำหรับ cluster ส่วนนี้
- [ ] มี script ติดตั้ง tools/packages สำหรับการตรวจ
- [ ] มี namespace Argo CD และ namespace dev
- [ ] Public GitHub repository ชื่อมี login ตามโจทย์
- [ ] Application source URL/branch/path และ destination ถูก
- [ ] แอปสองเวอร์ชันต่างกันจริง; ถ้าทำเองมี public Docker Hub v1/v2
- [ ] เริ่ม v1 แล้ว push manifest v2 ไป GitHub
- [ ] Argo CD deploy อัตโนมัติ ไม่ apply image ใหม่ด้วยมือเพื่อช่วย demo
- [ ] ตรวจ revision, rollout, readiness และ response v2 จริง
- [ ] มีวิธีเข้า UI/แอปและสร้างระบบซ้ำจาก repository

### Bonus

- [ ] Mandatory ทุกส่วนผ่านและสาธิตได้ก่อน
- [ ] GitLab local ใช้ latest release ตามเงื่อนไข subject พร้อมตรวจ version จริง
- [ ] มี namespace gitlab และ workload/config ของ instance ชัดเจน
- [ ] เลือกวิธีติดตั้งพร้อม dependencies/resource/storage ที่ทดสอบแล้ว
- [ ] Client และ Argo CD เข้าถึง repository ได้จาก network ของตน
- [ ] Argo CD ชี้ local GitLab จริงและ deploy ไป dev
- [ ] Push v1→v2 ที่ local GitLab แล้วแอปเปลี่ยนอัตโนมัติ
- [ ] Persistence/backup/bootstrap อธิบายและทดสอบตามขอบเขตที่เลือก
- [ ] bonus/scripts และ bonus/confs มีสิ่งที่ต้องใช้สร้างระบบ
- [ ] config ของ p3 ยังใช้ GitHub เพื่อสาธิต mandatory ได้

### การส่งงานและความเข้าใจ

- [ ] root มี p1/p2/p3/bonus และแยก scripts/confs ถูก
- [ ] ไม่มี credentials จริงใน public repository
- [ ] ข้อมูลสำคัญไม่พึ่ง manual steps ที่ไม่มีบันทึก
- [ ] README บอก prerequisites, versions, start/verify/stop/cleanup และข้อมูลที่ต้องสำรอง
- [ ] อธิบายทุก manifest/script ที่เลือกใช้ได้

## 6. คำถามซ้อมตรวจพร้อมแนวคำตอบ

| คำถาม | แก่นคำตอบที่ต้องอธิบายด้วยตัวเอง |
|---|---|
| Vagrant กับ provider ต่างกันอย่างไร? | Vagrant จัดการ configuration/lifecycle; provider รัน VM จริง |
| VM กับ container ต่างกันอย่างไร? | VM มี guest kernel; container ใช้กลไกแยก process/network/filesystem บน kernel ที่แชร์ |
| K3s กับ K3d ต่างกันอย่างไร? | K3s คือ Kubernetes distribution; K3d สร้าง K3s nodes ใน Docker |
| ทำไม p3 ยังต้องมี VM? | ข้อกำหนดทั้งโปรเจกต์ยังใช้; p3 ยกเลิก Vagrant เฉพาะวิธีสร้าง lab ส่วนนั้น |
| ทำไม worker ต้องรู้ server URL/token? | ต้องหาจุดเข้าร่วมและยืนยันสิทธิ์ join cluster |
| ทำไม server ใน p2 รันแอปเองได้? | K3s server ปกติมี node components ที่รัน workload ได้ |
| kubectl เก็บ cluster state เองหรือไม่? | เป็น client; อ่าน/แก้ state ผ่าน API server |
| kubeconfig บอกอะไร? | cluster endpoint, credentials และ context/namespace |
| Pod กับ Deployment ต่างกันอย่างไร? | Pod คือหน่วย workload; Deployment ควบคุม Pod template/replicas/rollout ผ่าน ReplicaSets |
| ทำไมลบ Pod แล้วกลับมา? | controller ยังต้องรักษา desired replicas |
| Service หา Pod จากอะไร? | label selectors และสถานะ endpoints/readiness ตาม configuration |
| port กับ targetPort ต่างกันอย่างไร? | ฝั่ง client เรียก Service กับฝั่ง backend ที่ Service ส่งต่อ |
| ทำไมใส่ containerPort แล้วเข้าเว็บจาก host ไม่ได้? | เป็น metadata ของ port ไม่ได้ทำ port publishing หรือ Ingress ให้เอง |
| Ingress กับ controller ต่างกันอย่างไร? | อันหนึ่งประกาศกฎ อีกอันทำให้กฎมีผลต่อ request |
| ทำไม app3.com rule ไม่พอ? | โจทย์ต้องการ fallback สำหรับ Host อื่นทุกกรณีที่กำหนด ไม่ใช่ host เดียว |
| DNS กับ Host ต่างกันอย่างไร? | DNS ช่วยเลือก IP ปลายทาง; Host ให้ HTTP server เลือก virtual host |
| ทำไม browser เปิด GitLab ได้แต่ Argo clone ไม่ได้? | resolver/route/credential/TLS ของ Pod อาจต่างจากเครื่อง browser |
| Synced กับ Healthy ต่างกันอย่างไร? | configuration ตรงกับ Git กับสุขภาพ resources เป็นคนละมิติ |
| Argo CD build Docker image ให้หรือไม่? | ไม่ใช่หน้าที่หลักใน workflow นี้ ต้องมี build pipeline แยกถ้าต้องการ |
| การ push image tag เดิมพอให้ deploy ไหม? | Git desired state อาจไม่เปลี่ยน ต้องออกแบบ tagging/manifest update ให้เกิด rollout |
| Auto-sync/selfHeal/prune ต่างกันอย่างไร? | sync desired change / แก้ live drift / ลบ resource ที่เลิกประกาศตาม policy |
| ทำไมแก้ด้วย kubectl แล้วกลับค่าเดิม? | ถ้าเปิด Argo self-heal และมี drift ระบบปรับกลับตาม Git |
| เปลี่ยนกลับ v1 อย่างไรใน GitOps? | commit/revert desired manifest แล้ว push ให้ controller ทำตาม |
| GitLab Runner ต้องมีหรือไม่? | ไม่ได้บังคับใน subject นี้; ใช้เมื่อทำ CI jobs เพิ่ม |
| Helm chart version เท่ากับ GitLab version หรือไม่? | ไม่จำเป็น ต้องตรวจ appVersion/image version ของ release ที่เลือก |
| PVC หมายถึง backup แล้วหรือไม่? | ไม่ใช่; persistence, reclaim, node/cluster deletion และ backup เป็นคนละประเด็น |
| Restart Pod กับลบ K3d cluster ต่างกันอย่างไร? | scope ข้อมูลที่ถูกลบต่างกัน โดย storage อาจอยู่ใน node container |
| จะสร้าง GitLab จาก repo ใน GitLab ที่ยังไม่มีได้อย่างไร? | ต้องมี bootstrap source/scripts ที่เข้าถึงได้ก่อน GitLab พร้อม |

## 7. สิ่งที่ยังไม่ต้องเรียนให้ลึกเพื่อผ่าน subject นี้

ไม่จำเป็นต้องเรียน cloud provider ทั้งระบบ, Terraform, service mesh, custom Kubernetes operators, multi-cluster GitOps, high availability control plane, cluster autoscaler หรือระบบ monitoring ใหญ่ก่อนทำงานนี้

ไม่จำเป็นต้องทำ web application ซับซ้อนเพื่อแสดง v1/v2 เว็บที่ตอบชื่อแอป/เวอร์ชันชัดเจนเพียงพอสำหรับการเรียนส่วน infrastructure ตามโจทย์

ต้องรู้พอใช้งานจริงเรื่อง logs/events/resource usage แม้ไม่ติดตั้ง Prometheus/Grafana และต้องเข้าใจ network แม้ไม่ลงรายละเอียด CNI implementation ทั้งหมด

## 8. เอกสารทางการอ่านตามบท

ลิงก์ต่อไปนี้เป็นแหล่งอ้างอิงที่ตรวจประกอบแผน ค่าตั้งต้นและ compatibility อาจเปลี่ยน ให้เปิดเอกสารตรง version ที่ติดตั้งเมื่อเริ่มลงมือ

| รหัส | อ่านตอน | เอกสารและสิ่งที่ควรอ่าน |
|---|---|---|
| S1 | บท 3 | [Vagrant Multi-Machine](https://developer.hashicorp.com/vagrant/docs/multi-machine) และ [Private Networks](https://developer.hashicorp.com/vagrant/docs/networking/private_network): scope ของ config, multi-VM, static IP |
| S2 | บท 0, 6 | [K3s Requirements](https://docs.k3s.io/installation/requirements): hardware, OS, ports และ network |
| S3 | บท 4 | [Docker: What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/): container เทียบ VM |
| S4 | บท 5, 6 | [K3s Architecture](https://docs.k3s.io/architecture) และ [Quick Start](https://docs.k3s.io/quick-start): server/agent/datastore และขั้นติดตั้ง |
| S5 | บท 5 | [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/): API/scheduler/controllers/node components |
| S6 | บท 7 | [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/): replicas, selectors, rollout |
| S7 | บท 7 | [Service](https://kubernetes.io/docs/concepts/services-networking/service/): selectors, ports, service types |
| S8 | บท 8 | [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/): host/path/backend/controller |
| S9 | บท 8 | [K3s Networking Services](https://docs.k3s.io/networking/networking-services): CoreDNS, Traefik, ServiceLB |
| S10 | บท 9 | [K3d Overview](https://k3d.io/stable/): K3d คืออะไรและ requirements |
| S11 | บท 9 | [K3d Exposing Services](https://k3d.io/stable/usage/exposing_services/): port mappings และวิธีเข้าถึงบริการ |
| S12 | บท 10 | [Argo CD Automated Sync](https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/): auto-sync/selfHeal/prune/reconciliation |
| S13 | บท 10–11 | [Argo CD Getting Started](https://argo-cd.readthedocs.io/en/stable/getting_started/): install/access/create application |
| S14 | บท 13 | [Argo CD Private Repositories](https://argo-cd.readthedocs.io/en/stable/user-guide/private-repositories/): credentials, TLS/SSH, GitLab .git redirect |
| S15 | บท 12 | [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/): PV/PVC/lifecycle/reclaim |
| S16 | บท 12 | [Using Helm](https://helm.sh/docs/intro/using_helm/): chart/release/values/upgrade |
| S17 | บท 13 | [Deploy GitLab Helm chart](https://docs.gitlab.com/charts/installation/deployment/): dependencies และ values ของรุ่นปัจจุบัน |
| S18 | บท 0, 13 | [GitLab chart: cluster setup](https://docs.gitlab.com/charts/installation/cloud/): resource assumptions และ Kubernetes support matrix |
| S19 | บท 13 | [GitLab Docker installation](https://docs.gitlab.com/install/docker/) และ [configuration](https://docs.gitlab.com/install/docker/configuration/): official Linux-package container/external URL |
| S20 | บท 7 | [Liveness/Readiness/Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/): การตรวจสุขภาพต่างชนิด |
| S21 | บท 7, 13 | [Resource Management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/): requests/limits/CPU/memory |
| S22 | บท 10 | [Argo CD Declarative Setup](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/): Application/source/destination |
| S23 | บท 10 | [Argo CD Resource Health](https://argo-cd.readthedocs.io/en/stable/operator-manual/health/): สถานะสุขภาพ resources |
| S24 | บท 10 | [Argo CD Architecture](https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/): repo-server/application-controller/API |

## 9. เริ่มลงมือวันนี้

1. อ่าน requirement ในหัวข้อ 2 แล้วทำ checklist ของตน
2. เขียน topology และตรวจว่า VM/provider เปิด VM ทดลองได้
3. ฝึก Linux/service/logs และ network ตามบท 1–2 จนตรวจ IP, route, port และ HTTP Host ได้
4. สร้าง Vagrant 2 เครื่องโดยยังไม่ลง Kubernetes
5. เมื่อชื่อ/IP/SSH ผ่าน จึงติดตั้ง K3s และทำ p1 ให้จบ

แผนนี้ตรวจความครบถ้วนเทียบกับ subject และเอกสารทางการแล้ว แต่ตัวอย่าง configuration เป็นแบบฝึกหัด ยังไม่ใช่ผลรับรองว่ารันผ่านบน hardware/provider/versions ของผู้อ่าน ต้องทดสอบตามเกณฑ์ของแต่ละบทกับ lab จริง
