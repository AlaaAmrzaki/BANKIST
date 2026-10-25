'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

// const accounts = [account1, account2, account3, account4];
// const withdrawls = movement.filter(num => num < 0);
// const newWithdrawls = [];
// for (const mov of movement) {
//   if (mov < 0) newWithdrawls.push(mov);
// }
// transTofirstLowerLetter(accounts);

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
function display(acc, sort = false) {
  const mov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  containerMovements.innerHTML = '';
  mov.forEach((e, i) => {
    const type = e > 0 ? `deposit` : `withdrawal`;
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1}${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${e} </div>
    </div>
    `;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
}
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
// currencies.forEach((e,i)=> {
//   console.log(`${e} `);
// })

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const accounts = [account1, account2, account3, account4];

function transTofirstLowerLetter(users) {
  users.forEach(function (user) {
    user.userName = user.owner
      .toLowerCase()
      .split(` `)
      .map(first => first[0])
      .join(``);
  });
}
transTofirstLowerLetter(accounts);
function calcprintaBalance(acc) {
  acc.balance = acc.movements.reduce((arc, current) => arc + current, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
}
function calcdisplaysummary(acc) {
  const incomes = acc.movements
    .filter(num => num > 0)
    .reduce((acc, num) => acc + num, 0);
  labelSumIn.textContent = incomes;
  const outcomes = acc.movements
    .filter(num => num < 0)
    .reduce((acc, num) => acc + num, 0);
  labelSumOut.textContent = Math.abs(outcomes);
  const interest = acc.movements
    .filter(num => num > 0)
    .map(int => (int * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = interest;
}
function displayUi(acc) {
  calcdisplaysummary(acc);
  calcprintaBalance(acc);
  display(acc, sort);
}
let currentAcc;
btnLogin.addEventListener(`click`, function (e) {
  e.preventDefault();
  console.log(`login`);
  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value);
  console.log(currentAcc);
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `welcome back, ${currentAcc.owner.split(` `)[0]}`;
    containerApp.style.opacity = 100;
    displayUi(currentAcc);
  }
  inputLoginPin.value = inputLoginUsername.value = ``;
});
btnLoan.addEventListener(`click`, e => {
  e.preventDefault();
  const loan = Number(inputLoanAmount.value);

  if (currentAcc.movements.some(mov => mov >= (10 / 100) * loan) && loan > 0) {
    currentAcc.movements.push(loan);
    displayUi(currentAcc);
  }
  inputLoanAmount.value = ``;
});
btnTransfer.addEventListener(`click`, e => {
  e.preventDefault();
  const recieve = accounts.find(acc => acc.userName === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);
  if (
    amount > 0 &&
    amount <= currentAcc.balance &&
    recieve &&
    recieve?.userName !== currentAcc.userName
  ) {
    currentAcc.movements.push(-amount);
    recieve.movements.push(amount);
    displayUi(currentAcc);
  }
  inputTransferTo.value = inputTransferAmount.value = ``;
});
btnClose.addEventListener(`click`, e => {
  e.preventDefault();
  if (
    currentAcc.userName === inputCloseUsername.value &&
    currentAcc.pin === Number(inputClosePin.value)
  ) {
    containerApp.style.opacity = 0;
    const closeUserIndex = accounts.findIndex(
      acc => acc.userName === inputCloseUsername.value,
    );
    accounts.splice(closeUserIndex, 1);
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sort = false;
btnSort.addEventListener(`click`, e => {
  e.preventDefault();
  sort = !sort;
  display(currentAcc, sort);
});

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
dogs.forEach(dog => {
  dog.recFood = Math.trunc(dog.weight ** 0.75 * 28);
});
console.log(dogs);
const sarahDog = dogs.find(dog => dog.owners.includes(`Sarah`));
console.log(sarahDog);
if (sarahDog.curFood > 1.1 * sarahDog.recFood) {
  console.log(`Eat Too Musch`);
} else if (sarahDog.curFood < sarahDog.recFood * 0.9) {
  console.log(`Eat too Miny`);
}
const ownersTooMuch = dogs
  .filter(dog => dog.curFood > 1.1 * dog.recFood)
  .flatMap(dogown => dogown.owners);
const ownersTooLittle = dogs
  .filter(dog => dog.curFood < 0.9 * dog.recFood)
  .flatMap(dogown => dogown.owners);
console.log(
  `${ownersTooLittle.join(` and `)} dogs eat too little!`,
  `${ownersTooMuch.join(` and `)} dogs eat too much!`,
);
console.log(dogs.some(dog => dog.curFood === dog.recFood));
console.log(
  dogs.every(
    dog => dog.curFood > 0.9 * dog.recFood && dog.curFood < 1.1 * dog.recFood,
  ),
);
const arr = dogs.filter(
  dog => dog.curFood > 0.9 * dog.recFood && dog.curFood < 1.1 * dog.recFood,
);
const newArr = Object.groupBy(dogs, dog =>
  dog.curFood === dog.recFood
    ? `exact`
    : dog.curFood > dog.recFood
      ? `too-much`
      : `too-little`,
);
const newArr3 = Object.groupBy(dogs, dog =>
  dog.owners.length === 1
    ? `oneowner`
    : dog.owners.length === 2
      ? `twoOwners`
      : `threeOwners`,
);
const newArr2 = dogs.toSorted((a, b) => a.recFood - b.recFood);
