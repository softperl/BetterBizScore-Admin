import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from '@mui/material';
import axios from 'axios';
import { Badge } from './Badge';

const ResultModal = ({ isOpen, handleClose, selectedRow, userId }) => {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const getAnswer = async () => {
            const token = localStorage.getItem('__token_bzc_admin')

            try {
                const config = {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }

                const response = await axios.get(`http://localhost:8000/api/answers/${userId}?answerId=${selectedRow?._id}`, config)
                if (response?.data?.status === 'success' && response.data?.data) {
                    const data = response.data.data;
                    setSubmissions(data?.suggestions)
                }
            } catch (error) {
                console.log(error);
            }
        }

        getAnswer()
    }, [selectedRow?._id])
    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="" style={{ textAlign: 'center' }}>
                    <div className=''>
                        <img width={'300px'} height={'200px'} src='/images/Better__biz-health-Cover.png' alt='Better Biz Score Wheel' className='bz-result__cover' />
                    </div>
                </Typography>
            </DialogTitle>
            <DialogContent style={{ textAlign: 'center', maxHeight: '80vh', overflowY: 'auto' }}>
                <div>
                    <Typography variant="h5" gutterBottom style={{ fontSize: '40px' }}>
                        {selectedRow.scoredPoints}/{selectedRow.totalPoints}
                    </Typography>
                    <Typography variant="body1" gutterBottom style={{ fontSize: '25px' }}>
                        Things You Can Improve
                    </Typography>
                </div>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Badge</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell>Percentage</TableCell>
                                <TableCell>Suggestions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(submissions || []).map((ans, i) => {
                                const percentage = ans?.value?.percentage;
                                let badgeColor = '';

                                if (percentage > 90) {
                                    badgeColor = 'gold';
                                } else if (percentage > 80) {
                                    badgeColor = 'silver';
                                } else if (percentage > 70) {
                                    badgeColor = 'brown';
                                } else {
                                    badgeColor = 'gray';
                                }

                                return (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Badge color={badgeColor}/>
                                        </TableCell>
                                        <TableCell>{ans?.name}</TableCell>
                                        <TableCell>{ans?.value?.points}</TableCell>
                                        <TableCell>{ans?.value?.percentage} %</TableCell>
                                        <TableCell>{ans?.value?.suggestion}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>

                    </Table>
                </TableContainer>

                <Button onClick={handleClose} color="primary" variant="contained" style={{ marginTop: '20px' }}>
                    Close
                </Button>
            </DialogContent>
        </Dialog>

    );
};

export default ResultModal;
