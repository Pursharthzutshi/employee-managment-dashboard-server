import mongoose from "mongoose"
import jwt from 'jsonwebtoken';
import crypto from "crypto"
import { PubSub, PubSubEngine } from "graphql-subscriptions";
import { adminSignUpProps, createEmployeesTaskProps, createUserSignUpProps } from "../resolvers-types/resolvers-type";
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
        async fetchAdminProfileDetails(parent: undefined, args: { fetchAdminProfileDetailsParameters: any }) {
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
                    success: false,
                    message: "Please Fill Up the form"
                }
            } else if (existingEmailId) {
                return {
                    success: false,
                    message: "Email ID already Exists"
                }
            } else {
                employeesAccountInfoTable.insertMany({ ...args.userSignUpParameters })
                return {
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

            const user = await employeesAccountInfoTable.findOne({ emailId: args.userLoginParameters.emailId })

            console.log(user)
            if (!user) {

                return {
                    success: false,
                    message: 'User Email Id does not exists',
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
            console.log(args)
            const admin = await adminSignUpInfoTable.findOne({ emailId: args.adminLoginParameters.emailId })

            console.log(admin)
            if (!admin) {

                return {
                    success: false,
                    message: 'Admin Email Id does not exists',

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
        createEmployeesTask(parent: undefined, args: { employeesTaskParameters: createEmployeesTaskProps; }) {

            const emptyFieldValues = args.employeesTaskParameters.name === "" || args.employeesTaskParameters.emailId === null ||
                args.employeesTaskParameters.taskDesc === "" || args.employeesTaskParameters.deadLine === ""

            if (emptyFieldValues) {
                return {
                    success: false,
                    message: 'Please Fill Up the task details',
                }
            } else if (args.employeesTaskParameters.taskDesc.length < 10 || args.employeesTaskParameters.taskDesc.length > 50) {
                return {
                    success: false,
                    message: 'Task description should be between 10 to 50 word',
                }
            } else {
                employeesTaskTable.insertMany({ ...args.employeesTaskParameters })
                return {
                    success: true,
                    message: 'Task Added Successfully',

                }
            }

        },


        async deleteEmployeesTask(parent: undefined, args: { employeeUidParameter: { uid: String; }; }) {
            await employeesTaskTable.deleteOne({ uid: args.employeeUidParameter.uid })
            return [args]
        },
        async editEmployeesTask(parent: undefined, args: { editEmployeesTaskParameter: any }) {

            const checkEmptyFields = args.editEmployeesTaskParameter.name !== "" && args.editEmployeesTaskParameter.taskDesc !== "" && args.editEmployeesTaskParameter.deadLine !== ""

            await employeesTaskTable.updateOne({ uid: args.editEmployeesTaskParameter.uid }, { $set: { ...args.editEmployeesTaskParameter } })

            return [args]
        },

        async updateSignUpStatus(parent: undefined, args: { updateSignUpStatusParameter: { uid: String; status: Boolean; }; }) {
            console.log(args);
            const updateStatus = await employeesAccountInfoTable.updateMany({ uid: args.updateSignUpStatusParameter.uid }, { $set: { status: args.updateSignUpStatusParameter.status } })
            return updateStatus
        },

        async updateName(parent: undefined, args: { updateProfileNameParameters: { uid: String, name: String } }) {
            await adminSignUpInfoTable.updateMany({ uid: args.updateProfileNameParameters.uid }, { $set: { name: args.updateProfileNameParameters.name } })
            return [args]
        },
        async updatePassword(parent: undefined, args: { updateProfilePasswordParameters: { uid: String, password: String } }) {
            await adminSignUpInfoTable.updateMany({ uid: args.updateProfilePasswordParameters.uid }, { $set: { password: args.updateProfilePasswordParameters.password } })
            return [args]
        }

    },

}


module.exports = resolvers