// ** React Imports
import { ChangeEvent, MouseEvent, useState, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { useRouter } from 'next/router'
import { TimerOutline } from 'mdi-material-ui'
import { Credit } from 'src/configs/constants'
import { useData } from 'src/@core/layouts/HipotecarLayout'
import { parseMoney } from 'src/@core/utils/string'
import { CreditEvaluationResult, getCompatibleCredits } from 'src/@core/utils/misc'
import { useAsync } from 'react-async'

interface State {
  password: string
  showPassword: boolean
}

const ComparisonForm = () => {
  const router = useRouter()
  const context = useData()

  // ** States
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false
  })
  const [confirmPassValues, setConfirmPassValues] = useState<State>({
    password: '',
    showPassword: false
  })

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleConfirmPassChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassValues({ ...confirmPassValues, [prop]: event.target.value })
  }
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleClickConfirmPassShow = () => {
    setConfirmPassValues({ ...confirmPassValues, showPassword: !confirmPassValues.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleClick = () => {
    router.push('/preferences')
  }

  const [compatibleCreditsResults, setCompatibleCreditsResult] = useState<CreditEvaluationResult>({
    creditosCompatibles: [],
    razonesDeLosRestantes: []
  })

  useEffect(() => {
    const compatibleCredits = getCompatibleCredits(context?.data.credits ?? [], context?.data.user ?? {})
    setCompatibleCreditsResult(compatibleCredits)
  }, [context?.data.user, context?.data.credits])

  return (
    <Card>
      <CardHeader
        title='Tus resultados'
        titleTypographyProps={{ variant: 'h6' }}
        subheader='En base a tus preferencias y la oferta disponible.'
      />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TableContainer>
                <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
                  <TableHead>
                    <TableRow>
                      {/* Image */}
                      <TableCell></TableCell>
                      <TableCell>Creditos Recomendados</TableCell>
                      <TableCell>TNA</TableCell>
                      <TableCell>Cuota</TableCell>
                      {/* <TableCell>Date</TableCell>
                      <TableCell>Salary</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Status</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {compatibleCreditsResults.creditosCompatibles.map((row: Credit, index) => (
                      <TableRow
                        hover
                        key={index}
                        style={{ opacity: index === 0 ? 1 : 0.5 }}
                        sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                      >
                        <TableCell width={30}>
                          <img
                            src={`/images/banks/${row.Banco}.png`}
                            alt={row.Nombre}
                            className='object-contain	'
                            height={40}
                          />
                        </TableCell>
                        <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                              {row.Nombre}
                            </Typography>
                            <Typography variant='caption'>Banco {row.Banco}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{row.Tasa}</TableCell>
                        <TableCell>
                          {context?.data.user.budget
                            ? parseMoney((context?.data.user.budget * row.Tasa) / 100 / 12)
                            : ''}
                        </TableCell>
                        {/* <TableCell>{row.date}</TableCell>
                        <TableCell>{row.salary}</TableCell>
                        <TableCell>{row.age}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            color={statusObj[row.status].color}
                            sx={{
                              height: 24,
                              fontSize: '0.75rem',
                              textTransform: 'capitalize',
                              '& .MuiChip-label': { fontWeight: 500 }
                            }}
                          />
                        </TableCell> */}
                      </TableRow>
                    ))}
                    {compatibleCreditsResults.razonesDeLosRestantes.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography align='left'>
                            Las razones por las que el resto de los creditos estan ocultos:
                          </Typography>

                          {compatibleCreditsResults.razonesDeLosRestantes.map((r, i) => (
                            <Typography key={i} align='center' variant='caption'>
                              {r}
                              <br></br>
                            </Typography>
                          ))}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth type='email' label='Email' placeholder='leomessi@gmail.com' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button type='submit' variant='outlined' size='small' onClick={handleClick}>
                Acepto recibir informacion de productos y servicios alineados con mis intereses
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ComparisonForm
