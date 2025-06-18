import { useEffect, useState } from 'react';
import './task-item.css'
import deleteIcon from '../../icons/delete.png';
import markItem from '../../icons/mark.png';
import ModalWindowTaskEdit from '../modal-window-task-edit/modal-window-task-edit.jsx';
import { collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import editIcon from '../../icons/edit.png';
import { onAuthStateChanged } from 'firebase/auth';
import {auth, db} from '../../firebase.js'; 
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.js';

const TaskItem = ({onUpdateTask, onDeleteTask, boardId, taskId, isCom, title = "Прибрати будинок до приїзду гостей", description = "хуй", deadline}) => {
    const [desIsOpen, setDes] = useState(false);
    const [isCompleted, setIsCompleted] = useState(isCom);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    
    const {uid, setUid} = useContext(AuthContext);

    const handleChangeTaskState = async () => {
        try {
            const refTask =  doc(db, "users", uid, "boards", boardId, "tasks", taskId);
            const updatedTask = await updateDoc(refTask, {isCompleted: !isCompleted});
            setIsCompleted(state => !state);
        } catch (error) {
            alert(error.message);

        }
    }

    return(
        <>
        <ModalWindowTaskEdit taskData = {{isCom, taskId, boardId, title, description}} onUpdateTask={onUpdateTask} isOpen={modalIsOpen} setIsOpen={setModalIsOpen}/>
        <li className='task-wrapper'>
            <div className='main-task-info'>
                <h3>{title}</h3>
                <div className='check-box' onClick={handleChangeTaskState}>{isCompleted ? <img width={35} src={markItem}/> : null}</div>
            </div>
            <div className='description-task-block'>
                {desIsOpen && description ? <p>{description}</p> : null}
                <div className='task-action'>
                    <p className='check-des-btn' onClick={() => setDes(state => !state)}>Глянути опис</p>
                    <div className='task-action-btns'>
                        <img title='Видалити таску' src={deleteIcon} onClick={(e) => onDeleteTask(taskId)} />
                        <img title='Редагувати таску' src={editIcon} onClick={(e) => setModalIsOpen( state => !state)}/>
                    </div>
                </div>
            </div>
            
        </li>
        </>
    )
}

export default TaskItem;