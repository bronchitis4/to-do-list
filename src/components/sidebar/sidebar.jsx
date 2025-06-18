import "./sidebar.css"
import AddBoardForm from "../add-board-form/add-board-form";
import AddTaskForm from "../add-task-form/add-task-form";

const Sidebar = ({onAddBoard, onAddTask, boardsList}) => {
   
    return(
        <div className="sidebar-wrapper">
            <AddBoardForm onAddBoard={onAddBoard}/>
            <AddTaskForm onAddTask={onAddTask} boards={boardsList}/>
        </div>
    )
}

export default Sidebar;