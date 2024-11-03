import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [workNumber, setWorkNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [adminUser, setAdminUser] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if ((password === confirmPassword) && (!(!name || !workNumber || !password))) {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, workNumber, password, userType: adminUser ? 'admin' : 'user' }), // 根据实际情况调整userType的值
            });
            const regResponse = await response.json();
            if (regResponse.success) {
                alert('注册成功，请登录');
                navigate('/');
            } else {
                alert(`注册失败，${regResponse.message}`);
                //添加工号已存在的情况判断
            }
        } else {
            alert('请检查输入');
        }
    };

    return (
        <div className='register'>
            <div className="register-card">
                <div className='main-overlay'>
                    <div className='main-con'>
                        <div className="login-container">
                            <h1>Register</h1>
                            <form onSubmit={handleRegister}>
                                <div className='form-group'>
                                    <label>用户名:</label>
                                    <input type="text" id="registerUsername" placeholder="请输入用户名" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='form-group'>
                                    <label>工号:</label>
                                    <input type="text" id="registerworknumber" placeholder="请输入工号" value={workNumber} onChange={(e) => setWorkNumber(e.target.value)} />
                                </div>
                                <div className='form-group'>
                                    <label>密码:</label>
                                    <input type="password" id="registerPassword" placeholder='请输入密码' value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className='form-group'>
                                    <label>确认密码:</label>
                                    <input type="password" placeholder='请确认密码' value={confirmPassword} onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setPasswordMatch(password === e.target.value);
                                    }} />
                                    {passwordMatch !== null && (
                                        <span style={{ color: passwordMatch ? 'green' : 'red', opacity: passwordMatch !== null ? 1 : 0 }}>
                                            {passwordMatch ? '密码匹配' : '密码不匹配'}
                                        </span>
                                    )}
                                </div>
                                <div className='form-group'>
                                    <label>是否为管理员用户:</label>
                                    <input type="checkbox" checked={adminUser} onChange={(e) => setAdminUser(e.target.checked)} />
                                </div>
                                <button type="submit">注册</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RegisterPage;