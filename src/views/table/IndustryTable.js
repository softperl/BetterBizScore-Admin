// ** React Imports
import { useState, useEffect, useCallback, forwardRef } from 'react'
import axios from 'axios'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import { DataGrid } from '@mui/x-data-grid'

/* import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
 */
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import toast from 'react-hot-toast'

/* const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
}) */

const IndustryTable = ({ industryId, selectedIndustry, toggleRefetch }) => {
  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [hideNameColumn, setHideNameColumn] = useState({ full_name: true })

  const [loading, setLoading] = useState(true)

  const [allCategories, setAllCategories] = useState([])

  const [categories, setCategories] = useState([])
  const [categoryIds, setCategoryIds] = useState([])

  const [hasUpdates, setHasUpdates] = useState(false);

  const [selectedId, setSelectedId] = useState('')

  /* const [show, setShow] = useState(false)
  const [params, setParams] = useState({});

  const handleClose = () => setShow(false)

  const handleConfirmation = (params) => {
    setShow(true)
    setParams({ ...params })
  }

  const handleDeleteQuestion = () => {
    setShow(false)
    onDeleteButtonClick(params)
  } */

  // ** Get all categories so that admin can add category in currently selected industry.
  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/categories`);

        if (response.data.status === 'success') {
          setAllCategories(response.data?.data?.categories)
        }
      } catch (error) {
        console.log(error);
      }
    }

    getAllCategories()
  }, [])

  // ** Get existing categories in the currently selected industry.
  useEffect(() => {
    const getCurrentIndustryCategories = async () => {
      setLoading(true)

      try {
        const response = await axios.get(`http://localhost:8000/api/industries/${industryId}`);

        if (response.data.status === 'success') {
          const categoriesWithRowId = response.data?.data?.industry?.categories.map((cat, i) => ({ ...cat, id: i + 1 }))

          const currentCategoryIds = response.data?.data?.industry?.categories.map((cat, i) => cat._id)

          setLoading(false)
          setCategories(categoriesWithRowId)
          setCategoryIds(currentCategoryIds)
        }
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    }

    getCurrentIndustryCategories()
  }, [industryId])


  const onDeleteButtonClick = async (params) => {
    setHasUpdates(true)

    const filter = categoryIds.filter((catId) => params.row._id !== catId)
    setCategoryIds([...filter])

    const selectedWithRowId = categories.filter((cat) => cat._id !== params.row._id).map((cat, i) => ({ ...cat, id: i + 1 }))

    setCategories(selectedWithRowId)
  }

  // ** This function handles adding a new category to the current industry.
  const handleCategoryIdChange = (e) => {
    setSelectedId(e.target.value)

    if (!e.target.value) return;

    if (!categoryIds.includes(e.target.value)) {
      setHasUpdates(true)
      setCategoryIds([...categoryIds, e.target.value])

      const selected = allCategories.filter((cat) => cat._id === e.target.value)

      setCategories([...categories, { ...selected[0], id: categories.length + 1 }])
    } else {
      toast.success('Category already included!')
    }

    setSelectedId('')
  }

  const handleUpdateIndustry = async () => {
    const token = localStorage.getItem('__token_bzc_admin')

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      const response = await axios.patch(`http://localhost:8000/api/industries/${industryId}`, {
        categories: categoryIds
      }, config);

      if (response.data.status === 'success') {
        toast.success("Industry Updated Successfully!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteIndustry = async () => {
    const token = localStorage.getItem('__token_bzc_admin')

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      const response = await axios.delete(`http://localhost:8000/api/industries/${industryId}`, config);

      if (response.status === 204) {
        toast.success("Industry Deleted Successfully!")
        toggleRefetch()
      }
    } catch (error) {
      console.log(error);
    }
  }

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'Serial'
    },
    {
      flex: 0.4,
      minWidth: 250,
      field: 'name',
      headerName: 'Category'
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'delete',
      headerName: 'Delete',
      renderCell: params => {
        return (
          <Button size='small' variant='outlined' color='error' onClick={() => onDeleteButtonClick(params)}>
            Delete
          </Button>
        )
      }
    }
  ]

  return (
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
        <CardHeader title={`${selectedIndustry.name}`} sx={{ flex: '1 1 55%', padding: '0' }} />

        <Box sx={{ flex: '1 1 45%', rowGap: 2, display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <CustomTextField
            select
            fullWidth
            defaultValue='Select Role'
            SelectProps={{
              value: selectedId,
              displayEmpty: true,
              onChange: e => handleCategoryIdChange(e)
            }}
          >
            <MenuItem value='' selected>Add Category</MenuItem>
            {
              allCategories.length && allCategories.map(category => (
                <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
              ))
            }
          </CustomTextField>

          {
            hasUpdates ? (
              <Button variant='contained' sx={{ '& svg': { mr: 2 }, width: '65%', whiteSpace: 'nowrap' }} onClick={handleUpdateIndustry}>
                Update Industry
              </Button>
            ) : (
              <Button variant='contained' color='error' sx={{ '& svg': { mr: 2 }, width: '65%', whiteSpace: 'nowrap' }} onClick={handleDeleteIndustry}>
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Delete Industry
              </Button>
            )
          }
        </Box>
      </Box>
      {/* <CardHeader title='Existing Categories' action={
        <Button variant='contained' sx={{ '& svg': { mr: 2 }, whiteSpace: 'nowrap' }}>
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Add Industry
        </Button>
      } /> */}

      {
        !loading && categories.length ? (
          <DataGrid
            autoHeight
            rows={categories}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[7, 10, 25, 50]}
            paginationModel={paginationModel}
            columnVisibilityModel={hideNameColumn}
            onPaginationModelChange={setPaginationModel}
            onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)} />
        ) : !loading && categories.length === 0 ? (
          <Box sx={{ mt: 6, mb: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography>No categories found for this industry.</Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 6, mb: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        )
      }
      {/* <Dialog
        fullWidth
        open={show}
        maxWidth='sm'
        scroll='body'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Are you sure?
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>You won't be able to revert this!</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' color='error' sx={{ mr: 1 }} onClick={handleDeleteQuestion}>
            Delete
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog> */}
    </Card>
  )
}

export default IndustryTable
