import './TenantRow.css';
import { showDateFormat } from '../../constants';
import countDays from '../../shared/count-days';

export default function TenantRow({ i, tenantData, onEdit, onDelete, onToggleHidden }) {
    return (
        <tr className={`${tenantData.hidden ? 'hidden-tenant-row' : '' } ${tenantData.newlyAdded ? 'newly-added-tenant-row' : ''}`}>
            <th scope="row"><div>{i}</div></th>
            <td><div>{tenantData.name}</div></td>
            <td><div>{tenantData.from.format(showDateFormat)}</div></td>
            <td><div>{tenantData.to ? tenantData.to.format(showDateFormat) : '...till now'}</div></td>
            <td><div>{countDays(tenantData.from, tenantData.to)}</div></td>
            <td><div>
                <button type="button" className="btn btn-primary" onClick={onEdit}>Edit</button>
                <button type="button" className="btn btn-danger ms-2" onClick={onDelete}>Delete</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={onToggleHidden}>{tenantData.hidden ? 'Show' : 'Hide'}</button>
            </div></td>
        </tr>
    );
}