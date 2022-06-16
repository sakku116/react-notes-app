export default function NoteItem({id, title, body, archived, createdAt, onDelete, onArchive}) {
    return (
        <div className="noteItem card">
            <h3 className="noteTitle">{title}</h3>
            <p className="noteDate">{createdAt}</p>
            <p className="noteBody">{body}</p>
            <div className="noteButtonContainer">
                <button onClick={ () => {onDelete(id)} }>Hapus</button>

                <button onClick={ () => {onArchive(id)} }>{ archived ? "Buka arsip" : "arsipkan"}</button>
            </div>
        </div>
    )
}