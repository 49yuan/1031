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
            const response = await fetch('http://localhost:3001/updatemi', {
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
        fetch('http://localhost:3001/api/deletemi', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: handleid, mipath: ipath }),
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

const MaterialsImages = () => {
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
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const [pageSize] = useState(20); // 每页显示的图片数，5的倍数
    const [currentDocuments, setCurrentDocuments] = useState([]); // 当前页面的文档

    useEffect(() => {
        const userType = localStorage.getItem('userType');
        setIsAdmin(userType === 'admin');
    }, []);
    useEffect(() => {
        axios.get('http://localhost:3001/api/mi')
            .then(response => {
                setImageData(response.data);
                setFilteredDocuments(response.data);
            })
            .catch(error => console.error('Error fetching:', error));
    }, []);
    useEffect(() => {
        const tags = imageData.flatMap(doc => doc.tag.split(' ')); // 扁平化并分割标签
        const uniqueTags = [...new Set(tags.filter(tag => tag !== ''))]; // 获取唯一的标签并过滤空字符串
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
        setCurrentPage(1);
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


    useEffect(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const paginatedImages = filteredDocuments.slice(start, end);
        setCurrentDocuments(paginatedImages);
    }, [currentPage, filteredDocuments]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

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
            const response = await fetch('http://localhost:3001/api/miupload', {
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
                const dbResponse = await fetch('http://localhost:3001/uploadmi', {
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
                        {currentDocuments.map((imageData, index) => (
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
            <div className='pagination'>
                <button
                    className={`page-button ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt; 前一页
                </button>
                {currentPage > 1 && (
                    <button
                        className="page-button"
                        onClick={() => handlePageChange(1)}
                    >
                        1
                    </button>
                )}
                {currentPage > 3 && (
                    <button
                        className="page-button"
                        onClick={() => handlePageChange(currentPage - 3)}
                    >
                        ...
                    </button>
                )}

                {currentPage - 1 > 1 && (
                    <button
                        className="page-button"
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        {currentPage - 1}
                    </button>
                )}
                <button
                    className={`page-button ${currentPage === currentPage ? 'active' : ''}`}
                >
                    {currentPage}
                </button>
                {currentPage + 1 < Math.ceil(filteredDocuments.length / pageSize) && (
                    <button
                        className="page-button"
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        {currentPage + 1}
                    </button>
                )}

                {(currentPage + 2 < Math.ceil(filteredDocuments.length / pageSize)) && (
                    <button
                        className="page-button"
                        onClick={() => handlePageChange(currentPage + 3)}
                    >
                        ...
                    </button>
                )}
                {(currentPage < Math.ceil(filteredDocuments.length / pageSize)) && (
                    <button
                        className="page-button"
                        onClick={() => handlePageChange(Math.ceil(filteredDocuments.length / pageSize))}
                    >
                        {Math.ceil(filteredDocuments.length / pageSize)}
                    </button>
                )}
                <button
                    className={`page-button ${currentPage === Math.ceil(filteredDocuments.length / pageSize) ? 'disabled' : ''}`}
                    onClick={() => currentPage < Math.ceil(filteredDocuments.length / pageSize) && handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredDocuments.length / pageSize)}
                >
                    后一页 &gt;
                </button>
                <input
                    type="number"
                    min="1"
                    max={Math.ceil(filteredDocuments.length / pageSize)}
                    value={currentPage}
                    onChange={(e) => {
                        const page = parseInt(e.target.value, 10);
                        if (page >= 1 && page <= Math.ceil(filteredDocuments.length / pageSize)) {
                            handlePageChange(page);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default MaterialsImages;
// const imagesData = [
//     {
//         id: 1,
//         image: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/3175268816/O1CN01kPW4Ou2Ezmfgehr14_!!0-item_pic.jpg_.webp',
//         tag: 'tag1 tag2'
//     },
//     {
//         id: 2,
//         image: 'https://img.alicdn.com/imgextra/i2/2212229958534/O1CN01HBmYW92Cud0ZJQvml_!!2212229958534.jpg_.webp',
//         tag: 'tag2 tag3'
//     },
//     {
//         id: 3,
//         image: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/3175268816/O1CN01kPW4Ou2Ezmfgehr14_!!0-item_pic.jpg_.webp',
//         tag: 'tag1 tag3'
//     },
//     {
//         id: 4,
//         image: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/3175268816/O1CN01kPW4Ou2Ezmfgehr14_!!0-item_pic.jpg_.webp',
//         tag: 'tag1 tag3'
//     },
//     {
//         id: 5,
//         image: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/3175268816/O1CN01kPW4Ou2Ezmfgehr14_!!0-item_pic.jpg_.webp',
//         tag: 'tag1 tag3'
//     },
//     {
//         id: 6,
//         image: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/3175268816/O1CN01kPW4Ou2Ezmfgehr14_!!0-item_pic.jpg_.webp',
//         tag: 'tag1 tag3'
//     },
//     // ...更多图片数据
// ];