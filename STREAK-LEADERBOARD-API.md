# Backend API Updates

## Password Management

### Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/change-password` | Student/Admin | Change password (manual users) |
| `POST` | `/api/auth/set-password` | Student/Admin | Set first password (Google users) |

### POST `/api/auth/change-password`
For users who signed up with email/password.
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456",
  "confirmPassword": "newpass456"
}
```

### POST `/api/auth/set-password`
For Google OAuth users setting password for the first time.
```json
{
  "newPassword": "mypassword123",
  "confirmPassword": "mypassword123"
}
```

### Response
```json
{
  "success": true,
  "message": "Password changed successfully!",
  "data": null
}
```

### Frontend Flow
1. **Login response** includes `needsPasswordChange: true/false`
2. If `needsPasswordChange: true` (Google user) → Prompt to set password
3. Settings page → Show "Change Password" for all users

---

## Vocabulary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `DELETE` | `/api/vocab/:vocabId` | Student | Delete a saved word |

---

## Streak & Leaderboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/streak/record` | Student | Manually record daily activity |
| `GET` | `/api/streak/my-streak` | Student | Get user's streak stats |
| `GET` | `/api/streak/leaderboard?limit=10` | Student | Current streak leaderboard |
| `GET` | `/api/streak/leaderboard/all-time?limit=10` | Student | All-time best streaks |

---

## Response Examples

### GET `/api/streak/my-streak`
```json
{
  "success": true,
  "message": "Streak stats fetched successfully",
  "data": {
    "currentStreak": 5,
    "longestStreak": 12,
    "lastActivityDate": "2026-01-15T00:00:00.000Z",
    "totalActiveDays": 45,
    "isActiveToday": true
  }
}
```

### GET `/api/streak/leaderboard`
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "user": { "_id": "...", "name": "John", "profileImage": "..." },
      "currentStreak": 30,
      "longestStreak": 30,
      "totalActiveDays": 60
    }
  ]
}
```

---

## Auto-Streak Triggers
Streak is **automatically recorded** when user:
- Completes a lesson
- Saves a vocabulary word

No frontend action needed for these — streak updates in background.

---

## Notes
- Streak resets if user misses a day
- Leaderboard only shows users with active streaks (active today/yesterday)
- `isActiveToday` helps show fire 🔥 icon in UI
