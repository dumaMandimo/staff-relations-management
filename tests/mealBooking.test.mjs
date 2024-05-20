// Import necessary modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, remove, set, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { jest } from '@jest/globals';

// Mock Firebase functions
jest.mock('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js', () => ({
    initializeApp: jest.fn()
}));

jest.mock('https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js', () => ({
    getDatabase: jest.fn(),
    ref: jest.fn(),
    onValue: jest.fn(),
    remove: jest.fn(),
    set: jest.fn(),
    push: jest.fn()
}));

// Define the mock implementation of Firebase functions
const mockDb = {};
const mockPush = { key: 'newBookingKey' };
const mockSet = jest.fn(() => Promise.resolve());
const mockRemove = jest.fn(() => Promise.resolve());
const mockOnValue = (ref, callback) => {
    if (ref === 'mealsRef') {
        callback({
            val: () => ({
                meal1: { mealType: 'Lunch', protein: 'Chicken', starch: 'Rice', fruit: 'Apple', drink: 'Juice', snack: 'Cookie' },
                meal2: { mealType: 'Dinner', protein: 'Beef', starch: 'Potato', fruit: 'Orange', drink: 'Water', snack: 'Chips' }
            })
        });
    } else if (ref === 'bookingsRef') {
        callback({
            val: () => ({
                booking1: { employee: 'John Doe', date: '2024-05-01', mealType: 'Lunch' },
                booking2: { employee: 'Jane Smith', date: '2024-05-02', mealType: 'Dinner' }
            })
        });
    }
};

// Assign the mock implementations
getDatabase.mockReturnValue(mockDb);
ref.mockImplementation((db, path) => path);
onValue.mockImplementation(mockOnValue);
push.mockImplementation(() => mockPush);
set.mockImplementation(mockSet);
remove.mockImplementation(mockRemove);

// Mock DOM elements
document.body.innerHTML = `
    <div id="mealsList"></div>
    <table id="bookedMealsTable"><tbody></tbody></table>
    <p id="dateBooked"></p>
    <button id="cancelMealBtn" style="display: none;"></button>
`;

// Import the script after setting up mocks
import './eBookmeal.js';

describe('eBookmeal.js', () => {
    test('should initialize Firebase app and database', () => {
        expect(initializeApp).toHaveBeenCalledWith(firebaseConfig);
        expect(getDatabase).toHaveBeenCalledWith(expect.anything());
    });

    test('should display meals from database', () => {
        const mealsList = document.getElementById('mealsList');
        expect(mealsList.innerHTML).toContain('Lunch');
        expect(mealsList.innerHTML).toContain('Dinner');
    });

    test('should book a meal', async () => {
        window.prompt = jest.fn(() => 'John Doe');
        document.getElementById('bookingDate_meal1').value = '2024-05-03';
        
        await window.bookMeal('meal1');
        
        expect(push).toHaveBeenCalledWith(bookingsRef);
        expect(set).toHaveBeenCalledWith(mockPush, {
            employee: 'John Doe',
            date: '2024-05-03',
            mealKey: 'meal1',
            mealType: 'Lunch'
        });
        expect(document.getElementById('dateBooked').textContent).toBe('Meal booked on 2024-05-03 by John Doe.');
    });

    test('should cancel a meal booking', async () => {
        document.getElementById('cancelMealBtn').setAttribute('data-booking-ref', 'booking1');
        window.confirm = jest.fn(() => true);
        
        await document.getElementById('cancelMealBtn').click();
        
        expect(remove).toHaveBeenCalledWith('mealsBooking/booking1');
        expect(document.getElementById('dateBooked').textContent).toBe('No meal booked yet.');
    });

    test('should fetch and display existing bookings', () => {
        const tbody = document.getElementById('bookedMealsTable').querySelector('tbody');
        expect(tbody.innerHTML).toContain('John Doe');
        expect(tbody.innerHTML).toContain('Jane Smith');
    });

    test('should delete a booking', async () => {
        await window.deleteBooking('booking1');
        
        expect(remove).toHaveBeenCalledWith('mealsBooking/booking1');
    });
});
