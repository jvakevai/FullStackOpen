import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}
   
const addNew = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

 const delPerson = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)

}
const update = (id, updatePerson) => {
    const request = axios.put(`${baseUrl}/${id}`, updatePerson)
    return request.then(response => response.data)
}

export default({getAll, addNew, delPerson, update})