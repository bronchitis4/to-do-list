import './board-list.css'
import Board from "../board/board"
import { useEffect, useState } from 'react'
import {onAuthStateChanged} from 'firebase/auth';
import {auth, db} from '../../firebase.js'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.js';
import Spinner from '../spinner/spinner.jsx';

const BoardList = ({boardsList, onUpdateTask, tasksList, onUpdateBoardListAfterDelete, onUpdateTaskListAfterDelete}) => {
    const [boards, setBoards] = useState(boardsList);
    const {uid, setUid} = useContext(AuthContext);
    const [loading, setLoading] = useState(null);
    const [message, setMessage] = useState(null);
    
    const onDeleteBoard = async (boardId) => {
            try {
                const refBoard = doc(db, "users", uid, "boards", boardId);
                const delBoard = await deleteDoc(refBoard);

                const newBoardList = boards.filter(item => item.id != boardId);
                
                onUpdateBoardListAfterDelete(boardId);
                setBoards(newBoardList);
            }catch(error) {
                console.log(boards);
                console.log(error.message)
                alert(error.message);
            }
    }

    useEffect(()=>{
        setBoards(boardsList);
    }, [boardsList])

   
    useEffect(() => {
        if (boardsList == null || !tasksList) {
            setLoading(<Spinner />);
            setMessage(null);
        } else if (!boardsList.length) {
            setLoading(null);
            setMessage(<p style={{textAlign: 'center', fontWeight: 'bold', fontSize: 25, color: 'white'}}>Дошок немає!</p>);
        } else {
            setLoading(null);
            setMessage(null);
        }
    }, [boardsList, tasksList]);

    return(
        <div className="board-list-wrapper">
            {loading || message ||
                boards?.map((item, i) => {
                    return <Board onUpdateTaskListAfterDelete={onUpdateTaskListAfterDelete} 
                                  onDeleteBoard={onDeleteBoard} 
                                  id={item.id}    
                                  tasksList={tasksList[i] || []} 
                                  title={item.name} 
                                  onUpdateTask={onUpdateTask}
                                  key={item.id}/>
            })}
        </div>
    )
}

export default BoardList;