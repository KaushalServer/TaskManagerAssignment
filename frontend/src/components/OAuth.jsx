import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../googleOAuth/firebase'

const OAuth = () => {
    const handleGoogleClick = async () => {
        try {
            const auth = getAuth(app)
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email
                }) 
            })
            const data = await res.json()
        } catch (error) {
            console.log("Could not login with google", error);
        }
    }
  return (
    <div>
        <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>
            Continue with Google
        </button>
    </div>
  )
}

export default OAuth