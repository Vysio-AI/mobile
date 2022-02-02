// Module for interacting with the videos API provided by api.vysio.ca
import { getRequest, postRequest } from './http';

const getVideo = (videoId) => {
  return getRequest(`/videos/${videoId}`)
}

export {
  getVideo
}
