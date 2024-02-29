# Project Documentation: Appointment Booking System
## Introduction
The Appointment Booking System is a comprehensive web application designed to facilitate the efficient scheduling of appointments with medical professionals. This documentation provides detailed information about the system's functionalities, dependencies, and setup instructions.

## Features
### For Patients:
#### Registration and Login: 
Patients can create an account and log in to access the system.

#### Selection of Doctors: 
Patnts can choose a doctor from a list of available physicians, with the option to filter doctors by specialization for convenience.

#### Doctor Filtering: 
Ability for patients to filter doctors by specialization for easier selection.

#### Appointment Booking:
Patients can schedule appointments with their chosen doctor.

#### User Account:
Patients have a user account where they can update their personal information, logout, and delete their account if desired.

#### Appointment Management:
Patients can view a list of their appointments with the status of each session, whether it's pending or confirmed.

#### Session Details:
Patients can view detailed information about each appointment session, including the doctor's details and session specifics.

#### Session Reminders:
Patients receive email reminders one day before their scheduled appointment, sent at 12:00 AM.


### For Administrators:
#### Registration and Login: 
Administrators can register for an account and log in to the system.

#### Administrator Account:
Administrators have an account with personal information that they can update, as patients.

#### Doctor Management: 
Administrators have the authority to create, delete, and modify doctor profiles within the system.

### For Doctors:
#### Login:
Doctors can log in to the system.

#### Doctor Account:
Doctors have an account with information about themselves.

#### Session Confirmation: 
Doctors can confirm appointments scheduled with them.

### General Features:
#### Chat Functionality: 
All users, including patients, administrators, and doctors, can engage in chat discussions within the system. This feature fosters communication and collaboration among users, facilitating seamless interaction and information exchange related to appointments, medical queries, and administrative matters.

## Dependencies
The Appointment Booking System utilizes the following dependencies to provide its functionality:

`axios: `A promise-based HTTP client for making HTTP requests from the Node.js environment - addeed to coomunicate with the server on Django

`bcrypt:` A library for hashing passwords securely - hashing passwords before adding them into database

`body-parser`: Middleware for parsing incoming request bodies in a Node.js server.

`cookie-parser: `Middleware for parsing cookie headers in a Node.js server.

`cors:` Middleware for enabling Cross-Origin Resource Sharing (CORS) in a Node.js server.

`dotenv:` A module for loading environment variables from a .env file into process.env.

`express:` A web application framework for Node.js.

`express-session: `Middleware for managing user sessions in Express.js.

`method-override:` Middleware for overriding HTTP methods in forms in Express.js. - had some experiments with this one to override POST method to PATCH

`mongoose:` An Object Data Modeling (ODM) library for MongoDB and Node.js, providing a schema-based solution to model application data.

`node-cache:` A caching library for Node.js.

`node-cron:` A module for scheduling cron jobs in Node.js.

`nodemailer-mailgun-transport:` A transport plugin for Nodemailer that sends emails using the Mailgun API. - used for sending letters to patients

`pug:` A template engine for Node.js and browsers, also known as Jade.

`socket.io:` A library for real-time bidirectional event-based communication between web clients and servers.

## Setup Instructions
Follow these steps to set up the Appointment Booking System:
#### Clone the Repository:
```bash
git clone https://github.com/kshashkina/webdev_project
```
#### Install Dependencies:
```bash
cd webdev_project
npm install
```
#### Set Up Environment Variables:
Create a .env file in the root directory.
Define environment variables such as database connection details, API keys, etc.
#### Start the Server:
```bash
npm start-both

```
#### Access the Application:
Open a web browser and navigate to http://localhost:3000 

## Contributing
We welcome contributions from the community to improve the Appointment Booking System. Whether you want to fix a bug, add a new feature, or improve documentation, your contributions are valuable in making the system better for everyone.

#### Getting Started
1. Fork the Repository: Start by forking the Appointment Booking System repository to your GitHub account.

3. Clone the Repository: Clone the forked repository to your local machine using the following command:

5. Set Up Environment: Follow the setup instructions provided in the project's README to set up the development environment.

7. Create a Branch: Create a new branch for your contribution

9. Make Changes: Make your desired changes to the codebase.

11. Commit Changes: Commit your changes with a descriptive commit message

13. Push Changes: Push your changes to your forked repository

15. Submit Pull Request: Go to the GitHub page of your forked repository and submit a pull request to the main repository. Provide a clear description of your changes in the pull request.

### Code Guidelines
- Follow the existing code style and conventions.
- Write clear and concise commit messages.
- Ensure your code is well-tested and doesn't introduce any regressions.
- Keep your pull requests focused on addressing a single issue or adding a specific feature.

### Help and Support
If you need any assistance or have questions about contributing to the project, feel free to reach out to the project maintainers or community members through GitHub issues or discussions.

Thank you for considering contributing to the Appointment Booking System! We appreciate your support in making the project better for everyone.
