import { Link, useLocation, useNavigate } from 'react-router-dom';

function NavBar({ handleLogout }) {
  const router = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div id="nav" className="row text-center bg-dark">
        <div className="col-3 col-md-2 col-lg-2 shadow mx-auto rounded bg-light">
          <Link to='/' className={`btn btn-outline-dark col-12 ${router.pathname === '/' ? 'active' : ''}`}>
            <i className="bi bi-clipboard2-data"></i>
          </Link>
        </div>
        <div className="col-3 col-md-2 col-lg-2 shadow mx-auto rounded bg-light">
          <Link to='/member' className={`btn btn-outline-dark col-12 ${router.pathname === '/member' || router.pathname === '/member/administration' ? 'active' : ''}`}>
            <i className="bi bi-people rounded-circle"></i>
          </Link>
        </div>
        <div className="col-3 col-md-2 col-lg-2 shadow mx-auto rounded bg-light">
          <Link to='/cota' className={`btn btn-outline-dark col-12 ${router.pathname === '/cota' ? 'active' : ''}`}>
            <i className="bi bi-coin"></i>
          </Link>
        </div>

      </div>
    </>
  );
}

export default NavBar;
