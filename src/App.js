import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import TenantList from './features/tenant-list/TenantList';
import BillList from './features/bills/BillList';
import { useState } from 'react';
import moment from 'moment/moment';

function App() {

  const testTenant1 = {
    id: 0,
    name: 'pepa',
    from: moment(),
    to: moment(),
  };

  const testTenant2 = {
    id: 1,
    name: 'pepca',
    from: moment(),
  };

  const mockBillList = [{
    id: 0,
    name: 'Water bill',
    note: 'some description asdf asdfe awe wee rergergr  sdf sdf sdfw ewe rwer sdf sdfaeww efsdf asdfa wef',
    amount: 240.4,
    from: moment('2022-12-1'),
    to: moment('2022-12-10'),
    payerIds: [],
  }, {
    id: 1,
    name: 'Gas bill',
    amount: 140.4,
    from: moment('2022-11-1'),
    to: moment('2022-12-30'),
    payerIds: [0,1,2],
  }];

  const [tenants, setTenants] = useState([testTenant1, testTenant2]);
  const [bills, setBills] = useState(mockBillList);

  function onTenantsChanged(newTenants) {
    setTenants(newTenants);
  }

  function onBillsChanged(newBills) {
    setBills(newBills);
  }

  return (
    <div className='app-container'>
      <nav className="navbar navbar-light bg-light">
        <div className="navbar-brand ms-3">Bills manager</div>
      </nav>
      <div className='container'>
        <TenantList initTenants={tenants} onTenantsChanged={onTenantsChanged}/>
        <BillList tenants={tenants} initBills={bills} onBillsChanged={onBillsChanged}/>
      </div>
    </div>
  );
}

export default App;
