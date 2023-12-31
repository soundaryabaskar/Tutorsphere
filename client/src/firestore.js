import { addDoc, collection, doc, deleteDoc, getDocs, getDoc, onSnapshot, setDoc, updateDoc, query } from "@firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "./components/context/UserAuthContext";
import { firestore} from "./firebase";

const useFirestore = () => {

    const {user} = useAuthContext();
    const [data, setData] = useState();
    const [appointmentsData, setAppointmentsData] = useState([]);
    const [futureAppointments, setFutureAppointments] = useState([]);
    const USERS_COLLECTION_NAME = "users";


    async function addDocumentToCollectionWithDefaultId(COLLECTION_NAME, documentInfo){
        const docRef = await addDoc(collection(firestore, COLLECTION_NAME), documentInfo);
        return docRef;
    }

     async function addDocumentToCollection(COLLECTION_NAME, documentId, documentInfo){
        const customDocRef = doc(firestore, COLLECTION_NAME, documentId);
        return setDoc(customDocRef, documentInfo);
    }

    async function updateDocument(COLLECTION_NAME, documentId, newField){
        const documentRef = doc(firestore, COLLECTION_NAME, documentId);
        return updateDoc(documentRef, newField)
    }

    const fetchDocumentById = useCallback(async (collectionName, documentId) => {
      const docRef = doc(firestore, collectionName, documentId);
      const docSnapshot = await getDoc(docRef);
    
      if (docSnapshot.exists()) {
        return docSnapshot.data();
      } else {
        throw new Error("Document with document Id of " + documentId + " not found!");
      }
    }, [firestore]); 
    
    

    useEffect(() => {
        // gets data for specific user document (current document)
        const getDataFromFirestore = async() => {
            if(user){

                const unsub = onSnapshot(doc(firestore, USERS_COLLECTION_NAME, user?.uid), (doc) => {
                    setData({id: doc.id, ...doc.data()});
                });
                return () => unsub();
            }
        };
        getDataFromFirestore();
    }, [user]);



    useEffect(() => {
        const q = query(collection(firestore, 'appointments'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAppointmentsData(docs);
        });
        return () => {
          unsubscribe();
        };
      }, []);

    useEffect(() => {

        async function getCurrentUserFutureAppointments(){
            const allCurrentUserAppointments = await getCurrentUserAppointments();
            const now = new Date();
            const currentUserFutureAppointments = allCurrentUserAppointments.filter(appointment => {
                const appointmentDate = new Date(appointment?.startTime);
                if(appointmentDate > now){
                    return true;
                }else{
                    return false;
                }
            });
            setFutureAppointments(currentUserFutureAppointments);
          }

          getCurrentUserFutureAppointments();
    

    }, [data, appointmentsData]);

    const getAllDocs = async (collectionName) => {
        const querySnapshot = await getDocs(collection(firestore, collectionName));
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        return docs;
      };

      async function getAllTutors(){
        const allUsersData = await getAllDocs("users");
        const allTutors = allUsersData.filter(user => user.userRole === "tutors");
        return allTutors;
      }

    async function getUser(id) {
        const userRef = doc(collection(firestore, "users"), id) // reference specefic user
        const userDoc = await getDoc(userRef) // get their document

        const userData = userDoc.data() // get doc data
        return userData;
    }

      async function getAllSubjects(){
        const allUsersData = await getAllDocs("users");
        const uniqueSubjects = new Set();
        allUsersData?.forEach(user => {
            user?.subjects?.forEach(subject => {
                uniqueSubjects.add(subject);
            });
        });
        return Array.from(uniqueSubjects);
      }

      async function getCurrentUserAppointments(){
        // const allAppointments = await getAllDocs("appointments");
        const currentUserAppointments = appointmentsData.filter(appointment => {
            if(data?.userRole === "tutors"){
                return appointment?.tutorId === data?.id;
            }else if(data?.userRole === "students"){
                return appointment?.studentId === data?.id;
            }
        });
        return currentUserAppointments;
      }

      async function cancelAppointment(appointmentId){   
        await deleteDoc(doc(firestore, 'appointments', appointmentId));
      }
      
    return {data, addDocumentToCollection, updateDocument, getAllDocs, getUser,getAllTutors, getAllSubjects, addDocumentToCollectionWithDefaultId, fetchDocumentById, futureAppointments, appointmentsData, cancelAppointment}
};

export default useFirestore;


