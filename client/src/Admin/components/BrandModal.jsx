import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { storage } from '../utils/FirebaseConfig'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from 'axios';

function BrandModal({loadData}) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [BrandName, setBrandName] = useState("")
    const [BrandImage, setBrandImage] = useState(null)

    const AddBrand = (e) => {
        e.preventDefault();



        const storageRef = ref(storage, `images/Brand/${BrandImage.name}`);
        uploadBytes(storageRef, BrandImage).then((snapshot) => {
            getDownloadURL(snapshot.ref)
                .then((url) => {
                    const payload = { BrandName, BrandImage: url }
                    axios.post(`http://localhost:1190/api/add-brand`, payload)
                        .then((json) => {
                            loadData();
                            setShow(false);
                        })
                        .catch(err => alert(err.message))

                })
                .catch((error) => alert(error.message));
        });

    }

    return (
        <>
            <Button variant="dark" onClick={handleShow}>
                Add Brand
            </Button>

            <Modal show={show} onHide={handleClose} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Add Brand</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form onSubmit={AddBrand}>
                        <div className="mb-3">
                            <label htmlFor="BrandName" className="form-label">
                                Brand Name
                            </label>
                            <input
                                value={BrandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                type="text"
                                className="form-control"
                                id="BrandName"
                                aria-describedby="emailHelp"
                            />

                        </div>

                        <div className="mb-3">
                            <label htmlFor="formFile" className="form-label">
                                Brand Image
                            </label>
                            <input className="form-control" onChange={(e) => setBrandImage(e.target.files[0])} type="file" id="formFile" />
                        </div>



                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </form>


                </Modal.Body>

            </Modal>
        </>
    );
}

export default BrandModal;