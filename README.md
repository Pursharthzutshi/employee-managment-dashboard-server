
![Untitled-2024-06-07-1111](https://github.com/Pursharthzutshi/employee-managment-dashboard-client/assets/24863656/99b531df-74df-44c8-8082-e3f642bdbaad)


https://github.com/Pursharthzutshi/employee-managment-dashboard-client/assets/24863656/10eb4039-a02b-40ce-b7ab-8eab31d05160


# ADMIN EMPLOYEE MANAGMENT DASHBOARD 

In this project I have used react typescript, redux toolkit and apollo client & graphql queries like useQuery, useMutation etc. In this Project I have also used  graphql mutations like add, update, delete, fetch etc & apollo server.

I have define the typeDefs and resolvers in graphql. I have also setup the mongodb database where all my dynamic data such as employee account details, employees task info details, admin Sign up info detials are stored 

# Left Sidebar -:

It displays four component links so the admin can navigate to the desired component. I have also added a logout button so the admin can easily log out from the dashboard.

# Add Employees Component -:

In this component the admin can create a new employee account. It is a form where the admin can fill up employee details. Here 2 most important fields are the gender type and department. So whenever a new account is created the charts data of bar chart & pie chart in Home Component is updated automatically.

# Show All Employees Component-:

In this component details of all employees are shown in the boxes . In this I have also added search filter to filter out employees. Here a button is also added where the admin can set any employee as employee of the month .

# Home Component -:

In this component data of organization is shown with the help of chart js. I have used charts like bar and pie chart and data is coming from database whenever a new employee account is added. 

The data shown is dynamic and updates automatically whenever there is any change, such as when a new employee is added. This component also includes information cards that display organization data like the total number of employees, total departments, etc.

Here there is another box which show employee of the month which can be assigned by admin 
in show All Employees Component.

# Task Component -:

In this component the admin can create a new task, assign task to the employee and can also edit and delete tasks. Here while adding I have added a select dropdown where the admin can write name of the employee and can assign task to more than one employee. and new employee will be shown in the page.


