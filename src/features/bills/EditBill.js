import CancelBtn from '../../shared/components/CancelBtn';
import SaveBtn from '../../shared/components/SaveBtn';
import './EditBill.css';

export default function EditBill({ onSave, onCancel, billData }) {
    return <div className="card mb-3">
        <div className="card-header bill-name-input-container">
            <span className="me-3">Name: </span>
            <input type="text" className="form-control bill-name-input" value={null} onChange={e => (e.target.value)} />

        </div>
        <div className="card-body">
            <div className='row mt-2'>
                <div className='col-auto mb-4'>
                    <h5 className="card-subtitle mb-2">Cost</h5>
                    <input type="number" className="form-control" />
                </div>

                <div className='col-auto mb-4'>
                    <h5 className="card-subtitle mb-2">Interval</h5>
                    <div className="bill-interval-container">
                        <input type="date" className="form-control date" value={null} onChange={e => (e.target.value)} />
                        <span className="ms-2 me-2">-</span>
                        <input type="date" className="form-control date" value={null} onChange={e => (e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col mb-4">
                    <h5 className="card-subtitle mb-2">Note <span className='note-note'>(*not required)</span></h5>
                    <textarea className="form-control" />
                </div>
            </div>

            <div className='bill-edit-btn-container'>

                <SaveBtn label={'Save Bill'} onClick={onSave} />
                <div className="ms-2"></div>
                <CancelBtn label={'Cancel'} onClick={onCancel} />
            </div>

        </div>
    </div>
}