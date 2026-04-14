pipeline {
    agent any

    environment {
        IMAGE_NAME = "chiragg619/nodejs-app"
        CONTAINER = "nodejs-container"
        APP_PORT = "80"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Cloning latest code from GitHub..."
                git branch: 'main', url: 'https://github.com/chiragpuniyanii/nodejs-repo.git'
            }
        }

        stage('Build Image') {
            steps {
                echo "Building Docker image..."
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Run Basic Test') {
            steps {
                echo "Running container-based test..."
                sh "docker run --rm ${IMAGE_NAME}:latest node -v"
            }
        }

        stage('Push Image') {
            steps {
                echo "Pushing image to Docker Hub..."

                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        docker logout || true
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying latest container..."

                sh '''
                    # Stop and remove old container if exists
                    docker stop ${CONTAINER} || true
                    docker rm ${CONTAINER} || true

                    # Pull latest image
                    docker pull ${IMAGE_NAME}:latest

                    # Run new container
                    docker run -d -p ${APP_PORT}:3000 --name ${CONTAINER} ${IMAGE_NAME}:latest
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully 🚀"
        }
        failure {
            echo "Something went wrong ❌ Check logs."
        }
        always {
            echo "Pipeline execution finished."
        }
    }
}
