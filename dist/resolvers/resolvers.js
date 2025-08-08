"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const graphql_subscriptions_1 = require("graphql-subscriptions");
require('dotenv').config();
const { employeesAccountInfoTable, employeesTaskTable, adminSignUpInfoTable, adminSecretKey, employeeLeaveTable, chatInfoTable } = require("../models/db");
const secret = crypto_1.default.randomBytes(64).toString('hex');
mongoose_1.default.connect(`mongodb+srv://${process.env.dbUsername}:${process.env.dbPassword}@cluster0.m8wabkl.mongodb.net/Dashboard?retryWrites=true&w=majority`).then((res) => {
    console.log(res);
});
const SEND_MESSAGE_CHANNEL = "SEND_MESSAGE_CHANNEL";
const TYPE_SEND_MESSAGE_CHANNEL = "TYPE_SEND_MESSAGE_CHANNEL";
const pubsub = new graphql_subscriptions_1.PubSub();
exports.resolvers = {
    Query: {
        fetchEmployeesTaskDetails() {
            return __awaiter(this, void 0, void 0, function* () {
                const employeesDetails = yield employeesTaskTable.find();
                return employeesDetails;
            });
        },
        fetchEmailUsersIds() {
            return __awaiter(this, void 0, void 0, function* () {
                const users = yield employeesAccountInfoTable.find();
                return users;
            });
        },
        showAllEmployee() {
            return __awaiter(this, void 0, void 0, function* () {
                const allEmployees = yield employeesAccountInfoTable.find();
                return allEmployees;
            });
        },
        showAllAdmin() {
            return __awaiter(this, void 0, void 0, function* () {
                const allAdmin = yield adminSignUpInfoTable.find();
                return allAdmin;
            });
        },
        fetchAdminProfileDetails(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const allAdmin = yield adminSignUpInfoTable.find({ uid: args.fetchAdminProfileDetailsParameters.uid });
                return allAdmin;
            });
        },
        fetchEmployeesLeaveDetails(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const employeeLeaveDetails = yield employeeLeaveTable.find({});
                return employeeLeaveDetails;
            });
        },
        showLoggedInEmployeesLeaveDetailsData(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const employeeLeaveDetails = yield employeeLeaveTable.find({ uid: args.showLoggedInEmployeesLeaveDetailsDataParameters.uid });
                console.log(employeeLeaveDetails);
                return employeeLeaveDetails;
            });
        },
        showAllChats(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const showChats = yield employeesAccountInfoTable.find();
                const joinTables = yield employeesAccountInfoTable.aggregate([
                    {
                        $lookup: {
                            from: "adminSignUpInfoInfo",
                            localField: "_id",
                            foreignField: "_id",
                            as: "info"
                        }
                    }
                ]);
                // const filtershowChats = await showChats.filter((chatsId: string) => chatsId.uid !== args.showAllChatsParamters.uid)
                return showChats;
            });
        },
        showSenderReceiverChat(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const senderId = args.showSenderReceiverChatParameters.senderId;
                const receiverId = args.showSenderReceiverChatParameters.receiverId;
                const showChats = yield chatInfoTable.find({
                    $or: [
                        { senderId: senderId, receiverId: receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ]
                });
                return showChats;
            });
        }
    },
    Mutation: {
        createUserSignUp(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const existingEmailId = yield employeesAccountInfoTable.findOne({ emailId: args.userSignUpParameters.emailId });
                const checkEmptyFields = args.userSignUpParameters.emailId === "" || args.userSignUpParameters.name === "" ||
                    args.userSignUpParameters.genderType === "" || args.userSignUpParameters.department === "";
                if (checkEmptyFields) {
                    return {
                        AddedSignUpData: null,
                        success: false,
                        message: "Please Fill Up the form"
                    };
                }
                else if (existingEmailId) {
                    return {
                        AddedSignUpData: null,
                        success: false,
                        message: "Email ID already Exists"
                    };
                }
                else {
                    employeesAccountInfoTable.insertMany(Object.assign({}, args.userSignUpParameters));
                    return {
                        AddedSignUpData: Object.assign({}, args.userSignUpParameters),
                        success: true,
                        message: "Sign Up was suscessful"
                    };
                }
            });
        },
        // createAdmin
        createAdminSignUp(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const checkAdminKey = yield adminSecretKey.findOne({ adminSecret: args.adminSignUpParameters.adminSecretKey });
                const checkEmptyFields = args.adminSignUpParameters.emailId === "" || args.adminSignUpParameters.name === "" ||
                    args.adminSignUpParameters.password === "";
                if (checkEmptyFields) {
                    return {
                        success: false,
                        message: "Please fill up the details"
                    };
                }
                else if (!checkAdminKey) {
                    return {
                        success: false,
                        message: "Incorrect admin key"
                    };
                }
                else {
                    adminSignUpInfoTable.insertMany(Object.assign({}, args.adminSignUpParameters));
                    return {
                        success: true,
                        message: "Admin Sign Up was suscessful"
                    };
                }
            });
        },
        createUserLogin(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                // const checkExistingEmailId = await employeesAccountInfoTable.find({ emailId: args.userLoginParameters.emailId })
                const user = yield employeesAccountInfoTable.findOne({ emailId: args.userLoginParameters.emailId });
                if (!user) {
                    return {
                        success: false,
                        message: 'Employee Email Id in not filled / does not exists',
                    };
                }
                else if (user.password !== args.userLoginParameters.password) {
                    return {
                        success: false,
                        message: 'Password Incorrect',
                    };
                }
                else {
                    const uid = user.uid;
                    const token = jsonwebtoken_1.default.sign({ userId: user._id, name: user.name, email: user.emailId }, secret, { expiresIn: "5h" });
                    return {
                        uid: uid,
                        name: user.name,
                        token: token,
                        success: true,
                        message: 'User loggedin successfully',
                    };
                }
            });
        },
        createAdminLogin(parent, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                // const checkExistingEmailId = await employeesAccountInfoTable.find({ emailId: args.adminLoginParameters.emailId })
                const admin = yield adminSignUpInfoTable.findOne({ emailId: args.adminLoginParameters.emailId });
                const { res } = context;
                if (!admin) {
                    return {
                        success: false,
                        message: 'Admin Email Id in not filled / does not exists',
                    };
                }
                else if (admin.password !== args.adminLoginParameters.password) {
                    return {
                        success: false,
                        message: 'Password Incorrect',
                    };
                }
                else {
                    const uid = admin.uid;
                    const token = jsonwebtoken_1.default.sign({ adminId: admin._id, name: admin.name, email: admin.emailId }, secret, { expiresIn: "5h" });
                    res.cookie('token', token, { httpOnly: true, maxAge: 5 * 60 * 60 * 1000 }); // 5 hours in milliseconds
                    return {
                        uid: uid,
                        name: admin.name,
                        success: true,
                        message: 'admin loggedin successfully',
                        token: token,
                        admin: true
                    };
                }
            });
        },
        updateEmployeeOfTheMonth(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const findAlreadyExistingEmployeeOfTheMonth = yield employeesAccountInfoTable.findOne({ employeeOfTheMonth: true });
                if (findAlreadyExistingEmployeeOfTheMonth) {
                    yield employeesAccountInfoTable.updateOne({ employeeOfTheMonth: true }, { $set: { employeeOfTheMonth: false } });
                }
                const updateEmployeeOfTheMonthStatus = yield employeesAccountInfoTable.updateOne({ uid: args.updateEmployeeOfTheMonthParameters.uid }, { $set: { employeeOfTheMonth: args.updateEmployeeOfTheMonthParameters.employeeOfTheMonth } });
                return updateEmployeeOfTheMonthStatus;
            });
        },
        deleteEmployeeAccount(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const deleteEmployee = yield employeesAccountInfoTable.deleteOne({ uid: args.deleteEmployeeAccountParameters.uid });
                return {
                    status: true,
                    uid: args.deleteEmployeeAccountParameters.uid
                };
                // return [args];
            });
        },
        createEmployeesTask(parent, args) {
            const emptyFieldValues = args.employeesTaskParameters.name === "" || args.employeesTaskParameters.emailId === null ||
                args.employeesTaskParameters.taskDesc === "" || args.employeesTaskParameters.deadLine === "";
            if (emptyFieldValues) {
                return {
                    success: false,
                    message: 'Please Fill Up the task details',
                    addNewTaskData: null
                };
            }
            else if (args.employeesTaskParameters.taskDesc.length < 10) {
                return {
                    success: false,
                    message: 'Task description should be greater than 10',
                    addNewTaskData: null
                };
            }
            else {
                employeesTaskTable.insertMany(Object.assign({}, args.employeesTaskParameters));
                return {
                    success: true,
                    message: 'Task Added Successfully',
                    addNewTaskData: Object.assign({}, args.employeesTaskParameters),
                    // addNewTaskData: {args}
                };
            }
        },
        deleteEmployeesTask(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                yield employeesTaskTable.deleteOne({ uid: args.employeeUidParameter.uid });
                return [args];
            });
        },
        editEmployeesTask(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const checkEmptyFields = args.editEmployeesTaskParameter.name !== "" && args.editEmployeesTaskParameter.taskDesc !== ""
                    && args.editEmployeesTaskParameter.deadLine !== "" && !args.editEmployeesTaskParameter.emailId;
                const updateFields = {};
                if (checkEmptyFields) {
                    return [];
                }
                if (args.editEmployeesTaskParameter.name !== "") {
                    updateFields.name = args.editEmployeesTaskParameter.name;
                }
                if (args.editEmployeesTaskParameter.taskDesc !== "" && args.editEmployeesTaskParameter.taskDesc.length > 10) {
                    updateFields.taskDesc = args.editEmployeesTaskParameter.taskDesc;
                }
                if (args.editEmployeesTaskParameter.deadLine !== "") {
                    updateFields.deadLine = args.editEmployeesTaskParameter.deadLine;
                }
                if (Array.isArray(args.editEmployeesTaskParameter.emailId) && args.editEmployeesTaskParameter.emailId.length > 0) {
                    updateFields.emailId = args.editEmployeesTaskParameter.emailId;
                }
                if (Object.keys(updateFields).length > 0) {
                    yield employeesTaskTable.updateOne({ uid: args.editEmployeesTaskParameter.uid }, { $set: updateFields });
                }
                return [args];
            });
        },
        updateSignUpStatus(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const updateStatus = yield employeesAccountInfoTable.updateMany({ uid: args.updateSignUpStatusParameter.uid }, { $set: { status: args.updateSignUpStatusParameter.status } });
                return updateStatus;
            });
        },
        updateName(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (args.updateProfileNameParameters.name === "") {
                    return {
                        updateNameData: null,
                        status: false,
                        message: "Please Enter Name"
                    };
                }
                else {
                    yield adminSignUpInfoTable.updateMany({ uid: args.updateProfileNameParameters.uid }, { $set: { name: args.updateProfileNameParameters.name } });
                    return {
                        updateNameData: Object.assign({}, args.updateProfileNameParameters),
                        status: true,
                        message: "Name Updated"
                    };
                }
            });
        },
        updatePassword(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                yield adminSignUpInfoTable.updateMany({ uid: args.updateProfilePasswordParameters.uid }, { $set: { password: args.updateProfilePasswordParameters.password } });
                return [args];
            });
        },
        fetchLoggedInEmployeeAssignedTaskDetails(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const fetchLoggedInEmployeeTask = yield employeesAccountInfoTable.findOne({ uid: args.fetchLoggedInEmployeeAssignedTaskDetailsParameters.uid });
                const findFetchedLoggedInEmailId = yield employeesTaskTable.find({});
                const assignedTasks = [];
                yield findFetchedLoggedInEmailId.map((data) => __awaiter(this, void 0, void 0, function* () {
                    yield data.emailId.map((val) => {
                        if (val === fetchLoggedInEmployeeTask.emailId) {
                            assignedTasks.push(data);
                        }
                    });
                }));
                return assignedTasks;
            });
        },
        insertEmployeesLeaveDetails(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const checkEmptyFields = args.insertEmployeesLeaveDetailsParameters.date === "" || args.insertEmployeesLeaveDetailsParameters.leaveReason === "" ||
                    args.insertEmployeesLeaveDetailsParameters.leaveStatus === "";
                const findEmployeeName = yield employeesAccountInfoTable.find({ uid: args.insertEmployeesLeaveDetailsParameters.uid });
                if (checkEmptyFields) {
                    return {
                        employeeLeaveData: null,
                        success: false,
                        message: "Please fill up the leave form"
                    };
                }
                else {
                    employeeLeaveTable.insertMany(Object.assign(Object.assign({}, args.insertEmployeesLeaveDetailsParameters), { employeeName: findEmployeeName[0].name }));
                    return {
                        employeeLeaveData: [Object.assign(Object.assign({}, args.insertEmployeesLeaveDetailsParameters), { employeeName: findEmployeeName[0].name })],
                        success: true,
                        message: "Leave Sent Successfully"
                    };
                }
            });
        },
        updateEmployeeLeaveStatus(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                yield employeeLeaveTable.updateOne({ uid: args.updateEmployeeLeaveStatusParameters.uid, employeeLeaveApplicationUid: args.updateEmployeeLeaveStatusParameters.employeeLeaveApplicationUid }, { $set: { leaveStatus: args.updateEmployeeLeaveStatusParameters.leaveStatus, leaveApprovedButtonsStatus: args.updateEmployeeLeaveStatusParameters.leaveApprovedButtonsStatus } });
                return {
                    updatedEmployeeLeaveStatusData: [Object.assign({}, args.updateEmployeeLeaveStatusParameters)],
                    success: true,
                    message: "Updated Status Successfully"
                };
            });
        },
        sendMessage(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const insertMessage = yield chatInfoTable.insertMany(Object.assign({}, args.sendMessageParameters));
                pubsub.publish(SEND_MESSAGE_CHANNEL, { messageSent: insertMessage[0] });
                return insertMessage;
            });
        },
        sendMessageTypeIndicator(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                pubsub.publish(TYPE_SEND_MESSAGE_CHANNEL, { typingIndicator: Object.assign({}, args.sendMessageTypeIndicatorParameters.isTyping) });
                return { success: true };
            });
        }
    },
    Subscription: {
        messageSent: {
            subscribe: (0, graphql_subscriptions_1.withFilter)((root, args, context) => {
                return pubsub.asyncIterator(SEND_MESSAGE_CHANNEL);
            }, (payload, variables) => {
                return (payload.messageSent.senderId === variables.messageSendParameters.senderId &&
                    payload.messageSent.receiverId === variables.messageSendParameters.receiverId) ||
                    (payload.messageSent.senderId === variables.messageSendParameters.receiverId &&
                        payload.messageSent.receiverId === variables.messageSendParameters.senderId);
            }),
        },
    },
};
module.exports = exports.resolvers;
