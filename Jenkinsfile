pipeline {
    agent any
    tools {
        nodejs 'node'
    }
    environment {
        TESTING_ENVIRONMENT = "staging"
        PRODUCTION_ENVIRONMENT = "production"
        PATH = "/usr/local/bin:$PATH"
        LAMBDA_FUNCTION_NAME = 'sit-753-production-app'
        SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:058264244985:lambda-error-logs'
        AWS_REGION = 'us-east-1'
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
                sh 'npm run test:unit'
            }
        }
        stage('Code Analysis') {
            steps {
                echo "check the quality of the code using ESLint..."
                sh 'npm run lint --output-file lint.log'
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
                sh 'snyk test --json-file-output=security.json'
            }
            post {
                always {
                    emailext attachmentsPattern: 'security.json',
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
                sh "npm run test"
            }
        }
        stage('Deploy to Production') {
            steps {
                echo "Deploying to AWS Lambda using Serverless Framework"
                sh "serverless deploy --stage ${env.PRODUCTION_ENVIRONMENT}"
            }
        }
        stage('Setup Cloudwatch Alarm') {
            steps {
                echo "Setting up Cloudwatch Alarm for Lambda function"
                sh "aws cloudwatch put-metric-alarm --alarm-name ${env.LAMBDA_FUNCTION_NAME}-alarm --alarm-description 'Alarm when Lambda function has high error rate' --metric-name Errors --namespace AWS/Lambda --statistic SampleCount --period 60 --threshold 1 --comparison-operator GreaterThanThreshold --dimensions Name=FunctionName,Value=${env.LAMBDA_FUNCTION_NAME} --evaluation-periods 1 --alarm-actions ${env.SNS_TOPIC_ARN} --region ${env.AWS_REGION}"
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