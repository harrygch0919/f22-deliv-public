import { addDoc, updateDoc,collection ,doc,deleteDoc} from "firebase/firestore";
import { db } from './firebase';

// Functions for database mutations

export const emptyEntry = {
   name: "",
   link: "",
   description: "",
   user: "",
   category: 0,
}

export async function addEntry(entry) {
   console.log('entry==',entry)
   const id = await addDoc(collection(db, "entries"), {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      user: entry.user,
      category: entry.category,
      // The ID of the current user is logged with the new entry for database user-access functionality.
      // You should not remove this userid property, otherwise your logged entries will not display.
      userid: entry.userid,
   });
   console.log("唯一id==",id)
}

export async function updateEntry(entry,userid) {
   console.log("entry==",entry)
   // TODO: Create Mutation to Edit Entry
   console.log('collection==',collection(db, "entries"));
   const id = await updateDoc(doc(collection(db, "entries"),userid), {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      user: entry.user,
      category: entry.category,
   });

}

export async function deleteEntry(entry,userid) {
   // TODO: Create Mutation to Delete Entry
   await deleteDoc(doc(db,'entries',userid))
}