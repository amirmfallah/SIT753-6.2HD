pipeline {
    agent any
    environment {
        DIRECTORY_PATH = "/Users/amir/Documents/Deakin/SIT753 Professional Practice/5.1P"
        TESTING_ENVIRONMENT = "TestEnv"
        PRODUCTION_ENVIRONMENT = "ProdEnv"
    }
    stages {
        stage('Build') {
            steps {
                echo "fetch the source code from the directory path specified by the environment variable: ${env.DIRECTORY_PATH}"
                echo "npm install"
            }
        }
        stage('Test') {
            steps {
                echo "Running unit and integtration tests with Jest..."
                echo "npx jest --coverage"
                sh 'echo "writing test results to file" > test.log'
            }
            post {
                always {
                    emailext attachmentsPattern: 'test.log',
                    to: 'xacecaf879@ekposta.com', 
                    subject: "Test Results - ${env.JOB_NAME} #${env.BUILD_NUMBER}", 
                    body: "Unit tests completed. Status: ${currentBuild.currentResult}. See attached log for details."
                }
            }
        }
        stage('Code Analysis') {
            steps {
                echo "check the quality of the code using ESLint..."
            }
        }
        stage('Security Scan') {
            steps {
                echo "Scanning securities using Snyk..."
                echo "snyk code test"
                sh 'echo "writing test results to file" > scan.log'
            }
            post {
                always {
                    emailext attachmentsPattern: 'scan.log',
                    to: 'xacecaf879@ekposta.com', 
                    subject: "Security Scan - ${env.JOB_NAME} #${env.BUILD_NUMBER}", 
                    body: "Security Scan completed. Status: ${currentBuild.currentResult}. See attached log for details."
                }
            }
        }
        stage('Deploy to Stating') {
            steps {
                echo "Deploying to AWS Lambda using Serverless Framework"
                echo "serverless deploy --stage ${env.TESTING_ENVIRONMENT}"
            }
        }
        stage('Integration Tests on Staging') {
            steps {
                echo "Running integtration tests with Jest..."
                echo "npx jest --coverage"
            }
        }
        stage('Deploy to Production') {
            steps {
                echo "Deploying to AWS Lambda using Serverless Framework"
                echo "serverless deploy --stage ${env.PRODUCTION_ENVIRONMENT}"
            }
        }
    }
    post {
        always {
            emailext attachLog: true,
            to: 'xacecaf879@ekposta.com',
            subject: "Pipeline Execution Completed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: "The pipeline execution has completed. Check Jenkins for details: ${env.BUILD_URL}"
        }
    }
}