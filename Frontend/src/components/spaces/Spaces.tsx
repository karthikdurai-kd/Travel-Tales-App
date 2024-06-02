import { useState, useEffect } from "react";
import SpaceComponent from "./SpaceComponent";
import { DataService } from "../../services/DataService";
import { NavLink } from "react-router-dom";
import { SpaceEntry } from "../../model/SpaceEntry";
import "../../styles/SpacesStyle.css";

interface SpacesProps {
  dataService: DataService;
}

export default function Spaces(props: SpacesProps) {
  const [spaces, setSpaces] = useState<SpaceEntry[]>();
  const [reservationText, setReservationText] = useState<string>();

  useEffect(() => {
    const getSpaces = async () => {
      console.log("getting spaces....");
      const spaces = await props.dataService.getSpaces();
      setSpaces(spaces);
    };
    getSpaces();
  }, []);

  async function reserveSpace(spaceId: string, spaceName: string) {
    const reservationResult = await props.dataService.reserveSpace(spaceId);
    setReservationText(
      `You reserved ${spaceName}, reservation id: ${reservationResult}`
    );
  }

  function renderSpaces() {
    if (!props.dataService.isAuthorized()) {
      return (
        <NavLink to={"/login"}>
          <div className="button-div">
            <button className="get-started-button">Get Started</button>
          </div>
        </NavLink>
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[] = [];
    if (spaces) {
      for (const spaceEntry of spaces) {
        rows.push(
          <SpaceComponent
            key={spaceEntry.id}
            id={spaceEntry.id}
            location={spaceEntry.location}
            name={spaceEntry.name}
            photoURL={spaceEntry.photoURL}
            reserveSpace={reserveSpace}
          />
        );
      }
    }

    return rows;
  }

  return (
    <div>
      <h2 className="page-heading">Travel Tales</h2>
      {reservationText ? <h2>{reservationText}</h2> : undefined}
      {renderSpaces()}
    </div>
  );
}
