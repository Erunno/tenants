import { useState } from "react";
import AddNewBtn from "../../shared/components/AddNewBtn";
import Bill from "./Bill";
import EditBill from "./EditBill";

export default function BillList({ billList, tenants, onBillsChanged }) {

    const [addingNewBill, setAddingNewBill] = useState(false);

    function toggleTenantPaid(billId, tenantId) {
        const newBillList = billList.map(bill => {
            if (bill.id !== billId) return bill;

            const removedId = bill.payerIds.filter(payerId => payerId !== tenantId);

            if (removedId.length === bill.payerIds.length) // id has not been there
                return { ...bill, payerIds: bill.payerIds.concat([tenantId]) }; // add id to list of payers

            return { ...bill, payerIds: removedId };
        });

        onBillsChanged(newBillList);
    }

    return <div className="bill-container mt-5">

        <h1 className="mb-3">
            Bills
        </h1>

        {!addingNewBill && <>
            <AddNewBtn label={'Add New Bill'} onClick={() => setAddingNewBill(true)} />
            <div className="mb-3" />
        </>}

        {addingNewBill && <EditBill
            onCancel={() => setAddingNewBill(false)}
            onSave={null}
        />}



        {billList.map((bill, i) =>
            <Bill
                key={bill.name}
                billData={bill}
                tenants={tenants}
                toggleTenantPaid={toggleTenantPaid}
            />)}

    </div>
}