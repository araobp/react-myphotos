// https://nominatim.org/
const baseURL = 'https://nominatim.openstreetmap.org';

const headers = {
     'Accept': 'application/json',
     'Accept-Language': 'ja'
};

export const apiGetAddressByLocation = async (latitude: number, longitude: number) => {
    try {
        const res = await fetch(`${baseURL}/reverse?lat=${latitude}&lon=${longitude}&format=json`, { method: "GET", headers: headers });
        if (res.status == 200) {
            const reversegeocode = await res.json();
            const displayName: string = reversegeocode.display_name;
            const a = displayName.split(',').map(a => a.trim()).reverse();
            const address = a.slice(2, a.length).join(' ');
            return address;
        } else {
            throw new Error('GET records failed');
        }
    } catch (e) {
        throw new Error('get address failed');
    }
}