# 🚀 End-to-End DevOps CI/CD Pipeline with Monitoring (Node.js Application)

## 📌 Project Overview

This project demonstrates a complete end-to-end DevOps pipeline where a Node.js application is built, tested, containerized, deployed, and monitored using industry-standard tools.

The pipeline is fully automated using Jenkins and follows a production-style workflow including CI/CD and monitoring.

---

## 🎯 Objective

The objective of this project is to design and implement a CI/CD pipeline that automatically builds, tests, and deploys a containerized application whenever code is pushed to the repository.

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
└── README.md
```

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

```
http://<JENKINS-SERVER-IP>:8080
```

Get initial admin password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

---

## 📦 Step 3: CI/CD Pipeline Setup

A Jenkins pipeline is defined using a `Jenkinsfile`.

### Pipeline Stages

* Checkout Code
* Build Docker Image
* Run Tests
* Push Image to Docker Hub
* Deploy Container

---

## 🔔 CI/CD Automation using Webhook

The pipeline is automatically triggered using GitHub webhook on every code push.

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

```
http://<EC2-PUBLIC-IP>
```

---

## 📊 Step 6: Monitoring Setup

Monitoring is implemented using Prometheus and Grafana.

### Tools Used

* Node Exporter (System Metrics)
* cAdvisor (Container Metrics)
* Prometheus (Metrics Collection)
* Grafana (Visualization)

---

## 🔄 CI/CD Flow

```
Developer → Git Push → GitHub → Jenkins → Build → Test → Push → Deploy
```

---

## ☸️ Kubernetes Deployment (Optional)

The application can also be deployed on Kubernetes for scalability.

Kubernetes manifests are included:

* deployment.yaml
* service.yaml

These can be applied using:

kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

This enables horizontal scaling using multiple replicas.

---

## 🔐 Security Note

Sensitive information such as credentials, tokens, and server-specific details are not included in this repository.

---

## 💡 Key Features

* Automated CI/CD pipeline
* Webhook-based automation
* Dockerized application
* Continuous deployment
* Monitoring with Prometheus & Grafana
* Kubernetes-ready deployment (optional scalability)

---

## 👨‍💻 Author

Chirag Puniyani
