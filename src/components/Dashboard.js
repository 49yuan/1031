import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className='content'>
            <div className='dashboard'>
                <h1>欢迎来到素材系统</h1>
                <p>在这里，你可以……</p>
                <button><Link to="/">登出/切换账号</Link></button>
            </div>
        </div>
    )
}
export default Dashboard;