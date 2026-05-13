const TESTIM_KEY = 'ekg_testimonials_v1'
const NEWS_KEY = 'ekg_news_v1'

export function getTestimonials(){
  try{ return JSON.parse(localStorage.getItem(TESTIM_KEY)) || null }catch(e){ return null }
}
export function saveTestimonials(list){
  localStorage.setItem(TESTIM_KEY, JSON.stringify(list))
}

export function getNews(){
  try{ return JSON.parse(localStorage.getItem(NEWS_KEY)) || null }catch(e){ return null }
}
export function saveNews(list){
  localStorage.setItem(NEWS_KEY, JSON.stringify(list))
}
