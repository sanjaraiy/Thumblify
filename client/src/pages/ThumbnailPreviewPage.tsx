import { useSearchParams } from "react-router-dom"
import { yt_html } from "../assets/assets"

const ThumbnailPreviewPage = () => {
     
    const [searchParams] = useSearchParams();
    
    const thumbnail_url = searchParams.get('thumbnail_url')
    const title = searchParams.get('title');

    const new_html = yt_html.replace("%%THUMBNAIL_URL%%", thumbnail_url!).replace("%%TITLE%%", title!);
    
    return (
    <div>ThumbnailPreviewPage</div>
  )
}

export default ThumbnailPreviewPage