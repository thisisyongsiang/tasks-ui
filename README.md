# tasks-ui
Task management app frontend.
# QuickStart
`npm install` to install the depencies

create .env file in root directory.

It will basically need to contain the following variables
```
VITE_API_URL // the address of the api server
```

To start the frontend

`npm run dev` 
## Demo


https://github.com/user-attachments/assets/6c2cfaf5-c1e1-469a-9513-8ad5e131d863


## State of the frontend
- Uses styled components and radix ui for the general styling strategy
- Use react query for http query state management
- Use basic Fetch API for the query itself
- Undo functionality is powered by the frontend's state management, using Context API
- Ideally if this app were to be more scalable, a more global state management such as Redux is better, but for the state at which it is, using Context API for the undo state management should be more than sufficient
- To block out users from scheduling due dates on public holidays, I leveraged a free API source to fetch public holidays for Singapore specifically. Ideally we should have a field where we know the user's country code and disable selecting the dates for the users country's public holidays
- The API for fetching public holidays is https://date.nager.at/Api
## Thoughts

- It is an app for individuals as part of an organization to track their task
- Everyone can create a task, and edit it but not everyone can delete a task
- Only admins can delete a task
- Undo functionality to work only within a single session. i.e user is unable to undo their actions if it occurred in a different tab or a previous working session
    - Undo functionality for normal users only will undo updating actions as normal users are not allowed to delete and undoing a create function would result in a delete
    - This may lead to potential issue if user is editing on multiple tabs.
    - If any non session changes detected, it is simpler to reset the undo stack to empty
    - Undo is managed entirely on the frontend using react's inbuilt state management
- User login and signup is implemented here, however ideally we would want to use a 3rd party auth provider like Auth0 for added layer of security and possibility of enabling SSO which could enable integration with Google calender which could prove useful
- Roles are set as USER and ADMIN
## TODOs
- Role assignment is not available on the frontend
    - Currently to be an admin, one needs to change the role manually in the mongoDB
- Scaffolding of sharing tasks across users exists in the backend but only as Models in the mongoDB schema
- To enable sharing of tasks we will probably need to have another endpoint to fetch Users, and we will need to redefine the User Model to include an OrgId, which would probably need some rethink in the signup process
- Fetching from mongo will also need to be updated to fetch for tasks that are sharedWith the user
- Undo functionality may be better to be in the Backend if persistence is required, however current solution should be sufficient if simple session persistence is required
- Sanitizing of all text input must be done to prevent XSS attacks, especially since the input UI allows for users to freely format their task title and description, which would be extremely susceptible to injection of malicious code
- Sorting on the frontend is yet to be achieved. But the endpoint currently allows for sorting via createdAt date, dueDate and priority

## Tests
Currently tests are not implemented. Here is a planned testing strategy
### E2E tests
Use Cypress for this.
### Mocks
The test will need to run with the local development server spinning as there is no other server at the moment.
No need for mocks in this case
### Things to note
- When testing, we must always start from the route of signing up, then login with the same credentials.
- To prevent the DB from bloating because of tests, we should always delete all the created tasks.
- Unfortunately theres no endpoint to delete users at the moment, otherwise it would be ideal to delete all the created users from the tests as well.
