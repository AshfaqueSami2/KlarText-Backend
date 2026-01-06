"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const lesson_route_1 = require("../modules/lesson/lesson.route");
const student_routes_1 = require("../modules/student/student.routes");
const lessonProgress_route_1 = require("../modules/lessonProgress/lessonProgress.route");
const vocab_route_1 = require("../modules/vocabulary/vocab.route");
const analytics_route_1 = require("../modules/analytics/analytics.route");
const translation_route_1 = require("../modules/translation/translation.route");
const tts_route_1 = require("../modules/textToS/tts.route");
const subscription_route_1 = require("../modules/subscription/subscription.route");
const payment_route_1 = require("../modules/payment/payment.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_routes_1.UserRoutes
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/lessons',
        route: lesson_route_1.LessonRoutes,
    },
    {
        path: '/students',
        route: student_routes_1.StudentRoutes
    },
    {
        path: '/progress',
        route: lessonProgress_route_1.LessonProgressRoutes,
    },
    {
        path: '/vocab',
        route: vocab_route_1.VocabRoutes,
    },
    {
        path: '/analytics',
        route: analytics_route_1.AnalyticsRoutes,
    },
    {
        path: '/translation',
        route: translation_route_1.TranslationRoutes,
    },
    {
        path: '/tts',
        route: tts_route_1.TTSRoutes,
    },
    {
        path: '/subscription',
        route: subscription_route_1.SubscriptionRoutes,
    },
    {
        path: '/payment',
        route: payment_route_1.PaymentRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=index.js.map