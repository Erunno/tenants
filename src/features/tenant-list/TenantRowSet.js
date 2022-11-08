import EditTenant from "./EditTenant";
import TenantRow from "./TenantRow";

export default function TenantRowSet({ offset = 0, allNames, tenants, callbacks: { onEdit, onSaveEdited, onDelete, onToggleHide, onCancelEdit } }) {
    return tenants.map((tenant, i) => tenant.beingEdited
        ? <EditTenant
            key={tenant.name}
            forbiddenNames={allNames.filter(n => n !== tenant.name)}
            onSave={(mewData) => onSaveEdited(tenant.name, mewData)}
            tenantData={tenant}
            onCancel={() => onCancelEdit(tenant.name)}
        />

        : <TenantRow
            key={tenant.name}
            i={offset + i}
            tenantData={tenant}
            onDelete={() => onDelete(tenant.name)}
            onToggleHidden={() => onToggleHide(tenant.name)}
            onEdit={() => onEdit(tenant.name)}
        />
    );
    
}