import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { IncidentReport } from "./Home"; // Reuse type
import "./IncidentDetail.css"; // Custom styles

const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [incidentReport, setIncidentReport] = useState<IncidentReport | null>(
    null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchIncidentReport = async () => {
      if (id) {
        const docRef = doc(db, "incidentReports", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIncidentReport(docSnap.data() as IncidentReport);
        }
      }
    };

    fetchIncidentReport();
  }, [id]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && incidentReport) {
      setSelectedImageIndex(
        (selectedImageIndex + 1) % incidentReport.images.length
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && incidentReport) {
      setSelectedImageIndex(
        (selectedImageIndex - 1 + incidentReport.images.length) %
          incidentReport.images.length
      );
    }
  };

  if (!incidentReport) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <div className="card-body">
          <h2 className="card-title mb-4">{incidentReport.cause}</h2>
          <div className="row mb-4">
            <div className="col-md-6">
              <p>
                <strong>Date and Time:</strong> {incidentReport.dateTime}
              </p>
              <p>
                <strong>Location:</strong> {incidentReport.location}
              </p>
              <p>
                <strong>Casualties:</strong>{" "}
                {incidentReport.identityOfCasualties} (Number:{" "}
                {incidentReport.numberOfCasualties})
              </p>
              <p>
                <strong>Displaced Persons:</strong>{" "}
                {incidentReport.numberOfDisplacedPersons}
              </p>
              <p>
                <strong>Responding Agencies:</strong>{" "}
                {incidentReport.respondingAgencies}
              </p>
              <p>
                <strong>Resources Deployed:</strong>{" "}
                {incidentReport.resourcesDeployed}
              </p>
            </div>
            <div className="col-md-6">
              <h4>Images:</h4>
              <div className="image-collage">
                {incidentReport.images.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Incident ${index + 1}`}
                    className="collage-image img-thumbnail"
                    onClick={() => handleImageClick(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedImageIndex !== null && (
        <div
          className="modal show fade"
          style={{ display: "block" }}
          onClick={handleCloseModal}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-body position-relative">
                <img
                  src={incidentReport.images[selectedImageIndex]}
                  alt={`Incident ${selectedImageIndex + 1}`}
                  className="img-fluid modal-image"
                />
                <button
                  className="btn btn-light modal-prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                >
                  &larr; Previous
                </button>
                <button
                  className="btn btn-light modal-next"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDetail;
