import moment from 'moment/moment';
import { useState } from 'react';
import { showStringFormat as showDateFormat } from '../../constants';
import EditTenant from './EditTenant';
import './TenantList.css';

export default function TenantList() {

    const testTenant1 = {
        name: 'pepa',
        from: moment(),
        to: moment(),
    };

    const testTenant2 = {
        name: 'pepca',
        from: moment(),
    };

    const [tenantList, setTenantList] = useState([testTenant1, testTenant2]);

    function toMoment(inputString) {
        return moment(moment(inputString, 'YYYY-MM-DD'))
    }

    function addNewTenant(tenantData) {
        setTenantList(tenantList.concat([tenantData]))
    }

    function deleteIthTenant(indexToRemove) {
        setTenantList(tenantList.filter((_, i) => i !== indexToRemove));
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
                {tenantList.map((x, i) =>
                    <tr key={i}>
                        <th scope="row"><div>{i}</div></th>
                        <td><div>{x.name}</div></td>
                        <td><div>{x.from.format(showDateFormat)}</div></td>
                        <td><div>{x.to ? x.to.format(showDateFormat) : '...till now'}</div></td>
                        <td><div>5</div></td>
                        <td><div>
                            <button type="button" className="btn btn-primary">Edit</button>
                            <button type="button" className="btn btn-danger ms-2" onClick={() => deleteIthTenant(i)}>Delete</button>
                            <button type="button" className="btn btn-secondary ms-2">Hide</button>
                        </div></td>
                    </tr>)}

                <tr>
                    <td colSpan='6' className='show-hidden-row'>
                        <div className='show-hidden'>Show hidden tenants</div>
                    </td>
                </tr>

                <EditTenant onSave={addNewTenant} forbiddenNames={tenantList.map(t => t.name)} />

            </tbody>
        </table>

    </div>;
}
