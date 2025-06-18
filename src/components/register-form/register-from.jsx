import './register-form.css';
import { db, auth } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPasword] = useState("");
    const [error, setError] = useState();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (email.trim() == "" || password.trim() == "") {
            setError(true);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setError("Емейл вже зареєстрований.");
            } else if (error.code === "auth/invalid-email") {
                setError("Невалідний емейл.");
            } else if (error.code === "auth/weak-password") {
                setError("Пароль заслабкий.");
            } else {
                setError("Спробуйте ще раз.");
            }
            return;
        }
        navigate('/');

        //  userCredential   {
        //   user: { ... },           // Об’єкт користувача (User)
        //   providerId: "password",  // Ідентифікатор методу (наприклад, "password", "google.com")
        //   operationType: "signIn"  // Операція: "signIn" або "signUp"
        // }
    }
    return (
        <div className="register-form-wrapper">
            <h1>Реєстрація</h1>
            <form>
                <label htmlFor='email'>Емейл:</label>
                <input name='email' onChange={(e) => setEmail(e.target.value)} type="email" />
                <label htmlFor='password'>Пароль</label>
                <input name='password' onChange={(e) => setPasword(e.target.value)} type="password" />
                <button onClick={handleRegister} type="submit">Зареєструватися</button>
                <Link to="/login">Увійти</Link>
                <p style={{ color: 'red', textAlign: "center" }}>{error || null}</p>
            </form>
        </div>
    )
}

export default RegisterForm;