// src/contexts/VocabContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { vocabularyData } from '../data';  // Make sure this import is correct

const VocabContext = createContext();

export const useVocab = () => {
  const context = useContext(VocabContext);
  if (!context) {
    throw new Error('useVocab must be used within a VocabProvider');
  }
  return context;
};

export const VocabProvider = ({ children }) => {
  // Load initial state from localStorage
  const loadInitialState = () => {
    const saved = localStorage.getItem('vocabMasterState_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert arrays back to arrays (they might be Sets in old code)
      return {
        ...parsed,
        bookmarkedWords: Array.isArray(parsed.bookmarkedWords) ? parsed.bookmarkedWords : [],
        studyStats: {
          ...parsed.studyStats,
          cardsStudied: Array.isArray(parsed.studyStats?.cardsStudied) ? parsed.studyStats.cardsStudied : [],
        },
      };
    }
    return {
      currentCardIndex: 0,
      bookmarkedWords: [],
      masteredWords: {},
      studyStats: {
        cardsStudied: [],
        totalFlips: 0,
        studyTime: 0,
        lastStudyDate: null,
        studyStreak: 0,
        quizScores: [],
      },
      theme: 'light',
    };
  };

  const [state, setState] = useState(loadInitialState);
  const [vocabulary] = useState(vocabularyData);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('vocabMasterState_v2', JSON.stringify(state));
  }, [state]);

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Toggle theme
  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  // Toggle bookmark
  const toggleBookmark = (word) => {
    setState(prev => {
      const bookmarked = [...prev.bookmarkedWords];
      const index = bookmarked.indexOf(word);
      
      if (index > -1) {
        bookmarked.splice(index, 1);
      } else {
        bookmarked.push(word);
      }
      
      return {
        ...prev,
        bookmarkedWords: bookmarked
      };
    });
  };

  // Update mastery level
  const updateMastery = (word, level) => {
    setState(prev => ({
      ...prev,
      masteredWords: {
        ...prev.masteredWords,
        [word]: Math.min(level, 5)
      }
    }));
  };

  // Increase mastery by 1
  const increaseMastery = (word) => {
    setState(prev => {
      const current = prev.masteredWords[word] || 0;
      return {
        ...prev,
        masteredWords: {
          ...prev.masteredWords,
          [word]: Math.min(current + 1, 5)
        }
      };
    });
  };

  // Navigate flashcards
  const nextCard = () => {
    setState(prev => ({
      ...prev,
      currentCardIndex: (prev.currentCardIndex + 1) % vocabulary.length
    }));
  };

  const prevCard = () => {
    setState(prev => ({
      ...prev,
      currentCardIndex: (prev.currentCardIndex - 1 + vocabulary.length) % vocabulary.length
    }));
  };

  const goToCard = (index) => {
    setState(prev => ({
      ...prev,
      currentCardIndex: Math.max(0, Math.min(index, vocabulary.length - 1))
    }));
  };

  // Get current card
  const getCurrentCard = () => {
    return vocabulary[state.currentCardIndex] || vocabulary[0];
  };

  // Get mastery level for a word
  const getMasteryLevel = (word) => {
    return state.masteredWords[word] || 0;
  };

  // Check if word is bookmarked
  const isBookmarked = (word) => {
    return state.bookmarkedWords.includes(word);
  };

  // Add a word to studied cards
  const addToStudied = (word) => {
    setState(prev => {
      const studied = new Set(prev.studyStats.cardsStudied);
      studied.add(word);
      return {
        ...prev,
        studyStats: {
          ...prev.studyStats,
          cardsStudied: Array.from(studied)
        }
      };
    });
  };

  const value = {
    ...state,
    vocabulary,
    toggleTheme,
    toggleBookmark,
    updateMastery,
    increaseMastery,
    nextCard,
    prevCard,
    goToCard,
    getCurrentCard,
    getMasteryLevel,
    isBookmarked,
    addToStudied,
  };

  return <VocabContext.Provider value={value}>{children}</VocabContext.Provider>;
};
// import React,{createContext,useContext,useState,useEffect} from "react";
// import {vocabularyData} from '../data'
// const vocabContext=createContext();

// export const useVocab=()=>useContext(vocabContext);
// export const VocabProvider=({children})=>{
//     const LoadInitialState=()=>{
//         const saved=localStorage.getItem('vocabMasterState_v2');
//         if(saved){
//             return JSON.parse(saved);
//         }
//         return{
//             currentCardIndex:0,
//             bookmarkedWords:[],
//             masteredWords:{},
//             studyStats:{
//                 cardStudied:[],
//                 totalFlips:0,
//                 studyTime:0,
//                 lastStudyDate:null,
//                 studyStreak:0,
//                 quizScores:[]
//             },
//             theme:'light',
//         };
//     };
//     const [state,setState]=useState(LoadInitialState);
//     const [voabulary]=useState(vocabularyData);

//     useEffect(()=>{
//         localStorage.setItem('vocabMasteredState_v2',JSON.stringify(state));
//         },[state]);
//         // I do not know why we set it this way 👆👆👆👆
//         const ToggleTheme=()=>{
//             setState(prev=>({
//                 ...prev,
//                 theme:prev.theme==="light"?"dark":"light"
//             }));
//         };
        
//         const ToggleBookMark=(word)=>{
//             setState(prev=>{
//                 const bookmarked=[...prev.bookmarkedWords];
//                 const index=bookmarked.indexOf(word);
//                 if(index>-1){
//                     bookmarked.splice(index,1);
//                 }else{
//                     bookmarked.push(word);
//                 }
//                 return{
//                     ...prev,
//                     bookmarkedWords:bookmarked
//                 };
//             });
//         };

//         const increaseMastery=(word)=>{
//             setState(prev=>{
//             const current=prev.masteredWords[word]||0;
//             return{
//                 ...prev,
//                 masteredWords:{
//                     // I Could not understand this one. THe syntax is advance
//                     ...prev.masteredWords,
//                     [word]:Math.min(current,1,5)
//                 }
//             };
//         });
//         };
        
//         const nextCard=()=>{
//             //I could not understand this
//             setState(prev=>({
//                 ...prev,
//                 currentCardIndex:(prev.currentCardIndex+1)%vocabulary.length
//             }));
//         };
//         const prevCard=()=>{
//             //I could not understand this
//             setState(prev=>({
//                 ...prev,
//                 currentCardIndex:(prev.currentCardIndex-1+vocabulary.length)%vocabulary.length
//             }));
//         };
//         const goToCard=(index)=>{
//             setState(prev=>({
//                 ...prev,
//                 // I'd like to understand why we use this expression in case we want to go to a specific card
//                 currentCardIndex:Math.max(0,Math.min(index,vocabulary.length-1)),
//             }));
//         };

//         const getCurrentCard=()=>{
//             return vocabulary[state.currentCardIndex]
//         };
//         const getMasteryLevel=(word)=>{
//             return state.masteredWords[word]||0;
//         };
        
//         const isBookmarked=(word)=>{
//             return state.bookmarkedWords.includes(word) ||0;
//         };
        
//         const value={
//             ...state,
//             Vocabulary,
//             toggleTheme,
//             toggleBookmark,
//             updateMastery,
//             increaseMastery,
//             nextCard,
//             prevCard,
//             goToCard,
//             getCurrentCard,
//             getMasteryLevel,
//             isBookmarked,
//         };
//         return <vocabContext.Provider value={value}>
//             {children}
//         </vocabContext.Provider>
// };












