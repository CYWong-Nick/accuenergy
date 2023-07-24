declare global {
    interface Window {
        googleMapApiResolve: (value: any) => any
    }
}

const googleMapApiLoader = new Promise(resolve => {
    window.googleMapApiResolve = resolve
    const scriptElement = document.createElement('script')
    scriptElement.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOOLE_MAP_API_KEY}&callback=googleMapApiResolve`)
    document.head.appendChild(scriptElement)
})

export default googleMapApiLoader