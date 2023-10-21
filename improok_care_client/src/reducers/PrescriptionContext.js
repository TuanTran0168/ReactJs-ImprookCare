import { createContext, useState } from 'react';

export const PrescriptionContext = createContext();

export const PrescriptionProvider = ({ children }) => {
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedProfilePatientName, setSelectedProfilePatientName] = useState('');

    return (
        <PrescriptionContext.Provider
            value={{
                selectedBookingId,
                setSelectedBookingId,
                selectedProfilePatientName,
                setSelectedProfilePatientName,
            }}
        >
            {children}
        </PrescriptionContext.Provider>
    );
};