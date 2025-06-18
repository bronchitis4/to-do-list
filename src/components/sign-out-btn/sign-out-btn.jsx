import './sign-out-btn.css'
import {auth} from "../../firebase.js";
import {signOut} from 'firebase/auth';

const SignOutBtn = ({title}) => {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("Вийшов")
        } catch(error) {
            alert(error.message);
        }
    }

    return (
        <button className='signOutBtn' onClick={handleSignOut}>{title}</button>
    )
}

export default SignOutBtn;