# 🚀 End-to-End DevOps CI/CD Pipeline with Monitoring (Node.js Application)

---

## 📌 Project Overview

Production-style DevOps pipeline demonstrating how a Node.js application is built, tested, containerized, deployed, and monitored using industry-standard tools.

The pipeline is fully automated using Jenkins and follows CI/CD best practices with support for scalable deployment.

---

## 🎯 Objective

To design and implement a CI/CD pipeline that automatically builds, tests, and deploys a containerized application whenever code is pushed to the repository.

---

## 🛠️ Tech Stack

* GitHub – Source Code Management
* Jenkins – CI/CD Automation
* Docker – Containerization
* Docker Hub – Container Registry
* AWS EC2 – Deployment Server
* Prometheus – Monitoring
* Grafana – Visualization

---

## 📂 Project Structure

```
.
├── server.js
├── package.json
├── Dockerfile
├── Jenkinsfile
├── prometheus.yml
├── .env.example
├── k8s/                  # Kubernetes manifests
│   ├── deployment.yaml
│   └── service.yaml
└── README.md
```

---

## ☁️ Infrastructure Setup

A single EC2 instance is used to host:

* Jenkins (CI/CD)
* Docker (container runtime)
* Application container
* Monitoring stack (Prometheus + Grafana)

Jenkins is configured with appropriate Docker permissions to build and run containers.

---

## ⚙️ Step 1: Install Required Tools

### Install Docker

```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
```

---

### Install Jenkins

```bash
sudo apt install openjdk-17-jdk -y

curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2023.key | sudo tee \
/usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
https://pkg.jenkins.io/debian binary/ | sudo tee \
/etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install jenkins -y
sudo systemctl start jenkins
```

---

## 🔐 Step 2: Access Jenkins

```
http://<JENKINS-SERVER-IP>:8080
```

Get initial admin password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

---

## 📦 Step 3: CI/CD Pipeline Setup

The pipeline is defined using a `Jenkinsfile`.

### Pipeline Stages

* Checkout Source Code
* Build Docker Image
* Run Container-based Tests
* Push Image to Docker Hub
* Deploy Container to Server

---

## 🔔 CI/CD Automation (Webhook)

GitHub webhook is configured to trigger the Jenkins pipeline automatically on every push.

---

## 🐳 Step 4: Docker Build & Push

```bash
docker build -t <docker-username>/nodejs-app .
docker push <docker-username>/nodejs-app:latest
```

---

## 🚀 Step 5: Deployment (EC2)

```bash
docker run -d -p 80:3000 <docker-username>/nodejs-app:latest
```

---

## 🌐 Application Access

```
http://<EC2-PUBLIC-IP>
```

---

## 📊 Step 6: Monitoring Setup

Monitoring is implemented using:

* Node Exporter → System metrics
* cAdvisor → Container metrics
* Prometheus → Metrics collection
* Grafana → Visualization

---

## 🔄 CI/CD Flow

```
Developer → Git Push → GitHub → Jenkins → Build → Test → Push → Deploy
```

---

## ☸️ Kubernetes Deployment (Optional - Scalable Architecture)

The application is also Kubernetes-ready for handling increased traffic and scaling requirements.

Kubernetes manifests are organized in the `k8s/` directory:

* `k8s/deployment.yaml`
* `k8s/service.yaml`

### Apply Kubernetes Deployment

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Benefits

* Horizontal scaling using replicas
* Improved availability
* Better traffic handling

---

## 🔐 Security Note

Sensitive information such as credentials, tokens, and server-specific details are not included in this repository, following security best practices.

---

## 💡 Key Features

* Automated CI/CD pipeline using Jenkins
* Webhook-based deployment trigger
* Dockerized Node.js application
* Continuous deployment on EC2
* Monitoring with Prometheus & Grafana
* Kubernetes-ready scalable architecture
* Clean and structured repository

---

## 👨‍💻 Author

**Chirag Puniyani**
