import './board.css'
import TaskItem from '../task-item/task-item';
import deleteIcon from '../../icons/delete.png'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase.js'
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.js';

const Board = ({ id, title, onDeleteBoard, onUpdateTask, tasksList, onUpdateTaskListAfterDelete }) => {
    const [tasks, setTasks] = useState(tasksList);
    const [error, setError] = useState("");

    const { uid, setUid } = useContext(AuthContext);

    const onDeleteTask = async (taskId) => {
        try {
            const refTask = doc(db, "users", uid, "boards", id, "tasks", taskId);
            const delTask = await deleteDoc(refTask);

            const newTaskList = tasks.filter(item => item.id != taskId);
            onUpdateTaskListAfterDelete(taskId, id);
            setTasks(newTaskList);
        } catch (error) {
            console.log(error.message)
            alert(error.message);
        }
    }

    const onUpdateTaskFirebase = async (taskId, newData) => {
        console.log(newData);
        console.log(taskId);
        console.log(id)
        try {
            const task = await doc(db, "users", uid, "boards", id, "tasks", taskId);
            const updatedTask = await updateDoc(task, newData);
            console.log("МЯУУУУУУУУУУУУУУУУУУУУУ")
            onUpdateTask(id, taskId, newData);
        }catch(error) {
            console.log(error.message);
            alert(error.message);
        }
    }

    return (
        <div className="board-wrapper">
            <div className="board-title">
                <h1>{title}</h1>
                <img onClick={() => onDeleteBoard(id)} className='board-delete-icon' title='Видалити дошку' style={{ background: 'white', padding: 10 }} src={deleteIcon} />
            </div>
            <div className="board-list-block">
                <ul className='board-task-list'>
                    {error || !tasksList?.length ? "Завдань немає, ти вільне чмо!" : tasksList.map(item => {
                        return <TaskItem key={item.id} onDeleteTask={onDeleteTask} onUpdateTask={onUpdateTaskFirebase} isCom={item.isCompleted} taskId={item.id} boardId={id} title={item.taskName} description={item.description} />
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Board;