import './EditTenant.css';
import moment from "moment/moment";
import { useState } from "react";

function fromMomentToInputString(mmt) {
    return mmt ? mmt.format('YYYY-MM-DD') : '';
}

export default function EditTenant({ forbiddenNames = [], name = '', from = null, to = null, tillNow = false, onSave }) {

    const [newName, setNewName] = useState(name);
    const [newFrom, setNewFrom] = useState(fromMomentToInputString(from));
    const [newTo, setNewTo] = useState(fromMomentToInputString(to));
    const [newTillNow, setNewTillNow] = useState(tillNow);

    function toMoment(inputString) {
        return moment(moment(inputString, 'YYYY-MM-DD'))
    }

    function onSaveInternal(e) {
        onSave({
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

    const nameIsForbidden = forbiddenNames.filter(n => newName.trim() === n).length !== 0;
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
                    {nameIsForbidden && <div className="name-is-forbidden-error-message">
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
        <td>4</td>
        <td>
            <button type="button" className="btn btn-success" onClick={onSaveInternal} disabled={!correctlyFilled}>Save</button>
        </td>
    </tr>
} 