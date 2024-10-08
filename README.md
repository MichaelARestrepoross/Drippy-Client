# Firebase Auth Portfolio Project Example - Frontend

This is a client side login for Firebase. It includes the [login with email and password](https://firebase.google.com/docs/auth/web/password-auth) functionality and the [sign in with Google functionaility](https://firebase.google.com/docs/auth/web/google-signin) from Firebase.

This firebase refactor and scaffold is based on [The Debug Arena's implementation of firebase](https://www.youtube.com/watch?v=7jOq6SXBF-k)

It does not use [Firebase Firestore](https://firebase.google.com/docs/firestore) which is the NoSQL Database that can be added to Firebase projects.

Here is the [original REPO](https://github.com/the-debug-arena/Login-Auth-Firebase-ReactJS). The original project was created using `create-react-app` toolchain instead of `vite`

This refactor uses [vite](https://vitejs.dev/guide/)

## Note: You must manually configure your Firebase account

### TO DO:

- create your firebase web app
- set up and `Enable` authentication methods
  - Email/Password
  - Google
- add the Firebase Firestore NoSQL database
- change the `Rules` in your Firestore DB to

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

```

**\*\*** You are not required to use both Email/Password sign in and Google sign in. You can refactor the code to only use one or the other.

## User

The logged in user is automatically set in state in the `App.jsx` parent component.
This allows you to protect your front end routes using a ternary in your `element` attribute.

Do Not pass the user as a prop. Instead, Use the `getUserData` helper function in a `useEffect` in the component you are navigating to. This will allow you to `refresh` the page.
