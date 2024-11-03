import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'animate.css';

const HomePage = () => {

    const [workNumber, setWorkNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ workNumber, password }),
        });
        const regResponse = await response.json();
        if (regResponse.success) {
            localStorage.setItem('token', regResponse.token);
            localStorage.setItem('userType', regResponse.userType);
            localStorage.setItem('username', regResponse.name);
            navigate('/materials/images');
        } else {
            alert('登录失败，请检查工号和密码');
        }
    };

    return (
        <div className="home-container">
            <h1 className='title animate__animated animate__fadeInLeft'>素材系统</h1>
            <div className="login-card animate__animated animate__fadeInUp">
                <div className='main-overlay'>
                    <div className='main-con'>
                        <div className='login-container'>
                            {/* <h1>Login to start</h1> */}
                            <form onSubmit={handleLogin}>
                                <div className='form-group'>
                                    <label>工号:</label>
                                    <input type="text" id="work_number" placeholder="请输入工号" value={workNumber} onChange={(e) => setWorkNumber(e.target.value)} />
                                </div>
                                <div className='form-group'>
                                    <label>密码:</label>
                                    <input type="password" id="password" placeholder='请输入密码' value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <button type="submit">登录</button>
                                <p>还没有账号？<Link to="/register">注册</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default HomePage;