# Grammar Section - Frontend Implementation Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Data Models](#data-models)
4. [API Endpoints Reference](#api-endpoints-reference)
5. [Frontend Components Structure](#frontend-components-structure)
6. [Implementation Steps](#implementation-steps)
7. [Exercise Types Implementation](#exercise-types-implementation)
8. [Progress Tracking](#progress-tracking)
9. [State Management](#state-management)
10. [Sample Code Examples](#sample-code-examples)

---

## 📖 Overview

The Grammar Module is a three-tier learning system designed to teach German grammar effectively:

### **System Hierarchy**
```
Grammar Topics (Main Categories)
    └── Grammar Lessons (Detailed Content)
            └── Exercise Sets (Interactive Practice)
                    └── Exercises (Individual Questions)
```

### **Key Features**
- ✅ Bilingual content (English & German)
- ✅ 9 different exercise types
- ✅ Progress tracking with mastery levels
- ✅ Audio support for pronunciations
- ✅ Smart recommendations based on user progress
- ✅ Time tracking and performance analytics

---

## 🏗️ System Architecture

### **Data Flow**
```
User → Frontend → API Endpoint → Controller → Service → Database
                                                    ↓
User ← Frontend ← Response ← Formatted Data ← Model
```

### **Three Main Entities**

#### 1. **Grammar Topics** (Categories)
Main subject areas like "German Cases", "Verb Conjugation", "Sentence Structure"

#### 2. **Grammar Lessons** (Content)
Detailed explanations with:
- Introduction
- Multiple explanation blocks (text, tables, examples, tips)
- Key points for quick review
- Common mistakes
- Practice examples with audio

#### 3. **Grammar Exercise Sets** (Practice)
Collections of exercises with:
- Multiple exercise types
- Scoring and passing criteria
- Time limits (optional)
- Instant feedback and explanations

---

## 📊 Data Models

### **1. Grammar Topic**
```typescript
interface GrammarTopic {
  _id: string;
  title: string;                    // "German Cases (Die Fälle)"
  titleDe: string;                  // "Die deutschen Fälle"
  slug: string;                     // "german-cases"
  description: string;              // English description
  descriptionDe: string;            // German description
  icon: string;                     // Icon identifier (e.g., "book-open")
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  order: number;                    // Display order
  coverImage?: string;              // Image URL
  isPublished: boolean;
  lessonCount?: number;             // Virtual field
  createdAt: Date;
  updatedAt: Date;
}
```

### **2. Grammar Lesson**
```typescript
interface GrammarLesson {
  _id: string;
  topic: string;                    // Topic ID reference
  title: string;                    // "Nominative Case"
  titleDe: string;                  // "Der Nominativ"
  slug: string;                     // "nominative-case"
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  order: number;
  
  // Content
  introduction: string;
  introductionDe: string;
  explanationBlocks: ExplanationBlock[];
  keyPoints: KeyPoint[];
  commonMistakes?: CommonMistake[];
  practiceExamples: PracticeExample[];
  
  // Audio
  audioUrl?: string;
  audioStatus?: 'pending' | 'generating' | 'ready' | 'error';
  
  estimatedTime: number;            // Minutes
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // If user is authenticated
  userProgress?: {
    isCompleted: boolean;
    timeSpent: number;
    lastVisitedAt: Date;
  };
}

interface ExplanationBlock {
  type: 'text' | 'table' | 'example' | 'tip' | 'warning' | 'comparison';
  title?: string;
  titleDe?: string;
  content: string;
  contentDe: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  examples?: {
    german: string;
    english: string;
    breakdown?: string;             // Word-by-word explanation
    audioUrl?: string;
  }[];
}

interface KeyPoint {
  point: string;
  pointDe: string;
}

interface CommonMistake {
  mistake: string;
  correction: string;
  explanation: string;
}

interface PracticeExample {
  german: string;
  english: string;
  audioUrl?: string;
}
```

### **3. Grammar Exercise Set**
```typescript
interface GrammarExerciseSet {
  _id: string;
  lesson: string;                   // Lesson ID reference
  title: string;                    // "Nominative Case Practice"
  titleDe: string;
  slug: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  exercises: Exercise[];            // Array of different exercise types
  passingScore: number;             // Minimum percentage to pass (e.g., 70)
  timeLimit?: number;               // Optional time limit in minutes
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // If user has attempted
  userProgress?: {
    bestScore: number;
    isPassed: boolean;
    attemptCount: number;
    lastAttemptAt: Date;
  };
}
```

### **4. Exercise Types (9 Types)**

#### Base Exercise Interface
```typescript
interface BaseExercise {
  type: ExerciseType;
  instruction: string;              // "Fill in the correct article"
  instructionDe: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  points: number;                   // Points for correct answer
  hint?: string;                    // Optional hint
  hintDe?: string;
  explanation: string;              // Shown after answering
  explanationDe: string;
}
```

#### **Type 1: Fill in the Blank**
```typescript
interface FillBlankExercise extends BaseExercise {
  type: 'fill-blank';
  sentence: string;                 // "Ich gehe ___ Schule."
  sentenceTranslation: string;      // "I go to school."
  correctAnswer: string;            // "zur"
  acceptableAnswers?: string[];     // ["zur", "in die"]
}
```

#### **Type 2: Multiple Choice**
```typescript
interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  question: string;
  questionTranslation: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}
```

#### **Type 3: Matching**
```typescript
interface MatchingExercise extends BaseExercise {
  type: 'matching';
  pairs: {
    left: string;                   // German word/phrase
    right: string;                  // English translation
  }[];
}
```

#### **Type 4: Word Order**
```typescript
interface WordOrderExercise extends BaseExercise {
  type: 'word-order';
  words: string[];                  // Shuffled words
  correctOrder: string[];           // Correct sentence order
  translation: string;              // English translation
}
```

#### **Type 5: Conjugation**
```typescript
interface ConjugationExercise extends BaseExercise {
  type: 'conjugation';
  verb: string;                     // "gehen" (infinitive)
  tense: string;                    // "Präsens", "Präteritum"
  pronoun: string;                  // "ich", "du", "er/sie/es"
  correctAnswer: string;            // "gehe"
  verbTranslation: string;          // "to go"
}
```

#### **Type 6: Case Selection**
```typescript
interface CaseSelectionExercise extends BaseExercise {
  type: 'case-selection';
  sentence: string;                 // Full sentence
  sentenceTranslation: string;
  targetWord: string;               // Word to identify case for
  correctCase: 'Nominativ' | 'Akkusativ' | 'Dativ' | 'Genitiv';
}
```

#### **Type 7: Article Selection**
```typescript
interface ArticleSelectionExercise extends BaseExercise {
  type: 'article-selection';
  sentence: string;                 // "___ Mann geht nach Hause."
  sentenceTranslation: string;
  options: string[];                // ["der", "die", "das", "den", "dem"]
  correctAnswer: string;            // "Der"
  noun: string;                     // "Mann"
  nounGender: 'masculine' | 'feminine' | 'neuter';
  caseUsed: 'Nominativ' | 'Akkusativ' | 'Dativ' | 'Genitiv';
}
```

#### **Type 8: Translation**
```typescript
interface TranslationExercise extends BaseExercise {
  type: 'translation';
  sourceLanguage: 'de' | 'en';
  sourceText: string;
  correctTranslations: string[];    // Multiple acceptable answers
  keyWords?: string[];              // Must include these words
}
```

#### **Type 9: Error Correction**
```typescript
interface ErrorCorrectionExercise extends BaseExercise {
  type: 'error-correction';
  incorrectSentence: string;        // "Der Frau geht zum Markt."
  correctSentence: string;          // "Die Frau geht zum Markt."
  errorType: string;                // "article", "case", "word-order"
  translation: string;
}
```

---

## 🔌 API Endpoints Reference

### **Base URL**
```
https://your-api.com/api/v1/grammar
```

### **Authentication**
- Optional auth endpoints: Can be accessed without login, but provide progress if logged in
- Required auth endpoints: Must include `Authorization: Bearer {token}` header

---

### **📚 Topic Endpoints**

#### **GET /topics** - Get all topics
```typescript
// Query Parameters
{
  page?: number;              // Default: 1
  limit?: number;             // Default: 20, Max: 100
  difficulty?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  showAll?: boolean;          // Admin only - show unpublished
}

// Response
{
  success: true,
  message: "Grammar topics fetched successfully",
  data: GrammarTopic[],
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

#### **GET /topics/:topicId** - Get single topic
```typescript
// topicId can be: MongoDB ObjectId or slug
// Response: Single GrammarTopic with lessonCount
```

#### **POST /topics** (Admin) - Create topic
```typescript
// Body
{
  title: string,
  titleDe: string,
  slug: string,
  description: string,
  descriptionDe: string,
  icon?: string,
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1',
  order?: number,
  coverImage?: string,
  isPublished?: boolean
}
```

#### **PUT /topics/:topicId** (Admin) - Update topic

#### **DELETE /topics/:topicId** (Admin) - Delete topic

---

### **📖 Lesson Endpoints**

#### **GET /topics/:topicId/lessons** - Get lessons by topic
```typescript
// Query Parameters
{
  page?: number,
  limit?: number,
  showAll?: boolean           // Admin only
}

// Response
{
  success: true,
  message: "Grammar lessons fetched successfully",
  data: GrammarLesson[],
  meta: { page, limit, total, totalPages }
}
```

#### **GET /lessons/:lessonId** - Get single lesson
```typescript
// lessonId can be: MongoDB ObjectId or slug
// Optional auth - tracks visit if authenticated
// Response includes:
// - Full lesson content
// - User progress (if authenticated)
// - Available exercise sets count
```

#### **POST /lessons** (Admin) - Create lesson
```typescript
// Body
{
  topic: string,              // Topic ID
  title: string,
  titleDe: string,
  slug: string,
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1',
  order?: number,
  introduction: string,
  introductionDe: string,
  explanationBlocks: ExplanationBlock[],
  keyPoints: KeyPoint[],
  commonMistakes?: CommonMistake[],
  practiceExamples: PracticeExample[],
  estimatedTime?: number,     // Minutes
  isPublished?: boolean
}
```

#### **PUT /lessons/:lessonId** (Admin) - Update lesson

#### **DELETE /lessons/:lessonId** (Admin) - Delete lesson

#### **POST /lessons/:lessonId/complete** (Student) - Mark lesson completed
```typescript
// Body
{
  timeSpent?: number,         // Seconds
  isCompleted?: boolean
}

// Response: Updated progress
```

---

### **📝 Exercise Endpoints**

#### **GET /lessons/:lessonId/exercises** - Get exercise sets by lesson
```typescript
// Query: page, limit, showAll
// Response: Array of GrammarExerciseSet
```

#### **GET /exercises/:exerciseSetId** - Get single exercise set
```typescript
// Response: Full exercise set with all exercises
// Includes user progress if authenticated
```

#### **POST /exercises** (Admin) - Create exercise set
```typescript
// Body
{
  lesson: string,             // Lesson ID
  title: string,
  titleDe: string,
  slug: string,
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1',
  exercises: Exercise[],      // Array of different exercise types
  passingScore?: number,      // Default: 70
  timeLimit?: number,         // Minutes
  order?: number,
  isPublished?: boolean
}
```

#### **PUT /exercises/:exerciseSetId** (Admin) - Update exercise set

#### **DELETE /exercises/:exerciseSetId** (Admin) - Delete exercise set

#### **POST /exercises/:exerciseSetId/submit** (Student) - Submit answers
```typescript
// Body
{
  answers: {
    exerciseIndex: number,
    userAnswer: string | string[]
  }[],
  timeSpent: number           // Seconds
}

// Response
{
  success: true,
  message: "Congratulations! You passed with 85%!" | "You scored 65%. Keep practicing!",
  data: {
    attemptNumber: number,
    score: number,            // Percentage
    correctAnswers: number,
    totalQuestions: number,
    timeSpent: number,
    isPassed: boolean,
    answers: {
      exerciseIndex: number,
      userAnswer: string | string[],
      isCorrect: boolean,
      pointsEarned: number,
      correctAnswer: string | string[],
      explanation: string,
      explanationDe: string
    }[],
    completedAt: Date
  }
}
```

---

### **📊 Progress Endpoints**

#### **GET /progress** (Student) - Get user's grammar progress
```typescript
// Response
{
  success: true,
  data: {
    topicMastery: {
      topic: GrammarTopic,
      lessonsCompleted: number,
      totalLessons: number,
      exercisesPassed: number,
      totalExercises: number,
      averageScore: number,
      masteryLevel: 'not-started' | 'beginner' | 'intermediate' | 'advanced' | 'mastered',
      lastActivityAt: Date
    }[],
    recentActivity: {
      lesson: GrammarLesson,
      completedAt: Date
    }[],
    totalLessonsCompleted: number,
    totalExercisesPassed: number,
    overallAverageScore: number
  }
}
```

#### **GET /recommended** (Student) - Get recommended next lesson
```typescript
// Query Parameters
{
  difficulty?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
}

// Response: Next recommended lesson based on progress
// Returns null if all lessons completed
```

---

## 🧩 Frontend Components Structure

### **Recommended Component Hierarchy**

```
GrammarPage/
├── GrammarTopicList/
│   ├── TopicCard
│   ├── TopicFilter
│   └── ProgressBar
│
├── GrammarTopicDetail/
│   ├── TopicHeader
│   ├── LessonList
│   └── TopicProgress
│
├── GrammarLessonView/
│   ├── LessonHeader
│   ├── LessonContent/
│   │   ├── IntroSection
│   │   ├── ExplanationBlock
│   │   ├── KeyPointsList
│   │   ├── CommonMistakesSection
│   │   └── PracticeExamplesSection
│   ├── AudioPlayer
│   ├── ProgressTracker
│   └── NavigationButtons
│
├── GrammarExerciseView/
│   ├── ExerciseHeader
│   ├── Timer (if timeLimit exists)
│   ├── ProgressIndicator
│   ├── ExerciseRenderer/
│   │   ├── FillBlankExercise
│   │   ├── MultipleChoiceExercise
│   │   ├── MatchingExercise
│   │   ├── WordOrderExercise
│   │   ├── ConjugationExercise
│   │   ├── CaseSelectionExercise
│   │   ├── ArticleSelectionExercise
│   │   ├── TranslationExercise
│   │   └── ErrorCorrectionExercise
│   ├── HintButton
│   └── SubmitButton
│
├── GrammarResultsView/
│   ├── ScoreDisplay
│   ├── AnswerReview
│   ├── ExplanationDisplay
│   └── ActionButtons (Retry, Next)
│
└── GrammarProgress/
    ├── OverallProgress
    ├── TopicMasteryChart
    └── RecentActivity
```

---

## 🚀 Implementation Steps

### **Step 1: Setup API Service Layer**

Create a service file to handle all API calls:

```typescript
// services/grammarApi.ts
import axios from 'axios';

const API_BASE = 'https://your-api.com/api/v1/grammar';

class GrammarAPI {
  // Topics
  async getTopics(params?: { page?: number; limit?: number; difficulty?: string }) {
    const response = await axios.get(`${API_BASE}/topics`, { params });
    return response.data;
  }

  async getTopicById(topicId: string) {
    const response = await axios.get(`${API_BASE}/topics/${topicId}`);
    return response.data;
  }

  // Lessons
  async getLessonsByTopic(topicId: string, params?: any) {
    const response = await axios.get(`${API_BASE}/topics/${topicId}/lessons`, { params });
    return response.data;
  }

  async getLessonById(lessonId: string) {
    const response = await axios.get(`${API_BASE}/lessons/${lessonId}`);
    return response.data;
  }

  async markLessonComplete(lessonId: string, timeSpent: number) {
    const response = await axios.post(`${API_BASE}/lessons/${lessonId}/complete`, {
      timeSpent,
      isCompleted: true
    });
    return response.data;
  }

  // Exercises
  async getExercisesByLesson(lessonId: string) {
    const response = await axios.get(`${API_BASE}/lessons/${lessonId}/exercises`);
    return response.data;
  }

  async getExerciseSet(exerciseSetId: string) {
    const response = await axios.get(`${API_BASE}/exercises/${exerciseSetId}`);
    return response.data;
  }

  async submitExerciseAnswers(exerciseSetId: string, answers: any[], timeSpent: number) {
    const response = await axios.post(`${API_BASE}/exercises/${exerciseSetId}/submit`, {
      answers,
      timeSpent
    });
    return response.data;
  }

  // Progress
  async getUserProgress() {
    const response = await axios.get(`${API_BASE}/progress`);
    return response.data;
  }

  async getRecommendedLesson(difficulty?: string) {
    const response = await axios.get(`${API_BASE}/recommended`, {
      params: { difficulty }
    });
    return response.data;
  }
}

export const grammarAPI = new GrammarAPI();
```

---

### **Step 2: Create Topic List Page**

```typescript
// pages/GrammarTopicList.tsx
import React, { useEffect, useState } from 'react';
import { grammarAPI } from '../services/grammarApi';

export const GrammarTopicList = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTopics();
  }, [filter]);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { difficulty: filter } : {};
      const response = await grammarAPI.getTopics(params);
      setTopics(response.data);
    } catch (error) {
      console.error('Error loading topics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grammar-topics">
      <h1>German Grammar Topics</h1>
      
      {/* Filter */}
      <div className="filter-bar">
        <button onClick={() => setFilter('all')}>All Levels</button>
        <button onClick={() => setFilter('A1')}>A1</button>
        <button onClick={() => setFilter('A2')}>A2</button>
        <button onClick={() => setFilter('B1')}>B1</button>
        <button onClick={() => setFilter('B2')}>B2</button>
        <button onClick={() => setFilter('C1')}>C1</button>
      </div>

      {/* Topic Cards */}
      <div className="topic-grid">
        {topics.map(topic => (
          <TopicCard key={topic._id} topic={topic} />
        ))}
      </div>
    </div>
  );
};

const TopicCard = ({ topic }) => {
  return (
    <div className="topic-card" onClick={() => navigateToTopic(topic._id)}>
      {topic.coverImage && <img src={topic.coverImage} alt={topic.title} />}
      <div className="topic-icon">{topic.icon}</div>
      <h3>{topic.title}</h3>
      <p>{topic.description}</p>
      <div className="topic-meta">
        <span className="difficulty">{topic.difficulty}</span>
        <span className="lesson-count">{topic.lessonCount} lessons</span>
      </div>
    </div>
  );
};
```

---

### **Step 3: Create Lesson View Page**

```typescript
// pages/GrammarLessonView.tsx
import React, { useEffect, useState } from 'react';
import { grammarAPI } from '../services/grammarApi';

export const GrammarLessonView = ({ lessonId }) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    loadLesson();
    return () => {
      // Mark lesson as visited on unmount
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      grammarAPI.markLessonComplete(lessonId, timeSpent);
    };
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      const response = await grammarAPI.getLessonById(lessonId);
      setLesson(response.data);
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="lesson-view">
      {/* Header */}
      <div className="lesson-header">
        <h1>{lesson.title}</h1>
        <p className="lesson-meta">
          <span>{lesson.difficulty}</span>
          <span>{lesson.estimatedTime} min</span>
        </p>
      </div>

      {/* Audio Player */}
      {lesson.audioUrl && (
        <AudioPlayer src={lesson.audioUrl} />
      )}

      {/* Introduction */}
      <section className="lesson-introduction">
        <p>{lesson.introduction}</p>
      </section>

      {/* Explanation Blocks */}
      <section className="lesson-content">
        {lesson.explanationBlocks.map((block, index) => (
          <ExplanationBlock key={index} block={block} />
        ))}
      </section>

      {/* Key Points */}
      <section className="key-points">
        <h2>Key Points</h2>
        <ul>
          {lesson.keyPoints.map((point, index) => (
            <li key={index}>{point.point}</li>
          ))}
        </ul>
      </section>

      {/* Common Mistakes */}
      {lesson.commonMistakes && (
        <section className="common-mistakes">
          <h2>Common Mistakes</h2>
          {lesson.commonMistakes.map((mistake, index) => (
            <div key={index} className="mistake-card">
              <div className="mistake">❌ {mistake.mistake}</div>
              <div className="correction">✅ {mistake.correction}</div>
              <p>{mistake.explanation}</p>
            </div>
          ))}
        </section>
      )}

      {/* Practice Examples */}
      <section className="practice-examples">
        <h2>Practice Examples</h2>
        {lesson.practiceExamples.map((example, index) => (
          <div key={index} className="example-card">
            <p className="german">{example.german}</p>
            <p className="english">{example.english}</p>
            {example.audioUrl && <AudioButton src={example.audioUrl} />}
          </div>
        ))}
      </section>

      {/* Navigation */}
      <div className="lesson-navigation">
        <button onClick={goToExercises}>Practice Exercises</button>
      </div>
    </div>
  );
};

// Explanation Block Component
const ExplanationBlock = ({ block }) => {
  switch (block.type) {
    case 'text':
      return (
        <div className="block-text">
          {block.title && <h3>{block.title}</h3>}
          <p>{block.content}</p>
        </div>
      );

    case 'table':
      return (
        <div className="block-table">
          {block.title && <h3>{block.title}</h3>}
          <table>
            <thead>
              <tr>
                {block.tableData.headers.map((header, i) => (
                  <th key={i}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.tableData.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'example':
      return (
        <div className="block-example">
          {block.title && <h3>{block.title}</h3>}
          {block.examples?.map((ex, i) => (
            <div key={i} className="example">
              <p className="german">{ex.german}</p>
              <p className="english">{ex.english}</p>
              {ex.breakdown && <p className="breakdown">{ex.breakdown}</p>}
              {ex.audioUrl && <AudioButton src={ex.audioUrl} />}
            </div>
          ))}
        </div>
      );

    case 'tip':
      return (
        <div className="block-tip">
          💡 <strong>Tip:</strong> {block.content}
        </div>
      );

    case 'warning':
      return (
        <div className="block-warning">
          ⚠️ <strong>Warning:</strong> {block.content}
        </div>
      );

    default:
      return <div>{block.content}</div>;
  }
};
```

---

## 🎮 Exercise Types Implementation

### **Step 4: Create Exercise View with Type Handlers**

```typescript
// pages/GrammarExerciseView.tsx
import React, { useEffect, useState } from 'react';
import { grammarAPI } from '../services/grammarApi';

export const GrammarExerciseView = ({ exerciseSetId }) => {
  const [exerciseSet, setExerciseSet] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    loadExerciseSet();
  }, [exerciseSetId]);

  useEffect(() => {
    // Timer logic
    if (exerciseSet?.timeLimit) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = exerciseSet.timeLimit * 60 - elapsed;
        setTimeRemaining(remaining);
        if (remaining <= 0) {
          handleSubmit();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [exerciseSet]);

  const loadExerciseSet = async () => {
    const response = await grammarAPI.getExerciseSet(exerciseSetId);
    setExerciseSet(response.data);
    setAnswers(new Array(response.data.exercises.length).fill(null));
  };

  const handleAnswer = (userAnswer) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = userAnswer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < exerciseSet.exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowHint(false);
    }
  };

  const handleSubmit = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const formattedAnswers = answers.map((answer, index) => ({
      exerciseIndex: index,
      userAnswer: answer
    }));

    try {
      const response = await grammarAPI.submitExerciseAnswers(
        exerciseSetId,
        formattedAnswers,
        timeSpent
      );
      // Navigate to results page with response.data
      navigateToResults(response.data);
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  if (!exerciseSet) return <div>Loading...</div>;

  const currentExercise = exerciseSet.exercises[currentIndex];

  return (
    <div className="exercise-view">
      {/* Header */}
      <div className="exercise-header">
        <h2>{exerciseSet.title}</h2>
        <div className="meta">
          <span>Question {currentIndex + 1} of {exerciseSet.exercises.length}</span>
          {timeRemaining !== null && (
            <span className="timer">⏱️ {formatTime(timeRemaining)}</span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentIndex + 1) / exerciseSet.exercises.length) * 100}%` }}
        />
      </div>

      {/* Exercise Renderer */}
      <div className="exercise-content">
        <ExerciseRenderer
          exercise={currentExercise}
          userAnswer={answers[currentIndex]}
          onAnswer={handleAnswer}
        />
      </div>

      {/* Hint Button */}
      {currentExercise.hint && (
        <div className="hint-section">
          {!showHint ? (
            <button onClick={() => setShowHint(true)}>💡 Show Hint</button>
          ) : (
            <div className="hint-box">{currentExercise.hint}</div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="exercise-navigation">
        <button onClick={handlePrevious} disabled={currentIndex === 0}>
          ← Previous
        </button>
        {currentIndex === exerciseSet.exercises.length - 1 ? (
          <button onClick={handleSubmit} className="submit-btn">
            Submit Answers
          </button>
        ) : (
          <button onClick={handleNext}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

// Exercise Renderer - Dynamically render based on type
const ExerciseRenderer = ({ exercise, userAnswer, onAnswer }) => {
  switch (exercise.type) {
    case 'fill-blank':
      return <FillBlankExercise exercise={exercise} userAnswer={userAnswer} onAnswer={onAnswer} />;
    case 'multiple-choice':
      return <MultipleChoiceExercise exercise={exercise} userAnswer={userAnswer} onAnswer={onAnswer} />;
    case 'matching':
      return <MatchingExercise exercise={exercise} userAnswer={userAnswer} onAnswer={onAnswer} />;
    case 'word-order':
      return <WordOrderExercise exercise={exercise} userAnswer={userAnswer} onAnswer={onAnswer} />;
    case 'conjugation':
      return <ConjugationExercise exercise={exercise} userAnswer={userAnswer} onAnswer={onAnswer} />;
    case 'case-selection':
      return <CaseSelectionExercise exercise={exercise} userAnswer={userAnswer} onAnswer={onAnswer} />;
    case 'article-selection':
      return <ArticleSelectionExercise exercise={exercise} userAnswer={userAnswer} onAnswer={onAnswer} />;
    case 'translation':
      return <TranslationExercise exercise={exercise} userAnswer={userAnswer} onAnswer={onAnswer} />;
    case 'error-correction':
      return <ErrorCorrectionExercise exercise={exercise} userAnswer={userAnswer} onAnswer={onAnswer} />;
    default:
      return <div>Unknown exercise type</div>;
  }
};
```

---

### **Exercise Component Examples**

#### **1. Fill in the Blank**
```typescript
const FillBlankExercise = ({ exercise, userAnswer, onAnswer }) => {
  return (
    <div className="fill-blank-exercise">
      <p className="instruction">{exercise.instruction}</p>
      <div className="sentence">
        {exercise.sentence.split('___').map((part, index, array) => (
          <React.Fragment key={index}>
            {part}
            {index < array.length - 1 && (
              <input
                type="text"
                value={userAnswer || ''}
                onChange={(e) => onAnswer(e.target.value)}
                placeholder="..."
                className="blank-input"
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="translation">{exercise.sentenceTranslation}</p>
    </div>
  );
};
```

#### **2. Multiple Choice**
```typescript
const MultipleChoiceExercise = ({ exercise, userAnswer, onAnswer }) => {
  return (
    <div className="multiple-choice-exercise">
      <p className="instruction">{exercise.instruction}</p>
      <p className="question">{exercise.question}</p>
      <p className="translation">{exercise.questionTranslation}</p>
      
      <div className="options">
        {exercise.options.map((option, index) => (
          <label key={index} className="option">
            <input
              type="radio"
              name="answer"
              checked={userAnswer === option.text}
              onChange={() => onAnswer(option.text)}
            />
            <span>{option.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
```

#### **3. Matching**
```typescript
const MatchingExercise = ({ exercise, userAnswer, onAnswer }) => {
  const [matches, setMatches] = useState(userAnswer || {});
  const [shuffledRight] = useState(() => shuffle([...exercise.pairs.map(p => p.right)]));

  const handleMatch = (leftItem, rightItem) => {
    const newMatches = { ...matches };
    newMatches[leftItem] = rightItem;
    setMatches(newMatches);
    onAnswer(newMatches);
  };

  return (
    <div className="matching-exercise">
      <p className="instruction">{exercise.instruction}</p>
      <div className="matching-grid">
        <div className="left-column">
          {exercise.pairs.map((pair, index) => (
            <div key={index} className="match-item">
              {pair.left}
            </div>
          ))}
        </div>
        <div className="right-column">
          {shuffledRight.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMatch(selectedLeft, item)}
              className="match-item"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
```

#### **4. Word Order**
```typescript
const WordOrderExercise = ({ exercise, userAnswer, onAnswer }) => {
  const [orderedWords, setOrderedWords] = useState(userAnswer || []);
  const [availableWords, setAvailableWords] = useState(
    userAnswer ? exercise.words.filter(w => !userAnswer.includes(w)) : [...exercise.words]
  );

  const addWord = (word) => {
    setOrderedWords([...orderedWords, word]);
    setAvailableWords(availableWords.filter(w => w !== word));
    onAnswer([...orderedWords, word]);
  };

  const removeWord = (index) => {
    const word = orderedWords[index];
    setOrderedWords(orderedWords.filter((_, i) => i !== index));
    setAvailableWords([...availableWords, word]);
    onAnswer(orderedWords.filter((_, i) => i !== index));
  };

  return (
    <div className="word-order-exercise">
      <p className="instruction">{exercise.instruction}</p>
      <p className="translation">{exercise.translation}</p>
      
      {/* Ordered words area */}
      <div className="ordered-words">
        {orderedWords.map((word, index) => (
          <button key={index} onClick={() => removeWord(index)} className="word-chip selected">
            {word} ✕
          </button>
        ))}
      </div>
      
      {/* Available words */}
      <div className="available-words">
        {availableWords.map((word, index) => (
          <button key={index} onClick={() => addWord(word)} className="word-chip">
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};
```

#### **5. Conjugation**
```typescript
const ConjugationExercise = ({ exercise, userAnswer, onAnswer }) => {
  return (
    <div className="conjugation-exercise">
      <p className="instruction">{exercise.instruction}</p>
      <div className="conjugation-prompt">
        <p>Verb: <strong>{exercise.verb}</strong> ({exercise.verbTranslation})</p>
        <p>Tense: <strong>{exercise.tense}</strong></p>
        <p>Pronoun: <strong>{exercise.pronoun}</strong></p>
      </div>
      <input
        type="text"
        value={userAnswer || ''}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder="Enter conjugated form..."
        className="conjugation-input"
      />
    </div>
  );
};
```

#### **6. Article Selection**
```typescript
const ArticleSelectionExercise = ({ exercise, userAnswer, onAnswer }) => {
  return (
    <div className="article-selection-exercise">
      <p className="instruction">{exercise.instruction}</p>
      <div className="sentence">
        {exercise.sentence.split('___').map((part, index, array) => (
          <React.Fragment key={index}>
            {part}
            {index < array.length - 1 && (
              <select
                value={userAnswer || ''}
                onChange={(e) => onAnswer(e.target.value)}
                className="article-select"
              >
                <option value="">---</option>
                {exercise.options.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </select>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="translation">{exercise.sentenceTranslation}</p>
      <p className="meta">
        Noun: <strong>{exercise.noun}</strong> ({exercise.nounGender}, {exercise.caseUsed})
      </p>
    </div>
  );
};
```

---

### **Step 5: Create Results View**

```typescript
// pages/GrammarResultsView.tsx
export const GrammarResultsView = ({ results }) => {
  const { score, isPassed, correctAnswers, totalQuestions, answers } = results;

  return (
    <div className="results-view">
      {/* Score Display */}
      <div className="score-section">
        <div className={`score-circle ${isPassed ? 'passed' : 'failed'}`}>
          <div className="score-number">{score}%</div>
        </div>
        <h2>{isPassed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}</h2>
        <p>{correctAnswers} out of {totalQuestions} correct</p>
      </div>

      {/* Answer Review */}
      <div className="answer-review">
        <h3>Review Your Answers</h3>
        {answers.map((answer, index) => (
          <div key={index} className={`answer-card ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="answer-header">
              <span>Question {index + 1}</span>
              <span className="points">{answer.pointsEarned} / {answer.points} points</span>
            </div>
            
            <div className="answer-content">
              <p><strong>Your answer:</strong> {formatAnswer(answer.userAnswer)}</p>
              {!answer.isCorrect && (
                <p><strong>Correct answer:</strong> {formatAnswer(answer.correctAnswer)}</p>
              )}
              <div className="explanation">
                <strong>Explanation:</strong>
                <p>{answer.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="results-actions">
        {!isPassed && (
          <button onClick={handleRetry}>🔄 Try Again</button>
        )}
        <button onClick={handleNextLesson}>➡️ Next Lesson</button>
        <button onClick={handleBackToTopics}>📚 Back to Topics</button>
      </div>
    </div>
  );
};
```

---

## 📊 Progress Tracking

### **Step 6: Create Progress Dashboard**

```typescript
// pages/GrammarProgress.tsx
export const GrammarProgress = () => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const response = await grammarAPI.getUserProgress();
    setProgress(response.data);
  };

  if (!progress) return <div>Loading...</div>;

  return (
    <div className="grammar-progress">
      <h1>Your Grammar Progress</h1>

      {/* Overall Stats */}
      <div className="overall-stats">
        <StatCard
          icon="📚"
          title="Lessons Completed"
          value={progress.totalLessonsCompleted}
        />
        <StatCard
          icon="✅"
          title="Exercises Passed"
          value={progress.totalExercisesPassed}
        />
        <StatCard
          icon="📊"
          title="Average Score"
          value={`${progress.overallAverageScore}%`}
        />
      </div>

      {/* Topic Mastery */}
      <section className="topic-mastery">
        <h2>Topic Mastery</h2>
        {progress.topicMastery.map((topic, index) => (
          <div key={index} className="topic-progress-card">
            <h3>{topic.topic.title}</h3>
            <div className="mastery-badge">{topic.masteryLevel}</div>
            
            <div className="progress-stats">
              <p>Lessons: {topic.lessonsCompleted} / {topic.totalLessons}</p>
              <p>Exercises: {topic.exercisesPassed} / {topic.totalExercises}</p>
              <p>Average Score: {topic.averageScore}%</p>
            </div>
            
            <div className="progress-bar">
              <div 
                className="fill"
                style={{ width: `${(topic.lessonsCompleted / topic.totalLessons) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Recent Activity */}
      <section className="recent-activity">
        <h2>Recent Activity</h2>
        {progress.recentActivity.map((activity, index) => (
          <div key={index} className="activity-item">
            <p>{activity.lesson.title}</p>
            <span>{formatDate(activity.completedAt)}</span>
          </div>
        ))}
      </section>
    </div>
  );
};
```

---

## 🗂️ State Management

### **Option 1: React Context (Simple)**

```typescript
// context/GrammarContext.tsx
import React, { createContext, useContext, useState } from 'react';

const GrammarContext = createContext();

export const GrammarProvider = ({ children }) => {
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  return (
    <GrammarContext.Provider value={{
      currentTopic,
      setCurrentTopic,
      currentLesson,
      setCurrentLesson,
      userProgress,
      setUserProgress
    }}>
      {children}
    </GrammarContext.Provider>
  );
};

export const useGrammar = () => useContext(GrammarContext);
```

### **Option 2: Redux Toolkit (Advanced)**

```typescript
// store/grammarSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { grammarAPI } from '../services/grammarApi';

export const fetchTopics = createAsyncThunk(
  'grammar/fetchTopics',
  async (params) => {
    const response = await grammarAPI.getTopics(params);
    return response.data;
  }
);

const grammarSlice = createSlice({
  name: 'grammar',
  initialState: {
    topics: [],
    currentLesson: null,
    progress: null,
    loading: false,
    error: null
  },
  reducers: {
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default grammarSlice.reducer;
```

---

## 🎨 Sample Code Examples

### **Complete Flow Example**

```typescript
// App.tsx - Main routing
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <GrammarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/grammar" element={<GrammarTopicList />} />
          <Route path="/grammar/topics/:topicId" element={<GrammarTopicDetail />} />
          <Route path="/grammar/lessons/:lessonId" element={<GrammarLessonView />} />
          <Route path="/grammar/exercises/:exerciseSetId" element={<GrammarExerciseView />} />
          <Route path="/grammar/results" element={<GrammarResultsView />} />
          <Route path="/grammar/progress" element={<GrammarProgress />} />
        </Routes>
      </BrowserRouter>
    </GrammarProvider>
  );
}
```

### **Utility Functions**

```typescript
// utils/grammarHelpers.ts

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const normalizeAnswer = (answer: string): string => {
  return answer.toLowerCase().trim().replace(/\s+/g, ' ');
};

export const getMasteryColor = (level: string): string => {
  const colors = {
    'not-started': '#gray',
    'beginner': '#red',
    'intermediate': '#yellow',
    'advanced': '#blue',
    'mastered': '#green'
  };
  return colors[level] || colors['not-started'];
};

export const formatAnswer = (answer: string | string[]): string => {
  if (Array.isArray(answer)) {
    return answer.join(', ');
  }
  return answer;
};
```

---

## 🚨 Error Handling

```typescript
// utils/errorHandler.ts

export const handleAPIError = (error: any) => {
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const message = error.response.data?.message || 'An error occurred';
    
    switch (status) {
      case 401:
        // Redirect to login
        window.location.href = '/login';
        break;
      case 404:
        return 'Resource not found';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return message;
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    return 'An unexpected error occurred.';
  }
};
```

---

## 📱 Responsive Design Tips

```css
/* styles/grammar.css */

/* Mobile First */
.grammar-topics {
  padding: 1rem;
}

.topic-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .topic-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .grammar-topics {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .topic-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## ✅ Testing Checklist

### **Functional Testing**
- [ ] Can view all topics with proper filtering
- [ ] Can navigate to topic details and see lessons
- [ ] Can read lesson content with all blocks rendering correctly
- [ ] Audio players work for lesson and example audio
- [ ] All 9 exercise types render and accept input correctly
- [ ] Exercise timer works if time limit is set
- [ ] Hint system works
- [ ] Answer submission works and shows results
- [ ] Progress tracking updates correctly
- [ ] Recommended lesson feature works

### **Edge Cases**
- [ ] Handle no internet connection
- [ ] Handle API errors gracefully
- [ ] Prevent double submissions
- [ ] Handle expired authentication tokens
- [ ] Handle empty states (no topics, no lessons, etc.)
- [ ] Handle timer running out during exercise
- [ ] Handle browser refresh during exercise

### **Performance**
- [ ] Images lazy load
- [ ] Audio preloads appropriately
- [ ] Large exercise sets don't lag
- [ ] Pagination works smoothly
- [ ] Cache API responses when appropriate

---

## 🎯 Summary for AI Implementation

### **Quick Start Guide**

1. **Setup API service** with all endpoints from grammarAPI class
2. **Create 5 main pages**:
   - Topic List
   - Lesson View
   - Exercise View
   - Results View
   - Progress Dashboard
3. **Implement 9 exercise components** (one for each type)
4. **Add progress tracking** that updates on lesson completion and exercise submission
5. **Handle authentication** - some endpoints require auth, others are optional
6. **Add error handling** for network issues and API errors
7. **Make it responsive** - mobile-first approach
8. **Test thoroughly** with all exercise types

### **Key Points for AI**
- All API responses follow the format: `{ success, message, data, meta? }`
- Exercise answers are submitted as an array with `exerciseIndex` and `userAnswer`
- Progress is automatically tracked by the backend
- Audio URLs are optional - check if they exist before rendering
- Bilingual content - use `title` for English, `titleDe` for German
- Difficulty levels: A1, A2, B1, B2, C1
- Mastery levels: not-started, beginner, intermediate, advanced, mastered

---

## 📝 Final Notes

This grammar system is designed to be:
- **Scalable**: Easily add new topics, lessons, and exercise types
- **User-friendly**: Clear UI with instant feedback
- **Educational**: Multiple exercise types for different learning styles
- **Trackable**: Comprehensive progress monitoring
- **Bilingual**: Full support for English and German

The backend handles all the complex logic (grading, progress calculation, recommendations), so the frontend just needs to:
1. Display content beautifully
2. Collect user input
3. Submit to API
4. Show results

Good luck with your implementation! 🚀
