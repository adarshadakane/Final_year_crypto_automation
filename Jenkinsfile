pipeline {
    agent any

    environment {

        IMAGE_NAME = 'adarshadakane/newbuild'
        CONTAINER_NAME = 'newbuild'
        // SONARQUBE_CONTAINER = 'sonarqube_server'
        // SONARQUBE_PORT = '9000'
        PROJECT_PORT = '3190'
        
        // SONARQUBE_URL = 'http://localhost:9000'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git branch: 'main', url: 'https://github.com/adarshadakane/Final_year_crypto_automation.git'
            }
        }

    //   stage('Sonaqube Analysis ')  {
    //         // We have to configure sonar cube server on timestamp 1:08:15 in the video  
    //         steps{
                
    //             script{
                    
    //                 withSonarQubeEnv(credentialsId : 'sonar') {
                        
    //                     sh 'mvn clean package sonar:sonar'
    //                 }
    //             }
                    
    //         }
    //     }

        // stage('SonarQube Analysis') {
        //     steps {
        //         script {
        //             withSonarQubeEnv('SonarQube') {
        //                 sh """
        //                 until curl -s ${SONARQUBE_URL} >/dev/null; do echo "Waiting for SonarQube..."; sleep 5; done
        //                 sonar-scanner -Dsonar.projectKey=CryptoShare -Dsonar.sources=. -Dsonar.host.url=${SONARQUBE_URL}
        //                 """
        //             }
        //         }
        //     }
        // }
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
