import './login-form.css';
import { db, auth } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPasword] = useState("");
    const [error, setError] = useState();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (email.trim() == "" || password.trim() == "") {
            setError("Введіть дані!");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            navigate('/');

        } catch (error) {
            if (error.code === "auth/invalid-email") {
                setError("Невалідний емейл.");
            } else if (error.code === "auth/user-not-found") {
                setError("Користувача з таким емейлом не існує.");
            } else if (error.code === "auth/wrong-password") {
                setError("Невірний пароль.");
            } else if (error.code === "auth/invalid-credential") {
                setError("Невірний емейл або пароль.");
            } else {
                setError("Помилка входу. Спробуйте ще раз.");
            }
            return;
        }

        //  userCredential   {
        //   user: { ... },           // Об’єкт користувача (User)
        //   providerId: "password",  // Ідентифікатор методу (наприклад, "password", "google.com")
        //   operationType: "signIn"  // Операція: "signIn" або "signUp"
        // }
    }
    return (
        <div className="login-form-wrapper">
            <h1>Вхід</h1>
            <form>
                <label htmlFor='email'>Емейл:</label>
                <input name='email' onChange={(e) => setEmail(e.target.value)} type="email" />
                <label htmlFor='password'>Пароль</label>
                <input name='password' onChange={(e) => setPasword(e.target.value)} type="password" />
                <button onClick={handleLogin} type="submit">Увійти</button>
                <Link to="/register">зареєструватися</Link>
                <p style={{ color: 'red', textAlign: "center" }}>{error || null}</p>
            </form>
        </div>
    )
}

export default LoginForm;