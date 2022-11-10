import { useState } from 'react';
import AddNewBtn from '../../shared/components/btns/AddNewBtn';
import EditTenant from './EditTenant';
import './TenantList.css';
import TenantRowSet from './TenantRowSet';

export default function TenantList({ tenantList, onTenantsChanged }) {

    const [showHidden, setShowHidden] = useState(false);
    const [addingTenant, setAddingTenant] = useState(false);

    function setTenantList(newTenants) {
        onTenantsChanged(newTenants);
    }

    function addNewTenant(tenantData) {
        const newTenants = tenantList
            .map(t => ({ ...t, newlyAdded: false }))
            .concat([{ ...tenantData, newlyAdded: true }])
            .sort((t1, t2) => t1.name > t2.name);

        setTenantList(newTenants);
    }

    function deleteTenant(id) {
        setTenantList(tenantList.filter(t => t.id !== id));
    }

    function setBeingEdited(value) {
        return (id) => {
            const newTenants = tenantList
                .map(t => t.id === id ? { ...t, beingEdited: value ? value : undefined } : t);
            setTenantList(newTenants);
        }
    }

    function showOrHideTenant(id) {
        const newTenants = tenantList
            .map(t => t.id === id ? ({ ...t, newlyAdded: false, hidden: !t.hidden }) : t);

        const hiddenTenantsCount = newTenants.filter(t => t.hidden).length;
        if (hiddenTenantsCount === 0) setShowHidden(false);

        setTenantList(newTenants);
    }

    function toggleHiddenTenants() {
        const eddiedTenants = tenantList.map(t => ({
            ...t,
            newlyAdded: t.hidden // this line ensures that rows are animated in
        }));

        setTenantList(eddiedTenants);
        setShowHidden(!showHidden);
    }

    function saveEditedTenant(id, newData) {
        const newTenants = tenantList
            .map(t => t.id === id ? newData : t)
            .sort((t1, t2) => t1.name > t2.name);
        setTenantList(newTenants);
    }

    const shownTenants = tenantList.filter(t => !t.hidden);
    const hiddenTenants = tenantList.filter(t => t.hidden);
    const rowSetCallbacks = {
        onDelete: deleteTenant,
        onEdit: setBeingEdited(true),
        onCancelEdit: setBeingEdited(false),
        onToggleHide: showOrHideTenant,
        onSaveEdited: saveEditedTenant,
    }

    function generateNewId() {
        return Math.max(...tenantList.filter(t => t).map(t => t.id).concat([-1])) + 1;
    }

    return <div className='tenant-list-container mt-3 mb-3'>

        <h1>Tenants</h1>

        <table className='table mt-4'>
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                    <th scope="col">Days</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <TenantRowSet
                    tenants={shownTenants}
                    allNames={tenantList.map(t => t.name)}
                    callbacks={rowSetCallbacks}
                />

                {(hiddenTenants.length !== 0) && <tr>
                    <td colSpan='6' className='show-hidden-row' onClick={toggleHiddenTenants}>
                        <div className='show-hidden'>{showHidden ? 'Hide' : 'Show hidden'} tenants</div>
                    </td>
                </tr>}

                {showHidden && <TenantRowSet
                    tenants={hiddenTenants}
                    allNames={tenantList.map(t => t.name)}
                    callbacks={rowSetCallbacks}
                />}


                {addingTenant && <EditTenant
                    onSave={addNewTenant}
                    forbiddenNames={tenantList.map(t => t.name)}
                    tenantId={generateNewId()}
                    onCancel={() => setAddingTenant(false)}
                />}

            </tbody>
        </table>

        {!addingTenant && <AddNewBtn label={'Add New Tenant'} onClick={() => setAddingTenant(true)} />}

    </div>;
}
