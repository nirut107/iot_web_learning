import { Lesson } from '@/types/curriculum';

export const m08Lessons: Lesson[] = [
  {
    id: 'm08-l01',
    slug: 'reverse-proxy-traefik-ingress-controller',
    moduleId: 'm08',
    title: 'Reverse Proxy, สถาปัตยกรรม Traefik และ Ingress Controller',
    objectives: [
      'เข้าใจแนวคิด Reverse Proxy และการจัดการ Virtual Hosts',
      'แยกแยะความต่างระหว่าง Ingress Resource (สเปกกฎ) กับ Ingress Controller (โปรแกรมที่ทำงานจริง)',
      'สำรวจ Traefik Ingress Controller ที่ติดตั้งมาพร้อมกับ K3s',
      'เข้าใจเส้นทางการเดินทางของ Request ตั้งแต่ภายนอกจนถึง Pod'
    ],
    prerequisiteIds: ['m07-l02', 'm02-l02'],
    stage: 'Part 2',
    readingTime: 8,
    summary: 'หลักการทำงานของ Reverse Proxy ภายใน Kubernetes สถาปัตยกรรมของ Traefik และการแปลง Ingress Resource เป็น Routing Rules',
    sourceRefs: [
      { sourceId: 'S8', title: 'Kubernetes Ingress Concept' },
      { sourceId: 'S9', title: 'K3s Networking Services (Traefik)' },
      { sourceId: 'SUB-P9', title: 'en.subject.pdf (Page 9, Chapter IV.2 Part 2)' }
    ],
    exerciseIds: ['ex-m08-01'],
    checklistIds: ['chk-m08-l01-01', 'chk-m08-l01-02', 'chk-m08-l01-03'],
    content: `
### 1. Reverse Proxy คืออะไร?

ในสถาปัตยกรรมเว็บ:
- **Forward Proxy:** อยู่ฝั่งผู้ใช้ (Client-side) คอยส่งคำขอออกไปอินเทอร์เน็ตแทนผู้ใช้
- **Reverse Proxy:** อยู่ฝั่งเซิร์ฟเวอร์ (Server-side) ทำหน้าที่เป็นประตูหน้าบ้าน (Single Entry Point) รับคำขอทั้งหมดจากภายนอก แล้วพิจารณาว่าจะส่งคำขอนั้นต่อไปยังเว็บเซิร์ฟเวอร์ตัวใดภายในระบบ

### 2. Ingress Resource vs Ingress Controller

ประเด็นที่ผู้ประเมินผลชอบถามทดสอบความเข้าใจอย่างมาก:

> **Ingress Resource:** เป็นเพียงไฟล์ YAML ใน Kubernetes API ที่ประกาศข้อความระบุว่า "ถ้า Host นี้เข้ามา ให้ส่งไป Service นี้" ตัวไฟล์ Resource เองไม่ได้รับหรือส่งทราฟฟิกใดๆ ทั้งสิ้น

> **Ingress Controller (Traefik ใน K3s):** คือโปรแกรมที่รันอยู่จริงในคลัสเตอร์ (มักอยู่ใน namespace \`kube-system\`) ซึ่งจะคอยคุยกับ Kubernetes API Server และดาวน์โหลดกฎใน Ingress Resource มาแปลงเป็นการตั้งค่า Reverse Proxy ภายในตัวเอง

### 3. เส้นทางของ Request ใน Part 2

\`\`\`text
  ผู้ใช้พิมพ์: curl -H "Host: app1.com" http://192.168.56.110/
                            |
                            v
  [ VM Network Interface eth1 (192.168.56.110:80) ]
                            |
                            v
  [ K3s ServiceLB / Traefik Pod (kube-system) ]
                            |
             (ตรวจดู Header Host: app1.com)
                            |
                            v
  [ Service app1-svc (ClusterIP: 10.43.x.x) ]
                            |
                            v
  [ Pod app1 (Container IP: 10.42.x.x) ]
\`\`\`
`
  },
  {
    id: 'm08-l02',
    slug: 'assemble-part2-ingress-fallback-verification',
    moduleId: 'm08',
    title: 'ประกอบและจบ Part 2: การตั้งค่า Ingress, app3 Fallback และการตรวจผล',
    objectives: [
      'สร้าง 3 Web Applications ที่แยกกัน (app1, app2 มี 3 replicas, app3)',
      'ตั้งค่า Ingress กฎ: app1.com -> app1 และ app2.com -> app2',
      'ตั้งค่า Default Fallback ให้ app3 รับคำขอเมื่อเข้าผ่าน IP ตรงหรือส่ง Host อื่น',
      'ทดสอบด้วยคำสั่ง curl ทั้ง 3 กรณี และซ้อมเปิดแสดง Ingress YAML ตอนสอบ Defense'
    ],
    prerequisiteIds: ['m08-l01', 'm07-l01'],
    stage: 'Part 2',
    readingTime: 10,
    summary: 'ขั้นตอนประกอบงาน Part 2 อย่างสมบูรณ์ การเขียน Ingress ที่มี defaultBackend สำหรับ app3 และแนวทางการสาธิตตอนประเมินผล',
    sourceRefs: [
      { sourceId: 'SUB-P9', title: 'en.subject.pdf (Page 9-11, Chapter IV.2 Part 2)' },
      { sourceId: 'S8', title: 'Kubernetes Ingress Concept' }
    ],
    exerciseIds: ['ex-m08-02'],
    checklistIds: ['chk-m08-l02-01', 'chk-m08-l02-02', 'chk-m08-l02-03'],
    content: `
### 1. เงื่อนไขที่สำคัญที่สุดของ Part 2

ในโจทย์ Part 2 หน้า 9 ระบุว่า:
> *"When the HOST app1.com is used, the server must display app1.*
> *When the HOST app2.com is used, the server must display app2.*
> ***Otherwise, app3 will be selected by default.***"

> [!CAUTION]
> **กับดักที่ทำให้ตก Part 2 ทันที:**
> การใส่กฎ \`host: app3.com\` ไม่เพียงพอ! เพราะโจทย์ระบุว่าคำว่า "Otherwise" (กรณีอื่นๆ ทั้งหมด) รวมถึง **การเข้าผ่าน IP ตรงๆ (\`http://192.168.56.110/\`) หรือเข้าผ่าน Host อื่นๆ เช่น \`foo.com\` จะต้องแสดง app3 เสมอ**
> วิธีแก้ที่ถูกต้องคือต้องใช้ฟิลด์ **\`spec.defaultBackend\`** ใน Ingress Manifest!

### 2. Ingress Manifest ที่ถูกต้อง 100%

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: iot-ingress
  annotations:
    ingress.class: "traefik"
spec:
  # 1. Fallback สำหรับทราฟฟิกที่ไม่ตรงกับ Host ใดๆ (เข้าผ่าน IP ตรง หรือ host อื่น)
  defaultBackend:
    service:
      name: app3-service
      port:
        number: 80

  # 2. กฎการแมปตาม Hostname
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
\`\`\`

### 3. การทดสอบตรวจรับงาน Part 2

\`\`\`bash
# กรณีที่ 1: เข้าถึง app1 ด้วย Host header
curl -H "Host: app1.com" http://192.168.56.110/
# คาดหวัง: ข้อความหรือหน้าเว็บของ app1

# กรณีที่ 2: เข้าถึง app2 ด้วย Host header
curl -H "Host: app2.com" http://192.168.56.110/
# คาดหวัง: ข้อความหรือหน้าเว็บของ app2

# กรณีที่ 3: เข้าผ่าน IP ตรงๆ (ไม่มี Host header)
curl http://192.168.56.110/
# คาดหวัง: ข้อความหรือหน้าเว็บของ app3 (Default)

# กรณีที่ 4: เข้าผ่าน Host แปลกปลอมอื่นๆ
curl -H "Host: random.xyz" http://192.168.56.110/
# คาดหวัง: ข้อความหรือหน้าเว็บของ app3 (Default)

# ตรวจสอบ Replicas ของ app2 (ต้องขึ้น 3/3)
kubectl get deployment app2
\`\`\`

> [!TIP]
> ในโจทย์หน้า 11 ระบุว่า *"The Ingress is not displayed here on purpose. You will have to show it to your evaluators during your defense."*
> เตรียมคำสั่ง \`kubectl get ingress iot-ingress -o yaml\` และฝึกอธิบายบล็อก \`defaultBackend\` และ \`rules\` ให้คล่อง
`
  }
];
