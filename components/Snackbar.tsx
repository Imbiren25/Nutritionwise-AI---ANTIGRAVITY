
import React, { useEffect, useState } from 'react';
import Icon from './Icon';

interface SnackbarProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            // Allow time for fade-out animation before calling onClose
            setTimeout(onClose, 300);
        }, 2700);

        return () => clearTimeout(timer);
    }, [message, onClose]);

    const bgColor = type === 'success' ? 'bg-success-green' : 'bg-error-red';
    const iconName = type === 'success' ? 'checklist' : 'delete';

    return (
        <div 
            className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 flex items-center p-4 rounded-lg text-white shadow-lg transition-all duration-300 transform ${bgColor} ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ zIndex: 100 }}
        >
            <Icon name={iconName} className="w-6 h-6 mr-3" />
            <span>{message}</span>
        </div>
    );
};

export default Snackbar;
