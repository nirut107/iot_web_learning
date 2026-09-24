import { SourceRef } from '@/types/curriculum';

export const officialReferences: (SourceRef & { description: string })[] = [
  {
    sourceId: 'S1',
    title: 'Vagrant Multi-Machine & Private Networks Documentation',
    section: 'Vagrant Multi-Machine / Networking',
    url: 'https://developer.hashicorp.com/vagrant/docs/multi-machine',
    description: 'ขอบเขตของ config (vm scope vs primary scope), การสร้าง multi-VM ใน Vagrantfile เดียว, และการกำหนด Static IP แบบ private_network'
  },
  {
    sourceId: 'S2',
    title: 'K3s Installation Requirements',
    section: 'Requirements',
    url: 'https://docs.k3s.io/installation/requirements',
    description: 'ความต้องการขั้นต่ำด้านฮาร์ดแวร์, OS, Ports ที่ต้องเปิด (6443, 8472 VXLAN, etc.) และข้อจำกัดเรื่อง RAM เมื่อเทียบกับคำแนะนำ 512MB/1GB ในโจทย์'
  },
  {
    sourceId: 'S3',
    title: 'Docker: What is a container?',
    section: 'Docker Concepts',
    url: 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/',
    description: 'แนวคิด Container vs Virtual Machine, การแชร์ Linux Kernel, Linux Namespaces และ Cgroups'
  },
  {
    sourceId: 'S4',
    title: 'K3s Architecture & Quick Start Guide',
    section: 'Architecture & Quick Start',
    url: 'https://docs.k3s.io/architecture',
    description: 'สถาปัตยกรรม K3s Server vs Agent, Datastore SQLite/etcd ในตัว, และขั้นตอนการรันสคริปต์ติดตั้ง k3s.io'
  },
  {
    sourceId: 'S5',
    title: 'Kubernetes Components Overview',
    section: 'Concepts / Overview',
    url: 'https://kubernetes.io/docs/concepts/overview/components/',
    description: 'ส่วนประกอบ Control Plane (API Server, Controller Manager, Scheduler) และ Node Components (Kubelet, Kube-proxy, Container Runtime)'
  },
  {
    sourceId: 'S6',
    title: 'Kubernetes Deployments Documentation',
    section: 'Workloads / Deployments',
    url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/',
    description: 'การจัดการ Desired State, Replicas, Pod Replacement, Selector Matching และ RollingUpdate Strategy'
  },
  {
    sourceId: 'S7',
    title: 'Kubernetes Service Documentation',
    section: 'Services & Networking',
    url: 'https://kubernetes.io/docs/concepts/services-networking/service/',
    description: 'Service Abstraction, Label Selectors, EndpointSlices, และความแตกต่างระหว่าง port, targetPort, nodePort'
  },
  {
    sourceId: 'S8',
    title: 'Kubernetes Ingress Concept',
    section: 'Services & Networking / Ingress',
    url: 'https://kubernetes.io/docs/concepts/services-networking/ingress/',
    description: 'Ingress Resource กฎการกระจายทราฟฟิก (Host-based routing, Path-based routing, Default Backend) แยกจาก Ingress Controller'
  },
  {
    sourceId: 'S9',
    title: 'K3s Networking Services (CoreDNS, Traefik, Klipper-lb)',
    section: 'Networking / Networking Services',
    url: 'https://docs.k3s.io/networking/networking-services',
    description: 'การทำงานของ Traefik Ingress Controller ที่ติดตั้งมาพร้อม K3s, CoreDNS สำหรับคลัสเตอร์, และ ServiceLB'
  },
  {
    sourceId: 'S10',
    title: 'K3d Overview & Requirements',
    section: 'K3d Documentation',
    url: 'https://k3d.io/stable/',
    description: 'K3d คืออะไร, การรัน K3s ภายใน Docker containers, และความต้องการของ Docker engine บนโฮสต์ VM'
  },
  {
    sourceId: 'S11',
    title: 'K3d Exposing Services & Port Mapping',
    section: 'Usage / Exposing Services',
    url: 'https://k3d.io/stable/usage/exposing_services/',
    description: 'การเปิดพอร์ตจากภายนอกเข้าสู่ K3d loadbalancer container (-p hostPort:containerPort@loadbalancer)'
  },
  {
    sourceId: 'S12',
    title: 'Argo CD Automated Sync, Self-Heal & Prune',
    section: 'User Guide / Auto Sync',
    url: 'https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/',
    description: 'การทำงานของ Auto-Sync, Self-Heal ในการแก้ live drift, Prune ในการลบทรัพยากรที่ไม่อยู่ใน Git, และ Reconciliation loop'
  },
  {
    sourceId: 'S13',
    title: 'Argo CD Getting Started Guide',
    section: 'Getting Started',
    url: 'https://argo-cd.readthedocs.io/en/stable/getting_started/',
    description: 'การติดตั้ง Argo CD บน Kubernetes, การสร้าง Application Manifest (CRD), และการเข้าถึง Web UI / CLI'
  },
  {
    sourceId: 'S14',
    title: 'Argo CD Private Repositories & Credentials',
    section: 'User Guide / Private Repositories',
    url: 'https://argo-cd.readthedocs.io/en/stable/user-guide/private-repositories/',
    description: 'การคอนฟิก Credentials, HTTPS token, SSH keys, TLS certificates และการแก้ปัญหา GitLab .git redirect'
  },
  {
    sourceId: 'S15',
    title: 'Kubernetes Persistent Volumes & Claims',
    section: 'Storage / Persistent Volumes',
    url: 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/',
    description: 'วงจรชีวิตของ PersistentVolume (PV), PersistentVolumeClaim (PVC), StorageClass, และ Reclaim Policy (Delete/Retain)'
  },
  {
    sourceId: 'S16',
    title: 'Helm: The Kubernetes Package Manager',
    section: 'Intro / Using Helm',
    url: 'https://helm.sh/docs/intro/using_helm/',
    description: 'แนวคิด Chart, Values, Release, App Version เทียบกับ Chart Version, และการติดตั้ง/อัปเกรดแอปด้วย helm install/upgrade'
  },
  {
    sourceId: 'S17',
    title: 'Deploy GitLab Helm Chart',
    section: 'GitLab Helm Chart Deployment',
    url: 'https://docs.gitlab.com/charts/installation/deployment/',
    description: 'การติดตั้ง GitLab ผ่าน Helm, Sub-charts dependencies (PostgreSQL, Redis, Gitaly, Webservice) และการปรับแต่ง values.yaml'
  },
  {
    sourceId: 'S18',
    title: 'GitLab Chart: Cluster Setup & Resource Planning',
    section: 'GitLab Installation / Cloud Setup',
    url: 'https://docs.gitlab.com/charts/installation/cloud/',
    description: 'ข้อกำหนดทรัพยากรของ GitLab (RAM อย่างน้อย 4-8 GB แนะนำ) และการปรับแต่ง minimal footprint สำหรับโฮสต์เครื่องเดียว'
  },
  {
    sourceId: 'S19',
    title: 'GitLab Official Docker Installation & Configuration',
    section: 'GitLab Docker Installation',
    url: 'https://docs.gitlab.com/install/docker/',
    description: 'การรัน GitLab Omnibus image ใน Docker container ทางเลือกสำหรับโฮสต์ที่มีทรัพยากรจำกัด, external_url config และ volume persistence'
  },
  {
    sourceId: 'S20',
    title: 'Configure Liveness, Readiness and Startup Probes',
    section: 'Tasks / Configure Pods',
    url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/',
    description: 'ความแตกต่างของ Health checks: Readiness ตรวจว่าพร้อมรับ Traffic หรือยัง, Liveness ตรวจว่า container ค้างหรือไม่, Startup สำหรับแอปที่บูตช้า'
  },
  {
    sourceId: 'S21',
    title: 'Resource Management for Pods and Containers',
    section: 'Configuration / Manage Resources',
    url: 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/',
    description: 'การตั้งค่า requests และ limits สำหรับ CPU และ Memory, กลไก OOMKilled (Exit Code 137) เมื่อหน่วยความจำเกิน limit'
  }
];
