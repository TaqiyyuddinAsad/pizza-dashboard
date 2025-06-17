import avatar from '../assets/pizzaicon.png'; 
import '../styles/topbar.css'
const Topbar = ({ username }) => {
  return (
    <div className="topbar">
      <div className="user-info">
        <img src={avatar} alt="Avatar" className="avatar" />
        <span className="username">{username}</span>
      </div>
    </div>
  );
};

export default Topbar;