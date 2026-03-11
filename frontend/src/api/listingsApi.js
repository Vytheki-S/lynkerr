// Listings API calls
import api from './axiosInstance'

export const getListings = (page = 1, search = '') =>
  api.get(`/listings/?page=${page}&search=${search}`)

export const getListing = (id) => api.get(`/listings/${id}/`)

export const createListing = (data) => api.post('/listings/', data)

export const updateListing = (id, data) => api.put(`/listings/${id}/`, data)

export const deleteListing = (id) => api.delete(`/listings/${id}/`)
