export const initializeApp = jest.fn();
export const getDatabase = jest.fn(() => ({}));
export const ref = jest.fn((db, path) => path);
export const onValue = jest.fn((ref, callback) => {
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
});
export const set = jest.fn(() => Promise.resolve());
export const push = jest.fn(() => ({ key: 'newBookingKey' }));
export const remove = jest.fn(() => Promise.resolve());
