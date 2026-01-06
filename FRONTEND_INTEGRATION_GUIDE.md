# KlarText Payment & Subscription - Frontend Integration Guide

## 📋 Overview
This guide explains how to integrate the KlarText subscription and payment system into your frontend application.

## 🎯 Features to Implement

1. **Pricing Page** - Display subscription plans
2. **Subscription Status** - Show user's current plan
3. **Payment Flow** - Handle SSLCommerz payment gateway
4. **Lesson Access Control** - Lock/unlock lessons based on subscription
5. **Payment Result Pages** - Success, failure, and cancellation handlers

---

## 🔧 API Endpoints Reference

### Base URL
```
Development: http://localhost:5000/api/v1
Production: https://your-domain.com/api/v1
```

---

## 1️⃣ Pricing Page Implementation

### Endpoint: Get All Subscription Plans
```http
GET /subscription/plans
```

**No authentication required** (Public endpoint)

**Response:**
```json
{
  "success": true,
  "message": "Subscription plans retrieved successfully",
  "data": {
    "plans": [
      {
        "name": "monthly",
        "displayName": "Monthly Plan",
        "price": 399,
        "durationDays": 30,
        "discount": null,
        "features": [
          "Access to B1, B2, C1, C2 lessons",
          "Unlimited audio lessons",
          "Translation feature",
          "Progress tracking",
          "Email support"
        ]
      },
      {
        "name": "yearly",
        "displayName": "Yearly Plan",
        "price": 3999,
        "durationDays": 365,
        "discount": "Save 17%",
        "features": [
          "All Monthly features",
          "Priority email support",
          "Early access to new features",
          "Downloadable resources",
          "Certificate of completion"
        ]
      },
      {
        "name": "lifetime",
        "displayName": "Lifetime Access",
        "price": 7999,
        "durationDays": null,
        "discount": "Best Value",
        "features": [
          "All Yearly features",
          "Lifetime access - Pay once",
          "Future updates included",
          "Premium support",
          "Exclusive community access",
          "All future content free"
        ]
      }
    ],
    "currency": "BDT",
    "freeLevels": ["A1", "A2"],
    "premiumLevels": ["B1", "B2", "C1", "C2"]
  }
}
```

### Frontend Component Example (React/Next.js)

```tsx
'use client';

import { useState, useEffect } from 'react';

interface Plan {
  name: string;
  displayName: string;
  price: number;
  durationDays: number | null;
  discount?: string;
  features: string[];
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/subscription/plans');
      const data = await response.json();
      setPlans(data.data.plans);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleUpgrade = async (planName: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Or your auth method
      
      const response = await fetch('http://localhost:5000/api/v1/payment/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: planName })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to SSLCommerz payment gateway
        window.location.href = data.data.gatewayUrl;
      } else {
        alert('Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pricing-container">
      <h1>Choose Your Plan</h1>
      <p>A1 and A2 lessons are FREE. Upgrade to access B1, B2, C1, C2 lessons.</p>
      
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.name} className="plan-card">
            <h3>{plan.displayName}</h3>
            {plan.discount && <span className="badge">{plan.discount}</span>}
            
            <div className="price">
              <span className="currency">৳</span>
              <span className="amount">{plan.price}</span>
              {plan.durationDays && <span className="period">/{plan.durationDays} days</span>}
              {!plan.durationDays && <span className="period">/ Lifetime</span>}
            </div>

            <ul className="features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>

            <button 
              onClick={() => handleUpgrade(plan.name)}
              disabled={loading}
              className="upgrade-btn"
            >
              {loading ? 'Processing...' : 'Upgrade Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 2️⃣ Check User's Subscription Status

### Endpoint: Get Subscription Status
```http
GET /subscription/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription status retrieved successfully",
  "data": {
    "subscriptionStatus": "premium",
    "subscriptionPlan": "monthly",
    "isPremium": true,
    "isExpired": false,
    "subscriptionExpiry": "2026-02-05T10:30:00.000Z",
    "subscriptionPrice": 399,
    "accessLevels": ["A1", "A2", "B1", "B2", "C1", "C2"]
  }
}
```

### Frontend Implementation

```tsx
'use client';

import { useState, useEffect } from 'react';

interface SubscriptionStatus {
  subscriptionStatus: 'free' | 'premium';
  subscriptionPlan: 'monthly' | 'yearly' | 'lifetime' | null;
  isPremium: boolean;
  subscriptionExpiry: string | null;
  accessLevels: string[];
}

export default function ProfilePage() {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/subscription/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSubscription(data.data);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  if (!subscription) return <div>Loading...</div>;

  return (
    <div className="profile-section">
      <h2>Subscription Status</h2>
      
      <div className="status-card">
        <div className="status-badge">
          {subscription.isPremium ? '💎 Premium' : '🆓 Free'}
        </div>
        
        {subscription.isPremium && (
          <>
            <p>Plan: {subscription.subscriptionPlan}</p>
            {subscription.subscriptionExpiry && (
              <p>Expires: {new Date(subscription.subscriptionExpiry).toLocaleDateString()}</p>
            )}
            {subscription.subscriptionPlan === 'lifetime' && (
              <p>✨ Lifetime Access - Never Expires!</p>
            )}
          </>
        )}

        <div className="access-levels">
          <h4>Your Access:</h4>
          <ul>
            {subscription.accessLevels.map(level => (
              <li key={level}>{level}</li>
            ))}
          </ul>
        </div>

        {!subscription.isPremium && (
          <button onClick={() => window.location.href = '/pricing'}>
            Upgrade to Premium
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## 3️⃣ Payment Flow Implementation

### Step 1: Initialize Payment
```http
POST /payment/init
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "plan": "monthly" // or "yearly" or "lifetime"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment session created successfully",
  "data": {
    "gatewayUrl": "https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q=...",
    "sessionKey": "A1B2C3D4E5F6...",
    "transactionId": "KT1736080123456",
    "amount": 399,
    "plan": "monthly"
  }
}
```

### Step 2: Redirect to Payment Gateway
```tsx
const handlePayment = async (planName: string) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/v1/payment/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ plan: planName })
    });

    const data = await response.json();

    if (data.success) {
      // Store transaction ID for later reference
      localStorage.setItem('pendingTransaction', data.data.transactionId);
      
      // Redirect to SSLCommerz payment page
      window.location.href = data.data.gatewayUrl;
    }
  } catch (error) {
    console.error('Payment initialization failed:', error);
  }
};
```

---

## 4️⃣ Payment Result Pages

### Success Page (`/payment/success`)

```tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  const tranId = searchParams.get('tranId');
  const plan = searchParams.get('plan');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/lessons'); // Redirect to lessons
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="payment-result success">
      <div className="icon">✅</div>
      <h1>Payment Successful!</h1>
      <p>Your subscription has been upgraded to <strong>{plan}</strong> plan.</p>
      <p>Transaction ID: {tranId}</p>
      <p>Redirecting to lessons in {countdown} seconds...</p>
      <button onClick={() => router.push('/lessons')}>
        Go to Lessons Now
      </button>
    </div>
  );
}
```

### Failed Page (`/payment/failed`)

```tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tranId = searchParams.get('tranId');
  const error = searchParams.get('error');

  return (
    <div className="payment-result failed">
      <div className="icon">❌</div>
      <h1>Payment Failed</h1>
      <p>Sorry, your payment could not be processed.</p>
      {tranId && <p>Transaction ID: {tranId}</p>}
      {error && <p>Error: {error}</p>}
      
      <div className="actions">
        <button onClick={() => router.push('/pricing')}>
          Try Again
        </button>
        <button onClick={() => router.push('/contact')}>
          Contact Support
        </button>
      </div>
    </div>
  );
}
```

### Cancelled Page (`/payment/cancelled`)

```tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentCancelledPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tranId = searchParams.get('tranId');

  return (
    <div className="payment-result cancelled">
      <div className="icon">⚠️</div>
      <h1>Payment Cancelled</h1>
      <p>You cancelled the payment process.</p>
      {tranId && <p>Transaction ID: {tranId}</p>}
      
      <div className="actions">
        <button onClick={() => router.push('/pricing')}>
          Try Again
        </button>
        <button onClick={() => router.push('/lessons')}>
          Back to Lessons
        </button>
      </div>
    </div>
  );
}
```

---

## 5️⃣ Lesson Access Control

### Endpoint: Get Available Lessons
```http
GET /progress/available-lessons
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Available lessons retrieved successfully",
  "data": {
    "currentLevel": "B1",
    "subscriptionStatus": "free",
    "subscriptionPlan": null,
    "isPremium": false,
    "availableLessons": [
      {
        "_id": "abc123",
        "title": "Introduction to German",
        "difficulty": "A1",
        "isPremium": false,
        "canAccess": true,
        "requiresUpgrade": false,
        "lockReason": null,
        "isCompleted": true
      },
      {
        "_id": "def456",
        "title": "Advanced Grammar",
        "difficulty": "B1",
        "isPremium": true,
        "canAccess": false,
        "requiresUpgrade": true,
        "lockReason": "Premium subscription required",
        "isCompleted": false
      }
    ],
    "totalAvailable": 15,
    "completed": 3,
    "freeLessons": 5,
    "premiumLessons": 10,
    "lockedLessons": 10
  }
}
```

### Frontend Lesson Card Component

```tsx
'use client';

interface Lesson {
  _id: string;
  title: string;
  difficulty: string;
  isPremium: boolean;
  canAccess: boolean;
  requiresUpgrade: boolean;
  lockReason: string | null;
  isCompleted: boolean;
}

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const handleClick = () => {
    if (!lesson.canAccess) {
      // Show upgrade modal or redirect to pricing
      if (confirm('This lesson requires a premium subscription. Upgrade now?')) {
        window.location.href = '/pricing';
      }
      return;
    }
    
    // Navigate to lesson
    window.location.href = `/lessons/${lesson._id}`;
  };

  return (
    <div className={`lesson-card ${!lesson.canAccess ? 'locked' : ''}`}>
      {/* Lock Icon for Premium Lessons */}
      {lesson.isPremium && !lesson.canAccess && (
        <div className="lock-badge">
          🔒 Premium
        </div>
      )}

      {/* Completed Badge */}
      {lesson.isCompleted && (
        <div className="completed-badge">
          ✅ Completed
        </div>
      )}

      {/* Difficulty Level */}
      <span className={`difficulty-badge ${lesson.difficulty.toLowerCase()}`}>
        {lesson.difficulty}
      </span>

      <h3>{lesson.title}</h3>

      {/* Lock Reason */}
      {lesson.lockReason && (
        <p className="lock-reason">⚠️ {lesson.lockReason}</p>
      )}

      <button 
        onClick={handleClick}
        disabled={!lesson.canAccess}
        className={lesson.canAccess ? 'btn-primary' : 'btn-locked'}
      >
        {!lesson.canAccess ? 'Unlock with Premium' : 
         lesson.isCompleted ? 'Review Lesson' : 'Start Lesson'}
      </button>
    </div>
  );
}
```

---

## 🧪 Testing with Sandbox (Fake Money)

### SSLCommerz Test Cards

Use these cards for testing (no real money will be charged):

**Visa:**
- Card Number: `4111 1111 1111 1111`
- Expiry Date: `12/26`
- CVV: `123`
- Name: Any name

**Mastercard:**
- Card Number: `5555 5555 5555 4444`
- Expiry Date: `12/26`
- CVV: `123`
- Name: Any name

### Test Flow:
1. Click "Upgrade to Premium"
2. Select a plan
3. Get redirected to SSLCommerz sandbox
4. Enter test card details
5. Complete payment
6. Get redirected back to your app
7. Verify subscription is active

---

## 🔐 Authentication

All authenticated endpoints require a Bearer token in the header:

```typescript
const token = localStorage.getItem('token'); // Or your auth method

fetch('http://localhost:5000/api/v1/subscription/status', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 📊 Complete User Flow Diagram

```
1. User views Pricing Page
   ↓
2. Clicks "Upgrade to Monthly"
   ↓
3. Frontend calls POST /payment/init
   ↓
4. Backend returns gatewayUrl
   ↓
5. User redirected to SSLCommerz
   ↓
6. User enters card details (test card)
   ↓
7. SSLCommerz processes payment
   ↓
8. Backend validates payment
   ↓
9. Backend upgrades user subscription
   ↓
10. User redirected to /payment/success
    ↓
11. User can now access B1-C2 lessons
```

---

## 🎨 Recommended UI/UX

1. **Show Premium Badge** on locked lessons
2. **Disable lesson cards** that require upgrade
3. **Show upgrade prompt** when clicking locked lessons
4. **Display subscription status** in user profile
5. **Add countdown timer** on success page before redirect
6. **Show transaction ID** for user reference
7. **Provide support link** on failed payments

---

## 🚨 Error Handling

```typescript
try {
  const response = await fetch('http://localhost:5000/api/v1/payment/init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ plan: 'monthly' })
  });

  const data = await response.json();

  if (!data.success) {
    // Handle API error
    alert(data.message || 'Payment initialization failed');
    return;
  }

  // Success - redirect to payment gateway
  window.location.href = data.data.gatewayUrl;

} catch (error) {
  // Handle network error
  console.error('Network error:', error);
  alert('Something went wrong. Please try again.');
}
```

---

## 📝 Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_CLIENT_URL=http://localhost:3001
```

---

## ✅ Implementation Checklist

- [ ] Create Pricing Page (`/pricing`)
- [ ] Add Subscription Status to Profile
- [ ] Implement Payment Flow
- [ ] Create Payment Success Page (`/payment/success`)
- [ ] Create Payment Failed Page (`/payment/failed`)
- [ ] Create Payment Cancelled Page (`/payment/cancelled`)
- [ ] Update Lesson Cards with Lock/Unlock Logic
- [ ] Add Premium Badge to Locked Lessons
- [ ] Test Payment Flow with Test Cards
- [ ] Handle Error Cases
- [ ] Add Loading States
- [ ] Implement Redirect Logic

---

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Verify API endpoint URLs
3. Ensure authentication token is valid
4. Check network tab for failed requests
5. Test with SSLCommerz test cards

---

**🎉 You're all set! Start implementing the frontend and test with sandbox mode.**
