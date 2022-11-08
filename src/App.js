import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Bill from './features/bills/Bill';
import TenantList from './features/tenant-list/TenantList';

function App() {
  return (
    <div className='app-container'>
      <nav className="navbar navbar-light bg-light">
        <div className="navbar-brand ms-3">Bills manager</div>
      </nav>
      <div className='container'>
        <TenantList />
        <Bill />
      </div>
    </div>
  );
}

export default App;
