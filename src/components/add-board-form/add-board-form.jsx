import './add-board-form.css'
import { auth, db } from '../../firebase';
import { useEffect, useState } from 'react';
import { collection, setDoc, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";


const AddBoardForm = ({onAddBoard}) => {
    const [uid, setUid] = useState(null);
    const [error, setError] = useState("");
    const [boardName, setBoardName] = useState("");
   
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
            } else {
                setUid(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleAddBoard = async (e) => {
        e.preventDefault();

        try {
            if(boardName.trim() == ""){
                throw new Error("Введіть назву дошки!");
            }

            const boardsRef = collection(db, "users", uid, "boards");
            const boardDoc = await addDoc(boardsRef, {
                name: boardName,
                createAt: new Date(),
            })
            
            onAddBoard({name: boardName, tasksList: [], createAt:new Date(), id: boardDoc.id});
            setBoardName("");
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    }
    return(
        <div className="board-form-wrapper">
            <h1 className='board-form-header'>Додавання дошки:</h1>
            <form className='board-form'>
                <label>Назва дошки:</label>
                <input type="text" onChange={(e) => setBoardName(e.target.value)} value={boardName}/>
                <button onClick={handleAddBoard} type="submit">ДОДАТИ</button>
                <p style={{color: 'red'}}>{error}</p>
            </form>
        </div>
    )
}

export default AddBoardForm;