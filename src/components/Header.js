import UserIcon from '../assets/UserIcon.jsx';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [user, setUser] = useState({ name: 'user', isLoggedIn: false, userType: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const userType = localStorage.getItem('userType');
        if (token && userType && username) {
            setUser({ ...user, name: username, isLoggedIn: true, userType: userType });
        } else {
            navigate('/');
        }
    }, []);
    return (
        <div className="header">
            <div className="logo">素材系统</div>
            <div className="user">
                <UserIcon />{user.name}
                <button><Link to="/">登出</Link></button>
            </div>
        </div>
    )
}
export default Header;