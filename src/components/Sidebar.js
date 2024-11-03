import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MaterialIcon from '../assets/MaterialIcon.jsx';
import ProductIcon from '../assets/ProductIcon.jsx';
import FaceMIcon from '../assets/FaceMIcon.jsx';

const Sidebar = () => {
    const [isOpenMaterials, setIsOpenMaterials] = useState(false);
    const [isOpenProducts, setIsOpenProducts] = useState(false);
    const location = useLocation();

    const toggleMenu = (menu) => {
        if ((menu === 'materials' && !location.pathname.startsWith('/materials')) ||
            (menu === 'products' && !location.pathname.startsWith('/products'))) {
            if (menu === 'materials') {
                setIsOpenMaterials(!isOpenMaterials);
            } else if (menu === 'products') {
                setIsOpenProducts(!isOpenProducts);
            }
        }
    };
    const getActiveClass = (path) => {
        return location.pathname === path ? 'active' : '';
    };
    const getActive = (path) => {
        return `sidebar-arrow ${location.pathname === path ? 'rotated' : ''}`;
    }
    const arrowClass = (isOpen) => {
        return `sidebar-arrow ${isOpen ? 'rotated' : ''}`;
    };
    useEffect(() => {
        // 当路由改变时，设置相应的菜单项为打开状态
        if (location.pathname.startsWith('/materials')) {
            setIsOpenMaterials(true);
        } else if (location.pathname.startsWith('/products')) {
            setIsOpenProducts(true);
        }
    }, [location]);

    return (
        <div className="sidebar animate__animated animate__fadeInLeft" style={{ width: '150px' }}>
            {/* <div className="sidebar-header">
                <button><Link to="/dashboard" className={getActiveClass("/dashboard")}>首页</Link></button>
            </div> */}
            <div className="sidebar-header">
                <button onClick={() => toggleMenu('materials')} className={arrowClass(isOpenMaterials)} >
                    <MaterialIcon />素材库
                </button>
                {isOpenMaterials && (
                    <ul className="sidebar-menu">
                        <li><Link to="/materials/images" className={getActiveClass("/materials/images")}>图片</Link></li>
                        <li><Link to="/materials/videos" className={getActiveClass("/materials/videos")}>视频</Link></li>
                        <li><Link to="/materials/music" className={getActiveClass("/materials/music")}>音乐</Link></li>
                        <li><Link to="/materials/background" className={getActiveClass("/materials/background")}>虚拟背景</Link></li>
                        <li><Link to="/materials/sound" className={getActiveClass("/materials/sound")}>角色音库</Link></li>
                        <li><Link to="/materials/documents" className={getActiveClass("/materials/documents")}>文章</Link></li>
                    </ul>
                )}
            </div>
            <div className={`sidebar-header ${getActiveClass('/products')}`}>
                <button onClick={() => toggleMenu('products')} className={arrowClass(isOpenProducts)} >
                    <ProductIcon />成品库
                </button>
                {isOpenProducts && (
                    <ul className="sidebar-menu">
                        <li><Link to="/products/images" className={getActiveClass("/products/images")}>图片</Link></li>
                        <li><Link to="/products/videos" className={getActiveClass("/products/videos")}>视频</Link></li>
                        <li><Link to="/products/digitalv" className={getActiveClass("/products/digitalv")}>数字人动画</Link></li>
                        <li><Link to="/products/music" className={getActiveClass("/products/music")}>原创音乐</Link></li>
                        <li><Link to="/products/documents" className={getActiveClass("/products/documents")}>文章</Link></li>
                    </ul>
                )}
            </div>
            <div className="sidebar-header">
                <Link to="/facematch" >
                    <button className={getActive('/facematch')} >
                        <FaceMIcon />人脸匹配
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;