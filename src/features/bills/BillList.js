import { useState } from "react";
import AddNewBtn from "../../shared/components/btns/AddNewBtn";
import Bill from "./Bill";
import EditBill from "./EditBill";

export default function BillList({ billList, tenants, onBillsChanged }) {

    const [addingNewBill, setAddingNewBill] = useState(false);
    const [billsInEditMode, setBillsInEditMode] = useState([]);

    function toggleTenantPaid(billId, tenantId) {

        const newBillList = billList.map(bill => {
            if (bill.id !== billId) return bill;

            if (!bill.payerIds)
                bill.payerIds = [];

            const removedId = bill.payerIds.filter(payerId => payerId !== tenantId);

            if (removedId.length === bill.payerIds.length) // id has not been there
                return { ...bill, payerIds: bill.payerIds.concat([tenantId]) }; // add id to list of payers

            return { ...bill, payerIds: removedId };
        });

        onBillsChanged(newBillList);
    }

    function onSave(newBill) {
        setAddingNewBill(false);
        onBillsChanged([newBill].concat(billList));
    }

    function onDelete(billId) {
        onBillsChanged(billList.filter(b => b.id !== billId))
    }

    function generateId() {
        return Math.max(...billList.filter(b => b).map(b => b.id).concat([-1])) + 1;
    }

    function setEditMode(billId) {
        setBillsInEditMode(billsInEditMode.concat([billId]));
    }

    function unsetEditMode(billId) {
        setBillsInEditMode(billsInEditMode.filter(bId => bId !== billId));
    }

    function saveEdited(newBillData) {
        const newBillList = billList.map(b => b.id === newBillData.id ? newBillData : b);
        console.log(newBillData.id, newBillList);
        unsetEditMode(newBillData.id);

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
            billId={generateId()}
            onCancel={() => setAddingNewBill(false)}
            onSave={onSave}
        />}

        {billList.map(bill =>
            billsInEditMode.includes(bill.id)

                ? <EditBill
                    key={bill.id}
                    billId={bill.id}
                    billData={bill}
                    onCancel={() => unsetEditMode(bill.id)}
                    onSave={saveEdited}
                />

                : <Bill
                    key={bill.id}
                    billData={bill}
                    tenants={tenants}
                    onDelete={onDelete}
                    onEdit={() => setEditMode(bill.id)}
                    toggleTenantPaid={toggleTenantPaid}
                />
        )}

    </div>
}