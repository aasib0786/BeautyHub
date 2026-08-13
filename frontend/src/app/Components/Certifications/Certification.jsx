// components/CertificationModal.js
"use client";
import { useState } from "react";
import  "./Certification.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

export default function Certification() {
  const [show, setShow] = useState(false);

  return (
    <div className="container text-center mt-5">
      <Button className="certBtn" onClick={() => setShow(true)}>
        View Certification
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header className="headerSection text-light" closeButton>
          <Modal.Title className="text-light">Website Certification</Modal.Title>
          
        </Modal.Header>

        <Modal.Body >
          <embed
            src="/certification.pdf"
            type="application/pdf"
            width="100%"
            height="80vh"
            className="pdfViewer"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary "  onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}



