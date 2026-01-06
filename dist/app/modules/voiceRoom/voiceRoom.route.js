"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceRoomRoutes = void 0;
const express_1 = __importDefault(require("express"));
const voiceRoom_controller_1 = require("./voiceRoom.controller");
const auth_1 = require("../../middleWares/auth");
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middleWares/validateRequest"));
const voiceRoom_validation_1 = require("./voiceRoom.validation");
const router = express_1.default.Router();
router.get('/', voiceRoom_controller_1.VoiceRoomControllers.getActiveRooms);
router.get('/:roomId', (0, validateRequest_1.default)(voiceRoom_validation_1.roomIdParamValidationSchema), voiceRoom_controller_1.VoiceRoomControllers.getRoomById);
router.post('/create', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(voiceRoom_validation_1.createVoiceRoomValidationSchema), voiceRoom_controller_1.VoiceRoomControllers.createVoiceRoom);
router.get('/my/active-room', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT, user_constant_1.USER_ROLE.ADMIN), voiceRoom_controller_1.VoiceRoomControllers.getUserActiveRoom);
router.post('/:roomId/join', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(voiceRoom_validation_1.roomIdParamValidationSchema), voiceRoom_controller_1.VoiceRoomControllers.joinVoiceRoom);
router.post('/:roomId/leave', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(voiceRoom_validation_1.roomIdParamValidationSchema), voiceRoom_controller_1.VoiceRoomControllers.leaveVoiceRoom);
router.post('/:roomId/apply-speak', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(voiceRoom_validation_1.roomIdParamValidationSchema), voiceRoom_controller_1.VoiceRoomControllers.applyToSpeak);
router.post('/:roomId/requests/:requestId/approve', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(voiceRoom_validation_1.requestIdParamValidationSchema), voiceRoom_controller_1.VoiceRoomControllers.approveSpeakerRequest);
router.post('/:roomId/requests/:requestId/reject', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(voiceRoom_validation_1.requestIdParamValidationSchema), voiceRoom_controller_1.VoiceRoomControllers.rejectSpeakerRequest);
router.post('/:roomId/invite-speak', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(voiceRoom_validation_1.inviteToSpeakValidationSchema), voiceRoom_controller_1.VoiceRoomControllers.inviteToSpeak);
router.post('/:roomId/step-down', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(voiceRoom_validation_1.roomIdParamValidationSchema), voiceRoom_controller_1.VoiceRoomControllers.stepDownToListener);
router.post('/:roomId/mute-speaker', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(voiceRoom_validation_1.muteSpeakerValidationSchema), voiceRoom_controller_1.VoiceRoomControllers.muteSpeaker);
router.post('/:roomId/remove-participant', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(voiceRoom_validation_1.removeParticipantValidationSchema), voiceRoom_controller_1.VoiceRoomControllers.removeParticipant);
router.get('/:roomId/token/refresh', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(voiceRoom_validation_1.roomIdParamValidationSchema), voiceRoom_controller_1.VoiceRoomControllers.refreshToken);
exports.VoiceRoomRoutes = router;
//# sourceMappingURL=voiceRoom.route.js.map