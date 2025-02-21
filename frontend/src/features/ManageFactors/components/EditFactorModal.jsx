import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

EditFactor.propTypes = {
    show: PropTypes.func,
    handleClose: PropTypes.func,
    modalTitle: PropTypes.string,
    selectedFactor: PropTypes.array,
    handleSubmit: PropTypes.func,
    setSelectedFactor: PropTypes.func,
    buttonContents: PropTypes.string
}

function EditFactor({show, handleClose, modalTitle, selectedFactor, handleSubmit, setSelectedFactor, buttonContents}) {

    function handleChange(event) {
        const {name, value} = event.target;
        setSelectedFactor((prevState) => ({ ...prevState, [name]: value }));
    }

    return (
        <div className="editModal">
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>{modalTitle} Conversion Factor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form>
                    <div className="input-group mb-3">
                        <label htmlFor="basic-url" className="form-label">Activity Name</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                name="activity"
                                placeholder={selectedFactor.activity}
                                onChange={handleChange}
                            ></input>
                        </div>
                    </div>
                    <div className="input-group mb-3">
                        <label htmlFor="basic-url" className="form-label">Activity Value</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={selectedFactor.value}
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                name="value"
                                onChange={handleChange}
                            ></input>
                            <span className="input-group-text" id="basic-addon2">kg CO2e</span>
                        </div>
                    </div>
                </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {buttonContents}
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EditFactor;