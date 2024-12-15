import { Link } from 'react-router-dom';
function Navbar() {
    return (
      <>
        <nav id="navbar" className="navbar">
            <Link to="/home" className="nav_item">Home</Link>
            <Link to="/user" className="nav_item">User</Link>
            <Link to="/chat" className="nav_item">Chat</Link>
        </nav>
      </>
    )
}
  
export default Navbar