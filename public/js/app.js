const form = document.querySelector('form')
const input = document.querySelector('input')
const messageOne = document.querySelector('#message-one')
const messageTwo = document.querySelector('#message-two')
const image = document.querySelector('#image')
const icon = document.querySelector('#icon')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    icon.style.display = 'none'
    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''
    image.setAttribute('src', '')

    const location = input.value

    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
                messageTwo.textContent = ''
            } else {
                messageOne.textContent = data.location + '.'
                messageTwo.textContent = `${data.forecastData.summary}. It is currently ${data.forecastData.temperature} degrees Celsius.`
                image.setAttribute('src', data.imgURL)
                icon.style.display = 'block'
                setIcons(data.forecastData.icon, 'icon')
            }
        })
    })
})

const setIcons = (icon, iconID) => {
    const skycons = new Skycons({ color: 'grey' });
    const currentIcon = icon.replace(/-/g, '_').toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
}
