// ** React Imports
import React, { useState, useCallback } from 'react'
import axios from 'axios'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Demo Components Imports
import CategoryTable from 'src/views/table/CategoryTable'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import toast from 'react-hot-toast'


const Categories = () => {
  // ** State
  const [category, setCategory] = useState('')

  const [suggestions, setSuggestions] = useState([]);



  // const [from, setFrom] = useState('')
  // const [to, setTo] = useState('')
  // const [suggestion, setSuggestion] = useState('')


  // const [percentage, setPercentage] = useState('')


  const [categoryId, setCategoryId] = useState('')
  const [refetch, setRefetch] = useState(false)
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [mode, setMode] = useState('new')


  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState(false);



  const toggleCategoryForm = () => {
    setIsCategoryFormOpen(!isCategoryFormOpen)
  }

  const toggleRefetch = () => setRefetch(!refetch);

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('__token_bzc_admin')

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }

    if (mode === 'edit') {
      try {
        const response = await axios.patch(
          `http://localhost:8000/api/categories/${categoryId}`,
          { name: category, suggestions: suggestions },
          config
        );

        if (response.data.status === 'success') {
          toggleRefetch()
          toast.success('Category Updated Successfully!')
          setMode('new')
          setCategory('')
          // setFrom('')
          // setTo('')
          // setSuggestion('')
          // setPercentage('')
          setSuggestions('');
          setIsCategoryFormOpen(false)
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/categories`,
          { name: category, suggestions: suggestions },
          config
        );

        if (response.data.status === 'success') {
          console.log("sent data successfully");
          toggleRefetch()
          toast.success('Category Created Successfully!')
          setCategory('')
          setSuggestions('');
          setIsCategoryFormOpen(false)
        }
      } catch (error) {
        console.log(error);
      }
    }
  }


  const handleAddSuggestion = () => {
    if (suggestions.length && (!suggestions[suggestions.length - 1]?.from || !suggestions[suggestions.length - 1]?.to || !suggestions[suggestions.length - 1]?.suggestion)) {
      // Optionally show a warning or error message here
      return;
    }
    setSuggestions([...suggestions, { from: '', to: '', suggestion: '' }]);
  };

  const handleKeyPress = (e) => {
    // Allow numbers and backspace
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'];

    if (!validKeys.includes(e.key)) {
      e.preventDefault();
    } else if (e.target.value + e.key > 100) {  // Check if the resulting value would be greater than 100
      e.preventDefault();
    }
  };

  const handleRemoveSuggestion = (indexToRemove) => {
    const updatedSuggestions = suggestions.filter((_, index) => index !== indexToRemove);
    setSuggestions(updatedSuggestions);
  };



  const handleSuggestionChange = (index, key, value) => {
    const updatedSuggestions = [...suggestions];
    updatedSuggestions[index][key] = value;
    setSuggestions(updatedSuggestions);

    const isCategoryFilled = category.trim() !== '';
    const areSuggestionsFilled = suggestions.every(
      s =>
        typeof s.from === 'string' && s.from.trim() !== '' &&
        typeof s.to === 'string' && s.to.trim() !== '' &&
        typeof s.suggestion === 'string' && s.suggestion.trim() !== ''
    );

    // Set the state to true if all fields are filled
    setIsAllFieldsFilled(isCategoryFilled && areSuggestionsFilled);
  };



  const onDeleteButtonClick = async (params) => {
    const categoryId = params.row._id;
    const token = localStorage.getItem('__token_bzc_admin')

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      const response = await axios.delete(
        `http://localhost:8000/api/categories/${categoryId}`,
        config
      );

      console.log(response);

      if (response.status === 204) {
        toggleRefetch()
        toast.success('Category Deleted Successfully!')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onEditButtonClick = (params) => {
    //console.log("This is the params I am getting after clicking ",params);
    setMode('edit')
    setIsCategoryFormOpen(true)
    setCategory(params.row.name)
    setSuggestions(params.row.suggestions)
    setCategoryId(params.row._id)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box
            sx={{
              py: 4,
              px: 6,
              rowGap: 2,
              columnGap: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <CardHeader title='Manage Categories' sx={{ padding: '0' }} />
            <Box sx={{ rowGap: 2, display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Button variant='contained' sx={{ '& svg': { mr: 2 } }} disabled={isCategoryFormOpen} onClick={toggleCategoryForm}>
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Add New Category
              </Button>
            </Box>
          </Box>

          {isCategoryFormOpen && (
            <CardContent>
              <form autoComplete='off' onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomTextField
                      autoFocus
                      fullWidth
                      label='Category name'
                      name='option'
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder='Enter category name'
                    />
                  </Grid>
                  {(suggestions || []).map((suggestion, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={12}>
                        <CustomTextField
                          fullWidth
                          label={`Percentage From`}
                          value={suggestion.from}
                          onChange={(e) => handleSuggestionChange(index, 'from', e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e)}
                          placeholder='From'
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          fullWidth
                          label={`Percentage To`}
                          value={suggestion.to}
                          onChange={(e) => handleSuggestionChange(index, 'to', e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e)}
                          placeholder='To'
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2} alignItems="center" style={{ marginBottom: '8px' }}>
                          <Grid item xs={12} sm={10}>
                            <CustomTextField
                              fullWidth
                              label={`Suggestion`}
                              value={suggestion.suggestion}
                              onChange={(e) => handleSuggestionChange(index, 'suggestion', e.target.value)}
                              placeholder='Enter Suggestion'
                            />
                          </Grid>
                          <Grid style={{ paddingTop: '25px' }} item xs={5} sm={2} container alignItems="center">
                            {suggestions?.length ?
                              <Button variant='outlined' onClick={() => handleRemoveSuggestion(index)} sx={{ width: '100%', '& svg': { mr: 2 } }}>
                                <Icon fontSize='1.125rem' icon='tabler:trash-x' />
                                Remove
                              </Button>
                              : <></>
                            }
                          </Grid>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>

                {category.length ? (
                  <Button style={{ marginTop: '10px', marginLeft: "5px", padding: '10px' }} variant="contained" color="primary" onClick={handleAddSuggestion}>
                    {suggestions?.length ? "Add Another" : "Add a Suggestion"}
                  </Button>
                ) : (<Button disabled style={{ marginTop: '10px', marginLeft: "5px", padding: '10px' }} variant="contained" color="primary" onClick={handleAddSuggestion}>
                  {suggestions?.length ? "Add Another" : "Add a Suggestion"}
                </Button>)}

                {mode === 'new' ? <Button disabled={!isAllFieldsFilled} style={{ marginTop: '10px', marginLeft: '10px' }} type='submit' variant='outlined' sx={{ '& svg': { mr: 1 }, width: '10%' }}>
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  Save
                </Button> :
                  <Button type='submit' style={{ marginTop: '10px', marginLeft: '10px' }} variant='outlined' sx={{ '& svg': { mr: 1 }, width: '10%' }}>
                    <Icon fontSize='1.125rem' icon='tabler:plus' />
                    Update
                  </Button>}
              </form>
            </CardContent>
          )}
        </Card>
      </Grid>
      <Grid item xs={12}>
        <CategoryTable
          refetch={refetch}
          onEditButtonClick={onEditButtonClick}
          onDeleteButtonClick={onDeleteButtonClick} />
      </Grid>
    </Grid >
  )
}


export default Categories


