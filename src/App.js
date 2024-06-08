import './App.css';

import * as React from 'react';
import PetsIcon from '@mui/icons-material/Pets';
import { Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import breedGroupID from './breedGroupID';





function App() {

  const [information, setInformation] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const listRef = useRef(null);
  const apiKey = process.env.REACT_APP_API_KEY;


  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    }
  };

  const retrieveInformation = async (searchQuery) => {
    try {
      const url = `https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=95&breed_ids=${searchQuery}`
      console.log("Search Query:", searchQuery);
      const response = await axios.get(url, config);
      console.log(response.data);
      setInformation(response.data);
      listRef.current.scrollTo(0, scrollPosition);
    } catch (error) {
      console.log('Error:', error);
    }
  }

  useEffect(() => {
    retrieveInformation("");
  }, []);

  const handleSearch = () => {
    let searchQuery = document.getElementById('searchInput').value.toLowerCase();

    const currentScrollPosition = listRef.current.scrollTop;

    const filteredBreeds = Object.entries(breedGroupID).filter(([breedName, breedId]) => {
      return breedName.toLowerCase().startsWith(searchQuery);
    });

    if (filteredBreeds.length > 0) {
      retrieveInformation(filteredBreeds[0][1]);
    } else {
      while (searchQuery.length > 0) {
        searchQuery = searchQuery.slice(0, -1);

        const filteredBreedsAfterRemoval = Object.entries(breedGroupID).filter(([breedName, breedId]) => {
          return breedName.toLowerCase().startsWith(searchQuery);
        });

        if (filteredBreedsAfterRemoval.length > 0) {
          retrieveInformation(filteredBreedsAfterRemoval[0][1]);
          return;
        }
      }

      console.log("Invalid search query");
    }

    setScrollPosition(currentScrollPosition);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const searchInputValue = event.target.value.trim().toLowerCase();
      if (searchInputValue !== '') {
        handleSearch();
      }
    }
  };

  const handleCancel = () => {
    document.getElementById('searchInput').value = '';
    retrieveInformation("");
    setScrollPosition(0);
  };


  return (
    <>
      <div>

        <div>
          {/* Navigation */}
          <div className='flex bg-indigo-700 border-slate-300 border-4 p-4 justify-between px-12'>

            <div className='flex space-x-10'>
              <PetsIcon fontSize="large" />
              <div className='poppins flex items-center font-bold text-xl text-violet-950'>Home</div>
            </div>
            <div className='flex'>
              <div className='flex'>
                <input id="searchInput" onKeyPress={handleKeyPress} className='poppins rounded-md w-72 h-10 p-4 focus:outline-none focus:ring focus:border-blue-600' type="text"
                  placeholder='Enter Dog Name...' />
                <button onClick={handleSearch} className='poppins flex ml-4 rounded-md w-20 h-10 bg-slate-300 items-center justify-center font-semibold
            hover:bg-slate-400 active:bg-slate-500'>
                  Search
                </button>
              </div>
              <div>
                <button onClick={handleCancel} className='poppins flex ml-4 rounded-md w-20 h-10 bg-red-500 items-center justify-center font-semibold
            hover:bg-red-700 active:bg-red-800'>
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className='bg-indigo-200 py-20'>
          <div className='poppins flex items-center justify-center font-bold text-5xl text-violet-500'>
            Welcome to the Dog Information Center
          </div>
        </div>

        {/* Dog List */}
        <div className='h-[455px] overflow-y-auto' ref={listRef}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {information.map((info, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemAvatar>
                    <Avatar alt="Dog" src={info.url} sx={{ width: 200, height: 200, objectFit: 'contain', padding: 3 }} />
                  </ListItemAvatar>
                  <div className='mx-10'>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <div className='flex'>
                            <Typography sx={{ fontFamily: 'Poppins, sans-serif' }} component="span" variant="body1" color="text.primary">
                              <div className='font-bold'>Name:</div>
                            </Typography>
                            <Typography sx={{ ml: 1, fontFamily: 'Poppins, sans-serif' }} component="span" variant="body1" color="text.primary">
                              {info.breeds[0].name}
                            </Typography>
                          </div>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }} component="span" variant="body2" color="text.primary">
                            Purpose:
                          </Typography>
                          <Typography sx={{ ml: 1, fontFamily: 'Poppins, sans-serif' }} component="span" variant="body2" color="text.primary">
                            {info.breeds[0].bred_for}
                          </Typography>
                          <br />
                          <Typography sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }} component="span" variant="body2" color="text.primary">
                            Breed Name:
                          </Typography>
                          <Typography sx={{ ml: 1, fontFamily: 'Poppins, sans-serif' }} component="span" variant="body2" color="text.primary">
                            {info.breeds[0].breed_group}
                          </Typography>
                          <br />
                          <Typography sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }} component="span" variant="body2" color="text.primary">
                            Height:
                          </Typography>
                          <Typography sx={{ ml: 1, fontFamily: 'Poppins, sans-serif' }} component="span" variant="body2" color="text.primary">
                            {info.breeds[0].height.metric} cm
                          </Typography>
                          <br />
                          <Typography sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }} component="span" variant="body2" color="text.primary">
                            Weight:
                          </Typography>
                          <Typography sx={{ ml: 1, fontFamily: 'Poppins, sans-serif' }} component="span" variant="body2" color="text.primary">
                            {info.breeds[0].weight.metric} kg
                          </Typography>
                          <br />
                          <Typography sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }} component="span" variant="body2" color="text.primary">
                            Life Span:
                          </Typography>
                          <Typography sx={{ ml: 1, fontFamily: 'Poppins, sans-serif' }} component="span" variant="body2" color="text.primary">
                            {info.breeds[0].life_span}
                          </Typography>
                          <br />
                          <Typography sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }} component="span" variant="body2" color="text.primary">
                            Temperament:
                          </Typography>
                          <Typography sx={{ ml: 1, fontFamily: 'Poppins, sans-serif' }} component="span" variant="body2" color="text.primary">
                            {info.breeds[0].temperament}
                          </Typography>
                        </React.Fragment>
                      }
                    />

                  </div>
                </ListItem>
                {index !== information.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
            {/* ----- */}

            <div className='flex justify-center items-center font-bold'>
              Note: if the dog name is not found, users can use the search bar
            </div>
          </List>
        </div>
       
      </div>
    </>
  );
}

export default App;
