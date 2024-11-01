const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
// 允许跨域请求
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dataset', express.static(path.join('D:', '2024', 'dataset')));
// MySQL连接配置
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'test0409',
    database: 'materiallibrarydb'
});
connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

const util = require('util');

// 将回调函数的数据库查询转为 Promise
connection.query = util.promisify(connection.query);

/// 登录路由
app.post('/login', async (req, res) => {
    const { workNumber, password } = req.body;
    // console.log(workNumber, password);
    try {
        const rows = await connection.query('SELECT * FROM user WHERE work_number = ?', [workNumber]);
        const user = rows[0];
        // console.log(user);
        if (user && user.password === password) {
            const token = jwt.sign({ id: user.id, name: user.name }, 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ success: true, token: token, userType: user.user_type, name: user.name });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 注册路由
app.post('/register', async (req, res) => {
    const { name, workNumber, password, userType } = req.body;
    // const hashedPassword = bcrypt.hashSync(password, 8);
    try {
        await connection.query('INSERT INTO user (name,work_number, password, user_type) VALUES (?,?, ?, ?)', [name, workNumber, password, userType || 'user']);
        res.json({ success: true });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, message: '工号已存在' });
        } else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
});

//md即materialsDocuments
//返回全部
app.get('/api/md', (req, res) => {
    const sql = 'SELECT * FROM material_documents';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
app.get('/api/pd', (req, res) => {
    const sql = 'SELECT * FROM product_documents';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
app.get('/api/mi', (req, res) => {
    const sql = 'SELECT * FROM material_images';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
app.get('/api/pi', (req, res) => {
    const sql = 'SELECT * FROM product_images';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
app.get('/api/mb', (req, res) => {
    const sql = 'SELECT * FROM material_background';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
app.get('/api/mm', (req, res) => {
    const sql = 'SELECT * FROM material_music';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
app.get('/api/ms', (req, res) => {
    const sql = 'SELECT * FROM material_sound';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
app.get('/api/pm', (req, res) => {
    const sql = 'SELECT * FROM product_music';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
app.get('/api/pdv', (req, res) => {
    const sql = 'SELECT * FROM product_digitalv';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
app.get('/api/pv', (req, res) => {
    const sql = 'SELECT * FROM product_video';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
app.get('/api/mv', (req, res) => {
    const sql = 'SELECT * FROM material_video';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});



// 搜索素材文档
app.get('/api/searchmd', (req, res) => {
    const keyword = req.query.keyword; // 从查询参数中获取搜索关键词
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }

    // 构建SQL查询，使用LIKE进行模糊匹配
    const sql = 'SELECT * FROM material_documents WHERE title LIKE ?';
    const searchValue = `%${keyword}%`; // 使用%作为通配符进行模糊匹配

    // 执行查询
    connection.query(sql, [searchValue], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during search', error: err });
        }
        res.json(results); // 将匹配的结果返回给前端
    });
});
app.get('/api/searchpd', (req, res) => {
    const keyword = req.query.keyword; // 从查询参数中获取搜索关键词
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }

    // 构建SQL查询，使用LIKE进行模糊匹配
    const sql = 'SELECT * FROM product_documents WHERE title LIKE ?';
    const searchValue = `%${keyword}%`; // 使用%作为通配符进行模糊匹配

    // 执行查询
    connection.query(sql, [searchValue], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during search', error: err });
        }
        res.json(results); // 将匹配的结果返回给前端
    });
});
app.get('/api/searchmb', (req, res) => {
    const keyword = req.query.keyword; // 从查询参数中获取搜索关键词
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }

    // 构建SQL查询，使用LIKE进行模糊匹配
    const sql = 'SELECT * FROM material_background WHERE title LIKE ?';
    const searchValue = `%${keyword}%`; // 使用%作为通配符进行模糊匹配

    // 执行查询
    connection.query(sql, [searchValue], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during search', error: err });
        }
        res.json(results); // 将匹配的结果返回给前端
    });
});
app.get('/api/searchmm', (req, res) => {
    const keyword = req.query.keyword; // 从查询参数中获取搜索关键词
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }

    // 构建SQL查询，使用LIKE进行模糊匹配
    const sql = 'SELECT * FROM material_music WHERE title LIKE ?';
    const searchValue = `%${keyword}%`; // 使用%作为通配符进行模糊匹配

    // 执行查询
    connection.query(sql, [searchValue], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during search', error: err });
        }
        res.json(results); // 将匹配的结果返回给前端
    });
});
app.get('/api/searchms', (req, res) => {
    const keyword = req.query.keyword; // 从查询参数中获取搜索关键词
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }

    // 构建SQL查询，使用LIKE进行模糊匹配
    const sql = 'SELECT * FROM material_sound WHERE title LIKE ?';
    const searchValue = `%${keyword}%`; // 使用%作为通配符进行模糊匹配

    // 执行查询
    connection.query(sql, [searchValue], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during search', error: err });
        }
        res.json(results); // 将匹配的结果返回给前端
    });
});
app.get('/api/searchpm', (req, res) => {
    const keyword = req.query.keyword; // 从查询参数中获取搜索关键词
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }

    // 构建SQL查询，使用LIKE进行模糊匹配
    const sql = 'SELECT * FROM product_music WHERE title LIKE ?';
    const searchValue = `%${keyword}%`; // 使用%作为通配符进行模糊匹配

    // 执行查询
    connection.query(sql, [searchValue], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during search', error: err });
        }
        res.json(results); // 将匹配的结果返回给前端
    });
});
app.get('/api/searchpv', (req, res) => {
    const keyword = req.query.keyword; // 从查询参数中获取搜索关键词
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }

    // 构建SQL查询，使用LIKE进行模糊匹配
    const sql = 'SELECT * FROM product_video WHERE title LIKE ?';
    const searchValue = `%${keyword}%`; // 使用%作为通配符进行模糊匹配

    // 执行查询
    connection.query(sql, [searchValue], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during search', error: err });
        }
        res.json(results); // 将匹配的结果返回给前端
    });
});
app.get('/api/searchmv', (req, res) => {
    const keyword = req.query.keyword; // 从查询参数中获取搜索关键词
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }

    // 构建SQL查询，使用LIKE进行模糊匹配
    const sql = 'SELECT * FROM material_video WHERE title LIKE ?';
    const searchValue = `%${keyword}%`; // 使用%作为通配符进行模糊匹配

    // 执行查询
    connection.query(sql, [searchValue], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during search', error: err });
        }
        res.json(results); // 将匹配的结果返回给前端
    });
});
app.get('/api/searchpdv', (req, res) => {
    const keyword = req.query.keyword; // 从查询参数中获取搜索关键词
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }

    // 构建SQL查询，使用LIKE进行模糊匹配
    const sql = 'SELECT * FROM product_digitalv WHERE title LIKE ?';
    const searchValue = `%${keyword}%`; // 使用%作为通配符进行模糊匹配

    // 执行查询
    connection.query(sql, [searchValue], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during search', error: err });
        }
        res.json(results); // 将匹配的结果返回给前端
    });
});




// 处理文件上传
// 设置Multer存储配置
function getStorage(type) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            // 根据不同的类型设置不同的存储目录
            const baseDir = 'D:/2024/dataset';
            const directories = {
                'MaterialsDocuments': 'mdocuments',
                'MaterialsVideo': 'mvideo',
                'MaterialsMusic': 'mmusic',
                'MaterialsImages': 'mimages',
                'MaterialsBackground': 'mbackground',
                'MaterialsSound': 'msound',
                'ProductsDocuments': 'pdocuments',
                'ProductsDigitalV': 'pdigital',
                'ProductsImages': 'pimages',
                'ProductsMusic': 'pmusic',
                'ProductsVideo': 'pvideo'
            };
            const directory = directories[type];
            cb(null, path.join(baseDir, directory));
        },
        filename: function (req, file, cb) {
            // 设置文件名称为原始名称
            cb(null, file.originalname);
        }
    });
}
const uploadMaterialsDocuments = multer({ storage: getStorage('MaterialsDocuments') });
const uploadMaterialsVideo = multer({ storage: getStorage('MaterialsVideo') });
const uploadMaterialsMusic = multer({ storage: getStorage('MaterialsMusic') });
const uploadMaterialsImages = multer({ storage: getStorage('MaterialsImages') });
const uploadMaterialsBackground = multer({ storage: getStorage('MaterialsBackground') });
const uploadMaterialsSound = multer({ storage: getStorage('MaterialsSound') });
const uploadProductDocuments = multer({ storage: getStorage('ProductsDocuments') });
const uploadProductDigitalV = multer({ storage: getStorage('ProductsDigitalV') });
const uploadProductImages = multer({ storage: getStorage('ProductsImages') });
const uploadProductMusic = multer({ storage: getStorage('ProductsMusic') });
const uploadProductVideo = multer({ storage: getStorage('ProductsVideo') });
// 文件上传路由
app.post('/api/mdupload', uploadMaterialsDocuments.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ path: req.file.path });
});

app.post('/api/mvupload', uploadMaterialsVideo.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ path: req.file.path });
});
app.post('/api/mmupload', uploadMaterialsMusic.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ path: req.file.path });
});
app.post('/api/miupload', uploadMaterialsImages.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ path: req.file.path });
});
app.post('/api/mbupload', uploadMaterialsBackground.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ path: req.file.path });
});
app.post('/api/msupload', uploadMaterialsSound.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ path: req.file.path });
});
app.post('/api/mvupload', uploadMaterialsVideo.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ path: req.file.path });
});
app.post('/api/pdupload', uploadProductDocuments.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ path: req.file.path });
});
app.post('/api/pdvupload', uploadProductDigitalV.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ path: req.file.path });
});
app.post('/api/piupload', uploadProductImages.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ path: req.file.path });
});
app.post('/api/pmupload', uploadProductMusic.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ path: req.file.path });
});
app.post('/api/pvupload', uploadProductVideo.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ path: req.file.path });
});



app.post('/uploadmd', (req, res) => {
    const { title, path, tag } = req.body;

    // 构建SQL查询，插入文件信息到数据库
    const sql = 'INSERT INTO material_documents (title, path, tag) VALUES (?, ?, ?)';
    const values = [title, path, tag];

    // 执行查询
    connection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during saving to database', error: err });
        }
        res.json({ id: results.insertId, title: title }); // 返回新插入的记录的ID和标题
    });
});
app.post('/uploadpd', (req, res) => {
    const { title, path, tag } = req.body;

    // 构建SQL查询，插入文件信息到数据库
    const sql = 'INSERT INTO product_documents (title, path, tag) VALUES (?, ?, ?)';
    const values = [title, path, tag];

    // 执行查询
    connection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during saving to database', error: err });
        }
        res.json({ id: results.insertId, title: title }); // 返回新插入的记录的ID和标题
    });
});
app.post('/uploadmi', (req, res) => {
    const { path, tag } = req.body;

    // 构建SQL查询，插入文件信息到数据库
    const sql = 'INSERT INTO material_images ( path, tag) VALUES (?, ?)';
    const values = [path, tag];

    // 执行查询
    connection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during saving to database', error: err });
        }
        res.json({ id: results.insertId }); // 返回新插入的记录的ID和标题
    });
});
app.post('/uploadpi', (req, res) => {
    const { path, tag } = req.body;

    // 构建SQL查询，插入文件信息到数据库
    const sql = 'INSERT INTO product_images ( path, tag) VALUES (?, ?)';
    const values = [path, tag];

    // 执行查询
    connection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during saving to database', error: err });
        }
        res.json({ id: results.insertId }); // 返回新插入的记录的ID和标题
    });
});
app.post('/uploadmb', (req, res) => {
    const { title, path, tag } = req.body;

    // 构建SQL查询，插入文件信息到数据库
    const sql = 'INSERT INTO material_background (title, path, tag) VALUES (?, ?, ?)';
    const values = [title, path, tag];

    // 执行查询
    connection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during saving to database', error: err });
        }
        res.json({ id: results.insertId, title: title }); // 返回新插入的记录的ID和标题
    });
});
app.post('/uploadmm', (req, res) => {
    const { title, path, tag } = req.body;

    // 构建SQL查询，插入文件信息到数据库
    const sql = 'INSERT INTO material_music (title, path, tag) VALUES (?, ?, ?)';
    const values = [title, path, tag];

    // 执行查询
    connection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during saving to database', error: err });
        }
        res.json({ id: results.insertId, title: title }); // 返回新插入的记录的ID和标题
    });
});
app.post('/uploadms', (req, res) => {
    const { title, path, tag } = req.body;

    // 构建SQL查询，插入文件信息到数据库
    const sql = 'INSERT INTO material_sound (title, path, tag) VALUES (?, ?, ?)';
    const values = [title, path, tag];

    // 执行查询
    connection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during saving to database', error: err });
        }
        res.json({ id: results.insertId, title: title }); // 返回新插入的记录的ID和标题
    });
});
app.post('/uploadpm', (req, res) => {
    const { title, path, tag } = req.body;

    // 构建SQL查询，插入文件信息到数据库
    const sql = 'INSERT INTO product_music (title, path, tag) VALUES (?, ?, ?)';
    const values = [title, path, tag];

    // 执行查询
    connection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during saving to database', error: err });
        }
        res.json({ id: results.insertId, title: title }); // 返回新插入的记录的ID和标题
    });
});
app.post('/uploadmv', (req, res) => {
    const { title, path, tag } = req.body;

    // 构建SQL查询，插入文件信息到数据库
    const sql = 'INSERT INTO material_video (title, path, tag) VALUES (?, ?, ?)';
    const values = [title, path, tag];

    // 执行查询
    connection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during saving to database', error: err });
        }
        res.json({ id: results.insertId, title: title }); // 返回新插入的记录的ID和标题
    });
});
app.post('/uploadpv', (req, res) => {
    const { title, path, tag } = req.body;

    // 构建SQL查询，插入文件信息到数据库
    const sql = 'INSERT INTO product_video (title, path, tag) VALUES (?, ?, ?)';
    const values = [title, path, tag];

    // 执行查询
    connection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during saving to database', error: err });
        }
        res.json({ id: results.insertId, title: title }); // 返回新插入的记录的ID和标题
    });
});
app.post('/uploadpdv', (req, res) => {
    const { title, path, tag, anchor, technique } = req.body;

    // 构建SQL查询，插入文件信息到数据库
    const sql = 'INSERT INTO product_digitalv (title, path, tag,anchor,technique) VALUES (?, ?, ?,?,?)';
    const values = [title, path, tag, anchor, technique];

    // 执行查询
    connection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during saving to database', error: err });
        }
        res.json({ id: results.insertId, title: title }); // 返回新插入的记录的ID和标题
    });
});



//处理删除
app.delete('/api/deletemd', (req, res) => {
    const { id, mdpath } = req.body;
    console.log(id, mdpath);

    // 删除数据库中的记录
    deleteDatabaseRecord(id)
        .then(() => {
            if (mdpath) {
                console.log('删除文件已执行');
                return new Promise((resolve, reject) => {
                    fs.access(mdpath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            return reject({ status: 404, message: 'File does not exist' });
                        }

                        // 删除文件
                        fs.unlink(mdpath, (unlinkErr) => {
                            if (unlinkErr) {
                                return reject({ status: 500, message: 'Failed to delete file' });
                            }
                            resolve();
                        });
                    });
                });
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            res.json({ message: 'File and database information deleted successfully' });
        })
        .catch((error) => {
            res.status(error.status).json({ message: error.message });
        });
});

// 删除数据库记录的函数
function deleteDatabaseRecord(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM material_documents WHERE id = ?', [id], (err, result) => {
            if (err) {
                return reject({ status: 500, message: 'Error deleting from database', error: err });
            }
            resolve();
        });
    });
}
app.delete('/api/deletepd', (req, res) => {
    const { id, pdpath } = req.body;
    console.log(id, pdpath);

    // 删除数据库中的记录
    deleteDatabaseRecordpd(id)
        .then(() => {
            if (pdpath) {
                console.log('删除文件已执行');
                return new Promise((resolve, reject) => {
                    fs.access(pdpath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            return reject({ status: 404, message: 'File does not exist' });
                        }

                        // 删除文件
                        fs.unlink(pdpath, (unlinkErr) => {
                            if (unlinkErr) {
                                return reject({ status: 500, message: 'Failed to delete file' });
                            }
                            resolve();
                        });
                    });
                });
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            res.json({ message: 'File and database information deleted successfully' });
        })
        .catch((error) => {
            res.status(error.status).json({ message: error.message });
        });
});

// 删除数据库记录的函数
function deleteDatabaseRecordpd(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM product_documents WHERE id = ?', [id], (err, result) => {
            if (err) {
                return reject({ status: 500, message: 'Error deleting from database', error: err });
            }
            resolve();
        });
    });
}
app.delete('/api/deletemi', (req, res) => {
    const { id, mipath } = req.body;
    console.log(id, mipath);

    // 删除数据库中的记录
    deleteDatabaseRecordmi(id)
        .then(() => {
            if (mipath) {
                console.log('删除图片已执行');
                return new Promise((resolve, reject) => {
                    fs.access(mipath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            return reject({ status: 404, message: 'File does not exist' });
                        }

                        // 删除文件
                        fs.unlink(mipath, (unlinkErr) => {
                            if (unlinkErr) {
                                return reject({ status: 500, message: 'Failed to delete file' });
                            }
                            resolve();
                        });
                    });
                });
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            res.json({ message: 'File and database information deleted successfully' });
        })
        .catch((error) => {
            res.status(error.status).json({ message: error.message });
        });
});

// 删除数据库记录的函数
function deleteDatabaseRecordmi(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM material_images WHERE id = ?', [id], (err, result) => {
            if (err) {
                return reject({ status: 500, message: 'Error deleting from database', error: err });
            }
            resolve();
        });
    });
}
app.delete('/api/deletepi', (req, res) => {
    const { id, pipath } = req.body;
    console.log(id, pipath);

    // 删除数据库中的记录
    deleteDatabaseRecordpi(id)
        .then(() => {
            if (pipath) {
                console.log('删除图片已执行');
                return new Promise((resolve, reject) => {
                    fs.access(pipath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            return reject({ status: 404, message: 'File does not exist' });
                        }

                        // 删除文件
                        fs.unlink(pipath, (unlinkErr) => {
                            if (unlinkErr) {
                                return reject({ status: 500, message: 'Failed to delete file' });
                            }
                            resolve();
                        });
                    });
                });
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            res.json({ message: 'File and database information deleted successfully' });
        })
        .catch((error) => {
            res.status(error.status).json({ message: error.message });
        });
});

// 删除数据库记录的函数
function deleteDatabaseRecordpi(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM product_images WHERE id = ?', [id], (err, result) => {
            if (err) {
                return reject({ status: 500, message: 'Error deleting from database', error: err });
            }
            resolve();
        });
    });
}
app.delete('/api/deletemb', (req, res) => {
    const { id, mbpath } = req.body;
    console.log(id, mbpath);

    // 删除数据库中的记录
    deleteDatabaseRecordmb(id)
        .then(() => {
            if (mbpath) {
                console.log('删除文件已执行');
                return new Promise((resolve, reject) => {
                    fs.access(mbpath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            return reject({ status: 404, message: 'File does not exist' });
                        }

                        // 删除文件
                        fs.unlink(mbpath, (unlinkErr) => {
                            if (unlinkErr) {
                                return reject({ status: 500, message: 'Failed to delete file' });
                            }
                            resolve();
                        });
                    });
                });
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            res.json({ message: 'File and database information deleted successfully' });
        })
        .catch((error) => {
            res.status(error.status).json({ message: error.message });
        });
});

// 删除数据库记录的函数
function deleteDatabaseRecordmb(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM material_background WHERE id = ?', [id], (err, result) => {
            if (err) {
                return reject({ status: 500, message: 'Error deleting from database', error: err });
            }
            resolve();
        });
    });
}

app.delete('/api/deletemm', (req, res) => {
    const { id, mmpath } = req.body;
    console.log(id, mmpath);

    // 删除数据库中的记录
    deleteDatabaseRecordmm(id)
        .then(() => {
            if (mmpath) {
                console.log('删除文件已执行');
                return new Promise((resolve, reject) => {
                    fs.access(mmpath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            return reject({ status: 404, message: 'File does not exist' });
                        }

                        // 删除文件
                        fs.unlink(mmpath, (unlinkErr) => {
                            if (unlinkErr) {
                                return reject({ status: 500, message: 'Failed to delete file' });
                            }
                            resolve();
                        });
                    });
                });
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            res.json({ message: 'File and database information deleted successfully' });
        })
        .catch((error) => {
            res.status(error.status).json({ message: error.message });
        });
});

// 删除数据库记录的函数
function deleteDatabaseRecordmm(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM material_music WHERE id = ?', [id], (err, result) => {
            if (err) {
                return reject({ status: 500, message: 'Error deleting from database', error: err });
            }
            resolve();
        });
    });
}

app.delete('/api/deletems', (req, res) => {
    const { id, mspath } = req.body;
    console.log(id, mspath);

    // 删除数据库中的记录
    deleteDatabaseRecordms(id)
        .then(() => {
            if (mspath) {
                console.log('删除文件已执行');
                return new Promise((resolve, reject) => {
                    fs.access(mspath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            return reject({ status: 404, message: 'File does not exist' });
                        }

                        // 删除文件
                        fs.unlink(mspath, (unlinkErr) => {
                            if (unlinkErr) {
                                return reject({ status: 500, message: 'Failed to delete file' });
                            }
                            resolve();
                        });
                    });
                });
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            res.json({ message: 'File and database information deleted successfully' });
        })
        .catch((error) => {
            res.status(error.status).json({ message: error.message });
        });
});

// 删除数据库记录的函数
function deleteDatabaseRecordms(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM material_sound WHERE id = ?', [id], (err, result) => {
            if (err) {
                return reject({ status: 500, message: 'Error deleting from database', error: err });
            }
            resolve();
        });
    });
}

app.delete('/api/deletepm', (req, res) => {
    const { id, pmpath } = req.body;
    console.log(id, pmpath);

    // 删除数据库中的记录
    deleteDatabaseRecordpm(id)
        .then(() => {
            if (pmpath) {
                console.log('删除文件已执行');
                return new Promise((resolve, reject) => {
                    fs.access(pmpath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            return reject({ status: 404, message: 'File does not exist' });
                        }

                        // 删除文件
                        fs.unlink(pmpath, (unlinkErr) => {
                            if (unlinkErr) {
                                return reject({ status: 500, message: 'Failed to delete file' });
                            }
                            resolve();
                        });
                    });
                });
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            res.json({ message: 'File and database information deleted successfully' });
        })
        .catch((error) => {
            res.status(error.status).json({ message: error.message });
        });
});

// 删除数据库记录的函数
function deleteDatabaseRecordpm(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM product_music WHERE id = ?', [id], (err, result) => {
            if (err) {
                return reject({ status: 500, message: 'Error deleting from database', error: err });
            }
            resolve();
        });
    });
}
app.delete('/api/deletepv', (req, res) => {
    const { id, pvpath } = req.body;
    console.log(id, pvpath);

    // 删除数据库中的记录
    deleteDatabaseRecordpv(id)
        .then(() => {
            if (pvpath) {
                console.log('删除文件已执行');
                return new Promise((resolve, reject) => {
                    fs.access(pvpath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            return reject({ status: 404, message: 'File does not exist' });
                        }

                        // 删除文件
                        fs.unlink(pvpath, (unlinkErr) => {
                            if (unlinkErr) {
                                return reject({ status: 500, message: 'Failed to delete file' });
                            }
                            resolve();
                        });
                    });
                });
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            res.json({ message: 'File and database information deleted successfully' });
        })
        .catch((error) => {
            res.status(error.status).json({ message: error.message });
        });
});

// 删除数据库记录的函数
function deleteDatabaseRecordpv(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM product_video WHERE id = ?', [id], (err, result) => {
            if (err) {
                return reject({ status: 500, message: 'Error deleting from database', error: err });
            }
            resolve();
        });
    });
}
app.delete('/api/deletemv', (req, res) => {
    const { id, mvpath } = req.body;
    console.log(id, mvpath);

    // 删除数据库中的记录
    deleteDatabaseRecordmv(id)
        .then(() => {
            if (mvpath) {
                console.log('删除文件已执行');
                return new Promise((resolve, reject) => {
                    fs.access(mvpath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            return reject({ status: 404, message: 'File does not exist' });
                        }

                        // 删除文件
                        fs.unlink(mvpath, (unlinkErr) => {
                            if (unlinkErr) {
                                return reject({ status: 500, message: 'Failed to delete file' });
                            }
                            resolve();
                        });
                    });
                });
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            res.json({ message: 'File and database information deleted successfully' });
        })
        .catch((error) => {
            res.status(error.status).json({ message: error.message });
        });
});

// 删除数据库记录的函数
function deleteDatabaseRecordmv(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM material_video WHERE id = ?', [id], (err, result) => {
            if (err) {
                return reject({ status: 500, message: 'Error deleting from database', error: err });
            }
            resolve();
        });
    });
}
app.delete('/api/deletepdv', (req, res) => {
    const { id, pdvpath } = req.body;
    console.log(id, pdvpath);

    // 删除数据库中的记录
    deleteDatabaseRecordpdv(id)
        .then(() => {
            if (pdvpath) {
                console.log('删除文件已执行');
                return new Promise((resolve, reject) => {
                    fs.access(pdvpath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            return reject({ status: 404, message: 'File does not exist' });
                        }

                        // 删除文件
                        fs.unlink(pdvpath, (unlinkErr) => {
                            if (unlinkErr) {
                                return reject({ status: 500, message: 'Failed to delete file' });
                            }
                            resolve();
                        });
                    });
                });
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            res.json({ message: 'File and database information deleted successfully' });
        })
        .catch((error) => {
            res.status(error.status).json({ message: error.message });
        });
});

// 删除数据库记录的函数
function deleteDatabaseRecordpdv(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM product_digitalv WHERE id = ?', [id], (err, result) => {
            if (err) {
                return reject({ status: 500, message: 'Error deleting from database', error: err });
            }
            resolve();
        });
    });
}



//编辑路由
app.post('/updatemd', (req, res) => {
    const { id, title, tag } = req.body;

    updateDatabaseRecord(id, title, tag)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message });
        });
});

// 更新数据库记录的函数
function updateDatabaseRecord(id, title, tag) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE material_documents SET title = ?, tag = ? WHERE id = ?';
        connection.query(query, [title, tag, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
app.post('/updatepd', (req, res) => {
    const { id, title, tag } = req.body;

    updateDatabaseRecordpd(id, title, tag)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message });
        });
});

// 更新数据库记录的函数
function updateDatabaseRecordpd(id, title, tag) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE product_documents SET title = ?, tag = ? WHERE id = ?';
        connection.query(query, [title, tag, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
app.post('/updatemi', (req, res) => {
    const { id, tag } = req.body;

    updateDatabaseRecordmi(id, tag)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message });
        });
});

// 更新数据库记录的函数
function updateDatabaseRecordmi(id, tag) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE material_images SET tag = ? WHERE id = ?';
        connection.query(query, [tag, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
app.post('/updatepi', (req, res) => {
    const { id, tag } = req.body;

    updateDatabaseRecordpi(id, tag)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message });
        });
});

// 更新数据库记录的函数
function updateDatabaseRecordpi(id, tag) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE product_images SET tag = ? WHERE id = ?';
        connection.query(query, [tag, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
app.post('/updatemb', (req, res) => {
    const { id, title, tag } = req.body;

    updateDatabaseRecordmb(id, title, tag)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message });
        });
});

// 更新数据库记录的函数
function updateDatabaseRecordmb(id, title, tag) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE material_background SET title = ?, tag = ? WHERE id = ?';
        connection.query(query, [title, tag, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
app.post('/updatemm', (req, res) => {
    const { id, title, tag } = req.body;

    updateDatabaseRecordmm(id, title, tag)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message });
        });
});

// 更新数据库记录的函数
function updateDatabaseRecordmm(id, title, tag) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE material_music SET title = ?, tag = ? WHERE id = ?';
        connection.query(query, [title, tag, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
app.post('/updatems', (req, res) => {
    const { id, title, tag } = req.body;

    updateDatabaseRecordms(id, title, tag)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message });
        });
});

// 更新数据库记录的函数
function updateDatabaseRecordms(id, title, tag) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE material_sound SET title = ?, tag = ? WHERE id = ?';
        connection.query(query, [title, tag, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
app.post('/updatepm', (req, res) => {
    const { id, title, tag } = req.body;

    updateDatabaseRecordpm(id, title, tag)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message });
        });
});

// 更新数据库记录的函数
function updateDatabaseRecordpm(id, title, tag) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE product_music SET title = ?, tag = ? WHERE id = ?';
        connection.query(query, [title, tag, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
app.post('/updatepv', (req, res) => {
    const { id, title, tag } = req.body;

    updateDatabaseRecordpv(id, title, tag)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message });
        });
});

// 更新数据库记录的函数
function updateDatabaseRecordpv(id, title, tag) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE product_video SET title = ?, tag = ? WHERE id = ?';
        connection.query(query, [title, tag, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
app.post('/updatemv', (req, res) => {
    const { id, title, tag } = req.body;

    updateDatabaseRecordmv(id, title, tag)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message });
        });
});

// 更新数据库记录的函数
function updateDatabaseRecordmv(id, title, tag) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE material_video SET title = ?, tag = ? WHERE id = ?';
        connection.query(query, [title, tag, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

app.post('/updatepdv', (req, res) => {
    const { id, title, tag, anchor, technique } = req.body;

    updateDatabaseRecordpdv(id, title, tag, anchor, technique)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message });
        });
});

// 更新数据库记录的函数
function updateDatabaseRecordpdv(id, title, tag, anchor, technique) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE product_digitalv SET title = ?, tag = ?,anchor=?,technique=? WHERE id = ?';
        connection.query(query, [title, tag, anchor, technique, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}




//查看文件
// 设置静态文件目录
// app.use('/static', express.static(path.join(__dirname, 'public', 'documents')));

// 下载文件的路由
// app.get('/download', (req, res) => {
//     const absolutePath = req.query.path; // 从查询参数中获取绝对路径

//     // 检查文件是否存在
//     if (fs.existsSync(absolutePath)) {
//         console.log('进入下载');
//         res.download(absolutePath, (err) => {
//             if (err) {
//                 console.error('Error downloading file:', err);
//                 res.status(500).send('Error downloading file');
//             }
//         });
//         //方法二：
//         // const filename = path.basename(absolutePath); // 获取文件名
//         // const readStream = fs.createReadStream(absolutePath); // 创建输入流入口
//         // // 设置响应头
//         // res.writeHead(200, {
//         //     'Content-Type': 'application/octet-stream', // 或者根据文件类型设置
//         //     'Content-Disposition': `attachment; filename="${filename}"` // 设置下载的文件名
//         // });
//         // // 通过管道方式写入
//         // readStream.pipe(res);
//     } else {
//         res.status(404).send('File not found');
//     }
// });
app.get('/download', (req, res) => {
    const filePath = req.query.path;
    if (fs.existsSync(filePath)) {
        const filename = path.basename(filePath);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.status(404).send('File not found');
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});