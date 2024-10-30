//音频可视化，但是太慢了
//来源：https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
import React, { useRef, useEffect, useCallback } from 'react';

const AudioVisualizer = ({ audioSrc, isPlaying }) => {
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const gainNodeRef = useRef(null);
    const sourceRef = useRef(null);
    const isPlayingRef = useRef(isPlaying);

    useEffect(() => {
        // 创建AudioContext实例
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        // 创建AnalyserNode和GainNode
        const analyser = audioContext.createAnalyser();
        const gainNode = audioContext.createGain();
        analyserRef.current = analyser;
        gainNodeRef.current = gainNode;

        // 设置AnalyserNode的fftSize
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // 获取canvas元素和上下文
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // 准备播放音频
        const audioElement = new Audio(audioSrc);
        const source = audioContext.createMediaElementSource(audioElement);
        sourceRef.current = source;

        // 连接节点
        source.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // 绘制频率数据到canvas
        const draw = () => {
            if (isPlayingRef.current) {
                requestAnimationFrame(draw);

                analyser.getByteFrequencyData(dataArray);

                context.fillStyle = 'rgb(0, 0, 0)';
                context.fillRect(0, 0, canvas.width, canvas.height);

                context.lineWidth = 2;
                context.strokeStyle = 'rgb(255, 255, 255)';

                const sliceWidth = (canvas.width * 1.0) / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = v * canvas.height;

                    if (i === 0) {
                        context.moveTo(x, y);
                    } else {
                        context.lineTo(x, y);
                    }
                    x += sliceWidth;
                }

                context.lineTo(canvas.width, canvas.height);
                context.lineTo(0, canvas.height);
                context.stroke();
            }
        };

        draw();

        // 监听isPlaying状态变化
        const handleIsPlayingChange = () => {
            isPlayingRef.current = isPlaying;
            if (isPlaying) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
        };

        handleIsPlayingChange();

        // 监听isPlaying属性变化
        const unsubscribe = isPlayingRef.current
            ? null
            : audioContextRef.current.onstatechange = () => {
                if (audioContextRef.current.state === 'running' && !isPlayingRef.current) {
                    audioElement.pause();
                } else if (audioContextRef.current.state === 'suspended' && isPlayingRef.current) {
                    audioContextRef.current.resume();
                    audioElement.play();
                }
            };

        // 清理资源
        return () => {
            unsubscribe?.();
            if (audioElement) {
                audioElement.pause();
                audioElement.src = '';
            }
            sourceRef.current?.disconnect();
            analyserRef.current?.disconnect();
            gainNodeRef.current?.disconnect();
            if (audioContextRef.current.state === 'running') {
                audioContextRef.current.close();
            }
        };
    }, [audioSrc, isPlaying]);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100px' }} />;
};

export default AudioVisualizer;