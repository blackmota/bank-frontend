pipeline {
    agent any
    tools {
        nodejs 'NodeJS_20' // Asegúrate de tener una instalación de Node.js configurada en Jenkins
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/blackmota/bank-frontend']])
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm install' // Instala las dependencias necesarias
            }
        }

        stage('Build React app') {
            steps {
                bat 'npm run build' // Construye la app y genera la carpeta 'dist'
            }
        }

        stage('Build Docker image') {
            steps {
                script {
                    bat 'docker build --no-cache -t blackmota/bank-frontend:latest .' // Crea la imagen Docker del frontend
                }
            }
        }

        stage('Push image to Docker Hub') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'dhpswid', variable: 'dhpsw')]) {
                        bat 'docker login -u blackmota -p %dhpsw%'
                    }
                    bat 'docker push blackmota/bank-frontend:latest' // Empuja la imagen a Docker Hub
                }
            }
        }
    }
}
