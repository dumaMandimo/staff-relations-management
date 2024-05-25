const {
  initializeFirebase,
  setupEventListeners,
  fetchMealBookings,
} = require("../dist/eBookMealT");

describe("initializeFirebase", () => {
  test("should return a mocked database instance", () => {
    // Mock setup
    const firebaseMock = {
      initializeApp: jest.fn(() => ({})),
      getDatabase: jest.fn(() => ({})),
    };

    // Test
    const db = initializeFirebase(firebaseMock);

    // Assertion
    expect(db).toBeDefined();
    expect(firebaseMock.initializeApp).toHaveBeenCalled();
    expect(firebaseMock.getDatabase).toHaveBeenCalled();
  });
});

describe("setupEventListeners", () => {
  test("should call cancelMeal function on button click", () => {
    // Mock setup
    const cancelMeal = jest.fn();
    const mockBtn = document.createElement("button");
    cancelMealBtn = mockBtn;
    cancelMealBtn.addEventListener = jest.fn((event, callback) => {
      if (event === "click") {
        callback();
      }
    });

    // Test
    setupEventListeners(cancelMeal);

    // Assertion
    expect(cancelMealBtn.addEventListener).toHaveBeenCalled();
    expect(cancelMeal).toHaveBeenCalled();
  });
});

describe("fetchMealBookings", () => {
  test("should populate bookings table with fetched bookings", () => {
    // Mock setup
    const mockSnapshot = {
      val: jest.fn().mockReturnValue({
        booking1: { employee: "John", date: "2024-05-26", mealType: "Lunch" },
        booking2: { employee: "Alice", date: "2024-05-27", mealType: "Dinner" },
      }),
    };
    const mockDb = {
      onValue: jest.fn((ref, callback) => {
        callback(mockSnapshot);
      }),
    };
    const mockBookingsRef = jest.fn();
    const tbody = document.createElement("tbody");
    bookedMealsTable = document.createElement("table");
    bookedMealsTable.appendChild(tbody);

    // Test
    fetchMealBookings(mockDb, mockBookingsRef);

    // Assertion
    expect(mockDb.onValue).toHaveBeenCalled();
    expect(tbody.innerHTML).toContain("John");
    expect(tbody.innerHTML).toContain("Alice");
  });
});
