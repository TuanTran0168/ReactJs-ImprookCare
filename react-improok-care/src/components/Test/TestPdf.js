import React, { useState } from 'react';

function TestPdf() {
    const [pdfUrl, setPdfUrl] = useState(null);

    const fetchPDF = async () => {
        const response = await fetch('http://localhost:2024/IMPROOK_CARE/api/public/generate-pdf/', {
            method: 'POST',
        });

        console.log(response)

        if (response.ok) {
            const blob = await response.blob(); // Chuyển phản hồi thành Blob
            const url = window.URL.createObjectURL(blob); // Tạo URL từ Blob

            console.log(url);
            setPdfUrl(url); // Gán URL cho iframe
        } else {
            console.error('Failed to fetch PDF');
        }
    };

    const downloadPDF = () => {
        if (pdfUrl) {
            // Tạo liên kết ẩn để kích hoạt tải xuống
            const link = document.createElement('a');
            link.href = pdfUrl; // Sử dụng URL Blob trong state
            link.download = 'test.pdf'; // Tên tệp khi tải xuống
            document.body.appendChild(link);

            // Kích hoạt tải xuống
            link.click();

            // Xóa liên kết ẩn
            document.body.removeChild(link);
        }
    };

    return (
        <div style={{ marginTop: '10rem' }}>
            <button onClick={fetchPDF}>Tạo PDF</button>
            {pdfUrl && (
                <>
                    <iframe
                        src={pdfUrl} // Hiển thị PDF
                        width="100%"
                        height="600px"
                        title="PDF Viewer"
                    />
                    <button onClick={downloadPDF}>Tải PDF</button> {/* Kích hoạt tải xuống */}
                </>
            )}
        </div>
    );
}

export default TestPdf;