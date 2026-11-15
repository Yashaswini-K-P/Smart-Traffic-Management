# TrafficIQ – Smart Traffic Management System

A machine learning-based traffic prediction and historical traffic analytics web application.

TrafficIQ uses historical traffic data and a trained Random Forest model to predict traffic volume based on date, time, and weather conditions. It also provides historical traffic analysis through interactive charts and a dashboard.

---

## 1. Project Overview

TrafficIQ provides four main modules:

1. **Overview Dashboard**
   - Displays overall traffic statistics.
   - Shows average, maximum, and minimum traffic volume.
   - Provides a summary of historical traffic patterns.

2. **Traffic Prediction**
   - Predicts traffic volume based on user-provided date, time, and weather conditions.
   - Classifies predicted traffic into Low, Moderate, or Heavy congestion.

3. **Historical Analytics**
   - Displays average traffic by hour.
   - Displays traffic patterns by day of the week.
   - Displays monthly traffic patterns.
   - Shows the distribution of Low, Moderate, and Heavy congestion.

4. **Model Performance**
   - Compares Decision Tree and Random Forest models.
   - Displays evaluation metrics such as MAE, RMSE, and R².
   - Uses the Random Forest model for traffic prediction.

### Important: Understanding the Data

This project uses a historical dataset. It does not fetch live traffic information from Google Maps or traffic sensors.

The model makes predictions using the date, time, and weather details entered by the user. Historical analytics are calculated from the dataset included in the project.

---

## 2. Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Python, FastAPI |
| Machine Learning | Scikit-learn |
| Data Processing | Pandas, NumPy |
| Model Serialization | Joblib |
| Dataset | Metro Interstate Traffic Volume |
| Containerization | Docker, Docker Compose |

---

## 3. Project Structure

The project follows a modular structure:

```text
Smart-Traffic-Management/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .dockerignore
│   │
│   ├── models/
│   │   └── random_forest_model.pkl
│   │
│   └── services/
│       ├── predictor.py
│       └── analytics.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── .dockerignore
│
├── dataset/
│   └── Metro_Interstate_Traffic_Volume.csv
│
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

**Note:** The trained model file is not stored in GitHub because it is approximately 467 MB. It is downloaded automatically when the backend starts if it is not already available.

---

# 4. Prerequisites

There are two ways to run this project:

- **Method 1: Using Docker** – Recommended. No need to install Python packages or Node.js dependencies manually.
- **Method 2: Without Docker** – Install Python and Node.js and run the backend and frontend separately.

Choose either method. You do not need to follow both.

---

# METHOD 1: RUNNING THE PROJECT USING DOCKER

## 5. Prerequisites for Docker

Install the following:

### Docker Desktop

Download Docker Desktop:

https://www.docker.com/products/docker-desktop/

Steps:

1. Download Docker Desktop for your operating system.
2. Install it.
3. Restart your computer if requested.
4. Open Docker Desktop.
5. Wait until Docker Engine is running.

Verify the installation by opening a terminal:

```bash
docker --version
```

```bash
docker compose version
```

If both commands display version information, Docker is installed correctly.

**You do not need to install Python, pip, Node.js, npm, FastAPI, or any Python libraries separately when using Docker.** These dependencies are installed inside the containers.

## 6. Clone the Repository

Open PowerShell, Command Prompt, or a terminal.

```bash
git clone https://github.com/Yashaswini-K-P/Smart-Traffic-Management.git
```

Move into the project directory:

```bash
cd Smart-Traffic-Management
```

Make sure the directory contains:

- `backend`
- `frontend`
- `dataset`
- `docker-compose.yml`

## 7. Build and Start the Project

Run this command from the root project directory:

```bash
docker compose up --build
```

What happens automatically?

1. Docker builds the backend image.
2. Installs the Python dependencies using `backend/requirements.txt`.
3. Copies the backend source code and historical dataset.
4. Builds the frontend image.
5. Installs the frontend dependencies using `npm ci`.
6. Starts the FastAPI backend.
7. Downloads the trained Random Forest model if it is missing.
8. Starts the React frontend.

**First-time startup may take longer** because Docker needs to download dependencies and the approximately 467 MB machine learning model.

Wait until both services have started.

## 8. Access the Application

Once Docker has started successfully, open:

| Service | URL |
|---|---|
| TrafficIQ Website | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |
| Historical Analytics API | http://localhost:8000/analytics |
| Backend Health Check | http://localhost:8000/health |

The frontend runs on port `5173`, and the backend runs on port `8000`.

## 9. Docker Commands

Run these commands from the project root directory.

### Start the containers

```bash
docker compose up
```

### Build and start after code or dependency changes

```bash
docker compose up --build
```

### Run in the background

```bash
docker compose up -d
```

### Check running containers

```bash
docker compose ps
```

### View logs

```bash
docker compose logs
```

View backend logs:

```bash
docker compose logs backend
```

View frontend logs:

```bash
docker compose logs frontend
```

### Stop the containers

```bash
docker compose down
```

### Restart the containers

```bash
docker compose restart
```

### Rebuild only the backend

```bash
docker compose build --no-cache backend
```

### Rebuild only the frontend

```bash
docker compose build --no-cache frontend
```

### Important: Do Not Delete the Docker Volume Unnecessarily

The downloaded machine learning model is stored in a Docker named volume called `traffic_model`.

Running:

```bash
docker compose down
```

stops and removes the containers but preserves the model volume.

Avoid running:

```bash
docker compose down -v
```

unless you intentionally want to delete the stored model volume. Deleting it means the model may need to be downloaded again.

---

# METHOD 2: RUNNING WITHOUT DOCKER

Use this method if you do not want to install Docker Desktop.

The backend and frontend must be started separately in two terminals.

## 10. Prerequisites

Install the following software.

### A. Python

**Recommended version: Python 3.12.10 (64-bit)**

Download:

https://www.python.org/downloads/

During installation on Windows, enable:

`Add Python to PATH`

Verify the installation:

```bash
python --version
```

If multiple Python versions are installed, check:

```bash
py -0p
```

If Python 3.12 is installed, you can use it explicitly with:

```bash
py -3.12 --version
```

You do not have to uninstall other Python versions. We recommend using Python 3.12 for this project to maintain compatibility with the trained model and dependencies.

### B. Node.js

**Recommended version: Node.js 22 LTS**

Download:

https://nodejs.org/

Node.js includes npm.

Verify the installation:

```bash
node --version
```

```bash
npm --version
```

### C. Git

Download:

https://git-scm.com/downloads

Verify:

```bash
git --version
```

---

## 11. Clone the Repository

```bash
git clone https://github.com/Yashaswini-K-P/Smart-Traffic-Management.git
```

Navigate to the project:

```bash
cd Smart-Traffic-Management
```

---

## 12. Backend Setup

### Step 1: Navigate to the project root

Make sure you are inside the `Smart-Traffic-Management` directory.

### Step 2: Create a Python virtual environment

On Windows:

```bash
py -3.12 -m venv backend/venv
```

If the `py` launcher is unavailable, use the Python 3.12 executable:

```bash
python -m venv backend/venv
```

The virtual environment keeps project dependencies separate from other Python projects on your computer.

### Step 3: Activate the virtual environment

Windows PowerShell:

```powershell
.\backend\venv\Scripts\Activate.ps1
```

Windows Command Prompt:

```cmd
backend\venv\Scripts\activate.bat
```

macOS/Linux:

```bash
source backend/venv/bin/activate
```

After activation, you should see `(venv)` in your terminal.

**If PowerShell blocks script execution**, run this command in that terminal:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then activate the environment again.

### Step 4: Install backend dependencies

```bash
python -m pip install --upgrade pip
```

Install the exact dependencies:

```bash
python -m pip install -r backend/requirements.txt
```

Do not manually install newer versions of NumPy, Pandas, or Scikit-learn after this step. The versions are pinned for compatibility with the trained model.

### Step 5: Start the backend

From the project root, run:

```bash
cd backend
```

Start FastAPI:

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend should now be available at:

http://localhost:8000

Keep this terminal open.

### Step 6: Model Download

The trained model is not included in GitHub because of its large file size.

The backend automatically checks whether the model exists.

If it does not exist, the application downloads it from Google Drive.

Model download link:

https://drive.google.com/file/d/1TjV8PypIt-L01YiM22SFws5TeFXwDcSF/view?usp=sharing

The backend uses `gdown` to download the model automatically.

The model is saved inside:

```text
backend/models/random_forest_model.pkl
```

**Important:**

- Make sure your internet connection is working during the first startup.
- Make sure the Google Drive file is accessible.
- Do not rename the model file.
- Do not manually download or copy the model if the automatic download has already succeeded.
- Once downloaded, the model can be reused on subsequent startups.

---

## 13. Frontend Setup

Open a **second terminal**.

Navigate to the project directory:

```bash
cd Smart-Traffic-Management
```

Then move into the frontend:

```bash
cd frontend
```

### Step 1: Install frontend dependencies

Run:

```bash
npm ci
```

This installs dependencies using the versions recorded in `package-lock.json`.

Prefer `npm ci` over `npm install` for a consistent setup across team members.

### Step 2: Start the frontend

```bash
npm run dev
```

Vite should display a local URL.

Open:

http://localhost:5173

The TrafficIQ application should now be available.

**Important:** Keep both terminals running:

- Terminal 1: Backend
- Terminal 2: Frontend

If either process is stopped, the corresponding part of the application will not work.

---

# 14. Version Compatibility

Different team members may have different Python and Node.js versions installed.

To avoid compatibility problems, use the recommended versions below.

| Software | Recommended version |
|---|---|
| Python | 3.12.10 (64-bit) |
| Node.js | 22 LTS |
| npm | Version bundled with Node.js 22 |
| NumPy | 2.4.6 |
| Pandas | 2.2.3 |
| Scikit-learn | 1.6.1 |
| Joblib | 1.6.0 |
| FastAPI | 0.163.0 |
| Uvicorn | 0.54.0 |

The backend dependencies are pinned in:

```text
backend/requirements.txt
```

The frontend dependencies are controlled by:

```text
frontend/package.json
frontend/package-lock.json
```

### Why are exact versions important?

The Random Forest model was trained and saved using Scikit-learn 1.6.1.

If someone installs a different Scikit-learn version, they may encounter warnings or errors while loading the model.

Similarly, installing arbitrary versions of NumPy and Pandas may introduce compatibility issues.

Therefore:

1. Use Python 3.12.
2. Create a fresh virtual environment.
3. Install dependencies using `requirements.txt`.
4. Do not upgrade individual packages unnecessarily.
5. Use `npm ci` for frontend dependencies.

### Checking installed Python package versions

After activating the virtual environment, run:

```bash
python -c "import sklearn, numpy, pandas, joblib; print('Scikit-learn:', sklearn.__version__); print('NumPy:', numpy.__version__); print('Pandas:', pandas.__version__); print('Joblib:', joblib.__version__)"
```

Expected output:

```text
Scikit-learn: 1.6.1
NumPy: 2.4.6
Pandas: 2.2.3
Joblib: 1.6.0
```

---

# 15. API Endpoints

The backend provides the following endpoints.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Checks whether the API is running |
| GET | `/health` | Backend health check |
| POST | `/predict` | Predicts traffic volume |
| GET | `/analytics` | Returns historical traffic analytics |

### Prediction API

Endpoint:

```text
POST http://localhost:8000/predict
```

Example request:

```json
{
  "date": "2026-11-16",
  "hour": 8,
  "temp_c": 25,
  "rain_1h": 0,
  "snow_1h": 0,
  "clouds_all": 40
}
```

Example response:

```json
{
  "predicted_traffic": 5676,
  "congestion_level": "Heavy"
}
```

The prediction values depend on the input parameters.

### Historical Analytics API

Endpoint:

```text
GET http://localhost:8000/analytics
```

It returns:

- Overall traffic summary
- Hourly traffic averages
- Weekday traffic averages
- Monthly traffic averages
- Congestion distribution

### Interactive API Documentation

FastAPI provides interactive API documentation.

Open:

http://localhost:8000/docs

You can test the endpoints directly from the browser.

---

# 16. Troubleshooting Guide

This section covers common problems team members may encounter.

## Problem 1: Python version mismatch

**Error:** Different Python versions or incompatible package installations.

**Solution:**

Check installed versions:

```bash
py -0p
```

Create the virtual environment explicitly with Python 3.12:

```bash
py -3.12 -m venv backend/venv
```

Activate it and reinstall the dependencies:

```bash
python -m pip install -r backend/requirements.txt
```

Do not reuse an old virtual environment created with another Python version.

## Problem 2: Model loading error

**Possible cause:** Scikit-learn version mismatch.

**Solution:**

Check the installed version:

```bash
python -c "import sklearn; print(sklearn.__version__)"
```

It should display:

```text
1.6.1
```

If it does not, activate the correct virtual environment and reinstall the pinned requirements.

If the model file is corrupted, stop the backend, remove the local file:

```text
backend/models/random_forest_model.pkl
```

Then restart the backend so it can download the model again.

## Problem 3: Model download fails

**Possible causes:**

- No internet connection.
- Google Drive file is inaccessible.
- Download quota or access restrictions.
- Temporary network issue.

**Solution:**

1. Check your internet connection.
2. Open the Google Drive model link in a browser.
3. Confirm that the file can be accessed.
4. Restart the backend.
5. If necessary, download the file manually and place it at:

```text
backend/models/random_forest_model.pkl
```

Make sure the filename is exactly the same.

## Problem 4: Frontend cannot connect to backend

**Symptoms:**

- Dashboard keeps loading.
- Prediction does not return a result.
- Historical charts are not displayed.

**Solution:**

First, check whether the backend is running:

http://localhost:8000/health

Then check:

http://localhost:8000/analytics

If these endpoints work, check the frontend API configuration in:

```text
frontend/src/services/api.js
```

The local API URL should be:

```javascript
const API_URL = "http://localhost:8000";
```

If you changed this value, restart or refresh the frontend.

## Problem 5: Port already in use

**Error:** Address already in use or port already allocated.

The project uses:

- Backend: `8000`
- Frontend: `5173`

Close other applications using these ports, or stop old project processes before starting the application again.

On Windows, identify processes using port 8000:

```cmd
netstat -ano | findstr :8000
```

Identify processes using port 5173:

```cmd
netstat -ano | findstr :5173
```

Stop the relevant process only if you have confirmed it belongs to an old project process:

```cmd
taskkill /PID <PROCESS_ID> /F
```

Replace `<PROCESS_ID>` with the actual PID.

## Problem 6: npm install or npm ci fails

**Solution:**

Check Node.js:

```bash
node --version
```

Use Node.js 22 LTS.

If the dependency installation is corrupted, remove the frontend `node_modules` directory and run:

```bash
npm ci
```

Do not delete `package-lock.json` just to resolve installation errors.

## Problem 7: Docker containers are not starting

Check Docker Desktop and confirm Docker Engine is running.

Then execute:

```bash
docker compose ps
```

Check the logs:

```bash
docker compose logs backend
```

```bash
docker compose logs frontend
```

If necessary, rebuild:

```bash
docker compose down
docker compose up --build
```

Remember that `docker compose down` preserves the model volume.

## Problem 8: Docker prediction fails after rebuilding

Check the backend package versions inside the container:

```bash
docker compose exec backend python -c "import sklearn, numpy, pandas; print(sklearn.__version__, numpy.__version__, pandas.__version__)"
```

Expected:

```text
1.6.1 2.4.6 2.2.3
```

If the versions are incorrect, rebuild the backend:

```bash
docker compose build --no-cache backend
```

Then start the services:

```bash
docker compose up
```

---

# 17. Common Questions

### Q1. Do I need to install Python when using Docker?

No. Docker installs and runs the required Python environment inside the backend container.

### Q2. Do I need to install Node.js when using Docker?

No. Docker uses the Node.js image to install and run the frontend.

### Q3. Do I need to download the ML model manually?

No. The backend automatically downloads the model if it is missing.

### Q4. Why is the first startup slow?

The first startup downloads dependencies and the large Random Forest model. Later startups should be faster because Docker images and the model volume are reused.

### Q5. Will different Python versions affect the project?

They can. For manual setup, use Python 3.12 and the pinned package versions. With Docker, the Python environment is controlled by the Dockerfile.

### Q6. Can I run the frontend without starting the backend?

The frontend may open, but prediction and historical analytics require the backend to be running.

### Q7. Does the application show live traffic?

No. The project uses historical traffic data and a trained machine learning model. It does not currently connect to live traffic APIs or sensors.

### Q8. Do I need to retrain the model?

No. The trained Random Forest model is already provided through the automatic download mechanism. You do not need to train it every time you run the application.

### Q9. Can I run Docker and manual setup together?

You can, but avoid running both versions simultaneously on the same ports. Otherwise, you may encounter port conflicts.

### Q10. What should I do if I change the source code?

For manual setup, restart the relevant development server if needed. Vite and Uvicorn are configured for development reloads.

For Docker, rebuild the affected service when changes are not reflected:

```bash
docker compose up --build
```

---

# 18. Team Setup Recommendation

For a consistent team experience, we recommend:

| Situation | Recommended method |
|---|---|
| Team member already has Docker | Docker Compose |
| Team member does not have Docker | Manual setup |
| Team member has a different Python version | Use Python 3.12 virtual environment |
| Team member has multiple Python versions | Use `py -3.12` explicitly |
| First-time model setup | Allow automatic model download |
| Frontend dependencies | Use `npm ci` |

**Our recommendation:** If a team member is comfortable installing Docker Desktop, use Docker Compose. It avoids most Python and Node.js version conflicts.

If they do not want Docker, follow the manual setup carefully and use the recommended versions.

---

# 19. Quick Start Summary

### Docker – Recommended

```bash
git clone https://github.com/Yashaswini-K-P/Smart-Traffic-Management.git

cd Smart-Traffic-Management

docker compose up --build
```

Open:

http://localhost:5173

### Without Docker

**Terminal 1 – Backend (Windows):**

```bash
git clone https://github.com/Yashaswini-K-P/Smart-Traffic-Management.git

cd Smart-Traffic-Management

py -3.12 -m venv backend/venv

backend\venv\Scripts\activate

python -m pip install --upgrade pip

python -m pip install -r backend/requirements.txt

cd backend

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 – Frontend:**

```bash
cd Smart-Traffic-Management/frontend

npm ci

npm run dev
```

Open:

http://localhost:5173

---

# 20. Repository

**GitHub:**  
https://github.com/Yashaswini-K-P/Smart-Traffic-Management

For issues related to setup, check the troubleshooting section first and verify that the recommended software versions are being used.

---

**TrafficIQ – Smart Traffic Management System**

*Predicting traffic patterns through historical data and machine learning.*