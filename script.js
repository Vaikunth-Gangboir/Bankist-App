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

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  // .textContent = 0;

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  //Adding Movements
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Displaying Total Balance in Account
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//Dipslaying Total Incoming / Outgoing and Interest
const calcDisplaySummary = function (acc) {
  //Incoming//
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  //OutGOing//
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  //Interest//
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    .filter((int, _, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, Int) => acc + Int);
  labelSumInterest.textContent = `${interest}€`;
};

//Creating User Name
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
console.log(accounts);

const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc.movements);
  //Display Balance
  calcDisplayBalance(acc);
  //Display Summery
  calcDisplaySummary(acc);
};

//Event Handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //Prevent form from Submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and a Welcome Message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Updat UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    //Doing the Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});

//Loan Request

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add Movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

//Closing Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23);

    //Delete Account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

//Sorting Movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

//SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

//SPLICE
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);

arr.splice(1, 2);
console.log(arr);

//REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse());
console.log(arr2);

//CONCATE
const letters = arr.concat(arr2).splice(4, 3);
console.log(letters);
console.log([...arr, ...arr2]);

//JOIN
console.log(letters.join(' - '));

////////////////////////////////////////////////////////////////
// AT method

const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

//Getting last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('Vijay'.at(2));
console.log('Vijay'.at(-1));


///////////////////////////////////////////////////////////////////
// forEach() looping an array using forEach method

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdraw ${Math.abs(movement)}`);
  }
}

console.log('-----------FOREACH---------------');
movements.forEach(function (movement, index, array) {
  if (movement > 0) {
    console.log(`Movement ${index + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${index + 1}: You withdraw ${Math.abs(movement)}`);
  }
});

// 0: function(200)
// 1: function(450)
// 2: function(400) ..so on so forth untill end of an array


//Using forEach with Maps and Sets
//Maps
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//Sets

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

currenciesUnique.forEach(function (value, _, set) {
  console.log(`${value}: ${value}`);
});

/////////////////////////////////////////////////////////////////////
// map() method

const eurToUsd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

const movementsUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

//it also has access of current element, current index, and whole array in each iteration of loop...
const movmentsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'Deposited' : 'Withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movmentsDescription);


//////////////////////////////////////////////////////////////////
// filter() method
const deposites = movements.filter(function (mov, i, arr) {
  return mov > 0;
});
console.log(movements);
console.log(deposites);

const depositesFor = [];
for (const mov of movements) {
  if (mov > 0) depositesFor.push(mov);
}
console.log(depositesFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

/////////////////////////////////////////////////////////////
// reduce() method
console.log(movements);

//Accumulator is like a snow ball
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);

const balance = movements.reduce((acc, cur) => acc + cur, 0);

console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

//Maximum Value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

console.log(max);


/////////////////////////////////////////////////////////////////
//Chaining map(), filter(), reduce()
const eurToUsd = 1.1;
console.log(movements);

//PIPELINE
const totalDepositesinUSD = movements
  .filter(mov => mov > 0)
  // .map((mov, i, arr) => {
  //   console.log(arr);
  //   return mov * eurToUsd;
  // })
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositesinUSD);


/////////////////////////////////////////////////////////////////////
// Find() Method

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

let accsObj;

for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') accsObj = acc;
}

console.log(accsObj);

////////////////////////////////////////////////////////////////////
// some() Method
console.log(movements);

//Equality
console.log(movements.includes(-130));

//CONDITION
console.log(movements.some(mov => mov === -130));

const anyDeposites = movements.some(mov => mov > 1500);
console.log(anyDeposites);

// every() Method
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//Seperate Callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

///////////////////////////////////////////////////////////////////
//flat() and flatmap() method

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// flat
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov);
console.log(overalBalance);

// flatmap
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);


/////////////////////////////////////////////////////////////////
//Sorting
//Strings
const owners = ['Jonas', 'Zack', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

//Numbers
console.log(movements);

//return < 0, A, B (Keep order)
//return > 0, B, A (switch order)

//Accending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });

movements.sort((a, b) => a - b);
console.log(movements);

//Decending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (b > a) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);


//////////////////////////////////////////////////////
//More way to craeting Arrays
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(new Array(1, 2, 3, 4, 5, 6, 7, 8, 9));

//Empty Arrays + fill method
const x = new Array(7);
console.log(x);
// console.log(x.map(() => 5));

x.fill(1, 3, 5);
x.fill(1);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

//Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const diceRoll = Array.from(
  { length: 100 },
  () => Math.trunc(Math.random() * 6) + 1
);
console.log(diceRoll);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2);
});

*/
///////////////////////////////////////////////////////////////
//Practice Methods

// 1.
const bankDepositeSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositeSum);

// 2.

// const numDeposite1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

//Advance case of reduce Method
const numDeposite1000 = accounts
  .flatMap(acc => acc.movements)
  // .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(numDeposite1000);

//Prefix ++ Operator
let a = 10;
console.log(a++); //Increment value but this Expression return previous value assign to variable
console.log(++a);
console.log(a); // now you can see incremented value assign to variable

// 3. More Advance case of reduce method
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

const numDeposites1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((arr, cur) => {
    if (cur >= 1000) arr.push(cur);
    return arr;
  }, []);

console.log(numDeposites1000);

// 4.
// this is a nice title -> This Is a Nice Title

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitleCase('This is a nice Title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here i another title with an example'));
