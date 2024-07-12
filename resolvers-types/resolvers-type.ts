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

export type fetchLoggedInEmployeeAssignedTaskDetailsParametersType = {
    
    uid:string
    name:string
    emailId:string[]
    taskDesc:string
    deadline:string
}


export type fetchLoggedInEmployeeAssignedTaskDetailsProps = {
    fetchLoggedInEmployeeAssignedTaskDetailsParameters: fetchLoggedInEmployeeAssignedTaskDetailsParametersType
    uid: string
    emailId: string
}


export type updateTaskFieldsProps = {
    uid?:string
    name?: string 
    taskDesc?: string | any
    deadLine?: string
    emailId?: string[]
}

export type  FetchAdminProfileDetailsParametersProps = {
    uid: string; 
}


export type findFetchedLoggedInEmailIdProps = {
    emailId:String
}


export type insertEmployeesLeaveDetailsParametersProps = {
    date: string
    leaveReason: string
    leaveStatus: string
    uid: string
}


export type insertEmployeesLeaveDetailsProps = {
    insertEmployeesLeaveDetailsParameters: insertEmployeesLeaveDetailsParametersProps
}

export type showLoggedInEmployeesLeaveDetailsDataParametersProps = {
    uid:string
}

export type updateEmployeeLeaveStatusProps = {
    updateEmployeeLeaveStatusParameters:updateEmployeeLeaveStatusParametersType
}

export type updateEmployeeLeaveStatusParametersType={
    updateEmployeeLeaveStatusParameters:updateEmployeeLeaveStatusProps
    uid:string
    employeeLeaveApplicationUid:string
    leaveStatus:boolean
    leaveApprovedButtonsStatus:boolean

}


// const checkEmptyFields = args.insertEmployeesLeaveDetailsParameters.date === "" || args.insertEmployeesLeaveDetailsParameters.leaveReason === "" ||
// args.insertEmployeesLeaveDetailsParameters.leaveStatus === ""
