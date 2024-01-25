// ** React Imports
import { useState, useEffect, forwardRef } from 'react'
import axios from 'axios'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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

const QuestionsTable = ({ refetch, categoryId, onEditButtonClick, onDeleteButtonClick }) => {
  // ** States
  const [questions, setQuestions] = useState([])
  const [show, setShow] = useState(false)
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [hideNameColumn, setHideNameColumn] = useState({ full_name: true })

  const handleClose = () => setShow(false)

  const handleConfirmation = (params) => {
    setShow(true)
    setParams({ ...params })
  }

  const handleDeleteQuestion = () => {
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
      flex: 0.5,
      minWidth: 320,
      field: 'question',
      headerName: 'Question'
    },
    {
      flex: 0.06,
      minWidth: 50,
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
            Delete
          </Button>
        )
      }
    }
  ]

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:8000/api/categories/${categoryId}`);

        if (response.data.status === 'success') {
          const questionsWithRowId = response.data?.data?.category?.questions.map((ques, i) => ({ ...ques, id: i + 1 }))

          setQuestions(questionsWithRowId)
          setLoading(false)
        }
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    }

    categoryId && getCategories()
  }, [categoryId, refetch])

  return (
    <Card>
      <CardHeader title={categoryId ? 'Existing Questions' : 'Select a category to manage questions'} />
      {
        !loading && questions.length ? (
          <DataGrid
            autoHeight
            rows={questions}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[7, 10, 25, 50]}
            paginationModel={paginationModel}
            columnVisibilityModel={hideNameColumn}
            onPaginationModelChange={setPaginationModel}
            onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)} />
        ) : null
      }

      {loading && (
        <Box sx={{ mt: 6, mb: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress sx={{ mb: 4 }} />
          <Typography>Loading...</Typography>
        </Box>
      )}
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
      </Dialog>
    </Card>
  )
}

export default QuestionsTable
