import moment from 'moment/moment';
import { useState } from 'react';
import EditTenant from './EditTenant';
import './TenantList.css';
import TenantRow from './TenantRow';
import TenantRowSet from './TenantRowSet';

export default function TenantList({ onTenantsChanged }) {

    const testTenant1 = {
        name: 'pepa',
        from: moment(),
        to: moment(),
    };

    const testTenant2 = {
        name: 'pepca',
        from: moment(),
    };

    const [tenantList, setTenantListVariable] = useState([testTenant1, testTenant2]);
    const [showHidden, setShowHidden] = useState(false);

    function setTenantList(newTenants) {
        setTenantListVariable(newTenants);

        if (onTenantsChanged)
            onTenantsChanged(newTenants);
    }

    function addNewTenant(tenantData) {
        const newTenants = tenantList
            .map(t => ({ ...t, newlyAdded: false }))
            .concat([{ ...tenantData, newlyAdded: true }])
            .sort((t1, t2) => t1.name > t2.name);

        setTenantList(newTenants);
    }

    function deleteTenant(name) {
        setTenantList(tenantList.filter(t => t.name !== name));
    }

    function setBeingEditted(value) {
        return (name) => {
            const newTenants = tenantList
                .map(t => t.name === name ? { ...t, beingEdited: value } : t);
            setTenantList(newTenants);
        }
    }

    function showOrHideTenant(name) {
        const newTenants = tenantList
            .map(t => t.name === name ? ({ ...t, newlyAdded: false, hidden: !t.hidden }) : t)
        setTenantList(newTenants);
    }

    function toggleHiddenTenants() {
        const eddiedTenants = tenantList.map(t => ({
            ...t,
            newlyAdded: t.hidden
        }));

        setTenantList(eddiedTenants);
        setShowHidden(!showHidden);
    }

    function saveEditedTenant(name, newData) {
        const newTenants = tenantList
            .map(t => t.name === name ? newData : t)
            .sort((t1, t2) => t1.name > t2.name);
        setTenantList(newTenants);
    }

    const shownTenants = tenantList.filter(t => !t.hidden);
    const hiddenTenants = tenantList.filter(t => t.hidden);
    const rowSetCallbacks = {
        onDelete: deleteTenant,
        onEdit: setBeingEditted(true),
        onCancelEdit: setBeingEditted(false),
        onToggleHide: showOrHideTenant,
        onSaveEdited: saveEditedTenant,
    }

    return <div className='tenant-list-container mt-3 mb-3'>

        <h1>Tenant List</h1>

        <table className='table mt-4'>
            <thead>
                <tr>
                    <th scope="col">#</th>
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

                <EditTenant onSave={addNewTenant} forbiddenNames={tenantList.map(t => t.name)} />

            </tbody>
        </table>

    </div>;
}
