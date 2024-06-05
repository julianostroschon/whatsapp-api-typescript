# Whatsapp-API-TypeScript

Install dependencies the project

```shell
yarn
```

Build the Project

```shell
yarn build
```

Run the Project

```shell
yarn start
```

### Endpoits

`options`, token is a JWT(https://jwt.io/):

```js
const options = {****
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}'
};
```

- `/api/v1/send`

```js
fetch(`http://localhost:3001/api/v1/send`, options)
  .then((res) => {
    console.log(res);
    res.json();
  })
  .catch((err) => console.error(err));
```

- `/api/v1/chatId`

```js
fetch(`http://localhost:3001/api/v1/chatId`, options)
  .then((res) => {
    console.log(res);
    res.json();
  })
  .catch((err) => console.error(err));
```
