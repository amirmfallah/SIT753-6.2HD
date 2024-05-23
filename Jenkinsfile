pipeline {
    agent { nodejs "node" }
    environment {
        TESTING_ENVIRONMENT = "staging"
        PRODUCTION_ENVIRONMENT = "production"
        PATH = "/usr/local/bin:$PATH"
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                echo "Running unit tests with Jest..."
                sh 'npm run test'
            }
        }
        stage('Code Analysis') {
            steps {
                echo "check the quality of the code using ESLint..."
                sh 'npx eslint > lint.log'
            }
            post {
                always {
                    emailext attachmentsPattern: 'lint.log',
                    to: 'amirmhfallah@gmail.com', 
                    subject: "Quality Check - ${env.JOB_NAME} #${env.BUILD_NUMBER}", 
                    body: "Quality Check completed. Status: ${currentBuild.currentResult}. See attached log for details."
                }
            }
        }
        stage('Security Scan') {
            steps {
                echo "Scanning securities using Snyk..."
                echo "snyk test"
                sh 'snyk test > scan.log'
            }
            post {
                always {
                    emailext attachmentsPattern: 'scan.log',
                    to: 'amirmhfallah@gmail.com', 
                    subject: "Security Scan - ${env.JOB_NAME} #${env.BUILD_NUMBER}", 
                    body: "Security Scan completed. Status: ${currentBuild.currentResult}. See attached log for details."
                }
            }
        }
        stage('Deploy to Stating') {
            steps {
                echo "Deploying to AWS Lambda using Serverless Framework"
                sh "serverless deploy --stage ${env.TESTING_ENVIRONMENT}"
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
                sh "serverless deploy --stage ${env.PRODUCTION_ENVIRONMENT}"
            }
        }
    }
    post {
        always {
            emailext attachLog: true,
            to: 'amirmhfallah@gmail.com',
            subject: "Pipeline Execution Completed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: "The pipeline execution has completed. Check Jenkins for details: ${env.BUILD_URL}"
        }
    }
}