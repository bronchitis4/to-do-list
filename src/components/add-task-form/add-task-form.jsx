import { useState, useEffect } from 'react';
import './add-task-form.css'
import { auth, db } from '../../firebase';
import { collection, setDoc, addDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

const AddTaskForm = ({onAddTask, boards}) => {
    
    const [uid, setUid] = useState(null);
    const [error, setError] = useState("");
    const [boardId, setBoardId] = useState("");
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [boardsList, setBoardList] = useState([]);

    useEffect(() => {
        if(!boards || !boards.length) {
            return;
        }
        setBoardList(boards);    
    }, [boards])

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

    const handleAddTask = async (e) => {
        e.preventDefault();
        const data = {
            taskName,
            description,
            boardId,
            isCompleted: false,
        }
        console.log(data);
        try{
            if(taskName.trim() == "" || !boardId)
                throw new Error("Ведіть назву таски або виберіть дошку")

            const refTask = collection(db, "users", uid, "boards", boardId, "tasks");
            const docRef = await addDoc(refTask, data);

            onAddTask({...data, id: docRef.id}, boardId);
            setTaskName("");
            setDescription("");
            setBoardId("");
            setError(null);
        }catch(error) {
            console.log(error.message);
            setError(error.message)
        }
    }

    return(
        <div className="task-form-wrapper">
            <h1 className='task-form-header'>Додавання таски:</h1>
            <form className='task-form'>
                <label>Назва таски:</label>
                <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                <label>Опис таски:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

                <label>Дошка завдань:</label>
                <select value={boardId} onChange={(e) => {setBoardId(e.target.value)}}>
                    <option>Виберіть таблицю</option>
                    {boardsList.map(item => {
                        return <option key={item.id} value={item.id}>{item.name}</option>
                    })}
                </select>
                <button type="submit" onClick={handleAddTask}>ДОДАТИ</button>
                <p style={{color: 'red'}}>{error}</p>
            </form>
        </div>
    )
}

export default AddTaskForm;