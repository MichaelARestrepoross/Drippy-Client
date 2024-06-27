const URL = import.meta.env.VITE_BASE_URL

export const register = async (user, photoURL, uid) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // every field that is in the backend query should be here as well
    body: JSON.stringify({
      uid,
      username: user.username || user.displayName || '',
      email: user.email,
      photo: photoURL || '',
    }),
  }
  const response = await fetch(`${URL}/api/auth/register`, options)

  return response.json()
}
