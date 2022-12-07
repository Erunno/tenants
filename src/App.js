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
const GROUPS_KEY = '__groups__';
const INIT_GROUP_NAME = '⚡ My Group ⚡';

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

function loadLegacyData() {
  if (!localStorage.getItem(TENANTS_KEY))
    return null;

  const serializedTenants = localStorage.getItem(TENANTS_KEY);
  const serializedBills = localStorage.getItem(BILLS_KEY);

  const tenants = (JSON.parse(serializedTenants) ?? []).map(fromStorageTenant);
  const bills = (JSON.parse(serializedBills) ?? []).map(fromStorageBill);

  localStorage.setItem(TENANTS_KEY + 'LEGACY__v1', serializedTenants);
  localStorage.setItem(BILLS_KEY + 'LEGACY__v1', serializedBills);
  localStorage.removeItem(TENANTS_KEY);
  localStorage.removeItem(BILLS_KEY);

  const groups = [{
    id: 0,
    name: INIT_GROUP_NAME,
    tenants,
    bills,
  }];

  saveState(groups);

  return groups;
}

function getInitialStateOfApp() {
  return [{
    id: 0,
    name: INIT_GROUP_NAME,
    tenants: [],
    bills: [],
  }];
}

function loadGroups() {
  const legacyData = loadLegacyData();
  console.log(legacyData);
  if (legacyData)
    return legacyData;

  const partiallyDeserializedGroups = JSON.parse(
    localStorage.getItem(GROUPS_KEY)
  );

  if (!partiallyDeserializedGroups) return getInitialStateOfApp();

  const savedData = partiallyDeserializedGroups.map(g => ({
    ...g,
    tenants: (JSON.parse(g.tenants) ?? []).map(fromStorageTenant),
    bills: (JSON.parse(g.bills) ?? []).map(fromStorageBill),
  }));

  return savedData.length !== 0 ? savedData : getInitialStateOfApp();
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

function saveState(groups) {
  const serializedGroups = JSON.stringify(
    groups.map(g => ({
      ...g,
      tenants: JSON.stringify(g.tenants.map(toStorageTenant)),
      bills: JSON.stringify(g.bills.map(toStorageBill))
    }))
  )

  localStorage.setItem(GROUPS_KEY, serializedGroups);
}

function App() {

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    const storedGroups = loadGroups();

    setGroups(storedGroups);

    if (storedGroups.length !== 0)
      setSelectedGroupId(storedGroups[0].id);

  }, []);

  function onGroupsChanged(newGroups) {
    if (newGroups.length === 0)
      newGroups = getInitialStateOfApp();

    const selectedGroupHasBeenDeleted = !newGroups.some(g => g.id === selectedGroupId);

    if (!selectedGroupId || selectedGroupHasBeenDeleted)
      setSelectedGroupId(newGroups[0].id);

    setGroups(newGroups);
    saveState(newGroups);
  }

  function minusArr(arr1, arr2) {
    return arr1.filter(i1 => !arr2.includes(i1));
  }

  function updateSelectedGroup(tenants, bills) {
    const currentGroup = groups.find(g => g.id === selectedGroupId);

    const updatedGroup = {
      ...currentGroup,
      tenants: tenants,
      bills: bills
    };

    const newGroups = groups.map(g => g.id === selectedGroupId ? updatedGroup : g);
    setGroups(newGroups);

    saveState(newGroups);
  }

  function onTenantsChanged(newTenants) {
    const currentGroup = groups.find(g => g.id === selectedGroupId);
    const tenants = currentGroup.tenants;
    const bills = currentGroup.bills;

    const removedTenantsIds = minusArr(tenants.map(t => t.id), newTenants.map(t => t.id));

    let newBills = bills;
    if (removedTenantsIds.length !== 0) {
      newBills = bills.map(b => ({
        ...b,
        payerIds: b.payerIds?.filter(id => !removedTenantsIds.some(remId => remId === id)) ?? []
      }))
    }

    updateSelectedGroup(newTenants, newBills);
  }

  function onBillsChanged(newBills) {
    const currentGroup = groups.find(g => g.id === selectedGroupId);
    const tenants = currentGroup.tenants;

    updateSelectedGroup(tenants, newBills)
  }

  const currentGroup = groups?.find(g => g.id === selectedGroupId);

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
          onGroupsChanged={onGroupsChanged}
          selectedGroupId={selectedGroupId}
          onSelectedChanged={setSelectedGroupId} />}

        {groups && groups.length !== 0 &&
          <TenantList tenantList={currentGroup.tenants} onTenantsChanged={onTenantsChanged} />
        }

        {groups && groups.length !== 0 &&
          <BillList tenants={currentGroup.tenants} billList={currentGroup.bills} onBillsChanged={onBillsChanged} />
        }
      </div>
    </div>
  );
}

export default App;
