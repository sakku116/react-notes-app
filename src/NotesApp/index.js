import React from 'react';
import './style.css'
import { getInitialData, showFormattedDate } from './initialData.js'
import NoteItem from './NoteItem-Component.js';

/*
element catatan:
{
    id: 1,
    title: "Babel",
    body: "Babel merupakan tools open-source yang digunakan untuk mengubah sintaks ECMAScript 2015+ menjadi sintaks yang didukung oleh JavaScript engine versi lama. Babel sering dipakai ketika kita menggunakan sintaks terbaru termasuk sintaks JSX.",
    archived: false,
    createdAt: '2022-04-14T04:27:34.572Z'
},
*/

class NotesApp extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            noteList: getInitialData(),
            addTitleField: '',
            addBodyField: '',
            searchUnarchivedItemField: '',
            searchArchivedItemField: '',
        };

        this.isNotesEmpty = this.isNotesEmpty.bind(this);
        this.isItemArchived = this.isItemArchived.bind(this);
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.archiveItem = this.archiveItem.bind(this);
        this.unarchiveItem = this.unarchiveItem.bind(this);
        this.onDeleteNoteItemHandler = this.onDeleteNoteItemHandler.bind(this);
        this.onArchiveNoteItemHandler = this.onArchiveNoteItemHandler.bind(this);
        this.onAddTitleFieldChangeHandler = this.onAddTitleFieldChangeHandler.bind(this);
        this.onAddBodyFieldChangeHandler = this.onAddBodyFieldChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onSearchUnarchivedItemFieldChangeHandler = this.onSearchUnarchivedItemFieldChangeHandler.bind(this);
        this.onSearchArchivedItemFieldChangeHandler = this.onSearchArchivedItemFieldChangeHandler.bind(this);
    }

    isNotesEmpty() {
        // if at least one item is not archived, return false (not empty)
        for (var i of this.state.noteList) {
            if (i.archived === false) {
                return false;
            };
        };
        // for some reason it will also detect if all of the notes is deleted
        return true;
    }

    isArchivedNotesEmpty() {
        // if at least one item is archived, return false (not empty)
        for (var i of this.state.noteList) {
            if (i.archived === true) {
                return false;
            };
        };
        return true;
    }

    isItemArchived(note) {
    	if(note.archived === true) {
    		return true;
    	};
    	return false;
    }

    // UPDATE STATE
    addItem(item) {
        this.setState(
            {
                noteList: [
                    ...this.state.noteList,
                    item
                ]
            }
        );
    }

    deleteItem(id) {
        const noteList = this.state.noteList.filter(note => note.id !== id);
        this.setState({ noteList });
    }

    archiveItem(item) {
    	// set 'archived' status to true
    	item.archived = true; 

    	// get list and exclude the target
    	const note_list_temp = this.state.noteList.filter(note => note.id !== item.id)

    	// set noteList state value to note_list_temp + edited object
    	this.setState(
	    	{
	    		noteList: [
	    			...note_list_temp,
	    			item,
	    		]
	    	}
    	);
    }

    unarchiveItem(item) {
        // set 'archived' status to true
        item.archived = false; 

        // get list and exclude the target
        const note_list_temp = this.state.noteList.filter(note => note.id !== item.id);

        // set noteList state value to note_list_temp + edited object
        this.setState(
            {
                noteList: [
                    ...note_list_temp,
                    item,
                ]
            }
        );
    }

    // EVENT HANDLER
    onDeleteNoteItemHandler(id) {
    	this.deleteItem(id);
    }

    onArchiveNoteItemHandler(id) {
        // get item object
        for (const note of this.state.noteList) {
            if (note.id === id) {
                var item_target = note;
            };
        };

        if (item_target.archived === false) {
            this.archiveItem(item_target);
        } else {
            this.unarchiveItem(item_target);
        };
    }

    onAddTitleFieldChangeHandler(event) {
        if ((event.target.value).length <= 50) {
            this.setState(
                {
                    addTitleField: event.target.value
                }
            );
        };
    } 

    onAddBodyFieldChangeHandler(event) {
        this.setState(
            {
                addBodyField: event.target.value
            }
        );
    }

    onSubmitHandler(event) {
        event.preventDefault();

        var title = '';

        if (this.state.addTitleField !== '') {
            title = this.state.addTitleField;
        } else {
            title = "Tanpa Judul";
        };

        var new_item = {
            id: +new Date(),
            title: title,
            body: this.state.addBodyField,
            archived: false,
            createdAt: showFormattedDate(new Date())
        };

        this.addItem(new_item);

        // reset field
        this.setState(
            {
                addTitleField: '',
                addBodyField: '',
            }
        );
    }

    onSearchUnarchivedItemFieldChangeHandler(event) {
        this.setState(
            {
                searchUnarchivedItemField: event.target.value
            }
        );
    }

    onSearchArchivedItemFieldChangeHandler(event) {
        this.setState(
            {
                searchArchivedItemField: event.target.value
            }
        );
    }

    render() {
        return (
            <div id="main">
                <h1>Aplikasi Catatan Pribadi</h1>
                <hr />

                <section id="addNoteSection" className="card">
                	<h2>Tambah Catatan</h2>
                	<form onSubmit={this.onSubmitHandler}>
                        <p className="lettersNumberRemaining">{50 - (this.state.addTitleField).length} (sisa karakter)</p>
                        <textarea className="addTitleField" type="text" placeholder="Judul" value={this.state.addTitleField} onChange={this.onAddTitleFieldChangeHandler} />
                        <textarea className="addBodyField" type="text" placeholder="Body" value={this.state.addBodyField} onChange={this.onAddBodyFieldChangeHandler} />
                        <button type="submit">Tambah</button>
                    </form>
                </section>

                <section id="noteListSection">
                    <h2>Daftar Catatan</h2>
                    <input className="searchField" type="text" placeholder = "Cari catatan ....." value={this.state.searchUnarchivedItemField} onChange={this.onSearchUnarchivedItemFieldChangeHandler} />

                    {this.isNotesEmpty() ? <p>tidak ada catatan</p> : <></>}

                    <div className="noteListContainer">
                        {
                        	this.state.noteList
                        		// exclude archived item, and filter if search query is match
                                .filter(note => 
                                    note.archived === false
                                    && 
                                    (note.title).toLowerCase().indexOf(this.state.searchUnarchivedItemField) > -1
                                )
                        		// render for each object
                        		.map((note) => (
	                                <NoteItem 
                                        key={note.id}
	                                    onDelete={this.onDeleteNoteItemHandler}
	                                    onArchive={this.onArchiveNoteItemHandler}
	                                    {...note} 
	                                />
	                            ))
                        }
                    </div>
                </section>

                <section id="archiveSection">
                    <h2>Arsip</h2>
                    <input className="searchField" type="text" placeholder = "Cari catatan yand di arsipkan ....." value={this.state.searchArchivedItemField} onChange={this.onSearchArchivedItemFieldChangeHandler} />

                    {this.isArchivedNotesEmpty() ? <p>tidak ada catatan yang diarsipkan</p> : <></>}

                    <div className="noteListContainer">
                        {
                            this.state.noteList
                                // exclude archived item, and filter if search query is match
                                .filter(note => 
                                    note.archived === true 
                                    && 
                                    (note.title).toLowerCase().indexOf(this.state.searchArchivedItemField) > -1
                                )
                                // render for each object
                                .map((note) => (
                                    <NoteItem 
                                        key={note.id}
                                        onDelete={this.onDeleteNoteItemHandler}
                                        onArchive={this.onArchiveNoteItemHandler}
                                        {...note} 
                                    />
                                ))
                        }
                    </div>
                </section>
            </div>
        ) 
    }
}

export default NotesApp