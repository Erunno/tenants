import './EditTenant.css';
import moment from "moment/moment";
import { useState } from "react";
import CancelBtn from '../../shared/components/btns/CancelBtn';
import SaveBtn from '../../shared/components/btns/SaveBtn';

function fromMomentToInputString(mmt) {
    return mmt ? mmt.format('YYYY-MM-DD') : '';
}

function compareNameTo(otherName) {

    const norm = str => str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();

    const normOtherName = norm(otherName);

    return (name) => normOtherName === norm(name);
}

export default function EditTenant({ forbiddenNames = [], tenantData, tenantId, onSave, onCancel }) {

    const [newName, setNewName] = useState(tenantData?.name ?? '');
    const [newFrom, setNewFrom] = useState(fromMomentToInputString(tenantData?.from));
    const [newTo, setNewTo] = useState(fromMomentToInputString(tenantData?.to));
    const [newTillNow, setNewTillNow] = useState(tenantData ? !tenantData.to : false);

    function toMoment(inputString) {
        return moment(inputString, 'YYYY-MM-DD');
    }

    function onSaveInternal(e) {
        onSave({
            id: tenantId,
            name: newName.trim(),
            from: toMoment(newFrom),
            to: !newTillNow ? toMoment(newTo) : null,
        });

        setNewName('');
        setNewFrom('');
        setNewTo('');
        setNewTillNow(false);
    }

    function tillNowChanged(e) {
        setNewTo('');
        setNewTillNow(e.target.checked);
    }

    function countDays() {
        if (newFrom === '' || (newTo === '' && newTillNow === false))
            return;

        const from = toMoment(newFrom);
        const to = newTillNow ? moment() : moment(newTo);

        return to.diff(from, 'days') + 1;
    }


    const nameIsForbidden = forbiddenNames.some(compareNameTo(newName));
    const nameIsInvalidClass = nameIsForbidden ? 'invalid' : '';

    const correctlyFilled = (
        newName.trim() !== '' &&
        newFrom !== '' &&
        (newTo !== '' || newTillNow) &&
        !nameIsForbidden
    );

    const days = countDays();

    return <tr>
        <td colSpan={5} className="tenant-edit-row-td">
            <div className="tenant-edit-row p-2">

                <div className='tenants-name-input'>
                    <label className="form-check-label me-2 mt-auto mb-auto" htmlFor={`tenant-name-${tenantId}`} >
                        Name
                    </label>
                    <input type="text" id={`tenant-name-${tenantId}`} className={`mt-2 mb-3 form-control ${nameIsInvalidClass}`} value={newName} onChange={e => setNewName(e.target.value)} />
                    {nameIsForbidden && <div className="error-message">
                        Name is already taken (Hidden tenant can be already named "{newName.trim()}")
                    </div>}
                </div>

                <div className=''>
                    <label className="form-check-label me-2 mt-auto mb-auto" htmlFor={`tenant-from-${tenantId}`} >
                        From
                    </label>
                    <input type="date" id={`tenant-from-${tenantId}`} className="form-control mt-2 mb-3 date" placeholder="From" value={newFrom} onChange={e => setNewFrom(e.target.value)} />
                </div>

                <div className='mt-2'>
                    <label className="form-check-label me-2 mt-auto mb-auto" htmlFor={`tenant-to-${tenantId}`} >
                        To
                    </label>
                    <div className='to-edit-tenant'>

                        <input
                            id={`tenant-to-${tenantId}`}
                            type="date"
                            placeholder="To"
                            className="form-control date mt-auto mb-auto "
                            value={newTo}
                            onChange={e => setNewTo(e.target.value)}
                            disabled={newTillNow}
                        />

                        <input className="form-check-input mt-auto mb-auto ms-3" type="checkbox" id={`tenant-till-now-${tenantId}`} checked={newTillNow} onChange={tillNowChanged} />
                        <label className="form-check-label ms-2 mt-auto mb-auto" htmlFor={`tenant-till-now-${tenantId}`} >
                            Till{'\xa0'}now
                        </label>
                    </div>
                </div>

                <div className='text-muted mt-2'>
                    Days: {days ?? '...'}
                </div>

                <div className='btns-container mt-3'>
                    <SaveBtn
                        onClick={onSaveInternal}
                        disabled={!correctlyFilled}
                        label={'Save Tenant'} />

                    <div className="ms-2"></div>

                    {onCancel && <CancelBtn onClick={onCancel} label={'Cancel'} />}
                </div>
            </div>

        </td>
    </tr>
} 