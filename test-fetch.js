fetch('http://localhost:3000/customers')
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
