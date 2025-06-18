import { useEffect, useState } from 'react';
import './modal-window-task-edit.css';

const ModalWindowTaskEdit = ({taskData, onUpdateTask, isOpen, setIsOpen}) => {
    const [taskName, setName] = useState(taskData.title);
    const [description, setDescription] = useState(taskData.description);
    const [error, setError] = useState(null);
    useEffect(()=> {
        setIsOpen(false);

    }, []);
    if(!isOpen)
        return;

    const handleSubmit = (e) => {
        e.preventDefault();
                console.log(taskData);

        if(taskName.trim() == "") {
            setError("Вкажіть назву");
            return;
        }
        onUpdateTask(taskData.taskId, {taskName, description: description ? description : "" , id: taskData.taskId, isCompleted: taskData.isCom, boardId: taskData.boardId});
        setIsOpen(false);
    }

    return(
        <div className="modal-window-task-edit-wrapper">
            <div className="modal-window-form-wrapper">
                <h1>Редагування таски</h1>
                <form className='task-form'>
                <label>Назва таски:</label>
                <input type="text" value={taskName} onChange={(e) => setName(e.target.value)} />
                <label>Опис таски:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} ></textarea>
                <button type="submit" onClick={handleSubmit} >ДОДАТИ</button>
                <button onClick={() => setIsOpen(state => !state)}>Відмінити</button>
                <p style={{color: 'red'}}>{error}</p>

            </form>
            </div>
        </div>
    )   
}

export default ModalWindowTaskEdit;