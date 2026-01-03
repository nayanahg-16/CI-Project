# E-Commerce CI/CD Project - Complete Setup Guide (Mac)

Complete guide to set up and deploy the E-Commerce application with CI/CD pipeline on Mac.

---

## 📋 Table of Contents

1. [Local Setup (Mac)](#local-setup-mac)
2. [Docker Setup](#docker-setup)
3. [Jenkins CI/CD Setup](#jenkins-cicd-setup)
4. [Docker Hub Configuration](#docker-hub-configuration)
5. [SonarQube Setup](#sonarqube-setup)
6. [Running the Pipeline](#running-the-pipeline)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Local Setup (Mac)

### Step 1: Install Prerequisites

#### Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Install Node.js 18+
```bash
brew install node@18
# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install 18
nvm use 18
```

#### Install Docker Desktop
```bash
# Download from: https://www.docker.com/products/docker-desktop
# Or via Homebrew
brew install --cask docker
```

Start Docker Desktop from Applications.

#### Verify Installations
```bash
node --version    # Should be v18.x or higher
npm --version     # Should be 9.x or higher
docker --version  # Should show Docker version
```

### Step 2: Install Project Dependencies

```bash
cd /path/to/devops-project
npm install
```

### Step 3: Run the Application Locally

```bash
# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

**Access the application:** http://localhost:3000

### Step 4: Test the Application

1. Open browser: http://localhost:3000
2. Browse products, add to cart, test checkout
3. Test API endpoints:
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/api/products
   ```

---

## 🐳 Docker Setup

### Build Docker Image

```bash
docker build -t ecommerce-app .
```

### Run Docker Container

```bash
docker run -p 3000:3000 ecommerce-app
```

**Access:** http://localhost:3000

### Stop Container

```bash
# Find container ID
docker ps

# Stop container
docker stop <container-id>
```

### Test Docker Image Locally

```bash
# Build
docker build -t ecommerce-app .

# Run
docker run -d -p 3000:3000 --name ecommerce ecommerce-app

# Check logs
docker logs ecommerce

# Stop and remove
docker stop ecommerce
docker rm ecommerce
```

---

## 🔧 Jenkins CI/CD Setup

### Step 1: Install Jenkins on Mac

#### Option A: Using Homebrew (Recommended)
```bash
brew install jenkins-lts
brew services start jenkins-lts
```

#### Option B: Using Java and WAR file
```bash
# Install Java
brew install openjdk@11

# Download Jenkins WAR
mkdir ~/jenkins
cd ~/jenkins
wget https://get.jenkins.io/war-stable/latest/jenkins.war

# Run Jenkins
java -jar jenkins.war --httpPort=8080
```

**Access Jenkins:** http://localhost:8080

**Get initial password:**
```bash
cat ~/.jenkins/secrets/initialAdminPassword
```

### Step 2: Install Required Jenkins Plugins

1. Go to: http://localhost:8080
2. Login with admin password
3. **Manage Jenkins** → **Manage Plugins** → **Available**
4. Install these plugins:
   - Git Plugin
   - Docker Pipeline Plugin
   - SonarQube Scanner
   - Pipeline
   - Blue Ocean (optional, for better UI)

5. **Restart Jenkins** after installation

### Step 3: Install Tools on Mac for Jenkins

#### Install Docker (if not already installed)
```bash
brew install --cask docker
# Start Docker Desktop
```

#### Install Node.js (if not already installed)
```bash
brew install node@18
```

#### Install SonarQube Scanner

```bash
# Install via Homebrew
brew install sonar-scanner

# Or download manually
cd /opt
sudo wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-macosx.zip
sudo unzip sonar-scanner-cli-4.8.0.2856-macosx.zip
sudo mv sonar-scanner-4.8.0.2856-macosx sonar-scanner
```

**Configure in Jenkins:**
1. **Manage Jenkins** → **Global Tool Configuration**
2. Scroll to **SonarQube Scanner**
3. Click **Add SonarQube Scanner**
4. Name: `SonarQubeScanner`
5. Uncheck "Install automatically"
6. Set SONAR_RUNNER_HOME: `/opt/sonar-scanner` (or `/opt/homebrew/bin` if using Homebrew)
7. Save

#### How to Access SonarQube

You have two options:

**Option 1: SonarCloud (Easiest - Recommended)**
1. Go to: **https://sonarcloud.io/**
2. Click **Log in** (top right)
3. Sign up with **GitHub** or **Google** account
4. Once logged in, you'll see your dashboard
5. **Create a new project:**
   - Click **+** → **Create Project**
   - Choose **Manually** or connect to GitHub
   - Project key: `ecommerce-app`
   - Display name: `E-Commerce App`
   - Click **Set Up**
6. **Get your token:**
   - Click on your project
   - Go to **Project Settings** → **Analysis Method**
   - Under **Token**, click **Generate Token**
   - Copy the token (you'll need it for Jenkins)

**Option 2: Self-Hosted SonarQube (Local)**
```bash
# Run SonarQube in Docker
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community

# Wait 1-2 minutes for SonarQube to start, then:
# Access: http://localhost:9000
# Default login: admin / admin
# You'll be prompted to change password on first login
```

**After accessing SonarQube, get your token:**
1. Log in to SonarQube/SonarCloud
2. Click your profile (top right) → **My Account**
3. Go to **Security** tab
4. Under **Generate Tokens**, enter name: `jenkins-token`
5. Click **Generate**
6. **Copy the token immediately** (you won't see it again!)

### Step 4: Configure Jenkins Credentials

#### Add Docker Hub Credentials

1. **Manage Jenkins** → **Credentials** → **(global)**
2. Click **Add Credentials**
3. **Kind:** Username with password
4. **ID:** `docker-hub-credentials`
5. **Username:** Your Docker Hub username
6. **Password:** Your Docker Hub password or access token
7. **Description:** Docker Hub Credentials
8. Click **OK**

#### Add SonarQube Server

1. **Manage Jenkins** → **Configure System**
2. Scroll to **SonarQube servers**
3. Click **Add SonarQube**
4. **Name:** `SonarQube`
5. **Server URL:** Your SonarQube URL (e.g., `https://sonarcloud.io`)
6. **Server authentication token:** Your SonarQube token
7. Click **Save**

---

## 🐳 Docker Hub Configuration

### Step 1: Create Docker Hub Account

1. Go to: https://hub.docker.com/
2. Click **Sign Up**
3. Create free account
4. Verify email

### Step 2: Create Repository

1. Go to Docker Hub → **Repositories** → **Create Repository**
2. **Name:** `ecommerce-app`
3. **Visibility:** Public (FREE) or Private (1 free)
4. Click **Create**

### Step 3: Update Jenkinsfile

Edit `Jenkinsfile` and update:
```groovy
DOCKER_HUB_REPO = 'your-dockerhub-username/ecommerce-app'
```

Replace `your-dockerhub-username` with your actual Docker Hub username.

### Step 4: Create Access Token (Recommended)

1. Docker Hub → **Account Settings** → **Security**
2. Click **New Access Token**
3. **Description:** Jenkins CI/CD
4. **Permissions:** Read & Write
5. Click **Generate**
6. **Copy the token** (you won't see it again)
7. Use this token as password in Jenkins credentials

---

## 🔍 SonarQube Setup

### Quick Access Guide

**If using SonarCloud (Recommended):**
- **URL:** https://sonarcloud.io/
- **Login:** Use GitHub/Google account
- **Access:** Just sign up and you're in!

**If using Self-Hosted:**
```bash
# Start SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community

# Access after 1-2 minutes
# URL: http://localhost:9000
# Login: admin / admin (change on first login)
```

### Detailed Setup

#### Option A: SonarCloud (Recommended - FREE)

1. **Go to:** https://sonarcloud.io/
2. **Sign up** with GitHub/Google account
3. **Create new project:**
   - Click **+** → **Create Project** → **Manually**
   - Project key: `ecommerce-app`
   - Display name: `E-Commerce App`
   - Click **Set Up**
4. **Get project token:**
   - Go to your project
   - **Project Settings** → **Analysis Method** → **Token**
   - Click **Generate Token**
   - Copy the token
5. **Add to Jenkins:**
   - **Server URL:** `https://sonarcloud.io`
   - **Token:** Your project token

#### Option B: Self-Hosted SonarQube (Mac)

```bash
# Install and run via Docker
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community

# Wait 1-2 minutes for startup, then access:
# http://localhost:9000
# Default login: admin / admin
# (You'll be prompted to change password)
```

**Get token from self-hosted SonarQube:**
1. Log in at http://localhost:9000
2. Click profile icon (top right) → **My Account**
3. Go to **Security** tab
4. Enter token name: `jenkins-token`
5. Click **Generate**
6. Copy the token

**Configure in Jenkins:**
- **Server URL:** `http://localhost:9000`
- **Token:** The token you just generated

---

## 🚀 Running the Pipeline

### Step 1: Create Jenkins Pipeline Job

1. **Jenkins Dashboard** → **New Item**
2. **Item name:** `ecommerce-app-pipeline`
3. Select **Pipeline**
4. Click **OK**

### Step 2: Configure Pipeline

1. **General:**
   - Description: E-Commerce CI/CD Pipeline

2. **Build Triggers:**
   - Check **Poll SCM** with schedule: `H/5 * * * *` (every 5 minutes)
   - Or set up webhook for automatic builds

3. **Pipeline Definition:**
   - **Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** Your Git repository URL
   - **Credentials:** Add if repository is private
   - **Branches to build:** `*/main` or `*/develop`
   - **Script Path:** `Jenkinsfile`
   - Click **Save**

### Step 3: Run Pipeline

1. Go to your pipeline job
2. Click **Build Now**
3. View progress in **Console Output**

### Pipeline Stages

The pipeline will execute:
1. ✅ **Git Checkout** - Checks out code
2. ✅ **Install Dependencies** - Runs `npm ci`
3. ✅ **Code Quality - Linter** - Runs ESLint
4. ✅ **SonarQube Analysis** - Scans code quality
5. ✅ **SonarQube Quality Gate** - Waits for quality results
6. ✅ **Docker Build** - Builds Docker image
7. ✅ **Docker Login** - Logs into Docker Hub
8. ✅ **Docker Push** - Pushes image to Docker Hub

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# For Jenkins port 8080
lsof -ti:8080
kill -9 $(lsof -ti:8080)
```

### Docker Permission Denied

```bash
# Add user to docker group (if needed)
sudo dseditgroup -o edit -a $(whoami) -t user docker

# Restart Docker Desktop
```

### Jenkins Not Starting

```bash
# Check Jenkins status
brew services list

# Restart Jenkins
brew services restart jenkins-lts

# Check logs
tail -f ~/.jenkins/logs/jenkins.log
```

### SonarQube Scanner Not Found

```bash
# Check if installed
which sonar-scanner

# If using Homebrew
brew install sonar-scanner

# Verify path in Jenkins Global Tool Configuration
```

### Docker Build Fails

```bash
# Check Docker is running
docker ps

# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t ecommerce-app .
```

### Pipeline Fails at Docker Push

- Verify Docker Hub credentials in Jenkins
- Check repository name matches in Jenkinsfile
- Ensure Docker Hub repository exists
- Verify access token has correct permissions

### SonarQube Scan Fails

- Verify SonarQube server URL in Jenkins
- Check SonarQube Scanner tool path
- Verify SonarQube token is correct
- Check project key in `sonar-project.properties`

---

## 📁 Project Structure

```
devops-project/
├── server/
│   └── index.js              # Backend API server
├── public/
│   └── index.html            # Frontend application
├── package.json              # Node.js dependencies
├── Dockerfile                # Docker image definition
├── Jenkinsfile               # CI/CD pipeline configuration
├── .gitignore                # Git ignore rules
├── .dockerignore             # Docker ignore rules
├── .eslintrc.json           # ESLint configuration
├── sonar-project.properties # SonarQube configuration
└── README.md                # This file
```

---

## ✅ Quick Start Checklist

### Local Development
- [ ] Node.js 18+ installed
- [ ] Docker Desktop installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] Application runs locally (`npm start`)
- [ ] Can access http://localhost:3000

### Docker
- [ ] Docker image builds successfully
- [ ] Container runs and accessible
- [ ] Can test application in container

### Jenkins
- [ ] Jenkins installed and running
- [ ] Required plugins installed
- [ ] SonarQube Scanner configured
- [ ] Docker Hub credentials added
- [ ] Pipeline job created

### Docker Hub
- [ ] Docker Hub account created
- [ ] Repository created
- [ ] Access token generated
- [ ] Jenkinsfile updated with repository name

### SonarQube
- [ ] SonarQube/SonarCloud account set up
- [ ] Project created
- [ ] Token generated
- [ ] Configured in Jenkins

### Pipeline
- [ ] Pipeline job configured
- [ ] Git repository connected
- [ ] Pipeline runs successfully
- [ ] Images pushed to Docker Hub

---

## 🎯 Common Commands

```bash
# Start application
npm start

# Build Docker image
docker build -t ecommerce-app .

# Run Docker container
docker run -p 3000:3000 ecommerce-app

# Start Jenkins
brew services start jenkins-lts

# Stop Jenkins
brew services stop jenkins-lts

# Check Jenkins status
brew services list | grep jenkins

# Run linter
npm run lint

# Test API
curl http://localhost:3000/api/products
```

---

## 📚 Additional Resources

- **Jenkins Documentation:** https://www.jenkins.io/doc/
- **Docker Documentation:** https://docs.docker.com/
- **SonarQube Documentation:** https://docs.sonarqube.org/
- **Docker Hub:** https://hub.docker.com/
- **SonarCloud:** https://sonarcloud.io/

---

## 💡 Tips

1. **Always test locally first** before running in CI/CD
2. **Use Docker Hub access tokens** instead of passwords for security
3. **Monitor Jenkins logs** for detailed error messages
4. **Keep Jenkins and plugins updated**
5. **Use SonarCloud** for easier setup (no self-hosting needed)
6. **Clean Docker images regularly** to save space

---

**Happy Coding! 🚀**
