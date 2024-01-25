// ** React Imports
import { useState, useEffect, forwardRef } from 'react'
import axios from 'axios'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { DataGrid } from '@mui/x-data-grid'
import Dialog from '@mui/material/Dialog'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'



// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { List, ListItem, ListItemText } from '@mui/material'

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
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
})





const CategoryTable = ({ refetch, onEditButtonClick, onDeleteButtonClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategorySuggestions, setCurrentCategorySuggestions] = useState([]);

  // Function to handle the View button click and set the current category's suggestions
  const handleViewClick = (suggestions) => {
    setCurrentCategorySuggestions(suggestions);
    setIsModalOpen(true);
  };


  const [suggestions, setSuggestions] = useState([]);

  // ** States
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false)
  const [params, setParams] = useState({});
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [hideNameColumn, setHideNameColumn] = useState({ full_name: true })

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/categories');

        if (response.data.status === 'success') {
          const categoriesWithRowId = response.data?.data?.categories.map((cat, i) => ({ ...cat, id: i + 1 }))

          console.log("Temp Categories with RowId", categoriesWithRowId);


          setCategories(categoriesWithRowId)

          console.log("This is suggestions I am getting", suggestions);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
      setLoading(false);
    }

    getCategories()
  }, [refetch])

  const handleClose = () => setShow(false)

  const handleConfirmation = (params) => {
    setShow(true)
    setParams({ ...params })
  }

  const handleDeleteCategory = () => {
    setShow(false)
    onDeleteButtonClick(params)
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
      minWidth: 120,
      field: 'name',
      headerName: 'Category'
    },
    {
      flex: 0.06,
      minWidth: 80,
      field: 'view',
      headerName: 'View',
      renderCell: params => {
        return (

          <Button
            style={{ marginTop: '5px' }}
            variant="contained"
            size='small'
            color="primary"
            onClick={() => handleViewClick(params.row.suggestions)} // Assuming 'suggestions' is an array field in your category data
          >
            {params.row.suggestions?.length ? "View" : "Not Yet"}
          </Button>
        )
      }
    },
    {
      flex: 0.06,
      minWidth: 80,
      field: 'edit',
      headerName: 'Edit',
      renderCell: params => {
        return (
          <Button size='small' variant='outlined' color='warning' onClick={() => onEditButtonClick(params)}>
            Edit
          </Button>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'delete',
      headerName: 'Delete',
      renderCell: params => {
        return (
          <Button size='small' variant='outlined' color='error' onClick={() => handleConfirmation(params)}>
            {/* <Button size='small' variant='outlined' color='error' onClick={() => onDeleteButtonClick(params)}> */}
            Delete
          </Button>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader title='Existing Categories' />
      {
        loading ? (
          <Box sx={{ mt: 6, mb: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) :
          categories?.length ? (
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
          ) : (
            <Box sx={{ mt: 6, mb: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Typography>No Data Found</Typography>
            </Box>
          )
      }
      <Dialog
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
              Are you sure you want to delete this?
            </Typography>
            {/* <Typography sx={{ color: 'text.secondary' }}>Add card for future billing</Typography> */}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' color='error' sx={{ mr: 1 }} onClick={handleDeleteCategory}>
            Delete
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>




      <Dialog
        fullWidth
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      // ... [Other Dialog props]
      >
        <DialogContent>
          <Typography variant="h6">Suggestions</Typography>
          <List>
            {currentCategorySuggestions.map((suggestion, index) => (
              <ListItem key={index}>
                {/* Display the suggestion details here, e.g., suggestion.from, suggestion.to, etc. */}
                <ListItemText primary={`Percentage: From: ${suggestion.from}, To: ${suggestion.to}, Suggestion: ${suggestion.suggestion}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>


    </Card>
  )
}

export default CategoryTable
