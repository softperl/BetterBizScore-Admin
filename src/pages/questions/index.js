// ** React Imports
import { useState, useEffect, useCallback, Fragment } from 'react'
import axios from 'axios'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Demo Components Imports
import QuestionsTable from 'src/views/table/QuestionsTable'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import toast from 'react-hot-toast'

const Questions = () => {
  // ** State
  const [categoryId, setCategoryId] = useState('')
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [mode, setMode] = useState('new')
  const [refetch, setRefetch] = useState(false);
  const [questionId, setQuestionId] = useState('')
  const [question, setQuestion] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState([{ option: '', points: '' }])
  console.log('CategoryId', categoryId);

  const [categories, setCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories');

        if (response.data.status === 'success') {
          setCategories(response.data?.data?.categories)
        }
      } catch (error) {
        console.log(error);
      }
    }

    getCategories()
  }, [])

  const emptyQuestionInput = () => {
    setQuestion('')
    setOptions([{ option: '', points: '' }])
    setDescription('')
  }

  const handleCategoryIdChange = useCallback(e => {
    setCategoryId(e.target.value)
    setIsQuestionFormOpen(false)
    setQuestionId('')
    emptyQuestionInput()
  }, [])

  const toggleRefetch = () => setRefetch(!refetch);

  const toggleQuestionForm = () => {
    setIsQuestionFormOpen(!isQuestionFormOpen)
  }

  const addOption = () => {
    setOptions(prevOptions => [...prevOptions, { option: '', points: '' }])
  }

  const removeOption = (indexToBeRemoved) => {
    const remainingOptions = [...options].filter((_, index) => indexToBeRemoved !== index)

    setOptions(remainingOptions)
  }

  const handleOptionsChange = (e, index) => {
    const cloneOptions = [...options]

    cloneOptions[index][e.target.name] = e.target.value;
    setOptions(cloneOptions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('__token_bzc_admin')

    if (mode === 'edit') {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }

        const response = await axios.patch(
          `http://localhost:8000/api/questions/${questionId}`,
          { question, description, options },
          config
        );

        if (response.data.status === 'success') {
          toggleRefetch()
          toast.success('Question Updated Successfully!')
          setMode('new')
          setIsQuestionFormOpen(false)
          emptyQuestionInput()
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }

        const response = await axios.post(
          `http://localhost:8000/api/questions`,
          { question, categoryId, description, options },
          config
        );

        if (response.data.status === 'success') {
          toggleRefetch()
          toast.success('Question Created Successfully!')
          setIsQuestionFormOpen(false)
          emptyQuestionInput()
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const onDeleteButtonClick = async (params) => {
    const quesId = params.row._id;
    const token = localStorage.getItem('__token_bzc_admin')

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      const response = await axios.delete(
        `http://localhost:8000/api/questions/${quesId}`,
        config
      );

      console.log(response);

      if (response.status === 204) {
        toggleRefetch()
        toast.success('Question Deleted Successfully!')

        if (quesId === questionId) {
          setMode('new')
          setIsQuestionFormOpen(false)
          emptyQuestionInput()
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onEditButtonClick = (params) => {
    console.log(params);
    setMode('edit')
    setIsQuestionFormOpen(true)
    setQuestionId(params.row._id)
    setQuestion(params.row.question)
    setOptions([...params.row.options])
    setDescription(params.row.description)
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
            <CardHeader title='Manage Questions' sx={{ flex: '1 1 55%', padding: '0' }} />

            <Box sx={{ flex: '1 1 45%', rowGap: 2, display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <CustomTextField
                select
                fullWidth
                defaultValue='Select Role'
                SelectProps={{
                  value: categoryId,
                  displayEmpty: true,
                  onChange: e => handleCategoryIdChange(e)
                }}
              >
                <MenuItem value='' selected>Select Category</MenuItem>
                {
                  categories.length && categories.map(category => (
                    <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                  ))
                }
              </CustomTextField>

              <Button variant='contained' sx={{ '& svg': { mr: 2 }, width: '65%', whiteSpace: 'nowrap' }} onClick={toggleQuestionForm} disabled={isQuestionFormOpen || !categoryId}>
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Add Question
              </Button>
            </Box>
          </Box>

          {isQuestionFormOpen && (
            <CardContent>
              <form autoComplete='off' onSubmit={handleSubmit}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <CustomTextField
                      autoFocus
                      fullWidth
                      label='Question text'
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder='Enter question text' />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      multiline
                      rows={4}
                      fullWidth
                      label='Question description'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder='Enter question description' />
                  </Grid>
                  {(options || []).map((option, i) => (
                    <Fragment key={i}>
                      <Grid item xs={8}>
                        <CustomTextField
                          fullWidth
                          label='Option text'
                          name='option'
                          value={option.option}
                          onChange={(e) => handleOptionsChange(e, i)}
                          placeholder='Enter option text' />
                      </Grid>
                      <Grid item xs={2.2}>
                        <CustomTextField
                          fullWidth
                          type='text'
                          label='Points'
                          name='points'
                          value={option.points}
                          onChange={(e) => handleOptionsChange(e, i)}
                          placeholder='10' />
                      </Grid>
                      <Grid item xs={1.8} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        transform: 'translateY(10px)'
                      }}>
                        <Button type='button' variant='outlined' sx={{ '& svg': { mr: 2 } }} onClick={() => removeOption(i)}>
                          <Icon fontSize='1.125rem' icon='tabler:trash-x' />
                          Remove
                        </Button>
                      </Grid >
                    </Fragment>
                  ))}
                  <Grid item xs={12}>
                    <Button type='button' variant='outlined' sx={{ mr: 4 }} onClick={addOption}>
                      Add Option
                    </Button>
                    <Button type='submit' variant='contained'>
                      {mode === 'new' ? 'Save' : 'Update'} Question
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          )}
        </Card>
      </Grid>
      {
        categoryId && (
          <Grid item xs={12}>
            <QuestionsTable
              refetch={refetch}
              categoryId={categoryId}
              onEditButtonClick={onEditButtonClick}
              onDeleteButtonClick={onDeleteButtonClick} />
          </Grid>
        )}
    </Grid >
  )
}

export default Questions