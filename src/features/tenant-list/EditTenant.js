import './EditTenant.css';
import moment from "moment/moment";
import { useState } from "react";
import SaveBtnSmall from '../../shared/components/btns/SaveBtnSmall';
import CancelBtnSmall from '../../shared/components/btns/CancelBtnSmall';

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

    return <tr>
        <th scope="row"></th>
        <td>
            <div className='row'>
                <div className='col-10'>
                    <input type="text" id="tenant-name-input" className={`form-control ${nameIsInvalidClass}`} value={newName} onChange={e => setNewName(e.target.value)} />
                    {nameIsForbidden && <div className="error-message">
                        Name is already taken (Hidden tenant can be already named "{newName.trim()}")
                    </div>}
                </div>
            </div>
        </td>
        <td>
            <div className='row'>
                <div className='col-10'>
                    <input type="date" className="form-control date" value={newFrom} onChange={e => setNewFrom(e.target.value)} />
                </div>
            </div>
        </td>
        <td>
            <div className='row'>

                <div className='col-6'>
                    <input
                        type="date"
                        className="form-control date"
                        value={newTo}
                        onChange={e => setNewTo(e.target.value)}
                        disabled={newTillNow}
                    />
                </div>
                <div className='col-4 mt-2'>
                    <input className="form-check-input" type="checkbox" id="till-now-checkbox" checked={newTillNow} onChange={tillNowChanged} />
                    <label className="form-check-label ms-2" htmlFor="till-now-checkbox" >
                        Till now
                    </label>
                </div>
            </div>

        </td>
        <td><div>{countDays()}</div></td>
        <td>
            <SaveBtnSmall onClick={onSaveInternal} disabled={!correctlyFilled} />
            {onCancel && <CancelBtnSmall onClick={onCancel} />}
        </td>
    </tr>
} 