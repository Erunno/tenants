import AddNewBtn from "../../shared/components/AddNewBtn";
import Bill from "./Bill";

export default function BillList({ billList, tenants, onBillsChanged }) {

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

        <AddNewBtn label={'Add New Bill'} />

        <div className="mb-3" />

        {billList.map((bill, i) =>
            <Bill
                key={bill.name}
                billData={bill}
                tenants={tenants}
                toggleTenantPaid={toggleTenantPaid}
            />)}

    </div>
}