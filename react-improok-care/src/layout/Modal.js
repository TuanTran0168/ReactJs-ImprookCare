import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalNotification(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        props.setShowModal(false);
    };

    const handleAction = () => {
        // if (props.bookingAction === "acceptBooking")
        //     props.acceptBooking()
        // else if (props.bookingAction === "denyBooking")
        //     props.denyBooking()
        props.bookingAction()
        handleClose();
    };

    return (
        <>
            <Modal show={props.showModal} onHide={handleClose} animation={false} style={{ zIndex: 9999, marginTop: "5rem" }}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.title}</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleAction}>
                        Ok
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalNotification;