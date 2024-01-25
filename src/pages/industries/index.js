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
import IndustryTable from 'src/views/table/IndustryTable'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import toast from 'react-hot-toast'

const Industries = () => {
  // ** State
  const [industryId, setIndustryId] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState({})
  const [isIndustryFormOpen, setIsIndustryFormOpen] = useState(false);
  console.log('IndustryId, Current', industryId, selectedIndustry);

  const [input, setInput] = useState('')
  const [refetch, setRefetch] = useState(true)

  const [industries, setIndustries] = useState([])

  useEffect(() => {
    const getIndustries = async () => {
      try {
        setIndustryId('')
        const response = await axios.get('http://localhost:8000/api/industries');

        if (response.data.status === 'success') {
          setIndustries(response.data?.data?.industries);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getIndustries()
  }, [refetch])

  const handleIndustryIdChange = useCallback(e => {
    setIndustryId(e.target.value)

    const selected = industries.filter((industry) => industry._id === e.target.value)

    setSelectedIndustry(selected[0])
  }, [industries])

  const toggleIndustryForm = () => {
    setIsIndustryFormOpen(!isIndustryFormOpen)
  }

  const toggleRefetch = () => setRefetch(!refetch)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('__token_bzc_admin')

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      const response = await axios.post(
        `http://localhost:8000/api/industries`,
        { name: input },
        config
      );

      console.log(response);

      if (response.data.status === 'success') {
        toggleRefetch()
        setInput('')
        toast.success('Industry created successfully!')
        setIsIndustryFormOpen(false)
      }
    } catch (error) {
      console.log(error);
    }
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
            <CardHeader title='Manage Industries' sx={{ flex: '1 1 55%', padding: '0' }} />

            <Box sx={{ flex: '1 1 45%', rowGap: 2, display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <CustomTextField
                select
                fullWidth
                defaultValue='Select Role'
                SelectProps={{
                  value: industryId,
                  displayEmpty: true,
                  onChange: e => handleIndustryIdChange(e)
                }}
              >
                <MenuItem value='' selected>Select Industry</MenuItem>
                {
                  industries.length && industries.map(industry => (
                    <MenuItem key={industry._id} value={industry._id}>{industry.name}</MenuItem>
                  ))
                }
              </CustomTextField>

              <Button variant='contained' sx={{ '& svg': { mr: 2 }, width: '65%', whiteSpace: 'nowrap' }} onClick={toggleIndustryForm} disabled={isIndustryFormOpen}>
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Add Industry
              </Button>
            </Box>
          </Box>

          {isIndustryFormOpen && (
            <CardContent>
              <form autoComplete='off' onSubmit={handleSubmit}>
                <Grid container spacing={5}>
                  <Grid item xs={9.5}>
                    <CustomTextField
                      autoFocus
                      fullWidth
                      label='Industry name'
                      name='option'
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder='Enter industry name' />
                  </Grid>
                  <Grid item xs={2.5} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    transform: 'translateY(10px)'
                  }}>
                    <Button type='submit' variant='outlined' sx={{ '& svg': { mr: 2 }, width: '100%' }}>
                      <Icon fontSize='1.125rem' icon='tabler:plus' />
                      Add Industry
                    </Button>
                  </Grid >
                </Grid>
              </form>
            </CardContent>
          )}
        </Card>
      </Grid>
      {
        industryId && (
          <Grid item xs={12}>
            <IndustryTable
              industryId={industryId}
              selectedIndustry={selectedIndustry}
              toggleRefetch={toggleRefetch} />
          </Grid>
        )
      }
    </Grid >
  )
}

export default Industries