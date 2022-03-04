import { apiGetImage } from '../api-osc/osc'

export const takePicture = async () => {
    return await apiGetImage();
}