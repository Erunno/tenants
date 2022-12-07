import "./GroupSelector.css";
import AddNewBtn from '../../shared/components/btns/AddNewBtn';
import EditBtn from "../../shared/components/btns/EditBtn";
import { useRef, useState } from "react";
import SaveBtn from "../../shared/components/btns/SaveBtn";
import CancelBtn from "../../shared/components/btns/CancelBtn";
import DeleteBtn from "../../shared/components/btns/DeleteBtn";

export function GroupSelector({ groups, onGroupsChanged, selectedGroupId, onSelectedChanged }) {

    const [addingNew, setAddingNew] = useState(false);
    const [editingGroups, setEditingGroups] = useState(false);
    const [tmpGroupsForEdit, setTmpGroupsForEdit] = useState([]);
    const newGroupNameInput = useRef(null);

    function clickedOnEdit() {
        const newTmpGroups = groups.map(g => ({
            id: g.id,
            name: g.name
        }));

        setTmpGroupsForEdit(newTmpGroups);

        setEditingGroups(true);
        setAddingNew(false);
    }

    function onDeletedGroup(groupId) {
        return () => {
            const newGroups = groups
                .filter(g => g.id !== groupId)
                .map(g => ({ ...g }));

            setEditingGroups(false);
            onGroupsChanged(newGroups);
        }
    }

    function onAddNewGroup() {
        const name = newGroupNameInput.current.value;
        const id = groups.length !== 0
            ? Math.max(...groups.map(g => g.id)) + 1
            : 0;


        const newGroups = [...groups, { id, name, tenants: [], bills: [] }];

        setAddingNew(false);
        onGroupsChanged(newGroups);
    }

    function saveEditedGroups() {

        onGroupsChanged(tmpGroupsForEdit.map(g => {
            const oldGroup = groups.filter(x => x.id === g.id)[0];

            return {
                ...oldGroup,
                name: g.name,
            };
        }));
        setEditingGroups(false);
    }

    return <div className="mt-3">
        <div className="group-title-container">
            <h1>Groups</h1>
            <div className="ms-4" />
            {!addingNew && !editingGroups && <>
                <div className="group-title-btn-container me-1">
                    <AddNewBtn label={"Add"} onClick={() => setAddingNew(true)} />
                </div>

                {groups.length !== 0 &&
                    <div className="group-title-btn-container">
                        <EditBtn label={"Edit"} onClick={clickedOnEdit} secondaryColor={true} />
                    </div>
                }
            </>
            }
        </div>

        {!editingGroups && groups.length !== 0 && <div className="group-row-container mt-3">

            {groups.map(g => {

                const cssClasses = g.id === selectedGroupId
                    ? "btn me-1 btn-success"
                    : "btn me-1 btn-outline-secondary";

                return <div
                    key={g.id}
                    className={cssClasses}
                    onClick={() => onSelectedChanged(g.id)}
                >
                    {g.name}
                </div>
            })}

        </div>}

        {editingGroups && <div className="group-edit-container mt-3 mb-3">

            {tmpGroupsForEdit.map(g => {

                function onChangeOfInput(e) {
                    const newGroup = {
                        name: e.target.value,
                        id: g.id,
                    };

                    const positionOfOld = tmpGroupsForEdit.findIndex(x => x.id === g.id);
                    const newGroupsForEdit = tmpGroupsForEdit.filter(x => x.id !== g.id);

                    newGroupsForEdit.splice(positionOfOld, 0, newGroup);

                    setTmpGroupsForEdit(newGroupsForEdit);
                }

                return <div className="edit-group-btn-container m-3 me-1" key={g.id}>
                    <input type="text" className="form-control group-"
                        value={g.name}
                        onChange={onChangeOfInput} />
                    <div className="ms-2" />
                    <DeleteBtn
                        smallVersion={true}
                        confirmDeleteMessage={`Do you want to delete group "${groups.filter(x => x.id === g.id)[0].name}" and ALL data in in it?`}
                        label={'Delete Group'}
                        onClick={onDeletedGroup(g.id)} />
                </div >

            })}
            <div className="edit-btn-row ms-3 mb-3">
                <SaveBtn label={'Save'} onClick={saveEditedGroups} />
                <CancelBtn label={'Cancel'} onClick={() => setEditingGroups(false)} />
            </div>

        </div>}

        {
            addingNew && <div className="add-new-group-container mt-3">
                <div className="container pt-2 pb-3">
                    <label className="form-check-label me-2 mt-auto mb-auto" htmlFor="tenant-name-2">Name</label>
                    <input ref={newGroupNameInput} type="text" className="mt-2 mb-3 form-control" />

                    <div className="new-group-btn-row mt-4">
                        <SaveBtn label={'Save Group'} onClick={onAddNewGroup} />
                        <CancelBtn label={'Cancel'} onClick={() => setAddingNew(false)} />
                    </div>
                </div>

            </div>
        }


    </div>
}