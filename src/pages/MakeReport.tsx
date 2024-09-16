import React, { useState } from "react";
import { Button, Form, Alert, Image, CloseButton } from "react-bootstrap";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const MakeReport: React.FC = () => {
  const [cause, setCause] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [identityOfCasualties, setIdentityOfCasualties] = useState("");
  const [numberOfCasualties, setNumberOfCasualties] = useState(0);
  const [numberOfDisplacedPersons, setNumberOfDisplacedPersons] = useState(0);
  const [resourcesDeployed, setResourcesDeployed] = useState("");
  const [respondingAgencies, setRespondingAgencies] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      // Update images and previews
      setImages((prevImages) => [...prevImages, ...selectedFiles]);
      setImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...selectedFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Upload images
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
          await uploadBytes(imageRef, image);
          return await getDownloadURL(imageRef);
        })
      );

      // Add report to Firestore
      await addDoc(collection(db, "incidentReports"), {
        cause,
        dateTime,
        location,
        identityOfCasualties,
        numberOfCasualties,
        numberOfDisplacedPersons,
        resourcesDeployed,
        respondingAgencies,
        images: imageUrls,
      });

      // Clear form and show success message
      setCause("");
      setDateTime("");
      setLocation("");
      setIdentityOfCasualties("");
      setNumberOfCasualties(0);
      setNumberOfDisplacedPersons(0);
      setResourcesDeployed("");
      setRespondingAgencies("");
      setImages([]);
      setImagePreviews([]);
      setLoading(false);
      setError(null);

      // Navigate back to home page
      navigate("/"); // Adjust path as needed
    } catch (error) {
      setError("Failed to submit report. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Make a Report</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Cause</Form.Label>
          <Form.Control
            type="text"
            value={cause}
            onChange={(e) => setCause(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Identity of Casualties</Form.Label>
          <Form.Control
            type="text"
            value={identityOfCasualties}
            onChange={(e) => setIdentityOfCasualties(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Number of Casualties</Form.Label>
          <Form.Control
            type="number"
            value={numberOfCasualties}
            onChange={(e) => setNumberOfCasualties(parseInt(e.target.value))}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Number of Displaced Persons</Form.Label>
          <Form.Control
            type="number"
            value={numberOfDisplacedPersons}
            onChange={(e) =>
              setNumberOfDisplacedPersons(parseInt(e.target.value))
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Resources Deployed</Form.Label>
          <Form.Control
            type="text"
            value={resourcesDeployed}
            onChange={(e) => setResourcesDeployed(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Responding Agencies</Form.Label>
          <Form.Control
            type="text"
            value={respondingAgencies}
            onChange={(e) => setRespondingAgencies(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Images</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        {/* Display image previews with remove button */}
        <div className="mb-3 d-flex flex-wrap">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="position-relative mb-2 me-2">
              <Image
                src={preview}
                alt={`Preview ${index}`}
                fluid
                rounded
                style={{ maxHeight: "150px", objectFit: "cover" }}
              />
              <CloseButton
                className="position-absolute top-0 end-0"
                onClick={() => handleRemoveImage(index)}
                style={{ margin: "10px" }}
              />
            </div>
          ))}
        </div>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </Button>
      </Form>
    </div>
  );
};

export default MakeReport;
