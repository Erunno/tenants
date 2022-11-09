import moment from 'moment';
import { useState } from 'react';
import { showDateFormat } from '../../constants';
import countDays from '../../shared/count-days';
import './Bill.css';

function getIntervalOverlap(interval1, interval2) {
    const [fst, scd] = interval1.from.isBefore(interval2.from)
        ? [{ ...interval1 }, { ...interval2 }]
        : [{ ...interval2 }, { ...interval1 }];

    if (!fst.to) fst.to = moment();
    if (!scd.to) scd.to = moment();

    if (fst.to.isBefore(scd.from))
        return null;

    if (fst.to.isBefore(scd.to))
        return {
            from: scd.from,
            to: fst.to,
        };

    return scd;
}

export default function Bill({ billData: { id, name, note, amount, from, to, payerIds }, hideBody = true, tenants, toggleTenantPaid }) {

    const [billIsHidden, setBillIsHidden] = useState(hideBody);

    const fromToString = `${from.format(showDateFormat)} - ${to.format(showDateFormat)}`;

    function generateBillsRecords() {
        const records = tenants
            .map(t => {

                const billInterval = getIntervalOverlap(
                    { from, to },
                    { from: t.from, to: t.to }
                );

                if (!billInterval) return null;

                return {
                    id: t.id,
                    name: t.name,
                    billedFrom: billInterval.from,
                    billedTo: billInterval.to,
                    days: countDays(billInterval.from, billInterval.to),
                    paid: payerIds.filter(id => id === t.id).length !== 0,
                }
            })
            .filter(rec => rec);

        const totalTenantsDays = records
            .map(rec => rec.days)
            .reduce((a, b) => a + b, 0);

        records.forEach(tRec => {
            tRec.priceToPay = tRec.days / totalTenantsDays * amount;
        });

        return records;
    }

    const tenantRecords = generateBillsRecords();

    return <div className="card mb-3">
        <h5 className="card-header bill-header" onClick={() => setBillIsHidden(!billIsHidden)}>
            {name}
            <span className={`date-in-title ms-3 ${billIsHidden ? 'date-in-title-hidden' : ''}`}>{fromToString}</span>
        </h5>
        <div className={`bill-body-container ${billIsHidden ? 'bill-body-hidden' : 'bill-body-shown'}`}>

            <div className="card-body bill-body">

                <div className='row'>
                    <div className='col-auto mb-4'>
                        <h5 className="card-subtitle mb-2">Cost</h5>
                        <p className="card-text">{amount.toFixed(2)} €</p>
                    </div>

                    <div className='col-auto mb-4'>
                        <h5 className="card-subtitle mb-2">Interval</h5>
                        <p className="card-text">{fromToString}</p>
                    </div>

                    {note && <div className="col-auto mb-4">
                        <h5 className="card-subtitle mb-2">Note</h5>
                        <p className="card-text">{note}</p>
                    </div>}
                </div>

                <h5 className="card-subtitle">Tenants</h5>


                {tenantRecords.length === 0 && 
                <h6 className="card-subtitle text-muted mt-2 mb-2">
                    No tenants in billing interval
                </h6>}

                {tenantRecords.length !== 0 && <>
                    <h6 className="card-subtitle text-muted mt-2 mb-2">
                        Click on tenant to toggle
                        <span class="ms-1 me-1 badge rounded-pill bg-success">Paid</span>/
                        <span class="ms-1 badge rounded-pill bg-danger">Didn't pay</span>
                    </h6>
                    <div className='row'>
                        {tenantRecords.map(tenantRecord => <div key={tenantRecord.id} className="col-md-auto" onClick={() => toggleTenantPaid(id, tenantRecord.id)}>
                            <div className={`card mt-3 tenant-bill-record ${tenantRecord.paid ? 'tenant-paid' : 'tenant-did-not-pay'}`}>
                                <div className="card-body">
                                    <h5 className="card-title">{tenantRecord.name}
                                        {tenantRecord.paid
                                            ? <span class="ms-2 badge rounded-pill bg-success">Paid</span>
                                            : <span class="ms-2 badge rounded-pill bg-danger">Didn't pay</span>}
                                    </h5>

                                    <h6 className="card-subtitle mt-4 text-muted">Bill Interval</h6>
                                    <p className="card-text">{tenantRecord.billedFrom.format(showDateFormat)} - {tenantRecord.billedTo.format(showDateFormat)}</p>

                                    <div className="row mt-1">
                                        <div className="col-auto">
                                            <h6 className="card-subtitle text-muted">Days</h6>
                                            <p className="card-text">{tenantRecord.days}</p>
                                        </div>
                                        <div className="col-auto">
                                            <h6 className="card-subtitle text-muted">Cost</h6>
                                            <p className="card-text">{tenantRecord.priceToPay.toFixed(2)} €</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>)}
                    </div></>}

            </div>
        </div>
    </div>
}
