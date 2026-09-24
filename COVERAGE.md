# Inception-of-Things (IoT) - Content Coverage & Traceability Matrix

> **เวอร์ชันเอกสารอ้างอิง:**
> - `en.subject.pdf` Version 4.0 (Official 42 Subject)
> - `eval.pdf` Scale for Project Inception-of-Things (Official 42 Intra Scale Sheet)
> - `Inception-of-Things-Learning-Plan-TH.md` (แผนการเรียน 15 บท ภาษาไทย)
> - `AGENT.md` (ข้อกำหนดและเกณฑ์ความสมบูรณ์ระดับ Production)

---

## 1. ภาพรวมการครอบคลุม (Summary of Coverage)

| หมวดหมู่ (Category) | จำนวนในเอกสารต้นฉบับ | จำนวนในแอปพลิเคชัน | สถานะความครอบคลุม |
|---|:---:|:---:|:---:|
| **Modules (โมดูลการเรียนรู้)** | 15 บท (บท 0 - 14) | 15 โมดูล (`m00` - `m14`) | 100% ครบถ้วน |
| **Lessons (บทเรียนทางเทคนิค)** | 30 หัวข้อหลัก | 30 บทเรียน (`m00-l01` - `m14-l02`) | 100% ครบถ้วน (ไม่มี placeholder) |
| **Lab Exercises (แบบฝึกหัดปฏิบัติจริง)** | 30 ขั้นตอนปฏิบัติ | 30 รายการ (แยก VM/Node บริบทชัดเจน) | 100% ครบถ้วน |
| **Interactive Checklist Items** | 60+ รายการตรวจสอบ | 60 รายการ (Concept / Practice / Verification) | 100% ครบถ้วน |
| **Subject Requirements (`en.subject.pdf`)** | ทุกข้อกำหนด Chapter II - VII | 35 ข้อกำหนดแบ่งตาม Stage ชัดเจน | 100% ครบถ้วน |
| **Evaluation Items (`eval.pdf`)** | 5 หมวด + 6 Checkpoints | ครบทุกหมวด พร้อมเกณฑ์ "Evaluation stops here" | 100% ครบถ้วน |
| **Defense Questions & Traps** | 16 คำถามหลัก | 16 ข้อพร้อมคำตอบแนวทาง + คีย์เวิร์ด + กับดัก | 100% ครบถ้วน |
| **Troubleshooting Scenarios** | 12 เคสปัญหาจริง | 12 รายการครอบคลุม Vagrant, K3s, Ingress, Argo, GitLab | 100% ครบถ้วน |
| **Official References (แหล่งอ้างอิง)** | 21 แหล่ง (S1 - S21) | 21 รายการเชื่อมโยง HashiCorp, K3s, K8s, Argo CD, Helm, GitLab | 100% ครบถ้วน |

---

## 2. การแมป Subject Requirements (`en.subject.pdf` v4.0)

### 2.1 Chapter II: General Instructions (`general`)
| Requirement ID | คำอธิบายใน Subject | โมดูลที่เกี่ยวข้อง | วิธีการตรวจสอบในระบบ |
|---|---|---|---|
| `req-gen-01` | ใช้ Virtual Machine เท่านั้นใน Part 1 และ Part 2 | `m01`, `m02`, `m03`, `m06` | ตรวจสอบ Vagrantfile ว่าสร้าง VM ผ่าน VirtualBox โดยไม่ใช้ Docker container |
| `req-gen-02` | ต้องมี RAM ขั้นต่ำ 512MB ต่อ VM และต้องเปิด SSH ได้ | `m02`, `m03` | ตรวจ `vb.memory = "1024"` หรือ `"512"` และทดสอบ `vagrant ssh <name>` |
| `req-gen-03` | ใช้ K3s (Lightweight Kubernetes) เป็น distribution หลัก | `m01`, `m04`, `m05` | ตรวจ `k3s --version` ภายใน guest VM |
| `req-gen-04` | กำหนด static IP และ network interfaces ในโหมด private network อย่างถูกต้อง | `m02`, `m03`, `m05` | ตรวจสอบ subnet `192.168.56.0/24` และ flag `--flannel-iface` ใน Vagrantfile / scripts |
| `req-gen-05` | โครงสร้างโฟลเดอร์ต้องแยกตาม Part: `p1/`, `p2/`, `p3/` (และ `bonus/` ถ้าทำ) | `m03`, `m06`, `m09`, `m13`, `m14` | ตรวจสอบโครงสร้าง root git repository |

---

### 2.2 Chapter III: Mandatory Part 1 - K3s and Vagrant (`p1`)
| Requirement ID | คำอธิบายใน Subject | โมดูลที่เกี่ยวข้อง | วิธีการตรวจสอบในระบบ |
|---|---|---|---|
| `req-p1-01` | VM ตัวแรกชื่อ `wilS` (Server / Controller) มี IP `192.168.56.110` | `m03`, `m04` | รัน `ip addr show` บน `wilS` ตรวจสอบ IP interface `192.168.56.110` |
| `req-p1-02` | VM ตัวที่สองชื่อ `wilSW` (Agent / Worker) มี IP `192.168.56.111` | `m03`, `m05` | รัน `ip addr show` บน `wilSW` ตรวจสอบ IP interface `192.168.56.111` |
| `req-p1-03` | รัน K3s server mode บน `wilS` และ worker mode บน `wilSW` | `m04`, `m05` | ตรวจ `systemctl status k3s` (wilS) และ `systemctl status k3s-agent` (wilSW) |
| `req-p1-04` | ตรวจสอบโหนดสำเร็จ: `kubectl get nodes -o wide` แสดงทั้ง 2 โหนด พร้อม Ready status | `m05` | รัน `kubectl get nodes -o wide` บน `wilS` ต้องเห็น `wilS` (control-plane) และ `wilSW` (worker) |
| `req-p1-05` | Node IP ในคอลัมน์ `INTERNAL-IP` ต้องเป็น `192.168.56.x` ไม่ใช่ NAT `10.0.2.15` | `m04`, `m05` | ตรวจสอบคอลัมน์ INTERNAL-IP ใน `kubectl get nodes -o wide` |
| `req-p1-06` | Worker ต่อเข้า Server ด้วย Token อัตโนมัติ ไม่ต้องกรอกด้วยมือ | `m05` | ตรวจ shell provisioning script ใน Vagrantfile ว่ามีการแชร์ node-token ผ่าน `/vagrant` หรือ SSH keyless |
| `req-p1-07` | ติดตั้งและรันอัตโนมัติ 100% ผ่านคำสั่ง `vagrant up` เพียงคำสั่งเดียว | `m03`, `m05` | รัน `vagrant destroy -f && vagrant up` แล้วตรวจสอบว่า cluster พร้อมใช้งานทันที |

---

### 2.3 Chapter IV: Mandatory Part 2 - K3s and Three Web Applications (`p2`)
| Requirement ID | คำอธิบายใน Subject | โมดูลที่เกี่ยวข้อง | วิธีการตรวจสอบในระบบ |
|---|---|---|---|
| `req-p2-01` | ใช้ VM เพียงตัวเดียวชื่อ `wilS` รัน K3s server ที่ IP `192.168.56.110` | `m06` | ตรวจ Vagrantfile ใน `p2/` และทดสอบ `vagrant up` |
| `req-p2-02` | รันเว็บแอปพลิเคชัน 3 ตัว (`app1`, `app2`, `app3`) แต่ละตัวมีหน้าเว็บและข้อความต่างกัน | `m06`, `m07` | ตรวจ Kubernetes manifests สำหรับ Deployment/Service ของทั้ง 3 แอป |
| `req-p2-03` | มี Ingress Controller (Traefik ในตัว K3s) กำหนดเส้นทางการเข้าถึง | `m07`, `m08` | ตรวจสอบ Ingress manifest (`app-ingress.yaml`) และ `kubectl get ingress` |
| `req-p2-04` | Host routing: ส่งคำขอไปยัง `app1.com` ให้แสดงผลหน้าเว็บของ `app1` | `m08` | `curl -H "Host: app1.com" http://192.168.56.110` |
| `req-p2-05` | Host routing: ส่งคำขอไปยัง `app2.com` ให้แสดงผลหน้าเว็บของ `app2` | `m08` | `curl -H "Host: app2.com" http://192.168.56.110` |
| `req-p2-06` | Fallback routing: คำขอที่ไม่ระบุ Host หรือระบุ Host อื่น ให้ตกไปที่ `app3` | `m08` | `curl http://192.168.56.110` และ `curl -H "Host: whatever.com" http://192.168.56.110` ต้องได้ผลลัพธ์ของ `app3` |
| `req-p2-07` | จัดการ manifest ทั้งหมดและ deploy อัตโนมัติผ่าน provisioning script ใน Vagrantfile | `m06`, `m08` | รัน `vagrant up` ใน `p2/` แล้วทดสอบ curl ทันทีโดยไม่ต้องรันคำสั่งมือใน VM |

---

### 2.4 Chapter V: Mandatory Part 3 - K3d and Argo CD (`p3`)
| Requirement ID | คำอธิบายใน Subject | โมดูลที่เกี่ยวข้อง | วิธีการตรวจสอบในระบบ |
|---|---|---|---|
| `req-p3-01` | ไม่ใช้ Vagrant / VirtualBox ใน Part 3 ให้ใช้ **k3d** บนเครื่อง host โดยตรง | `m09` | รัน `k3d cluster list` บนเครื่อง host ตรวจสอบ cluster ทำงานบน Docker |
| `req-p3-02` | มี script สร้าง k3d cluster และ forward port 80/443 และ 8080/8888 | `m09` | ตรวจสอบไฟล์ shell script ใน `p3/` เช่น `setup.sh` |
| `req-p3-03` | สร้าง 2 Kubernetes namespaces: `argocd` และ `dev` | `m10`, `m11` | `kubectl get namespaces` ต้องมี `argocd` และ `dev` |
| `req-p3-04` | ติดตั้ง Argo CD ลงใน namespace `argocd` และเข้าถึง Web UI ได้ | `m10` | ตรวจสอบ `kubectl get pods -n argocd` และเปิด `http://localhost:8080` |
| `req-p3-05` | ดึง initial admin password ของ Argo CD ออกมาได้ถูกต้อง | `m10` | รันคำสั่งดึง secret `argocd-initial-admin-secret` และถอด base64 |
| `req-p3-06` | เชื่อมต่อ Argo CD เข้ากับ Public GitHub Repository ผ่าน GitOps Application manifest | `m11` | ตรวจสอบ `Application` CRD ใน `argocd` namespace และ status `Synced` / `Healthy` |
| `req-p3-07` | แอปพลิเคชันถูก deploy ลงใน namespace `dev` และแสดงผลข้อความ version 1 (v1) | `m11`, `m12` | `curl http://localhost:8888` ต้องได้ข้อความระบุ v1 |
| `req-p3-08` | เมื่อ push การแก้ไข manifest เป็น version 2 (v2) ขึ้น GitHub, Argo CD sync อัตโนมัติ | `m12` | แก้ tag/config บน Git -> push -> รอ sync หรือกด sync -> `curl http://localhost:8888` ต้องได้ v2 |
| `req-p3-09` | สามารถอธิบายหลักการ GitOps, Reconciliation loop, Desired vs Live state ได้ชัดเจน | `m11`, `m12` | การทดสอบปากเปล่ากับ Evaluator ตามชุดคำถาม Defense |

---

### 2.5 Chapter VI: Bonus Part - GitLab with K3d (`bonus`)
| Requirement ID | คำอธิบายใน Subject | โมดูลที่เกี่ยวข้อง | วิธีการตรวจสอบในระบบ |
|---|---|---|---|
| `req-bonus-01` | ติดตั้ง Local GitLab instance ภายใน cluster บน namespace `gitlab` | `m13` | ตรวจสอบ `kubectl get pods -n gitlab` แสดง Pods ของ GitLab |
| `req-bonus-02` | ติดตั้งผ่าน Helm Chart หรือ K8s manifest อย่างถูกต้อง | `m13` | ตรวจสอบ `values.yaml` และคำสั่ง `helm install gitlab ...` หรือ manifest |
| `req-bonus-03` | ปรับแต่ง resource configuration (CPU/RAM) ไม่ให้เครื่อง crash | `m13` | ตรวจสอบว่าปิด component หนักที่ไม่จำเป็น (เช่น Prometheus, Runner) ใน values.yaml |
| `req-bonus-04` | เข้าใช้งาน Web UI ของ GitLab ภายใน local machine ได้ | `m13` | เปิด browser เข้า URL ของ GitLab (เช่น `http://gitlab.local:8080`) |
| `req-bonus-05` | สร้าง project repository ภายใน local GitLab เพื่อเก็บ manifests ของ `app` | `m13` | ตรวจสอบโปรเจกต์และ commit history บน local GitLab UI |
| `req-bonus-06` | ตั้งค่า Argo CD ให้ sync กับ Private/Local GitLab แทน GitHub ภายนอก | `m13` | ตรวจสอบ Application CRD ของ Argo CD ว่าชี้ไปที่ GitLab URL ใน cluster พร้อม credentials |
| `req-bonus-07` | ทดสอบ GitOps flow แบบ isolated: push commit ไปที่ local GitLab -> Argo CD sync สู่ `dev` | `m13` | แก้ไฟล์บน local GitLab -> Argo CD ตรวจจับและ deploy อัตโนมัติสำเร็จ |

---

### 2.6 Chapter VII: Submission & Peer-Evaluation (`submission`)
| Requirement ID | คำอธิบายใน Subject | โมดูลที่เกี่ยวข้อง | วิธีการตรวจสอบในระบบ |
|---|---|---|---|
| `req-sub-01` | มีไฟล์และโฟลเดอร์ครบตามข้อกำหนด (`p1/`, `p2/`, `p3/`, `bonus/`) ใน Git Repository | `m14` | ตรวจสอบความถูกต้องของ Git repository structure ก่อน push |
| `req-sub-02` | ไม่มีไฟล์ขยะ (cache, `.vagrant/`, `.DS_Store`, VirtualBox disk images) ใน git | `m03`, `m14` | ตรวจสอบ `.gitignore` และ `git status` |
| `req-sub-03` | ผ่านเกณฑ์การตอบคำถามใน Eval Sheet พร้อมสาธิต command และแก้ปัญหาเฉพาะหน้าได้ | `m14` | จำลองการประเมินในหน้า `/defense` ครบทุกหัวข้อ |

---

## 3. การแมปเกณฑ์การประเมิน 42 Intra Scale Sheet (`eval.pdf`)

| หมวดใน `eval.pdf` | หัวข้อตรวจสอบหลัก | เงื่อนไขยุติการประเมิน ("Evaluation stops here") | บทเรียนและโมดูลรองรับ |
|---|---|---|---|
| **Preliminaries** | - มีไฟล์ครบใน Git repository<br>- ห้ามโกง (Cheat flag)<br>- ตรวจสอบว่าไม่ใช่การ mock | หากพบการทุจริต หรือไม่มีไฟล์งานจริงใน repository | `m00`, `m14` |
| **Part 1: K3s and Vagrant** | - รัน `vagrant up`<br>- ตรวจ `wilS` (192.168.56.110) และ `wilSW` (192.168.56.111)<br>- ตรวจ `kubectl get nodes -o wide` บน wilS<br>- ตรวจสอบ network interface (eth1/enp0s8 ไม่ใช่ eth0/NAT) | หาก Node ไม่ขึ้น Ready, ไม่ได้อยู่คลัสเตอร์เดียวกัน, หรือ IP เป็น NAT IP | `m03-l01`, `m03-l02`, `m04-l01`, `m04-l02`, `m05-l01`, `m05-l02` |
| **Part 2: K3s and Three Web Apps** | - รัน `vagrant up`<br>- ตรวจสอบ 3 Deployments / Services (`app1`, `app2`, `app3`)<br>- ตรวจ Ingress Controller<br>- ทดสอบ `app1.com`, `app2.com`<br>- ทดสอบ Default/Fallback routing สู่ `app3` | หากการเข้าถึงผ่าน Host หรือ Fallback ไปยัง app3 ล้มเหลว | `m06-l01`, `m06-l02`, `m07-l01`, `m07-l02`, `m08-l01`, `m08-l02` |
| **Part 3: K3d and Argo CD** | - ตรวจสอบคลัสเตอร์ k3d บน Docker<br>- ตรวจ namespaces (`argocd`, `dev`)<br>- เข้า Argo CD Web UI และอธิบายหน้าจอ<br>- ตรวจสอบ App v1 ผ่าน curl<br>- แก้ไข Git เป็น v2 แล้วตรวจสอบการ sync อัตโนมัติ | หากนักเรียนไม่เข้าใจการทำงานของ Argo CD, เข้า UI ไม่ได้, หรือ v1 -> v2 ไม่ sync อัตโนมัติ | `m09-l01`, `m09-l02`, `m10-l01`, `m10-l02`, `m11-l01`, `m11-l02`, `m12-l01`, `m12-l02` |
| **Bonus Part: GitLab** | - ตรวจสอบว่า Mandatory ผ่านสมบูรณ์ 100% ก่อน<br>- ตรวจสอบ GitLab namespace บน k3d<br>- เปิด GitLab Web UI<br>- ทดสอบ push commit สู่ local GitLab repository<br>- ตรวจสอบ Argo CD sync สู่ `dev` | หาก Mandatory มีข้อผิดพลาดแม้แต่ข้อเดียว ห้ามตรวจ Bonus | `m13-l01`, `m13-l02` |

---

## 4. แผนการเรียน 15 โมดูล 30 บทเรียน (`Inception-of-Things-Learning-Plan-TH.md`)

| Module ID | ชื่อโมดูลภาษาไทย | Lesson 1 ID & Title | Lesson 2 ID & Title | Stage |
|---|---|---|---|:---:|
| `m00` | บทนำและภาพรวมโปรเจกต์ | `m00-l01`: ทำความเข้าใจเป้าหมายและโครงสร้างโปรเจกต์ IoT | `m00-l02`: การเตรียม Environment และเครื่องมือพื้นฐาน | `general` |
| `m01` | พื้นฐาน Virtualization และ Containerization | `m01-l01`: สถาปัตยกรรม Virtualization และ Vagrant | `m01-l02`: Container Architecture และ Kubernetes เบื้องต้น | `general` |
| `m02` | Vagrant และระบบเครือข่ายสำหรับคลัสเตอร์ | `m02-l01`: พื้นฐานไวยากรณ์ Vagrantfile และ Multi-Machine Setup | `m02-l02`: ระบบเครือข่าย Host-Only และ Routing ระหว่าง VM | `general` |
| `m03` | การตั้งค่าสภาพแวดล้อม Part 1 | `m03-l01`: โครงสร้างโปรเจกต์ `p1/` และการเขียน Vagrantfile | `m03-l02`: การเขียน Shell Provisioning Scripts สำหรับ Controller และ Worker | `p1` |
| `m04` | K3s Controller Node (Server) | `m04-l01`: สถาปัตยกรรม K3s และการติดตั้ง Server Node (`wilS`) | `m04-l02`: การจัดการ Kubeconfig, Token และ Flannel Interface | `p1` |
| `m05` | K3s Worker Node และการรวมคลัสเตอร์ | `m05-l01`: การติดตั้ง Agent Node (`wilSW`) และการ Join Cluster | `m05-l02`: การตรวจสอบความถูกต้องและการทดสอบ Cluster Resiliency | `p1` |
| `m06` | สภาพแวดล้อม Part 2 และ K8s Application Basics | `m06-l01`: การปรับแต่ง Vagrantfile สำหรับ Single-Node K3s ใน `p2/` | `m06-l02`: การเขียน Kubernetes Manifests: Pod, Deployment, Service | `p2` |
| `m07` | Ingress Controller และ Service Routing | `m07-l01`: หลักการทำงานของ Traefik และ Ingress Controller บน K3s | `m07-l02`: การกำหนดค่า Ingress Rules และ Host-based Routing | `p2` |
| `m08` | การทดสอบและการส่งมอบ Part 2 | `m08-l01`: การทดสอบ Host-based Routing และ Default Fallback (`app3`) | `m08-l02`: การทำ Automation 100% ผ่าน Provisioning Script ใน Part 2 | `p2` |
| `m09` | K3d และ Container-in-Docker Architecture | `m09-l01`: ความแตกต่างระหว่าง K3s และ K3d บน Docker Engine | `m09-l02`: การสร้าง K3d Cluster ด้วยคำสั่ง CLI และการ Forward Port | `p3` |
| `m10` | การติดตั้งและการกำหนดค่า Argo CD | `m10-l01`: สถาปัตยกรรม Argo CD และการติดตั้งลงบน Namespace `argocd` | `m10-l02`: การจัดการ Initial Admin Secret และการเข้าถึง Web UI | `p3` |
| `m11` | GitOps Pipeline และ Application Controller | `m11-l01`: หลักการ GitOps และ Application Custom Resource Definition (CRD) | `m11-l02`: การเชื่อมโยง Git Repository กับเป้าหมาย Namespace `dev` | `p3` |
| `m12` | การทดสอบ Continuous Deployment และ Rollout | `m12-l01`: การทดสอบอัปเดตเวอร์ชัน v1 สู่ v2 ผ่าน Git Commit | `m12-l02`: การทดสอบ Automated Reconciliation และการ Rollback | `p3` |
| `m13` | Bonus: การติดตั้ง GitLab บน K3d | `m13-l01`: การติดตั้ง Local GitLab ผ่าน Helm หรือ Manifest บน K3d | `m13-l02`: การเชื่อมต่อ Argo CD เข้ากับ Private GitLab ในคลัสเตอร์ | `bonus` |
| `m14` | การเตรียมตัวสอบ Defense และเกณฑ์การประเมิน | `m14-l01`: ถอดรหัส Eval Sheet และประเด็นที่ถูกหักคะแนนบ่อย | `m14-l02`: การจำลองคำถาม Defense และแนวทางการตอบ | `submission` |

---

## 5. การแมป Troubleshooting Scenarios (`tb-01` ถึง `tb-12`)

| ID | อาการ (Symptom) | สาเหตุหลัก (Root Cause) | บทเรียนที่ครอบคลุม |
|---|---|---|---|
| `tb-01` | Worker node ไม่สามารถ Join เข้า Controller node ได้ (Connection refused/timeout) | Firewall/iptables บล็อกพอร์ต 6443 หรือ Token ผิดพลาด | `m04-l02`, `m05-l01` |
| `tb-02` | `kubectl get nodes -o wide` แสดง INTERNAL-IP เป็น `10.0.2.15` (NAT) | K3s Flannel interface ไปผูกกับ default NAT interface แทนที่จะเป็น private host-only | `m04-l02`, `m05-l01` |
| `tb-03` | Ingress Traefik ส่งกลับ `404 Not Found` เมื่อเรียก curl | Ingress host หรือ path ไม่ตรงกับ header หรือ Service selector ไม่จับ Pod | `m07-l02`, `m08-l01` |
| `tb-04` | Default fallback routing ไม่วิ่งเข้า `app3` | Ingress ขาด default backend rule หรือไม่มี Ingress rule ว่างสำหรับ catch-all | `m07-l02`, `m08-l01` |
| `tb-05` | K3d cluster สร้างไม่สำเร็จ ฟ้อง error Docker daemon | Docker service ไม่ได้เปิดทำงาน หรือ user ไม่มีสิทธิ์รัน docker socket | `m09-l01`, `m09-l02` |
| `tb-06` | Argo CD UI เปิดไม่ได้บน `http://localhost:8080` | Port forward ใน k3d หรือ kubectl port-forward หลุด/ไม่ได้เปิด | `m10-l01`, `m10-l02` |
| `tb-07` | ถอดรหัส initial admin password ของ Argo CD ไม่สำเร็จ (secret not found) | Secret ถูกลบไปแล้วหลังเปลี่ยนรหัส หรือ pod ยังสร้างไม่เสร็จ | `m10-l02` |
| `tb-08` | Argo CD แสดงสถานะ `OutOfSync` หรือ `Unknown` | Git URL เข้าถึงไม่ได้, repo เป็น private แล้วไม่ได้ใส่ token, หรือ manifest syntax ผิด | `m11-l01`, `m11-l02` |
| `tb-09` | Push commit v2 ไปแล้วแต่หน้าเว็บไม่เปลี่ยน | Auto-sync ไม่ได้เปิด หรือ polling interval (3 นาที) ยังไม่ถึงเวลา | `m12-l01`, `m12-l02` |
| `tb-10` | GitLab Pod บน k3d สถานะ `Pending` หรือ `OOMKilled` | ทรัพยากรเครื่อง RAM/CPU ไม่เพียงพอสำหรับการรัน GitLab stack เต็มรูปแบบ | `m13-l01` |
| `tb-11` | Argo CD ไม่สามารถ Clone repository จาก Local GitLab ได้ | ปัญหา DNS resolution ข้าม namespace หรือ self-signed TLS certificate ปฏิเสธการเชื่อมต่อ | `m13-l02` |
| `tb-12` | Vagrant ขึ้น error "A VirtualBox machine with the name already exists" | VM เก่าค้างใน VirtualBox จากการ terminate ไม่สมบูรณ์ | `m03-l01`, `m06-l01` |

---

## 6. การแมป Defense Questions & Traps (`def-01` ถึง `def-16`)

| ID | หัวข้อคำถาม | กับดักที่ Evaluator ชอบถาม (Evaluator Trap) | โมดูลที่ครอบคลุม |
|---|---|---|---|
| `def-01` | ความแตกต่างระหว่าง Virtual Machine กับ Container | หลอกถามว่า "ทำไมไม่ใช้ Docker รัน Part 1 เพื่อประหยัด RAM?" | `m01-l01`, `m01-l02` |
| `def-02` | ความแตกต่างระหว่าง K8s ตัวเต็ม กับ K3s | ถามว่า "K3s ตัดอะไรออกไปบ้าง และเอาอะไรมาแทน?" | `m01-l02`, `m04-l01` |
| `def-03` | การทำงานของ Flannel และ CNI ใน Kubernetes | ถามว่า "ทำไมโหนดถึง ping กันไม่ติดถ้าไม่ใส่ `--flannel-iface`?" | `m04-l02`, `m05-l01` |
| `def-04` | K3s Token เก็บไว้ที่ไหนและมีความสำคัญอย่างไร | ให้ชี้ตำแหน่ง token และถามว่า "ถ้า token หลุดไปจะเกิดอะไรขึ้น?" | `m04-l02`, `m05-l01` |
| `def-05` | ความแตกต่างระหว่าง ClusterIP, NodePort, LoadBalancer | ชี้ไปที่ Service ของแอปแล้วถามว่า "ทำไมถึงเลือก ClusterIP?" | `m06-l02`, `m07-l01` |
| `def-06` | Ingress Controller คืออะไร และ Traefik ทำงานอย่างไร | ถามว่า "ใครเป็นคนตรวจ HTTP Host header ระหว่าง Service กับ Ingress?" | `m07-l01`, `m07-l02` |
| `def-07` | การทำงานของ Fallback Routing สู่ `app3` | สั่งให้ curl ด้วย IP ตรงๆ และถามว่า "ทำไมถึงตกไปที่ app3 ได้?" | `m08-l01` |
| `def-08` | ทำไม Part 3 ถึงเปลี่ยนมาใช้ K3d แทน Vagrant? | ถามข้อดี-ข้อเสียของ Docker-in-Docker vs Full Hypervisor | `m09-l01`, `m09-l02` |
| `def-09` | GitOps คืออะไร และดียังไงเมื่อเทียบกับ CI/CD แบบเดิม? | ถามความต่างระหว่าง "Push-based CI/CD" กับ "Pull-based GitOps" | `m11-l01` |
| `def-10` | หน้าที่ของ Argo CD Controller และ Reconciliation Loop | ถามว่า "ถ้ามีคนแอบแก้ Pod ด้วย kubectl โดยตรง Argo CD จะทำอะไร?" | `m11-l01`, `m12-l02` |
| `def-11` | Desired State vs Live State ในมุมมองของ Argo CD | ให้อธิบายความหมายของสถานะ Synced และ Healthy บน Web UI | `m11-l02`, `m12-l01` |
| `def-12` | วิธีการดึง Admin Password ของ Argo CD อย่างปลอดภัย | สั่งให้สาธิตการดึงรหัสผ่านและอธิบายว่าทำไมถึงไม่ควรฮาร์ดโค้ด | `m10-l02` |
| `def-13` | ขั้นตอนการ Rollback แอปพลิเคชันผ่าน GitOps | ถามว่า "ถ้า v2 มีบั๊ก เราควรกดปุ่ม Rollback บน Argo UI หรือทำอะไรบน Git?" | `m12-l02` |
| `def-14` | สถาปัตยกรรมของ Local GitLab บน K3d | ถามว่า "ทำไม GitLab ถึงใช้แรมเยอะ และปรับจูนอย่างไรให้รันไหว?" | `m13-l01` |
| `def-15` | การตั้งค่า Authentication ระหว่าง Argo CD กับ Private GitLab | สั่งให้ชี้ตำแหน่ง Secret / Deploy Token ที่ใช้เชื่อมต่อ | `m13-l02` |
| `def-16` | สิ่งที่ทำให้การประเมินหยุดลงทันที (Evaluation Stops Here) | ให้นักเรียนบอกเงื่อนไข 5 ข้อที่จะทำให้ได้ 0 คะแนนทันที | `m14-l01`, `m14-l02` |

---

## 7. การแมป Official Document Citations (`S1` ถึง `S21`)

- `S1`: Vagrant Official Documentation - Vagrantfile Configuration & Multi-Machine
- `S2`: Vagrant Networking Documentation - Private Network & Static IP
- `S3`: VirtualBox Provider Documentation - Memory & CPU Customization
- `S4`: K3s Official Documentation - Architecture & High Availability
- `S5`: K3s Quick-Start Guide - Server Installation & Environment Variables
- `S6`: K3s Agent Configuration - Node Registration & Token Management
- `S7`: K3s Networking Options - Flannel Backend & Interface Selection
- `S8`: Kubernetes Official Documentation - Core Concepts & Architecture
- `S9`: Kubernetes API Reference - Pod, Deployment, and Service Specs
- `S10`: Kubernetes Ingress Documentation - Routing & Controller Behavior
- `S11`: Traefik Kubernetes Ingress Provider - Routing Rules & Priorities
- `S12`: K3d Documentation - Cluster Lifecycle & Port Forwarding
- `S13`: Docker Engine Documentation - Containers & Storage Drivers
- `S14`: Argo CD Official Documentation - Getting Started & Architecture
- `S15`: Argo CD Declarative Setup - Application CRD Reference
- `S16`: Argo CD Sync Strategies - Automated Sync & Self-Healing
- `S17`: GitOps Principles - OpenGitOps Specification
- `S18`: Helm Official Documentation - Helm Charts & Values Configuration
- `S19`: GitLab Omnibus / Helm Chart - Minimal Resource Installation
- `S20`: 42 Network Official Subject - Inception-of-Things Version 4.0
- `S21`: 42 Network Official Scale - Inception-of-Things Peer-Evaluation Sheet
