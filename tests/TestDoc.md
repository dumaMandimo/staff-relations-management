# Staff Relations Management App - Tests

The purpose of this document is to outline the testing strategy, test cases, and results for the Staff Relations Management App.

## Testing Strategy:

- **Tools and Frameworks:**
  Coveralls is used as the tool to retrieve code coverage percentages. Its documentation is easier to navigate, and the setup is fairly simple, which is why we chose it as our code coverage tool.
  Jest is used as the testing framework. We chose Jest because it is a JavaScript testing framework. It runs all tests in parallel, making it quite fast. No configuration is required to run Jest on standard JavaScript code.

- **Types of Testing Utilized:**
  - Unit Testing

- **Important things to note:**
  Mock Functions are used in Jest when the code being tested includes database functionality. They allowed us to isolate the units of code being tested and focus solely on the behavior of the code. Mocking the database interactions helped in eliminating external dependencies, making testing easier.

### Test Cases:

1. **Fetch Feedback:**
   - **Objective:** Fetch and display employees who have not sent feedback.
   - **Expected Outcome:** Employees who have not sent feedback displayed in a table.
   - **Status:** Pass

2. **Timesheets:**
   - **2.1 Display Alert Message:**
     - **Objective:** Notify employees if timesheet has been submitted successfully.
     - **Expected Outcome:** Display an alert message if timesheet has been submitted successfully.
     - **Status:** Pass
   - **2.2 Calculate Duration of Tasks:**
     - **Objective:** Calculate how long employees spend on a task.
     - **Expected Outcome:** How much time an employee has spent on a task.
     - **Status:** Pass
   - **2.3 Add Task:**
     - **Objective:** Add a new task and display success alert.
     - **Expected Outcome:** Display success alert if a new task is added. Task will be displayed in the timesheet table.
     - **Status:** Pass
   - **2.4 Delete Tasks:**
     - **Objective:** Remove tasks when a user presses delete.
     - **Expected Outcome:** Tasks will be removed from timesheet.
     - **Status:** Pass
   - **2.5 Download Timesheet:**
     - **Objective:** User can download their timesheet in a CSV format.
     - **Expected Outcome:** Timesheet downloads in a CSV format.
     - **Status:** Pass

3. **Notifications:**
   - **3.1 Check meal bookings:**
     - **Objective:** Check if user has a meal booking.
     - **Expected Outcome:** Display booked meals and car wash.
     - **Status:** Pass
   - **3.2 Check carwash bookings:**
     - **Objective:** Check if user has a carwash booking.
     - **Expected Outcome:** Display booked meals and car wash.
     - **Status:** Pass
   - **3.3 Display Notifications:**
     - **Objective:** Display employees' bookings.
     - **Expected Outcome:** Employee bookings for the carwash and meal booking are displayed.
     - **Status:** Pass

4. **Create Meals:**
   - **4.1 Add Meals to the database:**
     - **Objective:** Admin adds meals to the database.
     - **Expected Outcome:** Added meals are displayed on the page.
     - **Status:** Fail
   - **4.2 Edit Meals:**
     - **Objective:** Admin can edit a meal.
     - **Expected Outcome:** An alert pops up on the screen. Admin can edit meal from the GUI popup.
     - **Status:** Fail
   - **4.3 Delete Meals:**
     - **Objective:** Admin deletes meals.
     - **Expected Outcome:** Updated table with deleted meal is displayed.
     - **Status:** Fail

5. **Book Meal:**
   - **5.1 User books a meal:**
     - **Objective:** Booked meals are added to the database.
     - **Expected Outcome:** Booked meals are displayed in a table at the bottom of the page.
     - **Status:** Fail
   - **5.2 Cancel Meal:**
     - **Objective:** Admin can edit a meal.
     - **Expected Outcome:** An alert pops up on the screen. Admin can edit meal from the GUI popup.
     - **Status:** Fail
   - **5.3 Delete Meals:**
     - **Objective:** Admin deletes meals.
     - **Expected Outcome:** Updated table is displayed.
     - **Status:** Fail

6. **Book Carwash:**
   - **6.1 User books a carwash and limit is checked:**
     - **Objective:** Add a new booking to the database if a user has not reached their limit for the week.
     - **Expected Outcome:** Display carwash booking in a table, if a user has surpassed their limit they will not be able to book a carwash.
     - **Status:** Fail
   - **6.2 Add carwash booking:**
     - **Objective:** Carwash booking is added to the database.
     - **Expected Outcome:** Updated table is displayed.
     - **Status:** Fail

7. **View Bookings:**
   - **7.1 Carwash bookings:**
     - **Objective:** The admin can view all of the carwash bookings.
     - **Expected Outcome:** A table of the carwash bookings is displayed.
     - **Status:** Fail
   - **7.2 Meal Bookings:**
     - **Objective:** Admin can view all of the employees' meal bookings.
     - **Expected Outcome:** A table view of the meal bookings is displayed on the page.
     - **Status:** Fail

![Coveralls Percentage](https://github.com/dumaMandimo/staff-relations-management/assets/166363285/9142cfc8-de3b-4a41-bf5e-4608d9c9550c/codecov.png)
