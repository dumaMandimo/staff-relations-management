// Registration form
const registrationForm = document.querySelector("#index.html form");
registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const response = await fetch("/users", {
    method: "POST",
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    alert("User created successfully!");
  } else {
    alert("Error creating user");
  }
});

// Login form
const loginForm = document.querySelector("#signIn.html form");
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const response = await fetch("/users/login", {
    method: "POST",
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    alert("Login successful!");
  } else {
    alert("Invalid username or password");
  }
});
