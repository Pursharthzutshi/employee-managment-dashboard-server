
import mongoose from "mongoose";

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

// type usersSignUpInfoTableProps = {
//     usersSignUpInfoTable=()=> void
// }

const employeesAccountInfoTable = mongoose.model("employeesAccountInfoTable", employeesAccountInfoSchema, "employeesAccountInfoTable")

const adminSignUpInfoTable = mongoose.model("adminSignUpInfo", adminSignUpInfoSchema, "adminSignUpInfoInfo")

const adminSecretKey = mongoose.model("adminSecretKeyInfo", adminSecretKeySchema, "adminSecretKeyInfo")

const employeesTaskTable = mongoose.model("employeesTaskInfo", employeesTaskSchema, "employeesTaskInfo")

module.exports = { employeesAccountInfoTable, adminSignUpInfoTable, adminSecretKey, employeesTaskTable }