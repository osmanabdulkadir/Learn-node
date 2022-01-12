function autocomplete(input, latInput, lngInput) {
    if(!input) return; // skip this fn fron running if there  is no input.

    const dropdown = new google.mapsplaces.Autocomplete(input);

    dropdown.addListener('place_changed', () => {
        const place = dropdown.getPlace();
        latInput.value = place.geometry.location.lat();
        lngInput.value = place.geometry.location.lng();
    });
}

export default autocomplete