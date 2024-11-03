import React, { useState, useEffect } from 'react';
import SousuoButton from '../assets/SousuoButton.jsx';
import axios from 'axios';

const MaterialsDocuments = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [title, setTitle] = useState('');
    const [path, setPath] = useState('');
    const [tag, setTag] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [handleid, setHandleid] = useState('');
    const [handlepath, setHandlepath] = useState('');
    const [isalldelete, setIsAllDelete] = useState(false);
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
        axios.get('http://localhost:3001/api/md')
            .then(response => {
                setDocuments(response.data);
                setFilteredDocuments(response.data);
            })
            .catch(error => console.error('Error fetching documents:', error));
    }, []);

    const handleSearch = (e) => {
        if (searchKeyword === '') {
            setFilteredDocuments(documents);
        }
        else {
            //后端api，like模糊匹配
            axios.get('http://localhost:3001/api/searchmd', { params: { keyword: searchKeyword } })
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
        setTag('');
    };
    // 上传事件
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        // 先读取文件(判断格式是否正确)
        const formData = new FormData();
        formData.append('file', selectedFile);

        const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'text/plain'];
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
            // 保存在本地
            const response = await fetch('http://localhost:3001/api/mdupload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                alert('文件上传失败');
                return;
            }

            const fileUploadResult = await response.json();

            // 保存文件信息到数据库
            const formdbData = {
                title,
                path: fileUploadResult.path, // 使用服务器返回的文件路径
                tag,
            };

            try {
                const dbResponse = await fetch('http://localhost:3001/uploadmd', {
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
            console.error('文件上传时出错:', error);
            alert('文件上传失败');
        }
    };
    const downloadDocument = (filePath, fileName) => {
        const url = `http://localhost:3001/download?path=${encodeURIComponent(filePath)}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleiEdit = (id, title, tag) => {
        setIsEditFormOpen(true);
        setTitle(title);
        setTag(tag);
        setHandleid(id);
    }
    const handleEdit = async () => {
        // 处理编辑事件
        try {
            const response = await fetch('http://localhost:3001/updatemd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: handleid,
                    title,
                    tag,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                alert('更新成功');
                // 更新本地状态
                // const updatedDocuments = documents.map(doc =>
                //     doc.id === handleid ? { ...doc, title, tag } : doc
                // );
                // setDocuments(updatedDocuments);
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
        fetch('http://localhost:3001/api/deletemd', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: handleid, mdpath: ipath }),
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
        <div className='content'>
            <div className='outbox'>
                <div className="search-box">
                    <input type="text" placeholder="搜索素材..." onChange={e => setSearchKeyword(e.target.value)}></input>
                    <button type="button" className="search-icon-button" onClick={e => handleSearch(e)}>
                        <SousuoButton />
                    </button>
                </div>
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
                        <h2>上传文章</h2>
                        <input
                            type="text"
                            id='title'
                            placeholder="篇名"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {/* <input
                            type="text"
                            id='path'
                            placeholder="路径(此处填写你希望保存到本地硬盘的路径)"
                            // 也许可以设置保存在默认路径
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                        /> */}
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
            <div className='material'>
                <div className="document">
                    <table className='list'>
                        <thead>
                            <tr>
                                <th style={{ flex: '4' }}>篇名</th>
                                <th style={{ flex: '2' }}>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {andDocuments.map((doc) => (
                                <tr key={doc.id}>
                                    <td style={{ flex: '4' }}>{doc.title}</td>
                                    <td style={{ flex: '2' }}>
                                        <div className="actions">
                                            {/* <button onClick={() => viewDocument(doc.path)}>查看</button> */}
                                            <button onClick={() => downloadDocument(doc.path, doc.title)}>下载</button>
                                            {isAdmin && (
                                                <span>
                                                    <button onClick={() => handleiEdit(doc.id, doc.title, doc.tag)}>编辑</button>
                                                    <button className='delete' onClick={() => handleiDelete(doc.id, doc.path)}>删除</button>
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isEditFormOpen && (
                        <div className="document-form-popup">
                            <div className='form-popup'>
                                <h2>编辑文章</h2>
                                <div className='row'>
                                    <label>篇名：</label>
                                    <input
                                        type="text"
                                        id='title'
                                        placeholder="篇名"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
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
            </div>
        </div>
    )
}

export default MaterialsDocuments;

// //模拟数据
// const idocuments = [
//     {
//         id: 1,
//         title: 'Document Title 1',
//         tag: 'tag1 tag2',
//         path: ''
//     },
//     {
//         id: 2,
//         title: 'Document Title 2',
//         tag: 'tag2 tag3',
//         path: ''
//     },
//     {
//         id: 3,
//         title: 'Document Title 3',
//         tag: 'tag1 tag3',
//         path: ''
//     },
//     {
//         id: 4,
//         title: 'Document Title 4',
//         tag: 'tag2',
//         path: ''
//     },
//     {
//         id: 5,
//         title: 'Document Title 5',
//         tag: 'tag1 tag2 tag3',
//         path: ''
//     }
// ];
// useEffect(() => {
//     setDocuments(idocuments);
// }, []);