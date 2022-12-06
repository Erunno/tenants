import "./GroupSelector.css";
import AddNewBtn from '../../shared/components/btns/AddNewBtn';
import EditBtn from "../../shared/components/btns/EditBtn";
import { useState } from "react";
import SaveBtn from "../../shared/components/btns/SaveBtn";
import CancelBtn from "../../shared/components/btns/CancelBtn";
import DeleteBtn from "../../shared/components/btns/DeleteBtn";

export function GroupSelector({ groups, onGroupsChanged, selectedGroupId, onSelectedChanged }) {

    const [addingNew, setAddingNew] = useState(false);
    const [editingGroups, setEditingGroups] = useState(false);
    const [tmpGroupsForEdit, setTmpGroupsForEdit] = useState([]);

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

            onGroupsChanged(newGroups);
            setEditingGroups(false);
        }
    }

    function onAddNewGroup(groupName) {

    }

    function saveEditedGroups() {
        onGroupsChanged(tmpGroupsForEdit.map(g => ({
            id: g.id,
            name: g.name
        })));
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
                <div className="group-title-btn-container">
                    <EditBtn label={"Edit"} onClick={clickedOnEdit} />
                </div>
            </>
            }
        </div>

        {!editingGroups && <div className="group-row-container mt-3 mb-4">

            {groups.map(g => {

                let cssClasses = "group-option btn ";
                if (g.id === selectedGroupId)
                    cssClasses += "selected-group";

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
            addingNew && <div className="add-new-group-container">
                <div className="container pt-2 pb-3">
                    <label className="form-check-label me-2 mt-auto mb-auto" htmlFor="tenant-name-2">Name</label>
                    <input type="text" className="mt-2 mb-3 form-control" />

                    <div className="new-group-btn-row mt-4">
                        <SaveBtn label={'Save Group'} />
                        <CancelBtn label={'Cancel'} onClick={() => setAddingNew(false)} />
                    </div>
                </div>

            </div>
        }


    </div>
}