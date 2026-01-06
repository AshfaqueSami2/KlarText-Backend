"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("./subscription.controller");
const auth_1 = require("../../middleWares/auth");
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.get('/plans', subscription_controller_1.SubscriptionControllers.getPlans);
router.get('/status', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), subscription_controller_1.SubscriptionControllers.getStatus);
router.post('/upgrade', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), subscription_controller_1.SubscriptionControllers.upgrade);
router.post('/cancel', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), subscription_controller_1.SubscriptionControllers.cancel);
exports.SubscriptionRoutes = router;
//# sourceMappingURL=subscription.route.js.map