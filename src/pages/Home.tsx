// Home.tsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { Card, Button } from "react-bootstrap";

export type IncidentReport = {
  id: string;
  cause: string;
  dateTime: string;
  identityOfCasualties: string;
  images: string[];
  location: string;
  numberOfCasualties: number;
  numberOfDisplacedPersons: number;
  resourcesDeployed: string;
  respondingAgencies: string;
};

const Home: React.FC = () => {
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);

  useEffect(() => {
    const fetchIncidentReports = async () => {
      const querySnapshot = await getDocs(collection(db, "incidentReports"));
      const reportsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          cause: data.cause || "",
          dateTime: data.dateTime || "",
          identityOfCasualties: data.identityOfCasualties || "",
          images: data.images || [],
          location: data.location || "",
          numberOfCasualties: data.numberOfCasualties || 0,
          numberOfDisplacedPersons: data.numberOfDisplacedPersons || 0,
          resourcesDeployed: data.resourcesDeployed || "",
          respondingAgencies: data.respondingAgencies || "",
        } as IncidentReport;
      });
      setIncidentReports(reportsData);
    };

    fetchIncidentReports();
  }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>Incident Reports</h2>
        <Link to="/make-report">
          <Button variant="success">Make Report</Button>
        </Link>
      </div>

      <div className="row">
        {incidentReports.map((report) => (
          <div className="col-md-4 mb-3" key={report.id}>
            <Card>
              <Card.Img
                variant="top"
                src={report.images[0] || "placeholder-image-url"}
                height="200px"
              />
              <Card.Body>
                <Card.Title>{report.cause}</Card.Title>
                <Card.Text>
                  <strong>Location:</strong> {report.location}
                  <br />
                  <strong>Date and Time:</strong> {report.dateTime}
                </Card.Text>
                <Link to={`/incident/${report.id}`}>
                  <Button variant="primary">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
