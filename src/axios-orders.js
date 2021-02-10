import axios from 'axios';

axios.create({
  baseURL: 'https://react-my-burger-14e2b-default-rtdb.firebaseio.com/'
})

export default instance;