import React, { useState, useEffect } from 'react';
import SousuoButton from '../assets/SousuoButton.jsx';
import axios from 'axios';

const VideoCard = ({ video }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [title, setTitle] = useState('');
    const [path, setPath] = useState('');
    const [anchor, setAnchor] = useState('');
    const [technique, setTechnique] = useState('');
    const [tag, setTag] = useState('');
    const [handleid, setHandleid] = useState('');
    const [handlepath, setHandlepath] = useState('');
    const [isalldelete, setIsAllDelete] = useState(false);

    useEffect(() => {
        const userType = localStorage.getItem('userType');
        setIsAdmin(userType === 'admin');
    }, []);
    const handleCloseForm = () => {
        setIsUploadFormOpen(false);
        setIsEditFormOpen(false);
        // 重置表单状态  
        setTitle('');
        setPath('');
        setAnchor('');
        setTechnique('');
        setTag('');
    };
    const handleiEdit = (id, title, tag, anchor, technique) => {
        setIsEditFormOpen(true);
        setTitle(title);
        setTag(tag);
        setHandleid(id);
        setAnchor(anchor);
        setTechnique(technique);
    }
    const handleEdit = async () => {
        // 处理编辑事件
        try {
            const response = await fetch('http://localhost:3001/updatepdv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: handleid,
                    title,
                    tag,
                    anchor,
                    technique,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                alert('更新成功');
                handleCloseForm();
            } else {
                alert('更新失败');
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
        handleCloseForm();
    }
    const handleiDelete = (id, path) => {
        setShowConfirm(true);
        setHandleid(id);
        setIsAllDelete(false);
        setHandlepath(path);
    }
    // 删除事件
    const handleDelete = () => {
        let ipath = handlepath;
        if (!isalldelete) { ipath = ''; }
        fetch('http://localhost:3001/api/deletepdv', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: handleid, pdvpath: ipath }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('文件删除失败');
                }
                alert('文件删除成功');
            })
            .catch(error => {
                console.error('删除文件时出错:', error);
                alert('文件已销毁，本次操作仅删除数据库信息');
            });
        setShowConfirm(false);
    };

    return (
        <div className="video-card">
            <div className='card-video-container'>
                <video
                    width="100%"
                    height="100%"
                    controls
                    src={video.url}
                />
            </div>
            <div className="card-content">
                <div className='card-title' title={video.title}>{video.title}</div>
                <div className='card-info'>主播: {video.anchor}</div>
                <div className='card-info'>技术方案: {video.technique}</div>
                <div className="actions">
                    {isAdmin && (
                        <span>
                            <button onClick={() => handleiEdit(video.id, video.title, video.anchor, video.technique, video.tag)}>编辑</button>
                            <button className='delete' onClick={() => handleiDelete(video.id, video.path)}>删除</button>
                        </span>
                    )}
                </div>
            </div>
            {isEditFormOpen && (
                <div className="document-form-popup2">
                    <div className='form-popup'>
                        <h2>编辑视频</h2>
                        <div className='row'>
                            <label>标题：</label>
                            <input
                                type="text"
                                id='title'
                                placeholder="标题"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className='row'>
                            <label>主播：</label>
                            <input
                                type="text"
                                id='anchor'
                                placeholder="主播"
                                value={anchor}
                                onChange={(e) => setAnchor(e.target.value)}
                            />
                        </div>
                        <div className='row'>
                            <label>技术方案：</label>
                            <input
                                type="text"
                                id='technique'
                                placeholder="技术方案"
                                value={technique}
                                onChange={(e) => setTechnique(e.target.value)}
                            />
                        </div>
                        <div className='row'>
                            <label>标签：</label>
                            <input
                                type="text"
                                id='tag'
                                placeholder="类别(tag1 tag2 tag3,以空格符隔开)"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                            />
                        </div>
                        <div className='actions'>
                            <button onClick={handleEdit}>提交</button>
                            <button onClick={handleCloseForm}>关闭</button>
                        </div>
                    </div>
                </div>
            )}
            {showConfirm && (
                <div className="confirm-dialog">
                    <p>您确定要删除此项目吗？</p>
                    <p>是否一并删除源文件<input type='checkbox' onChange={(e) => setIsAllDelete(e.target.checked)}></input></p>
                    <div className='actions'>
                        <button onClick={handleDelete} className="download-button">
                            是
                        </button>
                        <button onClick={() => setShowConfirm(false)} className="download-button">
                            否
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


const ProductsDigitalV = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [path, setPath] = useState('');
    const [anchor, setAnchor] = useState('');
    const [technique, setTechnique] = useState('');
    const [tag, setTag] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('全部');
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [andDocuments, setAndDocuments] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        const userType = localStorage.getItem('userType');
        setIsAdmin(userType === 'admin');
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/api/pdv')
            .then(response => {
                // 将每个视频文件的绝对路径转换为相对路径，并添加到 music.url
                const updatedVideo = response.data.map(item => {
                    const baseDir = 'D:/2024/dataset';
                    const absolutePath = item.path;
                    const relativePath = absolutePath.substring(baseDir.length).replace(/\\/g, '/');
                    const serverPath = `/dataset${relativePath}`;
                    return { ...item, url: serverPath };
                });
                setVideos(updatedVideo);
                setFilteredDocuments(updatedVideo);
            })
            .catch(error => console.error('Error fetching:', error));
    }, []);

    const handleSearch = (e) => {
        if (searchKeyword === '') {
            setFilteredDocuments(videos);
        }
        else {
            //后端api，like模糊匹配
            axios.get('http://localhost:3001/api/searchpdv', { params: { keyword: searchKeyword } })
                .then(response => {
                    setFilteredDocuments(response.data);
                })
                .catch(error => {
                    console.error('Error searching documents:', error);
                });
            setActiveCategory('全部');
        }
    };
    useEffect(() => {
        const tags = filteredDocuments.flatMap(doc => doc.tag ? doc.tag.split(' ') : []);
        const uniqueTags = [...new Set(tags.filter(tag => tag !== null && tag !== ''))];
        uniqueTags.unshift('全部');
        setCategories(uniqueTags);
    }, [filteredDocuments]);

    // 根据搜索关键词、分类和标签过滤文章
    useEffect(() => {
        let filteredDs = filteredDocuments;
        if (searchKeyword) {
            filteredDs = filteredDs.filter(doc => doc.title.toLowerCase().includes(searchKeyword.toLowerCase()));
        }
        if (activeCategory !== '全部') {
            filteredDs = filteredDs.filter(doc => {
                const tags = doc.tag ? doc.tag.split(' ') : [];
                return tags.includes(activeCategory);
            });
        }
        setAndDocuments(filteredDs);
    }, [activeCategory, filteredDocuments]);

    // 返回每个类别的数量
    useEffect(() => {
        const categoryCounts = categories.reduce((acc, category) => {
            const count = filteredDocuments.filter(doc => {
                const tags = doc.tag ? doc.tag.split(' ') : [];
                return category === '全部' ? true : tags.includes(category);
            }).length;
            acc[category] = count;
            return acc;
        }, {});
        setCategoryCounts(categoryCounts);
    }, [categories, filteredDocuments, andDocuments]);

    const handleCloseForm = () => {
        setIsUploadFormOpen(false);
        setIsEditFormOpen(false);
        // 重置表单状态  
        setTitle('');
        setPath('');
        setAnchor('');
        setTechnique('');
        setTag('');
    };
    // 上传事件
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        // 先读取文件（判断格式）保存在本地，如果成功
        const formData = new FormData();
        formData.append('file', selectedFile);

        const allowedTypes = [
            'video/mp4', // MP4 视频
            'video/quicktime', // QuickTime 视频
            'video/x-msvideo', // AVI 视频
            'video/x-ms-wmv', // Windows Media Video
            'video/ogg', // Ogg 视频
            'video/webm', // WebM 视频
            // 可以添加更多视频格式
        ];
        if (!allowedTypes.includes(selectedFile.type)) {
            alert('不支持的文件格式');
            return;
        }
        // 检查文件是否有效
        if (!selectedFile || selectedFile.size === 0) {
            alert('请选择一个有效的文件');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/pdvupload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                alert('视频上传失败');
                return;
            }

            const fileUploadResult = await response.json();

            // 保存文件信息到数据库
            const formdbData = {
                title,
                path: fileUploadResult.path, // 使用服务器返回的文件路径
                tag,
                anchor,
                technique,
            };

            try {
                const dbResponse = await fetch('http://localhost:3001/uploadpdv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formdbData),
                });

                if (!dbResponse.ok) {
                    alert('数据库保存失败，请稍后再试');
                    return;
                }
                const result = await dbResponse.json();
                alert(`${result.title}上传成功`);
                handleCloseForm();
            } catch (error) {
                console.error('保存到数据库时出错:', error);
                alert('保存到数据库时出错');
            }
        } catch (error) {
            console.error('视频上传时出错:', error);
            alert('视频上传失败');
        }
    };

    return (
        <div className='content' >
            <div className="search-box">
                <input type="text" placeholder="搜索素材..." onChange={e => setSearchKeyword(e.target.value)}></input>
                <button type="button" className="search-icon-button" onClick={e => handleSearch(e)}>
                    <SousuoButton />
                </button>
            </div>
            <div className="category-tags">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-tag ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {`${category} (${categoryCounts[category] || 0})`}
                    </button>
                ))}
            </div>
            {isAdmin && (
                <button className='upload' onClick={() => setIsUploadFormOpen(true)}>
                    上传
                </button>
            )}
            {/* 拖拽文件上传的实现 */}
            {isUploadFormOpen && (
                <div className="document-form-popup">
                    <div className='form-popup'>
                        <h2>上传视频</h2>
                        <input
                            type="text"
                            id='title'
                            placeholder="标题"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            id='anchor'
                            placeholder="主播"
                            value={anchor}
                            onChange={(e) => setAnchor(e.target.value)}
                        />
                        <input
                            type="text"
                            id='technique'
                            placeholder="技术方案"
                            value={technique}
                            onChange={(e) => setTechnique(e.target.value)}
                        />
                        <input
                            type="text"
                            id='tag'
                            placeholder="类别(tag1 tag2 tag3,以空格符隔开)"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                        />
                        <input type="file" onChange={e => setSelectedFile(e.target.files[0])} />
                        <div className='actions'>
                            <button onClick={handleSubmitForm}>提交</button>
                            <button onClick={handleCloseForm}>关闭</button>
                        </div>
                    </div>
                </div>
            )}
            <div className='videos'>
                {andDocuments.map((video, index) => (
                    <VideoCard
                        key={index}
                        video={video}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductsDigitalV;