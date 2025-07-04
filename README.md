GreenCloud Node.js API
This repository contains the source code and infrastructure configurations for the GreenCloud Node.js API, deployed on Google Cloud Run with a Continuous Integration/Continuous Deployment (CI/CD) pipeline. It connects to a MongoDB Atlas database for data persistence.

Table of Contents
Project Overview

Local Development Setup

Cloud Deployment (Google Cloud Run)

CI/CD Pipeline

Infrastructure-as-Code (Terraform)

Monitoring & Alerting

Network Topology & Security

API Documentation (OpenAPI/Swagger)

Cost & Usage Considerations

1. Project Overview
The GreenCloud Node.js API provides a backend service built with Express.js and Mongoose (for MongoDB interaction). It is designed to be highly scalable and maintainable, leveraging Google Cloud's serverless capabilities.

Key Technologies:

Backend: Node.js, Express.js, Mongoose

Database: MongoDB Atlas (cloud), MongoDB (local via Docker)

Containerization: Docker

Cloud Platform: Google Cloud Platform (GCP)

Deployment: Google Cloud Run

CI/CD: Google Cloud Build

Secrets Management: Google Secret Manager

Infrastructure as Code: Terraform

2. Local Development Setup
To run the API locally using Docker Compose:

Prerequisites:
Docker Desktop installed and running.

Node.js and npm (optional, for running outside Docker or specific local tasks).

Steps:
Clone the repository:

git clone https://github.com/nextgenhafeez/greencloud-nodejs-api.git
cd greencloud-nodejs-api

Review docker-compose.yml:
This file defines your local Node.js app service and a local MongoDB service.

docker-compose.yml (see docker-compose-final immersive)

Note: The MONGO_PASSWORD and JWT_SECRET in docker-compose.yml are for local development only. Do NOT use production secrets here.

Ensure config/default.json is present:
This file defines the local MongoDB URI and JWT secret used by your application when running locally.

config/default.json (see config-default-json immersive)

Install Node.js dependencies (inside the container via Dockerfile):
The Dockerfile handles npm install during the build process.

Build and run the services:
From the root of this project, run:

docker-compose up --build

This will:

Build your Node.js application's Docker image.

Start the MongoDB container.

Start your Node.js application container.

Verify local application:
Once docker-compose up completes, your API should be running locally.

Access the test endpoint: http://localhost:8080/test

You should see: "Hello from the API! (CI/CD should work now!)" (or your latest test message).

Check your terminal logs for "MongoDB Connected..." from the app service.

3. Cloud Deployment (Google Cloud Run)
The application is deployed as a serverless container on Google Cloud Run.

Key Service Details:
Service Name: greencloud-nodejs-api-service

Region: us-central1

Public URL: https://greencloud-nodejs-api-service-wup63a4a5a-uc.a.run.app (This URL may change upon new deployments if not managed by a custom domain).

Manual Deployment (for initial setup or debugging):
While CI/CD is configured, you can manually deploy using gcloud if needed:

Ensure Google Cloud SDK is configured and authenticated.

Build the Docker image locally:

docker build -t gcr.io/YOUR_PROJECT_ID/greencloud-nodejs-app:v1.0.1 .

(Replace YOUR_PROJECT_ID with your actual GCP project ID).

Push the image to Google Container Registry/Artifact Registry:

docker push gcr.io/YOUR_PROJECT_ID/greencloud-nodejs-app:v1.0.1

Deploy to Cloud Run:

gcloud run deploy greencloud-nodejs-api-service \
  --image gcr.io/YOUR_PROJECT_ID/greencloud-nodejs-app:v1.0.1 \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars MONGO_USERNAME=nextgenhafeez,MONGO_HOST=greencloud-nodejs-api-d.hbjkcdg.mongodb.net,MONGO_DB_NAME=node-aws-fargate-app,JWT_SECRET=YOUR_PROD_JWT_SECRET \
  --set-secrets MONGO_PASSWORD=mongodb-password:latest \
  --project YOUR_PROJECT_ID

(Replace placeholders with your actual values).

4. CI/CD Pipeline
A Continuous Integration/Continuous Deployment (CI/CD) pipeline is set up using Google Cloud Build, triggered by pushes to the main branch of this GitHub repository.

Configuration: The CI/CD steps are defined in cloudbuild.yaml (see cloudbuild-yaml-final-fix immersive).

Flow:

Code pushed to main branch on GitHub.

Cloud Build trigger detects the push.

Cloud Build executes cloudbuild.yaml:

Builds a new Docker image.

Pushes the image to Google Container Registry/Artifact Registry.

Deploys the new image as a new revision to the greencloud-nodejs-api-service on Cloud Run.

Monitoring Builds: You can monitor the status and logs of builds in the Google Cloud Build History page.

5. Infrastructure-as-Code (Terraform)
The Google Cloud Run service and its essential IAM permissions are defined as Infrastructure-as-Code using Terraform. This allows for version-controlled, repeatable, and declarative management of your cloud resources.

Terraform Files:

terraform/main.tf (see terraform-main-tf-ultimate-fix-v3 immersive)

terraform/variables.tf (defines input variables)

terraform/outputs.tf (defines output values like service URL)

Usage:

Navigate to the terraform/ directory.

Initialize Terraform: terraform init (ensure your GCS backend bucket for state is configured and exists).

Review the plan: terraform plan

Apply changes: terraform apply

Note: Ensure variables.tf (or a terraform.tfvars file) is correctly populated with your GCP project ID, region, and sensitive values like JWT_SECRET.

6. Monitoring & Alerting
Google Cloud provides robust monitoring and alerting capabilities for your Cloud Run service.

Metrics & Dashboards:

Access pre-built metrics (requests, latency, CPU/memory) for your Cloud Run service in the Cloud Run service details page.

Create custom dashboards in Google Cloud Monitoring to combine various metrics.

Logs:

View application logs directly from the "Logs" tab on your Cloud Run service page or in Google Cloud Logging (Logs Explorer).

Alerting:

Set up alert policies in Google Cloud Monitoring to notify you of critical events (e.g., high error rates, high latency, low instance count).

Example: An alert could be configured to trigger if the 5xx error rate for your service exceeds a certain threshold for a sustained period.

7. Network Topology & Security
For Cloud Run, network topology and security are largely managed by Google Cloud, providing a secure-by-default environment.

Detailed Documentation: Refer to docs/Network_Security_CloudRun.md (see network-security-docs immersive) for a comprehensive explanation of how network topology and security are handled for this service.

Key Aspects:

Managed HTTPS endpoint, no direct VPC/subnet configuration.

IAM-based access control (roles/run.invoker for public access).

Secure Secret Manager integration for sensitive credentials.

Recommendation for MongoDB Atlas IP Access List for enhanced database security.

8. API Documentation (OpenAPI/Swagger)
While a formal OpenAPI (Swagger) specification file (swagger.json or openapi.yaml) is not currently included in this repository, it is highly recommended for documenting your API's endpoints, request/response schemas, and authentication methods.

Future Steps:

Generate an OpenAPI specification from your Node.js application (e.g., using libraries like swagger-jsdoc or express-oas-generator).

Host the Swagger UI to provide an interactive API documentation portal.

9. Cost & Usage Considerations
Cloud Run is a pay-per-use serverless service, which means you only pay for the resources consumed while your application is actively processing requests.

Billing Reports: Monitor your costs in Google Cloud Billing Reports. You can filter by service (Cloud Run, Cloud Build, Secret Manager, etc.) to understand your spending patterns.

Rightsizing for Cloud Run:

CPU & Memory Limits: Set these to the minimum required for optimal performance. Monitor actual usage in Cloud Monitoring and adjust limits (cpu, memory in main.tf) if over-provisioned.

Max Instances: The current max_instance_count = 5 in Terraform is a reasonable cap. Adjust based on expected peak load to control costs during unexpected traffic bursts.

Concurrency: Optimize your application to handle multiple concurrent requests per instance efficiently.

Cold Starts: Optimize application startup time to minimize CPU allocation during cold starts.

Free Tier: Leverage Cloud Run's generous free tier for initial development and low-traffic applications.