# AGENT.md — สร้างแอปเรียน Inception-of-Things ด้วย Next.js

## 1. ภารกิจ

คุณคือ AI coding agent ที่ได้รับมอบหมายให้สร้างเว็บแอปสำหรับเรียนและติดตามการทำโปรเจกต์ **Inception-of-Things (IoT)** ให้ครบตั้งแต่พื้นฐานจนถึง Mandatory Part 1–3 และ Bonus GitLab

ใช้เอกสารที่ผู้ใช้ให้มาสร้าง **แอปที่ใช้งานได้จริง พร้อมเนื้อหาการเรียนภาษาไทยครบถ้วนและ checklist ที่บันทึกความคืบหน้าได้** ผู้ใช้ต้องเปิดแอป อ่าน ฝึก ตรวจความเข้าใจ และติดตามสิ่งที่เหลือจนจบโปรเจกต์ได้

แอปนี้เป็นเครื่องมือเรียนด้วยตนเอง ใช้ **บท → หัวข้อ → แบบฝึกหัด → เกณฑ์ผ่าน** เป็นโครงสร้าง ผู้ใช้เรียนตามจังหวะของตน ไม่ต้องกำหนดวัน สัปดาห์ deadline หรือจำนวนชั่วโมงต่อวัน

งานของคุณเมื่อได้รับไฟล์นี้คืออ่านเอกสาร ออกแบบ ลงมือเขียนแอป เติมเนื้อหาทั้งหมด ทดสอบ และส่งมอบ ไม่จบเพียงเสนอแผนหรือทำ mockup

## 2. เอกสารที่ต้องอ่านก่อนเริ่ม

1. `Inception-of-Things-Learning-Plan-TH.md` — แผนเรียน เนื้อหา แบบฝึกหัด ข้อควรระวัง เกณฑ์ผ่าน คำถามซ้อมตรวจ และแหล่งอ้างอิง
2. ใบ subject ของ Inception-of-Things — ไฟล์ PDF ที่ผู้ใช้แนบ เช่น `en.subject.pdf`; ฉบับที่ใช้จัดทำคำสั่งนี้เป็น Version 4.0
3. คำสั่งเพิ่มเติมของผู้ใช้และข้อกำหนดของ repository ปัจจุบัน หากมี

ค้นหาไฟล์จาก attachments หรือ workspace ตามที่ได้รับ อย่ายึดว่าต้องอยู่ path ของเครื่องผู้จัดทำเอกสารนี้ อ่านทั้งสองไฟล์ให้ครบ รวมส่วน Bonus และ Submission; ตรวจภาพใน PDF เมื่อภาพมีรายละเอียดที่ข้อความดึงออกมาไม่ครบ

หากไฟล์จำเป็นหายหรือเปิดอ่านไม่ได้ ให้ระบุว่าไฟล์ใดขาด ทำงานส่วนที่ไม่ต้องเดาข้อมูลต่อได้ แล้วขอไฟล์นั้น ห้ามกล่าวว่าอ่านครบหรือสร้าง requirement ที่ไม่มีหลักฐาน

### การใช้แหล่งข้อมูล

- ใช้ **subject เป็นหลักสำหรับข้อกำหนดของโปรเจกต์**
- ใช้ **Learning Plan เป็นหลักสำหรับลำดับการเรียนและขอบเขตเนื้อหา**
- ใช้ **เอกสารทางการของเครื่องมือเพื่อเติมคำอธิบายและตรวจรายละเอียดตามเวอร์ชัน**
- คำขอของผู้ใช้เรื่องแอปมีผลเหนือรูปแบบตารางเวลาที่อยู่ใน Learning Plan: แปลง roadmap รายวัน/รายสัปดาห์เป็นลำดับบท ไม่ใส่ตารางเวลาลงแอป
- แยกให้ชัดว่าอะไรคือ “โจทย์บังคับ”, “โจทย์แนะนำ”, “แนะนำเพื่อเรียน” และ “เนื้อหาเสริม”
- หากข้อมูลขัดกัน ให้คงข้อกำหนด subject แล้วอธิบายความต่างพร้อมแหล่งอ้างอิง อย่าเปลี่ยน requirement เอง
- ตรวจเวอร์ชันจริงจาก PDF ที่ได้รับ หากต่างจาก Version 4.0 ให้อัปเดต mapping ตามไฟล์นั้นและรายงานความต่าง

## 3. ประสบการณ์ใช้งานที่ต้องได้

ผู้ใช้ควรทำได้ดังนี้:

1. เห็นว่าต้องเรียนเรื่องใดบ้างตามลำดับ และแต่ละเรื่องเกี่ยวกับส่วนใดของโปรเจกต์
2. เปิดบทเรียนแล้วอ่านคำอธิบายภาษาไทยได้ทันที โดยไม่ต้องคลิกออกไปเรียนพื้นฐานทั้งหมดจากเว็บอื่น
3. ดูตัวอย่างคำสั่ง/config พร้อมคำอธิบาย วิธีทดลอง และผลที่ควรได้
4. ติ๊กความคืบหน้าของหัวข้อ แบบฝึกหัด และ checklist ได้
5. แยกได้ว่าอ่านแล้ว เข้าใจแล้ว หรือลงมือทดสอบผ่านแล้ว
6. กลับมาเรียนต่อจากจุดเดิมหลัง reload หรือปิด browser
7. ค้นหาคำศัพท์ คำสั่ง หัวข้อ และปัญหาที่พบได้
8. ตรวจได้ว่าข้อกำหนด Mandatory/Bonus ข้อใดยังไม่ผ่าน และเปิดบทเรียนที่เกี่ยวข้องจากข้อนั้นได้
9. จดบันทึกสิ่งที่ยังไม่เข้าใจหรือหลักฐานผลทดลอง
10. ส่งออกและนำเข้าความคืบหน้าเพื่อสำรองหรือย้าย browser ได้

ไม่ต้องมีระบบสมาชิก ระบบชำระเงิน ระบบสังคม leaderboard, streak, calendar หรือ AI chat ที่ต้องใช้ API key เพื่อให้การเรียนหลักทำงาน

## 4. ขอบเขตเนื้อหาที่ต้องมีครบ

คงโมดูลหลัก 15 บทตามตาราง แยกแต่ละบทเป็นบทเรียนย่อยตามเนื้อหาจริงเพื่อให้อ่านง่าย ห้ามรวมทั้งบทใหญ่เป็นย่อหน้าสั้น ๆ แล้วถือว่าครบ

| ID | โมดูล | หัวข้อขั้นต่ำที่ต้องครอบคลุม |
|---|---|---|
| m00 | เตรียม lab และอ่านโจทย์ | requirement, เครื่องจริง/VM/container/Pod, architecture, nested virtualization, resource budget, version compatibility, topology, IP/port plan |
| m01 | Linux, Bash และ Git | filesystem, permissions, process/service, systemd/logs, resource inspection, variables/quotes/exit codes, pipes/heredoc, idempotency, readiness/timeout, Git commit/push/revert |
| m02 | Network, HTTP และ SSH | interfaces, IP/subnet/route/gateway, NAT/private/bridged network, TCP/ports/listen address, localhost, DNS กับ Host header, curl, SSH keys/known_hosts |
| m03 | VM และ Vagrant | box/provider/Vagrantfile, Ruby DSL เท่าที่ใช้, multi-machine scope, hostname/static IP, CPU/RAM, provisioning, synced folders, lifecycle และ rebuild |
| m04 | Container และ Docker | image/container/registry/repository/tag/digest, namespaces/cgroups ระดับแนวคิด, port publishing, volume, logs/exec, Dockerfile/build/push หากเลือกทำแอปเอง |
| m05 | Kubernetes และ YAML | desired/actual state, control plane/node components, Pod/ReplicaSet/Deployment/Service/Ingress/Namespace/ConfigMap/Secret, YAML, labels/selectors, kubectl/kubeconfig/context |
| m06 | K3s และจบ Part 1 | server/agent, URL/token, node IP/interface, services/logs/kubeconfig, install order, readiness, 2 nodes, SSH และ rebuild |
| m07 | Workloads และ Service | replicas/rollout, Pod replacement/container restart, selectors/EndpointSlices, port/targetPort/nodePort, Service types, probes, requests/limits, OOM/debug |
| m08 | Ingress และจบ Part 2 | reverse proxy, Ingress/controller/class, Host/path routing, fallback app3, app2 3 replicas, request path และ curl verification |
| m09 | K3d | K3s เทียบ K3d, Docker node containers/network, kubeconfig, port mappings, expose services, image cache และ cluster lifecycle |
| m10 | GitOps และ Argo CD | Git/CI/CD/GitOps, Git เทียบ image registry, reconciliation, components/Application/source/destination, auto-sync/selfHeal/prune, Synced/Healthy, v1→v2/revert |
| m11 | ประกอบและจบ Part 3 | tools installer, cluster/bootstrap scripts, argocd/dev, public GitHub/login in repo name, source path, app image versions, automatic demo และ reproducibility |
| m12 | Storage, Helm และ credentials | volume/PV/PVC/StorageClass/reclaim/backup, StatefulSet แนวคิด, K3d data location, chart/values/release/app version, template/upgrade, Secret/TLS/SSH credentials |
| m13 | GitLab Bonus | local GitLab/gitlab namespace, install choices/dependencies, latest version verification, resources/storage, DNS/external URL, Argo reachability/auth/.git URL, bootstrap, v1→v2, persistence และคง p3 ที่ใช้ GitHub |
| m14 | Rebuild, debug และ defense | layered troubleshooting, smoke checks, clean rebuild, README/submission, final checklist, คำถามซ้อมตรวจ และประเมินความพร้อม |

นอกจากนี้ต้องนำเนื้อหาต่อไปนี้จาก Learning Plan เข้ามาในแอปด้วย:

- ตารางอาการและแนวทาง debug
- checklist สำหรับปิดงานแต่ละส่วนและการส่งงาน
- คำถามซ้อมตรวจพร้อมแนวคำตอบ
- สิ่งที่ยังไม่จำเป็นต้องเรียนลึกเพื่อผ่าน subject
- เอกสารอ้างอิงและคำอธิบายว่าควรอ่านส่วนใด
- ข้อควรระวังและความเข้าใจผิดที่มีในแต่ละบท

จำนวน checklist ไม่ต้องตรึงเท่าจำนวนบรรทัดเดิม สามารถแยกข้อที่มีหลายพฤติกรรมเป็นข้อย่อย แต่ต้องตามกลับไปยังต้นฉบับได้และไม่ทำข้อกำหนดตกหล่น

## 5. มาตรฐานเนื้อหาของบทเรียน

ทุกบทเรียนย่อยต้องมีเนื้อหาจริง ไม่ใช้ lorem ipsum, “จะเพิ่มภายหลัง”, paragraph ที่เปลี่ยนแค่ชื่อเทคโนโลยี หรือปุ่มเปิดหน้าว่าง

จัดเนื้อหาตามลำดับที่เหมาะกับหัวข้อ โดยมีองค์ประกอบต่อไปนี้:

1. **ชื่อและเป้าหมาย:** เรียนจบแล้วอธิบายหรือทำอะไรได้
2. **พื้นฐานก่อนเรียน:** ลิงก์ไปบทที่เกี่ยวข้อง ไม่ต้องล็อกการเข้าถึง
3. **ใช้ตรงไหนในโปรเจกต์:** Foundation/P1/P2/P3/Bonus/Defense และ requirement ที่เกี่ยวข้อง
4. **คำอธิบายแนวคิด:** ภาษาไทยจากพื้นฐานไปเหตุผล ใช้ศัพท์อังกฤษประกอบเมื่อจำเป็นและนิยามเมื่อใช้ครั้งแรก
5. **ตัวอย่าง:** คำสั่ง, YAML, Vagrantfile, topology หรือตารางตามความเหมาะสม พร้อมอธิบายตัวเลือกสำคัญ
6. **แบบฝึกหัด:** prerequisites, รันที่ไหน, ทำอะไรตามลำดับ, ผลที่คาดหวัง และวิธีย้อน/เก็บกวาด lab เมื่อเกี่ยวข้อง
7. **วิธีตรวจ:** คำสั่งหรือสิ่งที่ต้องสังเกต อธิบายว่าผลแบบใดแปลว่าผ่าน
8. **ปัญหาที่พบบ่อย:** อาการ → สาเหตุที่เป็นไปได้ → วิธีพิสูจน์ → วิธีแก้
9. **คำถามทบทวน:** คำถามและแนวคำตอบที่เปิดดูได้ เหมาะกับการอธิบายตอน defense
10. **Checklist ประจำบท:** แยกความเข้าใจ การฝึก และการตรวจผล
11. **แหล่งอ้างอิง:** หัวข้อใน Learning Plan, หน้า subject และเอกสารทางการที่เกี่ยวข้อง

ใช้ข้อความหลักและตัวอย่างประกอบให้เรียนในแอปได้จริง เอกสารภายนอกมีไว้ขยายความ ไม่ใช้แทนบทเรียนทั้งหมด การ render Markdown ต้นฉบับรวมในหน้าเดียวไม่เพียงพอ

### มาตรฐานตัวอย่างทางเทคนิค

- ระบุ execution context เช่น VM หลัก, Vagrant server, worker, terminal ที่มี kubeconfig หรือ test Pod
- ระบุ assumptions และชื่อ resource/namespace ที่ต้องเปลี่ยนตาม lab
- รักษา indentation ของ YAML และ line breaks ของ shell
- แยก code ที่คัดลอกได้ออกจาก expected output; ปุ่ม copy ไม่คัดลอก output หรือ shell prompt ปะปน
- ตัวอย่าง output ต้องบอกว่าเป็นตัวอย่าง ไม่ใช่หลักฐานว่าทดสอบกับเครื่องผู้ใช้แล้ว
- คำสั่งลบ/cleanup ต้องระบุเป้าหมายและผลต่อข้อมูลไว้ใกล้คำสั่ง
- แอปแสดงคำสั่งและอธิบายให้ผู้ใช้รันใน lab; ไม่ต้องสร้าง terminal ที่รันคำสั่งบนเครื่อง/server ให้เอง
- ตรวจคำแนะนำที่ผูกกับ version จากเอกสารทางการ หากตรวจไม่ได้ ให้ระบุว่าเป็นข้อมูลอ้างอิงของเวอร์ชันใดแทนการอ้างว่าเป็นรุ่นล่าสุด

## 6. Requirement mapping จาก subject

หลังอ่าน PDF ให้สร้างรายการ requirement แบบมี stable ID พร้อมข้อความ, ประเภท, source page, บทเรียนที่เกี่ยวข้อง และวิธีตรวจผล ใช้รายการต่อไปนี้เป็นจุดตรวจขั้นต่ำและเทียบ PDF จริงอีกครั้ง

| กลุ่ม | รายการขั้นต่ำที่ต้องมี |
|---|---|
| General | ทำโปรเจกต์ใน VM, Mandatory ตามลำดับ p1→p2→p3, root folders p1/p2/p3/bonus, scripts/confs, ส่งสิ่งที่จำเป็นใน Git repository และตรวจบนเครื่องของกลุ่ม |
| P1 | Vagrant 2 เครื่อง, distribution stable ล่าสุดตามโจทย์, ชื่อฐานจาก login สมาชิก, hostname ลงท้าย S/SW, server 192.168.56.110, worker 192.168.56.111, network interface ตามข้อกำหนด, passwordless SSH, K3s controller/server กับ agent, ติดตั้งและใช้ kubectl |
| P1 advice | คำแนะนำทรัพยากร 1 CPU และ RAM 512/1024 MB ต้องติดป้ายว่าโจทย์แนะนำอย่างมาก พร้อมอธิบายว่าต้องเทียบ requirements ของ K3s เวอร์ชันจริง ไม่แอบเปลี่ยนเป็น hard requirement หรือรับรองว่าใช้ได้แน่ |
| P2 | 1 VM, latest stable distribution, loginS, IP .110, K3s server, 3 web apps, Host app1.com→app1, app2.com→app2, Host อื่น/เข้าผ่าน IP→app3, app2 3 replicas, แสดง Ingress ตอนตรวจ |
| P3 | K3d ใน VM โดยไม่ใช้ Vagrant สำหรับส่วนนี้, Docker, script ติดตั้งเครื่องมือระหว่างตรวจ, namespace สำหรับ Argo CD และ dev, public GitHub repo ที่ชื่อมี login สมาชิก, Argo CD deploy แอปใน dev อัตโนมัติ |
| P3 versions | ใช้แอป Wil หรือแอปตนเอง, สอง version ที่ต่างกัน; ถ้าทำเองต้องเป็น public Docker Hub พร้อม v1/v2, แอป Wil ใช้ port 8888, เปลี่ยน version ผ่าน GitHub แล้วพิสูจน์ app update อัตโนมัติ |
| Bonus | local GitLab, latest GitLab จาก official ตามโจทย์, namespace gitlab, เชื่อมกับ cluster, workflow ของ p3 ทำงานผ่าน local GitLab, ส่งใน bonus/, โบนัสตรวจเมื่อ Mandatory สมบูรณ์ |

ข้อที่เป็นเงื่อนไข เช่น “ถ้าทำแอปเอง” ต้องแสดงเงื่อนไขและจัดการสถานะไม่เกี่ยวข้องได้โดยมีเหตุผล ไม่บังคับผู้ที่เลือกแอป Wil ให้ทำ custom image repository

### ความแม่นยำที่ห้ามทำหาย

- app3 เป็น default/fallback ไม่ใช่มีแค่ host app3.com
- app2 มีสาม replicas ไม่ใช่ VM สามเครื่อง
- Part 3 ไม่ใช้ Vagrant สำหรับ cluster ส่วนนี้ แต่ยังมีข้อกำหนดทั้งโปรเจกต์ใน VM
- Argo CD deploy/reconcile manifests; ไม่ได้ build container image ให้เอง
- Synced ไม่เท่ากับ Healthy และ Pod Running ไม่เท่ากับเข้าเว็บได้
- Kubernetes สร้าง Pod ทดแทน กับ Argo CD self-heal เป็นคนละกลไก
- Ingress resource กับ Ingress controller เป็นคนละสิ่ง
- DNS, Host header และ localhost ของแต่ละ network namespace ต้องแยกกัน
- browser เปิด local GitLab ได้ ไม่รับประกันว่า Argo repo-server clone ได้
- persistence ผ่านการ replace Pod ไม่เท่ากับ backup หรือข้อมูลรอดจากการลบ K3d cluster
- Helm, GitLab Runner, CI pipeline, registry และ webhook ไม่ใช่ข้อบังคับทั้งหมดของโบนัส ให้ติดป้ายตาม subject จริง
- ตัวอย่างชื่อ namespace `argocd`, วิธีติดตั้ง และแนวปฏิบัติในแผน ไม่ควรถูกยกระดับเป็นข้อบังคับที่ PDF ไม่ได้ระบุ
- ข้อกำหนดโฟลเดอร์ p1/p2/p3/bonus เป็นของโปรเจกต์ IoT ที่ผู้ใช้กำลังเรียน ไม่ใช่บังคับให้ source ของแอป Next.js ต้องใช้โครงสร้างเดียวกัน

## 7. หน้าจอและ navigation

ใช้โครงสร้างเรียบง่ายที่รองรับการอ่านเนื้อหายาว:

### หน้าภาพรวม

- ภาพรวมลำดับบททั้งหมดและความเกี่ยวข้องกับแต่ละ Part
- ความคืบหน้าการเรียน แยกจากความพร้อมตาม checklist โปรเจกต์
- ปุ่ม “เรียนต่อ” ไปบท/หัวข้อที่เปิดล่าสุด
- บทถัดไปที่แนะนำจากลำดับและสิ่งที่ยังไม่เสร็จ
- สรุปสิ่งที่เหลือใน Mandatory และ Bonus แยกกัน
- ไม่มี progress จำลองหรือสถานะผ่านที่ติ๊กไว้ล่วงหน้า

### หน้าเส้นทางการเรียนและบทเรียน

- รายการบทเรียงตามแผนและขยายดูหัวข้อย่อยได้
- sidebar แสดงสถานะหัวข้อ ปิด/เปิดได้บนมือถือ
- หน้าบทเรียนมี breadcrumb, table of contents, เนื้อหา, code blocks, แบบฝึกหัด, checklist, notes และปุ่มก่อนหน้า/ถัดไป
- deep link เข้า lesson/section ได้โดยตรงและ reload ได้
- เปิดเนื้อหา Bonus ได้แม้ Mandatory ยังไม่ครบ แต่บอกเงื่อนไขประเมินโบนัสตาม subject
- แสดง prerequisite เป็นคำแนะนำ ไม่ใช้การล็อกหน้าหรือบังคับเรียนตามวัน

### หน้า checklist โปรเจกต์

- กลุ่ม General, P1, P2, P3, Bonus, Submission
- ทุกข้อมีคำอธิบาย วิธีตรวจผล ลิงก์ไปบทเรียน และ source reference
- แยก subject requirement ออกจากคำแนะนำและรายการเรียนเสริม
- ตัวกรองกลุ่ม/สถานะ และแสดงเฉพาะสิ่งที่ยังไม่ผ่านได้
- เปิด checklist item จาก search หรือ direct link ได้

### หน้าค้นหาและอ้างอิง

- ค้นหาชื่อบท เนื้อหาบทเรียน คำศัพท์ คำสั่ง checklist และ troubleshooting ได้ทั้งไทย/อังกฤษ
- ผลค้นหามี snippet และลิงก์ไปเนื้อหาจริง
- มี glossary ที่นิยามศัพท์และลิงก์บทที่ใช้
- มี troubleshooting ตามอาการ และหน้าคำถามซ้อมตรวจพร้อมแนวคำตอบ
- มีหน้าที่เปิด/ดาวน์โหลด subject และ Learning Plan พร้อมแหล่งอ้างอิงทางการ

### หน้าตั้งค่า/สำรองความคืบหน้า

- export/import JSON
- อธิบายว่าข้อมูลเก็บใน browser นี้และไม่ sync ข้ามเครื่องโดยอัตโนมัติ
- reset progress ต้องยืนยันและเสนอ export ก่อนล้างข้อมูล
- ถ้ามี theme toggle ต้องใช้งานได้จริงและจำค่าได้

ชื่อ route และการรวมหน้าที่หน้าที่ใกล้กันปรับได้ตามเหตุผล แต่ต้องเข้าถึงความสามารถทั้งหมดได้ชัดเจน

## 8. ความคืบหน้าและสถานะ

แยกสถานะการเรียนกับสถานะตรวจโปรเจกต์ อย่าติ๊กข้อกำหนดว่าผ่านเพียงเพราะผู้ใช้เปิดอ่านหน้าเว็บ

### การเรียน

- สถานะบทเรียน: `not-started`, `in-progress`, `completed`
- checklist ประจำบทใช้ stable item ID และติ๊ก/ยกเลิกได้
- การเปิดหน้าบทเรียนบันทึกตำแหน่งล่าสุดและทำให้เป็น in-progress ได้ แต่ไม่ mark completed เอง
- บทเรียน completed เมื่อ required learning items ของบทนั้นครบ หรือผู้ใช้ยืนยันจบในบทที่ไม่มีรายการ required; ใช้กติกาเดียวกันทุกหน้า
- หากผู้ใช้ยกเลิกรายการ required ที่เคยครบ ต้องอัปเดตสถานะและตัวเลขรวมทันที
- notes เป็นข้อความธรรมดาหรือ Markdown ที่ render อย่างปลอดภัย แยกตาม lesson/item

### Checklist โปรเจกต์

- ใช้สถานะ `not-started`, `in-progress`, `verified`, `not-applicable`
- `verified` หมายถึงผู้ใช้ยืนยันว่าทดลองผ่านเอง ไม่ใช่แอปตรวจ cluster อัตโนมัติ
- อนุญาต `not-applicable` เฉพาะ requirement ที่มีเงื่อนไขจริง พร้อมเหตุผล/ตัวเลือกแอปที่ทำให้ไม่เกี่ยวข้อง
- เพิ่มช่องผลทดลอง/บันทึกหลักฐานได้ แต่ไม่บังคับเก็บ token, password หรือ kubeconfig ลง notes

### สูตรความคืบหน้า

- ความคืบหน้าการเรียน = required learning items ที่ครบ / required learning items ทั้งหมด
- ความพร้อมแต่ละ Part = required subject items ที่ verified / required subject items ที่ applicable
- รายการแนะนำ/เนื้อหาเสริมแสดงแยก ไม่ทำให้เปอร์เซ็นต์ Mandatory ลดลง
- Bonus มีตัวเลขของตนเอง ไม่หักคะแนนการเรียนหรือความพร้อม Mandatory
- มีภาพรวม “ครบทั้งหมดรวมโบนัส” ได้ แต่ต้องแสดง Mandatory กับ Bonus แยกเสมอ
- เมื่อ denominator เป็นศูนย์ แสดง “ยังไม่มีรายการที่เกี่ยวข้อง” ไม่หารศูนย์หรือแสดงผ่านโดยไม่มีข้อ
- คำว่า “พร้อมตรวจตาม checklist ของคุณ” ใช้ได้เมื่อครบตามกติกา ห้ามรับรองว่าผ่านการประเมิน 42 แน่นอน

## 9. การจัดเก็บและ data model

ค่าเริ่มต้นให้เป็นแอปผู้ใช้คนเดียว ไม่ต้องมี backend/database/login หากไม่มีความต้องการเพิ่ม ใช้ localStorage สำหรับ progress, notes, settings และ last location โดยแยกจาก curriculum content

กำหนด data model อย่างน้อย:

- `Module`: id, order, title, stage, lessonIds
- `Lesson`: id, slug, moduleId, title, objectives, prerequisiteIds, content, exerciseIds, checklistIds, sourceRefs
- `Exercise`: id, lessonId, goal, prerequisites, executionContext, steps, expectedResult, verification, troubleshooting
- `LearningItem`: id, lessonId, text, required, kind
- `Requirement`: id, stage, title, detail, classification, applicabilityCondition, sourceRefs, lessonIds, verification
- `GlossaryEntry`: id, term, aliases, explanation, lessonIds
- `SourceRef`: sourceId, title, section/printedPage/pdfPage/url ตามชนิดเอกสาร
- `Progress`: schemaVersion, contentVersion, lessonStates, checkedLearningItemIds, requirementStates, notes, lastLocation, settings

ปรับ schema ได้ให้เข้ากับ implementation แต่ต้องรักษาความสัมพันธ์และความสามารถข้างต้น

### กติกา persistence

- IDs ต้องคงที่ ไม่ใช้ array index หรือสร้างจาก title ใหม่ทุกครั้งที่แก้ข้อความ
- อ่านข้อมูลเดิมให้เสร็จก่อนเขียนค่าเริ่มต้น ป้องกัน hydration ทำ progress เดิมถูกล้าง
- มี schema/content version และ migration ที่ไม่ลบความคืบหน้าเงียบ ๆ เมื่อเพิ่มบท
- รายการเก่าที่ยังไม่รู้จักเก็บในข้อมูลสำรองหรือแจ้งผู้ใช้ ไม่ทิ้งโดยไม่มีคำอธิบาย
- จัดการ JSON เสีย, storage ใช้งานไม่ได้/quota เต็ม และ import version ที่ไม่รองรับโดยไม่ทำให้แอปพัง
- export ต้องรวม progress, notes และ version ที่จำเป็น แต่ไม่รวม secrets หรือ binary เอกสารต้นฉบับ
- import ต้อง validate ขนาด/โครงสร้าง/version/IDs ก่อนเปลี่ยน state และให้ผู้ใช้ยืนยันการแทนที่ข้อมูลเดิม
- อย่า render imported notes เป็น raw HTML โดยไม่ sanitize

## 10. เทคโนโลยีและแนวทาง implementation

- ใช้ **Next.js + TypeScript + App Router**
- ถ้าเป็น repository ใหม่ เลือก stable versions ที่เข้ากันได้ในวันที่พัฒนา บันทึก lockfile และระบุ runtime ที่ใช้ใน README
- ถ้ามีโปรเจกต์อยู่แล้ว ตรวจ package manager, conventions และ components ที่มี แล้วต่อยอดโดยไม่สร้างแอปใหม่ซ้อนโดยไม่มีเหตุผล
- ใช้ Tailwind CSS สำหรับ styling ได้ และใช้ component library ที่เหมาะสมหรือที่มีอยู่แล้ว ไม่ต้องเพิ่มหลายชุด
- เก็บ curriculum เป็น typed data ร่วมกับ Markdown/MDX หรือ structured content blocks ที่แยกจาก UI และตรวจ schema ได้
- ใช้ rendering ที่เหมาะกับเนื้อหาคงที่ และแยก interactive parts สำหรับ progress/search/notes เป็น client components ตามความจำเป็น
- การอ่าน localStorage/browser APIs ต้องอยู่ฝั่ง client และจัดการ hydration ให้ถูกต้อง
- แปลง/จัดระเบียบข้อมูลจากเอกสารในขั้นพัฒนา ไม่บังคับให้ผู้ใช้ upload PDF หรือเรียก LLM เพื่อสร้างบทเรียนใหม่ทุกครั้งที่เปิดแอป
- ใช้ local search index ที่สร้างจากเนื้อหาจริงได้ ไม่ต้องพึ่ง hosted search
- บทเรียนหลักต้องอ่านได้โดยไม่ต้องมี third-party API key; external links ใช้ขยายความ
- ไม่ต้องสร้าง PWA/service worker/offline mode เว้นแต่ผู้ใช้ขอ อย่าอ้างว่า offline ได้ถ้าไม่ได้ทำและทดสอบ
- ไม่ต้องเชื่อม Kubernetes, Docker, GitHub หรือ GitLab account ของผู้ใช้เพื่อให้ learning/checklist ทำงาน
- Markdown/MDX ที่ใช้ควรมาจาก content ที่ตรวจแล้ว ไม่ compile หรือ execute arbitrary uploaded MDX ใน browser/server

เอกสาร framework สำหรับตรวจ implementation ตามเวอร์ชันที่เลือก:

- https://nextjs.org/docs/app
- https://nextjs.org/docs/app/getting-started/server-and-client-components

## 11. การออกแบบและ accessibility

ทำหน้าตาเป็นแอปอ่านบทเรียนและติดตามการฝึกที่ใช้งานได้นาน:

- ภาษาไทยเป็นหลัก ใช้ font/line-height/ความกว้างคอลัมน์ที่อ่านภาษาไทยยาว ๆ สบาย
- hierarchy ชัด มี sidebar, heading, spacing และ code blocks ที่แยกจากเนื้อหา
- desktop อ่านได้เต็มประโยชน์และ mobile มี navigation ที่ไม่บังบทเรียน
- code/table เลื่อนแนวนอนได้โดยไม่ทำทั้งหน้า overflow
- ใช้สีและ badge แยก Foundation, P1, P2, P3, Bonus แต่ไม่ใช้สีเป็นตัวบอกสถานะเพียงอย่างเดียว
- ใช้ native checkbox/button หรือ accessible component มี labels, keyboard interaction และ focus ที่มองเห็น
- details/accordion สำหรับเฉลยและข้อมูลเสริมต้องเปิดได้ด้วย keyboard และไม่ซ่อนคำอธิบายหลักทั้งหมดไว้หลังหลายชั้น
- มี loading/empty/error states ที่อธิบายสิ่งที่เกิดขึ้น เช่นหาไม่พบหรือบันทึกข้อมูลไม่ได้
- ปุ่มและ links ทุกตัวต้องทำงานจริง ไม่สร้างปุ่มตกแต่งหรือ progress/chart จำลอง
- ใช้ diagram เฉพาะเมื่อช่วยอธิบาย topology/flow และมีคำอธิบายข้อความประกอบ ไม่จำเป็นต้องติดตั้ง diagram engine เพียงเพื่อประดับหน้า
- ความสมบูรณ์ของเนื้อหา การอ่านง่าย และความถูกต้องของ checklist มาก่อน animation และลูกเล่น

## 12. ลำดับการทำงานของ AI

1. อ่าน source documents และสำรวจ repository/environment
2. สกัด modules, lessons, requirements, exercises, questions และ source references ให้ครบ
3. สร้าง content inventory/coverage matrix แสดงแต่ละหัวข้อในเอกสารสัมพันธ์กับ lesson/requirement ID ใด
4. แปลงส่วนตารางเวลาเป็นลำดับบท และจัด requirement/advice/optional ให้ถูก
5. วาง data model, routes และกติกา progress ก่อนเชื่อม UI
6. สร้างหนึ่งบทครบทุกองค์ประกอบเพื่อวางรูปแบบ แล้วใช้รูปแบบนั้นเติมทุกบทจริง
7. ทำภาพรวม การอ่านบทเรียน checklist ค้นหา glossary/troubleshooting/defense และ references
8. เพิ่ม persistence, notes, resume และ export/import
9. ตรวจ coverage เทียบเอกสารทั้งสองอีกครั้ง รวม Bonus และ Submission
10. ทดสอบ flows สำคัญ แก้ปัญหาที่พบ ตรวจ mobile/desktop และส่งมอบพร้อมวิธีรัน

ตัดสินใจเรื่อง routine implementation ตามคำสั่งนี้และบริบท ไม่ต้องหยุดถามความชอบย่อยทุกขั้น ถ้ามีข้อจำกัดจริงให้ระบุให้ชัดและทำส่วนที่ทำได้ต่อ โดยไม่กล่าวว่างานครบทั้งที่เนื้อหายังขาด

## 13. การตรวจคุณภาพก่อนส่งมอบ

ใช้คำสั่ง build/typecheck/lint ที่ตรงกับ Next.js และ tooling ของโปรเจกต์ ไม่สมมติว่าคำสั่งจาก tutorial รุ่นเก่ายังมีในเวอร์ชันที่เลือก

ทดสอบเฉพาะสิ่งที่ยืนยันพฤติกรรมสำคัญและป้องกันข้อมูลผู้ใช้สูญหาย:

- ทุกโมดูลมีบทเรียนจริง ไม่มี lesson, exercise หรือ checklist ที่เป็น placeholder
- IDs ไม่ซ้ำ references/prerequisites/lesson mappings ไม่ขาด และไม่มี required subject item ที่ไม่โยงกับเนื้อหา/วิธีตรวจ
- ทุก route/deep link เปิดโดยตรงและ reload ได้ รวมหน้า Bonus และ references
- checkbox และสถานะเปลี่ยนแล้วตัวเลขทุกหน้าตรงกัน
- reload แล้ว progress/notes/last location ยังอยู่ และ initial render ไม่เขียนทับข้อมูลเดิม
- ยกเลิก checklist แล้วสถานะ completed/verified และเปอร์เซ็นต์เปลี่ยนตามกติกา
- conditional requirements และ optional items ไม่ทำให้การคำนวณผิด
- export แล้ว import กลับได้เทียบเท่าเดิม; JSON เสียหรือ version ไม่รองรับไม่ล้างข้อมูลเดิม
- ค้นหาภาษาไทยและศัพท์อังกฤษเจอทั้งชื่อหัวข้อและเนื้อหา พร้อมลิงก์ถูกตำแหน่ง
- code copy, glossary links, source links, questions/answers และ reset confirmation ใช้งานได้
- mobile ไม่มีหน้า overflow จาก code/table และใช้ keyboard เดิน navigation/checklist ได้
- ไม่มี hydration errors หรือ browser console errors ที่มาจากฟีเจอร์หลัก

ใช้การทดสอบอัตโนมัติขนาดเล็กกับ progress calculations, persistence/import validation และ content-reference integrity ตามความจำเป็น ไม่ต้องเพิ่ม test suite ใหญ่ที่เพียงตรวจซ้ำข้อความคงที่ทุกย่อหน้า

## 14. Definition of Done

ถือว่างานเสร็จเมื่อ:

- [ ] แอป Next.js รันและ build ได้ตาม environment ที่ระบุ
- [ ] เนื้อหาครบ 15 โมดูลและรายละเอียดใน source documents รวม Bonus, troubleshooting, defense และ submission
- [ ] ผู้ใช้เรียนผ่านเนื้อหาในแอปได้จริง ไม่ใช่เห็นเพียงสารบัญ/links/checkboxes
- [ ] ลำดับการเรียนเป็นบท/หัวข้อ ไม่มีตารางบังคับรายวันหรือรายสัปดาห์
- [ ] Checklist ของ subject ครบ มีประเภท เงื่อนไข วิธีตรวจ และ source mapping
- [ ] “เรียนจบ” กับ “ทดสอบ requirement ผ่าน” เป็นคนละสถานะและคำนวณถูก
- [ ] Mandatory, Bonus และเนื้อหาเสริมแสดงแยกโดยไม่ทำให้เปอร์เซ็นต์สับสน
- [ ] Progress/notes/resume คงอยู่หลัง reload และ export/import ใช้ได้
- [ ] Search, glossary, troubleshooting, defense และ references มีเนื้อหาและลิงก์จริง
- [ ] UI อ่านภาษาไทยและ code ได้ดีทั้งมือถือและ desktop
- [ ] ไม่มี dummy progress, หน้าเปล่า, TODO เนื้อหาหลัก หรือปุ่มที่ยังไม่ทำงาน
- [ ] มี coverage matrix สำหรับตรวจความครบถ้วน และ README อธิบายวิธีรัน/เพิ่มเนื้อหา/คำนวณสถานะ/ข้อจำกัด local storage
- [ ] ตรวจ flows สำคัญแล้วและรายงานสิ่งที่ตรวจจริงอย่างตรงไปตรงมา

เมื่อส่งมอบให้บอกสิ่งที่ทำเสร็จ วิธีเปิดใช้งาน ผลการตรวจ และข้อจำกัดที่ยังมี ห้ามอ้างว่าผู้ใช้ผ่านโปรเจกต์ IoT หรือผ่านการประเมินเพียงเพราะแอปสร้างเสร็จ

## 15. วิธีใช้ไฟล์นี้

ส่ง `AGENT.md` นี้ให้ AI พร้อม `Inception-of-Things-Learning-Plan-TH.md` และ subject PDF แล้วสั่งให้อ่านทั้งสามไฟล์ก่อนสร้างแอป หากเครื่องมือไม่อ่านชื่อ `AGENT.md` อัตโนมัติ ให้ระบุชื่อไฟล์ในคำสั่งโดยตรง

คำสั่งเริ่มงานตัวอย่าง:

> อ่าน AGENT.md, Inception-of-Things-Learning-Plan-TH.md และ subject PDF ที่แนบให้ครบ แล้วสร้างแอป Next.js ตาม AGENT.md ให้ใช้งานได้จริง มีเนื้อหาบทเรียนและ checklist ครบทั้ง Mandatory และ Bonus เรียนตามลำดับหัวข้อโดยไม่จัดตารางรายวัน พร้อมบันทึกความคืบหน้า จากนั้นทดสอบและส่งวิธีเปิดใช้งาน
