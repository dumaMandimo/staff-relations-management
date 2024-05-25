"use strict";

const firebaseMock = {
  initializeApp: jest.fn(),
  getDatabase: jest.fn(() => ({
    ref: jest.fn(() => ({
      onValue: jest.fn(),
      set: jest.fn(),
      push: jest.fn((data) => {
        return {
          then: (callback) => {
            callback(); // Invoke the callback immediately
            return Promise.resolve(); // Return a resolved Promise
          }
        };
      }),
      update: jest.fn(),
      remove: jest.fn()
    })),
    onValue: jest.fn(),
    set: jest.fn(),
    push: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  }))
};

// Initialize Firebase
var app = firebaseMock.initializeApp();
var db = firebaseMock.getDatabase(app);
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('mealForm').addEventListener('submit', (e) => addMeal(e, db, document, fetchMeals));
  fetchMeals(db, document);
});

// Function to add a meal
function addMeal(e, db, document, fetchMeals) {
  e.preventDefault();
  var mealType = document.getElementById('mealType').value;
  var protein = document.getElementById('protein').value;
  var starch = document.getElementById('starch').value;
  var fruit = document.getElementById('fruit').value;
  var drink = document.getElementById('drink').value;
  var snack = document.getElementById('snack').value;
  var mealData = {
    mealType: mealType,
    protein: protein,
    starch: starch,
    fruit: fruit,
    drink: drink,
    snack: snack,
    confirmation: 'Meal Added!'
  };
  var mealsRef = db.ref('meals');
  mealsRef.push(mealData).then(function () {
    fetchMeals(db, document);
    document.getElementById('mealForm').reset();
  }).catch(function (error) {
    console.error('Error adding meal:', error);
  });
}

// Function to fetch meals from Firebase and display them in the table
function fetchMeals(db, document) {
  var mealsRef = db.ref('meals');
  db.onValue(mealsRef, function (snapshot) {
    var meals = snapshot.val();
    var tableBody = document.querySelector('#mealsTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows
    for (var key in meals) {
      if (meals.hasOwnProperty(key)) {
        var meal = meals[key];
        var row = tableBody.insertRow();
        row.innerHTML = `
                    <td>${meal.mealType}</td>
                    <td>${meal.protein}</td>
                    <td>${meal.starch}</td>
                    <td>${meal.fruit}</td>
                    <td>${meal.drink}</td>
                    <td>${meal.snack}</td>
                    <td>${meal.confirmation}</td>
                    <td>
                        <button class="editBtn" onclick="window.editMeal('${key}')">Edit</button>
                        <button class="deleteBtn" onclick="window.deleteMeal('${key}')">Delete</button>
                    </td>
                `;
      }
    }
  });
}

// Function to edit a meal
window.editMeal = function (key) {
  editMeal(key, db, document, fetchMeals);
};

function editMeal(key, db, document, fetchMeals) {
  var mealRef = db.ref(`meals/${key}`);
  db.onValue(mealRef, function (snapshot) {
    var mealData = snapshot.val();
    var mealType = prompt('Enter Meal Type:', mealData.mealType);
    var protein = prompt('Enter Protein:', mealData.protein);
    var starch = prompt('Enter Starch:', mealData.starch);
    var fruit = prompt('Enter Fruit:', mealData.fruit);
    var drink = prompt('Enter Drink:', mealData.drink);
    var snack = prompt('Enter Snack:', mealData.snack);
    var confirmation = prompt('Enter Confirmation:', mealData.confirmation);
    if (mealType && protein && starch && fruit && drink && snack) {
      db.update(mealRef, {
        mealType: mealType,
        protein: protein,
        starch: starch,
        fruit: fruit,
        drink: drink,
        snack: snack,
        confirmation: confirmation
      }).then(function () {
        fetchMeals(db, document);
      }).catch(function (error) {
        console.error('Error updating meal:', error);
        alert('An error occurred, please try again later.');
      });
    } else {
      alert('All fields are required.');
    }
  }, {
    onlyOnce: true
  });
};

// Function to delete a meal
window.deleteMeal = function (key) {
  deleteMeal(key, db, document, fetchMeals);
};

function deleteMeal(key, db, document, fetchMeals) {
  var confirmDelete = confirm('Are you sure you want to delete this meal?');
  if (confirmDelete) {
    var mealRef = db.ref(`meals/${key}`);
    db.remove(mealRef).then(function () {
      fetchMeals(db, document);
    }).catch(function (error) {
      console.error('Error deleting meal:', error);
      alert('An error occurred while deleting the meal.');
    });
  }
}

module.exports = {
  addMeal,
  editMeal,
  deleteMeal,
  fetchMeals,
  firebaseMock // Exporting the mock for testing purposes
};
