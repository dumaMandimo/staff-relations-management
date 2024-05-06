// Function to add a new meal to the second table
function addMealToNewTable(mealData) {
    var newTable = document.getElementById('newMealsBody');
    var newRow = newTable.insertRow(-1); // Insert row into new table

    // Loop through the meal data and populate the new row
    for (var i = 0; i < mealData.length; i++) {
        var newCell = newRow.insertCell(i);
        newCell.textContent = mealData[i];
    }

    // Add "Complete" status
    var statusCell = newRow.insertCell(mealData.length);
    statusCell.textContent = 'Complete';
    
}

// Add event listener to add button
document.getElementById('addBtn').addEventListener('click', function() {
    var table = document.getElementById('mealsTable').getElementsByTagName('tbody')[0];
    var mealData = [];

    // Loop through the cells of the last row in the first table and extract data
    for (var i = 0; i < table.rows[table.rows.length - 1].cells.length - 1; i++) {
        var selectedOption = table.rows[table.rows.length - 1].cells[i].querySelector('select').value;
        mealData.push(selectedOption);
    }

    // Add meal to new table
    addMealToNewTable(mealData);

    // Alert user
    alert('Meal added successfully!');

    // Disable dropdowns
    if (table.rows.length > 2) {
        var prevRowId = 'mealRow' + (table.rows.length - 2);
        disableDropdowns(prevRowId);
    }

    // Save meal data to localStorage
    saveMealsToLocalStorage();
});

// Function to disable dropdowns
function disableDropdowns(rowId) {
    var row = document.getElementById(rowId);
    var selects = row.getElementsByTagName('select');
    for (var i = 0; i < selects.length; i++) {
        selects[i].disabled = true;
    }
}

// Add any existing meals from the new table on page load
document.addEventListener('DOMContentLoaded', function() {
    loadMealsFromLocalStorage();
});

// Function to save meal data to localStorage
function saveMealsToLocalStorage() {
    var table = document.getElementById('newMealsBody');
    var meals = [];

    for (var i = 0; i < table.rows.length; i++) {
        var meal = [];
        for (var j = 0; j < table.rows[i].cells.length - 2; j++) {
            meal.push(table.rows[i].cells[j].textContent);
        }
        meals.push(meal);
    }

    localStorage.setItem('meals', JSON.stringify(meals));
}

// Function to load meal data from localStorage
function loadMealsFromLocalStorage() {
    var storedMeals = localStorage.getItem('meals');
    if (storedMeals) {
        var meals = JSON.parse(storedMeals);
        meals.forEach(function(meal) {
            addMealToNewTable(meal);
        });
    }
}
