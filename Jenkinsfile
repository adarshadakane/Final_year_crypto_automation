pipeline {
    agent any

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        IMAGE_NAME = 'adarshadakane/newbuild'
        CONTAINER_NAME = 'newbuild'
        // SONARQUBE_CONTAINER = 'sonarqube_server'
        // SONARQUBE_PORT = '9000'
        PROJECT_PORT = '3190'
        
        // SONARQUBE_URL = 'http://localhost:9000'
    }

    stages {
        stage('Checkout from Git') {
            steps {
                git branch: 'main', url: 'https://github.com/adarshadakane/Final_year_crypto_automation.git'
            }
        }


        stage("Sonarqube Analysis") {
            steps {
             withSonarQubeEnv('SonarQube-Server') {
                sh '''
                 ${SCANNER_HOME}/bin/sonar-scanner \
                -Dsonar.projectKey=Crypto \
                -Dsonar.sources=. \
                -Dsonar.host.url=http://13.127.106.180:9000 \
                -Dsonar.login=sqp_f91f0899bc4d9cf046f607d8cd1b0b147b30ae53
                    '''
                }
            }
        }

        stage("Quality Gate") {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'SonarQube-Token'
                }
            }
        }

        stage('TRIVY FS SCAN') {
            steps {
                sh "trivy fs . > trivyfs.txt"
             }
         }

    
        stage("Docker Image Build")
        {
            steps
            {
                
                sh 'docker build -t adarshadakane/newbuild:$BUILD_NUMBER .'
            }
        }
        
        // stage('Build and Push Docker Image') {  // Renamed stage
        //     steps {
        //         script {
        //             sh "docker pull ${IMAGE_NAME}"
        //         }
        //     }
        // }

        // stage('Stop Existing Container') {
        //     steps {
        //         script {
        //             sh """
        //             docker ps -q --filter "name=${CONTAINER_NAME}" | grep -q . && docker stop ${CONTAINER_NAME} || true
        //             docker ps -a -q --filter "name=${CONTAINER_NAME}" | grep -q . && docker rm ${CONTAINER_NAME} || true
        //             """
        //         }
        //     }
        // }

        

        stage("Push Image to DockerHub")
         {
            steps
            {
                script
                {
                        withCredentials([string(credentialsId: 'DockerHub-Passwd', variable: 'DockerHubPasswd')]) {
                                sh 'docker login -u  adarshadakane -p $DockerHubPasswd'
                               sh 'docker push adarshadakane/newbuild:$BUILD_NUMBER'
                            }
                    
                }
                
            }
        }




        
        stage('Run Docker Container') {
            steps {
                script {
                    sh "docker run -d --name ${CONTAINER_NAME} -p ${PROJECT_PORT}:${PROJECT_PORT} ${IMAGE_NAME}:$BUILD_NUMBER"
                }
            }
        }






        
        // stage('Show EC2 Public DNS') {
        //     steps {
        //         script {
        //             sh "curl http://169.254.169.254/latest/meta-data/public-hostname"
        //         }
        //     }
        // }
    }
}
