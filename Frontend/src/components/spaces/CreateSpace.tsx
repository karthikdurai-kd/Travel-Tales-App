import { SyntheticEvent, useState } from "react";
import { NavLink } from "react-router-dom";
import { DataService } from "../../services/DataService";
import "../../styles/CreateSpaceStyle.css";

type CreateSpaceProps = {
  dataService: DataService;
};

type CustomEvent = {
  target: HTMLInputElement;
};

export default function CreateSpace({ dataService }: CreateSpaceProps) {
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [photo, setPhoto] = useState<File | undefined>();
  const [actionResult, setActionResult] = useState<string>("");

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (name && location) {
      const id = await dataService.createSpace(name, location, photo);
      setActionResult(`Created space with id ${id}`);
      setName("");
      setLocation("");
    } else {
      setActionResult("Please provide a name and a location!");
    }
  };

  function setPhotoUrl(event: CustomEvent) {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  }

  function renderPhoto() {
    if (photo) {
      const localPhotoURL = URL.createObjectURL(photo);
      return <img alt="" src={localPhotoURL} style={{ maxWidth: "200px" }} />;
    }
  }

  function renderForm() {
    if (!dataService.isAuthorized()) {
      return (
        <NavLink to={"/login"}>
          <div className="button-div-create-space">
            <button className="login-button">Login</button>
          </div>
        </NavLink>
      );
    }
    return (
      <form onSubmit={(e) => handleSubmit(e)} className="create-space-form">
        <label>Name:</label>
        <br />
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <label>Location:</label>
        <br />
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
        <br />
        <label>Photo:</label>
        <br />
        <input type="file" onChange={(e) => setPhotoUrl(e)} />
        <br />
        {renderPhoto()}
        <br />
        <input type="submit" value="Create space" />
      </form>
    );
  }

  return (
    <div>
      {renderForm()}
      {actionResult ? (
        <h3 className="action-result">{actionResult}</h3>
      ) : undefined}
    </div>
  );
}
