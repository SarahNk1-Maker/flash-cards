'use client';

import { Container, Card, Grid, Typography, Box, CardActionArea, CardContent, Button } from "@mui/material";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function Flashcard() {
    const router = useRouter();
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function fetchFlashcards() {
            if (!search || !user) return;

            try {
                const response = await fetch('/api/flashcardBack', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([{ content: search }]) 
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setFlashcards(data.flashcards || []);
            } catch (error) {
                console.error('Error fetching flashcards:', error);
            }
        }

        fetchFlashcards();
    }, [user, search]);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleClick = async () => {
        if (!search) return;

        const response = await fetch('/api/flashcardBack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{ content: search }]),
        });

        if (response.ok) {
            router.push('./flashcardgeneration');
        } else {
            console.error('Failed to generate flashcards');
        }
    };

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    if (!flashcards.length) {
        return <Typography>No flashcards found.</Typography>;
    }

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', padding: 0 }}>
            <Container maxWidth="md">
                <Button onClick={handleClick} variant="contained" color="primary" sx={{ mb: 4 }}>
                    Generate Flashcards
                </Button>
                <Grid container spacing={3} sx={{ mt: 4 }}>
                    {flashcards.map((flashcard) => (
                        <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                            <Card
                                sx={{
                                    height: 200,
                                    perspective: '1000px',
                                    position: 'relative',
                                    backgroundColor: '#F9F7FC',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                                onClick={() => handleCardClick(flashcard.id)}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '100%',
                                        transition: 'transform 0.6s',
                                        transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        transformStyle: 'preserve-3d',
                                    }}
                                >
                                    <CardActionArea
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#C4A3C4',
                                            color: '#FFFFFF',
                                        }}
                                    >
                                        <CardContent>
                                            <Typography 
                                                variant="h5" 
                                                component="div"
                                                sx={{ 
                                                    fontFamily: 'Dancing Script, cursive',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {flashcard.front}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
    
                                    <CardActionArea
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#B48CB9',
                                            color: '#FFFFFF',
                                        }}
                                    >
                                        <CardContent>
                                            <Typography 
                                                variant="h5" 
                                                component="div"
                                                sx={{ 
                                                    fontFamily: 'Dancing Script, cursive',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {flashcard.back}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
