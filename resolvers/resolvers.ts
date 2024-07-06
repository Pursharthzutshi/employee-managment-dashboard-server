import mongoose from "mongoose"
import jwt from 'jsonwebtoken';
import crypto from "crypto"
import { PubSub, PubSubEngine } from "graphql-subscriptions";
import { adminSignUpProps, createEmployeesTaskProps, createUserSignUpProps, FetchAdminProfileDetailsParametersProps, fetchLoggedInEmployeeAssignedTaskDetailsParametersType, fetchLoggedInEmployeeAssignedTaskDetailsProps, updateTaskFieldsProps } from "../resolvers-types/resolvers-type";
require('dotenv').config()
console.log(process.env)

const { employeesAccountInfoTable, employeesTaskTable, adminSignUpInfoTable, adminSecretKey } = require("../models/db")
const secret = crypto.randomBytes(64).toString('hex');

mongoose.connect(`mongodb+srv://${process.env.dbUsername}:${process.env.dbPassword}@cluster0.m8wabkl.mongodb.net/Dashboard?retryWrites=true&w=majority`).then((res) => {
    // console.log(res);
})

export const resolvers = {
    Query: {
        async fetchEmployeesTaskDetails() {
            const employeesDetails = await employeesTaskTable.find();
            return employeesDetails
        },
        async fetchEmailUsersIds() {
            const users = await employeesAccountInfoTable.find()
            return users
        },

        async showAllEmployee() {
            const allEmployees = await employeesAccountInfoTable.find();
            return allEmployees
        },
        async showAllAdmin() {
            const allAdmin = await adminSignUpInfoTable.find();
            return allAdmin
        },
        async fetchAdminProfileDetails(parent: undefined, args: { fetchAdminProfileDetailsParameters: FetchAdminProfileDetailsParametersProps }) {
            console.log(args)
            const allAdmin = await adminSignUpInfoTable.find({ uid: args.fetchAdminProfileDetailsParameters.uid });
            return allAdmin
        },



    },
    Mutation: {

        async createUserSignUp(parent: undefined, args: { userSignUpParameters: createUserSignUpProps; }) {
            console.log(args.userSignUpParameters)
            const existingEmailId = await employeesAccountInfoTable.findOne({ emailId: args.userSignUpParameters.emailId })

            const checkEmptyFields = args.userSignUpParameters.emailId === "" || args.userSignUpParameters.name === "" ||
                args.userSignUpParameters.genderType === "" || args.userSignUpParameters.department === ""

            if (checkEmptyFields) {
                return {
                    AddedSignUpData: null,
                    success: false,
                    message: "Please Fill Up the form"
                }
            } else if (existingEmailId) {
                return {
                    AddedSignUpData: null,
                    success: false,
                    message: "Email ID already Exists"
                }
            } else {
                employeesAccountInfoTable.insertMany({ ...args.userSignUpParameters })
                return {
                    AddedSignUpData: { ...args.userSignUpParameters },
                    success: true,
                    message: "Sign Up was suscessful"
                }
            }



        },
        // createAdmin
        async createAdminSignUp(parent: undefined, args: { adminSignUpParameters: adminSignUpProps; }) {
            // console.log(args.adminSignUpParameters)
            // if(args.adminSignUpParameters)
            console.log(args.adminSignUpParameters.adminSecretKey)

            const checkAdminKey = await adminSecretKey.findOne({ adminSecret: args.adminSignUpParameters.adminSecretKey })

            const checkEmptyFields = args.adminSignUpParameters.emailId === "" || args.adminSignUpParameters.name === "" ||
                args.adminSignUpParameters.password === ""

            if (checkEmptyFields) {
                return {
                    success: false,
                    message: "Please fill up the details"
                }
            }

            else if (!checkAdminKey) {

                return {
                    success: false,
                    message: "Incorrect admin key"
                }
            } else {


                adminSignUpInfoTable.insertMany({ ...args.adminSignUpParameters })
                return {
                    success: true,
                    message: "Admin Sign Up was suscessful"
                }
            }

        },


        async createUserLogin(parent: undefined, args: { userLoginParameters: { emailId: String, password: String }; }) {

            // const checkExistingEmailId = await employeesAccountInfoTable.find({ emailId: args.userLoginParameters.emailId })
            console.log(args)
            const user = await employeesAccountInfoTable.findOne({ emailId: args.userLoginParameters.emailId })

            console.log(user)
            if (!user) {

                return {
                    success: false,
                    message: 'Employee Email Id in not filled / does not exists',
                }

            } else if (user.password !== args.userLoginParameters.password) {
                return {
                    success: false,
                    message: 'Password Incorrect',
                }
            } else {

                const uid = user.uid

                const token = jwt.sign(

                    { userId: user._id, name: user.name, email: user.emailId },
                    secret,
                    { expiresIn: "5h" }
                );
                return {
                    uid: uid,
                    name: user.name,
                    token: token,
                    success: true,
                    message: 'User loggedin successfully',
                }
            }


        },
        async createAdminLogin(parent: undefined, args: { adminLoginParameters: { emailId: String, password: String }; }) {
            // const checkExistingEmailId = await employeesAccountInfoTable.find({ emailId: args.adminLoginParameters.emailId })

            const admin = await adminSignUpInfoTable.findOne({ emailId: args.adminLoginParameters.emailId })

            if (!admin) {

                return {
                    success: false,
                    message: 'Admin Email Id in not filled / does not exists',

                }
            } else if (admin.password !== args.adminLoginParameters.password) {
                return {
                    success: false,
                    message: 'Password Incorrect',

                }
            } else {

                const uid = admin.uid

                const token = jwt.sign(

                    { adminId: admin._id, name: admin.name, email: admin.emailId },
                    secret,
                    { expiresIn: "5h" }
                );
                return {
                    uid: uid,
                    name: admin.name,
                    success: true,
                    message: 'admin loggedin successfully',
                    token: token,
                    admin: true

                }

            }
        },
        async updateEmployeeOfTheMonth(parent: undefined, args: { updateEmployeeOfTheMonthParameters: { uid: String; employeeOfTheMonth: Boolean; }; }) {
            // console.log(args)

            const findAlreadyExistingEmployeeOfTheMonth = await employeesAccountInfoTable.findOne({ employeeOfTheMonth: true })
            // console.log(findAlreadyExistingEmployeeOfTheMonth)

            if (findAlreadyExistingEmployeeOfTheMonth) {
                await employeesAccountInfoTable.updateOne({ employeeOfTheMonth: true }, { $set: { employeeOfTheMonth: false } })
            }
            const updateEmployeeOfTheMonthStatus = await employeesAccountInfoTable.updateOne({ uid: args.updateEmployeeOfTheMonthParameters.uid }, { $set: { employeeOfTheMonth: args.updateEmployeeOfTheMonthParameters.employeeOfTheMonth } })

            return updateEmployeeOfTheMonthStatus
        },

        async deleteEmployeeAccount(parent: undefined, args: { deleteEmployeeAccountParameters: { uid: String }; }) {
            console.log(args)
            const deleteEmployee = await employeesAccountInfoTable.deleteOne({ uid: args.deleteEmployeeAccountParameters.uid })

            return {
                status: true,
                uid: args.deleteEmployeeAccountParameters.uid
            }
            // return [args];
        },
        createEmployeesTask(parent: undefined, args: { employeesTaskParameters: createEmployeesTaskProps; }) {

            const emptyFieldValues = args.employeesTaskParameters.name === "" || args.employeesTaskParameters.emailId === null ||
                args.employeesTaskParameters.taskDesc === "" || args.employeesTaskParameters.deadLine === ""

            console.log(args)
            if (emptyFieldValues) {
                return {
                    success: false,
                    message: 'Please Fill Up the task details',
                    addNewTaskData: null
                }
            } else if (args.employeesTaskParameters.taskDesc.length < 10) {
                return {
                    success: false,
                    message: 'Task description should be greater than 10',
                    addNewTaskData: null
                }
            } else {
                employeesTaskTable.insertMany({ ...args.employeesTaskParameters })
                return {
                    success: true,
                    message: 'Task Added Successfully',
                    addNewTaskData: { ...args.employeesTaskParameters },
                    // addNewTaskData: {args}
                }
            }

        },


        async deleteEmployeesTask(parent: undefined, args: { employeeUidParameter: { uid: String; }; }) {
            await employeesTaskTable.deleteOne({ uid: args.employeeUidParameter.uid })
            return [args]
        },

        async editEmployeesTask(parent: undefined, args: { editEmployeesTaskParameter: updateTaskFieldsProps }) {

            console.log(args);

            const checkEmptyFields = args.editEmployeesTaskParameter.name !== "" && args.editEmployeesTaskParameter.taskDesc !== ""
                && args.editEmployeesTaskParameter.deadLine !== "" && !args.editEmployeesTaskParameter.emailId  

            const updateFields: updateTaskFieldsProps = {}

            if (checkEmptyFields) {
                return []
            }

            if (args.editEmployeesTaskParameter.name !== "") {
                updateFields.name = args.editEmployeesTaskParameter.name
            }
            if (args.editEmployeesTaskParameter.taskDesc !== "" && args.editEmployeesTaskParameter.taskDesc.length > 10) {
                updateFields.taskDesc = args.editEmployeesTaskParameter.taskDesc
            }
            if (args.editEmployeesTaskParameter.deadLine !== "") {
                updateFields.deadLine = args.editEmployeesTaskParameter.deadLine
            }
            if (Array.isArray(args.editEmployeesTaskParameter.emailId) && args.editEmployeesTaskParameter.emailId.length > 0) {
                updateFields.emailId = args.editEmployeesTaskParameter.emailId;
            }

            if (Object.keys(updateFields).length > 0) {
                await employeesTaskTable.updateOne({ uid: args.editEmployeesTaskParameter.uid }, { $set: updateFields })
            }

            return [args]
        },

        async updateSignUpStatus(parent: undefined, args: { updateSignUpStatusParameter: { uid: String; status: Boolean; }; }) {
            console.log(args);
            const updateStatus = await employeesAccountInfoTable.updateMany({ uid: args.updateSignUpStatusParameter.uid }, { $set: { status: args.updateSignUpStatusParameter.status } })
            return updateStatus
        },

        async updateName(parent: undefined, args: { updateProfileNameParameters: { uid: String, name: String } }) {
            console.log(args)
            if (args.updateProfileNameParameters.name === "") {
                return {
                    updateNameData: null,
                    status: false,
                    message: "Please Enter Name"
                }
            } else {
                await adminSignUpInfoTable.updateMany({ uid: args.updateProfileNameParameters.uid }, { $set: { name: args.updateProfileNameParameters.name } })
                return {
                    updateNameData: {...args.updateProfileNameParameters},
                    status: true,
                    message: "Name Updated"
                }
            }
        },
        async updatePassword(parent: undefined, args: { updateProfilePasswordParameters: { uid: String, password: String } }) {
            console.log(args)
            await adminSignUpInfoTable.updateMany({ uid: args.updateProfilePasswordParameters.uid }, { $set: { password: args.updateProfilePasswordParameters.password } })
            return [args]
        },

        async fetchLoggedInEmployeeAssignedTaskDetails(parent: undefined, args: fetchLoggedInEmployeeAssignedTaskDetailsProps) {
            // console.log(args)
            const fetchLoggedInEmployeeTask = await employeesAccountInfoTable.findOne({ uid: args.fetchLoggedInEmployeeAssignedTaskDetailsParameters.uid })
            // console.log(fetchLoggedInEmployeeTask.emailId)

            const findFetchedLoggedInEmailId = await employeesTaskTable.find({})
            const assignedTasks: fetchLoggedInEmployeeAssignedTaskDetailsParametersType[] = []

            // console.log(findFetchedLoggedInEmailId)

            await findFetchedLoggedInEmailId.map(async (data: fetchLoggedInEmployeeAssignedTaskDetailsParametersType) => {
                console.log(data)
                await data.emailId.map((val: String) => {
                    if (val === fetchLoggedInEmployeeTask.emailId) {
                        console.log(data)
                        assignedTasks.push(data)
                    }
                    // console.log(assignedTasks)
                })
            })
            return assignedTasks
        }

    },


}


module.exports = resolvers