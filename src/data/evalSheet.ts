export interface EvalCheckItem {
  id: string;
  section: string;
  title: string;
  instruction: string;
  evaluatorAction: string;
  studentExplanationGuide: string;
  commands?: {
    command: string;
    expected: string;
    note?: string;
  }[];
  criticalStopWarning?: string;
}

export interface EvalSection {
  id: string;
  name: string;
  description: string;
  items: EvalCheckItem[];
}

export const evaluationSheetData: EvalSection[] = [
  {
    id: 'preliminaries',
    name: 'Preliminaries (บทนำและข้อตกลงเบื้องต้น)',
    description: 'การเตรียมตัวก่อนเริ่มตรวจงาน กฎความซื่อสัตย์ และการโคลนไฟล์จาก Git Repository ทางการ',
    items: [
      {
        id: 'eval-prelim-01',
        section: 'Preliminaries',
        title: 'Git Clone ในโฟลเดอร์เปล่า และตรวจสิทธิ์ของ Repository',
        instruction: 'ตรวจเฉพาะไฟล์ที่อยู่ใน Git repository ทางการของผู้ถูกตรวจเท่านั้น และต้องโคลนลงในโฟลเดอร์ว่างเปล่า (empty folder)',
        evaluatorAction: 'ตรวจสอบ URL ของ vogsphere repo และสั่ง git clone ลงในโฟลเดอร์ใหม่เอี่ยม',
        studentExplanationGuide: 'เตรียมพร้อม URL ของ Git Repository ทางการ ให้ผู้ตรวจเห็นว่า repository เป็นของสมาชิกในกลุ่ม และโครงสร้างโฟลเดอร์สะอาด ไม่มีไฟล์ขยะ',
        commands: [
          {
            command: 'git clone <repo-url> /tmp/eval-test && cd /tmp/eval-test',
            expected: 'โคลนไฟล์สำเร็จโดยไม่มี error'
          }
        ],
        criticalStopWarning: 'หากสงสัยว่ามีการทุจริต (Cheating) การตรวจจะหยุดลงทันที และให้เกรดเป็น -42'
      },
      {
        id: 'eval-prelim-02',
        section: 'Preliminaries',
        title: 'ตรวจสอบ Malicious Aliases',
        instruction: 'ระวังไม่ให้มี alias ที่แอบเปลี่ยนคำสั่งเพื่อหลอกผลการตรวจ',
        evaluatorAction: 'รันคำสั่ง alias หรือ which ตรวจดูคำสั่งสำคัญ เช่น kubectl, docker, curl',
        studentExplanationGuide: 'แสดงความโปร่งใสโดยไม่ตั้ง alias แปลกปลอมที่ดักจับคำสั่งเพื่อพิมพ์ผลลัพธ์ปลอม',
        commands: [
          {
            command: 'alias',
            expected: 'ไม่มี alias แปลกปลอมที่ดักคำสั่ง kubectl หรือ curl'
          }
        ]
      }
    ]
  },
  {
    id: 'part1-config',
    name: 'Part 1 - Configuration (การตรวจคอนฟิก)',
    description: 'ตรวจเช็กไฟล์ Vagrantfile ในโฟลเดอร์ p1, จำนวนเครื่อง, Hostname และ IP Address',
    items: [
      {
        id: 'eval-p1-cfg-01',
        section: 'Part 1 - Configuration',
        title: 'ตรวจสอบ Vagrantfile ในโฟลเดอร์ p1',
        instruction: 'ตรวจดูว่ามีไฟล์ Vagrantfile ในโฟลเดอร์ p1 และผู้ถูกตรวจสามารถอธิบายโครงสร้างไฟล์ได้อย่างเข้าใจ',
        evaluatorAction: 'เปิดไฟล์ p1/Vagrantfile ดูโค้ด Ruby DSL และถามให้ผู้เรียนอธิบาย',
        studentExplanationGuide: 'อธิบายบล็อก config.vm.define ของทั้ง 2 เครื่อง (wilS และ wilSW) อธิบายการตั้งค่า RAM 1024MB/512MB, CPU 1 core, และ shell provisioning',
        commands: [
          {
            command: 'cat p1/Vagrantfile',
            expected: 'เห็นการนิยาม 2 เครื่องชัดเจน'
          }
        ]
      },
      {
        id: 'eval-p1-cfg-02',
        section: 'Part 1 - Configuration',
        title: 'ตรวจสอบ Hostname และ IP บน eth1',
        instruction: 'เครื่องแรกต้องลงท้ายด้วย S (เช่น wilS) IP 192.168.56.110 และเครื่องที่สองลงท้ายด้วย SW (เช่น wilSW) IP 192.168.56.111',
        evaluatorAction: 'ตรวจดูการตั้งค่า private_network ip ใน Vagrantfile',
        studentExplanationGuide: 'ชี้ให้เห็นบรรทัด network "private_network", ip: "192.168.56.110" และ "192.168.56.111"'
      }
    ]
  },
  {
    id: 'part1-usage',
    name: 'Part 1 - Usage (การทดสอบใช้งานจริง)',
    description: 'SSH เข้าเครื่องเสมือน, ตรวจสอบ Network Interface, Hostname, และคลัสเตอร์ K3s 2 โหนด',
    items: [
      {
        id: 'eval-p1-use-01',
        section: 'Part 1 - Usage',
        title: 'Vagrant SSH เข้าทั้ง 2 เครื่อง และตรวจ IP บน Interface',
        instruction: 'ใช้ Vagrant SSH เข้าเครื่องทั้งสอง และตรวจดูว่ามี interface ที่ถือ IP ตามที่โจทย์ระบุ',
        evaluatorAction: 'รัน vagrant ssh wilS และ vagrant ssh wilSW จากนั้นรัน ifconfig หรือ ip a show eth1 (หรือ interface จริง)',
        studentExplanationGuide: 'แนะนำให้ผู้ตรวจดูชื่อ interface จริงของเครื่อง เช่น ip a show enp0s8 หรือ eth1 และแสดงให้เห็น IP 192.168.56.110 / .111',
        commands: [
          {
            command: 'ip -br a',
            expected: 'เห็น 192.168.56.110 บนเครื่อง Server และ 192.168.56.111 บนเครื่อง Worker'
          },
          {
            command: 'hostname',
            expected: '<login>S บน Server และ <login>SW บน Worker'
          }
        ]
      },
      {
        id: 'eval-p1-use-02',
        section: 'Part 1 - Usage',
        title: 'ตรวจสอบคลัสเตอร์ K3s 2 โหนด (kubectl get nodes -o wide)',
        instruction: 'ตรวจสอบว่าทั้ง 2 เครื่องใช้ K3s และอยู่ในคลัสเตอร์เดียวกัน โดยรันคำสั่งบนเครื่อง Server ผู้ถูกตรวจต้องอธิบาย output แต่ละคอลัมน์ได้',
        evaluatorAction: 'รัน kubectl get nodes -o wide บนเครื่อง Server',
        studentExplanationGuide: 'อธิบายว่า wilS คือ control-plane/master, wilSW คือ worker node, ทั้งสองสถานะ Ready, แสดงเวอร์ชัน K3s, และ INTERNAL-IP ต้องเป็น 192.168.56.110 และ .111 (ไม่ใช่ 10.0.2.15)',
        commands: [
          {
            command: 'kubectl get nodes -o wide',
            expected: '<login>S Ready control-plane,master ... 192.168.56.110\n<login>SW Ready <none> ... 192.168.56.111'
          }
        ],
        criticalStopWarning: 'ถ้ามีสิ่งใดไม่ทำงานตามที่คาดหวัง การตรวจในส่วนนี้จะหยุดลงทันที (Evaluation stops here)'
      }
    ]
  },
  {
    id: 'part2-config',
    name: 'Part 2 - Configuration (การตรวจคอนฟิก)',
    description: 'ตรวจเช็ก Vagrantfile ในโฟลเดอร์ p2, ใช้เครื่องเสมือนเพียง 1 เครื่อง และตรวจไฟล์เสริม',
    items: [
      {
        id: 'eval-p2-cfg-01',
        section: 'Part 2 - Configuration',
        title: 'ตรวจสอบ Vagrantfile ในโฟลเดอร์ p2 (1 VM เท่านั้น)',
        instruction: 'ปิดเครื่องใน p1 ก่อนเพื่อไม่ให้กินทรัพยากร ตรวจสอบว่าใน p2 มีเครื่องเสมือนเพียง 1 เครื่อง ชื่อลงท้ายด้วย S และ IP 192.168.56.110',
        evaluatorAction: 'ตรวจไฟล์ p2/Vagrantfile',
        studentExplanationGuide: 'อธิบายว่า Part 2 ใช้ 1 VM ทำหน้าที่เป็นทั้ง Server และรัน Workloads ทั้งหมด มี IP 192.168.56.110'
      }
    ]
  },
  {
    id: 'part2-usage',
    name: 'Part 2 - Usage (การทดสอบใช้งานจริง)',
    description: 'ตรวจ 3 Web Apps, Replicas ของ app2, การแสดง Ingress YAML, และการทดสอบ Host Header routing',
    items: [
      {
        id: 'eval-p2-use-01',
        section: 'Part 2 - Usage',
        title: 'ตรวจสอบ Pods, Deployments และ 3 Web Applications',
        instruction: 'รัน kubectl get nodes -o wide และ kubectl get all ตรวจสอบว่ามีเว็บแอปพลิเคชัน 3 ตัวทำงานอยู่ และ app2 มี 3 replicas ผู้ถูกตรวจต้องอธิบาย output ทุกบรรทัด',
        evaluatorAction: 'รัน kubectl get all และสังเกต Deployment app1, app2 (3/3), app3',
        studentExplanationGuide: 'อธิบายว่า app1 มี 1 pod, app2 มี 3 replicas (ready 3/3), app3 มี 1 pod พร้อม Service ClusterIP ครบทั้ง 3 ตัว',
        commands: [
          {
            command: 'kubectl get all',
            expected: 'เห็น 3 deployments, 3 services, และ app2 มี 3 pods Running'
          }
        ]
      },
      {
        id: 'eval-p2-use-02',
        section: 'Part 2 - Usage',
        title: 'แสดง Ingress Configuration (ผู้ตรวจตั้งใจไม่บอกคำสั่ง)',
        instruction: 'ผู้ถูกตรวจต้องเปิดแสดงว่า Ingress ของตนทำงานอย่างไร โดยคำสั่งไม่ได้ถูกระบุในใบตรวจ ผู้ถูกตรวจต้องรู้เอง',
        evaluatorAction: 'ขอให้ผู้เรียนเปิด Ingress configuration ให้ดู',
        studentExplanationGuide: 'พิมพ์คำสั่ง kubectl get ingress -o yaml ทันที และอธิบาย spec.rules สำหรับ app1.com และ app2.com รวมถึงชี้ให้เห็น spec.defaultBackend สำหรับ app3',
        commands: [
          {
            command: 'kubectl get ingress -o yaml',
            expected: 'แสดง Ingress YAML พร้อม rules app1.com, app2.com และ defaultBackend app3'
          }
        ]
      },
      {
        id: 'eval-p2-use-03',
        section: 'Part 2 - Usage',
        title: 'ทดสอบเข้าถึงแอปตาม Host Header ด้วย curl หรือเบราว์เซอร์',
        instruction: 'ทดสอบเปลี่ยน Host Header เพื่อดูความแตกต่าง: app1.com -> app1, app2.com -> app2, และกรณีอื่นๆ -> app3 default',
        evaluatorAction: 'รันคำสั่ง curl ทดสอบทั้ง 3 กรณี',
        studentExplanationGuide: 'นำเสนอคำสั่ง curl -H "Host: app1.com", curl -H "Host: app2.com", และ curl ตรงๆ http://192.168.56.110/ เพื่อพิสูจน์ fallback สู่ app3',
        commands: [
          {
            command: 'curl -H "Host: app1.com" http://192.168.56.110/',
            expected: 'ได้รับเนื้อหาของ app1'
          },
          {
            command: 'curl -H "Host: app2.com" http://192.168.56.110/',
            expected: 'ได้รับเนื้อหาของ app2'
          },
          {
            command: 'curl http://192.168.56.110/',
            expected: 'ได้รับเนื้อหาของ app3 (Default Fallback)'
          }
        ],
        criticalStopWarning: 'ถ้า Host routing หรือ Default fallback ไม่ทำงาน การตรวจจะหยุดลงทันที'
      }
    ]
  },
  {
    id: 'part3-config',
    name: 'Part 3 - Configuration (การตรวจคอนฟิก K3d และ Argo CD)',
    description: 'ตรวจเช็ก K3d Namespaces (argocd, dev), Pods, และ Public GitHub Repository ที่มี login สมาชิก',
    items: [
      {
        id: 'eval-p3-cfg-01',
        section: 'Part 3 - Configuration',
        title: 'ตรวจสอบ Namespaces (argocd, dev) และความต่างของ Namespace vs Pod',
        instruction: 'รัน kubectl get ns และ kubectl get pods -n dev ตรวจสอบว่ามีอย่างน้อย 2 namespaces และผู้เรียนเข้าใจความต่างของ namespace กับ pod',
        evaluatorAction: 'รัน kubectl get ns และถามผู้เรียนว่า namespace กับ pod ต่างกันอย่างไร',
        studentExplanationGuide: 'ตอบว่า Namespace คือขอบเขตการจัดกลุ่มตรรกะ (Logical Partition / Virtual Cluster) สำหรับแบ่งแยกสิทธิ์และทรัพยากร ส่วน Pod คือหน่วยการรันคอนเทนเนอร์จริงที่กิน CPU/RAM',
        commands: [
          {
            command: 'kubectl get ns',
            expected: 'มี argocd และ dev สถานะ Active'
          },
          {
            command: 'kubectl get pods -n dev',
            expected: 'มีอย่างน้อย 1 Pod รันอยู่สถานะ Running'
          }
        ]
      },
      {
        id: 'eval-p3-cfg-02',
        section: 'Part 3 - Configuration',
        title: 'ตรวจสอบ Public GitHub Repo และ Docker Image',
        instruction: 'ตรวจสอบว่าชื่อ GitHub repository มีชื่อล็อกอินของสมาชิกในกลุ่ม และมีการชี้ไปยัง Docker Hub image ที่มีแท็ก v1 และ v2',
        evaluatorAction: 'เปิด GitHub repository ตรวจสอบชื่อ repo และดู deployment manifest',
        studentExplanationGuide: 'แสดงให้เห็นว่า repo ชื่อมี login เช่น wil-iot-config และเป็น Public, ชี้ไปยัง wil42/playground หรือ Docker Hub ส่วนตัวที่มี v1/v2'
      },
      {
        id: 'eval-p3-cfg-03',
        section: 'Part 3 - Configuration',
        title: 'เข้าสู่ระบบหน้าเว็บ Argo CD Web UI',
        instruction: 'ตรวจสอบว่า Argo CD ติดตั้งและเข้าสู่ระบบได้ ผู้ถูกตรวจต้องให้ Username และ Password แก่ผู้ประเมิน',
        evaluatorAction: 'เปิดเบราว์เซอร์ไปที่ Argo CD และล็อกอินด้วย credentials ที่ผู้เรียนให้',
        studentExplanationGuide: 'เตรียม Username คือ admin และเตรียมรหัสผ่านเริ่มต้นจาก Secret argocd-initial-admin-secret ให้พร้อม',
        commands: [
          {
            command: 'kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d',
            expected: 'ถอดรหัสผ่าน admin ของ Argo CD ออกมาแสดง'
          }
        ]
      }
    ]
  },
  {
    id: 'part3-usage',
    name: 'Part 3 - Usage (การสาธิต GitOps Continuous Delivery)',
    description: 'สาธิต curl v1, แก้ manifest บน GitHub, push commit, และดู Argo CD อัปเดตแอปสู่ v2 อัตโนมัติ',
    items: [
      {
        id: 'eval-p3-use-01',
        section: 'Part 3 - Usage',
        title: 'อธิบายการทำงานของ Argo CD และทดสอบแอป v1',
        instruction: 'ผู้ถูกตรวจต้องพาผู้ประเมินชมระบบใน Argo CD และอธิบายว่ามันทำงานอย่างไร หากผู้ตรวจมีข้อสงสัยหรือไม่เข้าใจคำอธิบาย การประเมินจะหยุดทันที',
        evaluatorAction: 'ให้ผู้เรียนอธิบายแถบ Synced, Healthy, และ App Details ใน Argo CD และยิง curl http://localhost:8888/',
        studentExplanationGuide: 'อธิบายว่า Argo CD คอยทำ Reconciliation เปรียบเทียบ Git Desired State กับ Cluster Actual State และชี้ให้เห็นว่าตอนนี้แอปกำลังรัน v1',
        commands: [
          {
            command: 'curl http://localhost:8888/',
            expected: '{"status":"ok", "message": "v1"}'
          }
        ],
        criticalStopWarning: 'If you have any doubt (maybe their explanations are confused or they cannot explain something they should know), the evaluation stops now!'
      },
      {
        id: 'eval-p3-use-02',
        section: 'Part 3 - Usage',
        title: 'สาธิตการอัปเดตเวอร์ชันผ่าน GitHub (GitOps Trigger)',
        instruction: 'แก้ไขไฟล์คอนฟิกบน GitHub เป็นเวอร์ชัน 2 ทำการ commit และ push จากนั้นตรวจสอบว่าแอปพลิเคชันถูกอัปเดตอัตโนมัติ (หาก sync ช้า สามารถกด sync ใน Argo CD ได้)',
        evaluatorAction: 'ดูผู้เรียนแก้ manifest, push ขึ้น GitHub และรอ Argo CD sync จากนั้นยิง curl ทดสอบ v2',
        studentExplanationGuide: 'แก้ deployment.yaml เปลี่ยน tag เป็น :v2 สั่ง git commit และ git push จากนั้นกด Sync/Refresh ใน Argo CD เพื่อสาธิตการ rollout และยิง curl ได้รับ message: v2',
        commands: [
          {
            command: 'curl http://localhost:8888/',
            expected: '{"status":"ok", "message": "v2"}'
          }
        ],
        criticalStopWarning: 'หากแอปไม่อัปเดตหรือไม่สามารถเปลี่ยนเป็น v2 ได้ การประเมินจะหยุดทันที'
      }
    ]
  },
  {
    id: 'bonus',
    name: 'Bonus Part (ส่วนโบนัส GitLab)',
    description: 'ตรวจเฉพาะเมื่อ Mandatory ผ่านสมบูรณ์แบบ 100% ทดสอบ Local GitLab และ Workflow ผ่าน GitLab ในเครื่อง',
    items: [
      {
        id: 'eval-bon-01',
        section: 'Bonus Part',
        title: 'ตรวจสอบไฟล์ในโฟลเดอร์ bonus/ และการทำงานของ GitLab',
        instruction: 'ตรวจดูไฟล์ใน bonus/ และทดสอบว่า GitLab ในเครื่องทำงานจริง โดยให้ผู้เรียนสร้าง repository ใหม่และลองเพิ่มโค้ด',
        evaluatorAction: 'เปิดดูหน้าเว็บ GitLab ในเครื่อง และสร้าง repo ทดสอบ',
        studentExplanationGuide: 'แสดงหน้าเว็บ GitLab โลคัล แสดง namespace gitlab ในคลัสเตอร์ และอธิบายการตั้งค่าทรัพยากร'
      },
      {
        id: 'eval-bon-02',
        section: 'Bonus Part',
        title: 'ยืนยันว่า Workflow ทั้งหมดของ Part 3 ทำงานผ่าน Local GitLab',
        instruction: 'ตรวจสอบว่า Argo CD ดึง repository จาก Local GitLab ในเครื่อง และสามารถสาธิตการเปลี่ยนเวอร์ชันของแอปผ่าน GitLab ในเครื่องได้สำเร็จโดยไม่มี error',
        evaluatorAction: 'ตรวจดู repoURL ใน Argo CD ว่าชี้ไปยัง Local GitLab และทดสอบเปลี่ยนเวอร์ชันแอป',
        studentExplanationGuide: 'แสดง repoURL ใน Argo CD ที่ชี้ไปยัง GitLab ภายในเครื่อง และสาธิตแก้ manifest บน GitLab แล้วแอปใน dev อัปเดตตามปกติ'
      }
    ]
  }
];
