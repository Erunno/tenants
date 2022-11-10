import moment from 'moment/moment';
import { useState } from 'react';
import { inputDateFormat } from '../../constants';
import CancelBtn from '../../shared/components/btns/CancelBtn';
import SaveBtn from '../../shared/components/btns/SaveBtn';
import './EditBill.css';

function isNumeric(num) {
    if (num === '' || num === null) {
        return false
    }
    return !isNaN(num)
}

export default function EditBill({ onSave, onCancel, billId, billData }) {

    const [newBillData, setNewBillData] = useState(
        billData
            ? {
                ...billData,
                from: billData.from.format(inputDateFormat),
                to: billData.to.format(inputDateFormat),
                cost: billData.amount.toFixed(2),
            }
            : { name: '', cost: '', from: '', to: '', note: '' }
    );

    function onSaveInternal() {
        onSave({
            id: billId,
            name: newBillData.name.trim(),
            amount: parseFloat(newBillData.cost.trim()),
            from: moment(newBillData.from, inputDateFormat),
            to: moment(newBillData.to, inputDateFormat),
            note: newBillData.note?.trim() ?? '',
            payerIds: billData?.payerIds ?? [],
        });
    }

    const filledCorrectly =
        newBillData.name.trim() &&
        newBillData.from && newBillData.to &&
        isNumeric(newBillData.cost.trim());

    const costInputIsInvalid =
        newBillData.cost.trim() &&
        !isNumeric(newBillData.cost);

    return <div className="card mb-3">
        <div className="card-header bill-name-input-container">
            <span className="me-3">Name: </span>

            <input
                type="text" className="form-control bill-name-input"
                value={newBillData.name} onChange={e => setNewBillData({ ...newBillData, name: e.target.value })}
            />

        </div>
        <div className="card-body">
            <div className='row mt-2'>
                <div className='col-auto mb-4'>
                    <h5 className="card-subtitle mb-2">Cost (€)</h5>
                    <div>
                        <input
                            type="text" min="0" step={5} className={`form-control ${costInputIsInvalid ? 'invalid' : ''}`}
                            value={newBillData.cost} onChange={e => setNewBillData({ ...newBillData, cost: e.target.value })}
                        />
                        {costInputIsInvalid && <div className="error-message">
                            Must be a valid number
                        </div>}
                    </div>

                </div>

                <div className='col-auto mb-4'>
                    <h5 className="card-subtitle mb-2">Interval</h5>
                    <div className="bill-interval-container">
                        <input
                            type="date" className="form-control date"
                            value={newBillData.from} onChange={e => setNewBillData({ ...newBillData, from: e.target.value })}
                        />
                        <span className="ms-2 me-2">-</span>
                        <input
                            type="date" className="form-control date"
                            value={newBillData.to} onChange={e => setNewBillData({ ...newBillData, to: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col mb-4">
                    <h5 className="card-subtitle mb-2">Note <span className='note-note'>(*not required)</span></h5>
                    <textarea
                        className="form-control"
                        value={newBillData.note} onChange={e => setNewBillData({ ...newBillData, note: e.target.value })}
                    />
                </div>
            </div>

            <div className='btns-container'>
                <SaveBtn label={'Save Bill'} onClick={onSaveInternal} disabled={!filledCorrectly} />
                <CancelBtn label={'Cancel'} onClick={() => onCancel(billId)} />
            </div>

        </div>
    </div>
}