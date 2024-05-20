"use strict";

var _firebaseApp = require("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
var _firebaseDatabase = require("https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js");
// Firebase configuration

var firebaseConfig = {
  apiKey: "AIzaSyCvnZkbqON0vsIackr90txDbg-oYj_ikJ0",
  authDomain: "staff-relations-databases.firebaseapp.com",
  databaseURL: "https://staff-relations-databases-default-rtdb.firebaseio.com",
  projectId: "staff-relations-databases",
  storageBucket: "staff-relations-databases.appspot.com",
  messagingSenderId: "356187917991",
  appId: "1:356187917991:web:e2cd5bd697464c873a9582",
  measurementId: "G-42THPFZ5QD"
};

// Initialize Firebase
var app = (0, _firebaseApp.initializeApp)(firebaseConfig);
var db = (0, _firebaseDatabase.getDatabase)(app);
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('mealForm').addEventListener('submit', addMeal);
  fetchMeals();
});

// Function to add a meal
function addMeal(e) {
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
  var mealsRef = (0, _firebaseDatabase.ref)(db, 'meals');
  (0, _firebaseDatabase.push)(mealsRef, mealData).then(function () {
    fetchMeals();
    document.getElementById('mealForm').reset();
  })["catch"](function (error) {
    console.error('Error adding meal:', error);
  });
}

// Function to fetch meals from Firebase and display them in the table
function fetchMeals() {
  var mealsRef = (0, _firebaseDatabase.ref)(db, 'meals');
  (0, _firebaseDatabase.onValue)(mealsRef, function (snapshot) {
    var meals = snapshot.val();
    var tableBody = document.querySelector('#mealsTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows
    for (var key in meals) {
      if (meals.hasOwnProperty(key)) {
        var meal = meals[key];
        var row = tableBody.insertRow();
        row.innerHTML = "\n                    <td>".concat(meal.mealType, "</td>\n                    <td>").concat(meal.protein, "</td>\n                    <td>").concat(meal.starch, "</td>\n                    <td>").concat(meal.fruit, "</td>\n                    <td>").concat(meal.drink, "</td>\n                    <td>").concat(meal.snack, "</td>\n                    <td>").concat(meal.confirmation, "</td>\n                    <td>\n                        <button class=\"editBtn\" onclick=\"window.editMeal('").concat(key, "')\">Edit</button>\n                        <button class=\"deleteBtn\" onclick=\"window.deleteMeal('").concat(key, "')\">Delete</button>\n                    </td>\n                ");
      }
    }
  });
}

// Function to edit a meal
window.editMeal = function (key) {
  var mealRef = (0, _firebaseDatabase.ref)(db, "meals/".concat(key));
  (0, _firebaseDatabase.onValue)(mealRef, function (snapshot) {
    var mealData = snapshot.val();
    var mealType = prompt('Enter Meal Type:', mealData.mealType);
    var protein = prompt('Enter Protein:', mealData.protein);
    var starch = prompt('Enter Starch:', mealData.starch);
    var fruit = prompt('Enter Fruit:', mealData.fruit);
    var drink = prompt('Enter Drink:', mealData.drink);
    var snack = prompt('Enter Snack:', mealData.snack);
    var confirmation = prompt('Enter Confirmation:', mealData.confirmation);
    if (mealType && protein && starch && fruit && drink && snack) {
      (0, _firebaseDatabase.update)(mealRef, {
        mealType: mealType,
        protein: protein,
        starch: starch,
        fruit: fruit,
        drink: drink,
        snack: snack,
        confirmation: confirmation
      }).then(function () {
        fetchMeals();
      })["catch"](function (error) {
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
  var confirmDelete = confirm('Are you sure you want to delete this meal?');
  if (confirmDelete) {
    var mealRef = (0, _firebaseDatabase.ref)(db, "meals/".concat(key));
    (0, _firebaseDatabase.remove)(mealRef).then(function () {
      fetchMeals();
    })["catch"](function (error) {
      console.error('Error deleting meal:', error);
      alert('An error occurred while deleting the meal.');
    });
  }
};

// Fetch meals on page load
fetchMeals();
