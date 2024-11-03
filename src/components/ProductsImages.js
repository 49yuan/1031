import { React, useState, useEffect } from 'react';
import axios from 'axios';

// ImageCard组件
const ImageCard = ({ id, stag, spath, isExpanded, setIsExpanded, index }) => {
    const toggleDetails = () => {
        setIsExpanded(index === isExpanded ? null : index);
    };
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [path, setPath] = useState('');
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
        setPath('');
        setTag('');
    };
    const handleiEdit = (id, tag) => {
        setIsEditFormOpen(true);
        setTag(tag);
        setHandleid(id);
    }
    const handleEdit = async () => {
        // 处理编辑事件
        try {
            const response = await fetch('http://localhost:3001/updatepi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: handleid,
                    tag,
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
        fetch('http://localhost:3001/api/deletepi', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: handleid, pipath: ipath }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('图片删除失败');
                }
                alert('图片删除成功');
            })
            .catch(error => {
                console.error('删除图片时出错:', error);
                alert('图片已销毁，本次操作仅删除数据库信息');
            });
        setShowConfirm(false);
    };
    const [url, setUrl] = useState('');

    useEffect(() => {
        // Express服务器设置的静态文件目录的路径
        const baseDir = 'D:/2024/dataset';
        // 使用 substring 和 lastIndexOf 转换为相对路径
        const relativePath = spath.substring(baseDir.length);
        const serverPath = '/dataset' + relativePath;
        setUrl(serverPath);
    }, []);
    return (
        <div className='cardbox'>
            <div className="card">
                <div className="card-image-container">
                    <img src={url} onClick={toggleDetails} />
                </div>
                <div className="card-content">
                    <div className='actions'>
                        {isAdmin && (
                            <span>
                                <button className="download-button" onClick={() => handleiEdit(id, stag)}>编辑</button>
                                <button className='download-button delete' onClick={() => handleiDelete(id, spath)}>删除</button>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {
                isExpanded === index && (
                    <div className="card-details">
                        <img src={url} />
                    </div>
                )
            }
            {isEditFormOpen && (
                <div className="document-form-popup">
                    <div className='form-popup'>
                        <h2>编辑图片</h2>
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

const ProductsImages = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [path, setPath] = useState('');
    const [tag, setTag] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageData, setImageData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('全部');
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});
    const [isExpanded, setIsExpanded] = useState(null);

    useEffect(() => {
        const userType = localStorage.getItem('userType');
        setIsAdmin(userType === 'admin');
    }, []);
    useEffect(() => {
        axios.get('http://localhost:3001/api/pi')
            .then(response => {
                setImageData(response.data);
                setFilteredDocuments(response.data);
            })
            .catch(error => console.error('Error fetching:', error));
    }, []);
    useEffect(() => {
        const tags = imageData.flatMap(doc => doc.tag.split(' ')); // 扁平化并分割标签
        const uniqueTags = [...new Set(tags)]; // 获取唯一的标签
        uniqueTags.unshift('全部'); // 在数组开始处添加'全部'
        setCategories(uniqueTags);
    }, [imageData]);
    // 分类标签的实现
    useEffect(() => {
        let filteredDs = imageData;
        if (activeCategory !== '全部') {
            filteredDs = imageData.filter(doc => doc.tag.includes(activeCategory));
        }
        setFilteredDocuments(filteredDs);
    }, [activeCategory, imageData]);

    // 返回每个类别的数量
    useEffect(() => {
        const categoryCounts = categories.reduce((acc, category) => {
            const count = imageData.filter(doc => {
                const tags = doc.tag.split(' ');
                return category === '全部' ? true : tags.includes(category);
            }).length;
            acc[category] = count;
            return acc;
        }, {});
        setCategoryCounts(categoryCounts);
    }, [categories, imageData]);


    const handleCloseForm = () => {
        setIsUploadFormOpen(false);
        setIsEditFormOpen(false);
        // 重置表单状态  
        setPath('');
        setTag('');
    };
    // 上传事件
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', selectedFile);
        // 定义允许的图片类型  
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/svg+xml'];

        if (!allowedImageTypes.includes(selectedFile.type)) {
            alert('不支持的文件格式。请上传 JPEG、PNG、GIF、BMP 或 SVG 格式的图片。');
            return;
        }

        if (!selectedFile || selectedFile.size === 0) {
            alert('请选择一个有效的图片文件。');
            return;
        }

        try {
            // 保存在本地
            const response = await fetch('http://localhost:3001/api/piupload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                alert('图片上传失败');
                return;
            }

            const fileUploadResult = await response.json();

            // 保存图片信息到数据库
            const formdbData = {
                path: fileUploadResult.path, // 使用服务器返回的文件路径
                tag,
            };

            try {
                const dbResponse = await fetch('http://localhost:3001/uploadpi', {
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
            console.error('图片上传时出错:', error);
            alert('图片上传失败');
        }
    };
    return (
        <div className='content'>
            <div className="imagepage">
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
                {isUploadFormOpen && (
                    <div className="document-form-popup">
                        <div className='form-popup'>
                            <h2>上传图片</h2>
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
            </div>
            <div className='material'>
                <div className="images">
                    <div className='gallery'>
                        {filteredDocuments.map((imageData, index) => (
                            <ImageCard
                                key={imageData.id}
                                id={(imageData.id)}
                                stag={imageData.tag}
                                spath={imageData.path}
                                isExpanded={isExpanded}
                                setIsExpanded={setIsExpanded}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsImages;