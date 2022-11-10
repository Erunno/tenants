import EditTenant from "./EditTenant";
import TenantRow from "./TenantRow";

export default function TenantRowSet({ allNames, tenants, callbacks: { onEdit, onSaveEdited, onDelete, onToggleHide, onCancelEdit } }) {
    return tenants.map((tenant, i) => tenant.beingEdited
        ? <EditTenant
            key={tenant.name}
            tenantId={tenant.id}
            forbiddenNames={allNames.filter(n => n !== tenant.name)}
            onSave={(mewData) => onSaveEdited(tenant.id, mewData)}
            tenantData={tenant}
            onCancel={() => onCancelEdit(tenant.id)}
        />

        : <TenantRow
            key={tenant.name}
            tenantData={tenant}
            onDelete={() => onDelete(tenant.id)}
            onToggleHidden={() => onToggleHide(tenant.id)}
            onEdit={() => onEdit(tenant.id)}
        />
    );
    
}