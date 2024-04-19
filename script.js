// truly unecessary for the login hyperlinks; doesn't do shit

const login = document.querySelector('#login');
const logout = document.querySelector('#logout');

login.addEventListener('click',() => {
    console.log('logging in ...');
});
logout.addEventListener('click', () => {
    console.log('logging out ...');
});