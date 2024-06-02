import genericImage from "../../assets/default_image.png";
import { SpaceEntry } from "../../model/SpaceEntry";
import "../../styles/SpaceComponentStyle.css";

interface SpaceComponentProps extends SpaceEntry {
  reserveSpace: (spaceId: string, spaceName: string) => void;
}

export default function SpaceComponent(props: SpaceComponentProps) {
  function renderImage() {
    if (props.photoURL) {
      return <img src={props.photoURL} />;
    } else {
      return <img src={genericImage} />;
    }
  }

  return (
    <div className="spaceComponent">
      {renderImage()}
      <label className="name">{props.name}</label>
      <br />
      <label className="location">{props.location}</label>
      <br />
      <button onClick={() => props.reserveSpace(props.id, props.name)}>
        Reserve
      </button>
    </div>
  );
}
