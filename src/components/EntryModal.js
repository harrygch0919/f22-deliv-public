import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import {useRef, useState} from 'react';
import { categories } from '../utils/categories';
import {addEntry, deleteEntry, updateEntry} from '../utils/mutations';
import QRCode from 'qrcode'
import { saveAs } from 'file-saver'
// Modal component for individual entries.

/* EntryModal parameters:
entry: Data about the entry in question
type: Type of entry modal being opened. 
   This can be "add" (for adding a new entry) or 
   "edit" (for opening or editing an existing entry from table).
user: User making query (The current logged in user). */

export default function EntryModal({ entry, type, user }) {
   console.log("@entry==",entry,user)
   // State variables for modal status

   // TODO: For editing, you may have to add and manage another state variable to check if the entry is being edited.
   const myQR = useRef(null)
   const [open, setOpen] = useState(false);
   const [name, setName] = useState(entry.name);
   const [link, setLink] = useState(entry.link);
   const [disable,setDis] = useState(false);
   const [description, setDescription] = useState(entry.description);
   const [category, setCategory] = React.useState(entry.category);
   // Modal visibility handlers

   const handleClickOpen = () => {
      if (type==='edit') {setDis(true)};
      setOpen(true);
      setName(entry.name);
      setLink(entry.link);
      setDescription(entry.description);
      setCategory(entry.category);
   };

   const handleClose = () => {
      setOpen(false);
      myQR.current.style.display = 'none'
   };

   // Mutation handlers

   const handleAdd = () => {
      const newEntry = {
         name: name,
         link: link,
         description: description,
         user: user?.displayName ? user?.displayName : "GenericUser",
         category: category,
         userid: user?.uid,
      };
      addEntry(newEntry).catch(console.error);
      handleClose();
      myQR.current.style.display = 'none'
   };


   // TODO: Add Edit Mutation Handler
   const HandleEdit = event=>{
      console.log("disabled=",disable)
         if (disable){
            setDis(false);
         }
         else {
         const newEntry = {
            name: name,
            link: link,
            description: description,
            user: user?.displayName ? user?.displayName : "GenericUser",
            category: category,
            // userid: entry.userid,
         };
         updateEntry(newEntry,entry.id).catch(console.error)
         handleClose();
      }

   }

   
   const showQRcode = ()=>{
      myQR.current.style.display = 'block'
      console.log('myLink=,',link)
      QRCode.toCanvas(document.getElementById("QRcode"), `http://${link}`, function (error) {
         if (error) console.error(error)
         console.log('success!');
      })
   }
   
   const download = ()=>{
      let url = myQR.current.toDataURL("image/png")
      window.href = url
   }
   
   
   

   

   // TODO: Add Delete Mutation Handler
   const HandleDelete = ()=>{
      if (window.confirm("Are you sure you want to delete?")){
         deleteEntry("",entry.id).catch(console.error)
         handleClose()
      }else{
         handleClose()
      }

   }
   // Button handlers for modal opening and inside-modal actions.
   // These buttons are displayed conditionally based on if adding or editing/opening.
   // TODO: You may have to edit these buttons to implement editing/deleting functionality.

   const openButton =
      type === "edit" ? <IconButton onClick={handleClickOpen}>
         <OpenInNewIcon />
      </IconButton>
         : type === "add" ? <Button variant="contained" onClick={handleClickOpen}>
            Add entry
         </Button>
            : null;

   const actionButtons =
      type === "edit" ?
         <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={HandleEdit}>{disable?'EDIT':'CONFIRM'}</Button>
            <Button onClick={HandleDelete}>DELETE</Button>
         </DialogActions>
         : type === "add" ?
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button onClick={showQRcode}>GENERATE QR</Button>
               <Button variant="contained" onClick={handleAdd}>Add Entry</Button>
            </DialogActions>
            : null;
   console.log("type==",type)
   return (
      <div>
         {openButton}
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{type === "edit" ? name : "Add Entry"}</DialogTitle>
            <DialogContent>
               {/* TODO: Feel free to change the properties of these components to implement editing functionality. The InputProps props class for these MUI components allows you to change their traditional CSS properties. */}
               <TextField
                  margin="normal"
                  id="name"
                  label="Name"
                  fullWidth
                  variant="standard"
                  value={name}
                  disabled={disable}
                  onChange={(event) => setName(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="link"
                  label="Link"
                  placeholder="e.g. https://google.com"
                  fullWidth
                  variant="standard"
                  value={link}
                  disabled={disable}
                  onChange={(event) => setLink(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="description"
                  label="Description"
                  fullWidth
                  variant="standard"
                  multiline
                  maxRows={8}
                  value={description}
                  disabled={disable}
                  onChange={(event) => setDescription(event.target.value)}
               />

               <FormControl fullWidth sx={{ "margin-top": 20 }}>
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                     value={category}
                     label="Category"
                     disabled={disable}
                     onChange={(event) => setCategory(event.target.value)}
                  >
                     {categories.map((category) => (<MenuItem value={category.id}>{category.name}</MenuItem>))}
                  </Select>
               </FormControl>
            </DialogContent>

            <canvas id="QRcode" ref={myQR} style={{display:'none'}}></canvas>


            {actionButtons}

         </Dialog>
      </div>
   );
}