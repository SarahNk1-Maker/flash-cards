// 'use client';

// import { Container, Card, Grid, Typography, Box, CardActionArea, CardContent } from "@mui/material";
// import { doc, collection, getDocs } from "firebase/firestore";
// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { useUser } from '@clerk/nextjs';
// import { db } from "../firebase";

// export default function Flashcard() {
//     const { isLoaded, isSignedIn, user } = useUser();
//     const [flashcards, setFlashcards] = useState([]);
//     const [flipped, setFlipped] = useState({});

//     const searchParams = useSearchParams();
//     const search = searchParams.get('id');

//     useEffect(() => {
//         async function getFlashcard() {
//             if (!search || !user) return;

//             try {
//                 const colRef = collection(doc(collection(db, 'users'), user.id), search);
//                 const docs = await getDocs(colRef);
//                 const flashcards = docs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//                 setFlashcards(flashcards);
//             } catch (error) {
//                 console.error("Error fetching flashcards:", error);
//             }
//         }
//         getFlashcard();
//     }, [user, search]);

//     const toggleFlip = (id) => {
//         setFlipped((prevState) => ({
//             ...prevState,
//             [id]: !prevState[id],
//         }));
//     };

//     if (!isLoaded || !isSignedIn) {
//         return <></>;
//     }

//     return (
//         <Box sx={{ position: 'relative', minHeight: '100vh', padding: 0 }}>
//             <Container maxWidth="md">
//                 <Grid container spacing={3} sx={{ mt: 4 }}>
//                     {flashcards.length > 0 ? (
//                         flashcards.map((flashcard) => (
//                             <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
//                                 <Card
//                                     sx={{
//                                         height: 200,
//                                         perspective: '1000px',
//                                         position: 'relative',
//                                         backgroundColor: '#F9F7FC',
//                                         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                                         '&:hover': {
//                                             boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
//                                         },
//                                     }}
//                                     onClick={() => toggleFlip(flashcard.id)}
//                                 >
//                                     <Box
//                                         sx={{
//                                             position: 'relative',
//                                             width: '100%',
//                                             height: '100%',
//                                             transition: 'transform 0.6s',
//                                             transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
//                                             transformStyle: 'preserve-3d',
//                                         }}
//                                     >
//                                         {/* Front Side */}
//                                         <CardActionArea
//                                             sx={{
//                                                 position: 'absolute',
//                                                 width: '100%',
//                                                 height: '100%',
//                                                 backfaceVisibility: 'hidden',
//                                                 display: 'flex',
//                                                 justifyContent: 'center',
//                                                 alignItems: 'center',
//                                                 backgroundColor: '#C4A3C4',
//                                                 color: '#FFFFFF',
//                                             }}
//                                         >
//                                             <CardContent>
//                                                 <Typography 
//                                                     variant="h5" 
//                                                     component="div"
//                                                     sx={{ 
//                                                         fontFamily: 'Dancing Script, cursive',
//                                                         fontWeight: 700,
//                                                     }}
//                                                 >
//                                                     {flashcard.front}
//                                                 </Typography>
//                                             </CardContent>
//                                         </CardActionArea>

//                                         {/* Back Side */}
//                                         <CardActionArea
//                                             sx={{
//                                                 position: 'absolute',
//                                                 width: '100%',
//                                                 height: '100%',
//                                                 backfaceVisibility: 'hidden',
//                                                 transform: 'rotateY(180deg)',
//                                                 display: 'flex',
//                                                 justifyContent: 'center',
//                                                 alignItems: 'center',
//                                                 backgroundColor: '#B48CB9',
//                                                 color: '#FFFFFF',
//                                             }}
//                                         >
//                                             <CardContent>
//                                                 <Typography 
//                                                     variant="h5" 
//                                                     component="div"
//                                                     sx={{ 
//                                                         fontFamily: 'Dancing Script, cursive',
//                                                         fontWeight: 700,
//                                                     }}
//                                                 >
//                                                     {flashcard.back}
//                                                 </Typography>
//                                             </CardContent>
//                                         </CardActionArea>
//                                     </Box>
//                                 </Card>
//                             </Grid>
//                         ))
//                     ) : (
//                         <Typography>No flashcards found.</Typography>
//                     )}
//                 </Grid>
//             </Container>
//         </Box>
//     );
// }
'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore'
import { db } from '../firebase' // Adjust import based on your Firebase configuration



export default function Generate() 
{const { user } = useAuth(); 

  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
 

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }

    try {
      const response = await fetch('/api/flashcardBack', {
        method: 'POST',
        body: text,
      })

      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }

      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }
    if (!user) {
      console.error('User is not authenticated.')
      alert('User is not authenticated.')
      return
    }
  
    console.log('User:', user); // Log the user object
  

    try {
      const userDocRef = doc(collection(db, 'users'), userId)
      const userDocSnap = await getDoc(userDocRef)

      const batch = writeBatch(db)

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
        batch.update(userDocRef, { flashcardSets: updatedSets })
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
      }

      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
      batch.set(setDocRef, { flashcards })

      await batch.commit()

      alert('Flashcards saved successfully!')
      handleCloseDialog()
      setSetName('')
      setFlashcards([]) // Clear flashcards after saving
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>
      {flashcards.length > 0 && (
        <>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Generated Flashcards
            </Typography>
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Front:</Typography>
                      <Typography>{flashcard.front}</Typography>
                      <Typography variant="h6" sx={{ mt: 2 }}>Back:</Typography>
                      <Typography>{flashcard.back}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              Save Flashcards
            </Button>
          </Box>
        </>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}