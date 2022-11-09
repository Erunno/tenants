import { useState } from "react";
import Bill from "./Bill";

export default function BillList({ initBills, tenants, onBillsChanged }) {

    const [billList, setBillList] = useState(initBills);

    function toggleTenantPaid(billId, tenantId) {
        const newBillList = billList.map(bill => {
            if (bill.id !== billId) return bill;
            console.log('hir');

            const removedId = bill.payerIds.filter(payerId => payerId !== tenantId);

            if (removedId.length === bill.payerIds.length) // id has not been there
                return { ...bill, payerIds: bill.payerIds.concat([tenantId])}; // add id to list of payers
            
            return { ...bill, payerIds: removedId};
        });

        console.log('old', billList);
        console.log('new', newBillList);

        setBillList(newBillList);
    }

    return <div className="bill-container mt-5">

        <h1 className="mb-5">Bills</h1>

        {billList.map((bill, i) =>
            <Bill
                key={bill.name}
                billData={bill}
                tenants={tenants}
                hideBody={i !== 0}
                toggleTenantPaid={toggleTenantPaid}
            />)}

    </div>
}