# 🚀 End-to-End DevOps CI/CD Pipeline with Monitoring (Node.js Application)

## 📌 Project Overview

This project demonstrates a complete end-to-end DevOps pipeline where a Node.js application is built, tested, containerized, deployed, and monitored using industry-standard tools.

The pipeline is fully automated using Jenkins and follows a production-style workflow including CI/CD and monitoring.

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

## ☁️ Infrastructure Setup

An EC2 instance is used to host Jenkins, Docker, the application, and the monitoring stack.

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

Jenkins can be accessed via:

```text
http://<JENKINS-SERVER-IP>:8080
```

Get initial admin password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

---

## 📦 Step 3: CI/CD Pipeline Setup

A Jenkins pipeline is defined using a `Jenkinsfile` stored in the repository.

### Pipeline Stages

1. Checkout code from GitHub
2. Build Docker image
3. Run tests inside container
4. Push image to Docker Hub
5. Deploy container on server

---

## 🔔 CI/CD Automation using Webhook

Webhook integration is configured to trigger the pipeline automatically on every code push.

### Flow:

1. Code pushed to GitHub
2. GitHub sends webhook event
3. Jenkins triggers pipeline
4. Deployment happens automatically

---

## 🐳 Step 4: Docker Build & Push

```bash
docker build -t <docker-username>/nodejs-app .
docker push <docker-username>/nodejs-app:latest
```

---

## 🚀 Step 5: Deployment

```bash
docker run -d -p 80:3000 <docker-username>/nodejs-app:latest
```

---

## 🌐 Application Access

```text
http://<EC2-PUBLIC-IP>
```

---

## 📊 Step 6: Monitoring Setup

Monitoring is implemented using Prometheus and Grafana.

---

### 🔹 Run Node Exporter

```bash
docker run -d -p 9100:9100 --name node-exporter prom/node-exporter
```

---

### 🔹 Run cAdvisor

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

### 🔹 Prometheus Configuration

```yaml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['<EC2-PUBLIC-IP>:9100']

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['<EC2-PUBLIC-IP>:8081']
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

### 🔹 Grafana Access

```text
http://<EC2-PUBLIC-IP>:3001
```

(Default credentials can be configured)

---

## 🔄 CI/CD Flow

Developer → Git Push → GitHub → Jenkins → Build → Test → Push → Deploy

---

## 🔐 Security Note

Sensitive information such as credentials, tokens, and server-specific details are not included in this repository to follow security best practices.

---

## 💡 Key Features

* Automated CI/CD pipeline
* Webhook-based automation
* Dockerized application
* Continuous deployment
* Container-based testing
* Monitoring with Prometheus & Grafana
* System and container observability

---

## 👨‍💻 Author

Chirag Puniyani
