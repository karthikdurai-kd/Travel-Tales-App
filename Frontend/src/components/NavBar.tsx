import { NavLink } from "react-router-dom";

type NavBarProps = {
  userName: string | undefined;
};
export default function NavBar({ userName }: NavBarProps) {
  function renderLoginLogout() {
    if (userName) {
      return (
        <NavLink to="/" style={{ float: "right" }}>
          <span> {userName}</span>
        </NavLink>
      );
    } else {
      return (
        <NavLink to="/login" style={{ float: "right" }}>
          Login
        </NavLink>
      );
    }
  }

  return (
    <div className="navbar">
      <NavLink to={"/"}>Home</NavLink>
      <NavLink to={"/profile"}>Profile</NavLink>
      <NavLink to={"/spaces"}>Spaces</NavLink>
      <NavLink to={"/createSpace"}>Create space</NavLink>
      {renderLoginLogout()}
    </div>
  );
}
