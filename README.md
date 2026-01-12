# Image Cluster AI – Web Client

Web-based client for uploading images and visualizing AI-generated clusters and descriptions.

> **Proof of Concept (PoC)**  
> This web application is part of an experimental system designed to demonstrate how an AI-powered backend can be consumed from a modern frontend.  
> It focuses on clarity, simplicity, and architectural separation rather than production readiness.

---

## 1. What is this Web Client?

This project is a **single-page web application (SPA)** that allows users to:

1. Upload multiple images from the browser
2. Send them to the Image Cluster AI API
3. Visualize the resulting clusters
4. Display AI-generated descriptions per cluster

It acts as the **user-facing interface** of the Image Cluster AI system, enabling interactive experimentation with the AI pipeline.


---

## 2. Scope and goals

**In scope**
- Image upload from browser
- Client-side image resizing and validation
- Integration with the AI backend via HTTP
- Visualization of clusters and descriptions
- Simple and minimal UI for experimentation

**Out of scope (by design)**
- Authentication / user management
- Advanced UI/UX design
- State persistence
- Error recovery strategies
- Production-grade optimizations

---

## 3. System context

This web client does **not** perform any AI processing by itself.  
All AI and ML logic lives in the backend API.

```text
Browser (Angular)
     │
     ▼
HTTP Requests
     │
     ▼
Image Cluster AI API
     │
     ├── Embedding Extraction (AI)
     ├── Clustering (ML)
     └── Caption Generation (AI)

```
The web client is responsible only for:

- Collecting input

- Sending requests

- Rendering results

---

## 4. Architecture overview

The application is built using Angular (standalone components) and follows a simple separation of concerns:

- UI logic (components)

- API integration (fetch / HTTP calls)

- Environment-based configuration at build time
  
```text
UI Components
     │
     ▼
Image Upload & Preview
     │
     ▼
API Client (HTTP)
     │
     ▼
Cluster Visualization
```
---

## 5. Project structure

```text
image-cluster-ai-web/
├── src/
│   ├── app/
│   │   └── app.component.ts   # Main UI logic
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── assets/
│   ├── index.html
│   └── main.ts
├── Dockerfile
├── angular.json
├── package.json
└── README.md
```
---


## 6. API integration

The web client communicates with the API using the endpoint:

```text
POST /cluster-images
```

#### Request

- multipart/form-data

- Multiple image files

#### Response (simplified)

```json
{
  "clusters": [
    {
      "name": 0,
      "image_ids": ["img1.jpg", "img2.jpg"],
      "description": "black leather shoes"
    }
  ]
}
```
The frontend maps image_ids back to locally uploaded images and displays them grouped by cluster.

---

## 7. Running the Web Client (Full Deploy with Docker Compose)

The recommended way to run the web client is as part of the full system deployment.

#### Using Git (recommended)

1. Clone the deploy project:

```bash
git clone https://github.com/rafael-dev-com/image-cluster-ai-deploy
cd image-cluster-ai-deploy
```

2. Inside the deploy folder, clone the sub-repositories:
```bash
git clone https://github.com/rafael-dev-com/image-cluster-ai-api
git clone https://github.com/rafael-dev-com/image-cluster-ai-web
```
3. Start the services with Docker Compose:
```bash
docker-compose up --build
```
- This will build and start all services.

- The web client will run at http://localhost:8082.

- A folder with test images is included in the deploy structure for easy testing.

#### To stop all services:
```bash
docker-compose down
```
---

### Alternative: Manual download

If you prefer not to use git, you can also download the repositories manually:

- Place repo-api and repo-web inside the deploy folder.

- Make sure the folder structure matches:
```bash
image-cluster-ai-deploy/
├── image-cluster-ai-api/
├── image-cluster-ai-web/
└── docker-compose.yml
```
- Then, from inside the `image-cluster-ai-deploy` folder, run:
:
```bash
docker-compose up --build
```

The web client will run at http://localhost:8082.

This method works the same way; git just makes it more convenient.

---

## 8. Run only the Web Client (Docker)

If you want to run only the web client, you can do so independently.

1. Clone the image-cluster-ai-api project:

```bash
git clone https://github.com/rafael-dev-com/image-cluster-ai-web
cd image-cluster-ai-web
```

1. Build the API Docker image:
```bash
docker build --build-arg API_URL=http://localhost:8001 -t image-cluster-ai-web .
```
2. Run the container:
```bash
docker run -p 8082:80 --name image-cluster-ai-web image-cluster-ai-web
```
The API will be available at: http://localhost:8082

---
## 10. Related repositories

This API is part of a larger system:

- [Backend API - image-cluster-ai-api](https://github.com/rafael-dev-com/image-cluster-ai-api)

- [Full deployment (API + Web + samples) - image-cluster-ai-deploy](https://github.com/rafael-dev-com/image-cluster-ai-deploy):

## 11. Future improvements

- Improved UI/UX

- Progress feedback for large uploads

- Better error handling

- Pagination and large cluster handling

- Runtime configuration support

- Production-ready build optimizations