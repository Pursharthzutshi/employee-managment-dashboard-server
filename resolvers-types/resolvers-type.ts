export type createUserSignUpProps = {
    uid: string
    name: string
    emailId: string
    password: string
    genderType: string
    status: boolean
    department: string
    employeeOfTheMonth: boolean
    reTypePassword: string
}


export type createEmployeesTaskProps = {
    uid: string
    name: string
    emailId: [string]
    taskDesc: string
    deadLine: string
}

export type adminSignUpProps = {
    uid: string
    name: string
    emailId: string
    password: string
    status: boolean
    adminSecretKey: string
}

export type fetchLoggedInEmployeeAssignedTaskDetailsParametersType = {

    uid: string
    name: string
    emailId: string[]
    taskDesc: string
    deadline: string
}


export type fetchLoggedInEmployeeAssignedTaskDetailsProps = {
    fetchLoggedInEmployeeAssignedTaskDetailsParameters: fetchLoggedInEmployeeAssignedTaskDetailsParametersType
    uid: string
    emailId: string
}


export type updateTaskFieldsProps = {
    uid?: string
    name?: string
    taskDesc?: string | any
    deadLine?: string
    emailId?: string[]
}

export type FetchAdminProfileDetailsParametersProps = {
    uid: string;
}


export type findFetchedLoggedInEmailIdProps = {
    emailId: string
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
    uid: string
}

export type updateEmployeeLeaveStatusProps = {
    updateEmployeeLeaveStatusParameters: updateEmployeeLeaveStatusParametersType
}

export type updateEmployeeLeaveStatusParametersType = {
    updateEmployeeLeaveStatusParameters: updateEmployeeLeaveStatusProps
    uid: string
    employeeLeaveApplicationUid: string
    leaveStatus: boolean
    leaveApprovedButtonsStatus: boolean

}

export type showAllChatsTypes = {
    senderId: string
    receiverId: string
    uid: string;
}

export type sendMessageType = {
    uid: string;
    senderId: string
    receiverId: string
    message: string
}

export type sendMessageTypeIndicatorType = {
    isTyping: boolean[]
    senderId: string
    receiverId: string
}


export type showSenderReceiverChatType = {
    senderId: string
    receiverId: string
}
// const checkEmptyFields = args.insertEmployeesLeaveDetailsParameters.date === "" || args.insertEmployeesLeaveDetailsParameters.leaveReason === "" ||
// args.insertEmployeesLeaveDetailsParameters.leaveStatus === ""
