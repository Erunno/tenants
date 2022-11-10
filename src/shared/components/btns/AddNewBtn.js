import './AddNewBtn.css';

export default function AddNewBtn({ label, onClick }) {
    return <span className="add-new-btn btn btn-success me-2" onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-1 plus bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
        <span className="add-btn-label me-2 ms-1">{label}</span>
    </span>
}