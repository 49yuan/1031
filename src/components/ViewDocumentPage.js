import React from 'react';
import { useLocation } from 'react-router-dom';

const ViewDocumentPage = () => {
    const location = useLocation();
    const fileUrl = new URLSearchParams(location.search).get('url');

    return (
        <div>
            <iframe id="myIframe" src={fileUrl} style={{ width: '100%', height: '100vh' }} />
        </div>
    );
};

export default ViewDocumentPage;