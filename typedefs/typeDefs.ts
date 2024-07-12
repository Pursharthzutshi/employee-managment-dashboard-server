import { gql } from "apollo-server";

const typeDefs = gql`
type signUpTable {
uid:ID!
name:String
emailId:String
password:String
genderType:String
status:Boolean
department:String
employeeOfTheMonth:Boolean
}

type adminSignUpTable {
uid:ID!
name:String
emailId:String
password:String
status:Boolean
adminSecretKey:String
}

type employeesTaskTable{
uid:ID!
name:String
emailId:[String]
taskDesc:String
deadLine:String
}


type employeeLeaveInfoTable{
uid:ID!
date: String
employeeName:String
leaveReason: String
employeeLeaveApplicationUid:ID!
leaveApprovedButtonsStatus:Boolean
leaveStatus:Boolean
}

input updateEmployeeLeaveStatusInput{
uid:ID!
employeeLeaveApplicationUid:ID!
leaveApprovedButtonsStatus:Boolean
leaveStatus:Boolean
}
  
type insertEmployeesLeaveDetailsResponse {
employeeLeaveData:[employeeLeaveInfoTable]
success:Boolean
message:String
}

input insertEmployeesLeaveDetailsInput{
uid:ID!
date: String
leaveReason: String
employeeLeaveApplicationUid:ID!
leaveApprovedButtonsStatus:Boolean
leaveStatus:Boolean
}



input createUserSignUpInput{
uid:ID!
name:String
emailId:String
password:String
genderType:String
status:Boolean
department:String
employeeOfTheMonth:Boolean

}

input adminSignUpTableInput{
uid:ID!
name:String
emailId:String
password:String
status:Boolean
adminSecretKey:String
}

input createLoginInput{
emailId:String
password:String
}

input createAdminLoginInput{
emailId:String
password:String
}

input createEmployeesTaskInput{
uid:ID!
name:String
emailId:[String]
taskDesc:String
deadLine:String
}

type LoginResponse{
 uid:ID
 name:String
 success: Boolean!
 message: String!
 token:String
}


type adminSignUpResponse{
 success: Boolean!
 message: String
}

type AdminLoginResponse{
 uid:ID
 name:String
 success: Boolean!
 message: String!
  token:String
  admin:Boolean

}


input fetchAdminProfileDetailsInput{
uid:ID
}

input showLoggedInEmployeesLeaveDetailsDataInput{
uid:ID!
}

type Query{
getUser:[signUpTable]
fetchEmailUsersIds:[signUpTable]
fetchEmployeesTaskDetails:[employeesTaskTable]
showAllEmployee:[signUpTable]
showAllAdmin:[adminSignUpTable]
fetchAdminProfileDetails(fetchAdminProfileDetailsParameters:fetchAdminProfileDetailsInput!):[adminSignUpTable]
fetchEmployeesLeaveDetails:[employeeLeaveInfoTable]
showLoggedInEmployeesLeaveDetailsData(showLoggedInEmployeesLeaveDetailsDataParameters:showLoggedInEmployeesLeaveDetailsDataInput!):[employeeLeaveInfoTable]
}



input deleteEmployeesTaskInput{
uid:ID!
}

input editEmployeesTaskInput{
uid:ID!
name:String
emailId:[String]
taskDesc:String
deadLine:String
}



input updateSignUpStatusInput{
uid:ID!
status:Boolean
}
    
input updateEmployeeOfTheMonthInput{
uid:ID!
employeeOfTheMonth:Boolean!
}

input fetchLoggedInEmployeeAssignedTaskDetailsInput{
uid:ID!
emailId:String
}



input updateProfileNameInput{
uid:ID!
name:String
}

input updateProfilePasswordInput{
uid:ID!
password:String
}

input deleteEmployeeAccountInput{
uid:ID!
}

type SignUpResponse{
AddedSignUpData:signUpTable
success: Boolean!
message: String
}

type addEmployeeTaskResponse {
addNewTaskData:employeesTaskTable
success: Boolean!
message: String
}

type deleletEmployeeAccountResponse{
uid:ID!
status:Boolean
}

type updateNameResponse{
updateNameData:signUpTable
status:Boolean
message:String
}

type updateEmployeeLeaveStatusResponse{
updatedEmployeeLeaveStatusData:[employeeLeaveInfoTable]
success:Boolean
message:String
}

type Mutation{
updateEmployeeOfTheMonth(updateEmployeeOfTheMonthParameters:updateEmployeeOfTheMonthInput!):[signUpTable]
deleteEmployeeAccount(deleteEmployeeAccountParameters:deleteEmployeeAccountInput!):deleletEmployeeAccountResponse!

createUserSignUp(userSignUpParameters:createUserSignUpInput!):SignUpResponse!

createAdminSignUp(adminSignUpParameters:adminSignUpTableInput!):adminSignUpResponse!

createUserLogin(userLoginParameters:createLoginInput!):LoginResponse!
createAdminLogin(adminLoginParameters:createAdminLoginInput!):AdminLoginResponse!

createEmployeesTask(employeesTaskParameters:createEmployeesTaskInput!):addEmployeeTaskResponse!

deleteEmployeesTask(employeeUidParameter:deleteEmployeesTaskInput!):[employeesTaskTable]
editEmployeesTask(editEmployeesTaskParameter:editEmployeesTaskInput!):[employeesTaskTable]
updateSignUpStatus(updateSignUpStatusParameter:updateSignUpStatusInput!):[signUpTable]

updateName(updateProfileNameParameters:updateProfileNameInput!):updateNameResponse!
updatePassword(updateProfilePasswordParameters:updateProfilePasswordInput!):[signUpTable]

fetchLoggedInEmployeeAssignedTaskDetails(fetchLoggedInEmployeeAssignedTaskDetailsParameters:fetchLoggedInEmployeeAssignedTaskDetailsInput!):[employeesTaskTable]

insertEmployeesLeaveDetails(insertEmployeesLeaveDetailsParameters:insertEmployeesLeaveDetailsInput!):insertEmployeesLeaveDetailsResponse!

updateEmployeeLeaveStatus(updateEmployeeLeaveStatusParameters:updateEmployeeLeaveStatusInput!):updateEmployeeLeaveStatusResponse!

}
`

module.exports = typeDefs