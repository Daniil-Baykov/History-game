$(document).ready(function(){
    $('select').formSelect();
  })
  
  $(document).ready(function(){
    $('.modal').modal();
  })

  let currentlyEditing = null
  const gameState = [
  {
    name: 'OSMANSKA-RIKET',
    mat: 2000000,
    medborgare: 40000,
    soldater: 9000,
    handelsmän: 10,
    båtar: 5,
    guld: 1000,
    slavar: 0,
    textil: 3,
    alkohol: 0,
    religion: 'Islam',
    kolonier: 0,
    handelsväg: 'Sidenvägen'
  },
  {
    name: 'SPANIEN',
    mat: 1000000,
    medborgare: 20000,
    soldater: 7000,
    handelsmän: 0,
    båtar: 60,
    guld: 1250,
    slavar: 0,
    textil: 0,
    alkohol: 0,
    religion: 'Katolicism',
    kolonier: 0,
    handelsväg: 'Ingen'
  },
  {
    name: 'ENGLAND',
    mat: 800000,
    medborgare: 10000,
    soldater: 2000,
    handelsmän: 30,
    båtar: 25,
    guld: 500,
    slavar: 5,
    textil: 25,
    alkohol: 50,
    religion: 'Protestantism',
    kolonier: 0,
    handelsväg: 'Ingen'
  },
  {
    name: 'NEDERLÄNDERNA',
    mat: 500000,
    medborgare: 5000,
    soldater: 1000,
    handelsmän: 50,
    båtar: 20,
    guld: 650,
    slavar: 2,
    textil: 30,
    alkohol: 35,
    religion: 'Protestantism',
    kolonier: 0,
    handelsväg: 'Ingen'
  },
  {
    name: 'FRANKRIKE',
    mat: 1000000,
    medborgare: 15000,
    soldater: 5000,
    handelsmän: 1,
    båtar: 10,
    guld: 950,
    slavar: 0,
    textil: 5,
    alkohol: 2,
    religion: 'Katolicism',
    kolonier: 0,
    handelsväg: 'Ingen'
  }]
  
  const getRef = (ref) => gameState.find(({name}) => name === ref)
  
  const createTurnDecays = ({name}) => {
    let countryRef = getRef(name)
    countryRef.mat = countryRef.mat - (countryRef.medborgare * 2) - (countryRef.soldater * 5)
    countryRef.guld = Math.round(countryRef.guld + (countryRef.medborgare / 1000))
    if (countryRef.mat < 0) {
      countryRef.mat = 0
      countryRef.medborgare = Math.round(countryRef.medborgare - (countryRef.medborgare * 0.05))
      countryRef.soldater = Math.round(countryRef.soldater - (countryRef.soldater * 0.01))
    }
    if (countryRef.medborgare < 1000) {
      countryRef.guld = Math.round(countryRef.guld - (countryRef.guld * 0.01))
    }
    if (countryRef.religion == 'Islam')
    {
      countryRef.guld = Math.round(countryRef.guld + 50)
    }
    if (countryRef.religion == 'Katolicism')
    {
      countryRef.guld = Math.round(countryRef.guld + 5)
      countryRef.soldater = Math.round(countryRef.soldater + 50)
    }
    if (countryRef.religion == 'Protestantism')
    {
      countryRef.guld = Math.round(countryRef.guld + 20)
      countryRef.handelsmän = Math.round(countryRef.handelsmän + 1)
    }
    if(countryRef.kolonier == 1 ){
      countryRef.guld = Math.round(countryRef.guld + 100)
      countryRef.mat = Math.round (countryRef.mat - 1000)
      countryRef.alkohol = Math.round(countryRef.alkohol + 5)
      countryRef.textil = Math.round(countryRef.textil + 5)
    }
    if(countryRef.kolonier == 2 ){
      countryRef.guld = Math.round(countryRef.guld + 200)
      countryRef.mat = Math.round (countryRef.mat - 2000 )
      countryRef.alkohol = Math.round(countryRef.alkohol + 10)
      countryRef.textil = Math.round(countryRef.textil + 10)
    }
    if(countryRef.kolonier == 3 ){
      countryRef.guld = Math.round(countryRef.guld + 300)
      countryRef.mat = Math.round (countryRef.mat - 3000)
      countryRef.alkohol = Math.round(countryRef.alkohol + 15)
      countryRef.textil = Math.round(countryRef.textil + 15)
    }
  }
  
  const selector = (id) => document.querySelector(`#${id}`)
  
  const addEventListener = (id, trigger, fn) => selector(id) && selector(id).addEventListener(trigger, fn)
  const removeEventListener = (id, trigger, fn) => selector(id) && selector(id).removeEventListener(trigger, fn)
  
  const updateValueOfProperty = (id, value) => selector(id) && (selector(id).innerHTML = value)
  
  const updateAllCountryKeys = ({name}) => {
    let countryRef = getRef(name)
    Object.keys(countryRef).forEach(key => {
      const value = countryRef[key]
      key !== name && updateValueOfProperty(`${name}-${key.toUpperCase()}`, value.toString())
    })
  }
  
  const showGameState = () => gameState.forEach(updateAllCountryKeys)
  
  const handleNextRound = () => {
    gameState.forEach(createTurnDecays)
    showGameState()
  }
  
  addEventListener('nästaRunda', 'click', handleNextRound)
  
  const handleEdit = (country) => () => {
    currentlyEditing = country
    selector('jsonField').value = JSON.stringify(getRef(country), null, 2)
  }
  
  const saveCurrentlyEditting = (country) => {
    try {
      const json = selector('jsonField').value.split(' ').join('')
      const parsed = JSON.parse(json)
      Object.assign(getRef(country), parsed)
      showGameState()
    } catch (error) {
      alert('invalid JSON pls call 911')
      console.log(error)
    }
  }
  
  addEventListener('closeModalBtn', 'click', () => {
    saveCurrentlyEditting(currentlyEditing)
  })
  
  addEventListener('spanien-modal', 'click', handleEdit('SPANIEN'))
  addEventListener('osmanska-modal', 'click', handleEdit('OSMANSKA-RIKET'))
  addEventListener('nederlanderna-modal', 'click', handleEdit('NEDERLÄNDERNA'))
  addEventListener('frankrike-modal', 'click', handleEdit('FRANKRIKE'))
  addEventListener('england-modal', 'click', handleEdit('ENGLAND'))
  
  const init = () => {
    showGameState()
  }
  
  init()