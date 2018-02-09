# Angular Contact Manager

## Init

```bash
npm i
```

## run

Mongo is require for this project or the server will not work

Add key.json at the root of app that follow this pattern :

```json
[{
    "user": "...",
    "password": "...",
    "encryptKey": "..."
}]
```
user is your gmail email account
password is your gmail password
encryptKey is a fancy string for encrypting data

### dev

```bash
npm start
npm run server:dev
```

# TODO

Linting for server and src

Es6-fy and Ts-fy server

Many change on angular app but it work for now (public part)

Testing application