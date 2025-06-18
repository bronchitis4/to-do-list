import './App.css';
import Board from './components/board/board';
import TaskItem from './components/task-item/task-item';
import MainPage from './pages/MainPage';
import Sidebar from './components/sidebar/sidebar';
import BoardList from './components/board-list/board-list';
import ModalWindowTaskEdit from './components/modal-window-task-edit/modal-window-task-edit.jsx';
import RegisterForm from './components/register-form/register-from';
import LoginForm from './components/login-form/login-from.jsx';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from './firebase.js'
import { collection, getDocs } from 'firebase/firestore';

function App() {
  const [uid, setUid] = useState(null);
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubsribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid)
      } else {
        navigate("/register")
      }
    })

    return () => unsubsribe();
  }, [])
  

  const fetchBoards = async () => {
    if (!uid) {
      return;
    }

    try {
      const refBoards = collection(db, "users", uid, 'boards');
      const snapshot = await getDocs(refBoards);
      const boards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBoards(boards);
      fetchTaskListByBoardId(boards);

    } catch (error) {
      console.log(error.message);
    }
  }

  const fetchTaskListByBoardId = async (boards) => {
    try {
      if (!uid || !boards)
        return;

      const taskList = [];
      for(let i = 0; i < boards.length; i++) {
          const refTasks = collection(db, 'users', uid, 'boards', boards[i].id, 'tasks');
          const snapshot = await getDocs(refTasks);
          taskList.push(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      setTasks(taskList);
    } catch (error) {
      console.log(error.message);
    }
  }

  // useEffect(() => {
  //   fetchTaskListByBoardId();
  // }, [uid])

  useEffect(() => {
    fetchBoards();
  }, [uid])

  const onAddBoard = (item) => {
    setBoards(state => [...state, item]);
  }

  const onAddTask = (newTask, boardId) => {  
    
    const boardIndex = boards.findIndex(board => board.id === boardId);
    setTasks(tasks => {
      const updateTaskList = [...tasks];
      console.log("АПДЕЙТ НАСТ ЛІСТ: ",updateTaskList);
     
      if(boardIndex > updateTaskList.length - 1) {
          updateTaskList[boardIndex] = [newTask];
          return updateTaskList;
      }

      const currentBoardsTasks = [...updateTaskList[boardIndex]];
      currentBoardsTasks.push(newTask);
      updateTaskList[boardIndex] = currentBoardsTasks;
      return updateTaskList;
    })
  }



  const onUpdateTask = (boardId, taskId, newData) => {
    console.log(boardId);
    console.log(tasks);
    const boardIndex = tasks.findIndex(item => item[0]?.boardId == boardId);
    setTasks(tasks => {
      console.log(tasks);
      const boardTaskList = [...tasks[boardIndex]]; //взяв всі таски з дошки
      const taskIndexForUpdate = boardTaskList.findIndex(item => item.id == taskId); //взяв індекс завдання яке треба замінити
      boardTaskList[taskIndexForUpdate] = newData; //міняю цей таск
      
      const updatedTaskList = [...tasks];
      updatedTaskList[boardIndex] = boardTaskList;
      
      return updatedTaskList;
    })
  }


  const onUpdateBoardListAfterDelete = async (boardId) => {
    const newBoardList = boards.filter(item => item.id != boardId);
    setBoards(newBoardList);
  }

  const onUpdateTaskListAfterDelete = (taskId, boardId) => {
   
    const boardIndex = boards.findIndex(board => board.id === boardId);
   
    if (boardIndex === -1) {
      console.error("Дошка не знайдена");
      return;
    }

    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks];
      const filteredTasks = updatedTasks[boardIndex].filter(task => task.id !== taskId);
      updatedTasks[boardIndex] = filteredTasks;
      return updatedTasks;
    });
  };

  return (
    <AuthContext.Provider value={{ uid, setUid }}>
        <Routes>
          <Route path="/" element={
            <MainPage>
              <Sidebar onAddBoard={onAddBoard} onAddTask={onAddTask} boardsList={boards} />
              {//boards != null && tasks != null ?
                <BoardList onUpdateBoardListAfterDelete={onUpdateBoardListAfterDelete} onUpdateTaskListAfterDelete={onUpdateTaskListAfterDelete} onUpdateTask={onUpdateTask} boardsList={boards} tasksList={tasks || []} />
                //: null*/
                }
            </MainPage>
          } />
          <Route path="/register" element={
            <RegisterForm />
          } />
           <Route path="/login" element={
            <LoginForm />
          } />
        </Routes>
    </AuthContext.Provider>
  );
}

export default App;


































// 1) papers please
// 2) Mouthwashing
