export type createUserSignUpProps = {
    uid: String
    name: String
    emailId: String
    password: String
    genderType: String
    status: Boolean
    department: String
    employeeOfTheMonth: Boolean
}


export type createEmployeesTaskProps = {
    uid: String
    name: String
    emailId: [String]
    taskDesc: String
    deadLine: String
}

export type adminSignUpProps = {
    uid: String
    name: String
    emailId: String
    password: String
    status: Boolean
    adminSecretKey: String
}


export type fetchLoggedInEmployeeAssignedTaskDetailsProps={
    fetchLoggedInEmployeeAssignedTaskDetailsParameters: any
    uid: String
    emailId: String
}
