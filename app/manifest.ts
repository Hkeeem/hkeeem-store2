import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
 return { name:'عروضكم', short_name:'عروضكم', start_url:'/', display:'standalone', background_color:'#FFFCF6', theme_color:'#7A5A16', icons:[] }
}
