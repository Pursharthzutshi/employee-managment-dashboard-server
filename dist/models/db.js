"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employeesAccountInfoSchema = new mongoose_1.default.Schema({
    uid: String,
    name: String,
    emailId: String,
    password: String,
    genderType: String,
    status: Boolean,
    department: String,
    employeeOfTheMonth: Boolean
});
const employeesAccountInfoArchiveSchema = new mongoose_1.default.Schema({
    uid: String,
    name: String,
    emailId: String,
    password: String,
    genderType: String,
    status: Boolean,
    department: String,
    employeeOfTheMonth: Boolean
});
const adminSignUpInfoSchema = new mongoose_1.default.Schema({
    uid: String,
    name: String,
    emailId: String,
    password: String,
    status: Boolean,
    adminSecretKey: String
});
const adminSecretKeySchema = new mongoose_1.default.Schema({
    adminSecret: String,
});
const employeesTaskSchema = new mongoose_1.default.Schema({
    uid: String,
    name: String,
    emailId: {
        type: [String],
        ref: "employeesAccountInfoTable"
    },
    taskDesc: String,
    deadLine: String,
    assignedBy: String
});
const employeesLeaveDetailsSchema = new mongoose_1.default.Schema({
    uid: String,
    employeeName: String,
    employeeLeaveApplicationUid: String,
    date: String,
    leaveReason: String,
    leaveStatus: Boolean,
    leaveApprovedButtonsStatus: Boolean
});
const chatInfoSchema = new mongoose_1.default.Schema({
    uid: String,
    senderId: String,
    receiverId: String,
    message: String,
    date: String
});
// type usersSignUpInfoTableProps = {
//     usersSignUpInfoTable=()=> void
// }
const employeesAccountInfoTable = mongoose_1.default.model("employeesAccountInfoTable", employeesAccountInfoSchema, "employeesAccountInfoTable");
const employeesAccountInfoArchiveTable = mongoose_1.default.model("employeesAccountInfoArchiveTable", employeesAccountInfoArchiveSchema, "employeesAccountInfoArchiveTable");
const adminSignUpInfoTable = mongoose_1.default.model("adminSignUpInfo", adminSignUpInfoSchema, "adminSignUpInfoInfo");
const adminSecretKey = mongoose_1.default.model("adminSecretKeyInfo", adminSecretKeySchema, "adminSecretKeyInfo");
const employeesTaskTable = mongoose_1.default.model("employeesTaskInfo", employeesTaskSchema, "employeesTaskInfo");
const employeeLeaveTable = mongoose_1.default.model("employeeLeaveInfo", employeesLeaveDetailsSchema, "employeeLeaveInfo");
const chatInfoTable = mongoose_1.default.model("chatInfoSchema", chatInfoSchema, "chatInfoSchema");
module.exports = { employeesAccountInfoTable, adminSignUpInfoTable, adminSecretKey, employeesTaskTable, employeeLeaveTable, employeesAccountInfoArchiveTable, chatInfoTable };
