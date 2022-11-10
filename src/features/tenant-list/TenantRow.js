import './TenantRow.css';
import { showDateFormat } from '../../constants';
import countDays from '../../shared/count-days';
import DeleteBtn from '../../shared/components/btns/DeleteBtn';

export default function TenantRow({ i, tenantData, onEdit, onDelete, onToggleHidden }) {
    return (
        <tr className={`${tenantData.hidden ? 'hidden-tenant-row' : ''} ${tenantData.newlyAdded ? 'newly-added-tenant-row' : ''}`}>
            <th scope="row"><div>{i}</div></th>
            <td><div>{tenantData.name}</div></td>
            <td><div>{tenantData.from.format(showDateFormat)}</div></td>
            <td><div>{tenantData.to ? tenantData.to.format(showDateFormat) : '...till now'}</div></td>
            <td><div>{countDays(tenantData.from, tenantData.to)}</div></td>
            <td><div>
                <span className="edit-btn me-1 p-1" onClick={onEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                    </svg>
                </span>
                <DeleteBtn
                    onClick={onDelete}
                    smallVersion={true}
                    label={'Delete Tenant'}
                    confirmDeleteMessage={`Do you want to delete tenant "${tenantData.name}"?`}
                />
                
                <span className="hide-show-btn ms-2" onClick={onToggleHidden}>{tenantData.hidden ? 'Show' : 'Hide'}</span>
            </div></td>
        </tr>
    );
}