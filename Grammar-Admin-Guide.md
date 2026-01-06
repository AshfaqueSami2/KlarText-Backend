# 📚 Grammar Admin Panel Guide

> **Complete guide for managing the KlarText Grammar Section**

## Table of Contents
1. [Overview](#overview)
2. [Grammar Structure](#grammar-structure)
3. [Admin Routes Reference](#admin-routes-reference)
4. [Managing Topics](#managing-topics)
5. [Managing Lessons](#managing-lessons)
6. [Managing Exercises](#managing-exercises)
7. [Publishing Workflow](#publishing-workflow)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The Grammar section is organized in a three-tier hierarchy:
- **Topics** → Main grammar categories (e.g., "German Cases")
- **Lessons** → Individual lessons within topics (e.g., "Nominative Case")
- **Exercise Sets** → Practice exercises for each lesson

All admin operations require authentication with **ADMIN** role.

---

## Grammar Structure

### 🎯 Topic → Lesson → Exercise Set Hierarchy

```
📚 Topic: German Cases (Fälle)
  ├── 📖 Lesson 1: Nominative Case (Nominativ)
  │   ├── 📝 Exercise Set 1: Basic Nominative Practice
  │   └── 📝 Exercise Set 2: Advanced Nominative
  │
  ├── 📖 Lesson 2: Accusative Case (Akkusativ)
  │   ├── 📝 Exercise Set 1: Accusative Articles
  │   └── 📝 Exercise Set 2: Accusative in Context
  │
  └── 📖 Lesson 3: Dative Case (Dativ)
      └── ...
```

### Difficulty Levels
All content is categorized by CEFR levels:
- `A1` - Beginner
- `A2` - Elementary
- `B1` - Intermediate
- `B2` - Upper Intermediate
- `C1` - Advanced

---

## Admin Routes Reference

### 📚 Topic Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/grammar/topics` | Get all topics | Optional (Admin sees unpublished with `?showAll=true`) |
| `GET` | `/api/grammar/topics/:topicId` | Get single topic | Optional |
| `POST` | `/api/grammar/topics` | Create topic | ✅ Admin |
| `PUT` | `/api/grammar/topics/:topicId` | Update topic | ✅ Admin |
| `DELETE` | `/api/grammar/topics/:topicId` | Delete topic | ✅ Admin |

### 📖 Lesson Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/grammar/topics/:topicId/lessons` | Get lessons by topic | Optional |
| `GET` | `/api/grammar/lessons/:lessonId` | Get single lesson | Optional |
| `POST` | `/api/grammar/lessons` | Create lesson | ✅ Admin |
| `PUT` | `/api/grammar/lessons/:lessonId` | Update lesson | ✅ Admin |
| `DELETE` | `/api/grammar/lessons/:lessonId` | Delete lesson | ✅ Admin |

### 📝 Exercise Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/grammar/lessons/:lessonId/exercises` | Get exercise sets by lesson | Optional |
| `GET` | `/api/grammar/exercises/:exerciseSetId` | Get single exercise set | Optional |
| `POST` | `/api/grammar/exercises` | Create exercise set | ✅ Admin |
| `PUT` | `/api/grammar/exercises/:exerciseSetId` | Update exercise set | ✅ Admin |
| `DELETE` | `/api/grammar/exercises/:exerciseSetId` | Delete exercise set | ✅ Admin |

---

## Managing Topics

### Create a New Topic

**Endpoint:** `POST /api/grammar/topics`

**Headers:**
```json
{
  "Authorization": "Bearer <admin-token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "title": "German Cases (Fälle)",
  "titleDe": "Die deutschen Fälle",
  "slug": "german-cases",
  "description": "Learn about the four grammatical cases in German: Nominative, Accusative, Dative, and Genitive.",
  "descriptionDe": "Lerne die vier grammatischen Fälle im Deutschen: Nominativ, Akkusativ, Dativ und Genitiv.",
  "icon": "book",
  "difficulty": "A2",
  "order": 1,
  "coverImage": "https://example.com/images/cases-cover.jpg",
  "isPublished": false
}
```

**Required Fields:**
- `title` - English title (min 3 chars)
- `titleDe` - German title (min 3 chars)
- `slug` - URL-friendly identifier (lowercase, hyphens only)
- `description` - English description (min 10 chars)
- `descriptionDe` - German description (min 10 chars)
- `difficulty` - One of: A1, A2, B1, B2, C1

**Optional Fields:**
- `icon` - Icon identifier (default: "book")
- `order` - Display order (default: 0)
- `coverImage` - Cover image URL
- `isPublished` - Publish status (default: false)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Grammar topic created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "German Cases (Fälle)",
    "titleDe": "Die deutschen Fälle",
    "slug": "german-cases",
    "description": "Learn about the four grammatical cases...",
    "descriptionDe": "Lerne die vier grammatischen Fälle...",
    "icon": "book",
    "difficulty": "A2",
    "order": 1,
    "coverImage": "https://example.com/images/cases-cover.jpg",
    "isPublished": false,
    "isDeleted": false,
    "lessonCount": 0,
    "createdAt": "2026-01-04T10:00:00.000Z",
    "updatedAt": "2026-01-04T10:00:00.000Z"
  }
}
```

### Update a Topic

**Endpoint:** `PUT /api/grammar/topics/:topicId`

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "isPublished": true,
  "order": 2
}
```

### Delete a Topic

**Endpoint:** `DELETE /api/grammar/topics/:topicId`

**Note:** This performs a soft delete (sets `isDeleted: true`). Associated lessons and exercises are NOT automatically deleted.

### Get All Topics (Admin View)

**Endpoint:** `GET /api/grammar/topics?showAll=true`

**Query Parameters:**
- `showAll=true` - Admin only: Shows unpublished topics
- `page=1` - Page number (default: 1)
- `limit=20` - Items per page (max: 100)
- `sort=order` - Sort field (default: order)

---

## Managing Lessons

### Create a New Lesson

**Endpoint:** `POST /api/grammar/lessons`

**Request Body:**
```json
{
  "topic": "507f1f77bcf86cd799439011",
  "title": "Nominative Case",
  "titleDe": "Der Nominativ",
  "slug": "nominative-case",
  "difficulty": "A2",
  "order": 1,
  "introduction": "The nominative case is used for the subject of a sentence - the person or thing doing the action.",
  "introductionDe": "Der Nominativ wird für das Subjekt eines Satzes verwendet - die Person oder Sache, die die Handlung ausführt.",
  "explanationBlocks": [
    {
      "type": "text",
      "title": "What is Nominative?",
      "titleDe": "Was ist der Nominativ?",
      "content": "The nominative case identifies the subject of the sentence...",
      "contentDe": "Der Nominativ kennzeichnet das Subjekt des Satzes..."
    },
    {
      "type": "table",
      "title": "Nominative Articles",
      "titleDe": "Nominativ-Artikel",
      "content": "Article declension in nominative case",
      "contentDe": "Artikeldeklination im Nominativ",
      "tableData": {
        "headers": ["Gender", "Definite", "Indefinite"],
        "rows": [
          ["Masculine", "der", "ein"],
          ["Feminine", "die", "eine"],
          ["Neuter", "das", "ein"]
        ]
      }
    },
    {
      "type": "example",
      "title": "Examples",
      "titleDe": "Beispiele",
      "content": "See these nominative examples",
      "contentDe": "Siehe diese Nominativ-Beispiele",
      "examples": [
        {
          "german": "Der Mann liest ein Buch.",
          "english": "The man reads a book.",
          "breakdown": "Der (masculine nominative) Mann (subject) liest (verb) ein (neuter accusative) Buch (object)."
        },
        {
          "german": "Die Frau ist Lehrerin.",
          "english": "The woman is a teacher.",
          "breakdown": "Die (feminine nominative) Frau (subject) ist (verb) Lehrerin (predicate nominative)."
        }
      ]
    },
    {
      "type": "tip",
      "content": "Remember: The nominative case answers 'Who?' or 'What?' is doing the action.",
      "contentDe": "Merke: Der Nominativ antwortet auf die Frage 'Wer?' oder 'Was?' führt die Handlung aus."
    }
  ],
  "keyPoints": [
    {
      "point": "Nominative is used for the subject of a sentence",
      "pointDe": "Nominativ wird für das Subjekt eines Satzes verwendet"
    },
    {
      "point": "Ask 'Wer?' (Who?) to identify the nominative",
      "pointDe": "Frage 'Wer?', um den Nominativ zu identifizieren"
    },
    {
      "point": "Predicate nouns after 'sein', 'werden', 'bleiben' are also nominative",
      "pointDe": "Prädikatsnomen nach 'sein', 'werden', 'bleiben' sind auch im Nominativ"
    }
  ],
  "commonMistakes": [
    {
      "mistake": "Der Lehrer gibt der Student das Buch.",
      "correction": "Der Lehrer gibt dem Studenten das Buch.",
      "explanation": "'Student' is the indirect object (dative), not the subject"
    }
  ],
  "practiceExamples": [
    {
      "german": "Das Kind spielt im Garten.",
      "english": "The child plays in the garden."
    },
    {
      "german": "Ein Hund bellt laut.",
      "english": "A dog barks loudly."
    }
  ],
  "estimatedTime": 15,
  "isPublished": false
}
```

**Explanation Block Types:**
- `text` - Plain text explanation
- `table` - Structured table data
- `example` - Example sentences with translations
- `tip` - Helpful tips
- `warning` - Important warnings
- `comparison` - Comparison between concepts

**Required Fields:**
- `topic` - Topic ID (ObjectId)
- `title`, `titleDe` - Lesson titles
- `slug` - URL-friendly identifier
- `difficulty` - CEFR level
- `introduction`, `introductionDe` - Intro text (min 20 chars)
- `explanationBlocks` - Array (min 1 block)
- `keyPoints` - Array (min 1 point)
- `practiceExamples` - Array (min 1 example)

**Optional Fields:**
- `order` - Display order (default: 0)
- `commonMistakes` - Array of common mistakes
- `estimatedTime` - Minutes to complete (1-120)
- `isPublished` - Publish status (default: false)

### Update a Lesson

**Endpoint:** `PUT /api/grammar/lessons/:lessonId`

All fields are optional. Only provide fields you want to update.

### Delete a Lesson

**Endpoint:** `DELETE /api/grammar/lessons/:lessonId`

Soft delete (sets `isDeleted: true`).

---

## Managing Exercises

### Exercise Types Available

1. **fill-blank** - Fill in the blank
2. **multiple-choice** - Choose correct answer
3. **matching** - Match pairs
4. **word-order** - Arrange words correctly
5. **conjugation** - Conjugate verbs
6. **case-selection** - Choose correct case
7. **article-selection** - Choose correct article
8. **translation** - Translate sentences
9. **error-correction** - Find and correct errors

### Create an Exercise Set

**Endpoint:** `POST /api/grammar/exercises`

**Request Body:**
```json
{
  "lesson": "507f1f77bcf86cd799439011",
  "title": "Nominative Case Practice",
  "titleDe": "Nominativ Übung",
  "description": "Practice identifying and using the nominative case",
  "descriptionDe": "Übe das Erkennen und Verwenden des Nominativs",
  "difficulty": "A2",
  "order": 1,
  "passingScore": 70,
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "Fill in the blank with the correct nominative article",
      "instructionDe": "Fülle die Lücke mit dem richtigen Nominativ-Artikel aus",
      "difficulty": "A2",
      "points": 10,
      "sentence": "___ Mann liest ein Buch.",
      "sentenceTranslation": "The man reads a book.",
      "correctAnswer": "Der",
      "acceptableAnswers": ["der"],
      "hint": "Think about the gender of 'Mann'",
      "hintDe": "Denke an das Geschlecht von 'Mann'",
      "explanation": "'Mann' is masculine, so it takes 'der' in the nominative case.",
      "explanationDe": "'Mann' ist maskulin, also nimmt es 'der' im Nominativ."
    },
    {
      "type": "multiple-choice",
      "instruction": "Choose the correct nominative form",
      "instructionDe": "Wähle die richtige Nominativform",
      "difficulty": "A2",
      "points": 10,
      "question": "Which article is correct? ___ Frau ist Ärztin.",
      "questionTranslation": "Which article is correct? The woman is a doctor.",
      "options": [
        { "text": "Der", "isCorrect": false },
        { "text": "Die", "isCorrect": true },
        { "text": "Das", "isCorrect": false },
        { "text": "Den", "isCorrect": false }
      ],
      "explanation": "'Frau' is feminine and the subject, requiring 'die' in nominative.",
      "explanationDe": "'Frau' ist feminin und das Subjekt, benötigt 'die' im Nominativ."
    },
    {
      "type": "word-order",
      "instruction": "Arrange the words in the correct order",
      "instructionDe": "Ordne die Wörter in der richtigen Reihenfolge",
      "difficulty": "A2",
      "points": 15,
      "words": ["Kind", "Das", "spielt", "Garten", "im"],
      "correctOrder": ["Das", "Kind", "spielt", "im", "Garten"],
      "translation": "The child plays in the garden.",
      "explanation": "German word order: Subject (Das Kind) + Verb (spielt) + Location (im Garten)",
      "explanationDe": "Deutsche Wortstellung: Subjekt (Das Kind) + Verb (spielt) + Ort (im Garten)"
    },
    {
      "type": "matching",
      "instruction": "Match the German subjects with their English translations",
      "instructionDe": "Ordne die deutschen Subjekte ihren englischen Übersetzungen zu",
      "difficulty": "A2",
      "points": 10,
      "pairs": [
        { "left": "Der Lehrer", "right": "The teacher (m)" },
        { "left": "Die Schülerin", "right": "The student (f)" },
        { "left": "Das Mädchen", "right": "The girl" },
        { "left": "Ein Junge", "right": "A boy" }
      ],
      "explanation": "Notice the different articles based on gender",
      "explanationDe": "Beachte die verschiedenen Artikel je nach Geschlecht"
    },
    {
      "type": "case-selection",
      "instruction": "Identify the case of the underlined word",
      "instructionDe": "Identifiziere den Fall des unterstrichenen Wortes",
      "difficulty": "A2",
      "points": 10,
      "sentence": "Der Hund bellt laut.",
      "sentenceTranslation": "The dog barks loudly.",
      "targetWord": "Der Hund",
      "correctCase": "Nominativ",
      "explanation": "'Der Hund' is the subject performing the action, so it's nominative.",
      "explanationDe": "'Der Hund' ist das Subjekt, das die Handlung ausführt, also Nominativ."
    }
  ],
  "isPublished": false
}
```

**Required Fields:**
- `lesson` - Lesson ID
- `title`, `titleDe` - Exercise set titles
- `difficulty` - CEFR level
- `exercises` - Array of exercises (min 1)

**Optional Fields:**
- `description`, `descriptionDe` - Descriptions
- `order` - Display order (default: 0)
- `passingScore` - Percentage to pass (default: 70)
- `timeLimit` - Time limit in minutes
- `isPublished` - Publish status (default: false)

### Exercise-Specific Fields

#### Fill-Blank Exercise
```json
{
  "type": "fill-blank",
  "sentence": "String with ___ for blank",
  "sentenceTranslation": "Translation",
  "correctAnswer": "Correct answer",
  "acceptableAnswers": ["alternative1", "alternative2"]
}
```

#### Multiple-Choice Exercise
```json
{
  "type": "multiple-choice",
  "question": "Question text",
  "questionTranslation": "Translation",
  "options": [
    { "text": "Option 1", "isCorrect": true },
    { "text": "Option 2", "isCorrect": false }
  ]
}
```
*Note: At least one option must be correct, max 6 options*

#### Matching Exercise
```json
{
  "type": "matching",
  "pairs": [
    { "left": "Item 1", "right": "Match 1" },
    { "left": "Item 2", "right": "Match 2" }
  ]
}
```
*Note: Min 3 pairs, max 8 pairs*

#### Word-Order Exercise
```json
{
  "type": "word-order",
  "words": ["word1", "word2", "word3"],
  "correctOrder": ["word2", "word1", "word3"],
  "translation": "English translation"
}
```

#### Conjugation Exercise
```json
{
  "type": "conjugation",
  "verb": "haben",
  "tense": "present",
  "pronoun": "ich",
  "correctAnswer": "habe",
  "verbTranslation": "to have"
}
```

#### Case-Selection Exercise
```json
{
  "type": "case-selection",
  "sentence": "German sentence",
  "sentenceTranslation": "English translation",
  "targetWord": "Word to identify",
  "correctCase": "Nominativ" // or Akkusativ, Dativ, Genitiv
}
```

#### Article-Selection Exercise
```json
{
  "type": "article-selection",
  "sentence": "___ Mann liest ein Buch.",
  "sentenceTranslation": "The man reads a book.",
  "options": ["der", "die", "das", "den"],
  "correctAnswer": "der",
  "noun": "Mann",
  "nounGender": "masculine",
  "caseUsed": "Nominativ"
}
```

### Update an Exercise Set

**Endpoint:** `PUT /api/grammar/exercises/:exerciseSetId`

All fields are optional.

### Delete an Exercise Set

**Endpoint:** `DELETE /api/grammar/exercises/:exerciseSetId`

Soft delete (sets `isDeleted: true`).

---

## Publishing Workflow

### Recommended Publishing Order

1. **Create Topic** (unpublished)
   ```json
   { "isPublished": false }
   ```

2. **Create Lessons** under topic (unpublished)
   ```json
   { "topic": "topicId", "isPublished": false }
   ```

3. **Create Exercise Sets** for each lesson (unpublished)
   ```json
   { "lesson": "lessonId", "isPublished": false }
   ```

4. **Review & Test** content as admin
   - Use `?showAll=true` to view unpublished content
   - Test exercise answers
   - Review explanations and translations

5. **Publish Exercise Sets**
   ```http
   PUT /api/grammar/exercises/:exerciseSetId
   { "isPublished": true }
   ```

6. **Publish Lessons**
   ```http
   PUT /api/grammar/lessons/:lessonId
   { "isPublished": true }
   ```

7. **Publish Topic**
   ```http
   PUT /api/grammar/topics/:topicId
   { "isPublished": true }
   ```

### Admin Preview vs. Student View

| User Role | Published Content | Unpublished Content | Query Parameter |
|-----------|------------------|---------------------|-----------------|
| Student | ✅ Visible | ❌ Hidden | N/A |
| Admin (default) | ✅ Visible | ❌ Hidden | Default behavior |
| Admin (preview) | ✅ Visible | ✅ Visible | `?showAll=true` |

**Example:**
```http
GET /api/grammar/topics?showAll=true
Authorization: Bearer <admin-token>
```

---

## Best Practices

### Content Creation

1. **Start with Outlines**
   - Plan topic structure before creating
   - Define lesson sequence and difficulty progression
   - List exercise types per lesson

2. **Bilingual Content**
   - Always provide both English and German versions
   - Ensure translations are accurate and natural
   - Use simple language for lower levels

3. **Progressive Difficulty**
   - Order topics from easy to hard
   - Order lessons within topics progressively
   - Match exercise difficulty to lesson difficulty

4. **Rich Explanations**
   - Use multiple explanation block types
   - Include tables for structured data
   - Provide plenty of examples
   - Add tips and warnings for common pitfalls

5. **Quality Exercises**
   - Mix exercise types for variety
   - Provide clear instructions in both languages
   - Include hints for challenging exercises
   - Write detailed explanations for answers

### Slug Conventions

- Use lowercase only
- Use hyphens for spaces
- Keep concise and descriptive
- Examples:
  - ✅ `german-cases`
  - ✅ `nominative-case`
  - ❌ `GermanCases`
  - ❌ `the-nominative-case-in-german`

### Ordering

- Start order from 1 or 0
- Use increments of 1, 10, or 100 for flexibility
- Leave gaps for future insertions
- Example sequence: 10, 20, 30... (allows inserting 15, 25 later)

### Cache Management

All admin operations automatically invalidate relevant caches:
- Creating/updating/deleting triggers cache clear
- Students see updated content immediately
- No manual cache management needed

---

## Troubleshooting

### Common Errors

#### 1. Validation Errors

**Error:** `"Title must be at least 3 characters"`
**Solution:** Ensure all required fields meet minimum length requirements

**Error:** `"Slug must be lowercase with hyphens only"`
**Solution:** Use only `a-z`, `0-9`, and `-` in slugs

**Error:** `"At least one explanation block required"`
**Solution:** Include at least one explanation block in lessons

#### 2. Duplicate Slugs

**Error:** `"E11000 duplicate key error: slug"`
**Solution:** Slugs must be unique across all topics/lessons. Change the slug to a unique value.

#### 3. Invalid References

**Error:** `"Grammar topic not found"`
**Solution:** Verify the topic ID exists and is not deleted when creating lessons

**Error:** `"Grammar lesson not found"`
**Solution:** Verify the lesson ID exists and is not deleted when creating exercises

#### 4. Exercise Validation

**Error:** `"At least one option must be correct" (multiple-choice)`
**Solution:** Ensure at least one option has `isCorrect: true`

**Error:** `"Sentence must contain ___ for blank" (fill-blank)`
**Solution:** Include `___` in the sentence field

**Error:** `"Min 3 pairs required" (matching)`
**Solution:** Provide at least 3 pairs for matching exercises

#### 5. Authentication Errors

**Error:** `401 Unauthorized`
**Solution:** Ensure you're authenticated with admin role

**Error:** `403 Forbidden`
**Solution:** Your account must have ADMIN role to access these endpoints

### Getting Support

If you encounter issues:

1. Check the validation requirements in this guide
2. Review the request/response examples
3. Check server logs for detailed error messages
4. Verify your admin authentication token is valid

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "meta": {  // Optional, for paginated responses
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errorMessages": [
    {
      "path": "body.title",
      "message": "Title must be at least 3 characters"
    }
  ]
}
```

---

## Quick Reference: Complete Example

### Creating a Complete Grammar Module

```bash
# 1. Create Topic
POST /api/grammar/topics
{
  "title": "German Verbs",
  "titleDe": "Deutsche Verben",
  "slug": "german-verbs",
  "description": "Master German verb conjugation and usage",
  "descriptionDe": "Meistere deutsche Verbkonjugation und -verwendung",
  "difficulty": "A2",
  "order": 5,
  "isPublished": false
}
# Response: { "_id": "TOPIC_ID", ... }

# 2. Create Lesson
POST /api/grammar/lessons
{
  "topic": "TOPIC_ID",
  "title": "Present Tense",
  "titleDe": "Präsens",
  "slug": "present-tense",
  "difficulty": "A2",
  "order": 1,
  "introduction": "Learn how to conjugate verbs in present tense",
  "introductionDe": "Lerne, wie man Verben im Präsens konjugiert",
  "explanationBlocks": [/* ... */],
  "keyPoints": [/* ... */],
  "practiceExamples": [/* ... */],
  "isPublished": false
}
# Response: { "_id": "LESSON_ID", ... }

# 3. Create Exercise Set
POST /api/grammar/exercises
{
  "lesson": "LESSON_ID",
  "title": "Present Tense Practice",
  "titleDe": "Präsens Übung",
  "difficulty": "A2",
  "exercises": [/* ... */],
  "isPublished": false
}
# Response: { "_id": "EXERCISE_ID", ... }

# 4. Preview as Admin
GET /api/grammar/topics?showAll=true

# 5. Publish Everything
PUT /api/grammar/exercises/EXERCISE_ID
{ "isPublished": true }

PUT /api/grammar/lessons/LESSON_ID
{ "isPublished": true }

PUT /api/grammar/topics/TOPIC_ID
{ "isPublished": true }
```

---

## Appendix: Full Schema Reference

### Topic Schema
```typescript
{
  _id: ObjectId,
  title: string,              // required, min 3
  titleDe: string,            // required, min 3
  slug: string,               // required, unique, lowercase, hyphens
  description: string,        // required, min 10
  descriptionDe: string,      // required, min 10
  icon: string,               // optional, default: "book"
  difficulty: string,         // required: A1|A2|B1|B2|C1
  order: number,              // optional, default: 0
  coverImage: string,         // optional
  isPublished: boolean,       // optional, default: false
  isDeleted: boolean,         // default: false
  lessonCount: number,        // virtual field
  createdAt: Date,
  updatedAt: Date
}
```

### Lesson Schema
```typescript
{
  _id: ObjectId,
  topic: ObjectId,            // required, ref: GrammarTopic
  title: string,              // required, min 3
  titleDe: string,            // required, min 3
  slug: string,               // required, unique, lowercase, hyphens
  difficulty: string,         // required: A1|A2|B1|B2|C1
  order: number,              // optional, default: 0
  introduction: string,       // required, min 20
  introductionDe: string,     // required, min 20
  explanationBlocks: [{       // required, min 1
    type: string,             // required: text|table|example|tip|warning|comparison
    title: string,            // optional
    titleDe: string,          // optional
    content: string,          // required
    contentDe: string,        // required
    tableData: {              // optional, for type=table
      headers: string[],
      rows: string[][]
    },
    examples: [{              // optional, for type=example
      german: string,
      english: string,
      breakdown: string,
      audioUrl: string
    }]
  }],
  keyPoints: [{               // required, min 1
    point: string,            // required, min 5
    pointDe: string           // required, min 5
  }],
  commonMistakes: [{          // optional
    mistake: string,
    correction: string,
    explanation: string
  }],
  practiceExamples: [{        // required, min 1
    german: string,
    english: string,
    audioUrl: string
  }],
  audioUrl: string,           // optional
  audioStatus: string,        // pending|generating|ready|error
  estimatedTime: number,      // optional, 1-120, default: 10
  isPublished: boolean,       // optional, default: false
  isDeleted: boolean,         // default: false
  createdAt: Date,
  updatedAt: Date
}
```

### Exercise Set Schema
```typescript
{
  _id: ObjectId,
  lesson: ObjectId,           // required, ref: GrammarLesson
  title: string,              // required, min 3
  titleDe: string,            // required, min 3
  description: string,        // optional
  descriptionDe: string,      // optional
  difficulty: string,         // required: A1|A2|B1|B2|C1
  order: number,              // optional, default: 0
  passingScore: number,       // optional, default: 70
  timeLimit: number,          // optional, in minutes
  exercises: [{               // required, min 1
    type: string,             // required: fill-blank|multiple-choice|matching|word-order|conjugation|case-selection|article-selection|translation|error-correction
    instruction: string,      // required, min 10
    instructionDe: string,    // required, min 10
    difficulty: string,       // required: A1|A2|B1|B2|C1
    points: number,           // optional, 1-100, default: 10
    hint: string,             // optional
    hintDe: string,           // optional
    explanation: string,      // required, min 10
    explanationDe: string,    // required, min 10
    // Type-specific fields...
  }],
  isPublished: boolean,       // optional, default: false
  isDeleted: boolean,         // default: false
  createdAt: Date,
  updatedAt: Date
}
```

---

**Document Version:** 1.0  
**Last Updated:** January 4, 2026  
**Maintained by:** KlarText Development Team
