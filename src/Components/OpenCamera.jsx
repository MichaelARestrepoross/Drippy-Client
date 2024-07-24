import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

function OpenCamera({ isCameraOpen, setIsCameraOpen, setCapturedImage }) {
  const [currentCameraId, setCurrentCameraId] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null); // Ref to store the media stream
  const nextCameraIdRef = useRef(null); // Ref to store the next camera ID

  const getVideoDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameraDevices(videoDevices);
      if (videoDevices.length > 0) {
        setCurrentCameraId(videoDevices[0].deviceId); // Select the first camera by default
      }
    } catch (error) {
      console.error('Error listing devices:', error);
    }
  };

  const openCamera = async (deviceId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId } });
      mediaStreamRef.current = stream; // Store the media stream in the ref
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
      console.log('Camera opened');
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  };

  const stopStreamTracks = (stream) => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        track.stop(); // Stop each track
        console.log('Stopped track:', track);
      });
    }
  };

  const closeCamera = () => {
    if (mediaStreamRef.current) {
      stopStreamTracks(mediaStreamRef.current); // Stop all tracks
      mediaStreamRef.current = null; // Clear the media stream ref
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear the video source
      }
      console.log('Camera stream cleared');
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        console.log('Captured image:', dataUrl);
        
        closeCamera();
        setIsCameraOpen(false); // Close the modal after taking the picture
      } else {
        console.log('Video dimensions not available yet.');
      }
    }
  };

  const switchCamera = async () => {
    if (cameraDevices.length > 0) {
      const currentIndex = cameraDevices.findIndex(device => device.deviceId === currentCameraId);
      const nextIndex = (currentIndex + 1) % cameraDevices.length;
      const nextCameraId = cameraDevices[nextIndex].deviceId;
      nextCameraIdRef.current = nextCameraId;
      closeCamera(); // Close the current camera
      setCurrentCameraId(nextCameraId); // Update the camera ID to the next one
    }
  };

  useEffect(() => {
    const initializeCamera = async () => {
      await getVideoDevices();
    };

    if (isCameraOpen) {
      initializeCamera();
    } else {
      closeCamera();
    }

    return () => {
      closeCamera(); // Ensure camera is closed on unmount
    };
  }, [isCameraOpen]);

  useEffect(() => {
    if (currentCameraId) {
      openCamera(currentCameraId);
    }
  }, [currentCameraId]);

  const Modal = ({ children, onClose }) => {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-8 pt-8 pl-8 pr-8 rounded shadow-lg relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Close
          </button>
          {children}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      {isCameraOpen && (
        <Modal onClose={() => setIsCameraOpen(false)}>
          <div className="flex flex-col items-center">
            <video ref={videoRef} className="w-full max-w-md mb-4" autoPlay playsInline></video>
            <div>
              <button 
                onClick={takePicture}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                Take Picture
              </button>
              <button 
                onClick={() => setIsCameraOpen(false)}
                className="bg-red-500 text-white px-10 py-2 rounded hover:bg-red-600 transition ml-4"
              >
                Close Camera
              </button>
              <button 
                onClick={switchCamera}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ml-4"
              >
                Switch Camera
              </button>
            </div>
          </div>
        </Modal>
      )}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}

export default OpenCamera;
