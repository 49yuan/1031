import React, { useEffect, useState } from 'react';

function FaceMatchPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [matchImage, setMatchImage] = useState([]);
    const [matchVideo, setMatchVideo] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const fetchMatchData = async (url, formData) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('img', file);

            const imageData = await fetchMatchData('http://teio.xyz:8080/api/face_align_image', formData);
            const videoData = await fetchMatchData('http://teio.xyz:8080/api/face_align_video', formData);

            const updatePaths = (data, baseDir) =>
                data.map(item => {
                    const absolutePath = item.path;
                    const relativePath = absolutePath.substring(baseDir.length).replace(/\\/g, '/');
                    const serverPath = `/dataset${relativePath}`;
                    return { ...item, url: serverPath };
                });

            const updatedImageData = Array.isArray(imageData) && imageData.length > 0 ? updatePaths(imageData, 'D:/2024/dataset') : [];
            const updatedVideoData = Array.isArray(videoData) && videoData.length > 0 ? updatePaths(videoData, 'D:/2024/dataset') : [];

            console.log('img:', imageData, 'Video:', videoData);
            setMatchImage(updatedImageData);
            setMatchVideo(updatedVideoData);

        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='content facematch'>
            <h1>上传图片匹配对应人物资料</h1>
            <br />
            <input type="file" onChange={handleFileChange} />
            <div><button onClick={handleUpload}>开始匹配</button></div>
            {loading && (
                <div className='load'>
                    <div className="loader" >
                        <div id="ld4">
                            <div>
                            </div>
                            <div>
                            </div>
                            <div>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div>
                <h2>Matched Images:</h2>
                <div className="images">
                    <div className='gallery'>
                        {matchImage.map((result, index) => (
                            <div className='cardbox' key={index}>
                                <div className="card">
                                    <div className="card-image-container">
                                        <img src={result.image} alt="Matched Image" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <h2>Matched Videos:</h2>
                <div className='videos'>
                    {matchVideo.map((result, index) => (
                        <div className="video-card">
                            <div className='card-video-container'>
                                <video
                                    width="100%"
                                    height="100%"
                                    controls
                                    src={result.url}
                                />
                            </div>
                            <div className="card-content">
                                <div className='card-title' title={result.title}>{result.title}</div>
                            </div>
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    );
}

export default FaceMatchPage;

// 前端模拟数据
// useEffect(() => {
//     const initialData = [
//         {
//             id: 1,
//             image: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/3175268816/O1CN01kPW4Ou2Ezmfgehr14_!!0-item_pic.jpg_.webp',
//             tag: 'tag1 tag2'
//         },
//         {
//             id: 2,
//             image: 'https://img.alicdn.com/imgextra/i2/2212229958534/O1CN01HBmYW92Cud0ZJQvml_!!2212229958534.jpg_.webp',
//             tag: 'tag2 tag3'
//         },
//         {
//             id: 3,
//             image: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/3175268816/O1CN01kPW4Ou2Ezmfgehr14_!!0-item_pic.jpg_.webp',
//             tag: 'tag1 tag3'
//         },
//         {
//             id: 4,
//             image: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/3175268816/O1CN01kPW4Ou2Ezmfgehr14_!!0-item_pic.jpg_.webp',
//             tag: 'tag1 tag3'
//         },
//     ];
//     setMatchImage(initialData);
//     const initialVData = [
//         {
//             id: 1,
//             url: 'https://cloud.video.taobao.com/play/u/80827497/p/2/e/6/t/1/474905473544.mp4?appKey=38829',
//             title: 'tag1 tag2',
//             anchor: '111',
//             technique: '12345'
//         },
//         {
//             id: 2,
//             url: 'https://cloud.video.taobao.com/play/u/80827497/p/2/e/6/t/1/474905473544.mp4?appKey=38829',
//             title: 'tag2 tag3',
//             anchor: '111',
//             technique: '12345'
//         },
//     ];
//     setMatchVideo(initialVData);
//     setMatchDigital(initialVData);
// }, []);

