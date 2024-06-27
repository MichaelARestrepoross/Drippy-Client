import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../helpers/firebase";
import { register } from "../helpers/register";

function Register() {
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.id]: e.target.value });
  };

  const handleClearState = () => {
    setNewUser({
      email: "",
      password: "",
      username:"",
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { email, password } = newUser;
      // createUser in firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // you need the JWT token to authenticate protected routes on the backend
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);

      const { uid, photoURL } = auth.currentUser;

      if (uid) {
        //register first
        const retrievedUser = await register(newUser, photoURL, uid);
        // no sign in the new user with signInWithEmailAndPassword
        if (retrievedUser.uid) {
          await signInWithEmailAndPassword(auth, email, password);

          handleClearState();
          toast.success("User Registered Successfully!!", {
            position: "top-center",
          });
          navigate("/profile");
        } else {
          toast.error("User Not Found", {
            position: "top-center",
          });
        }
      }
    } catch (error) {
      console.log(error.message);

      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };
  return (
    <div style={{ textAlign: "center" }}>
      <form onSubmit={handleRegister}>
        <h3>Sign Up</h3>
        <div>
          <label htmlFor="username">
            Username:{" "}
            <input
              type="text"
              id="username"
              name="username"
              placeholder="First name"
              value={newUser.username}
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="email">
            Email Address:{" "}
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={newUser.email}
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="password">
            Password:{" "}
            <input
              type="password"
              placeholder="Enter password"
              id="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" style={{ width: 140 }}>
            Sign Up
          </button>
        </div>
        <p>
          Already registered <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
