import { useState, useEffect } from "react"
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [data, setData] = useState([])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      setData(response.data)
    })
  }, [])

  return (
    <div>
    <Search value={value} handleChange={handleChange} />
    <Result data={data} value={value} setValue={setValue}/>
   </div>
  )
}

const Result = ({ data, value, setValue}) => {
  const countries = data.filter(country => 
    country.name.common.toLowerCase()
    .includes(value.toLowerCase())
    )
  const count = countries.length 

  if (count > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (count > 1 && count < 10) {
    return countries.map(country => 
    <div key={country.name.common}>
      {country.name.common} <ShowButton country={country} setValue={setValue}/>
      </div>
      )
  } else if (count == 1) {
    return <Country country={countries[0]}/>
  }

  return <p>No matches</p>
}

const Country = ({country}) => (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital}</div>
      <div>Area {country.area}</div>
      <br/>
      <h3>Languages:</h3>
      <div>
        {Object.values(country.languages).map(language => 
          <li key={language}>{language}</li>)
          }
      </div>
      <br/>
      <img src={country.flags['png']} alt='Flag of the country'/>
      <Weather city={country.capital}/>
    </div>
  )

const ShowButton = ({country, setValue}) => {
  return <button onClick={() => setValue(country.name.common)}>show</button>
}

const Search = ({ value, handleChange }) =>
  <div>find countries <input value={value} name='search' onChange={handleChange} /></div>

const Weather = ({city}) => {
  const [weatherData, setWeatherData] = useState(null)
  const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
  
  useEffect(() => {
    axios.get(`${baseUrl}?q=${city}&APPID=${import.meta.env.VITE_APPID}`)
    .then(response => {
      setWeatherData(response.data)
    })
  }, [])

  if (!weatherData) {
    return <div>No weather data.</div>
  }

  const iconURL = `https://openweathermap.org/img/wn/${weatherData.weather[0]['icon']}@2x.png`

  return (
    <div>
      <h2>Weather in {city}</h2>
      <div>temperature {(weatherData.main['temp'] - 272.15).toFixed(1)} Celsius</div>
      <img src={iconURL} alt='weather icon' />
      <div>wind {weatherData.wind['speed'].toFixed(1)} m/s</div>
    </div>
  )

}

export default App
