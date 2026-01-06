# 📚 Lesson Management API - Postman Testing Guide

## 🎯 **Complete API Endpoints for Lesson Management with Auto Audio Generation**

Your lesson system now automatically generates German audio when lessons are published. Here's how to test all endpoints in Postman.

---

## 🔐 **Authentication Setup**

### **Step 1: Get Auth Token**
```http
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@klartext.com",
  "password": "yourpassword"
}
```

### **Step 2: Add Authorization Header**
For all protected routes, add:
- **Authorization**: `Bearer YOUR_JWT_TOKEN`

---

## 📝 **1. Create New Lesson (Admin Only)**

### **Endpoint:**
```http
POST http://localhost:5000/api/v1/lessons/create-lesson
```

### **Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

### **Form Data (Body → form-data):**
| Key | Type | Value |
|-----|------|--------|
| `title` | Text | `German Basic Greetings` |
| `slug` | Text | `german-basic-greetings` |
| `content` | Text | `Guten Tag! Wie geht es Ihnen heute? Ich hoffe, Sie lernen gern Deutsch. Das ist eine wunderbare Sprache mit vielen interessanten Wörtern und Ausdrücken.` |
| `difficulty` | Text | `A1` |
| `coverImage` | File | `[Select image file]` |
| `isPublished` | Text | `true` |

### **Expected Response:**
```json
{
  "success": true,
  "message": "Lesson created and audio generation started",
  "data": {
    "_id": "675123abc456def789",
    "title": "German Basic Greetings",
    "slug": "german-basic-greetings",
    "content": "Guten Tag! Wie geht es Ihnen heute?...",
    "difficulty": "A1",
    "coverImage": "https://res.cloudinary.com/...",
    "audioUrl": null,
    "audioStatus": "pending",
    "isPublished": true,
    "isDeleted": false,
    "createdAt": "2025-12-04T10:30:00.000Z",
    "updatedAt": "2025-12-04T10:30:00.000Z"
  }
}
```

---

## 📋 **2. Get All Lessons (Student/Admin)**

### **Endpoint:**
```http
GET http://localhost:5000/api/v1/lessons/
```

### **Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Query Parameters (Optional):**
```
?difficulty=A1&limit=10&page=1
```

### **Expected Response:**
```json
{
  "success": true,
  "message": "Lessons fetched successfully",
  "data": [
    {
      "_id": "675123abc456def789",
      "title": "German Basic Greetings",
      "difficulty": "A1",
      "coverImage": "https://res.cloudinary.com/...",
      "audioUrl": "https://lessonaudio.blob.core.windows.net/lessonaudio/azure_tts_1733298765432.mp3?sv=...",
      "audioStatus": "ready",
      "isPublished": true,
      "createdAt": "2025-12-04T10:30:00.000Z"
    },
    {
      "_id": "675123abc456def790",
      "title": "German Numbers",
      "difficulty": "A1", 
      "audioUrl": null,
      "audioStatus": "generating",
      "isPublished": true,
      "createdAt": "2025-12-04T10:35:00.000Z"
    }
  ]
}
```

---

## 🔍 **3. Get Single Lesson by ID (Student/Admin)**

### **Endpoint:**
```http
GET http://localhost:5000/api/v1/lessons/{lessonId}
```

### **Example:**
```http
GET http://localhost:5000/api/v1/lessons/675123abc456def789
```

### **Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Expected Response:**
```json
{
  "success": true,
  "message": "Lesson fetched successfully",
  "data": {
    "_id": "675123abc456def789",
    "title": "German Basic Greetings",
    "slug": "german-basic-greetings",
    "content": "Guten Tag! Wie geht es Ihnen heute? Ich hoffe, Sie lernen gern Deutsch...",
    "difficulty": "A1",
    "coverImage": "https://res.cloudinary.com/...",
    "audioUrl": "https://lessonaudio.blob.core.windows.net/lessonaudio/azure_tts_1733298765432.mp3?sv=...",
    "audioStatus": "ready",
    "isPublished": true,
    "isDeleted": false,
    "createdAt": "2025-12-04T10:30:00.000Z",
    "updatedAt": "2025-12-04T10:32:15.000Z"
  }
}
```

---

## ✏️ **4. Update Lesson (Admin Only)**

### **Endpoint:**
```http
PUT http://localhost:5000/api/v1/lessons/{lessonId}
```

### **Example:**
```http
PUT http://localhost:5000/api/v1/lessons/675123abc456def789
```

### **Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

### **Form Data (Body → form-data):**
| Key | Type | Value |
|-----|------|--------|
| `title` | Text | `Advanced German Greetings` |
| `content` | Text | `Guten Tag! Wie geht es Ihnen heute? Ich hoffe, Sie lernen gern Deutsch. Hier sind einige fortgeschrittene Begrüßungen...` |
| `difficulty` | Text | `A2` |
| `coverImage` | File | `[Select new image file - optional]` |
| `isPublished` | Text | `true` |

### **Expected Response:**
```json
{
  "success": true,
  "message": "Lesson updated successfully",
  "data": {
    "_id": "675123abc456def789",
    "title": "Advanced German Greetings",
    "content": "Guten Tag! Wie geht es Ihnen heute?...",
    "difficulty": "A2",
    "audioUrl": null,
    "audioStatus": "pending",
    "isPublished": true,
    "updatedAt": "2025-12-04T11:00:00.000Z"
  }
}
```

**Note:** If content changes, audio will be regenerated automatically (`audioStatus: "pending"` → `"generating"` → `"ready"`).

---

## 🔄 **5. Regenerate Audio (Admin Only)**

### **Endpoint:**
```http
POST http://localhost:5000/api/v1/lessons/{lessonId}/regenerate-audio
```

### **Example:**
```http
POST http://localhost:5000/api/v1/lessons/675123abc456def789/regenerate-audio
```

### **Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Body:**
```
(No body required)
```

### **Expected Response:**
```json
{
  "success": true,
  "message": "Audio regeneration started",
  "data": {
    "message": "Audio regeneration started"
  }
}
```

---

## 🗑️ **6. Delete Lesson (Admin Only)**

### **Endpoint:**
```http
DELETE http://localhost:5000/api/v1/lessons/{lessonId}
```

### **Example:**
```http
DELETE http://localhost:5000/api/v1/lessons/675123abc456def789
```

### **Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Expected Response:**
```json
{
  "success": true,
  "message": "Lesson deleted successfully",
  "data": {
    "_id": "675123abc456def789",
    "isDeleted": true,
    "updatedAt": "2025-12-04T11:15:00.000Z"
  }
}
```

---

## 🎵 **Audio Status Explanation**

### **Audio Status Values:**
- **`pending`** - Audio generation not started yet
- **`generating`** - Audio is being created (usually 10-30 seconds)
- **`ready`** - Audio is available and `audioUrl` contains the MP3 link
- **`error`** - Audio generation failed (can retry with regenerate endpoint)

### **Audio URL Format:**
```
https://lessonaudio.blob.core.windows.net/lessonaudio/azure_tts_1733298765432.mp3?sv=2023-01-03&sr=b&sig=ABC123...
```

---

## 🧪 **Testing Workflow**

### **Complete Test Sequence:**

1. **Create Lesson** with `isPublished: true`
   - Response shows `audioStatus: "pending"`
   
2. **Get Lesson by ID** (wait 30 seconds)
   - Response shows `audioStatus: "ready"` and `audioUrl`
   
3. **Play Audio** - Copy `audioUrl` and paste in browser
   - Should play German MP3 audio
   
4. **Update Lesson** content
   - Response shows `audioStatus: "pending"` (regenerating)
   
5. **Force Regenerate** (if needed)
   - Use regenerate-audio endpoint

### **Error Testing:**
- Try creating lesson without auth token (should fail)
- Try accessing with STUDENT role on admin endpoints (should fail)
- Try invalid lesson ID (should return 404)

---

## 🎯 **Sample Data for Testing**

### **German Lesson Content Examples:**

#### **A1 Level:**
```
Guten Tag! Mein Name ist Anna. Wie heißen Sie? Ich komme aus Deutschland. Wo kommen Sie her? Sprechen Sie Deutsch?
```

#### **A2 Level:**
```
Entschuldigung, können Sie mir helfen? Wo ist der Bahnhof? Ich suche ein gutes Restaurant. Können Sie mir das Restaurant empfehlen? Wie viel kostet das?
```

#### **B1 Level:**
```
Deutschland ist ein wunderschönes Land mit einer reichen Geschichte und Kultur. Die deutsche Sprache hat viele interessante Aspekte und regionale Dialekte, die das Lernen sowohl herausfordernd als auch faszinierend machen.
```

---

## 🔍 **Postman Collection**

### **Import Ready Collection:**
```json
{
  "info": {
    "name": "KlarText Lesson Management",
    "description": "Complete API for lesson management with auto audio generation"
  },
  "variable": [
    {
      "key": "baseUrl", 
      "value": "http://localhost:5000/api/v1"
    },
    {
      "key": "authToken",
      "value": "YOUR_JWT_TOKEN_HERE"
    }
  ]
}
```

**Save this as environment variables in Postman for easier testing!**

---

## 🎉 **Success Indicators**

✅ **Lesson Created**: `audioStatus: "pending"`  
✅ **Audio Ready**: `audioStatus: "ready"` + `audioUrl` present  
✅ **Audio Playable**: MP3 file plays German speech  
✅ **Auto Regeneration**: Content changes trigger new audio  
✅ **Manual Regeneration**: Admin can force audio recreation

Your lesson management system with automatic German audio generation is ready for production! 🎤📚