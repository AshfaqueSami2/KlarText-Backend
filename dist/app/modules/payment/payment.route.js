"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = require("../../middleWares/auth");
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post('/init', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), payment_controller_1.PaymentControllers.initPayment);
router.post('/success', payment_controller_1.PaymentControllers.paymentSuccess);
router.post('/fail', payment_controller_1.PaymentControllers.paymentFail);
router.post('/cancel', payment_controller_1.PaymentControllers.paymentCancel);
router.post('/ipn', payment_controller_1.PaymentControllers.paymentIPN);
exports.PaymentRoutes = router;
//# sourceMappingURL=payment.route.js.map