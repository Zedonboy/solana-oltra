import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";

export default function Read() {
  let params = useParams();
  let [content, setContent] = useState(null)
  useEffect(() => {
    let id = params.id
    let task = async () => {
        let resp = await fetch(`${API_URL}/books/read/${id}`)
        if(resp.ok) {
            let data = await resp.json()
            let content = data.pages[0].content
            setContent(content)
        }
    }

    task()
  }, [])
  return (
    <div className="p-6 flex justify-center">
      <article className="sm:prose-sm md:prose lg:prose-lg" dangerouslySetInnerHTML={{__html: content}}>
      </article>
    </div>
  );
}
