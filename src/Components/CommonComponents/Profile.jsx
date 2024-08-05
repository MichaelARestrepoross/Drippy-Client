import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getUserData } from '../../helpers/getUserData'
import { logout } from '../../helpers/logout'

import placeholderImage from '../../assets/placeholder.png'
import GetLocation from '../GetLocation'

function Profile() {
  const navigate = useNavigate()

  const [userDetails, setUserDetails] = useState(null)
  const [showAddLocation, setShowAddLocation] = useState(false)

  async function handleLogout() {
    try {
      // Call function to log out of firebase, no need to call backend
      await logout()
      toast.success('User logged out successfully!', {
        position: 'top-center',
      })
      navigate('/login')
      console.log('User logged out successfully!')
    } catch (error) {
      toast.error(error.message, {
        position: 'bottom-center',
      })

      console.error('Error logging out:', error.message)
    }
  }

  useEffect(() => {
    async function getUser() {
      // This is a helper function that will check the state of the current user in firebase and fetch the user using the JWT token from localstorage and the uid
      const user = await getUserData()

      if (user) await setUserDetails(user)
      if(userDetails.message= "Invalid Token") handleLogout();
    }

    getUser()
  }, [])

  const toggleAddLocation = () => {
    setShowAddLocation(!showAddLocation)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-purple-400 to-purple-600 pb-10">

        <div className="bg-white shadow-dark-lg rounded-lg pt-8 p-8 w-full max-w-md my-12">
        {userDetails ? (
          <>
            <img
              src={userDetails.photo || placeholderImage}
              alt={userDetails.username}
              className="mx-auto mt-5 mb-5 rounded-full w-36 h-36 border-4 border-white shadow-md"
            />

            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{userDetails.username}'s Profile Page</h1>

            <div className="bg-gray-50 shadow-inner rounded-lg p-6 mb-6">
              <p className="text-gray-700 mb-4"><span className="font-semibold">Email:</span> {userDetails.email}</p>
              <p className="text-gray-700 mb-4"><span className="font-semibold">Username:</span> {userDetails.username}</p>
            </div>

            {/* <button
              onClick={() => navigate('/wardrobe')}
              className="w-full py-3 px-6 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mb-4 "
            >
              Go to Wardrobe
            </button> */}

            <button
              onClick={() => navigate('/homepage')}
              className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mb-4 "
            >
              Go to Home
            </button>

            {showAddLocation && (
              <div className="bg-gray-100 shadow-inner rounded-lg p-4 mb-4">
                <GetLocation />
              </div>
            )}

            <button
              onClick={toggleAddLocation}
              className="w-full py-3 px-6 bg-purple-400 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mb-4"
            >
              {showAddLocation ? 'Close Add Location' : 'Add a Location'}
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 px-6 text-white rounded-lg shadow-dark-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Loading...</h2>
            <button
              onClick={handleLogout}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Profile
