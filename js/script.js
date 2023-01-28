const linkApi = 'http://api.weatherapi.com/v1/current.json?key=4d606910362a4dc1915212744232601'

const root = document.getElementById("root");
const popup = document.getElementById("popup");
const textInput = document.getElementById("text-input");
const form = document.getElementById("form");


let store =  {
    city : 'Kiev',
    feelslike : 0,
    localtime: '',
    is_day : 0,
    properties:{
        humidity: 0,
        pressure : 0,
        uv :0,
        wind : 0,
        cloud : 0,
        visibility: 0,
    }

}

const fetchLink = async() => {
    try {
        const getData = localStorage.getItem('town') || store.city
        const fetching = await fetch(`${linkApi}&q=${getData}`)
        const response = await fetching.json()
        const { current: {feelslike_c , cloud, humidity, pressure_mb, uv, is_day, wind_kph,vis_km, condition : {text : description,icon}},location :{localtime,name}} = response
        store = {
            city:name,
            feelslike : feelslike_c,
            icon:icon,
            description: description,
            localtime: localtime,
            is_day : is_day,
            properties:{
                visibility:{
                    title: 'visibility',
                    value: `${vis_km} km`,
                    icon: 'visibility.png',
                },
                cloud : {
                    title: 'cloud',
                    value:cloud,
                    icon: 'cloud.png',
                },
                humidity:{
                    title: 'humidity',
                    value: `${humidity} %`,
                    icon: 'humidity.png',
                },
                pressure :{
                    title: 'pressure',
                    value: `${pressure_mb} hPa`,
                    icon: 'gauge.png',
                }, 
                
                uv :{
                    title: 'uv',
                    value: uv,
                    icon: 'uv-index.png',
                },
                wind : {
                    title: 'wind',
                    value: `${wind_kph} km/h`,
                    icon: 'wind.png',
                },
            }

        }
        renderWeather()
    } catch (error) {
        console.log(error)
    }
}

const renderDetails = (properties) => {
    return Object.values(properties).map(({title, value, icon}) =>{
        return `
        <div class='property'>
            <div class='property-icon'>
                <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
                <div class="property-info__value">${value}</div>
                <div class="property-info__description">${title}</div>
            </div>
        </div>` 
    }).join('') 
}

const renderCard = () => {
    
    const {city,localtime,description,icon,is_day,feelslike,properties } = store
    
    const containerClass = is_day === 1 ? 'is-day' : '';

    return `
    <div class="container ${containerClass}">
        <div class="top">
            <div class="city">
                <div class="city-subtitle">Weather Today</div>
                <div class="city-title" id="city"><span>${city}</span></div>      
            </div>
            <div class="city-info">
                <div class="top-left">
                    <img src="https:${icon}" alt="img">
                    <div class="description">${description}</div>
                </div>
                <div class="top-right">
                    <div class="city-info__subtitle">${localtime}</div>
                    <div class="city-info__title">${Math.round(feelslike)}°</div>
                </div>
            </div>
        </div>
        <div id="properties">${renderDetails(properties)}</div>
    </div>` 
}

const renderWeather = () => {
    root.innerHTML = renderCard()
    const city = document.getElementById("city");
    const close = document.getElementById("close");
    city.addEventListener('click', activePopup)
    close.addEventListener('click', hiddenPopup )
}

const activePopup = () =>{
    popup.classList.add('active')
}
const hiddenPopup = () =>{
    popup.classList.remove('active')
}
const handleInput = (e) =>{
    store = {
        city: e.target.value ,
    }
}

const handleSubmit = (e) => {
    e.preventDefault();
    const currentCity = store.city
    if(!store.city) return;
    localStorage.setItem('town', currentCity)
    fetchLink()
    hiddenPopup()
}

form.addEventListener('submit',handleSubmit)
textInput.addEventListener('input',handleInput)

fetchLink()


    
    
