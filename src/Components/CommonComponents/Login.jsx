import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { signInWithEmailAndPassword } from 'firebase/auth'

import SignInWithGoogle from './SignInWithGoogle'
import { auth } from '../../helpers/firebase'

function Login() {
  const navigate = useNavigate()

  const [loginUser, setLoginNewUser] = useState({ password: '', email: '' })

  const handleChange = (e) => {
    setLoginNewUser({ ...loginUser, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { email, password } = loginUser

    try {
      const loggedUser = await signInWithEmailAndPassword(auth, email, password)
      console.log('User logged in to Firebase Successfully')

      // store the JWT token so that you know the user is logged in.
      const token = await loggedUser.user.getIdToken()
      localStorage.setItem('token', token)

      setLoginNewUser({ password: '', email: '' })
      toast.success('User logged in Successfully', {
        position: 'top-center',
      })

      // you do not have to create a login in the backend because firebase is handling it.
      // when you navigate to profile, you will see a fetch for the user.
      navigate('/profile')
    } catch (error) {
      console.log(error.message)

      toast.error(error.message, {
        position: 'bottom-center',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-500 to-white">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6 text-center">Login</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={loginUser.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={loginUser.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:bg-green-700"
          >
            Submit
          </button>
        </form>
        <div className="mt-6 text-center">
          <p>
            New user? <Link to="/register" className="text-green-600">Register Here</Link>
          </p>
          <p className="mt-4 text-gray-600">--Or continue with--</p>
          <div className="mt-4">
            <SignInWithGoogle />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login
