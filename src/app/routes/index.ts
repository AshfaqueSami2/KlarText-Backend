import express, { Router } from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { LessonRoutes } from '../modules/lesson/lesson.route';
import { StudentRoutes } from '../modules/student/student.routes';
import { LessonProgressRoutes } from '../modules/lessonProgress/lessonProgress.route';
import { VocabRoutes } from '../modules/vocabulary/vocab.route';
import { AnalyticsRoutes } from '../modules/analytics/analytics.route';
import { TranslationRoutes } from '../modules/translation/translation.route';
import { TTSRoutes } from '../modules/textToS/tts.route';
import { SubscriptionRoutes } from '../modules/subscription/subscription.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { StreakRoutes } from '../modules/streak/streak.route';




const router = Router()

const moduleRoutes = [
    {
        path:'/user',
        route:UserRoutes
    },
    {
        path:'/auth',
        route:AuthRoutes,
    },
    {
        path:'/lessons',
        route:LessonRoutes,
    },
    {
        path:'/students',
        route:StudentRoutes
    },
    {
        path:'/progress',
        route:LessonProgressRoutes,
    },
    {
        path:'/vocab',
        route:VocabRoutes,
    },
    {
        path:'/analytics',
        route:AnalyticsRoutes,
    },
    {
        path:'/translation',
        route:TranslationRoutes,
    },
    {
        path:'/tts',
        route:TTSRoutes,
    },
    {
        path:'/subscription',
        route:SubscriptionRoutes,
    },
    {
        path:'/payment',
        route:PaymentRoutes,
    },
    {
        path:'/streak',
        route:StreakRoutes,
    },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router