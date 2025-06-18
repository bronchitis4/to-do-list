import './MainPage.css'
import React from 'react';
import SignOutBtn from '../components/sign-out-btn/sign-out-btn.jsx';

const MainPage = ({ children }) => {
  const [left, right] = React.Children.toArray(children);

 

    return(
        <div className='main-page-container'>
            <SignOutBtn title={"Вийти"}/>
            <div className="left-container">
                {left}
            </div>
            <div className="rigth-container">
                {right}
            </div>
        </div>
    )
} 

export default MainPage;