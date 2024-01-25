import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import axios from "axios";
import { Badge } from "./Badge";
import SuggestionModal from "./suggestionModal";

const ResultModal = ({ isOpen, handleClose, selectedRow, userId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");

  const handleOpenSuggestionModal = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setSuggestionModalOpen(true);
  };

  const getImageBasedOnScore = (scoredPoints) => {
    if (scoredPoints >= 1 && scoredPoints <= 100) {
      return "/images/percentage/1.png";
    } else if (scoredPoints >= 101 && scoredPoints <= 200) {
      return "/images/percentage/2.png";
    } else if (scoredPoints >= 201 && scoredPoints <= 280) {
      return "/images/percentage/3.png";
    } else if (scoredPoints >= 281 && scoredPoints <= 430) {
      return "/images/percentage/4.png";
    } else if (scoredPoints >= 431 && scoredPoints <= 569) {
      return "/images/percentage/5.png";
    } else {
      return "/images/percentage/6.png";
    }
  };

  useEffect(() => {
    const getAnswer = async () => {
      const token = localStorage.getItem("__token_bzc_admin");

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `http://localhost:8000/api/answers/${userId}?answerId=${selectedRow?._id}`,
          config
        );
        if (response?.data?.status === "success" && response.data?.data) {
          const data = response.data.data;
          setSubmissions(data?.suggestions);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAnswer();
  }, [selectedRow?._id]);
  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="" style={{ textAlign: "center" }}>
            <div>
              <Typography
                variant="h5"
                gutterBottom
                style={{ fontSize: "20px", marginTop: "20px" }}
              >
                {/* {selectedRow.scoredPoints}/{selectedRow.totalPoints} */}
                <h2>Business Score: {selectedRow.scoredPoints} </h2>
              </Typography>
            </div>

            <div className="">
              <img
                width={"100%"}
                height={"220px"}
                src={getImageBasedOnScore(selectedRow?.scoredPoints)}
                alt="Better Biz Score Wheel"
                className="bz-result__cover"
              />
            </div>
          </Typography>
        </DialogTitle>
        <DialogContent style={{ textAlign: "center", maxHeight: "80vh" }}>
          <div>
            {/* <Typography variant="h5" gutterBottom style={{ fontSize: '40px' }}>
                            {selectedRow.scoredPoints}/{selectedRow.totalPoints}
                            {selectedRow.scoredPoints}
                        </Typography> */}
            <Button
              variant="contained"
              style={{
                background: "#3498db",
                color: "white",
                borderRadius: "25px",
                pointerEvents: "none",
              }}
              disabled
            >
              Things You Can Improve
            </Button>
          </div>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ textAlign: "center" }}>Badge</TableCell>
                  <TableCell style={{ textAlign: "center" }}>Category</TableCell>
                  <TableCell style={{ textAlign: "center" }}>Score</TableCell>
                  {/* <TableCell>Percentage</TableCell> */}
                  <TableCell style={{ textAlign: "center" }}>
                    Suggestions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(submissions || []).map((ans, i) => {
                  const percentage = ans?.value?.percentage;
                  let badgeColor = "";

                  if (percentage > 80) {
                    badgeColor = "gold";
                  } else if (percentage > 70) {
                    badgeColor = "silver";
                  } else if (percentage > 60) {
                    badgeColor = "brown";
                  } else {
                    badgeColor = "gray";
                  }

                  return (
                    <TableRow key={i}>
                      <TableCell style={{ textAlign: "center" }}>
                        <Badge color={badgeColor} />
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <Button
                          variant="contained"
                          style={{ background: "#3498db", color: "white" }}
                          disabled
                        >
                          {ans.name}
                        </Button>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" , fontSize: "16px"}}>
                        {ans?.value?.points}
                      </TableCell>
                      {/* <TableCell>{ans?.value?.percentage} %</TableCell> */}
                      <TableCell style={{ textAlign: "center" }}>
                        <Button
                          variant="contained"
                          style={{ background: "#3498db", color: "white" }}
                          onClick={() =>
                            handleOpenSuggestionModal(ans?.value?.suggestion)
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            onClick={handleClose}
            color="primary"
            variant="contained"
            style={{ marginTop: "20px", width: "200px", height: "50px" }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <SuggestionModal
        isOpen={suggestionModalOpen}
        handleClose={() => setSuggestionModalOpen(false)}
        suggestion={selectedSuggestion}
      />
    </>
  );
};

export default ResultModal;
