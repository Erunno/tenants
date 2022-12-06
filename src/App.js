import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import TenantList from './features/tenant-list/TenantList';
import BillList from './features/bills/BillList';
import { useEffect, useState } from 'react';
import moment from 'moment/moment';
import { storageDateFormat } from './constants';
import './shared/styles/global.css';
import logo from './pictures/favicon.ico';
import { GroupSelector } from './features/group-selector/GroupSelector';

const BILLS_KEY = '__bills__';
const TENANTS_KEY = '__tenants__';

function fromStorageBill(stBill) {
  return {
    ...stBill,
    from: moment(stBill.from, storageDateFormat),
    to: moment(stBill.to, storageDateFormat),
  }
}

function fromStorageTenant(stTenant) {
  return {
    ...stTenant,
    from: moment(stTenant.from, storageDateFormat),
    to: stTenant.to ? moment(stTenant.to, storageDateFormat) : undefined,
    newlyAdded: true
  }
}

function loadAppState() {
  return {
    bills: (JSON.parse(localStorage.getItem(BILLS_KEY)) ?? []).map(fromStorageBill),
    tenants: (JSON.parse(localStorage.getItem(TENANTS_KEY)) ?? []).map(fromStorageTenant),
  }
}

function toStorageBill(bill) {
  return {
    ...bill,
    from: bill.from.format(storageDateFormat),
    to: bill.to.format(storageDateFormat),
    payerIds: bill.payerIds ?? [],
  }
}

function toStorageTenant(tenant) {
  return {
    ...tenant,
    from: tenant.from.format(storageDateFormat),
    to: tenant.to ? tenant.to.format(storageDateFormat) : undefined,
  }
}

function saveState(bills, tenants) {
  localStorage.setItem(BILLS_KEY, JSON.stringify(bills.map(toStorageBill)));
  localStorage.setItem(TENANTS_KEY, JSON.stringify(tenants.map(toStorageTenant)));
}

function App() {

  const [tenants, setTenants] = useState(null);
  const [bills, setBills] = useState(null);
  const [groups, setGroups] = useState([
    { id: 1, name: "Group 1", selected: false },
    { id: 2, name: "Group 1", selected: true },
    { id: 3, name: "Group 1", selected: false },
    { id: 4, name: "Group 1", selected: false },
  ]);
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0].id);

  useEffect(() => {
    const storage = loadAppState();

    setTenants(storage.tenants);
    setBills(storage.bills);
  }, []);

  function minusArr(arr1, arr2) {
    return arr1.filter(i1 => !arr2.includes(i1));
  }

  function onTenantsChanged(newTenants) {
    const removedTenantsIds = minusArr(tenants.map(t => t.id), newTenants.map(t => t.id));

    let newBills = bills;
    if (removedTenantsIds.length !== 0) {
      newBills = bills.map(b => ({
        ...b,
        payerIds: b.payerIds?.filter(id => !removedTenantsIds.some(remId => remId === id)) ?? []
      }))

      setBills(newBills);
    }

    setTenants(newTenants);

    saveState(newBills, newTenants);
  }

  function onBillsChanged(newBills) {
    setBills(newBills);
    saveState(newBills, tenants);
  }

  return (
    <div className='app-container'>
      <nav className="navbar navbar-light bg-light">
        <div className="navbar-brand brand-container ms-3 mt-auto mb-auto">
          <img src={logo} className="logo-in-nav" alt="logo" />
          <div className='ms-2'>Bills manager</div>
        </div>
      </nav>
      <div className='container'>
        {groups && <GroupSelector
          groups={groups}
          onGroupsChanged={(g) => setGroups(g)}
          selectedGroupId={selectedGroupId}
          onSelectedChanged={setSelectedGroupId} />}

        {tenants && <TenantList tenantList={tenants} onTenantsChanged={onTenantsChanged} />}

        {bills && <BillList tenants={tenants} billList={bills} onBillsChanged={onBillsChanged} />}
      </div>
    </div>
  );
}

export default App;
