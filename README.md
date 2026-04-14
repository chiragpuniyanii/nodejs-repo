# 🚀 End-to-End DevOps CI/CD Pipeline with Monitoring (Node.js Application)

## 📌 Project Overview

This project demonstrates a complete end-to-end DevOps pipeline where a Node.js application is built, tested, containerized, deployed, and monitored using industry-standard tools.

The pipeline is fully automated using Jenkins and integrates continuous integration, continuous deployment, and monitoring.

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

## ☁️ Infrastructure Setup (AWS EC2)

An EC2 instance is used to host Jenkins, Docker, application, and monitoring stack.

### EC2 Details

* Public IP: 98.91.27.15
* OS: Ubuntu

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

Open Jenkins:

http://98.91.27.15:8080

Get initial password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Complete setup and install suggested plugins.

---

## 📦 Step 3: CI/CD Pipeline Setup

A Jenkins pipeline is configured using a `Jenkinsfile` stored in the repository.

### Pipeline Stages

1. Checkout code from GitHub
2. Build Docker image
3. Run tests inside container
4. Push image to Docker Hub
5. Deploy container on EC2

---

## 🔔 CI/CD Automation using Webhook

To enable automatic pipeline execution, a webhook is configured between GitHub and Jenkins.

### 🔹 How it works

1. Developer pushes code to GitHub
2. GitHub sends a webhook event to Jenkins
3. Jenkins triggers the pipeline automatically
4. CI/CD pipeline executes

---

### 🔹 Webhook Configuration

* GitHub → Settings → Webhooks
* Payload URL:
  http://98.91.27.15:8080/github-webhook/
* Content Type: application/json

---

### 🔹 Jenkins Configuration

* Pipeline configured with GitHub integration
* Enabled: "GitHub hook trigger for GITScm polling"

---

## 🐳 Step 4: Docker Build & Push

Docker image is built and pushed to Docker Hub.

```bash
docker build -t chiragg619/nodejs-app .
docker push chiragg619/nodejs-app:latest
```

---

## 🚀 Step 5: Deployment

The application is deployed on EC2 using Docker.

```bash
docker run -d -p 80:3000 chiragg619/nodejs-app:latest
```

### 🌐 Application URL

http://98.91.27.15

---

## 📊 Step 6: Monitoring Setup

Monitoring is implemented using Prometheus and Grafana.

---

### 🔹 Run Node Exporter (System Metrics)

```bash
docker run -d -p 9100:9100 --name node-exporter prom/node-exporter
```

---

### 🔹 Run cAdvisor (Container Metrics)

```bash
docker run -d \
--name cadvisor \
-p 8081:8080 \
--volume=/:/rootfs:ro \
--volume=/var/run:/var/run:ro \
--volume=/sys:/sys:ro \
--volume=/var/lib/docker/:/var/lib/docker:ro \
gcr.io/cadvisor/cadvisor
```

---

### 🔹 Create Prometheus Configuration

```yaml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['98.91.27.15:9100']

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['98.91.27.15:8081']
```

---

### 🔹 Run Prometheus

```bash
docker run -d \
-p 9090:9090 \
-v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
--name prometheus \
prom/prometheus
```

---

### 🔹 Run Grafana

```bash
docker run -d -p 3001:3000 --name grafana grafana/grafana
```

---

### 🔹 Grafana Setup

* URL: http://98.91.27.15:3001
* Username: admin
* Password: chirag

Add Prometheus data source:

http://98.91.27.15:9090

Import Dashboard:

* ID: 1860 (Node Exporter Full)

---

## 🔄 CI/CD Flow

Developer → Git Push → GitHub → Jenkins → Build → Test → Push → Deploy

---

## 🔐 Credentials Management

Sensitive credentials such as Docker Hub login details are securely stored in Jenkins using the built-in credentials manager.

No secrets are exposed in the repository.

---

## 💡 Key Features

* Automated CI/CD pipeline
* Webhook-based automation
* Dockerized application
* Continuous deployment on EC2
* Container-based testing
* Real-time monitoring
* Full observability (system + container metrics)

---

## 🏆 Production Considerations

* Jenkins should run on a separate server
* Use secure secrets management
* Enable HTTPS and domain
* Use Kubernetes for scaling

---

## 👨‍💻 Author

Chirag Puniyani
