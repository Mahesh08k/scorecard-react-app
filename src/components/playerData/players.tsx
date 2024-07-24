import React, { useEffect, useState } from "react";
import { TextField, Button, Container, Box, Table, TableBody, TableCell,useMediaQuery,
   TableContainer, TableHead, TableRow, Paper , Typography} from '@mui/material';
import { Player } from "./typing";
import { useTheme } from '@mui/material/styles';

const PlayerData = ({ name }:Player) => {
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [names, setNames] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [roundCount , setRoundCount] = useState<number>(0);
  const[playerData , setPlayerData] = useState<{players:Player[], rounds:number}>({players :[],rounds:0})
  const[scores , setScore] = useState<number[][]>([])
  const[showTable, setShowTable] = useState<boolean>(false)

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    if (playerCount > 0 && roundCount > 0) {
      setScore(Array(playerCount).fill(Array(roundCount).fill(0)));
    }
  }, [playerCount, roundCount]);

  const handleNumberOfPlayers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    setPlayerCount(num);
    setNames(Array(num).fill(''));
    //console.log('number of players playing:', num);
  }

  const handleNumberOfRounds = (e:React.ChangeEvent<HTMLInputElement>) => {
    const round = parseInt(e.target.value);
    setRoundCount(round)
    //console.log('number of round :',round)
  }

  const handleNameChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNames = [...names];
    newNames[index] = event.target.value;
    setNames(newNames);
  }

  const handleScore = (playerIndex: number, roundIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScores = scores.map((row, i) => 
      i === playerIndex ? row.map((score, j) => j === roundIndex ? parseInt(e.target.value, 10) || 0 : score) : row
    );
    setScore(newScores);
  };

  const handleSubmit = () => {
    const players = names.map(name => ({ name }));
    setPlayers(players)
    //console.log(players)
    setPlayerData({players, rounds:roundCount});
    //console.log('player data', playerData);
    setShowTable(true)
  }

  const calculateTotal = (playerIndex: number) => {
    if (!scores[playerIndex]) return 0;
    return scores[playerIndex].reduce((total, score) => total + score, 0);
  };
  

  
    return (
      <Container>
      {!showTable ? (
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Enter Player Information
          </Typography>
          <TextField
            label="Number of Players"
            type="number"
            value={playerCount}
            onChange={handleNumberOfPlayers}
            fullWidth
            margin="normal"
          />
          {names.map((name, index) => (
            <TextField
              key={index}
              label={`Player ${index + 1} Name`}
              value={name}
              onChange={handleNameChange(index)}
              fullWidth
              margin="normal"
            />
          ))}
          <TextField
            label="Number of Rounds"
            type="number"
            value={roundCount}
            onChange={handleNumberOfRounds}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      ) : (
        <Box mt={4}>
          <TableContainer component={Paper}>
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell>Player Name</TableCell>
                  {Array.from({ length: roundCount }, (_, index) => (
                    <TableCell key={index}>Round {index + 1}</TableCell>
                  ))}
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {players.map((player, playerIndex) => (
                  <TableRow key={playerIndex}>
                    <TableCell>{player.name}</TableCell>
                    {Array.from({ length: roundCount }, (_, roundIndex) => (
                      <TableCell key={roundIndex}>
                        <TextField
                          type="number"
                          value={scores[playerIndex] ? scores[playerIndex][roundIndex] : 0}
                          onChange={handleScore(playerIndex, roundIndex)}
                          fullWidth
                          size={isMobile ? 'small' : 'medium'}
                        />
                      </TableCell>
                    ))}
                    <TableCell>{calculateTotal(playerIndex)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
    );
};

export default PlayerData;
