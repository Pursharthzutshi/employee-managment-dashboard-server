
import mongoose, { Mongoose } from "mongoose";

const employeesAccountInfoSchema = new mongoose.Schema({
    uid: String,
    name: String,
    emailId: String,
    password: String,
    genderType: String,
    status: Boolean,
    department: String,
    employeeOfTheMonth: Boolean
})


const employeesAccountInfoArchiveSchema = new mongoose.Schema({
    uid: String,
    name: String,
    emailId: String,
    password: String,
    genderType: String,
    status: Boolean,
    department: String,
    employeeOfTheMonth: Boolean
})

const adminSignUpInfoSchema = new mongoose.Schema({
    uid: String,
    name: String,
    emailId: String,
    password: String,
    status: Boolean,
    adminSecretKey: String
})

const adminSecretKeySchema = new mongoose.Schema({
    adminSecret: String,
})

const employeesTaskSchema = new mongoose.Schema({
    uid: String,
    name: String,
    emailId: {
        type: [String],
        ref: "employeesAccountInfoTable"
    },
    taskDesc: String,
    deadLine: String,
    assignedBy: String
})

const employeesLeaveDetailsSchema = new mongoose.Schema({
    uid: String,
    employeeName: String,
    employeeLeaveApplicationUid: String,
    date: String,
    leaveReason: String,
    leaveStatus: Boolean,
    leaveApprovedButtonsStatus: Boolean
})

const chatInfoSchema = new mongoose.Schema({
    uid: String,
    senderId: String,
    receiverId: String,
    message: String,
    date: String
})

// type usersSignUpInfoTableProps = {
//     usersSignUpInfoTable=()=> void
// }

const employeesAccountInfoTable = mongoose.model("employeesAccountInfoTable", employeesAccountInfoSchema, "employeesAccountInfoTable")

const employeesAccountInfoArchiveTable = mongoose.model("employeesAccountInfoArchiveTable", employeesAccountInfoArchiveSchema, "employeesAccountInfoArchiveTable")

const adminSignUpInfoTable = mongoose.model("adminSignUpInfo", adminSignUpInfoSchema, "adminSignUpInfoInfo")

const adminSecretKey = mongoose.model("adminSecretKeyInfo", adminSecretKeySchema, "adminSecretKeyInfo")

const employeesTaskTable = mongoose.model("employeesTaskInfo", employeesTaskSchema, "employeesTaskInfo")

const employeeLeaveTable = mongoose.model("employeeLeaveInfo", employeesLeaveDetailsSchema, "employeeLeaveInfo")

const chatInfoTable = mongoose.model("chatInfoSchema", chatInfoSchema, "chatInfoSchema")

module.exports = { employeesAccountInfoTable, adminSignUpInfoTable, adminSecretKey, employeesTaskTable, employeeLeaveTable, employeesAccountInfoArchiveTable, chatInfoTable }