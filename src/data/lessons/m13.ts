import { Lesson } from '@/types/curriculum';

export const m13Lessons: Lesson[] = [
  {
    id: 'm13-l01',
    slug: 'gitlab-bonus-architecture-resource-planning',
    moduleId: 'm13',
    title: 'GitLab Bonus: ข้อกำหนด, สถาปัตยกรรม และการจัดสรรงบประมาณ RAM',
    objectives: [
      'แกะข้อกำหนดของ Bonus Part: Local GitLab, Latest version, Namespace gitlab, และความพร้อมของ Mandatory',
      'วิเคราะห์ความต้องการด้านทรัพยากรของ GitLab (กินแรม 4GB-8GB) และเทคนิคการปรับลด Resource Footprint',
      'เปรียบเทียบแนวทางการติดตั้ง: GitLab Helm Chart (Cloud-native) เทียบกับ GitLab Omnibus Container',
      'วางแผน DNS และ External URL สำหรับการเข้าถึงทั้งจากภายนอกและภายในคลัสเตอร์'
    ],
    prerequisiteIds: ['m12-l01', 'm12-l02', 'm11-l02'],
    stage: 'Bonus',
    readingTime: 11,
    summary: 'เจาะลึกข้อกำหนดและสถาปัตยกรรมของส่วนโบนัส การจัดการความท้าทายเรื่องทรัพยากรเครื่อง และการออกแบบระบบ GitLab บนเครื่องเดี่ยว',
    sourceRefs: [
      { sourceId: 'SUB-P16', title: 'en.subject.pdf (Page 16, Chapter V Bonus part)' },
      { sourceId: 'S17', title: 'Deploy GitLab Helm Chart' },
      { sourceId: 'S18', title: 'GitLab Chart: Cluster Setup & Resource Planning' },
      { sourceId: 'S19', title: 'GitLab Official Docker Installation' }
    ],
    exerciseIds: ['ex-m13-01'],
    checklistIds: ['chk-m13-l01-01', 'chk-m13-l01-02', 'chk-m13-l01-03'],
    content: `
### 1. แกะข้อกำหนดของ Bonus Part (Subject หน้า 16)

ในโจทย์ Chapter V ระบุข้อกำหนดบังคับของ Bonus ดังนี้:
1. **Local GitLab:** ต้องรันในเครื่องเท่านั้น ห้ามแอบใช้ gitlab.com
2. **Latest Official Version:** ต้องใช้เวอร์ชันล่าสุดที่มีจากเว็บไซต์ทางการ ณ วันที่ตรวจงาน
3. **Dedicated Namespace:** ต้องสร้างและรันทรัพยากรทั้งหมดใน namespace ชื่อ **\`gitlab\`**
4. **Full Part 3 Workflow:** กระบวนการทั้งหมดของ Part 3 (Argo CD อัปเดตแอป v1 -> v2) ต้องทำงานผ่าน Local GitLab นี้
5. **โฟลเดอร์ \`bonus/\`:** ต้องจัดเก็บไฟล์คอนฟิกและสคริปต์ทั้งหมดไว้ในโฟลเดอร์ \`bonus/\` ที่ root ของ repository
6. **เงื่อนไขสำคัญที่สุด:** โบนัสจะได้รับการตรวจ **ก็ต่อเมื่อ Mandatory (Part 1, 2, 3) สมบูรณ์แบบ 100% เท่านั้น**

### 2. ความท้าทายเรื่อง RAM: วิธีไม่ให้เครื่องระเบิด (OOMKilled)

GitLab เวอร์ชันเต็ม (Full Enterprise/Community) มีคอมโพเนนต์มากมาย (Puma, Sidekiq, Gitaly, PostgreSQL, Redis, Registry, Prometheus, Grafana, GitLab Runner) ซึ่งปกติกิน RAM สูงถึง **8 GB - 16 GB**

หากรันค่าเริ่มต้นบน VM ทั่วไป เคอร์เนลจะสั่งยิง **OOM-Killer (Exit Code 137)** ทันที

#### วิธีการปรับแต่งเพื่อลดการใช้ RAM เหลือประมาณ 3.5 - 4 GB:
1. **ปิดฟีเจอร์ที่ไม่จำเป็นใน \`values.yaml\`:**
   - ปิด Prometheus, Grafana, Alertmanager
   - ปิด GitLab Runner (โจทย์ไม่ได้บังคับให้รัน CI Pipeline บน GitLab)
   - ปิด Mattermost, Registry, MinIO (ถ้าไม่ได้ใช้)
2. **จำกัดจำนวน Concurrency ของ Puma และ Sidekiq:**
   - ตั้ง \`puma.workerProcesses: 2\`
   - ตั้ง \`sidekiq.concurrency: 5\`
3. **เปิดใช้ Linux Swap File:** สร้าง Swap File ขนาดอย่างน้อย 4 GB บนเครื่อง VM หลักเพื่อรองรับ Memory Spike ช่วงเริ่มต้น

### 3. เปรียบเทียบทางเลือกในการติดตั้ง

- **ทางเลือกที่ 1: GitLab Helm Chart (แนะนำสำหรับผู้มี RAM 8GB ขึ้นไป)**
  - แยกเป็น Microservices Pods อิสระ สวยงามตามมาตรฐาน Cloud-native
- **ทางเลือกที่ 2: GitLab Omnibus Single Pod/Container (แนะนำสำหรับเครื่องที่มี RAM 4-6GB)**
  - รวมทุกอย่างใน container เดียว ติดตั้งง่ายและบูตเสถียรกว่าบนคลัสเตอร์ขนาดเล็ก
`
  },
  {
    id: 'm13-l02',
    slug: 'gitlab-argocd-integration-gitops-workflow',
    moduleId: 'm13',
    title: 'เชื่อมต่อ GitLab กับ Argo CD และการทำ Demo โบนัส',
    objectives: [
      'เข้าใจและแก้ไขปัญหา DNS Resolution ข้าม Network Namespace ระหว่างโฮสต์และ Pod',
      'แก้ปัญหา Authentication และ Self-Signed TLS Certificates ในการโคลน Git Repo',
      'แก้ปัญหา Bootstrap (ไก่กับไข่): สร้างโปรเจกต์บน GitLab ก่อนเริ่มท่อ GitOps',
      'สาธิต Workflow Part 3 ผ่าน Local GitLab สดๆ ต่อหน้าผู้ตรวจ'
    ],
    prerequisiteIds: ['m13-l01', 'm10-l02', 'm11-l02'],
    stage: 'Bonus',
    readingTime: 11,
    summary: 'ขั้นตอนเชื่อมต่อท่อส่งมอบอัตโนมัติของ Argo CD เข้ากับ Local GitLab ในเครื่อง และการพิสูจน์ GitOps Workflow ในส่วนโบนัส',
    sourceRefs: [
      { sourceId: 'S14', title: 'Argo CD Private Repositories & Credentials' },
      { sourceId: 'SUB-P16', title: 'en.subject.pdf (Page 16, Chapter V Bonus part)' }
    ],
    exerciseIds: ['ex-m13-02'],
    checklistIds: ['chk-m13-l02-01', 'chk-m13-l02-02', 'chk-m13-l02-03'],
    content: `
### 1. ปัญหาคลาสสิก: ทำไมเบราว์เซอร์เปิดได้ แต่ Argo CD โคลนไม่ได้?

นี่คือกับดักที่ทำให้นักเรียน 42 ติดหล่มในส่วนโบนัสมากที่สุด:
- **เบราว์เซอร์บนเครื่องหลัก:** เปิด \`http://gitlab.local\` ได้ เพราะใส่ IP ใน \`/etc/hosts\` ของเครื่องโฮสต์
- **Pod ของ Argo CD (\`argocd-repo-server\`):** รันอยู่ภายในคอนเทนเนอร์ในคลัสเตอร์ K3d ซึ่งมองหา DNS ผ่าน **CoreDNS** ภายในคลัสเตอร์ จึงไม่รู้จักชื่อ \`gitlab.local\` ที่อยู่บนโฮสต์!

#### ทางออกที่สะอาดและถูกต้อง:
1. ให้ Argo CD ชี้ไปยัง **Kubernetes In-Cluster Service DNS** เช่น:
   \`http://gitlab-webservice-default.gitlab.svc.cluster.local:8181/root/iot-repo.git\`
2. หรือเพิ่ม Hosts Entry ใน CoreDNS ConfigMap ของ K3d เพื่อให้ resolve ชื่อ \`gitlab.local\` ภายในคลัสเตอร์ได้

### 2. แก้ปัญหา Bootstrap: ไก่กับไข่ (Chicken & Egg Problem)

คำถามเชิงตรรกะ:
> *"ถ้าเราต้องการให้คลัสเตอร์ถูกสร้างจาก Git ใน GitLab... แต่ตอนแรกสุดเรายังไม่มี GitLab แล้วเราจะเอาโค้ดไปวางใน GitLab ได้อย่างไร?"*

**คำตอบและแนวทางแก้:**
1. เราต้องมี **Bootstrap Script** ในเครื่องที่สร้างคลัสเตอร์ K3d และติดตั้ง GitLab ขึ้นมาก่อน
2. จากนั้นสคริปต์จะใช้ GitLab REST API หรือ \`git push\` โค้ด Kubernetes Manifests ขึ้นไปสร้าง repository บน Local GitLab ที่เพิ่งพร้อมทำงาน
3. สุดท้ายจึงสั่งสร้าง Argo CD Application ให้ชี้ไปดึง Repo จาก Local GitLab นั้น

### 3. ขั้นตอนการทดสอบและสาธิตส่วน Bonus

\`\`\`bash
# 1. ตรวจสอบว่า GitLab Pods รันอยู่ใน namespace gitlab
kubectl get pods -n gitlab

# 2. ตรวจสอบว่า Argo CD เชื่อมต่อไปยัง Local GitLab (ไม่ใช่ GitHub แล้ว)
kubectl get application -n argocd -o yaml | grep repoURL
# คาดหวัง: เห็น URL ชี้ไปยัง local gitlab instance

# 3. สาธิตการแก้ Manifest บน Local GitLab
# โคลน repo จาก Local GitLab
git clone http://gitlab.local/root/iot-repo.git /tmp/local-iot
cd /tmp/local-iot

# แก้เวอร์ชัน v1 เป็น v2
sed -i 's/playground:v1/playground:v2/g' deployment.yaml
git commit -am "update to v2 on local gitlab"
git push origin main

# 4. ตรวจสอบ Argo CD ทำการ Sync และพิสูจน์ผลลัพธ์
curl http://localhost:8888/
# คาดหวัง: {"status":"ok", "message": "v2"}
\`\`\`
`
  }
];
